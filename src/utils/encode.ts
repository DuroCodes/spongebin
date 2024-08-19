import { tryCatch } from "./result";

const processStream = async (
  str: string,
  format: CompressionFormat,
  StreamConstructor: typeof CompressionStream | typeof DecompressionStream,
  encode = true,
) => {
  const input = encode
    ? new TextEncoder().encode(str)
    : Uint8Array.from(atob(str.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
        c.charCodeAt(0),
      );

  const stream = new StreamConstructor(format);
  const writer = stream.writable.getWriter();

  writer.write(input);
  writer.close();

  const buffer = await new Response(stream.readable).arrayBuffer();
  const base64 = encode
    ? btoa(String.fromCharCode(...new Uint8Array(buffer)))
    : new TextDecoder().decode(buffer);

  return encode
    ? base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    : base64;
};

export const encode = (str: string, format: CompressionFormat = "gzip") =>
  tryCatch(() => processStream(str, format, CompressionStream, true));

export const decode = (str: string, format: CompressionFormat = "gzip") =>
  tryCatch(() => processStream(str, format, DecompressionStream, false));

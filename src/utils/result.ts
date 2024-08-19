export type Result<Ok, Err> =
  | { ok: true; value: Ok }
  | { ok: false; error: Err };
export const Ok = <Ok>(value: Ok) => ({ ok: true, value } as const);
export const Err = <Err>(error: Err) => ({ ok: false, error } as const);

export const tryCatch = <T>(fn: () => T): Result<T, unknown> => {
  try {
    return Ok(fn());
  } catch (error) {
    return Err(error);
  }
};

export const unwrapOr = <Ok, Err, T>(result: Result<Ok, Err>, fallback: T) =>
  result.ok ? result.value : fallback;

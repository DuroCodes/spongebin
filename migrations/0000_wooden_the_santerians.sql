CREATE TABLE "paste" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"language" text NOT NULL,
	"theme" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);

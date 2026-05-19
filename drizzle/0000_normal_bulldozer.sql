CREATE TABLE "leaderboard" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(64) NOT NULL,
	"time" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

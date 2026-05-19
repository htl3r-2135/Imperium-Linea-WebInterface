import { pgTable, serial, varchar, bigint, timestamp } from "drizzle-orm/pg-core";

export const leaderboard = pgTable("leaderboard", {
	id:        serial("id").primaryKey(),
	username:  varchar("username", { length: 64 }).notNull(),
	time:      bigint("time", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
}); 
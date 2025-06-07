import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema";

export const sessionsTable = pgTable("sessions", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => usersTable.id),
    code: varchar({ length: 255 }),
});
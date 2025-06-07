import { pgTable, uuid, integer, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema";

export const candidatesTable = pgTable("candidates", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => usersTable.id),// The id of the user that applied for the position
    position: varchar({ length: 255 }).notNull(),// position the candidate is applying for
    votes: integer('votes').notNull().default(0)// vote count for the candidate,
});
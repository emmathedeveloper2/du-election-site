import { pgTable, uuid } from "drizzle-orm/pg-core";
import { candidatesTable } from "./candidate.schema";
import { usersTable } from "./user.schema";

export const votesTable = pgTable("votes", {
    id: uuid().primaryKey().defaultRandom(),
    candidateId: uuid('candidate_id').notNull().references(() => candidatesTable.id), // The id of the candidate that was voted for
    userId: uuid('user_id').notNull().references(() => usersTable.id)// The id of the user that voted,
});
import {sessionsTable, usersTable, candidatesTable} from "~/database/schemas";
import db from "~/database";
import {count, eq} from "drizzle-orm";
import {getCurrentSession} from "~/.server/db-bridge/session.bridge";
import {generateError} from "~/lib/helpers";
import ERROR from "~/lib/errors";
import {excludePasswordSchema} from "~/database/schemas/user.schema";
import { SUPER_ADMIN } from "../config/env.config";

export const getUserByEmail = async (email: string) => {

    return (await db.select(excludePasswordSchema).from(usersTable).where(eq(usersTable.email, email)) as any as Array<typeof usersTable.$inferSelect>)[0]
}

export const getUserById = async (id: string) => {

    try {
        const users = await db.select(excludePasswordSchema).from(usersTable).where(eq(usersTable.id, id)) as any as Array<typeof usersTable.$inferSelect>

        if (!users[0]) throw generateError(ERROR.USER_NOT_FOUND, 404)

        return users[0]
    } catch (e) {
        throw e
    }
}

export const getCurrentUser = async (headers: Headers) => {

    try {
        const session = await getCurrentSession(headers)

        return await getUserById(session.userId)
    } catch (e) {
        throw e
    }
}

export const seedUsers = async (data: Array<typeof usersTable.$inferInsert>) => {

    try{

        //Check if data is present
        if (!data) throw generateError(ERROR.SEEDING_DATA_NOT_FOUND, 400)
    
        //Insert users into the database
        const users = await db.insert(usersTable).values(data).returning()
    
        //Check if any users were inserted
        if (users.length === 0) throw generateError(ERROR.SEEDING_DATA_FAILED, 400)
    
        for(const user of users){
            await db.insert(sessionsTable).values({ userId: user.id , code: null })
        }
    
        return users
    }catch (e) {
        throw e
    }
}

export const getUsers = async (page = 1, pageSize = 10 , options?: { query: string , filter: 'admin' | 'candidate' }) => {
    const offset = (page - 1) * pageSize;
    
    let users;

    let totalCount;

    if(options?.filter == 'admin') {

        // Get total count
        totalCount = (await db
        .select({count: count()})
        .from(usersTable)
        .where(eq(usersTable.admin, true)))[0].count;

        // Get paginated rows for admins
        
        users = await db
            .select(excludePasswordSchema)
            .from(usersTable)
            .where(eq(usersTable.admin, true))
            .limit(pageSize)
            .offset(offset);

        console.log(totalCount)

    } else if (options?.filter == 'candidate') {

        // Get total count
        totalCount = (await db
            .select({count: count()})
            .from(usersTable)
            .where(eq(usersTable.candidate, true)))[0].count;

        // Get paginated rows for candidates
        users = await db
            .select(excludePasswordSchema)
            .from(usersTable)
            .where(eq(usersTable.candidate, true))
            .limit(pageSize)
            .offset(offset);
    } else {

        // Get total count
        totalCount = (await db
            .select({count: count()})
            .from(usersTable))[0].count;

        // Get paginated rows for all users
        users = await db
            .select(excludePasswordSchema)
            .from(usersTable)
            .limit(pageSize)
            .offset(offset);
    }

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        users,
        page,
        pageSize,
        total: totalCount,
        totalPages,
    };
}

export const updateUser = async (id: string, data: Partial<typeof usersTable.$inferInsert>) => {
    try {

        const [ updatedUser ] = await db.update(usersTable).set(data).where(eq(usersTable.id, id)).returning()

        if (!updatedUser) throw generateError(ERROR.USER_NOT_FOUND, 404)

        return updatedUser
    } catch (e) {
        throw e
    }
}

export const isSuperAdmin = (user: Partial<typeof usersTable.$inferSelect>) => {
    return user.matricNumber == SUPER_ADMIN
}

export const getCandidateByUserId = async (userId: string) => {
    try {
        // Fetch candidate row by userId from the candidates table
        const [ candidate ] = await db
            .select()
            .from(candidatesTable)
            .where(eq(candidatesTable.userId, userId))
            .limit(1)

        return candidate
    } catch (e) {
        throw e
    }
}

export const updateCandidatePosition = async (userId: string, position: string) => {
    try {
        // Check if candidate already exists
        const [existingCandidate] = await db
            .select()
            .from(candidatesTable)
            .where(eq(candidatesTable.userId, userId))
            .limit(1)

        let candidateRow

        if (existingCandidate) {
            // Update the candidate's position in the candidates table
            const updated = await db
                .update(candidatesTable)
                .set({ position })
                .where(eq(candidatesTable.userId, userId))
                .returning()

            if (!updated || updated.length === 0) {
                throw new Error("Candidate not found")
            }

            candidateRow = updated[0]
        } else {
            // Create a new candidate row
            const inserted = await db
                .insert(candidatesTable)
                .values({ userId, position })
                .returning()

            if (!inserted || inserted.length === 0) {
                throw new Error("Failed to create candidate")
            }
            
            candidateRow = inserted[0]
        }

        // Also update the user to set candidate: true
        await db
            .update(usersTable)
            .set({ candidate: true })
            .where(eq(usersTable.id, userId))

        return candidateRow
    } catch (e) {
        throw e
    }
}

export const removeCandidateByUserId = async (userId: string) => {
    try {
        // Delete candidate row from candidates table
        const deleted = await db
            .delete(candidatesTable)
            .where(eq(candidatesTable.userId, userId))
            .returning();

        // Update user to set candidate: false
        await db
            .update(usersTable)
            .set({ candidate: false })
            .where(eq(usersTable.id, userId));

        return deleted[0];
    } catch (e) {
        throw e;
    }
}
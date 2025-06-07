import {sessionsTable, usersTable} from "~/database/schemas";
import db from "~/database";
import {count, eq} from "drizzle-orm";
import {getCurrentSession} from "~/.server/db-bridge/session.bridge";
import {generateError} from "~/lib/helpers";
import ERROR from "~/lib/errors";
import {excludePasswordSchema} from "~/database/schemas/user.schema";

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

export const getUsers = async (page = 1, pageSize = 10) => {
    const offset = (page - 1) * pageSize;

    // Get total count
    const [{ count: totalCount }] = await db
        .select({count: count()})
        .from(usersTable);

    // Get paginated rows
    const users = await db
        .select()
        .from(usersTable)
        .limit(pageSize)
        .offset(offset);

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
import {sessionsTable, usersTable} from "~/database/schemas";
import db from "~/database";
import {eq} from "drizzle-orm";
import {sendVerificationCodeEmail} from "~/.server/config/email.config";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "~/.server/config/env.config";
import {generateError} from "~/lib/helpers";
import {generateSessionToken, getCurrentSession} from "~/.server/db-bridge/session.bridge";
import {excludePasswordSchema} from "~/database/schemas/user.schema";
import ERROR from "~/lib/errors";
import bcrypt from "bcryptjs";

export const verifyUser = async (headers: Headers , code: string , password: string) => {

    //If the code is not provided, throw an error
    if(!code) throw generateError(ERROR.CODE_NOT_PROVIDED , 400)

    //If the code is not provided, throw an error
    if(!password) throw generateError(ERROR.PASSWORD_NOT_PROVIDED , 400)

    const { userId , code: storedCode } = await getCurrentSession(headers)

    /**
     * @type {any}
     */
    const payload = jwt.verify(storedCode! , JWT_SECRET!) as { code: string }

    //If the code is not valid, throw an error
    if(code !== payload.code) throw generateError(ERROR.INVALID_CODE , 400)

    //Hash Password
    const hashedPassword = await bcrypt.hash(password , 10);

    //Update the verification status of the current user
    await db.update(usersTable).set({ verified: true , password: hashedPassword }).where(eq(usersTable.id , userId)).returning(excludePasswordSchema)

    //Updates the associated session
    const [ session ] = await db.update(sessionsTable).set({ code: null }).where(eq(sessionsTable.userId , userId)).returning()

    return session
}

export const requestCode = async (email: string , matricNumber: string) => {

    //If the email is not provided, throw an error
    if(!email) throw generateError(ERROR.EMAIL_NOT_PROVIDED , 404)

    //If the matric is not provided, throw an error
    if(!matricNumber) throw generateError(ERROR.MATRIC_NUMBER_NOT_PROVIDED , 404)

    //Get the user with the given matric number
    const [ user ] = await db.select(excludePasswordSchema).from(usersTable).where(eq(usersTable.matricNumber , matricNumber))

    if(!user) throw generateError(ERROR.USER_NOT_FOUND, 404)

    if(user.email !== email) throw generateError(ERROR.INCORRECT_EMAIL , 404)

    //If the user is already verified, throw an error
    if(user.verified) throw generateError(ERROR.USER_ALREADY_VERIFIED , 400)

    //Generate a code for the user
    const { signedCode , unsignedCode: code } = generateSessionToken()

    let session: typeof sessionsTable.$inferSelect;

    //Get the session for the user
    const sessions = await db.select().from(sessionsTable).where(eq(sessionsTable.userId , user.id))

    session = sessions[0]

    //If the session is not found, create a new session for the user
    const newSessions = (session ?
        await db.update(sessionsTable).set({ code: signedCode }).where(eq(sessionsTable.userId , user.id)).returning() :
        await db.insert(sessionsTable).values({ userId: user.id, code: signedCode })) as any as Array<typeof sessionsTable.$inferSelect>

    session = newSessions[0]

    //Send the verification code to the user's email
    await sendVerificationCodeEmail(user.email , code)

    return session
}

export const signIn = async (matricNumber: string , password: string) => {
    //get the associated user from matric
    const [ user ] = await db.select().from(usersTable).where(eq(usersTable.matricNumber , matricNumber))

    if(!user) throw generateError(ERROR.USER_NOT_FOUND , 404);

    //validate password
    const passwordIsCorrect = await bcrypt.compare(password , user.password!)

    if(!passwordIsCorrect) throw generateError(ERROR.INCORRECT_PASSWORD , 400)

    //Get the associated session
    const [ session ] = await db.select().from(sessionsTable).where(eq(sessionsTable.userId , user.id))

    return session
}
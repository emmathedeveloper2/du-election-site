import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_SECRET} from "~/.server/config/env.config";
import db from "~/database";
import {sessionsTable} from "~/database/schemas";
import {authCookie} from "~/.server/config/cookies.config";
import {generateError} from "~/lib/helpers";
import ERROR from "~/lib/errors";

export const generateSessionToken = () => {
    let code = ""

    for(let i = 0; i < 6; i++){
        code += Math.floor(Math.random() * 9).toString()
    }

    const signedCode = jwt.sign({ code } , JWT_SECRET as any , { expiresIn: JWT_EXPIRES_IN as any })

    return {
        signedCode,
        unsignedCode: code
    }
}

export const createSession = async (userId: string, code: string | null) => {

    let data = {
        userId,
        code
    }

    return (await db.insert(sessionsTable).values(data).returning() as any as Array<typeof sessionsTable.$inferSelect>)[0]
}


export const getCurrentSession = async (headers: Headers) => {
    try {
        const cookie = headers.get("Cookie")

        if(!cookie) throw generateError(ERROR.SESSION_NOT_FOUND , 404)

        return (await authCookie.parse(cookie)) as typeof sessionsTable.$inferSelect
    }catch (e) {
        throw e
    }
}
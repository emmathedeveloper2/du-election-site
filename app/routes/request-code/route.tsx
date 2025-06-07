import { redirect } from "react-router";
import {safeTry} from "~/lib/helpers";
import {authCookie} from "~/.server/config/cookies.config";
import { Route } from "./+types/route";
import {getCurrentSession} from "~/.server/db-bridge/session.bridge";
import {getCurrentUser} from "~/.server/db-bridge/user.bridge";
import { requestCode } from "~/.server/db-bridge/auth.bridge";

export const loader = async ({ request } : Route.LoaderArgs) => {

    const [ sessionSuccess , session ] = await safeTry(getCurrentSession(request.headers))

    const [ userSuccess , user ] = await safeTry(getCurrentUser(request.headers))

    if(!userSuccess || !sessionSuccess || !session || !user) return redirect('/signup' , {
        headers: {
            'Set-Cookie': await authCookie.serialize('' , { maxAge: 1 })
        }
    })

    const [ success , updatedSession ] = await safeTry(requestCode(user.email , user.matricNumber))

    if(!success) return redirect('/error')

    return redirect('/enter-code' , {
        headers: { 'Set-Cookie': await authCookie.serialize(updatedSession)}
    })
}
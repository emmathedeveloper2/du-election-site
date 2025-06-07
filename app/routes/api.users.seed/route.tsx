import {Route} from "./+types/route";
import {safeTry} from "~/lib/helpers";
import {seedUsers} from "~/.server/db-bridge/user.bridge";
import ERROR from "~/lib/errors";


export async function action({ request } : Route.ActionArgs){

    const data = await request.json()

    if(!data) return new Response(JSON.stringify({
        success: false,
        message: ERROR.SEEDING_DATA_NOT_FOUND
    }) , { status: 404 })

    const [ success , users , message ] = await safeTry(seedUsers(data))

    console.log(message)

    if(!success) return new Response(JSON.stringify({
        success: false,
        message: ERROR.SEEDING_DATA_FAILED + ": " + message
    }) , { status: 400 })

    return new Response(JSON.stringify({
        success: true,
        message: "Users Seeded successfully",
        data: { users }
    } ), { status: 200 })
}
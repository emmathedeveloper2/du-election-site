import { safeTry } from "~/lib/helpers";
import { Route } from "./+types/route";
import { getCurrentUser, updateUser } from "~/.server/db-bridge/user.bridge";


export async function action({ request , params } : Route.LoaderArgs){

    const [ success , user , message ] = await safeTry(getCurrentUser(request.headers));

    if(!success || !user) return {
        status: 401,
        error: message || "Unauthorized"
    };

    if(!user.admin) return {
        status: 403,
        error: "You are not authorized to perform this action"
    };

    const data = Object.fromEntries(await request.formData()) as any;

    const [ updatedSuccess , updated , msg ] = await safeTry(updateUser(params.id , data));
    

    if(!updatedSuccess || !updated) return {
        status: 400,
        error: msg || "Failed to update user"
    };

    return {
        success: true,
        message: "User updated successfully",
        data: { user }
    }
}
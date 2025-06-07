import {ReactNode} from "react";
import {Outlet, redirect} from "react-router";
import Header from "~/components/header/header";
import {safeTry} from "~/lib/helpers";
import {getCurrentUser} from "~/.server/db-bridge/user.bridge";
import {Route} from "../../../.react-router/types/app/routes/dashboard/+types/route";


export async function loader({ request } : Route.LoaderArgs){

    const [success , user] = await safeTry(getCurrentUser(request.headers))

    if(!success) return redirect('/dashboard')

    if(!user.admin) return redirect('/dashboard')

    return {
        user
    }
}

export default function DashboardLayout({ loaderData } : Route.ComponentProps){

    const { user } = loaderData

    return (
        <>
            <Header user={user}/>
            <Outlet />
        </>
    )
}
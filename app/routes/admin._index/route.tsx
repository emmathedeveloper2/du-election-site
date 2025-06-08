import { parseOptionsFromURL, safeTry } from "~/lib/helpers";
import { getCurrentUser, getUsers, isSuperAdmin } from "~/.server/db-bridge/user.bridge";
import UsersTable from "~/components/users-table/users-table";
import AdminPagination from "~/components/admin-pagination"
import { Route } from "../../../.react-router/types/app/routes/admin._index/+types/route";
import { redirect } from "react-router";
import UsersFilter from "~/components/users-filter";

export async function loader({ request }: Route.LoaderArgs) {

    const [ success , user ] = await safeTry(getCurrentUser(request.headers))

    if(!success || !user) return redirect('/dashboard')

    const url = new URL(request.url)

    const { page , query , filter } = parseOptionsFromURL(url.searchParams)

    const [dataSuccess, data] = await safeTry(getUsers(Number(page) , 10 , { query , filter: filter as any }))

    if (!dataSuccess) return {}

    return { data , isSuperAdmin: isSuperAdmin(user) }
}

export default function AdminPage({ loaderData }: Route.ComponentProps) {

    const { data , isSuperAdmin } = loaderData

    return (
        <div className={"size-full p-2 flex flex-col items-center"}>
            <div className={"max-width-wrapper"}>
                <h1 className={"text-xl md:text-5xl lg:text-7xl font-black mt-2"}>Admin Dashboard</h1>
                <div className="w-full flex flex-col lg:flex-row justify-between lg:items-center my-4 gap-4">
                    <UsersFilter />
                    {data && <AdminPagination page={data.page} totalPages={data.totalPages} />}
                </div>
                {data && <UsersTable users={data.users} isSuperAdmin={isSuperAdmin}/>}
            </div>
        </div>
    )
}
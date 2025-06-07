import { safeTry } from "~/lib/helpers";
import { getCurrentUser, getUsers } from "~/.server/db-bridge/user.bridge";
import UsersTable from "~/components/users-table/users-table";
import AdminPagination from "~/components/admin-pagination"
import { Route } from "../../../.react-router/types/app/routes/admin._index/+types/route";

export async function loader({ request }: Route.LoaderArgs) {

    const url = new URL(request.url)

    const page = url.searchParams.get('page') ?? '1'

    const [dataSuccess, data] = await safeTry(getUsers(Number(page)))

    if (!dataSuccess) return {}

    return { data }
}

export default function AdminPage({ loaderData }: Route.ComponentProps) {

    const { data } = loaderData

    return (
        <div className={"size-full p-2 flex flex-col items-center"}>
            <div className={"max-width-wrapper"}>
                <h1 className={"text-xl md:text-5xl lg:text-7xl font-black mt-2"}>Admin Dashboard</h1>
                {data && <UsersTable users={data.users} />}
                {data && <AdminPagination page={data.page} totalPages={data.totalPages} />}
            </div>
        </div>
    )
}
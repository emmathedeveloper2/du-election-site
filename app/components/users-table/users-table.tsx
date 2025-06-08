import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import {usersTable} from "~/database/schemas";
import UserTableOptions from "./user-table-options";
import { toTitleCase } from "~/lib/helpers";

type UsersTableProps = {
    users: Array<Omit<typeof usersTable.$inferSelect , "password">>;
    isSuperAdmin: boolean;
}

const UsersTable = ({ users , isSuperAdmin } : UsersTableProps) => {

    return (
        <Table className={"mt-5 md:mt-10"}>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Matric NO.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Programme</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead className={'w-[50px]'}></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map(user => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.matricNumber}</TableCell>
                        <TableCell>{user.fullname}</TableCell>
                        <TableCell>{toTitleCase(user.programme)}</TableCell>
                        <TableCell>{user.level}</TableCell>
                        <TableCell>
                            <UserTableOptions user={user} isSuperAdmin={isSuperAdmin}/>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default UsersTable
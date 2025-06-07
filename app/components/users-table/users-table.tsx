import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import {usersTable} from "~/database/schemas";
import {Button} from "~/components/ui/button";
import {EllipsisIcon} from "lucide-react";
import UserTableOptions from "./user-table-options";

type UsersTableProps = {
    users: Array<Omit<typeof usersTable.$inferSelect , "password">>
}

const UsersTable = ({ users } : UsersTableProps) => {

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
                        <TableCell>{user.programme}</TableCell>
                        <TableCell>{user.level}</TableCell>
                        <TableCell>
                            <UserTableOptions user={user} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default UsersTable
import { usersTable } from "~/database/schemas";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { EllipsisIcon, UserIcon, UserPenIcon, UserPlusIcon } from "lucide-react";
import EditUserDialog from "../edit-user-dialog";
import ConfirmMakeAdminDialog from "../confirm-make-admin-dialog";

interface UserTableOptionsProps {
    user: Omit<typeof usersTable.$inferSelect, "password">;
}

const UserTableOptions = ({ user }: UserTableOptionsProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
                <DropdownMenuLabel>{user.matricNumber}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex justify-between">
                    View Profile
                    <UserIcon />
                </DropdownMenuItem>
                <EditUserDialog user={user} />
                <DropdownMenuSeparator />
                <ConfirmMakeAdminDialog user={user} />
                <DropdownMenuItem className="flex justify-between">
                    Make Candidate
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserTableOptions;
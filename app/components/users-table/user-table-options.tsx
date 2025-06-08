import { usersTable } from "~/database/schemas";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { EllipsisIcon, UserIcon } from "lucide-react";
import EditUserDialog from "../edit-user-dialog";
import ConfirmChangeAdminStatusDialog from "../confirm-change-admin-status-dialog";
import SelectPositionList from "../select-position-list";
import RemoveCandidateDialog from "../remove-candidate-dialog";

interface UserTableOptionsProps {
    user: Omit<typeof usersTable.$inferSelect, "password">;
    isSuperAdmin: boolean;
}

const UserTableOptions = ({ user, isSuperAdmin }: UserTableOptionsProps) => {
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
                {
                    isSuperAdmin &&
                    <ConfirmChangeAdminStatusDialog user={user} operation={user.admin ? 'remove' : 'add'} />
                }
                <SelectPositionList user={user} />
                {
                    user.candidate &&
                    <RemoveCandidateDialog user={user} />
                }
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserTableOptions;
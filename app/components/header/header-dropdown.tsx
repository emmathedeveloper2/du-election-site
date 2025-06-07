import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "../ui/dropdown-menu"
import {Avatar, AvatarFallback} from "~/components/ui/avatar";
import {usersTable} from "~/database/schemas";
import {getInitials} from "~/lib/helpers";
import {LogOutIcon, UserCircleIcon, UserPenIcon} from "lucide-react";
import {Link} from "react-router";

type HeaderDropdown = {
    user: typeof usersTable.$inferSelect
}

const HeaderDropdown = ({user}: HeaderDropdown) => {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className={"cursor-pointer"}>
                <Avatar>
                    <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Profile
                        <DropdownMenuShortcut>
                            <UserCircleIcon/>
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {
                        user.admin &&
                        <Link to={'/admin'}>
                            <DropdownMenuItem>
                                Admin
                                <DropdownMenuShortcut>
                                    <UserPenIcon />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </Link>
                    }
                </DropdownMenuGroup>
                <Link to={'/logout'}>
                    <DropdownMenuItem>
                        Log out
                        <DropdownMenuShortcut>
                            <LogOutIcon/>
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default HeaderDropdown
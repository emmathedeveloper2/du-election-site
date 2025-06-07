import { Link } from "react-router";
import {Button} from "~/components/ui/button";
import {ArrowRightIcon} from "lucide-react";
import {usersTable} from "~/database/schemas";
import HeaderDropdown from "./header-dropdown";

type HeaderProps = {
    user?: typeof usersTable.$inferSelect
}

const Header = ({ user } : HeaderProps) => {

    return (
        <header className={"w-full flex items-center justify-center p-4"}>
            <div className={"max-width-wrapper flex items-center justify-between"}>
                <Link to={'/'}>
                    <h1 className={"font-bold"}>NACOS DU</h1>
                </Link>

                <div>
                    3 DAYS TO ELECTION
                </div>

                <div className={"flex items-center"}>
                    {
                        user &&
                        <HeaderDropdown user={user}/>
                    }
                </div>
            </div>
        </header>
    )
}

export default Header
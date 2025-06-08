import { Link } from "react-router";
import {Button} from "~/components/ui/button";
import {ArrowRightIcon} from "lucide-react";
import {usersTable} from "~/database/schemas";
import HeaderDropdown from "./header-dropdown";
import useTimeCountDown from "~/hooks/use-election-time";
import { ELECTION_START } from "~/lib/constants";

type HeaderProps = {
    user?: typeof usersTable.$inferSelect
}

const Header = ({ user } : HeaderProps) => {

    const { days, hours, minutes, seconds } = useTimeCountDown(ELECTION_START)

    return (
        <header className={"w-full flex items-center justify-center p-4"}>
            <div className={"max-width-wrapper flex items-center justify-between"}>
                <Link to={'/'}>
                    <h1 className={"font-bold"}>NACOS DU</h1>
                </Link>

                <div className="flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-4 py-2 cursor-pointer group hover:bg-primary hover:text-primary-foreground transition-colors">
                    <h1 className="font-bold">{days}d {hours}h {minutes}m {seconds}s</h1>
                    <ArrowRightIcon className="size-[15px] group-hover:rotate-45 transition-transform"/>
                </div>

                <div className={"flex items-center"}>
                    {
                        user ?
                        <HeaderDropdown user={user}/>
                        :
                        <Button asChild>
                            <Link to={'/signin'} className={"flex items-center gap-2"}>
                                Sign In
                                <ArrowRightIcon />
                            </Link>
                        </Button>
                    }
                </div>
            </div>
        </header>
    )
}

export default Header
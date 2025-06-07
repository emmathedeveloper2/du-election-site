import { Link } from "react-router";
import {safeTry} from "~/lib/helpers";
import { Route } from "./+types/_index";
import { getCurrentUser } from "~/.server/db-bridge/user.bridge";
import {Button} from "~/components/ui/button";
import {ArrowRightIcon} from "lucide-react";
import Header from "~/components/header/header";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "NACOS DU" },
    { name: "description", content: "Welcome to NACOS DU" },
  ];
};

export async function loader({ request } : Route.LoaderArgs){

  const [success , user] = await safeTry(getCurrentUser(request.headers))

  if(!success) return {}

  return {
    user
  }
}

export default function Index({ loaderData } : Route.ComponentProps) {

  const { user } = loaderData

  return (
      <>
        <Header user={user} />
        <div className={"size-full flex flex-col items-center justify-center p-2"}>
            <div className={"max-width-wrapper flex flex-col gap-8 items-center"}>

              <h1 className={"text-xl md:text-5xl font-black"}>NACOS DU Election 2025</h1>

              <Button asChild className={'group w-full md:w-[300px]'}>
                <Link to={user ? '/dashboard' : '/signup'} className={"w-full text-center"}>
                  {user ? "GET TO VOTING" : "GET STARTED"}

                  <div className={'rotate-45 group-hover:rotate-0 transition-transform'}>
                    <ArrowRightIcon/>
                  </div>
                </Link>
              </Button>
            </div>
        </div>
      </>
  );
}

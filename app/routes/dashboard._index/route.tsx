import {safeTry} from "~/lib/helpers";
import {redirect} from "react-router";
import {authCookie} from "~/.server/config/cookies.config";
import {Link} from "react-router";
import {Route} from "./+types/route";
import {getCurrentUser} from "~/.server/db-bridge/user.bridge";
import {Button} from "~/components/ui/button";
import {Card, CardContent} from "~/components/ui/card";
import {ArrowRightIcon} from "lucide-react";
import {Avatar, AvatarFallback} from "~/components/ui/avatar";

export async function loader({request}: Route.LoaderArgs) {

    const [success, user] = await safeTry(getCurrentUser(request.headers))

    if (!success) return redirect('/signup', {
        headers: {
            'Set-Cookie': await authCookie.serialize('', {maxAge: 1})
        }
    })

    if (!user.verified) return redirect('/choose-verification-method')

    return {user}
}

export default function DashboardPage({loaderData}: Route.ComponentProps) {

    const {user} = loaderData

    return (
        <div className={"size-full p-2"}>
            <section className={"w-full flex items-center justify-center"}>
                <div className={"max-width-wrapper"}>

                    <h1 className={"mt-5 md:mt-10 font-bold"}>Welcome {user.fullname.split(' ')[0]}</h1>

                    <h1 className={"text-xl md:text-5xl lg:text-7xl font-black mt-2"}>This Year's Candidates</h1>

                    <div
                        className={'fixed bottom-0 left-0 gradient-cover flex flex-col items-center justify-end gap-4 w-full h-1/2 z-10 pb-10'}>

                        <h1 className={"text-xl md:text-5xl font-black"}>It's Different This Year. Get in on the Action!</h1>

                        <div className={'flex w-full md:w-[600px] gap-4'}>
                            <Button asChild className={'group flex-1'}>
                                <Link to={'/'}>
                                    Let's Vote

                                    <div className={'rotate-45 group-hover:rotate-0 transition-transform'}>
                                        <ArrowRightIcon/>
                                    </div>
                                </Link>
                            </Button>
                            <Button asChild variant={'secondary'} className={'group flex-1'}>
                                <Link to={'/'}>
                                    See Candidates

                                    <div className={'rotate-45 group-hover:rotate-0 transition-transform'}>
                                        <ArrowRightIcon/>
                                    </div>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className={'flex flex-col gap-4 mt-5 md:mt-10 lg:mt-20'}>
                    <h1 className={"text-lg md:text-3xl lg:text-5xl font-black flex items-center gap-4"}>
                            Running for President
                            <ArrowRightIcon />
                        </h1>

                        <div className={"w-full grid grid-cols-1 md:grid-cols-4 gap-4 mt-5 md:mt-10"}>
                            <ElectionCandidateCard />
                            <ElectionCandidateCard />
                        </div>
                    </div>
                    <div className={'flex flex-col gap-4 mt-20'}>
                        <h1 className={"text-lg md:text-3xl lg:text-5xl font-black flex items-center gap-4"}>
                            Running for Vice President
                            <ArrowRightIcon />
                        </h1>

                        <div className={"w-full grid grid-cols-1 md:grid-cols-4 gap-4 mt-10"}>
                            <ElectionCandidateCard />
                            <ElectionCandidateCard />
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}

const ElectionCandidateCard = () => {

    return (
        <div className={'border border-secondary p-4 flex flex-col items-center gap-4 rounded cursor-pointer hover:bg-primary hover:text-primary-foreground'}>
                <Avatar>
                    <AvatarFallback>
                        <div className={"size-full bg-secondary"}></div>
                    </AvatarFallback>
                </Avatar>
                <h3 className={"font-bold"}>AGAGA GODWIN</h3>
                <p>Software Engineering</p>
                <p>300L</p>
        </div>
    )
}
import {Form, Link, useNavigation} from "react-router";
import {AsteriskSquareIcon, ChevronRightIcon, Link2Icon, LoaderIcon} from "lucide-react";
import {formatEmail, safeTry} from "~/lib/helpers";
import { redirect } from "react-router";
import {authCookie} from "~/.server/config/cookies.config";
import { Route } from "./+types/route";
import {getCurrentSession} from "~/.server/db-bridge/session.bridge";
import {getCurrentUser} from "~/.server/db-bridge/user.bridge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {requestCode} from "~/.server/db-bridge/auth.bridge";

export async function action({ request } : Route.ActionArgs){
    const [sessionSuccess, session] = await safeTry(getCurrentSession(request.headers))

    const [userSuccess, user] = await safeTry(getCurrentUser(request.headers))

    if (!userSuccess || !sessionSuccess || !session || !user) return {
        success: false,
        message: "No user found"
    }

    const [ success , data ] = await safeTry(requestCode(user.email , user.matricNumber))

    if(!success || !data) return redirect('/error')

    return redirect('/enter-code' , {
        headers: {
            "Set-Cookie" : await authCookie.serialize(data)
        }
    })
}

export async function loader({request}: Route.LoaderArgs) {
    const [sessionSuccess, session] = await safeTry(getCurrentSession(request.headers))

    const [userSuccess, user] = await safeTry(getCurrentUser(request.headers))

    if (!userSuccess || !sessionSuccess || !session || !user) return redirect('/signup', {
        headers: {
            'Set-Cookie': await authCookie.serialize('', {maxAge: 1})
        }
    })

    return { user }
}

export default function ChooseVerificationMethodPage({ loaderData } : Route.ComponentProps) {

    const {state} = useNavigation()

    const { user } = loaderData

    const isBusy = state == "loading" || state == "submitting"

    return (
        <div className={"size-full flex flex-col items-center justify-center p-2"}>
            <Card className={"w-full md:w-[400px]"}>
                <CardHeader>
                    <CardTitle className={"text-center"}>Request Code</CardTitle>
                    <CardDescription className={"text-center"}>Click the button to send code to {formatEmail(user.email)}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form method={"post"} className={"w-full"}>
                        <Button disabled={isBusy} className={"w-full"}>
                            {isBusy ? <LoaderIcon className={"animate-spin"} /> : "Send Code" }
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
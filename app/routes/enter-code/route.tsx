import {Form, Link, useNavigation} from "react-router";
import {LoaderIcon} from "lucide-react";
import {redirect} from "react-router";
import {authCookie} from "~/.server/config/cookies.config";
import {formatEmail, safeTry} from "~/lib/helpers";
import {Route} from "./+types/route";
import {getCurrentUser} from "~/.server/db-bridge/user.bridge";
import {verifyUser} from "~/.server/db-bridge/auth.bridge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";

export async function loader({request}: Route.LoaderArgs) {

    const [success, user] = await safeTry(getCurrentUser(request.headers))

    if (!success) return redirect('/error', {
        headers: {
            'Set-Cookie': await authCookie.serialize('', {maxAge: 1})
        }
    })

    return {
        email: user.email
    }
}

export async function action({request}: Route.ActionArgs) {

    const [userFound, _, message] = await safeTry(getCurrentUser(request.headers))

    if (!userFound) return {
        success: false,
        message,
    }

    const {code , password} = Object.fromEntries(await request.formData())

    const [success, newSession, msg] = await safeTry(verifyUser(request.headers, code as any , password as any))

    if (!success) return {
        success,
        message: msg.replace("jwt", "code")
    }

    return redirect('/dashboard', {
        headers: {
            'Set-Cookie': await authCookie.serialize(newSession)
        }
    })
}

export default function CodePage({actionData , loaderData}: Route.ComponentProps) {

    const {email} = loaderData

    const {state} = useNavigation()

    const isBusy = state == 'loading' || state == 'submitting'

    return (
        <div className={"size-full flex flex-col items-center justify-center p-2"}>
            <Card className={"w-full md:w-[400px]"}>
                <CardHeader>
                    <CardTitle className={"text-center text-xl md:text-3xl"}>Enter Code</CardTitle>
                    <CardDescription>
                        Enter the code sent to {formatEmail(email)} and set your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form method={"post"}>
                        <div className="flex flex-col gap-6">
                            {
                                actionData && !actionData.success &&
                                <div className={"w-full rounded p-2 bg-destructive text-destructive-foreground grid place-items-center"}>
                                    {actionData.message}
                                </div>
                            }
                            <div className="grid gap-3">
                                <Input
                                    id="code"
                                    type="code"
                                    name={"code"}
                                    placeholder="000000"
                                    required
                                />
                            </div>

                            <Input name={"password"} id="password" type="password" placeholder={"Your Password"} required/>

                            <div className="flex flex-col gap-3">
                                <Button disabled={isBusy} className="w-full">
                                    {isBusy ? <LoaderIcon className={"animate-spin"} /> : "VERIFY" }
                                </Button>

                                <Button disabled={isBusy} variant={"secondary"} className="w-full">
                                    Resend Code
                                </Button>
                            </div>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
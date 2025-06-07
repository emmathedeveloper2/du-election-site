import {Form, Link, useNavigation} from "react-router";
import {LoaderIcon} from "lucide-react";
import {redirect} from "react-router";
import {authCookie} from "~/.server/config/cookies.config";
import {safeTry} from "~/lib/helpers";
import {Route} from "./+types/route";
import {requestCode} from "~/.server/db-bridge/auth.bridge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import { Label } from "~/components/ui/label";

export async function action({request}: Route.ActionArgs) {

    const {email, matricNumber} = Object.fromEntries(await request.formData()) as Record<string, string>

    const [success, data] = await safeTry(requestCode(email, matricNumber))

    if (!success) return {success, message: data.message}

    return redirect('/enter-code', {
        headers: {
            'Set-Cookie': await authCookie.serialize(data)
        }
    })
}

export default function SignInPage({actionData}: Route.ComponentProps) {

    const {state} = useNavigation()

    const isBusy = state == 'loading' || state == 'submitting'

    return (
        <div className={"size-full flex flex-col items-center justify-center p-2"}>
            <Card className={"w-full md:w-[400px]"}>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email and matriculation number below to get a code
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form method={"post"}>
                        <div className="flex flex-col gap-6">
                            {
                                actionData && !actionData.success &&
                                <div
                                    className={"w-full rounded p-2 bg-destructive text-destructive-foreground grid place-items-center"}>
                                    {actionData.message}
                                </div>
                            }
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name={"email"}
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="matricNumber">Matric Number</Label>
                                <Input name={"matricNumber"} id="matricNumber" type="matricNumber"
                                       placeholder={"DU0000"} required/>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button disabled={isBusy} className="w-full">
                                    {isBusy ? <LoaderIcon className={"animate-spin"}/> : "Send Code"}
                                </Button>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Already have an account?{" "}
                                <Link to="/signin" className="underline underline-offset-4">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
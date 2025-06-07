import React, { useEffect } from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { LoaderIcon, UserPlusIcon } from "lucide-react"
import { usersTable } from "~/database/schemas"
import { useFetcher } from "react-router"
import { toast } from "sonner"

type ConfirmMakeAdminDialogProps = {
    user: Omit<typeof usersTable.$inferSelect, "password">
}

const ConfirmMakeAdminDialog = ({ user }: ConfirmMakeAdminDialogProps) => {
    const fetcher = useFetcher()
    const loading = fetcher.state !== "idle"

    // Show toast on success or failure
    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data) {
            if (fetcher.data.success) {
                toast.success(`${user.fullname} is now an admin!`)
            } else if (fetcher.data.error) {
                toast.error(fetcher.data.error || "Failed to make admin.")
            }
        }
    }, [fetcher.state, fetcher.data, user.fullname])

    const onConfirm = () => {
        fetcher.submit(
            { userId: user.id },
            { method: "post", action: "/api/make-admin" }
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild className="w-full flex justify-between items-center p-2">
                <Button variant="ghost">
                    Make Admin
                    <UserPlusIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Make Admin</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to make{" "}
                        <span className="font-semibold">{user.fullname}</span> an admin? This action
                        can be reverted later.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button" disabled={loading}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                        type="button"
                    >
                        {loading ? <LoaderIcon className="animate-spin"/> : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmMakeAdminDialog
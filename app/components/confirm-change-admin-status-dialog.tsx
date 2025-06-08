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
import { LoaderIcon, UserMinusIcon, UserPlusIcon } from "lucide-react"
import { usersTable } from "~/database/schemas"
import { useFetcher } from "react-router"
import { toast } from "sonner"

type ConfirmChangeAdminStatusDialogProps = {
    user: Omit<typeof usersTable.$inferSelect, "password">
    operation: "add" | "remove"
}

const ConfirmChangeAdminStatusDialog = ({ user, operation }: ConfirmChangeAdminStatusDialogProps) => {

    const fetcher = useFetcher()
    const loading = fetcher.state !== "idle"

    // Show toast on success or failure
    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data) {
            if (fetcher.data.success) {
                toast.success(`${user.fullname} ${operation === "add" ? "removed from" : "made"} admin successfully!`)
            } else if (fetcher.data.error) {
                toast.error(fetcher.data.error || `Failed to ${operation === "add" ? "make" : "remove"} admin.`)
            }
        }
    }, [fetcher.state, fetcher.data, user.fullname])

    const onConfirm = () => {
        fetcher.submit(
            { userId: user.id, operation },
            { method: "post", action: "/api/change-admin-status" }
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild className="w-full flex justify-between items-center p-2">
                <Button variant="ghost">
                    {
                        operation == "add" ?
                            <>
                                Make Admin
                                <UserPlusIcon />
                            </>
                            :
                            <>
                                Remove Admin
                                <UserMinusIcon />
                            </>
                    }
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Make Admin</DialogTitle>
                    <DialogDescription>
                        {
                            operation === "add"
                                ? `You are about to make ${user.fullname} an admin.`
                                : `You are about to remove ${user.fullname} from admin status.`
                        } This action  can be reverted later.
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
                        {loading ? <LoaderIcon className="animate-spin" /> : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmChangeAdminStatusDialog
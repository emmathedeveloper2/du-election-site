import { useEffect } from "react"
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
import { LoaderIcon, UserMinusIcon } from "lucide-react"
import { usersTable } from "~/database/schemas"
import { useFetcher } from "react-router"
import { toast } from "sonner"

const RemoveCandidateDialog = ({ user }: { user: Omit<typeof usersTable.$inferSelect, "password"> }) => {
    const fetcher = useFetcher()
    const loading = fetcher.state === "submitting"

    useEffect(() => {
        if (fetcher.data?.success) {
            toast.success(fetcher.data.message || "Candidate removed successfully")
        } else if (fetcher.data && fetcher.data.success === false) {
            toast.error(fetcher.data.message || "Failed to remove candidate")
        }
    }, [fetcher.data])

    const onConfirm = () => {
        fetcher.submit(
            { userId: user.id },
            { method: "post", action: "/api/candidates/remove" }
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild className="w-full flex justify-between items-center px-2">
                <Button variant="ghost" className="text-red-600 w-full flex justify-between items-center">
                    Remove Candidate
                    <UserMinusIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove Candidate</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to remove <span className="font-semibold">{user.fullname}</span> as a candidate? This action cannot be undone.
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
                        {loading ? <LoaderIcon className="animate-spin w-4 h-4 mr-2" /> : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RemoveCandidateDialog

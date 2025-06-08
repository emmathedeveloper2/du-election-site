import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from './ui/dialog'
import { usersTable } from '~/database/schemas'
import { useFetcher } from 'react-router'
import { LoaderIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select'
import { POSITIONS } from '~/lib/constants'
import { toTitleCase } from '~/lib/helpers'

type SelectPositionListProps = {
    user: Omit<typeof usersTable.$inferSelect, "password">
}

const SelectPositionDialog = ({ user }: SelectPositionListProps) => {
    const fetcher = useFetcher()
    const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [open, setOpen] = useState(false)

    // Fetch candidate data on open
    useEffect(() => {
        if (open) fetcher.load(`/api/candidates/${user.id}`)
    }, [open, user.id])

    // Handle fetcher data
    useEffect(() => {
        if (fetcher.state === "loading" || fetcher.state === "submitting") {
            setLoading(true)
        } else {
            setLoading(false)
        }
        if (fetcher.data?.success && fetcher.data.data?.position) {
            setSelectedPosition(fetcher.data.data.position)
        } else if (fetcher.data?.success === false) {
            setSelectedPosition(null)
        }
    }, [fetcher.state, fetcher.data])

    // Handle updating state for position change
    useEffect(() => {
        if (fetcher.state === "submitting") {
            setUpdating(true)
        } else {
            setUpdating(false)
        }
    }, [fetcher.state])

    const handleSave = () => {
        if (!selectedPosition) return
        fetcher.submit(
            { userId: user.id, position: selectedPosition },
            { method: "post", action: "/api/candidates/update-position" }
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="w-full flex justify-between items-center px-2">
                <Button variant="ghost">
                    {
                        loading ? <LoaderIcon className="animate-spin w-4 h-4 mr-2" /> : 
                        <>
                            {selectedPosition ? toTitleCase(selectedPosition) : user.candidate ? "Running for" : "Set position"}
                        </>
                    }
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Candidate Position</DialogTitle>
                </DialogHeader>
                <div className="my-4">
                    <Select
                        value={selectedPosition ?? ""}
                        onValueChange={setSelectedPosition}
                        disabled={loading || updating}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                            {POSITIONS.map((position) => (
                                <SelectItem key={position} value={position.toLowerCase()}>
                                    {position}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button" disabled={updating}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleSave}
                        disabled={updating || !selectedPosition}
                        type="button"
                    >
                        {updating ? <LoaderIcon className="animate-spin w-4 h-4 mr-2" /> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SelectPositionDialog
import { Route } from "./+types/route"
import { safeTry } from "~/lib/helpers"
import { getCurrentUser, removeCandidateByUserId } from "~/.server/db-bridge/user.bridge"

export async function action({ request }: Route.ActionArgs) {
    const [success, user, message] = await safeTry(getCurrentUser(request.headers))
    if (!success || !user || !user.admin) {
        return {
            success: false,
            message: message || "Unauthorized"
        }
    }

    const formData = await request.formData()
    const userId = formData.get("userId")

    if (!userId) {
        return {
            success: false,
            message: "User ID is required"
        }
    }

    const [removeSuccess, removed, removeMsg] = await safeTry(
        removeCandidateByUserId(userId.toString())
    )

    if (!removeSuccess) {
        return {
            success: false,
            message: removeMsg || "Failed to remove candidate"
        }
    }

    return {
        success: true,
        message: "Candidate removed successfully",
        data: removed
    }
}

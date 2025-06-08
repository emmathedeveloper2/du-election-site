import { Route } from "./+types/route"
import { safeTry } from "~/lib/helpers"
import { getCurrentUser, updateCandidatePosition } from "~/.server/db-bridge/user.bridge"

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
    const position = formData.get("position")

    if (!userId || !position) {
        return {
            success: false,
            message: "User ID and position are required"
        }
    }

    const [updateSuccess, updated, updateMsg] = await safeTry(
        updateCandidatePosition(userId.toString(), position.toString())
    )

    if (!updateSuccess) {
        return {
            success: false,
            message: updateMsg || "Failed to update candidate position"
        }
    }

    return {
        success: true,
        message: "Candidate position updated",
        data: updated
    }
}
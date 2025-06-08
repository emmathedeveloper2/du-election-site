import { safeTry } from "~/lib/helpers"
import { getCurrentUser, isSuperAdmin, updateUser } from "~/.server/db-bridge/user.bridge"

export async function action({ request }: { request: Request }) {
    // Check if the user is authenticated and is an admin
    const [success, user, message] = await safeTry(getCurrentUser(request.headers))
    if (!success || !user) {
        return { success: false, status: 401, message: message || "Unauthorized" }
    }

    if (!isSuperAdmin(user)) {
        return { success: false, status: 403, message: "You are not authorized to perform this action" }
    }

    // Get userId from form data
    const formData = await request.formData()

    const userId = formData.get("userId")

    const operation = formData.get("operation")

    if (!userId || typeof userId !== "string") {
        return { success: false, status: 400, message: "Invalid user ID" }
    }

    // Update the user to set admin
    const [updateSuccess, updatedUser, updateMsg] = await safeTry(
        updateUser(userId, { admin: operation === "add" ? true : false })
    )
    if (!updateSuccess || !updatedUser) {
        return { success: false, status: 400, message: updateMsg || "Failed to make user admin" }
    }

    return { success: true, message: "User made admin successfully", data: { user: updatedUser } }
}
import { Route } from "./+types/route"
import { safeTry } from "~/lib/helpers"
import { getCandidateByUserId } from "~/.server/db-bridge/user.bridge"

export async function loader({ params }: Route.LoaderArgs) {
    const userId = params.id

    if (!userId) {
        return {
            success: false,
            message: "User ID is required"
        }
    }

    const [success, candidate, msg] = await safeTry(getCandidateByUserId(userId))

    if (!success) {
        return {
            success: false,
            message: msg || "Something went wrong while fetching the candidate",
        }
    }

    return {
        success: true,
        message: "Candidate found",
        data: candidate
    }
}
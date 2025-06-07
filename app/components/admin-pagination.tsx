import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "./ui/pagination"
import { useNavigate, useSearchParams } from "react-router"

type AdminPaginationProps = {
    page: number
    totalPages: number
}

function getPageRange(current: number, total: number) {
    // Always show first, last, current, and neighbors
    const delta = 1
    const range: number[] = []
    const left = Math.max(2, current - delta)
    const right = Math.min(total - 1, current + delta)

    range.push(1)
    if (left > 2) range.push(-1) // -1 will be ellipsis

    for (let i = left; i <= right; i++) {
        range.push(i)
    }

    if (right < total - 1) range.push(-2) // -2 will be ellipsis

    if (total > 1) range.push(total)
    return range
}

const AdminPagination = ({ page, totalPages }: AdminPaginationProps) => {
    const [_, setSearchParams] = useSearchParams({ page: String(page) })

    const goToPage = (p: number) => {
        setSearchParams((params) => {
            params.set("page", String(p))
            return params
        })
    }

    if (totalPages <= 1) return null

    const pageRange = getPageRange(page, totalPages)

    return (
        <Pagination className="mt-6">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={page > 1 ? () => goToPage(page - 1) : undefined}
                        aria-disabled={page <= 1}
                        tabIndex={page <= 1 ? -1 : 0}
                        style={{ pointerEvents: page <= 1 ? "none" : undefined }}
                    />
                </PaginationItem>
                {pageRange.map((p, idx) =>
                    p === -1 || p === -2 ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={p}>
                            <PaginationLink
                                isActive={page === p}
                                onClick={() => goToPage(p)}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}
                <PaginationItem>
                    <PaginationNext
                        onClick={page < totalPages ? () => goToPage(page + 1) : undefined}
                        aria-disabled={page >= totalPages}
                        tabIndex={page >= totalPages ? -1 : 0}
                        style={{ pointerEvents: page >= totalPages ? "none" : undefined }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default AdminPagination
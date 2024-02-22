import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PageInfo } from "@/types/page-info";

export default function TablePagination({
  searchCond,
  pageInfo,
}: {
  searchCond: string;
  pageInfo: PageInfo;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            isActive={!pageInfo.isFirst}
            href={
              !pageInfo.isFirst ? `?page=${pageInfo.pageNumber - 1}` : undefined
            }
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            isActive={!pageInfo.isLast}
            href={
              !pageInfo.isLast ? `?page=${pageInfo.pageNumber + 1}` : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

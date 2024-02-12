import { TOPIC_BASE_URL } from "@/apis/topic-api";
import CategorySection from "@/components/component/category-section";
import TablePagination from "@/components/component/pagination";
import ReplaceClient from "@/components/component/replace-client";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/ui/topic-table/columns";
import { PageInfo } from "@/types/page-info";
import axios from "axios";

type Result = PageInfo & { results: any[] };

export default async function Home({
  searchParams,
}: {
  searchParams: { accessToken: string; refreshToken: string; page: number };
}) {
  const getTopics = async () =>
    await axios.get(
      TOPIC_BASE_URL() + `?page=${searchParams.page ? searchParams.page : 0}`
    );
  const { data } = await getTopics();
  const result: Result = data.data;

  const { results, ...pageInfo } = result;

  return (
    <main>
      <ReplaceClient searchParams={searchParams} />
      <CategorySection />
      <div className="container py-6 space-y-6 lg:py-12 xl:space-y-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              LOSSION
            </h1>
            <p className="mx-auto max-w-[800px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              연애 토론 게시판
            </p>
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 md:gap-6 lg:gap-8 xl:px-6">
          <DataTable columns={columns} data={result.results} />
          <TablePagination currPage={searchParams.page} pageInfo={pageInfo} />
        </div>
      </div>
    </main>
  );
}

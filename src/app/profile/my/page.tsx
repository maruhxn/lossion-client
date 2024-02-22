"use client";

import { TOPIC_BASE_URL } from "@/apis/topic-api";
import TablePagination from "@/components/component/pagination";
import { DataTable } from "@/components/ui/data-table";
import { myTopicsColumns } from "@/components/ui/my-topic-table/columns";
import { toast } from "@/hooks/use-toast";
import { PageInfo } from "@/types/page-info";
import { MyTopic } from "@/types/topic";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Result = PageInfo & { results: MyTopic[] };

export default function MyTopics({
  searchParams,
}: {
  searchParams: { accessToken: string; refreshToken: string; page: number };
}) {
  const router = useRouter();
  const accessToken = localStorage.getItem("accessToken");
  const [myTopics, setMyTopics] = useState<MyTopic[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  const { data, isError, error } = useQuery({
    queryKey: ["my-topics"],
    queryFn: async () => {
      const { data } = await axios.get(
        TOPIC_BASE_URL() +
          `/my?page=${searchParams.page ? searchParams.page : 0}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return data.data as Result;
    },
  });

  useEffect(() => {
    if (error) {
      router.push("/");
      if (error instanceof AxiosError)
        toast({
          title: "There was an error.",
          description: error.response?.data.message,
          variant: "destructive",
        });
      return;
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      const { results, ...pageInfo } = data;
      setMyTopics(results);
      setPageInfo(pageInfo);
    }
  }, [data]);

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
        나의 토론
      </h1>
      <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 md:gap-6 lg:gap-8 xl:px-6">
        {myTopics && pageInfo && (
          <>
            <DataTable columns={myTopicsColumns} data={myTopics} />
            <TablePagination currPage={searchParams.page} pageInfo={pageInfo} />
          </>
        )}
      </div>
    </>
  );
}

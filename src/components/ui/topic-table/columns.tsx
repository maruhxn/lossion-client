"use client";

import { Topic } from "@/types/topic";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";

export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "title",
    header: "제목",
  },
  {
    accessorKey: "viewCount",
    header: "조회 수",
  },
  {
    accessorKey: "author.username",
    header: "작성자",
  },
  {
    accessorKey: "commentCount",
    header: "댓글 수",
  },
  {
    accessorKey: "favoriteCount",
    header: "좋아요 수",
  },
  {
    accessorKey: "voteCount",
    header: "투표 수",
  },
  {
    accessorKey: "createdAt",
    header: "작성일",
    cell: ({ row }) => {
      return format(parseISO(row.getValue("createdAt")), "yyyy-MM-dd");
    },
  },
  {
    accessorKey: "closedAt",
    header: "투표 종료일",
    cell: ({ row }) => {
      return format(parseISO(row.getValue("closedAt")), "yyyy-MM-dd");
    },
  },
];

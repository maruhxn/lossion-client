"use client";

import { getFormatedDate } from "@/lib/utils";
import { MyTopic } from "@/types/topic";
import { ColumnDef } from "@tanstack/react-table";

export const myTopicsColumns: ColumnDef<MyTopic>[] = [
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
      return getFormatedDate(row.getValue("createdAt"));
    },
  },
  {
    accessorKey: "updatedAt",
    header: "수정일",
    cell: ({ row }) => {
      return getFormatedDate(row.getValue("updatedAt"));
    },
  },
  {
    accessorKey: "closedAt",
    header: "투표 종료일",
    cell: ({ row }) => {
      return getFormatedDate(row.getValue("closedAt"));
    },
  },
];

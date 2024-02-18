"use client";

import { GET_REPLIES_URL } from "@/apis/comment-api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Comment } from "@/types/comment";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowDownIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import CommentComponent from "./comment-component";

export default function ReplySection({
  topicId,
  groupId,
  repliesCount,
}: {
  topicId: number;
  groupId: string;
  repliesCount: number;
}) {
  const accessToken = localStorage.getItem("accessToken");
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const {
    mutate: getReplies,
    isPending,
    data,
  } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get(GET_REPLIES_URL(topicId, groupId), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data.data as Comment[];
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast({
          title: "There was an error.",
          description: err.response?.data.message,
          variant: "destructive",
        });
      }
    },
    onSuccess: (data) => {
      setReplies(data);
    },
  });

  return (
    <Button
      variant="ghost"
      className={cn("flex items-center space-x-2 text-xs text-blue-500")}
      onClick={() => {
        !isOpen && getReplies();
        setIsOpen((prev) => !prev);
      }}
    >
      <ArrowDownIcon className="text-blue-500 w-4 h-4" />
      <div>{`답글 ${repliesCount}개`}</div>
      {isOpen && (
        <div className="divide-y-[1px] divide-gray-400">
          {replies.map((reply) => (
            <CommentComponent topicId={topicId} comment={reply} />
          ))}
        </div>
      )}
    </Button>
  );
}

"use client";

import CommentFavorite from "@/components/component/comment-favorite";
import { Button } from "@/components/ui/button";
import { Comment } from "@/types/comment";
import { useState } from "react";
import CommentInput from "./comment-write-input";

export default function CommentAction({
  topicId,
  comment,
}: {
  topicId: number;
  comment: Comment;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex items-center space-x-1 text-xs text-gray-500">
        <CommentFavorite
          commentId={comment.id}
          favoriteCnt={comment.favoriteCount}
        />
        <Button
          className="text-xs"
          variant="ghost"
          onClick={() => setIsOpen(true)}
        >
          Reply
        </Button>
      </div>
      {isOpen && <CommentInput topicId={topicId} replyToId={comment.id} />}
    </>
  );
}

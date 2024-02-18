"use client";

import { COMMENTS_FAVORITE_URL } from "@/apis/favorite-api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { HeartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";

export default function CommentFavorite({
  commentId,
  favoriteCnt,
}: {
  commentId: number;
  favoriteCnt: number;
}) {
  const accessToken = localStorage.getItem("accessToken");
  const [isLike, setIsLike] = useState(false);
  const [displayFavoriteCnt, setDisplayFavoriteCnt] = useState(favoriteCnt);

  const { isError, error } = useQuery({
    queryKey: [`comment-favorite-${commentId}`],
    queryFn: async () => {
      const res = await axios.get(COMMENTS_FAVORITE_URL(commentId), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.status === 204) {
        setIsLike(true);
      }
    },
  });

  useEffect(() => {
    if (error instanceof AxiosError) {
      if (error.status === 404) {
        setIsLike(false);
      }
    }
  }, [error]);

  const { mutate: favorite, isPending } = useMutation({
    mutationFn: async () => {
      await axios.patch(COMMENTS_FAVORITE_URL(commentId), null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
    onSuccess: () => {
      // true -> false: -1
      if (isLike) {
        setIsLike(false);
        setDisplayFavoriteCnt((prev) => prev - 1);
        toast({
          title: "Success",
          description: "좋아요를 취소하였습니다.",
          variant: "default",
        });
      }

      // false -> true: +1
      if (!isLike) {
        setIsLike(true);
        setDisplayFavoriteCnt((prev) => prev + 1);
        toast({
          title: "Success",
          description: "좋아요를 남겼습니다.",
          variant: "default",
        });
      }
    },
  });

  return (
    <div
      onClick={() => {
        if (isPending) return;
        favorite();
      }}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "flex justify-center items-center space-x-2 text-gray-500 dark:text-gray-200 cursor-pointer",
        isLike && "text-red-500 dar:text-red-200"
      )}
    >
      {isLike ? (
        <HeartIcon fill="red" strokeWidth={0} className="h-3 w-3" />
      ) : (
        <HeartIcon className="h-3 w-3" />
      )}
      <span className="text-xs">{displayFavoriteCnt}</span>
    </div>
  );
}

"use client";

import { TOPIC_FAVORITE_URL } from "@/apis/favorite-api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { HeartIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function TopicFavorite({
  topicId,
  favoriteCnt,
}: {
  topicId: number;
  favoriteCnt: number;
}) {
  const accessToken = localStorage.getItem("accessToken");
  const [isLike, setIsLike] = useState(false);
  const [displayFavoriteCnt, setDisplayFavoriteCnt] = useState(favoriteCnt);

  const { isError, error } = useQuery({
    queryKey: ["topic-favorite"],
    queryFn: async () => {
      const res = await axios.get(TOPIC_FAVORITE_URL(topicId), {
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
      await axios.patch(TOPIC_FAVORITE_URL(topicId), null, {
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
        "flex flex-col justify-center items-center space-y-1 text-gray-500 dark:text-gray-200 cursor-pointer p-3",
        isLike && "text-red-500 dar:text-red-200"
      )}
    >
      {isLike ? (
        <HeartIcon fill="red" strokeWidth={0} className="h-5 w-5" />
      ) : (
        <HeartIcon className="h-5 w-5" />
      )}
      <span className="text-sm">{displayFavoriteCnt}</span>
    </div>
  );
}

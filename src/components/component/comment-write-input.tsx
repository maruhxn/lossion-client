"use client";

import { AUTH_BASE_URL } from "@/apis/auth-api";
import { COMMENT_BASE_URL } from "@/apis/comment-api";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getProfileImage } from "@/lib/utils";
import {
  CreateCommentRequest,
  CreateCommentValidator,
} from "@/lib/validators/comment";
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CommentInput({
  topicId,
  replyToId,
}: {
  topicId: number;
  replyToId?: number;
}) {
  const accessToken = localStorage.getItem("accessToken");

  const {
    isLoading,
    data: user,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axios.get(AUTH_BASE_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data.data as User;
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateCommentRequest>({
    resolver: zodResolver(CreateCommentValidator),
  });

  const { mutate: createComment, isPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof CreateCommentValidator>) => {
      if (replyToId) {
        payload = { ...payload, replyToId };
      }
      await axios.post(COMMENT_BASE_URL(topicId), payload, {
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
      location.reload();
      toast({
        title: "Success",
        description: "댓글 작성 성공",
        variant: "default",
      });
    },
  });

  return (
    <form
      className="flex items-center space-x-2 mb-4"
      onSubmit={handleSubmit((e) => createComment(e))}
    >
      {user && (
        <Avatar>
          <AvatarImage
            alt="프로필 이미지"
            src={getProfileImage(user.profileImage)}
          />
        </Avatar>
      )}

      <Input
        required
        className="flex-1"
        placeholder="Write a comment..."
        {...register("text")}
      />
    </form>
  );
}

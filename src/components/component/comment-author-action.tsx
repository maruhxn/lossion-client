"use client";

import { COMMENT_BASE_URL } from "@/apis/comment-api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import useUser from "@/hooks/use-user";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  UpdateCommentRequest,
  UpdateCommentValidator,
} from "@/lib/validators/comment";
import { Comment } from "@/types/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function CommentAuthorAction({
  topicId,
  comment,
}: {
  topicId: number;
  comment: Comment;
}) {
  const accessToken = localStorage.getItem("accessToken");
  const { data: user } = useUser();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UpdateCommentRequest>({
    resolver: zodResolver(UpdateCommentValidator),
  });

  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    mutationFn: async (payload: z.infer<typeof UpdateCommentValidator>) => {
      await axios.patch(COMMENT_BASE_URL(topicId, comment.id), payload, {
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
        description: "댓글 수정 성공",
        variant: "default",
      });
    },
  });

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      await axios.delete(COMMENT_BASE_URL(topicId, comment.id), {
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
        description: "댓글 삭제 성공",
        variant: "default",
      });
    },
  });

  return (
    <>
      {user && user.id === comment.author.authorId && (
        <Popover>
          <PopoverTrigger asChild>
            <MoreHorizontal className="w-6 h-6 cursor-pointer rounded-xl p-1 hover:ring-1 ring-gray-500" />
          </PopoverTrigger>
          <PopoverContent className="w-32">
            <div className="grid gap-1 text-gray-500 cursor-pointer">
              <Dialog>
                <DialogTrigger>
                  <Button variant="ghost" className="flex space-x-2 w-full">
                    <PencilIcon className="w-4 h-4" />
                    <span className="text-sm">수정</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>댓글 수정</DialogTitle>
                    <DialogDescription>
                      수정할 내용을 입력해주세요.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    className="flex items-center space-x-2"
                    onSubmit={handleSubmit((e) => updateComment(e))}
                  >
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="text" className="sr-only">
                        내용
                      </Label>
                      <Input
                        id="text"
                        defaultValue={comment.text}
                        required
                        {...register("text")}
                      />
                    </div>
                    <Button
                      isLoading={isUpdating}
                      type="submit"
                      className="px-3"
                    >
                      <span>수정</span>
                    </Button>
                  </form>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button
                        isLoading={isUpdating}
                        type="button"
                        variant="secondary"
                      >
                        닫기
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger>
                  <Button
                    variant="ghost"
                    className="flex space-x-2 text-red-400 w-full hover:text-white hover:bg-red-500"
                  >
                    <Trash2Icon className="w-4 h-4" />
                    <span className="text-sm">삭제</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>정말로 삭제하시겠습니까?</DialogTitle>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button
                        isLoading={isDeleting}
                        type="button"
                        variant="secondary"
                      >
                        닫기
                      </Button>
                    </DialogClose>
                    <Button
                      isLoading={isDeleting}
                      onClick={() => deleteComment()}
                      type="submit"
                      className="bg-red-400"
                    >
                      삭제
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}

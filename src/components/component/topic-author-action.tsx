"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import useUser from "@/hooks/use-user";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  Clock2Icon,
  MoreHorizontal,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import { CLOSE_TOPIC_URL, TOPIC_BASE_URL } from "@/apis/topic-api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TopicDetail } from "@/types/topic";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function TopicAuthorAction({ topic }: { topic: TopicDetail }) {
  const accessToken = localStorage.getItem("accessToken");
  const router = useRouter();
  const { data: user } = useUser();

  const { mutate: closeTopic, isPending: isClosing } = useMutation({
    mutationFn: async () => {
      await axios.patch(CLOSE_TOPIC_URL(topic.topicId), null, {
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
        description: "토론 종료 성공",
        variant: "default",
      });
    },
  });

  const { mutate: deleteTopic, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      await axios.delete(TOPIC_BASE_URL(topic.topicId), {
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
      router.push("/");
      toast({
        title: "Success",
        description: "토론 삭제 성공",
        variant: "default",
      });
    },
  });

  return (
    <>
      {user && user.id === topic.author.authorId && (
        <Popover>
          <PopoverTrigger asChild>
            <MoreHorizontal className="w-6 h-6 cursor-pointer rounded-xl p-1 hover:ring-1 ring-gray-500" />
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div className="grid grid-cols-1 gap-1 text-gray-500 cursor-pointer">
              <Button
                variant="ghost"
                type="button"
                className="flex space-x-2 justify-between w-full"
                onClick={() =>
                  router.push(
                    `/topics/${topic.topicId}/update?topic=${JSON.stringify(
                      topic
                    )}`
                  )
                }
              >
                <PencilIcon className="w-4 h-4" />
                <span className="text-sm">수정</span>
              </Button>

              <Button
                variant="ghost"
                type="button"
                className="flex space-x-2 justify-between w-full"
                isLoading={isClosing}
                onClick={() => closeTopic()}
              >
                <Clock2Icon className="w-4 h-4" />
                <span className="text-sm">토론 종료</span>
              </Button>

              <Dialog>
                <DialogTrigger>
                  <Button
                    variant="ghost"
                    className="flex space-x-2 justify-between text-red-400 w-full hover:text-white hover:bg-red-500"
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
                      onClick={() => deleteTopic()}
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

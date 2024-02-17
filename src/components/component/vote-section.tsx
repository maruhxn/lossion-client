"use client";

import { VOTE_URL } from "@/apis/topic-api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { VoteCountInfo } from "@/types/topic";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

type VoteType = "FIRST" | "SECOND";

export default function VoteSection({
  topicId,
  firstChoice,
  secondChoice,
  voteInfo,
}: {
  topicId: number;
  firstChoice: string;
  secondChoice: string;
  voteInfo: VoteCountInfo;
}) {
  const accessToken = localStorage.getItem("accessToken");
  const [currVoteType, setCurrVoteType] = useState<VoteType | null>(null);
  const [displayVoteCntInfo, setDisplayVoteCntInfo] =
    useState<VoteCountInfo>(voteInfo);

  const { error } = useQuery({
    queryKey: ["topic-vote"],
    queryFn: async () => {
      const { data } = await axios.get(VOTE_URL(topicId), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCurrVoteType(data.data);
    },
  });

  useEffect(() => {
    if (error instanceof AxiosError) {
      if (error.status === 404) {
        setCurrVoteType(null);
      }
    }
  }, [error]);

  const { mutate: vote, isPending } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      await axios.patch(
        VOTE_URL(topicId),
        { voteType, voteAt: new Date() },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return voteType;
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
    onSuccess: (voteType: VoteType) => {
      if (voteType === currVoteType) {
        setCurrVoteType(null);
        if (voteType === "FIRST") {
          setDisplayVoteCntInfo((prev) => ({
            ...prev,
            voteCount: prev.voteCount - 1,
            firstChoiceCount: prev.firstChoiceCount - 1,
          }));
        } else {
          setDisplayVoteCntInfo((prev) => ({
            ...prev,
            voteCount: prev.voteCount - 1,
            secondChoiceCount: prev.secondChoiceCount - 1,
          }));
        }
      } else if (currVoteType === null) {
        setCurrVoteType(voteType);
        if (voteType === "FIRST") {
          setDisplayVoteCntInfo((prev) => ({
            ...prev,
            voteCount: prev.voteCount + 1,
            firstChoiceCount: prev.firstChoiceCount + 1,
          }));
        } else {
          setDisplayVoteCntInfo((prev) => ({
            ...prev,
            voteCount: prev.voteCount + 1,
            secondChoiceCount: prev.secondChoiceCount + 1,
          }));
        }
      } else {
        setCurrVoteType(voteType);
        if (voteType === "FIRST") {
          setDisplayVoteCntInfo((prev) => ({
            ...prev,
            firstChoiceCount: prev.firstChoiceCount + 1,
            secondChoiceCount:
              prev.secondChoiceCount <= 0 ? 0 : prev.secondChoiceCount - 1,
          }));
        } else {
          setDisplayVoteCntInfo((prev) => ({
            ...prev,
            firstChoiceCount:
              prev.firstChoiceCount <= 0 ? 0 : prev.firstChoiceCount - 1,
            secondChoiceCount: prev.secondChoiceCount + 1,
          }));
        }
      }

      toast({
        title: "Success",
        description: `${
          voteType === "FIRST" ? "1번 선택지" : "2번 선택지"
        }에 투표하였습니다.`,
        variant: "default",
      });
    },
  });
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="flex flex-col items-center space-y-2">
        <CardTitle className="text-center">당신의 선택은?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4 justify-between">
          <div className="flex flex-col">
            <p>{firstChoice}</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {displayVoteCntInfo.firstChoiceCount} votes
            </p>
          </div>
          <Button
            size="sm"
            disabled={isPending}
            className={cn(
              "hover:bg-green-600",
              currVoteType === "FIRST" && "bg-green-500"
            )}
            onClick={() => vote("FIRST")}
          >
            <CheckIcon className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-4 justify-between">
          <div className="flex flex-col">
            <p>{secondChoice}</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {displayVoteCntInfo.secondChoiceCount} votes
            </p>
          </div>
          <Button
            size="sm"
            disabled={isPending}
            className={cn(
              "hover:bg-green-600",
              currVoteType === "SECOND" && "bg-green-500"
            )}
            onClick={() => vote("SECOND")}
          >
            <CheckIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Votes: {displayVoteCntInfo.voteCount}
        </div>
      </CardFooter>
    </Card>
  );
}

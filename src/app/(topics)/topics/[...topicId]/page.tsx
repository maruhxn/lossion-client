import { TOPIC_BASE_URL } from "@/apis/topic-api";
import CommentSection from "@/components/component/comment-section";
import CopyLink from "@/components/component/copy-link";
import TopicFavorite from "@/components/component/topic-favorite";
import VoteSection from "@/components/component/vote-section";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { getFormatedDate, getProfileImage } from "@/lib/utils";
import { TopicDetail } from "@/types/topic";
import axios from "axios";
import {
  EyeIcon,
  ImageIcon,
  PencilIcon,
  RefreshCw,
  TimerIcon,
} from "lucide-react";

export default async function TopicDetail({
  params,
}: {
  params: { topicId: number };
}) {
  const topicDetailData = await (
    await axios.get(TOPIC_BASE_URL(params.topicId))
  ).data;
  const topic: TopicDetail = topicDetailData.data;

  return (
    <div className="container py-6 lg:py-12">
      <div className="container py-6 space-y-4 lg:py-12 xl:space-y-6 px-6">
        <div className="flex space-x-3">
          <Badge>{topic.categoryItem.name}</Badge>
          {topic.isClosed && <Badge variant="destructive">closed</Badge>}
        </div>
        <div className="w-full bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center ">
            <div className="flex space-x-4">
              <div>
                <img
                  alt="프로필 이미지"
                  className="rounded-full"
                  height="48"
                  src={getProfileImage(topic.author.profileImage)}
                  style={{
                    aspectRatio: "48/48",
                    objectFit: "cover",
                  }}
                  width="48"
                />
              </div>
              <div>
                <div className="text-lg font-bold dark:text-white">
                  {topic.author.username}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-200">
                  @{topic?.author.accountId}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 font-light">
              <div className="flex flex-col">
                <div className="flex space-x-2 text-red-500">
                  <TimerIcon className="w-4 h-4" />
                  <span>{getFormatedDate(topic.closedAt.toString())}</span>
                </div>
                <div className="flex space-x-2">
                  <EyeIcon className="w-4 h-4" />
                  <span>{topic.viewCount}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex space-x-2">
                  <PencilIcon className="w-4 h-4" />
                  <span>{getFormatedDate(topic.createdAt.toString())}</span>
                </div>
                <div className="flex space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>{getFormatedDate(topic.updatedAt.toString())}</span>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:tracking-tighter py-4">
            {topic.title}
          </h1>
          <div className="px-6 py-4 space-y-2">
            <div className="text-gray-800 dark:text-gray-200">
              {topic.description}
            </div>
            {topic.images.length > 0 && (
              <Carousel>
                <div className="flex space-x-2 items-center">
                  <ImageIcon className="w-4 h-4" />
                  <span className="font-bold">첨부 이미지</span>
                </div>
                <CarouselContent>
                  {topic.images.map((image) => (
                    <CarouselItem
                      key={image.imageId}
                      className="flex justify-center items-center"
                    >
                      <img
                        src={getProfileImage(image.storedName)}
                        alt={image.storedName}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
            <VoteSection
              topicId={params.topicId}
              firstChoice={topic.firstChoice}
              secondChoice={topic.secondChoice}
              voteInfo={topic.voteCountInfo}
            />
          </div>
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700 p-4">
            <TopicFavorite
              topicId={params.topicId}
              favoriteCnt={topic.favoriteCount}
            />
            <CopyLink />
          </div>
          <Separator className="my-2" />
          <CommentSection topicId={params.topicId} />
        </div>
      </div>
    </div>
  );
}

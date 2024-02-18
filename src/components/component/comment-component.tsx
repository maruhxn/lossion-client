import { getFormatedDate, getProfileImage } from "@/lib/utils";
import { Comment } from "@/types/comment";
import { Avatar, AvatarImage } from "../ui/avatar";
import CommentAction from "./comment-action";
import ReplySection from "./reply-section";

export default function CommentComponent({
  topicId,
  comment,
}: {
  topicId: number;
  comment: Comment;
}) {
  return (
    <div className="flex space-x-3 py-4">
      <Avatar>
        <AvatarImage
          alt="프로필 이미지"
          src={getProfileImage(comment.author.profileImage)}
        />
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-semibold">@{comment.author.username}</p>
        <p className="text-xs text-gray-500">
          {getFormatedDate(comment.createdAt.toString())}
        </p>
        <p className="text-sm pt-3">{comment.text}</p>
        <CommentAction topicId={topicId} comment={comment} />
        {comment.repliesCount > 0 && (
          <ReplySection
            topicId={topicId}
            groupId={comment.groupId}
            repliesCount={comment.repliesCount}
          />
        )}
      </div>
    </div>
  );
}

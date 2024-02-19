import { getFormatedDateTime, getProfileImage } from "@/lib/utils";
import { Comment } from "@/types/comment";
import { Avatar, AvatarImage } from "../ui/avatar";
import CommentAction from "./comment-action";
import CommentAuthorAction from "./comment-author-action";
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
        <div className="text-xs text-gray-500 flex justify-between items-center">
          {getFormatedDateTime(comment.createdAt.toString())}
          <CommentAuthorAction topicId={topicId} comment={comment} />
        </div>
        <p className="text-sm pt-3">
          <span className="font-bold text-sm">
            {comment.replyToId && `@${comment.replyToId} `}
          </span>
          {comment.text}
        </p>
        <CommentAction topicId={topicId} comment={comment} />
        {!comment.replyToId && comment.repliesCount > 0 && (
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

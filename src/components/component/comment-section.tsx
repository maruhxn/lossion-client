import { COMMENT_BASE_URL } from "@/apis/comment-api";
import { Comment } from "@/types/comment";
import axios from "axios";
import CommentComponent from "./comment-component";
import CommentInput from "./comment-write-input";

export default async function CommentSection({ topicId }: { topicId: number }) {
  const { data } = await axios.get(COMMENT_BASE_URL(topicId));
  const comments = data.data.results as Comment[];

  return (
    <div className="bg-white p-6">
      <CommentInput topicId={topicId} />
      {comments.length > 0 && (
        <div className="divide-y-[1px] divide-gray-400">
          {comments.map((comment) => (
            <CommentComponent topicId={topicId} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

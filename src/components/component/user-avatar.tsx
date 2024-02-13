import { getProfileImage } from "@/lib/utils";
import { User } from "@/types/user";
import { AvatarProps } from "@radix-ui/react-avatar";
import Image from "next/image";
import { Icons } from "../icons";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "username" | "profileImage">;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.profileImage ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={getProfileImage(user.profileImage)}
            alt="프로필 이미지"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.username}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}

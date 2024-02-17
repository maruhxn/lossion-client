"use client";

import { toast } from "@/hooks/use-toast";
import { LinkIcon } from "lucide-react";

export default function CopyLink() {
  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window && window.location.href)
        .then(() =>
          toast({
            title: "Success",
            description: "클립보드에 복사했습니다.",
            variant: "default",
          })
        )
        .catch(() => {
          toast({
            title: "Failed",
            description: "링크 복사에 실패했습니다. 다시 시도해주세요.",
            variant: "default",
          });
        });
    }
  };
  return (
    <LinkIcon
      onClick={() => copyLink()}
      className="h-5 w-5 text-gray-500 dark:text-gray-200 cursor-pointer"
    />
  );
}

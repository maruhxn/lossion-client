import {
  GOOGLE_LOGIN_URL,
  KAKAO_LOGIN_URL,
  NAVER_LOGIN_URL,
} from "@/apis/auth-api";
import { useRouter } from "next/navigation";
import { Icons } from "../icons";
import { Button } from "../ui/button";

export default function OAuthForm({ isPending }: { isPending: boolean }) {
  const router = useRouter();

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-3">
        <Button
          disabled={isPending}
          isLoading={isPending}
          onClick={() => {
            router.push(GOOGLE_LOGIN_URL);
          }}
          className="w-full text-white"
        >
          {isPending ? null : <Icons.google className="h-4 w-4 mr-2" />}
          Google Login
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3">
        <Button
          disabled={isPending}
          isLoading={isPending}
          onClick={() => {
            router.push(KAKAO_LOGIN_URL);
          }}
          className="w-full text-white"
        >
          {isPending ? null : <Icons.kakao className="h-4 w-4 mr-2" />}
          Kakao Login
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3">
        <Button
          disabled={isPending}
          isLoading={isPending}
          onClick={() => {
            router.push(NAVER_LOGIN_URL);
          }}
          className="w-full text-white"
        >
          {isPending ? null : <Icons.naver className="h-4 w-4 mr-2" />}
          Naver Login
        </Button>
      </div>
    </>
  );
}

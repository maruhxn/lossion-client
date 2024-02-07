import LoginForm from "@/components/component/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded bg-white p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">로그인</h1>
          <p className="text-gray-500 dark:text-gray-400">
            아이디와 비밀번호를 입력해주세요.
          </p>
        </div>
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          계정이 없으신가요?{" "}
          <Link className="underline" href="/auth/sign-up">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}

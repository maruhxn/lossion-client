import SignUpForm from "@/components/component/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold">회원가입</h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          다음을 입력하여 회원가입을 진행해주세요.
        </p>
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-gray-600">
          이미 게정이 있으신가요?{" "}
          <Link
            className="font-medium text-indigo-600 hover:text-indigo-500"
            href="/auth/login"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

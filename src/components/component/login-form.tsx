"use client";

import { LOGIN_URL } from "@/apis/auth-api";
import { toast } from "@/hooks/use-toast";
import { LoginRequest, LoginValidator } from "@/lib/validators/auth";
import { TokenDto } from "@/types/token-dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import OAuthForm from "./oauth-form";

export default function LoginForm() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginValidator),
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: async ({
      accountId,
      password,
    }: z.infer<typeof LoginValidator>) => {
      const payload = { accountId, password };
      const { data } = await axios.post(LOGIN_URL, payload);
      return data.data as TokenDto;
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
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      router.push("/");
    },
  });

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit((e) => login(e))}>
        <div className="space-y-2">
          <Label htmlFor="accountId">아이디</Label>
          <Input
            id="accountId"
            placeholder="Account Id"
            {...register("accountId")}
            required
          />
          {errors?.accountId && (
            <p className="px-1 text-xs text-red-600">
              {errors.accountId.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="password">비밀번호</Label>
            <Link className="ml-auto inline-block text-sm underline" href="#">
              비밀번호를 잊으셨나요?
            </Link>
          </div>
          <Input
            id="password"
            placeholder="Password"
            required
            {...register("password")}
            type="password"
          />
          {errors?.password && (
            <p className="px-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button isLoading={isPending} className="w-full" type="submit">
          로그인
        </Button>
      </form>
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              또는 다음으로 계속
            </span>
          </div>
        </div>
        <OAuthForm isPending={isPending} />
      </div>
    </>
  );
}

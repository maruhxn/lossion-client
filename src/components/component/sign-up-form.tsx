"use client";

import { toast } from "@/hooks/use-toast";
import { SignUpRequest, SignUpValidator } from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import OAuthForm from "./oauth-form";

export default function SignUpForm() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignUpRequest>({
    resolver: zodResolver(SignUpValidator),
  });

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof SignUpValidator>) => {
      return await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/auth/sign-up",
        payload
      );
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
    onSuccess: () => {
      router.push("/auth/login");
    },
  });

  return (
    <>
      <form
        className="mt-8 space-y-6"
        onSubmit={handleSubmit((e) => signUp(e))}
      >
        <div>
          <label className="sr-only" htmlFor="email">
            이메일
          </label>
          <Input
            id="email"
            placeholder="Email address"
            {...register("email")}
            required
            type="email"
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="accountId">
            아이디
          </label>
          <Input
            id="accountId"
            placeholder="Account Id"
            {...register("accountId")}
            required
            type="text"
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="username">
            유저명
          </label>
          <Input
            id="username"
            placeholder="Username"
            {...register("username")}
            required
            type="text"
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="password">
            비밀번호
          </label>
          <Input
            id="password"
            placeholder="Password"
            {...register("password")}
            required
            type="password"
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="confirm-password">
            비밀번호 확인
          </label>
          <Input
            id="confirm-password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            required
            type="password"
          />
        </div>
        {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox 
              id="terms"
               />
              <label
                className="m
                l-2 block text-sm text-gray-900"
                htmlFor="terms"
              >
                Accept terms and conditions
              </label>
            </div>
          </div> */}
        <div>
          <Button className="w-full">회원가입</Button>
        </div>
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

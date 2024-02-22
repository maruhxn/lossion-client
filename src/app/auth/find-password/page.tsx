"use client";

import {
  ANONYMOUS_GET_TOKEN_URL,
  ANONYMOUS_SEND_VERIFY_EMAIL_URL,
} from "@/apis/auth-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  FindPasswordRequest,
  FindPasswordValidator,
  GetAuthTokenRequest,
  GetAuthTokenValidator,
} from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function FindPasswordPage() {
  const router = useRouter();
  const [isSend, setIsSend] = useState(false);

  const {
    handleSubmit: findPasswordSubmit,
    register: fpregister,
    formState: { errors },
  } = useForm<FindPasswordRequest>({
    resolver: zodResolver(FindPasswordValidator),
  });

  const {
    setValue,
    handleSubmit: verifySubmit,
    register: vregister,
    formState: { errors: vErrors },
  } = useForm<GetAuthTokenRequest>({
    resolver: zodResolver(GetAuthTokenValidator),
  });

  const { mutate: sendAuthMail, isPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof FindPasswordValidator>) => {
      await axios.post(ANONYMOUS_SEND_VERIFY_EMAIL_URL, payload);
      return payload;
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
    onSuccess: ({ accountId, email }) => {
      setIsSend(true);
      setValue("accountId", accountId);
      setValue("email", email);
      toast({
        title: "Success",
        description: "인증 메일을 보냈습니다.",
        variant: "default",
      });
    },
  });

  const { mutate: verify, isPending: isVerifying } = useMutation({
    mutationFn: async (payload: z.infer<typeof GetAuthTokenValidator>) => {
      const { data } = await axios.post(ANONYMOUS_GET_TOKEN_URL, payload);
      return data.data as string;
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
    onSuccess: (authKey) => {
      router.push(`/auth/change-password?authKey=${authKey}`);
    },
  });

  return (
    <form
      className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
      onSubmit={
        isSend
          ? verifySubmit((e) => verify(e))
          : findPasswordSubmit((e) => sendAuthMail(e))
      }
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold">비밀번호 찾기</CardTitle>
          <CardDescription>
            아이디와 이메일을 통해 인증 후, 인증 코드를 입력하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountId">ID</Label>
              {isSend ? (
                <Input
                  id="accountId"
                  placeholder="Enter your ID"
                  required
                  {...vregister("accountId")}
                  disabled
                />
              ) : (
                <Input
                  id="accountId"
                  placeholder="Enter your ID"
                  required
                  {...fpregister("accountId")}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isSend ? (
                <Input
                  id="email"
                  placeholder="Enter your email"
                  required
                  type="email"
                  disabled
                  {...vregister("email")}
                />
              ) : (
                <Input
                  id="email"
                  placeholder="Enter your email"
                  required
                  type="email"
                  {...fpregister("email")}
                />
              )}
            </div>
            {!isSend && (
              <Button className="w-full" type="submit" isLoading={isPending}>
                Send Authentication Mail
              </Button>
            )}
            {isSend && (
              <div className="space-y-2">
                <Label htmlFor="code">인증 코드</Label>
                <Input
                  id="code"
                  placeholder="Enter your code"
                  required
                  {...vregister("payload")}
                />
              </div>
            )}
            {isSend && (
              <Button
                isLoading={isVerifying}
                className="w-full"
                type="submit"
                onClick={verifySubmit((e) => verify(e))}
              >
                Verify
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

"use client";

import { ANONYMOUS_CHANGE_PASSWORD_URL } from "@/apis/auth-api";
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
  AnonymousChangePasswordRequest,
  AnonymousChangePasswordValidator,
} from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ChangePassword({
  searchParams,
}: {
  searchParams: {
    authKey: string;
  };
}) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<AnonymousChangePasswordRequest>({
    resolver: zodResolver(AnonymousChangePasswordValidator),
  });

  useEffect(() => {
    if (!searchParams.authKey) {
      router.push("/");
      toast({
        title: "There was an error.",
        description: "인증키가 필요합니다.",
        variant: "destructive",
      });
    }
  }, []);

  const { mutate: updatePassword, isPending } = useMutation({
    mutationFn: async ({
      newPassword,
      confirmNewPassword,
    }: z.infer<typeof AnonymousChangePasswordValidator>) => {
      const payload = { newPassword, confirmNewPassword };
      await axios.patch(
        `${ANONYMOUS_CHANGE_PASSWORD_URL}?authKey=${searchParams.authKey}`,
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
      toast({
        title: "Success",
        description: `비밀번호 변경에 성공했습니다.`,
        variant: "default",
      });
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">비밀번호 변경</CardTitle>
          <CardDescription>비밀번호를 새롭게 설정하세요</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit((e) => updatePassword(e))}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                required
                type="password"
                {...register("newPassword")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verify-password">Verify Password</Label>
              <Input
                id="verify-password"
                required
                type="password"
                {...register("confirmNewPassword")}
              />
            </div>
            <Button isLoading={isPending} className="w-full">
              Change Password
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

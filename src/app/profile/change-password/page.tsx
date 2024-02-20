"use client";

import { AUTH_BASE_URL, CHECK_HAS_PASSWORD_URL } from "@/apis/auth-api";
import { CHANGE_PASSWORD_URL } from "@/apis/member-api";
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
  PasswordUpdateValidator,
  PasswordUpdateeRequest,
} from "@/lib/validators/profile";
import { UserDetail } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ChangePassword() {
  const router = useRouter();
  const accessToken = localStorage.getItem("accessToken");

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<PasswordUpdateeRequest>({
    resolver: zodResolver(PasswordUpdateValidator),
  });

  const {
    data: user,
    isError: isNoUserError,
    error: noUserError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axios.get(AUTH_BASE_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data.data as UserDetail;
    },
  });

  useEffect(() => {
    if (isNoUserError) {
      router.push("/");
      if (noUserError instanceof AxiosError)
        toast({
          title: "There was an error.",
          description: noUserError.response?.data.message,
          variant: "destructive",
        });
      return;
    }
  }, [isNoUserError]);

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["has-password"],
    queryFn: async () => {
      const { data } = await axios.get(CHECK_HAS_PASSWORD_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data;
    },
    retry: 0,
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "비밀번호가 존재하지 않습니다.",
        description:
          "소셜 로그인 가입자는 비밀번호가 존재하지 않으므로, 비밀번호를 변경할 수 없습니다.동일한 이메일로 회원가입을 진행하세요",
      });
      router.back();
    }
  }, [isError]);

  const { mutate: updatePassword, isPending: isVerifying } = useMutation({
    mutationFn: async ({
      currPassword,
      newPassword,
      confirmNewPassword,
    }: z.infer<typeof PasswordUpdateValidator>) => {
      const payload = { currPassword, newPassword, confirmNewPassword };
      await axios.patch(CHANGE_PASSWORD_URL(user!.id), payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
      router.push("/profile");
      toast({
        title: "Success",
        description: `비밀번호 변경에 성공했습니다.`,
        variant: "default",
      });
    },
  });

  return (
    <>
      {user && (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">비밀번호 변경</CardTitle>
            <CardDescription>비밀번호를 새롭게 설정하세요</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit((e) => updatePassword(e))}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  required
                  type="password"
                  {...register("currPassword")}
                />
              </div>
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
              <Button className="w-full">Change Password</Button>
            </CardContent>
          </form>
        </Card>
      )}
    </>
  );
}

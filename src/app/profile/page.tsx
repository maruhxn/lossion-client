"use client";

import { SEND_VERIFY_EMAIL_URL, VERIFY_EMAIL_URL } from "@/apis/auth-api";
import { MEMBER_BASE_URL } from "@/apis/member-api";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn, getProfileImage } from "@/lib/utils";
import {
  ProfileUpdateRequest,
  ProfileUpdateValidator,
} from "@/lib/validators/profile";
import { UserDetail } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CheckCircleIcon, MailIcon, UserIcon, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { queryClient } from "../../components/providers";

import { AUTH_BASE_URL } from "@/apis/auth-api";
import { useQuery } from "@tanstack/react-query";

export default function ProfilePage() {
  const router = useRouter();
  const accessToken = localStorage.getItem("accessToken");

  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isSend, setIsSend] = useState(false);
  const [payload, setPayload] = useState("");

  const {
    isLoading,
    data: user,
    isError,
    error,
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

  if (isError) {
    router.push("/");
    if (error instanceof AxiosError)
      toast({
        title: "There was an error.",
        description: error.response?.data.message,
        variant: "destructive",
      });
    return;
  }

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<ProfileUpdateRequest>({
    resolver: zodResolver(ProfileUpdateValidator),
    defaultValues: {
      username: user && user.username,
      profileImage: null,
    },
  });

  const newProfileImage = watch("profileImage");

  useEffect(() => {
    if (newProfileImage && newProfileImage.length > 0) {
      const file = newProfileImage[0] as any;
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [newProfileImage]);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async ({
      username,
      email,
      profileImage,
    }: z.infer<typeof ProfileUpdateValidator>) => {
      const form = new FormData();
      if (username) form.append("username", username as string);
      if (email) form.append("email", email as string);
      if (profileImage && profileImage.length > 0)
        form.append("profileImage", profileImage[0]);
      await axios.patch(MEMBER_BASE_URL(user!.id), form, {
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
      location.reload();
      toast({
        title: "Success",
        description: "프로필 변경 성공",
        variant: "default",
      });
    },
  });

  const { mutate: sendVerifyEmail, isPending: isSending } = useMutation({
    mutationFn: async () => {
      await axios.get(SEND_VERIFY_EMAIL_URL, {
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
      setIsSend(true);
      toast({
        title: "Success",
        description: "인증 메일을 발송했습니다.",
        variant: "default",
      });
    },
  });

  const { mutate: verifyEmail, isPending: isVerifying } = useMutation({
    mutationFn: async () => {
      await axios.post(
        VERIFY_EMAIL_URL,
        { payload },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
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
      location.reload();
      toast({
        title: "Success",
        description: "이메일 인증에 성공했습니다.",
        variant: "default",
      });
    },
  });

  const { mutate: withdraw, isPending: isWithdrawing } = useMutation({
    mutationFn: async () => {
      await axios.delete(MEMBER_BASE_URL(user!.id), {
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
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      location.href = "/";
      toast({
        title: "Success",
        description: "회원 탈퇴에 성공했습니다.",
        variant: "default",
      });
    },
  });

  return (
    <>
      {user && (
        <Card className="w-full max-w-3xl mx-auto">
          <form onSubmit={handleSubmit((e) => updateProfile(e))}>
            <CardHeader className="flex flex-col items-start space-y-1">
              <div className="flex items-center space-x-4">
                <Label className="cursor-pointer" htmlFor="profileImage">
                  <Avatar className="w-16 h-16 hover:ring-1 ring-offset-2 ring-gray-400">
                    <div className="relative aspect-square h-full w-full">
                      <Image
                        fill
                        src={
                          avatarPreview
                            ? avatarPreview
                            : getProfileImage(user!.profileImage)
                        }
                        alt="프로필 이미지"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </Avatar>
                  <input
                    className="hidden"
                    id="profileImage"
                    type="file"
                    multiple={false}
                    {...register("profileImage")}
                  />
                </Label>
                <div className="space-y-1.5">
                  <h2 className="text-lg font-bold">{user?.username}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: <span className="font-medium">{user?.accountId}</span>
                  </p>
                </div>
              </div>
            </CardHeader>
            <div className="w-full h-[0.1px] bg-gray-200" />
            <CardContent className="py-5 grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="username" className="flex space-x-1">
                  <UserIcon className="w-4 h-4" />
                  <span>Username</span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    className="max-w-sm"
                    id="username"
                    placeholder={user.username}
                    {...register("username")}
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="flex space-x-1">
                  <MailIcon className="w-4 h-4" />
                  <span>Email</span>
                  <span> - </span>
                  <span
                    className={cn(
                      "flex items-center space-x-1 text-sm font-bold",
                      user?.isVerified ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {user?.isVerified ? (
                      <CheckCircleIcon className="w-4 h-4" />
                    ) : (
                      <XCircleIcon className="w-4 h-4" />
                    )}
                    <span>{user?.isVerified ? "Verified" : "Unverified"}</span>
                  </span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    className="max-w-sm"
                    id="email"
                    placeholder={user?.email}
                    {...register("email")}
                  />
                  <Button
                    size="sm"
                    type="button"
                    disabled={isSending || user?.isVerified}
                    isLoading={isSending}
                    onClick={() => sendVerifyEmail()}
                  >
                    인증 메일 발송
                  </Button>
                </div>
              </div>
              {isSend && (
                <div className="grid gap-1.5">
                  <Label htmlFor="payload" className="flex space-x-1">
                    <UserIcon className="w-4 h-4" />
                    <span>Auth Code</span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      className="max-w-sm"
                      id="payload"
                      value={payload}
                      onChange={(e) => setPayload(e.currentTarget.value)}
                    />
                    <Button
                      size="sm"
                      isLoading={isVerifying}
                      type="button"
                      onClick={() => verifyEmail()}
                    >
                      이메일 인증
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2 mt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                >
                  Cancel
                </Button>
                <Button isLoading={isPending}>Save</Button>
              </div>
            </CardContent>
          </form>
          <div className="w-full h-[0.1px] bg-gray-200" />
          <CardContent className="py-5 grid gap-4">
            <div className="grid gap-2">
              <Label>비밀번호 변경</Label>
              <Button
                size="default"
                onClick={() => router.push("/profile/change-password")}
              >
                비밀번호 변경
              </Button>
            </div>
            <div className="grid gap-2">
              <Label className="">회원 탈퇴</Label>
              <Button
                isLoading={isWithdrawing}
                size="default"
                className="bg-red-500 hover:bg-red-600"
                onClick={() => withdraw()}
              >
                회원 탈퇴
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

"use client";

import { MEMBER_BASE_URL } from "@/apis/member-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar } from "../ui/avatar";

export function ProfileCard({ user }: { user: UserDetail }) {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<ProfileUpdateRequest>({
    resolver: zodResolver(ProfileUpdateValidator),
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
      form.append("username", username as string);
      form.append("email", email as string);
      form.append("profileImage", profileImage[0]);
      await axios.post(MEMBER_BASE_URL(user.id), form);
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
      router.refresh();
      toast({
        title: "Success",
        description: "프로필 변경 성공",
        variant: "default",
      });
    },
  });

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <form>
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
                        : getProfileImage(user.profileImage)
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
              <h2 className="text-lg font-bold">{user.username}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: <span className="font-medium">{user.accountId}</span>
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
                value={user.username}
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
                  user.isVerified ? "text-green-500" : "text-red-500"
                )}
              >
                {user.isVerified ? (
                  <CheckCircleIcon className="w-4 h-4" />
                ) : (
                  <XCircleIcon className="w-4 h-4" />
                )}
                <span>{user.isVerified ? "Verified" : "Unverified"}</span>
              </span>
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                className="max-w-sm"
                id="email"
                value="alice@example.com"
                {...register("email")}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-5">
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </div>
        </CardContent>
      </form>
      <div className="w-full h-[0.1px] bg-gray-200" />
      <CardFooter className="py-3">
        <div className="grid gap-1.5">
          <Label>Change Password</Label>
          <Link className="text-sm underline" href="/profile/change-password">
            Change your password
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

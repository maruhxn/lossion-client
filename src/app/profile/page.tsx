"use client";

import { AUTH_BASE_URL } from "@/apis/auth-api";
import { ProfileCard } from "@/components/component/profile-card";
import { toast } from "@/hooks/use-toast";
import { UserDetail } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const accessToken = localStorage.getItem("accessToken");

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

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

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

  return (
    <div className="container py-6 space-y-6 lg:py-12 xl:space-y-10">
      <ProfileCard user={user!} />
    </div>
  );
}

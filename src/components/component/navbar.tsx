"use client";

import { AUTH_BASE_URL } from "@/apis/auth-api";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import UserAccountNav from "./user-account-nav";

const Navbar = () => {
  const accessToken = localStorage.getItem("accessToken");

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axios.get(AUTH_BASE_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data.data as User;
    },
  });

  return (
    <header className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex gap-2 items-center">
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            LOSSION
          </p>
        </Link>

        {data ? (
          <UserAccountNav user={data} />
        ) : (
          <Link href="/auth/login" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;

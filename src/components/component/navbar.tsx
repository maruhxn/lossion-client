"use client";

import useUser from "@/hooks/use-user";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import UserAccountNav from "./user-account-nav";

const Navbar = () => {
  const { isLoading, data, isError, error } = useUser();

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

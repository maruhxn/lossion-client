"use client";

import { useRouter } from "next/navigation";

export default function Home({
  searchParams,
}: {
  searchParams: { accessToken: string; refreshToken: string };
}) {
  const router = useRouter();

  if (searchParams.accessToken && searchParams.refreshToken) {
    localStorage.setItem("accessToken", searchParams.accessToken);
    localStorage.setItem("refreshToken", searchParams.refreshToken);
    router.replace("/");
  }

  return (
    <main>
      <h1>LOSSION</h1>
    </main>
  );
}

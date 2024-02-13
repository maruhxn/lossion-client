import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProfileImage(profileImage: string) {
  return profileImage.startsWith("http")
    ? profileImage
    : process.env.NEXT_PUBLIC_API_URL + `/files/${profileImage}`;
}

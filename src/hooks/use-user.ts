import { AUTH_BASE_URL } from "@/apis/auth-api";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useUser() {
  const accessToken = localStorage.getItem("accessToken");

  return useQuery({
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
}

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type SearchCond = "제목" | "내용" | "작성자";

export default function Search() {
  const router = useRouter();
  const [searchCond, setSearchCond] = useState<SearchCond>("제목");
  const [searchKey, setSearchKey] = useState<string>("");
  const searchCondArray: SearchCond[] = ["제목", "내용", "작성자"];

  const search = () => {
    router.push(`/?page=1&searchCond=${searchCond}&searchKey=${searchKey}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {searchCond} <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {searchCondArray.map((column, i) => {
            return (
              <DropdownMenuCheckboxItem
                key={i}
                className="capitalize cursor-pointer"
                checked={column === searchCond}
                onSelect={(e) => {
                  e.preventDefault();
                  setSearchCond(column);
                }}
              >
                {column}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="relative w-1/2">
        <Input
          placeholder="검색어를 입력하세요..."
          className="w-full"
          value={searchKey}
          onChange={(e) => setSearchKey(e.currentTarget.value)}
        />
        <div
          onClick={() => search()}
          className="absolute right-0 top-0 border-l-2 p-3 h-full cursor-pointer flex justify-center items-center text-gray-600 hover:text-black"
        >
          <SearchIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

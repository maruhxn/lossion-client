"use client";

import { CATEGORY_BASE_URL } from "@/apis/category-api";
import { TOPIC_BASE_URL } from "@/apis/topic-api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  CreateTopicsRequest,
  CreateTopicsValidator,
} from "@/lib/validators/topics";
import { Category } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Component() {
  const router = useRouter();
  const accessToken = localStorage.getItem("accessToken");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currDate, setCurrDate] = useState<Date>(new Date());

  const {
    isLoading,
    data: categories,
    isError,
    error,
  } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const { data } = await axios.get(CATEGORY_BASE_URL());
      return data.data as Category[];
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

  const form = useForm<CreateTopicsRequest>({
    resolver: zodResolver(CreateTopicsValidator),
    defaultValues: {
      closedAt: currDate.toISOString().substring(0, 16),
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPreviewImages([]);
      const files = Array.from(event.target.files);
      for (let i = 0; i < files.length; i++) {
        setPreviewImages((prev) => [...prev, URL.createObjectURL(files[i])]);
      }
    }
  };

  const { mutate: createTopics, isPending } = useMutation({
    mutationFn: async ({
      categoryId,
      title,
      description,
      firstChoice,
      secondChoice,
      closedAt,
      images,
    }: z.infer<typeof CreateTopicsValidator>) => {
      const form = new FormData();
      if (categoryId) form.append("categoryId", categoryId + "");
      if (title) form.append("title", title as string);
      if (description) form.append("description", description as string);
      if (firstChoice) form.append("firstChoice", firstChoice as string);
      if (secondChoice) form.append("secondChoice", secondChoice as string);
      if (closedAt) form.append("closedAt", closedAt);
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          form.append("images", images[i]);
        }
      }
      await axios.post(TOPIC_BASE_URL(), form, {
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
      router.push("/");
      toast({
        title: "Success",
        description: "토론 생성 성공",
        variant: "default",
      });
    },
  });

  return (
    <div className="w-full py-6">
      <div className="container grid gap-6 px-4 md:grid-cols-2 md:px-6">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit((e) => createTopics(e))}
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories &&
                        categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id + ""}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="제목을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>토론 주제 제목입니다.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Textarea
                      required
                      placeholder="내용을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>토론 내용입니다.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="firstChoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>1번 선택지</FormLabel>
                      <FormControl>
                        <Input
                          required
                          placeholder="1번 선택지를 입력하세요"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>1번 선택지입니다.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="secondChoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2번 선택지</FormLabel>
                      <FormControl>
                        <Input
                          required
                          placeholder="2번 선택지를 입력하세요"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>2번 선택지입니다.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="closedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>토론 종료 시각</FormLabel>
                    <FormControl>
                      <Input
                        id="closedAt"
                        type="datetime-local"
                        max="2077-06-20T21:00"
                        min={currDate.toISOString().substring(0, 16)}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>토론 종료 시각입니다.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="images"
                render={({ field: { onChange }, ...field }) => (
                  <FormItem>
                    <FormLabel>첨부 이미지</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple={true}
                        disabled={form.formState.isSubmitting}
                        {...field}
                        onChange={(event) => {
                          handleFileChange(event);
                          onChange(event.target.files);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      토론에 첨부할 이미지(들)입니다.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex space-x-2 justify-end">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button isLoading={isPending} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
        <div className="space-y-6">
          <Label>Selected Image</Label>
          <div className="grid w-full grid-cols-1 items-stretch gap-4 md:grid-cols-2">
            {previewImages.map((image, i) => (
              <div
                key={i}
                className="flex w-full items-center justify-center p-4 border border-dashed rounded-lg bg-gray-50 border-gray-200 dark:border-gray-800 dark:bg-gray-950"
              >
                <Image
                  alt="Preview Image"
                  className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                  height="200"
                  src={image}
                  width="400"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

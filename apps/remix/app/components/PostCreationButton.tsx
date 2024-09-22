import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@acme/ui";
import { Button, buttonVariants } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Textarea } from "@acme/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";

import { ButtonLoading } from "./ButtonLoading";

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export function PostCreationButton() {
  const [openModal, setOpenModal] = useState(false);
  const { data } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });
  const postCreationMutation = trpc.post.create.useMutation();
  const trpcUtils = trpc.useUtils();
  function onSubmit(values: z.infer<typeof formSchema>) {
    postCreationMutation.mutate(values, {
      onSuccess: () => {
        trpcUtils.post.all.invalidate();
        form.reset();
        setOpenModal(false);
      },
    });
  }

  if (!data?.user)
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "cursor-not-allowed opacity-50",
            )}
          >
            Create post
          </TooltipTrigger>
          <TooltipContent side="left" align="center">
            <p className="text-sm">
              You need to be logged in, to create a post
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild disabled={!data.user}>
        <Button variant="secondary">Create post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a post</DialogTitle>
          <DialogDescription>
            Ad da title and a content to your post here. Click create when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="post title"
                        {...field}
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="post content"
                        {...field}
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              {postCreationMutation.isPending ? (
                <ButtonLoading>Creating...</ButtonLoading>
              ) : (
                <Button type="submit">Create</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

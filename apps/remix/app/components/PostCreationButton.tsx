import { useSession } from "next-auth/react";

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
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { Textarea } from "@acme/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";

export function PostCreationButton() {
  const { data } = useSession();
  return (
    <Dialog>
      <DialogTrigger asChild disabled={!data?.user}>
        {!data?.user ? (
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
        ) : (
          <Button variant="secondary">Create post</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a post</DialogTitle>
          <DialogDescription>
            Ad da title and a content to your post here. Click create when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <Textarea id="content" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

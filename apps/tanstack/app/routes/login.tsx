import { createFileRoute } from "@tanstack/react-router";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@acme/ui/button";

import { PostCreationButton } from "../components/PostCreationButton";
import { PostTable } from "../components/PostTable";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  const session = useSession();
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col gap-2 rounded border p-8">
        {session.status === "authenticated" && session.data.user ? (
          <Button onClick={() => signOut()}>
            Log out as {session.data.user.name}
          </Button>
        ) : (
          <Button onClick={() => signIn("google")}>Sign in with Google</Button>
        )}
      </div>
      <div className="flex w-full justify-end p-4">
        <PostCreationButton />
      </div>
      <PostTable />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@acme/ui/button";

export const Route = createFileRoute("/login")({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col gap-2 rounded border p-8">
        <Button>Sign in with Google</Button>
        <Button>Sign in with Microsoft</Button>
      </div>
    </div>
  );
}

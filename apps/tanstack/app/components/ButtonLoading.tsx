import { ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "@acme/ui/button";

export function ButtonLoading({ children }: { children: React.ReactNode }) {
  return (
    <Button disabled>
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      {children}
    </Button>
  );
}

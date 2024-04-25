import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "remix-theme";

import { Button } from "@acme/ui/button";

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      onClick={() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
      className="p-2"
    >
      {resolvedTheme === "dark" ? <Sun /> : <MoonStar />}
    </Button>
  );
}

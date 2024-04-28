import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "remix-theme";

import { Button } from "@acme/ui/button";

export default () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      onClick={() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
      className="p-2"
    >
      {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

import { signIn, signOut, useSession } from "next-auth/react";

import User from "./User";

export default function RootPage() {
  const { status } = useSession();
  return (
    <div>
      <User />
      {status === "unauthenticated" && (
        <button
          onClick={() => {
            signIn("google");
          }}
        >
          Sign In
        </button>
      )}
      {status === "authenticated" && (
        <button
          onClick={() => {
            signOut();
          }}
        >
          Signout
        </button>
      )}
    </div>
  );
}

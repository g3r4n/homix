import { trpc } from "@/utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";

import User from "./User";

export default function RootPage() {
  const { status } = useSession();
  const posts = trpc.post.all.useQuery();
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
      {posts.data?.map((post) => <div key={post.id}>{post.title}</div>)}
    </div>
  );
}

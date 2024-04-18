import { useSession } from "next-auth/react";

export default function User() {
  const { data: session, status } = useSession();
  return (
    <div>
      <span>{status}</span>
      <span>{session?.user?.name}</span>
    </div>
  );
}

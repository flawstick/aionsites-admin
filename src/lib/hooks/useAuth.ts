import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    // if (!session) router.push("/login"); // Redirect to login if not authenticated

    // @ts-ignore
    // if (session?.status === "unverified") router.push("/login"); // Redirect to verify-request if not verified
  }, [session as any, status, router]);

  useEffect(() => {
    if (session)
      // @ts-ignore
      localStorage.setItem("jwt", session.jwt);
  }, [session]);

  return { session, status };
};

export default useAuth;

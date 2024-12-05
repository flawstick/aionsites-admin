"use client";

import { ReactNode } from "react";
import useAuth from "@/lib/hooks/useAuth";
import { SessionProvider } from "next-auth/react";
import Loading from "@/components/loading";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </SessionProvider>
  );
};

export default AuthProvider;

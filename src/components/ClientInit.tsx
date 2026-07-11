"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

interface ClientInitProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  } | null;
  children: React.ReactNode;
}

export function ClientInit({ user, children }: ClientInitProps) {
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  useEffect(() => {
    setCurrentUser(user);
  }, [user, setCurrentUser]);

  return <>{children}</>;
}

"use client";
import React from "react";
import { SeekerProvider } from "@/providers/seeker";

export default function SeekerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SeekerProvider>{children}</SeekerProvider>;
}

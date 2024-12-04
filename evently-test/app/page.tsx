"use client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Si el usuario ya está autenticado, redirige a la página protegida
  redirect("/content");
}

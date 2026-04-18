import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import GeneratorClient from "./GeneratorClient";

export const dynamic = "force-dynamic";

export default async function GeneratePage() {
  const session = await getSession();
  if (!session?.user) redirect("/signin");
  const tier = (session.user as any).tier || "FREE";
  const freeUsed = (session.user as any).freeUsed || false;
  return <GeneratorClient tier={tier} freeUsed={freeUsed} />;
}

import { getUidFromCookie, sessionLogout } from "@/lib/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/lib/firebase/client";
import HeaderComponent from "@/app/ui/header";

export default async function Home() {
  await auth.authStateReady();
  try {
    const user = await getUidFromCookie();
    if (!user) {
      const sessionId = cookies().get("session");
      !sessionId && (await sessionLogout());
      redirect("/login");
    }
  } catch (error) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <HeaderComponent />
    </main>
  );
}

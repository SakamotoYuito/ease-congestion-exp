import MenuComponent from "./menu";
import { verifyExistUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HeaderComponent() {
  const isExistUser = await verifyExistUser();
  isExistUser || redirect("/login");

  return (
    <div className="flex justify-between shadow-md fixed top-0 w-full">
      <div className="p-4 font-mono text-xl">
        <h1>KSU 混雑分散実験</h1>
      </div>
      <div className="p-4 font-mono text-sm">
        <MenuComponent />
      </div>
    </div>
  );
}

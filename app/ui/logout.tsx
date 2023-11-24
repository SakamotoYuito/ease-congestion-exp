import { logout } from "@/lib/firebase/client";

export default function LogoutComponent() {
  return <button onClick={logout}>ログアウト</button>;
}

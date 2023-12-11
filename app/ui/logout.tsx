import { logout } from "@/lib/authentication";

export default function LogoutComponent() {
  return <button onClick={logout}>ログアウト</button>;
}

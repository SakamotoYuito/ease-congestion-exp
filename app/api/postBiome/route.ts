import { adminDB } from "@/lib/firebase/server";
import { getUserFromCookie } from "@/lib/session";

export async function POST(req: Request) {
  const user = await getUserFromCookie();
  if (!user) return Response.json({ ok: false, message: "failed" });
  const uid = user.uid;
  const insertData = await req.json();
  const postData = insertData.postData;
  postData.date = new Date(postData.date);
  postData.uid = uid;
  postData.reward = 0;
  await adminDB.collection("biome").add(postData);
  return Response.json({ message: "success" });
}

"use server";

import { adminDB } from "@/lib/firebase/server";

export async function sample(formData: FormData) {
  console.log("formData", formData.get("name"));
  await adminDB.collection("sample").add({ name: formData.get("name") });
}

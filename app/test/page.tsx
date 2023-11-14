"use client";

import { sample } from "@/lib/actions";
import TestComponent from "../ui/test";
import { useAuthContext } from "../authContext";

export default function Test() {
  const { userInfo } = useAuthContext();
  const currentUserName = userInfo?.email?.split("@")[0];
  console.log(currentUserName);
  return (
    <div>
      <TestComponent action={sample} />
      <h2>{currentUserName}</h2>
    </div>
  );
}

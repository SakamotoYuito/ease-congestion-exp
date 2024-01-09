import type { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: Request) {
  if (req.method === "POST") {
    // 環境変数から管理者パスワードを取得
    const adminPassword = process.env.ADMIN_PASSWORD;

    // リクエストからパスワードを取得
    const password = await req.json();

    if (password === adminPassword) {
      // パスワードが一致する場合、認証成功
      return Response.json({ ok: true });
    } else {
      // パスワードが一致しない場合、認証失敗
      return Response.json({ ok: false });
    }
  } else {
    // POST以外のメソッドは許可しない
    return Response.json({ ok: false });
  }
}

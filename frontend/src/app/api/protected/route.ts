import authOptions from "@/lib/authOptions";
import getServerSession from "next-auth";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(req, authOptions);
  if (session) {
    return NextResponse.json({data: "Protected data"});
  }
  return NextResponse.json({message: "Not authenticated"}, {status: 401});
}

import {NextResponse} from "next/server";
import db from "@/lib/dbconnect";
import {verifyPassword} from "@/lib/auth"; // Define verifyPassword if not done

export async function POST(req: Request) {
  const {email, password} = await req.json();

  try {
    const user = await db.user.findUnique({where: {email}});

    if (user && (await verifyPassword(password, user.password))) {
      return NextResponse.json({message: "Logged in successfully"});
    } else {
      return NextResponse.json({message: "Invalid credentials"}, {status: 401});
    }
  } catch (error) {
    return NextResponse.json({error: "Database error"}, {status: 500});
  }
}

import {NextResponse} from "next/server";
import db from "@/lib/dbconnect";

export async function POST(req: Request) {
  const {name, email} = await req.json();

  try {
    const user = await db.user.create({
      data: {
        name,
        email,
      },
    });

    return NextResponse.json({message: "Registered successfully"});
  } catch (error) {
    return NextResponse.json({error: "Failed to register user"}, {status: 500});
  }
}

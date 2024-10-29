import dbConnect from "@/lib/dbconnect";
import User from "@/models/user";

export default async function handler(req, res) {
  await dbConnect(); // Connect to MongoDB

  if (req.method === "POST") {
    const {email, name, image} = req.body;

    try {
      // Check if the user already exists
      let user = await User.findOne({email});

      if (!user) {
        // Create a new user if they don't exist
        user = await User.create({email, name, image});
        return res
          .status(201)
          .json({message: "User created successfully", user});
      }

      return res.status(200).json({message: "User exists", user});
    } catch (error) {
      console.error("Error checking/creating user:", error);
      return res.status(500).json({error: "Error checking/creating user"});
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

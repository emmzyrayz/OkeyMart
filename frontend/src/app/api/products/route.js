import dbConnect from "../../../lib/dbconnect"; 
import Product from "../../../models/product"; 

export async function GET() {
  await dbConnect(); // Connect to the database

  try {
    const products = await Product.find({}); // Fetch all products
    // console.log("Products fetched:", products);
    return new Response(JSON.stringify(products), {
      status: 200, 
      headers: {
      'content-type': 'application/json'
    }
  });
  } catch (error) {
    return new Response(
      JSON.stringify({message: "Error fetching products", error}),
      {status: 500}
    );
  }
}

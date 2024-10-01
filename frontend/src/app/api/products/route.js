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

export async function POST(req) {
  await dbConnect(); // Connect to the database

  try {
    const body = await req.json(); // Parse incoming request body

    // Create a new product using the request data
    const newProduct = new Product({
      name: body.name,
      description: body.description,
      price: body.price,
      countInStock: body.countInStock,
      images: body.images,
      mainImage: body.mainImage, // Ensure this is passed in correctly
      categories: body.categories, // Ensure this is correctly structured
      filters: body.filters,
      discount: body.discount,
      featured: body.featured,
      trending: body.trending,
      top: body.top,
      today: body.today,
      rating: body.rating,
    });

    // Save the product in the database
    await newProduct.save();

    return new Response(JSON.stringify(newProduct), {
      status: 201,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    // Log the actual error for debugging
    console.error("Error creating product:", error);

    return new Response(
      JSON.stringify({
        message: "Error creating product",
        error: error.message || error,
      }),
      {status: 500}
    );
  }
}
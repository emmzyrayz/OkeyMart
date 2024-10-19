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
    console.log("Received product data:", body);

    // Create a new product using the request data
    const newProduct = new Product({
      name: body.name,
      description: body.description,
      price: body.price,
      countInStock: body.countInStock,
      images: body.images,
      mainImage: body.mainImage,
      category: body.category,
      subcategory: body.subcategory,
      categorySpecificFields: {
        fieldValues: new Map(Object.entries(body.categorySpecificFields)),
      },
      discount: body.discount,
      featured: body.featured,
      trending: body.trending,
      top: body.top,
      today: body.today,
      rating: body.rating,
      video: body.video,
      youtubeLink: body.youtubeLink,
      state: body.state,
      lga: body.lga,
      bulkNumber: body.bulkNumber,
      bulkPrice: body.bulkPrice,
    });

    console.log("New product object:", newProduct);

    // Save the product in the database
    const savedProduct = await newProduct.save();
    console.log("Saved product:", savedProduct); // Log the saved product

    return new Response(JSON.stringify(savedProduct), {
      status: 201,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    // Log the actual error for debugging
    console.error("Error creating product:", error);
    console.error("Error stack:", error.stack); // Log the full error stack

    return new Response(
      JSON.stringify({
        message: "Error creating product",
        error: error.message || error,
        stack: error.stack,
      }),
      {status: 500}
    );
  }
}

export async function PUT(req, {params}) {
  await dbConnect(); // Connect to the database
  const {id} = params; // Get the product ID from params

  try {
    const body = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedProduct) {
      return new Response(JSON.stringify({message: "Product not found"}), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedProduct), {
      status: 200,
      headers: {"content-type": "application/json"},
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return new Response(
      JSON.stringify({message: "Error updating product", error}),
      {status: 500}
    );
  }
}

export async function DELETE(req, {params}) {
  await dbConnect(); // Connect to the database
  const {id} = params; // Get the product ID from params

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return new Response(JSON.stringify({message: "Product not found"}), {
        status: 404,
      });
    }

    return new Response(null, {status: 204}); // No content response
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(
      JSON.stringify({message: "Error deleting product", error}),
      {status: 500}
    );
  }
}
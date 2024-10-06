import dbConnect from "../../../../../lib/dbconnect";
import Product from "../../../../../models/product";

export async function GET(req, {params}) {
  await dbConnect();
  const {filterTag, productId} = params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return new Response(JSON.stringify({message: "Product not found"}), {
        status: 404,
      });
    }

    // Verify the product belongs to the specified filter
    const belongsToFilter = product[filterTag] === true;
    if (!belongsToFilter) {
      return new Response(
        JSON.stringify({message: "Product not found in this category"}),
        {status: 404}
      );
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {"Content-Type": "application/json"},
    });
  } catch (error) {
    return new Response(
      JSON.stringify({message: "Error fetching product", error: error.message}),
      {status: 500}
    );
  }
}

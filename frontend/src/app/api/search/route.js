// app/api/search/route.js
import dbConnect from "../../../lib/dbconnect";
import Product from "../../../models/product";

export async function GET(req) {
  await dbConnect();

  try {
    const {searchParams} = new URL(req.url);
    const keyword = searchParams.get("keyword");

    if (!keyword) {
      return new Response(
        JSON.stringify({message: "Keyword is required for search"}),
        {status: 400, headers: {"content-type": "application/json"}}
      );
    }

    const query = {
      $or: [
        {name: {$regex: keyword, $options: "i"}},
        {category: {$regex: keyword, $options: "i"}},
        {subcategory: {$regex: keyword, $options: "i"}},
      ],
    };

    const products = await Product.find(query);
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {"content-type": "application/json"},
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error searching products",
        error: error.message,
      }),
      {status: 500, headers: {"content-type": "application/json"}}
    );
  }
}

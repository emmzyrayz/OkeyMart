// app/api/products/[filterTag]/[productId]/route.ts
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import Product from '@/models/product';

export async function GET(
  req: NextRequest,
  { params }: { params: { filterTag: string; productId: string } }
) {
  try {
    await dbConnect();
    const { filterTag, productId } = params;

    // Validate MongoDB ObjectId
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return new Response(
        JSON.stringify({ message: 'Invalid product ID format' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return new Response(
        JSON.stringify({ message: 'Product not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify the product belongs to the specified filter
    if (filterTag !== 'search' && !product[filterTag as keyof typeof product]) {
      return new Response(
        JSON.stringify({ message: 'Product not found in this category' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify(product),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
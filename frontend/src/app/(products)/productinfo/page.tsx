import { ProductNotFound } from "@/components/product-notfound/page";
import './productss.css';





export default function Products() {
    return (
      <div>
        <ProductNotFound />
        {/* <ProductInfo product={product}/> */}
      </div>
    );
}
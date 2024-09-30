
import Action from "@/components/action/page";
import { BestSelling } from "@/components/best-selling/page";
import Category from "@/components/category/page";
import Featured from "@/components/featured/page";
import { Mbanner } from "@/components/m-banner/page";
import Random from "@/components/random/page";
import Show from "@/components/show/page";
import Today from "@/components/today/page";
// import LoadingScreen from "@/components/loadingscreen/page";
import '@fontsource/inter/400.css';  // Inter Regular
import '@fontsource/inter/500.css';  // Inter Medium
import '@fontsource/inter/700.css';  // Inter Bold

import '@fontsource/poppins/400.css';  // Poppins Regular
import '@fontsource/poppins/500.css';  // Poppins Medium
import '@fontsource/poppins/700.css';  // Poppins Bold

export default function Home() {
  return (
    <div>
      <Mbanner />
      {/* <LoadingScreen /> */}
      <Today />
      <Category />
      <BestSelling />
      <Random />
      <Show />
      <Featured />
      <Action />
    </div>
  );
}

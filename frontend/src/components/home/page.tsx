import Action from "@/components/action/page";
import {BestSelling} from "@/components/best-selling/page";
import Category from "@/components/category/page";
import Featured from "@/components/featured/page";
import {Mbanner} from "@/components/m-banner/page";
import Random from "@/components/random/page";
import Show from "@/components/show/page";
import Today from "@/components/today/page";

export const HomePage = () => {
  return (
    <div className="">
      <Mbanner />
      <Today />
      <Category />
      <BestSelling />
      <Random />
      <Show />
      <Featured />
      <Action />
    </div>
  );
};

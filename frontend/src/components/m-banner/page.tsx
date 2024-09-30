import './m-banner.css';
import { Banner } from "@/components/banner/page";
import { SortCat } from "@/components/cat-menu/page";

export const Mbanner = () => {
    return (
      <div className="m-banner_section flex flex-row w-full items-center justify-center">
        <SortCat className="sortcat" />
        <span className="line"></span>
        <Banner className="banner" />
      </div>
    );
}
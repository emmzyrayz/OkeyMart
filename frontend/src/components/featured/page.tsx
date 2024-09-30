import './featured.css';
import Image from 'next/image';
import Ps5 from '../../assets/img/products/ps5-slim.png';
import Woman from '../../assets/img/products/at-woman.png';
import Speaker from "../../assets/img/products/speaker.png";
import Perfume from "../../assets/img/products/perfume.png";

export default function Featured() {
    return (
      <div className="featured_section w-full flex flex-col">
        <div className="category_top flex flex-row items-center gap-2">
          <div className="category_red"></div>
          <h2>Featured</h2>
        </div>
        <div className="category_header flex flex-row w-full">
          <div className="header-title">
            <span>New Arrival</span>
          </div>
        </div>
        <div className="featured_grid">
          <div className="col-1 flex flex-col relative">
            <div className="grid_image h-full">
              <Image src={Ps5} width={500} height={300} alt="product" />
            </div>
            <div className="grid_detail flex flex-col absolute">
              <h3>PS5 Slim</h3>
              <span className="grid_det">
                Black and White version of the PS5 coming out on sale.
              </span>

              <div className="grid_btn">
                <span className="underline">Shop Now</span>
              </div>
            </div>
          </div>
          <div className="col-2 flex flex-col relative">
            <div className="grid_image">
              <Image src={Woman} width={500} height={300} alt="product" />
            </div>
            <div className="grid_detail flex flex-col absolute">
              <h3>Women&apos;s Collection</h3>
              <span className="grid_det">
                Featured woman collections that gives you another vibe.
              </span>

              <div className="grid_btn">
                <span className="underline">Shop Now</span>
              </div>
            </div>
          </div>
          <div className="col-3 flex flex-col relative">
            <div className="grid_image">
              <Image src={Speaker} width={500} height={300} alt="product" />
            </div>
            <div className="grid_detail flex flex-col absolute">
              <h3>Speakers</h3>
              <span className="grid_det">Amazon wireless speakers.</span>

              <div className="grid_btn">
                <span className="underline">Shop Now</span>
              </div>
            </div>
          </div>
          <div className="col-4 flex flex-col relative">
            <div className="grid_image">
              <Image src={Perfume} width={500} height={300} alt="product" />
            </div>
            <div className="grid_detail flex flex-col absolute">
              <h3>Perfume</h3>
              <span className="grid_det">GUCCI INTENSE OUD EDP.</span>

              <div className="grid_btn">
                <span className="underline">Shop Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
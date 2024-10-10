'use client'

import { UploadProductImage } from '@/components/Upload/image/page';
import './prod-upload.css';
import { FaBoxesStacked } from 'react-icons/fa6';
import { UploadProductVideo } from '@/components/Upload/video/page';
import { WaveInput } from '@/components/input/waveinput';
import { useState } from 'react';
import LocationSelector from '@/components/locationselect/locationselector';
import DynamicProductForm from '@/components/dynamicproductform/dynamicProductForm';

export default function ProdUplink() {

  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleLocationChange = (state: string, lga: string) => {
    // Handle the selected location
    console.log(`Selected location: ${lga}, ${state}`);
  };

    return (
      <div className="prod_uplink_section w-full h-full flex flex-col items-start justify-center gap-5">
        <div className="produplink_top w-full">
          <div className="produplink_text flex flex-row items-center justify-start gap-3">
            <span className="text-[22px] font-semibold">Post an Ad</span>
            <FaBoxesStacked className="text-[22px]" />
          </div>
        </div>

        <div className="produplink_container w-full flex flex-col items-start">
          <div className="produplink_con w-full flex flex-col items-start justify-center gap-5">
            <div className="media_uplink_con flex flex-col gap-3">
              <p className="text-[22px] font-semibold">Product Media</p>
              <div className="img_uplink">
                <div className="img_head flex w-full items-start justify-start">
                  <h2 className="flex flex-row items-start relative gap-1 w-full justify-start">
                    <p className="text-[18px]">Select Product Photos</p>{" "}
                    <span className="font-[400] text-[10px] text-clip opacity-40 flex pt-1.5">
                      (Must be 5 photos)
                    </span>
                  </h2>
                </div>
                <div className="img_con">
                  <UploadProductImage />
                </div>
              </div>

              <div className="video_uplink">
                <div className="video_head w-full items-start justify-start">
                  <h2 className="flex flex-row items-start relative gap-1 w-full justify-start">
                    <p className="text-[18px]">Select Product Live Demo</p>{" "}
                    <span className="font-[400] text-[10px] text-clip opacity-40 flex pt-1.5">
                      (Must be clear and brief)
                    </span>
                  </h2>
                </div>
                <div className="video_con">
                  <UploadProductVideo />
                </div>
              </div>
            </div>

            <div className="category_uplink_ dark-glass flex flex-col w-full p-2 gap-2">
              <span className="text">Product Details</span>
              <div className="uplink_name flex flex-row items-center justify-start gap-1 w-full">
                <WaveInput
                  label="Name*"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="uplink_ext_link flex flex-row items-center justify-start gap-1 w-full">
                <WaveInput
                  label="Link to Youtube or Facebook Video"
                  name="link"
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="uplink_location">
                <form action="" className="w-full h-full py-4">
                  <LocationSelector onChange={handleLocationChange} />
                </form>
              </div>


              <DynamicProductForm />
            </div>

            <div className="category_uplink_ dark-glass flex flex-col w-full p-2 gap-2">
              <span className="text">Product Price</span>
              <div className="uplink_price flex flex-row items-center justify-start gap-1 w-full">
                <WaveInput
                  label="Price*"
                  name="price"
                  type="number"
                  required
                  value={name}
                  onChange={handleNameChange}
                />
              </div>

              <span className="text">Product Bulk Price</span>
              <div className="bulk_price flex flex-row items-center justify-center w-full gap-1">
                <div className="uplink_bulk-price flex flex-row items-center justify-start  w-[80%]">
                  <WaveInput
                    label="bulk_number"
                    name="bulknumber"
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                  />
                </div>
                <span className="flex flex-row items-center justify-center w-[10%] h-full  text-[20px] text-[--text1] font-medium ">
                  for
                </span>
                <div className="uplink_bulk-price flex flex-row items-center justify-start gap-1 w-[80%]">
                  <WaveInput
                    label="bulk_price"
                    name="bulkprice"
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
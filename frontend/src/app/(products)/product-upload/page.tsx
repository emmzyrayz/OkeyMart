import './prod-upload.css';
import { FaBoxesStacked } from 'react-icons/fa6';

export default function ProdUplink() {

    return (
      <div className="prod_uplink_section">
        <div className="produplink_top">
          <div className="produplink_text">
            <span>Post an Ad</span>
            <FaBoxesStacked />
          </div>
        </div>

        <div className="produplink_container">
          <div className="produplink_con">
            <div className="media_uplink_con">
              <div className="img_uplink">
                <div className="img_head">
                  <h2 className="flex flex-col items-start relative gap-1 justify-end">
                    Select Product Photos{" "}
                    <span className="font-[400] text-[10px] text-clip opacity-40 absolute bottom-1 left-[21%]">
                      (Must be 5 photos)
                    </span>
                  </h2>
                </div>
                <div className="img_con">
                  <input
                    type="file"
                    name="Images"
                    id="image"
                    placeholder="Select images"
                    className=""
                  />
                  <input
                    type="file"
                    name="Images"
                    id="image"
                    placeholder="Select images"
                    className=""
                  />
                  <input
                    type="file"
                    name="Images"
                    id="image"
                    placeholder="Select images"
                    className=""
                  />
                  <input
                    type="file"
                    name="Images"
                    id="image"
                    placeholder="Select images"
                    className=""
                  />
                  <input
                    type="file"
                    name="Images"
                    id="image"
                    placeholder="Select images"
                    className=""
                  />
                </div>
              </div>

              <div className="video_uplink">
                <div className="video_head">
                  <h2 className="flex flex-col items-start relative gap-1 justify-end">
                    Select Product Live Demo{" "}
                    <span className="font-[400] text-[10px] text-clip opacity-40 absolute bottom-1 left-[24%]">
                      (Must be clear and brief)
                    </span>
                  </h2>
                </div>
                <div className="video_con">
                    <input type="file" name="video" id="video" />
                </div>
              </div>
            </div>

            <div className="category_uplink_">
                <div className="uplink_name">
                    <input type="text" name="name" id="name" />
                </div>
            </div>
          </div>
        </div>
      </div>
    );
}
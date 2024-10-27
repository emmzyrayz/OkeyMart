'use client'
import { UploadProductImage } from '@/components/Upload/image/page';
import './prod-upload.css';
import { FaBoxesStacked } from 'react-icons/fa6';
import { UploadProductVideo } from '@/components/Upload/video/page';
import { WaveInput } from '@/components/input/waveinput';
import LocationSelector from '@/components/locationselect/locationselector';
import DynamicProductForm from '@/components/dynamicproductform/dynamicProductForm';
import { useProductUpload } from '@/context/productUpload/productUploadContext';


interface SimpleFields {
  [key: string]: string | number | boolean;
}



export default function ProdUplink() {

  const {state, dispatch, uploadProduct} = useProductUpload();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({type: "SET_FORM_DATA", payload: {name: e.target.value}});
  };

  const handleLocationChange = (state: string, lga: string) => {
    dispatch({type: "SET_FORM_DATA", payload: {state, lga}});
  };

  const handleYoutubeLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({type: "SET_YOUTUBE_LINK", payload: e.target.value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted!");
    console.log("Form submitted without preventDefault!");
    // Ensure the form is valid before proceeding
    if (state.isFormValid) {
      try {
        // Prepare the final product data to be submitted to the backend

        // Call the upload function to send data to the server or database
        await uploadProduct();

        // Show success message to the user
        alert("Product successfully uploaded!");
        // Optionally, redirect the user or clear the form
        // Handle successful upload (e.g., show success message, redirect)
        console.log("Product successfully uploaded!");
      } catch (error) {
        // Show error message to the user
        alert(
          "Upload failed: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
        // Handle upload error (e.g., show error message)
        console.error("Upload failed:", error);
      }
    } else {
      // Show validation error message to the user
      alert("Please fill in all required fields correctly before submitting.");
    }
  };

  

  console.log("Form Valid:", state.isFormValid);
  console.log("Is Uploading:", state.isUploading);


    return (
      <form
        onSubmit={handleSubmit}
        className="prod_uplink_section w-full h-full flex flex-col items-start justify-center gap-5"
      >
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
                  <UploadProductImage
                    images={state.images}
                    setImages={(images) =>
                      dispatch({type: "SET_IMAGES", payload: images})
                    }
                  />
                </div>
              </div>

              <div className="video_uplink">
                <div className="video_head w-full items-start justify-start">
                  <h2 className="flex flex-row items-start relative gap-1 w-full justify-start">
                    <p className="text-[18px]">Select Product Live Demo</p>{" "}
                    <span className="font-[400] text-[10px] text-clip opacity-40 flex pt-1.5">
                      (Must be clear and brief - optional)
                    </span>
                  </h2>
                </div>
                <div className="video_con">
                  <UploadProductVideo
                    video={state.video} // Correctly pass state.video
                    setVideo={(video) =>
                      dispatch({type: "SET_VIDEO", payload: video})
                    }
                  />
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
                  value={state.formData.name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="uplink_ext_link flex flex-row items-center justify-start gap-1 w-full">
                <WaveInput
                  label="Link to Youtube or Facebook Video"
                  name="link"
                  type="text"
                  required
                  value={state.youtubeLink}
                  onChange={handleYoutubeLinkChange}
                />
              </div>

              <div className="uplink_location">
                <LocationSelector onChange={handleLocationChange} />
              </div>

              <DynamicProductForm
                category={state.formData.category}
                subcategory={state.formData.subcategory}
                fields={state.formData.categorySpecificFields}
                onChange={(fields: SimpleFields) => {
                  // Validate fields before dispatching
                  dispatch({
                    type: "SET_FORM_DATA",
                    payload: {categorySpecificFields: fields},
                  });
                }}
                errors={state.errors}
              />
            </div>

            <div className="category_uplink_ dark-glass flex flex-col w-full p-2 gap-2">
              <span className="text">Product Price</span>
              <div className="uplink_price flex flex-row items-center justify-start gap-1 w-full">
                <WaveInput
                  label="Price*"
                  name="price"
                  type="number"
                  required
                  value={state.formData.price.toString()} // Ensure value is a string
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FORM_DATA",
                      payload: {price: Number(e.target.value)},
                    })
                  }
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
                    value={state.formData.bulkNumber || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FORM_DATA",
                        payload: {bulkNumber: e.target.value},
                      })
                    }
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
                    value={state.formData.bulkPrice || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FORM_DATA",
                        payload: {bulkPrice: e.target.value},
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="productuplink_buttoncon">
          {state.errors.name && (
            <p className="error-message">{state.errors.name}</p>
          )}
          <button
            type="submit"
            disabled={!state.isFormValid || state.isUploading}
            className="upload_btn p-3 bg-[--success-gradient] hover:bg-[--btn-hover] rounded cursor-pointer"
          >
            <span className="text-[--text] font-[600] text-[18px] ">
              {state.isUploading
                ? `Uploading... ${state.uploadProgress}%`
                : "Upload Ad"}
            </span>
          </button>
        </div>
      </form>
    );
}
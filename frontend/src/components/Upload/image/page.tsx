
import React, { useState } from 'react';
import ReactCrop, { PixelCrop } from 'react-image-crop';
import { TiDelete } from 'react-icons/ti';
import {RiImageAddFill} from "react-icons/ri";
import {FaCropSimple} from "react-icons/fa6";
import 'react-image-crop/dist/ReactCrop.css';
import './image.css';

export const UploadProductImage: React.FC = () => {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [croppingImage, setCroppingImage] = useState<string | null>(null);
    const [cropConfig, setCropConfig] = useState<PixelCrop>({
      unit: "px", // Can be 'px' or '%' for percentage-based crop
      width: 100,
      height: 100,
      x: 0,
      y: 0,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);

        // Filter to allow only image files
        const validImages = files.filter((file) =>
          file.type.startsWith("image/")
        );

        if (validImages.length < 5) {
          alert("Please select at least 5 images.");
          return;
        }

        const imagePreviews = validImages.map((file) =>
          URL.createObjectURL(file)
        );

        setSelectedImages(imagePreviews);
      }
    };

    const removeImage = (index: number) => {
      const newImages = [...selectedImages];
      newImages.splice(index, 1);
      setSelectedImages(newImages);
    };

    const startCropping = (src: string) => {
      setCroppingImage(src);
    };

    const onCropComplete = (crop: PixelCrop) => {
      // Handle saving the crop here
      console.log("Crop completed: ", crop);
    };

    return (
      <div className="uploadimg_section relative w-full h-full">
        <div className="img_conn">
          <RiImageAddFill className="image-add-icon" />
          <input
            type="file"
            name="Images"
            id="image"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="image-input"
          />
        </div>

        {/* Image previews */}
        <div className="image-preview-container">
          {selectedImages.map((src, index) => (
            <div key={index} className="image-preview">
              <img src={src} alt={`preview-${index}`} />
              <div className="image-preview-btn items-center justify-center w-full gap-5">
                <button className='' onClick={() => removeImage(index)}>
                  <TiDelete className="fa" />
                </button>
                <button onClick={() => startCropping(src)}>
                  <FaCropSimple className="fa" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Image cropping */}
        {croppingImage && (
          <div className="crop-container absolute top-0 left-0 w-full flex flex-col gap-2">
            <ReactCrop
              crop={cropConfig}
              onChange={(newCrop) => setCropConfig(newCrop)}
              onComplete={onCropComplete}
            >
              <img className="rounded-md" src={croppingImage} alt="cropping" />
            </ReactCrop>
            <button
              className="bg-[--secondary2] hover:bg-[--btn-hover] hover:text-[--text1] p-2 rounded text-[--text] font-medium text-[18px] w-fit right-2"
              onClick={() => setCroppingImage(null)}
            >
              Done
            </button>
          </div>
        )}
      </div>
    );
}
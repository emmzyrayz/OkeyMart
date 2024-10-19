
import React, {useState, useRef} from "react";
import Image from 'next/image';
import ReactCrop, { PixelCrop } from 'react-image-crop';
import { TiDelete } from 'react-icons/ti';
import {RiImageAddFill} from "react-icons/ri";
import {FaCropSimple} from "react-icons/fa6";
import 'react-image-crop/dist/ReactCrop.css';
import './image.css';

interface UploadProductImageProps {
  images: File[];
  setImages: (images: File[]) => void;
}

export const UploadProductImage: React.FC<UploadProductImageProps> = ({
  images,
  setImages,
}) => {
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [cropConfig, setCropConfig] = useState<PixelCrop>({
    unit: "px", // Can be 'px' or '%' for percentage-based crop
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (files.length !== 5) {
        alert("Please select exactly 5 images.");
        return;
      }

      // Update the context with the new images
      setImages(files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const startCropping = (src: string) => {
    setCroppingImage(src);
  };

  // const onCropComplete = async (crop: PixelCrop) => {
  //   if (imageRef.current && canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     const image = imageRef.current;

  //     // Set canvas dimensions
  //     const pixelRatio = window.devicePixelRatio;
  //     canvas.width = crop.width * pixelRatio;
  //     canvas.height = crop.height * pixelRatio;

  //     // Set the cropping area
  //     const ctx = canvas.getContext("2d");
  //     ctx!.drawImage(
  //       image,
  //       crop.x * pixelRatio,
  //       crop.y * pixelRatio,
  //       crop.width * pixelRatio,
  //       crop.height * pixelRatio,
  //       0,
  //       0,
  //       crop.width * pixelRatio,
  //       crop.height * pixelRatio
  //     );

  //     // Convert canvas to Blob
  //     const blob = await new Promise<Blob | null>((resolve) => {
  //       canvas.toBlob((blob) => {
  //         resolve(blob);
  //       }, "image/jpeg");
  //     });

  //     if (blob) {
  //       const newFile = new File([blob], "croppedImage.jpg", {
  //         type: "image/jpeg",
  //       });
  //       // Directly set the new images array
  //       const newImages = [...images, newFile];
  //       setImages(newImages); // Directly set the new images array
  //     }
  //   }
  // };

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    // Set canvas dimensions
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    // Set the cropping area
    ctx!.drawImage(
      image,
      crop.x * pixelRatio,
      crop.y * pixelRatio,
      crop.width * pixelRatio,
      crop.height * pixelRatio,
      0,
      0,
      crop.width * pixelRatio,
      crop.height * pixelRatio
    );

    return canvas.toDataURL("image/jpeg");
  };

  const onCropComplete = async (crop: PixelCrop) => {
    if (imageRef.current && canvasRef.current) {
      const image = imageRef.current;

      // Get the cropped image data URL
      const croppedImageDataUrl = getCroppedImg(image, crop);

      // Convert the data URL to a Blob
      const blob = await fetch(croppedImageDataUrl).then((res) => res.blob());

      if (blob) {
        const newFile = new File([blob], "croppedImage.jpg", {
          type: "image/jpeg",
        });
        // Directly set the new images array
              const newImages = [...images, newFile];
              setImages(newImages); // Directly set the new images array
      }
    }
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
        {images.map((file, index) => (
          <div key={index} className="image-preview">
            <Image
              src={URL.createObjectURL(file)} // Use object URL for preview
              width={100}
              height={100}
              alt={`preview-${index}`}
              ref={imageRef}
            />
            <div className="image-preview-btn items-center justify-center w-full gap-5">
              <button onClick={() => removeImage(index)}>
                <TiDelete className="fa" />
              </button>
              <button onClick={() => startCropping(URL.createObjectURL(file))}>
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
            <Image
              className="rounded-md"
              width={100}
              height={100}
              src={croppingImage}
              alt="cropping"
              ref={imageRef}
            />
            <canvas ref={canvasRef} />
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
};
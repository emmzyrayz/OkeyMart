import imageCompression from "browser-image-compression";
import {FFmpeg} from "@ffmpeg/ffmpeg";
import {fetchFile, toBlobURL} from "@ffmpeg/util";

export const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1, // Max file size in MB
      maxWidthOrHeight: 1920, // Max width or height in pixels
      useWebWorker: true,
      fileType: "image/jpeg", // Force JPEG format
    };

  // Implement image compression logic here
  try {
    const compressedFile = await imageCompression(file, options);

    // Convert the compressed file to a JPEG if it's not already
    if (compressedFile.type !== "image/jpeg") {
      const blob = await imageCompression.getFilefromDataUrl(
        await imageCompression.getDataUrlFromFile(compressedFile),
        "image.jpg",
        new Date().getTime()
      );
      return new File([blob], `${file.name.split(".")[0]}.jpg`, {
        type: "image/jpeg",
      });
    }

    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
  // You can use libraries like browser-image-compression
  // Return the compressed image file
};

export const compressVideo = async (file: File): Promise<File> => {
  const ffmpeg = new FFmpeg();

  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`/ffmpeg-core.js`, `text/javascript`),
      wasmURL: await toBlobURL(`/ffmpeg-core.wasm`, `application/wasm`),
    });

    await ffmpeg.writeFile(file.name, await fetchFile(file));


    await ffmpeg.exec([
      "-i",
      file.name,
      "-c:v",
      "libvpx-vp9",
      "-crf",
      "30",
      "-b:v",
      "0",
      "-b:a",
      "128k",
      "-c:a",
      "libopus",
      "output.webm",
    ]);

    const data = await ffmpeg.readFile("output.webm");
    const compressedBlob = new Blob([data], {type: "video/webm"});

    return new File([compressedBlob], `${file.name.split(".")[0]}.webm`, {
      type: "video/webm",
    });
  } catch (error) {
    console.error("Error compressing video:", error);
    throw error;
  } finally {
    await ffmpeg.deleteFile(file.name);
    await ffmpeg.deleteFile("output.webm");
  }
};

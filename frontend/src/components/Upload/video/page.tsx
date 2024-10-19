import React, {useState, useRef, useEffect} from "react";
import {RiVideoAddFill, RiPencilFill,  } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import "./video.css";

interface Enhancement {
    brightness: number;
    contrast: number;
}

interface CutRange {
    start: number;
    end: number;
}

interface UploadProductVideoProps {
  video: File | null;
  setVideo: (video: File | null) => void;
}

export const UploadProductVideo: React.FC<UploadProductVideoProps> = ({
  video,
  setVideo,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | undefined>(
    undefined
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [cutRange, setCutRange] = useState<CutRange>({start: 0, end: 0});
  const [enhancement, setEnhancement] = useState<Enhancement>({
    brightness: 100,
    contrast: 100,
  });
  const [savedEnhancement, setSavedEnhancement] = useState<Enhancement>({
    brightness: 100,
    contrast: 100,
  });
  const [isTrimmingInProgress, setIsTrimmingInProgress] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Set video duration when video is loaded
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        setVideoDuration(video.duration);
        setCutRange((prev) => ({...prev, end: video.duration}));
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [selectedVideo]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      if (selectedVideo) {
        URL.revokeObjectURL(selectedVideo);
      }
      const videoURL = URL.createObjectURL(file);
      setSelectedVideo(videoURL);
      setCutRange({start: 0, end: 0});
    }
  };

  const startRecording = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {type: "video/webm"});
      if (selectedVideo) {
        URL.revokeObjectURL(selectedVideo);
      }
      const newVideoURL = URL.createObjectURL(blob);
      setSelectedVideo(newVideoURL);
      setIsTrimmingInProgress(false);
    };

    mediaRecorder.start();
  };

  const handleTrim = async () => {
    const video = videoRef.current;
    if (!video || isTrimmingInProgress) return;

    try {
      setIsTrimmingInProgress(true);

      // Create a canvas element to draw video frames
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get canvas context");

      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Create a media stream from the canvas
      const stream = canvas.captureStream();

      // Start recording
      startRecording(stream);

      // Set video to start position
      video.currentTime = cutRange.start;

      // Function to capture frames
      const captureFrame = () => {
        if (!video || !ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (video.currentTime < cutRange.end) {
          video.currentTime += 1 / 30; // Advance 1/30th of a second (30fps)
          requestAnimationFrame(captureFrame);
        } else {
          mediaRecorderRef.current?.stop();
        }
      };

      // Wait for video to seek to start position
      video.onseeked = () => {
        video.onseeked = null; // Remove event listener
        captureFrame(); // Start capturing frames
      };
    } catch (error) {
      console.error("Error trimming video:", error);
      setIsTrimmingInProgress(false);
    }
  };

  const handleEnhancementChange = (type: keyof Enhancement, value: number) => {
    setEnhancement((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleDoneEditing = () => {
    setSavedEnhancement(enhancement);
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    setEnhancement(savedEnhancement);
    setIsEditing(false);
  };

  const removeVideo = () => {
    if (selectedVideo) {
      URL.revokeObjectURL(selectedVideo); // Clean up the object URL
    }
    setSelectedVideo(undefined);
    setIsEditing(false);
    setCutRange({start: 0, end: 0});
  };

  React.useEffect(() => {
    return () => {
      if (selectedVideo) {
        URL.revokeObjectURL(selectedVideo);
      }
    };
  }, [selectedVideo]);

  const renderVideoPreview = () => {
    if (!selectedVideo) return null;

    return (
      <div className="relative w-[300px] h-[300px] video-preview-container">
        <video
          className="rounded-lg"
          ref={videoRef}
          src={selectedVideo}
          controls
          width={300}
          height={300}
          style={{
            filter: `brightness(${savedEnhancement.brightness}%) contrast(${savedEnhancement.contrast}%)`,
          }}
        />
        <RiPencilFill
          className="absolute bg-[--light-blur] hover:bg-[--text] p-1 rounded-full top-2 right-[10px] text-[28px] cursor-pointer"
          onClick={() => setIsEditing(true)}
        />
        <MdCancel
          className="absolute bg-[--light-blur] hover:bg-[--text] p-1 rounded-full top-2 left-2 text-[28px] cursor-pointer"
          onClick={removeVideo}
        />
      </div>
    );
  };

  const renderEditingMode = () => {
    if (!selectedVideo || !isEditing) return null;

    return (
      <div className="video-preview-container absolute px-[4%] pt-[30%] top-[20px] left-0 items-center justify-center w-full h-full bg-[--blur]">
        <video
          className="rounded-lg"
          ref={videoRef}
          src={selectedVideo}
          controls
          style={{
            filter: `brightness(${enhancement.brightness}%) contrast(${enhancement.contrast}%)`,
          }}
        />
        <div className="video-controls w-full flex flex-col gap-1 pt-3">
          <div className="trim_cont flex flex-row items-center p-2">
            <button
              type="button"
              className={`trim-button bg-[--secondary2] p-1 px-1 rounded-lg text-[--text] text-[16px] hover:bg-[--btn-hover] hover:text-[--text1] font-medium mr-[10px] ${
                isTrimmingInProgress ? "disabled" : ""
              }`}
              onClick={handleTrim}
              disabled={isTrimmingInProgress}
            >
              {isTrimmingInProgress ? "Trimming..." : "Trim Video"}
            </button>

            <div className="cut-range-controls flex flex-row items-center justify-center gap-2">
              <div className="start">
                <label
                  htmlFor="start-time"
                  className="text-[16px] font-semibold"
                >
                  Start Time (seconds):{" "}
                </label>
                <input
                  id="start-time"
                  type="number"
                  value={cutRange.start}
                  className="w-[45px] rounded-lg px-1"
                  onChange={(e) => {
                    const value = Math.max(
                      0,
                      Math.min(Number(e.target.value), cutRange.end)
                    );
                    setCutRange((prev) => ({...prev, start: value}));
                  }}
                  step="0.1"
                  min={0}
                  max={videoDuration}
                />
              </div>
              <div className="end">
                <label htmlFor="end-time" className="text-[16px] font-semibold">
                  End Time (seconds):{" "}
                </label>
                <input
                  id="end-time"
                  type="number"
                  value={cutRange.end}
                  className="w-[45px] rounded-lg px-1"
                  onChange={(e) => {
                    const value = Math.max(
                      cutRange.start,
                      Math.min(Number(e.target.value), videoDuration)
                    );
                    setCutRange((prev) => ({...prev, end: value}));
                  }}
                  step="0.1"
                  min={0}
                  max={videoDuration}
                />
              </div>

              <div className="video-duration">
                Total Duration: {videoDuration.toFixed(1)} seconds
              </div>
            </div>
          </div>

          <div className="enhancement-controls flex flex-row items-center justify-start px-2 gap-2">
            <div className="bright flex flex-row items-center gap-2">
              <label className="text-[16px] font-semibold" htmlFor="brightness">
                Brightness:{" "}
              </label>
              <input
                id="brightness"
                type="range"
                min={50}
                max={150}
                value={enhancement.brightness}
                className="bg-[--secondary2]"
                onChange={(e) =>
                  handleEnhancementChange("brightness", Number(e.target.value))
                }
              />
            </div>

            <div className="cont flex flex-row items-center gap-2">
              <label className="text-[16px] font-semibold" htmlFor="contrast">
                Contrast:{" "}
              </label>
              <input
                id="contrast"
                type="range"
                min={50}
                max={150}
                value={enhancement.contrast}
                onChange={(e) =>
                  handleEnhancementChange("contrast", Number(e.target.value))
                }
              />
            </div>
          </div>

          <div className="edit-buttons w-full flex flex-row items-center justify-start gap-5">
            <button
              type="button"
              className="done-button p-2 bg-[--green-500] rounded-lg text-[16px] font-semibold text-[--text] hover:bg-[--success-gradient]"
              onClick={handleDoneEditing}
              disabled={isTrimmingInProgress}
            >
              Done
            </button>
            <button
              type="button"
              className="cancel-button p-2 bg-[--secondary2] rounded-lg text-[16px] font-semibold text-[--text] hover:bg-[--btn-hover]"
              onClick={handleCancelEditing}
              disabled={isTrimmingInProgress}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="uploadvideo_section flex flex-col ">
      <div className="video_conn">
        <RiVideoAddFill className="video-add-icon" />
        <input
          type="file"
          name="Videos"
          id="video"
          accept="video/*"
          onChange={handleVideoChange}
          className="video-input"
          disabled={isTrimmingInProgress}
        />
      </div>

      {/* Video preview */}
      {!isEditing && renderVideoPreview()}
      {renderEditingMode()}
    </div>
  );
};

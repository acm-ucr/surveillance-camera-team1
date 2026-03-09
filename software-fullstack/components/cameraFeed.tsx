"use client";

import { useEffect, useRef, useState } from "react";


export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);


// Get camera list
  useEffect(() => {
    async function getCameras() {
      await navigator.mediaDevices.getUserMedia({ video: true });

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(
        (device) => device.kind === "videoinput"
      );

      setDevices(videoDevices);

      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    }

    getCameras();
  }, []);

  // start camera  
  async function startCamera() {
    if (!videoRef.current || !selectedDeviceId) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: selectedDeviceId } },
    });

    videoRef.current.srcObject = stream;
    setIsCameraOn(true);
  }


  // Stop camera
  function stopCamera() {
    const video = videoRef.current;
    if (!video || !video.srcObject) return;

    const tracks = (video.srcObject as MediaStream).getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null;

    setIsCameraOn(false);
  }

  // toggle camera
    async function toggleCamera() {
    if (isCameraOn) {
      stopCamera();
    } else {
      await startCamera();
    }
  }

  // Take photo
  function takePhoto() {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/png");
    setPhoto(imageData);
  }


 return (
  <div className="flex flex-col gap-[25px] w-full max-w-[1200px] mx-auto items-center">

    {/* camera frame */}
    <div className="w-full flex justify-center">
      <div className="w-[900px] h-[600px] bg-forge-brown p-12 rounded-[40px] shadow-2xl flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ transform: "scaleX(-1)" }}
          className="w-[700px] aspect-video rounded-[30px] object-cover"
        />
      </div>
    </div>

    {/* dropdown */}
    <select
      className="w-full max-w-[400px] h-[50px] text-[18px] rounded-[10px] bg-forge-darkblue text-white text-center hover:scale-105 transition duration-200"
      value={selectedDeviceId}
      onChange={(e) => setSelectedDeviceId(e.target.value)}
    >
      {devices.map((device, index) => (
        <option key={device.deviceId} value={device.deviceId}>
          {device.label || `Camera ${index + 1}`}
        </option>
      ))}
    </select>

    {/* button panel */}
    <div className="w-full max-w-[700px] bg-forge-brown py-[12px] rounded-[20px] flex justify-center gap-20 shadow-lg mx-auto">
      <button
        onClick={takePhoto}
        className="bg-forge-maroon text-white text-[40px] font-semibold 
        rounded-[10px] border-2 border-white hover:scale-105 transition duration-200"
      >
        Take Photo
      </button>

      <button
        onClick={toggleCamera}
        className="bg-forge-maroon text-white text-[40px] font-semibold rounded-[10px] border-2 border-white hover:scale-105 transition duration-200"
      >
        Camera Off/On
      </button>
    </div>

    {/* photos section */}
    <div className="w-full max-w-[900px] min-h-[250px] bg-forge-gray rounded-[20px] flex flex-col mx-auto">

      <h2 className="text-[30px] text-forge-darkblue font-serif mb-6 text-center">
        Photo Taken
      </h2>

      <div className="flex flex-wrap gap-6 justify-center">
        {photo && (
          <img
            src={photo}
            alt="Captured"
            className="rounded-[20px] shadow-md max-w-[600px] mb-[30px]"
            style={{ transform: "scaleX(-1)" }}
          />
        )}
      </div>

    </div>
    <canvas ref={canvasRef} className="hidden" />
  </div>
);
}

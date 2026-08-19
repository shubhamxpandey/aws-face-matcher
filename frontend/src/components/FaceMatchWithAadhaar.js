import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "../App.css";

const videoConstraints = {
  width: 320,
  height: 240,
  facingMode: "user",
};

export default function FaceMatchWithAadhaar() {
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const openCamera = () => {
    setResultMessage("");
    setShowCamera(true);
  };

  const captureAndSend = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const file = new File([blob], "live.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("http://localhost:5000/compare-face", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (result.success) {
        setResultMessage(`${result.message}`);
    } else {
        setResultMessage(`${result.message}`);
    }

    setShowCamera(false);
  };

  return (
    <div className="face-match-container">
      <h2>Aadhaar Image</h2>
      <img
        src="http://localhost:5000/uploads/aadhar/shubham.jpeg"
        alt="Aadhaar"
        className="aadhaar-image"
      />

      {!showCamera ? (
        <button onClick={openCamera} className="capture-button">
          Open Camera
        </button>
      ) : (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="webcam-view"
          />
          <button onClick={captureAndSend} className="capture-button">
            Capture & Compare
          </button>
        </>
      )}
      {resultMessage && (
        <div className="result-message">
          {resultMessage}
        </div>
      )}
    </div>
  );
}

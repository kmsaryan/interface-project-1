import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import Jack from "../assets/icons/jack.png";
import JackBot from "../components/JackBot";
import "../styles/ChatPage.css";
import TypedReact from "../components/TypedReact";

export default function ChatPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    localStorage.setItem("hasSentFirstMessage", "false");
  }, []);

  const toggleCamera = () => {
    setCameraOpen((prev) => !prev);
  };

  useEffect(() => {
    let stream;
    if (cameraOpen && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          startDetectionLoop();
        })
        .catch((err) => {
          alert("Failed to access camera: " + err.message);
        });
    } else {
      stopDetectionLoop();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      clearCanvas();
    }

    return () => {
      stopDetectionLoop();
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [cameraOpen]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const stopDetectionLoop = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  const startDetectionLoop = () => {
    if (animationFrameId.current) return; // already running
    const processFrame = async () => {
      if (!videoRef.current || !canvasRef.current) {
        animationFrameId.current = requestAnimationFrame(processFrame);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        // video not ready yet
        animationFrameId.current = requestAnimationFrame(processFrame);
        return;
      }

      // Set canvas size to video size
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      // Draw the current video frame on canvas (optional, just to get the image)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64 JPEG
      const imageBase64 = canvas.toDataURL("image/jpeg");

      try {
        const res = await fetch("http://localhost:9002/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageBase64 }),
        });

        if (res.ok) {
          const data = await res.json();

          // Load processed base64 image and draw on canvas
          const processedImage = new Image();
          processedImage.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(processedImage, 0, 0, canvas.width, canvas.height);
          };
          processedImage.src = data.processed_image; // backend returns with prefix 'data:image/jpeg;base64,...'
        } else {
          console.error("YOLO backend response not OK", await res.text());
        }
      } catch (err) {
        console.error("Error sending frame:", err);
      }

      animationFrameId.current = requestAnimationFrame(processFrame);
    };

    animationFrameId.current = requestAnimationFrame(processFrame);
  };

  return (
    <div className="ChatPage">
      <Helmet>
        <title>Volvo CE Chatbot</title>
        <meta name="description" content="Repair AI assistance" />
      </Helmet>

      <h1 className="jack-heading">
        <img src={Jack} alt="Jack" className="jack-avatar" />
        Meet Jack
      </h1>

      <div style={{ height: "20px" }}>
        <TypedReact />
      </div>

      <button
        onClick={() => setChatOpen(true)}
        style={{
          marginTop: "40px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "14px 100px",
          fontSize: "1.1rem",
          fontWeight: 600,
          borderRadius: "12px",
          background: "linear-gradient(135deg, #20cfcf, #00b3b3)",
          color: "#ffffff",
          border: "none",
          boxShadow: "0 6px 12px rgba(0, 179, 179, 0.3)",
          cursor: "pointer",
        }}
      >
        💬 Start Chat
      </button>

      <button
        onClick={toggleCamera}
        style={{
          marginTop: "20px",
          marginLeft: "20px",
          padding: "10px 20px",
          borderRadius: "10px",
          backgroundColor: "#007acc",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {cameraOpen ? "📷 Close Camera" : "📷 Open Camera"}
      </button>

      {cameraOpen && (
        <div style={{ marginTop: "20px" }}>
          {/* Raw video is hidden; canvas shows processed frames */}
          <video
            ref={videoRef}
            style={{ display: "none" }}
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            style={{ maxWidth: "100%", border: "1px solid #ccc" }}
          />
        </div>
      )}

      {chatOpen && (
        <div className="app-chatbot-container">
          <JackBot />
        </div>
      )}
    </div>
  );
}

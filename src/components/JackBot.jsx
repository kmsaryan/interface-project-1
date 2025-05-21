import React, { useRef, useState } from "react";
import ChatBot from "react-chatbotify";
import BuddyAvatar from "../assets/icons/jack.png";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dn8rj0auz/image/upload";
const UPLOAD_PRESET = "sugar-2025";

const isImageUrl = (url) => {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
  try {
    const parsed = new URL(url);
    return imageExtensions.some((ext) => parsed.pathname.endsWith(ext));
  } catch {
    return false;
  }
};

const JackBot = () => {
  const lastImageUrlRef = useRef(null);
  const urlToUploadRef = useRef(null);
  const uploadedFile = useRef(null);

  const [, forceUpdate] = useState(false); 

  async function fetchFromBackend(message) {

	if (uploadedFile.current) {
		await waitUntilUploaded();
	  }
	  
    try {
      const user = JSON.parse(localStorage.getItem("user")) || { id: "guest" };
      const storedResetFlag = localStorage.getItem("hasSentFirstMessage") === "true";
      const resetFlag = !storedResetFlag;
	  console.log("IN POST: ",urlToUploadRef.current);

      const payload = {
        user_id: user.id,
        message: message || "Hello!",
        reset: resetFlag,
        media_url: urlToUploadRef.current || "",
      };

      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      localStorage.setItem("hasSentFirstMessage", "true");

      urlToUploadRef.current = null;
	  uploadedFile.current  = false;
      lastImageUrlRef.current = data?.image_url || null;
      forceUpdate((v) => !v); 

      return {
        message: data?.response || "Desculpe, algo deu errado.",
        image_url: data?.image_url || null,
      };
    } catch (error) {
      console.error("Erro na API:", error);
      return { message: "Erro ao conectar com o servidor.", image_url: null };
    }
  }

  const waitUntilUploaded = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (urlToUploadRef.current) {
          clearInterval(interval);
          resolve();
        }
      }, 300);
    });
  };

  const handleUpload = async (params) => {
    const files = params.files;
    if (!files || files.length === 0) return;
	uploadedFile.current = true;

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const cloudinaryResponse = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const cloudinaryData = await cloudinaryResponse.json();
      urlToUploadRef.current = cloudinaryData.secure_url;
      console.log("Image URL uploaded:", urlToUploadRef.current);
    } catch (error) {
      console.error("Erro ao fazer upload para Cloudinary:", error);
    }
  };

  const flow = {
    start: {
      message: "Hey!",
      path: "loop",
    },
    image: {
      component: () => (
        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "10px", marginLeft: "20px" }}>
          {lastImageUrlRef.current && isImageUrl(lastImageUrlRef.current) && (
            <div
              style={{
                background: "#00a3a3",
                padding: "20px",
                borderRadius: "15px",
                maxWidth: "60%",
              }}
            >
              <img
                src={lastImageUrlRef.current}
                alt="response visual"
                style={{
                  width: "100%",
                  borderRadius: "6px",
                  display: "block",
                }}
              />
            </div>
          )}
        </div>
      ),
      path: "wait",
      transition: { duration: 0 },
    },
    wait: {
      message: "",
      file: async (params) => {
        await handleUpload(params);
      },
      path: "loop",
    },
    loop: {
      message: async (params) => {
        const { message } = await fetchFromBackend(params.userInput);
        return message;
      },
      path: "image",
      transition: { duration: 0 },
    },
  };

  return (
    <ChatBot
      settings={{
        general: { embedded: true },
        fileAttachment: { multiple: true, showMediaDisplay: true, sendFileName: true },
        audio: { disabled: false, defaultToggledOn: true, tapToPlay: true, language: "pt-BR" },
        voice: { disabled: false, autoSendDisabled: true },
        chatHistory: { storageKey: "example_smart_conversation" },
        header: {
          avatar: BuddyAvatar,
          title: "Jack",
        },
      }}
      styles={{
        headerStyle: {
          background: "#008080",
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "1.2rem",
          padding: "12px",
          borderRadius: "10px 10px 0 0",
        },
        chatWindowStyle: {
          border: "2px solid #7fd1b9",
          borderRadius: "10px",
          background: "#e0f7f5",
        },
        bodyStyle: {
          background: "#d6f5f2",
        },
        chatInputContainerStyle: {
          background: "#c0ebe7",
          borderTop: "1px solid #7fd1b9",
        },
        chatInputAreaStyle: {
          background: "#ffffff",
          border: "1px solid #00b8b8",
          color: "#006666",
          borderRadius: "8px",
        },
        userBubbleStyle: {
          background: "#20cfcf",
          color: "#ffffff",
        },
        botBubbleStyle: {
          background: "#00a3a3",
          color: "#ffffff",
        },
        sendButtonStyle: {
          background: "#00b3b3",
          color: "#ffffff",
          borderRadius: "8px",
          padding: "6px 12px",
        },
        sendButtonHoveredStyle: {
          background: "#008080",
        },
        sendIconStyle: {
          fill: "#ffffff",
        },
        rcbTypingIndicatorDotStyle: {
          background: "#00b3b3",
        },
      }}
      flow={flow}
    />
  );
};

export default JackBot;

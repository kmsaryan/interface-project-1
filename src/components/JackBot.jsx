import React from "react";
import ChatBot from "react-chatbotify";
import BuddyAvatar from "../assets/icons/jack.png";

const JackBot = () => {
	async function fetchFromBackend(message) {
		try {
			const user = JSON.parse(localStorage.getItem("user")) || { id: "guest" };
			const storedResetFlag = localStorage.getItem("hasSentFirstMessage") === "true";
			const resetFlag = !storedResetFlag;

			const payload = {
				user_id: user.id,
				message: message || "Hello!",
				reset: resetFlag,
			};

			const response = await fetch("http://127.0.0.1:8000/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await response.json();
			localStorage.setItem("hasSentFirstMessage", "true");

			return data?.response || "Desculpe, algo deu errado.";
		} catch (error) {
			console.error("Erro na API:", error);
			return "Erro ao conectar com o servidor.";
		}
	}

    const handleUpload = (params) => {
		const files = params.files;
		// handle files logic here
	}

	const flow = {
		start: {
			message: "Hey!",
			path: "loop",
		},
		loop: {
			message: async (params) => {
				const response = await fetchFromBackend(params.userInput);
				return response;
			},
			file: (params) => handleUpload(params),
            path: "loop",
		},
	};

	return (
		<ChatBot
			settings={{
				general: { embedded: true },
				audio: { disabled: false, defaultToggledOn: true, tapToPlay: true, language: "pt-BR" },
				voice: { disabled: false },
				chatHistory: { storageKey: "example_smart_conversation" },
				header: {
					avatar: BuddyAvatar,
					title: "Jack",
				}
			}}
			styles={{
				headerStyle: {
					background: "#008080", // Teal
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

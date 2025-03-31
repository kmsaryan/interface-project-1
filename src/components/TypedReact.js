import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

export default function TypedReact() {
  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ["Welcome to Volvo CE Chatbot!", "How can I assist you today?"],
      typeSpeed: 50,
      backSpeed: 25,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return <span ref={typedRef} />;
}

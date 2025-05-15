import React, { useEffect, useRef } from "react";
import Typed from "typed.js"; // Ensure this import is correct

export default function TypedReact() {
  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ["Say Hi to Jack – Keeping Your Machines UP and Running!", "Chat with Jack – Because Every Machine Needs a Lift!"],
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

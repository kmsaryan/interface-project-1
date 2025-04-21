module.exports = {
  root: true,
  extends: [
    "react-app"  // Use the create-react-app configuration as base
  ],
  settings: {
    react: {
      version: "detect" // Automatically detect the React version
    }
  },
  // Global rules
  rules: {
    // Add any custom rules here
  },
  // Handle specific directories differently
  overrides: [
    {
      files: ["src/react-simple-chatbot/**/*.js", "src/react-simple-chatbot/**/*.jsx"],
      // Disable specific rules for the react-simple-chatbot directory
      rules: {
        "import/no-unresolved": "off",
        "import/no-extraneous-dependencies": "off",
        "react/jsx-filename-extension": "off",
        "react/prop-types": "off",
        "react/no-unused-prop-types": "off",
        "react/forbid-prop-types": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-static-element-interactions": "off"
      }
    }
  ],
  ignorePatterns: ["react-chatbot-kit/build/**"]
};

const { execSync } = require("child_process");
const path = require("path");

try {
  console.log("Installing dependencies for the main project...");
  execSync("npm install --legacy-peer-deps", { stdio: "inherit" });

  console.log("Installing dependencies for submodules...");

  // List of submodule paths
  const submodules = [
    "src/react-chatbot-kit",
    "VolvoAssistantD", // Added VolvoAssistantD to the list
  ];

  // Loop through each submodule and install dependencies
  submodules.forEach((submodule) => {
    const submodulePath = path.resolve(__dirname, submodule);
    console.log(`Installing dependencies in ${submodulePath}...`);
    try {
      execSync("npm install --legacy-peer-deps", { cwd: submodulePath, stdio: "inherit" });
    } catch (error) {
      console.error(`[ERROR] Failed to install dependencies in ${submodulePath}:`, error.message);
      console.error(`[HINT] Ensure all required dependencies are listed in ${submodulePath}/package.json.`);
    }
  });

  console.log("All dependencies installed successfully!");
} catch (error) {
  console.error("[ERROR] Failed to install dependencies for the main project:", error.message);
}

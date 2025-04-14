#!/bin/bash

echo "Installing dependencies for the main project..."
npm install

echo "Installing dependencies for submodules..."

# List of submodule paths
submodules=(
  "src/react-chatbot-kit"
  "VolvoAssistantDatabase"
)

# Loop through each submodule and install dependencies
for submodule in "${submodules[@]}"; do
  echo "Installing dependencies in $submodule..."
  (cd "$submodule" && npm install)
done

echo "All dependencies installed successfully!"

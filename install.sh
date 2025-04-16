#!/bin/bash
# Cloning and installing submodules and dependencies
echo "Cloning submodules..."

# Array of submodule repositories and their paths
declare -A submodules_repo=(
    ["src/react-chatbot-kit"]="https://github.com/kmsaryan/react-chatbot-kit.git"
    ["VolvoAssistantDatabase"]="https://github.com/kmsaryan/VolvoAssistantDatabase.git"
    ["src/react-simple-chatbot"]="https://github.com/kmsaryan/react-simple-chatbot.git"
)

# Clone each submodule if it doesn't already exist
for submodule in "${!submodules_repo[@]}"; do
    if [ ! -d "$submodule" ]; then
        echo "Cloning ${submodules_repo[$submodule]} into $submodule..."
        git clone "${submodules_repo[$submodule]}" "$submodule"
        if [ $? -ne 0 ]; then
            echo "Error cloning $submodule. Exiting."
            exit 1
        fi
    else
        echo "Submodule $submodule already exists. Skipping clone."
    fi
done

echo "Starting installation of submodules and dependencies..."

# Set Node.js options to resolve OpenSSL issues
export NODE_OPTIONS=--openssl-legacy-provider

# Get the absolute path of the current script
BASE_DIR=$(dirname "$(realpath "$0")")

# Install react-scripts in the root directory
echo "Installing react-scripts in the root directory..."
cd "$BASE_DIR" || exit
npm install react-scripts --legacy-peer-deps
if [ $? -ne 0 ]; then
  echo "Error installing react-scripts. Exiting."
  exit 1
fi

# Array of submodule directories
submodules=("VolvoAssistantDatabase" "src/react-chatbot-kit" "src/react-simple-chatbot")

# Install dependencies for each submodule
for submodule in "${submodules[@]}"; do
  if [ -d "$BASE_DIR/$submodule" ]; then
    echo "Installing dependencies for $submodule..."
    cd "$BASE_DIR/$submodule" || exit
    rm -rf node_modules package-lock.json
    npm install --legacy-peer-deps
    if [ $? -ne 0 ]; then
      echo "Error installing dependencies for $submodule. Exiting."
      exit 1
    fi

    # Run build script if it exists
    if [ -f package.json ] && grep -q '"build"' package.json; then
      echo "Building $submodule..."
      npm run build
      if [ $? -ne 0 ]; then
        echo "Error building $submodule. Exiting."
        exit 1
      fi
    fi

    cd "$BASE_DIR"
  else
    echo "Directory $submodule does not exist. Skipping..."
  fi
done

# Handle internal module (stream-http) inside VolvoAssistantDatabase
if [ -d "$BASE_DIR/VolvoAssistantDatabase/stream-http" ]; then
  echo "Installing internal module dependencies (stream-http)..."
  cd "$BASE_DIR/VolvoAssistantDatabase/stream-http" || exit
  rm -rf node_modules package-lock.json
  npm install --legacy-peer-deps
  if [ $? -ne 0 ]; then
    echo "Error installing dependencies for internal module (stream-http). Exiting."
    exit 1
  fi
  cd "$BASE_DIR"
else
  echo "Directory VolvoAssistantDatabase/stream-http does not exist. Skipping..."
fi

echo "All dependencies installed and built successfully!"

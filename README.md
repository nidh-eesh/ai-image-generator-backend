# AI Image Generator Backend

AI Image Generator Backend is a Node.js application that provides an API for generating images using various AI models. This backend service handles requests to generate images based on user prompts and returns the generated images.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/nidh-eesh/ai-image-generator-backend.git
    cd ai-image-generator-backend
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your API keys:
    ```env
    AIMLAPI_KEY_1=your_api_key_1
    AIMLAPI_KEY_2=your_api_key_2
    AIMLAPI_KEY_3=your_api_key_3
    # Add more keys as needed
    ```

## Usage

Start the server:
```sh
npm start
```

The server will be available at http://localhost:8080.

## API Endpoints

POST /dream
- Generate an image based on the provided prompt and model.

## Environment Variables

The following environment variables are used in the project:

- AIMLAPI_KEY_1, AIMLAPI_KEY_2, ..., AIMLAPI_KEY_N: API keys for the AI image generation service from [aimlapi](https://aimlapi.com).
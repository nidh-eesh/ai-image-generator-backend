// Function to choose the appropriate response based on the model
const chooseResponse = async (res, aiResponse, bodyData) => {
	const response = await aiResponse.json();
	let image;

	if (bodyData.model.includes('flux') || bodyData.model.includes('stable-diffusion-v3-medium')) {
		// Check if the response contains non-safe for work (NSFW) concepts
		if (response.has_nsfw_concepts && response.has_nsfw_concepts[0]) {
			return res.status(400).json({ message: "Non-safe prompt detected" });
		}

		// Set the image URL from the response
		image = response.images[0].url;
	} else {
		const pattern = 'ooooAKKKKACiiigA';
		const regex = new RegExp(`(${pattern}){20,}`, 'g');
		const match = response.output.choices[0].image_base64.match(regex);
		// Set the image as a base64 encoded string
		if (match) {
			return res.status(400).json({ message: "Non-safe prompt detected" });
		}
		image = `data:image/png;base64,${response.output.choices[0].image_base64}`;
	}
	return res.json({ image });
};

const makeApiCall = async (req, res, shuffledKeys, currentKeyIndex) => {
	const apiKey = shuffledKeys[currentKeyIndex];

	currentKeyIndex = (currentKeyIndex + 1) % shuffledKeys.length;
	const { prompt, model } = req.body;
	const bodyData = { prompt, model };

	// Set default model if not provided
	if (!model) {
		bodyData.model = "flux/dev";
	}

	// Set image size for flux models
	if (bodyData.model.includes('flux')) {
		bodyData.image_size = "square_hd";
	}

	// Check if the model is valid
	if (
		model === "flux/dev" ||
		model === "flux/schnell" ||
		model === "flux-pro" ||
		model === "flux-realism" ||
		model === "stabilityai/stable-diffusion-2-1" ||
		model === "stabilityai/stable-diffusion-xl-base-1.0" ||
		model === "wavymulder/Analog-Diffusion" ||
		model === "prompthero/openjourney" ||
		model === "runwayml/stable-diffusion-v1-5" ||
		model === "SG161222/Realistic_Vision_V3.0_VAE" ||
		model === "stable-diffusion-v3-medium"
	) {
		// Make API call to generate images
		const aiResponse = await fetch('https://api.aimlapi.com/images/generations', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${apiKey}`,
			},
			body: JSON.stringify(bodyData),
		});

		if (aiResponse.ok) {
			// Choose the appropriate response based on the model
			await chooseResponse(res, aiResponse, bodyData);
		}

		else if (aiResponse.status === 429 && currentKeyIndex > 0) {
			// Retry with the next API key if rate limited
			await makeApiCall(req, res, shuffledKeys, currentKeyIndex);
		}

		else if (aiResponse.status === 429 && currentKeyIndex === 0) {
			// Handled rate limit with all API keys
			return res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
		}

		else {
			// Handle error in AI response
			return res.status(500).json({ message: "Error in AI response" });
		}

	} else {
		// Handle invalid model
		return res.status(400).json({ message: "Invalid model" });
	}
}

export default makeApiCall;
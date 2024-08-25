import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import _ from 'lodash';
import makeApiCall from './api.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const numberOfKeys = 10;
const apiKeys = Array.from({ length: numberOfKeys }, (_, i) => process.env[`AIMLAPI_KEY_${i + 1}`])
	.filter(key => key);

// Handle POST request to '/dream' endpoint
app.post('/dream', async (req, res) => {

	try {
		let currentKeyIndex = 0;
		const shuffledKeys = _.shuffle(apiKeys);
		// To randomize the selection of API keys
		await makeApiCall(req, res, shuffledKeys, currentKeyIndex);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

// Start the server on port 8080
app.listen(8080, () => console.log('API available at http://localhost:8080/dream'));

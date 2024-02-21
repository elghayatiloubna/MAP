import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import axios from 'axios';

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: "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",
});

// Route to get route instructions
app.get('/getRouteInstructions', async (req, res) => {
  try {
    // Replace 'YOUR_API_KEY' with your actual HERE API key
    const hereApiKey = 'Qf_StL39AR9kTMviblOV7lx6wPC4iQFqw2LGzoUAi7E';
    const apiUrl = `https://router.hereapi.com/v8/routes?apikey=${hereApiKey}&origin=31.644529706981952,-8.020329486770914&destination=31.64908253456857,-8.015434630640225&return=polyline,summary,actions,instructions&spans=notices&transportMode=pedestrian`;

    // Send HTTP request to HERE API
    const response = await axios.get(apiUrl);

    // Extract instructions from the JSON response
    const route = response.data.routes[0];
    const section = route.sections[0];
    const turnByTurnActions = section.actions;

    // Create an array of instructions with translation
    const instructions = await Promise.all(
      turnByTurnActions.map(async (action) => {
        const roadName =
          action.nextRoad &&
          action.nextRoad.name &&
          action.nextRoad.name[0] &&
          action.nextRoad.name[0].value;

        // Translate the instruction using OpenAI GPT-3.5-turbo
        const translatedText = await translateText(action.instruction, 'en', 'ar');

        return {
          action: action.action,
          direction: action.direction,
          duration: action.duration,
          length: action.length,
          instruction: translatedText,
          road: roadName || '',
        };
      })
    );

    res.json({ instructions });
  } catch (error) {
    console.error('Error during the request:', error.message);
    res.status(500).json({ error: 'Error during the request' });
  }
});

// Function to translate text using OpenAI GPT-3.5-turbo
async function translateText(text, sourceLanguage, targetLanguage) {
  try {
    // Make a request to OpenAI for translation
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          "role": "system",
          "content": `Translate the following sentence from English to Moroccan Darija. Please provide a clear and accurate translation. Do not add any additional text; just translate the sentence.`        },
        {
          "role": "user",
          "content": text
        }
      ],
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1,
    });

    // Extract the translated content from the response
    const translatedText = response.data.choices[0].message.content;

    return translatedText;
  } catch (error) {
    console.error('Error during translation:', error.message);
    throw error;
  }
}

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening at http://localhost:${port}`);
});



















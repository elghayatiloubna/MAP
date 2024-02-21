import express from 'express';
import cors from 'cors';
import axios from 'axios';
const app = express();
const port = 3000;

// Activer CORS pour toutes les routes
app.use(cors());

// Route pour obtenir les instructions de l'itinéraire
app.get('/getRouteInstructions', async (req, res) => {
  try {
    // Remplacez 'YOUR_API_KEY' par votre clé API Here
const apiKey = 'Qf_StL39AR9kTMviblOV7lx6wPC4iQFqw2LGzoUAi7E';
//const apiUrl = `https://router.hereapi.com/v8/routes?transportMode=pedestrian&origin=31.644529706981952,-8.020329486770914&destination=31.64908253456857,-8.015434630640225&return=polyline,turnbyturnactions,instructions&apikey=${apiKey}`;
const apiUrl = `https://router.hereapi.com/v8/routes?apikey=${apiKey}&origin=31.644529706981952,-8.020329486770914&destination=31.64908253456857,-8.015434630640225&return=polyline,summary,actions,instructions&spans=notices&transportMode=pedestrian`;

    // Envoi de la requête HTTP
    const response = await axios.get(apiUrl);

    // Extraction des instructions du JSON
    const route = response.data.routes[0];
    const section = route.sections[0];
    const turnByTurnActions = section.actions;

    // Création d'un tableau d'instructions
    const instructions = await Promise.all(
      turnByTurnActions.map(async (action) => {
        const roadName =
          action.nextRoad &&
          action.nextRoad.name &&
          action.nextRoad.name[0] &&
          action.nextRoad.name[0].value;

        // Traduction de l'instruction en arabe
        const translatedText = await translateText(action.instruction, 'en', 'ar',1000);
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
    console.error('Erreur lors de la requête:', error.message);
    res.status(500).json({ error: 'Erreur lors de la requête' });
  }
});

// Fonction pour traduire un texte
async function translateText(text, sourceLanguage, targetLanguage,delay) {
  const translationApiUrl = 'https://text-translator2.p.rapidapi.com/translate';
  const encodedParams = new URLSearchParams();
encodedParams.set('source_language', sourceLanguage);
encodedParams.set('target_language', targetLanguage);
encodedParams.set('text', text);
const translationOptions = {
  method: 'POST',
  url: translationApiUrl,
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': '4fd49045d9msh086d50d8456b7a6p1b769ajsn7746c3a97784',
    'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
  },
data: encodedParams,
};

  try {
    const translationResponse = await axios.request(translationOptions);
    return translationResponse.data;
  } catch (translationError) {
    console.error('Erreur lors de la traduction:', translationError.message);
    throw translationError;
  } finally {
    // Introduce a delay before making the next translation request
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });

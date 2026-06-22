const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const intents = JSON.parse(fs.readFileSync('./intents.json', 'utf-8'));

function getResponse(message) {
  const text = message.toLowerCase();
  for (const intent of intents) {
    if (intent.patterns.some(p => text.includes(p))) {
      return intent.response;
    }
  }
  return "No entendí tu pregunta. ¿Podrías reformularla o contactar a soporte@empresa.com?";
}

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Mensaje vacío' });
  const reply = getResponse(message);
  res.json({ reply });
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));

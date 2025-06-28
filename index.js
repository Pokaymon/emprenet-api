const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.json({ message: 'API de EmpreNet funcionando correctamente!' });
});

app.listen(PORT, () => {
  console.log(`API Corriendo en http://localhost:${PORT}`);
});

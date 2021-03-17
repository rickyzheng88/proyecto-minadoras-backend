const express = require('express');

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.status(200);
    res.send('Hello from there');
});

app.listen(PORT, console.log('Se ha iniciado el servidor'));
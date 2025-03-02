const express = require("express");
const path = require("path");

const app = express();

// Palvellaan staattisia tiedostoja
app.use(express.static(path.join(__dirname)));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Palvelin käynnissä osoitteessa http://localhost:${PORT}`);
});
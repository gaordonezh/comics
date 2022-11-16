const axios = require("axios");
const fs = require("fs");
const data = require("./comics.json");

const base_url = "https://gateway.marvel.com/v1/public";
const apiKey = "0529e721762991c6ebcba10331a29947";
const ts = "1";
const hash = "3d0f63d80334f02cc2b6c02088c9db9d";
const perPage = 100;
const limit = 100;

const getComicsData = async () => {
  let auxData = [];

  for (let i = 0; i < limit; i++) {
    const result = await axios.get(
      `${base_url}/comics?apikey=${apiKey}&ts=${ts}&hash=${hash}&limit=${perPage}&offset=${i}`
    );

    auxData = [...auxData, ...(result?.data?.data?.results || [])];
    console.log(`Vamos en el ${i + 1}`);
  }

  fs.writeFile("comics.json", JSON.stringify(auxData), (err) => {
    if (err) console.error(err);
  });

  console.log(
    `Previos: ${data.length} comics. Current set: ${auxData.length} commics`
  );
};

getComicsData();

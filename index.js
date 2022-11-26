const axios = require("axios");
const fs = require("fs");
const data = require("./comics.json");

const base_url = "https://gateway.marvel.com/v1/public";
const apiKey = "0529e721762991c6ebcba10331a29947";
const ts = "1";
const hash = "3d0f63d80334f02cc2b6c02088c9db9d";
const perPage = 100;
const limit = 5;

const getComicsData = async () => {
  let auxData = [];

  for (let i = 0; i < limit; i++) {
    const result = await axios.get(
      `${base_url}/creators?apikey=${apiKey}&ts=${ts}&hash=${hash}&limit=${perPage}&offset=${i}`
    );

    const res = result?.data?.data?.results;

    let tempComics = [];

    for (let x = 0; x < res.length; x++) {
      const baseComics = res[x].comics.items;
      for (let z = 0; z < baseComics.length; z++) {
        console.log(`Comic ${i + z + x + 1}`);
        const comicsssss = await axios.get(`${baseComics[z].resourceURI}?apikey=${apiKey}&ts=${ts}&hash=${hash}`);
        const auxCommics = comicsssss.data.data.results;

        let auxx = [];

        for (let asd = 0; asd < auxCommics.length; asd++) {
          auxx = [
            ...auxx,
            {
              title: auxCommics[asd].title,
              description: auxCommics[asd].description || `${auxCommics[asd].title} description`,
              pageCount: auxCommics[asd].pageCount,
            },
          ];
        }
        tempComics = [...tempComics, ...auxx];
      }
    }

    auxData = [...auxData, { fullName: res[i].fullName, comics: tempComics }];

    console.log(`Vamos en el ${i + 1}`);
  }

  fs.writeFile("comics.json", JSON.stringify(auxData), (err) => {
    if (err) console.error(err);
  });

  console.log(`Previos: ${data.length} comics. Current set: ${auxData.length} commics`);
};

getComicsData();

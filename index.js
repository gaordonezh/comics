const axios = require("axios");
const fs = require("fs");

const base_url = "https://gateway.marvel.com/v1/public";
const apiKey = "0529e721762991c6ebcba10331a29947";
const ts = "1";
const hash = "3d0f63d80334f02cc2b6c02088c9db9d";
const perPage = 100;
const limit = 5;

const getComicsData = async () => {
  let auxData = [];

  for (let first = 0; first < limit; first++) {
    const url = `${base_url}/creators?apikey=${apiKey}&ts=${ts}&hash=${hash}&limit=${perPage}&offset=${first}`;
    const firstRes = await axios.get(url);

    const firstResult = firstRes?.data?.data?.results;

    for (let second = 0; second < firstResult.length; second++) {
      const authorFullname = firstResult[second].fullName;
      const comics = firstResult[second].comics.items;

      for (let third = 0; third < comics.length; third++) {
        const thirdRes = await axios.get(`${comics[third].resourceURI}?apikey=${apiKey}&ts=${ts}&hash=${hash}`);
        const resultThird = thirdRes.data.data.results[0];

        auxData = [
          ...auxData,
          {
            authorFullname,
            nombreProducto: resultThird.title,
            descripcionProducto: resultThird.description || `${resultThird.title} description`,
            cantidadPaginas: resultThird.pageCount,
            tipo: third % 2 ? "M" : third % 3 ? "F" : "",
          },
        ];
      }
    }
  }

  console.log("here");

  fs.writeFile("comics.json", JSON.stringify(auxData), (err) => {
    if (err) console.error(err);
  });

  console.log(`${auxData.length} commics saved`);
};

getComicsData();

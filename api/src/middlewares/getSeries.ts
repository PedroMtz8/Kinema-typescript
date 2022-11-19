import dotenv from "dotenv"
dotenv.config();
import axios from "axios"

const { YOUR_API_KEY_1, API_YT_KEY } = process.env;
import Serie from'../db/Schema/serie';
import Genre from "../db/Schema/genre";
/* const { getDataJSON } = require('../controllers local/getDataJSONSeries.js'); */

const api_general_route = 'https://api.themoviedb.org/3';

interface IGenres {
    name: string,
   /*  genre: [{name: string}] */
}

interface IEpisodes {
    id: string,
    name: string,
    overview: string,
    episode_number: number,
    air_date: string,
    image: string,
    duration: string,
    runtime?: string,
    still_path?: string,
}

export interface ISerie {
    id: string,
    genres: Array<IGenres>,
    title: string,
    description: string,
    rating: string,
    user_reviews: string,
    release_date_first_episode: string,
    number_seasons: number,
    poster: string,
    back_poster: string,
    season_one?: ISerieSeason
}

interface ISerieSeason /* extends ISerie */{
        id: string,
        air_date_first_episode: number,
        name: string,
        poster: string,
        number_episodes: number,
        season_number: string,
        episodes: []
}

interface ServerResponse {
    data: ISerieSeason
  }
  
/*   interface ServerData {
    foo: string
    bar: number
  } */

/* interface IOptions {
    year: string,
    month: string,
    day: string
} */

/* interface ApiData {
  data: {
    results: []
  }
} */

// Get TVSeries from API by ID with first season:
export const getTVSeriesByIdApi = async (id: string) => {
 /*  let dataSerie = await Serie.find({ id: id });

  if (!dataSerie) return 'Serie not found'; */

  const image_route = 'https://image.tmdb.org/t/p/original';

/*   const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }; */

  const apiResponse = await axios.get(`${api_general_route}/tv/${id}?api_key=${YOUR_API_KEY_1}`)

 /*  const responseData: ApiData = apiResponse.data.results */

 /*  if (apiResponse === undefined) {
    let data = getDataJSON(page);
    return data;
  }
 */
  const TVSerie: ISerie = {
    id: apiResponse.data.id,
    genres: apiResponse.data.genres.map((genre: IGenres) => genre.name),
    title: apiResponse.data.name,
    description: apiResponse.data.overview,
    rating: apiResponse.data.vote_average,
    user_reviews: apiResponse.data.vote_count,
    release_date_first_episode: new Date(
      apiResponse.data.first_air_date
    ).toLocaleDateString('en-US', {year: 'numeric',
    month: 'long',
    day: 'numeric',}),
    number_seasons: apiResponse.data.number_of_seasons,
    poster: image_route + apiResponse.data.poster_path,
    back_poster: image_route + apiResponse.data.backdrop_path,
  };

  const seasonOne  = await axios.get/* <ISerieSeason> */(
    `${api_general_route}/tv/${id}/season/1?api_key=${YOUR_API_KEY_1}`
  );

  TVSerie.season_one = {
    id: seasonOne.data._id,
    air_date_first_episode: new Date(seasonOne.data.air_date).getFullYear(),
    name:
      seasonOne.data.name.charAt(0).toUpperCase() +
      seasonOne.data.name.slice(1),
    poster: image_route + seasonOne.data.poster_path,
    number_episodes: seasonOne.data.episodes.length,
    season_number: seasonOne.data.season_number,
    episodes: seasonOne.data.episodes.map((episode: IEpisodes) => {
      return {
        id: episode.id,
        name: episode.name,
        overview: episode.overview,
        episode_number: episode.episode_number,
        air_date: new Date(episode.air_date).toLocaleDateString(
          'en-US',
          {year: 'numeric',
    month: 'long',
    day: 'numeric',}
        ),
        image: image_route + episode.still_path,
        duration: episode.runtime,
      };
    }),
  };
  return TVSerie;
};


// Get trailer of TVSerie from API by ID:
export const getTrailerSerie = async (name: string) => {
  let trailer = await axios(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${name} trailer&key=${API_YT_KEY}`
  )
    .then(
      (d) => `https://www.youtube.com/watch?v=${d.data.items[0].id.videoId}`
    )
    .catch((e) => 'https://www.youtube.com/watch?v=SRA_XcsYu3k');
  return trailer;

  // const apiResponse = await axios.get(
  //   `${api_general_route}/tv/${id}/videos?api_key=${YOUR_API_KEY_1}`
  // );

  // const trailer = apiResponse.data.results[0]
  //   ? `https://www.youtube.com/watch?v=${apiResponse.data.results[0].key}`
  //   : null;

  // return trailer;
};

const nameGenre = async (id: string) => {
  let data = await Genre.findById(id);
  return data?.name
};

/* 
interface TGenre{
  serie: boolean,
  id: string,
  name: string,
  description: string,
  poster: string,
  backPoster: string,
  vote_average: number,
  vote_count: number,
  first_air_date: string,
  genre?: string[]
} */

export const getAllSeriesDB = async (omi: number, lim: number) => {
  let dataSeries = await Serie.find().skip(omi).limit(lim);
  /* let dataSeries2 = await axios.get(); */

  let listSeries = [];
  for (let i = 0; i < dataSeries.length; i++) {
    let serie: any = {
      serie: true,
      id: dataSeries[i].id,
      name: dataSeries[i].name,
      description: dataSeries[i].description,
      poster: dataSeries[i].poster,
      backPoster: dataSeries[i].backPoster,
      vote_average: dataSeries[i].vote_average,
      vote_count: dataSeries[i].vote_count,
      first_air_date: dataSeries[i].first_air_date,
    };
    let genre = [];
    for (let j = 0; j < dataSeries[i].genre.length; j++) {
      genre.push(await nameGenre(dataSeries[i].genre[j]));
    }
    serie.genre = genre;
    listSeries.push(serie);
  }
  return listSeries;
};


/* 
module.exports = {
  getTVSeriesByIdApi,
  getTrailerSerie,
}; */
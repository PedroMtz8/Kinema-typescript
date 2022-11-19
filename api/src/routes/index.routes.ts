import { Router } from "express";
const router  = Router();

import { getTrailerSerie, getTVSeriesByIdApi, getAllSeriesDB } from "../middlewares/getSeries";
import { getMovies } from "../middlewares/getMovies";


router.get("/xd", (req, res) => {
    try {
        res.send("holaa")
    } catch (error) {
        let result = (error as DOMException).message;
        return res.status(204).send({ Error: result });
    }
})


// Get TV series detail from JSON:
router.get('/tv/:id', async (req, res) => {
    try {
      const { id } = req.params;
       let TVSeriesDetail2/* : ISerie | "Serie not found" */ = await getTVSeriesByIdApi(id);
       if (typeof TVSeriesDetail2 === 'string') return res.json(TVSeriesDetail2);
      //let detail = await getDetailTVJSON(id);
      let trailer = await getTrailerSerie(TVSeriesDetail2.title);
  
      /* let TVSeriesDetail = {
        ...TVSeriesDetail2,
        trailer,
      }; */
      res.send(TVSeriesDetail2);
    } catch (error) {
        let result = (error as DOMException).message;
      return res.status(404).send({ Error: result });
    }
  });


  router.get('/home/series', async (req, res) => {
    const { page } = req.query;
    try {
       let numberPage = parseFloat(page as string)
       let skip = (numberPage - 1) * 20;
       let limit = 20;
       let data = await getAllSeriesDB(skip, limit);
      /* let data = await getDataTVJSON(page); */
      res.json(data);
    } catch (error) {
      let result = (error as DOMException).message;
      return res.status(204).send({ Error: result });
    }
  });

  router.get('/home/movies', async (req, res) => {
    const { page } = req.query;
    try {
      let movies = await getMovies(page as string);
      res.status(200).send(movies);
    } catch (error) {
      let result = (error as DOMException).message;
      return res.status(204).send({ Error: result });
    }
  });

  export default router
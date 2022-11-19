import { Schema, model } from "mongoose";

const serie = new Schema({
    id: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      genre: {
        type: Array,
        required: true
      },
      popularity: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      poster: {
        type: String,
        required: true
      },
      backPoster: {
        type: String,
        required: true
      },
      vote_average: {
        type: Number,
        required: true
      },
      vote_count: {
        type: Number,
        required: true
      },
      first_air_date: {
        type: String,
        required: true
      }
});

export default model('serie', serie);
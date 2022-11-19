import { Schema, model } from "mongoose";

const genre = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    lowercase: true,
    enum: ['movie', 'tv'],
    required: true
  }
});

export default model('genre', genre);
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is Required']
  },
  director: {
    type: String,
    required: [true, 'Director is Required']
  },
  year: {
    type: Number,
    required: [true, 'Year is Required']
  },
  description: {
    type: String,
    required: [true, 'Description is Required']
  },
  genre: {
    type: String,
    required: [true, 'Genre is Required']
  },
  poster: {
    type: String,
    required: false, // optional, fallback image will be shown if not provided
    default: '' // or provide a default URL if you want
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is Required']
      },
      comment: {
        type: String,
        required: [true, 'Comment is Required']
      }
    }
  ]
});

module.exports = mongoose.model('Movie', movieSchema);

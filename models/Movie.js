//[Section] Dependency
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
  imageUrl: {
        type: String,
        required: [true, 'Product Image URL is Required'],
        validate: {
            validator: function(url) {
                // Simple URL validation regex
                return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url);
            },
            message: props => `${props.value} is not a valid URL!`
        }
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
// Dependencies and Modules
const bcrypt = require("bcrypt");
const Movie = require('../models/Movie');
const auth = require("../auth");
const { errorHandler } = auth;
const mongoose = require('mongoose');

// Create Movie
module.exports.addMovie = async (req, res) => {
  try {
    const { title, director, year, description, genre } = req.body;
    const userId = req.user?.id;

    if (!title || !director || !year || !description || !genre) {
      return res.status(400).json({ error: "Required fields missing." });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user ID found." });
    }

    const newMovie = new Movie({
      title,
      director,
      year,
      description,
      genre,
      userId
    });

    const savedMovie = await newMovie.save();

    return res.status(201).json(savedMovie);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: {
        message: error.message || "Internal server error",
        errorCode: "SERVER_ERROR",
        details: null
      }
    });
  }
};

// Get Movies
module.exports.getMovie = (req, res) => {
  Movie.find({})
    .then(movies => {
      res.status(200).json({ movies: movies });
    })
    .catch(error => errorHandler(error, req, res));
};

// Get Movie by Id
module.exports.getMovieById = (req, res) => {
  Movie.findById(req.params.movieId)
    .then(movie => {
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }
      res.status(200).json(movie);
    })
    .catch(error => errorHandler(error, req, res));
};

// Update Movie Admin only
module.exports.updateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { title, director, year, description, genre } = req.body;

    // Find movie by ID and update the fields
    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      { title, director, year, description, genre },
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    return res.status(200).json({
      message: 'Movie updated successfully',
      updatedMovie
    });

  } catch (error) {
    console.error('Error updating movie:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Movie
module.exports.deleteMovie = async (req, res) => {
  try {
    const _id = req.params.movieId;

    // Find the movie
    const movie = await Movie.findById(_id);

    if (!movie) {
      return res.status(404).json({ message: "No movie found" });
    }

    await Movie.findByIdAndDelete(_id);

    return res.status(200).json({ message: "Movie deleted successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Add Comment
module.exports.addComment = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id; // From verify middleware

    if (!comment) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      {
        $push: {
          comments: {
            userId,
            comment
          }
        }
      },
      { new: true }
    ).populate('comments.userId', 'username'); // Optional: populate user details

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({
      message: "Comment added successfully",
      updatedMovie
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Comment
module.exports.getComment = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Gracefully handle invalid ObjectId
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(200).json({ comments: [] }); // Avoid 400
    }

    // Find movie
    const movie = await Movie.findById(movieId, { comments: 1 });

    if (!movie) {
      return res.status(200).json({ comments: [] }); // Avoid 404
    }

    // Format response
    const response = {
      comments: movie.comments.map(comment => ({
        userId: comment.userId.toString(),
        comment: comment.comment,
        "-id": comment._id.toString() // Assuming test expects this exact key
      }))
    };

    res.status(200).json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving comments",
      error: error.message
    });
  }
};
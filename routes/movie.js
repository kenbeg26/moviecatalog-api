const express = require('express');
const movieController = require('../controllers/movie');

const { verify, verifyAdmin } = require("../auth");

// Routing Component
const router = express.Router();

router.post("/addMovie", verify, movieController.addMovie);

router.get("/getMovies", verify, movieController.getMovie);

router.get("/getMovie/:movieId", verify, movieController.getMovieById);

router.patch("/updateMovie/:movieId", verify, verifyAdmin, movieController.updateMovie);

router.delete("/deleteMovie/:movieId", verify, verifyAdmin, movieController.deleteMovie);

router.patch("/addComment/:movieId", verify, movieController.addComment);

router.get("/getComments/:movieId", verify, movieController.getComment);

module.exports = router;
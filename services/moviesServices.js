import Movie from '../models/Movie.js';

export const countMovies = filter => Movie.countDocuments(filter);

// export const getAllMovies = () => Movie.find({}, 'title director');
export const getAllMovies = (filter = {}, setting = {}) =>
  Movie.find(filter, '-createdAt -updatedAt', setting).populate('owner', 'username email');

export const addMovies = data => Movie.create(data).populate('owner', 'username email');

// export const getMovieById = id => {
//   // const data = Movie.findOne({ _id: id });
//   const data = Movie.findById(id);
//   return data;
// };

// export const getMovieById = id => Movie.findById(id);
export const getMovieByFilter = filter =>
  Movie.findOne(filter, '-createdAt -updatedAt').populate('owner', 'username email');

// export const updateMovieById = (id, data) => Movie.findByIdAndUpdate(id, data);
export const updateMovieByFilter = (filter, data) =>
  Movie.findOneAndUpdate(filter, data).populate('owner', 'username email');

// export const deleteMovieById = id => Movie.findByIdAndDelete(id);
export const deleteMovieByFilter = filter => Movie.findOneAndDelete(filter);

const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
        userId: { type: String, required: true },
        grade: { type: Number, required: true }
    }
   ],
   averageRatings: { type: Number }
})

bookSchema.pre('save', function (next) {
  const ratings = this.ratings.map((rating) => rating.grade);
  const sumOfRatings = ratings.reduce((acc, curr) => acc + curr, 0);
  this.averageRatings = sumOfRatings / ratings.length;
  next();
});

module.exports = mongoose.model('Book', bookSchema)
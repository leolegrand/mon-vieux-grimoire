const express = require('express')
const mongoose = require('mongoose')

const bookRoutes = require('./routes/book.routes')
const userRoutes = require('./routes/user.routes')

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
})
// CORS : Cross Origin Resource Sharing 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);


mongoose.connect('mongodb+srv://leolegrandm:qB5FPknBJbGNo12c@clustermonvieuxgrimoire.htoigap.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))





module.exports = app
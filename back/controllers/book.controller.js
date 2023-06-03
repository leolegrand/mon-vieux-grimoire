const Book = require('../models/book.model.js')

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find()
    res.status(200).json(books)
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

exports.getTopRatedBooks = async (req, res) => {
  try {
    const topRatedBooks = await Book.find()
      .sort({ averageRating: -1 }) // Trie par note moyenne de manière décroissante
      .limit(3) // Limite les résultats à 3 livres

    res.json(topRatedBooks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des livres.' })
  }
}

exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id })
    if (book) {
      res.status(200).json(book)
    } else {
      res.status(404).json({ error: 'Livre non trouvé' })
    }
  } catch (error) {
    res.status(500).json({ error: error })
  }
}


exports.createBook = async (req, res, next) => {
  
  const bookObject = JSON.parse(req.body.book)
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  try {
    await book.save()
    res.status(201).json({ message: 'Objet enregistré !' })
  } catch (error) {
    res.status(400).json({ error })
  }
}

// Contrôleur pour ajouter une note à un livre
exports.addBookRating = async (req, res) => {

   // Vérifier si l'utilisateur a déjà évalué ce livre
  //  const existingRating = await Book.findOne({
  //   _id: req.params.id,
  //   "ratings.userId": req.body.userId
  // })

  // if (existingRating) {
  //   return res.status(400).json({ message: 'Vous avez déjà évalué ce livre' })
  // }


  if(!(req.body.rating  >= 0) && !(req.body.rating  <= 5) && (typeof req.body.rating === 'number')){
    return res.status(500).json({message: req.body.rating + " n'est pas compris entre 0 et 5"})
  }

  try {
    // Trouve dans la base de donnée le book correspondant à l'id de la requête
    const book = await Book.findOne({ _id: req.params.id })

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' })
    }

    // Ajouter la note à la liste des évaluations du livre
    book.ratings.push({ userId : req.body.userId, grade: req.body.rating })

    // Enregistrer les modifications
    await book.save()

    res.status(200).json(book)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Une erreur s\'est produite' })
  }
}






exports.modifyBook = (req, res, next) => {
  const book = new Book({
    _id: req.params.id,
    userId: req.body.userId,
    title: req.body.title,
    author: req.body.title,
    imageUrl: req.body.imageUrl,
    year: req.body.year,
    genre: req.body.genre,
    ratings: req.body.ratings
  })
  Book.updateOne({_id: req.params.id}, book).then(
    () => {
      res.status(201).json({
        message: 'Book updated successfully!'
      })
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      })
    }
  )
}

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      })
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      })
    }
  )
}


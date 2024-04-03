const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const z = require('zod')

const app = express()
app.use(express.json())
app.disable('x-powered-by')

// Todos los recursos que sean movies se identifican con /movies
app.get('/movies', async(req, res) => {
  const { genre } = req.query
  if(genre) {
    const filteredMovies = await movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    res.json(filteredMovies)
  }
  return res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if(movie) return res.json(movie)

  res.status(404).json({message: 'Movie not found'})
})

app.post('/movies', (req, res) => {
  const { title, year, director, duration, poster, genre, rate} = req.body

  if ( !title || !year || !director || !duration || !poster || !genre || !rate) {
    res.status(400).json({ message: "Faltan campos requeridos"})
  }

  if (typeof year !== Number) {
    res.status(400).json({ message: "El año debe ser un numero" })
  }

  if (typeof duration !== Number) {
    res.status(400).json({ message: "La duracion debe ser un numero" })
  }

  const newMovie = {
    id: crypto.randomUUID(), 
    title, 
    year,
    director, 
    duration, 
    poster, 
    genre, 
    rate: rate ?? 0
  }

  movies.push(newMovie)
  res.status(201).json(newMovie)

})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
})
const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://postgres:pass123@localhost:5432/postgres');
const bodyParser = require('body-parser')
const express = require('express')
const port = 3000
const app = express()

const Movie = sequelize.define('Movie', {
              title: Sequelize.TEXT,
              yearOfRelease: Sequelize.INTEGER,
              synopsis: Sequelize.TEXT
})

sequelize.sync()
  .then(() => Promise.all([ 
    Movie.create({ title: 'A Walk To Remember',
                   yearOfRelease: 2002,
                   synopsis: 'Set in North Carolina, "A Walk To Remember" follows the rite of passage of a jaded, aimless high school senior (Shane West) who falls in love with a guileless young woman (Mandy Moore) he and his friends once scorned. The two develop a powerful and inspirational relationship in which they discover truths that take most people a lifetime to learn.' }),
    Movie.create({ title: 'Harry Potter and the Philosopher\'s Stone',
                   yearOfRelease: 2001,
                   synopsis: 'Harry Potter, a boy who learns on his eleventh birthday that he is the orphaned son of two powerful wizards and possesses unique magical powers of his own. He is summoned from his life as an unwanted child to become a student at Hogwarts, an English boarding school for wizards. There, he meets several friends who become his closest allies and help him discover the truth about his parents\' mysterious deaths.' }),
    Movie.create({ title: 'Pretty Woman',
                   yearOfRelease: 1990,
                   synopsis: 'In this modern update on Cinderella, a prostitute and a wealthy businessman fall hard for one another, forming an unlikely pair. While on a business trip in L.A., Edward (Richard Gere), who makes a living buying and breaking up companies, picks up a hooker, Vivian (Julia Roberts), on a lark. After Edward hires Vivian to stay with him for the weekend, the two get closer, only to discover there are significant hurdles to overcome as they try to bridge the gap between their very different worlds.' })
  ]))

app.use(bodyParser.json())

// Create movie
app.post('/movies', (req, res, next) => {
  if (req.body) {
    Movie
        .create(req.body)
        .then(movie => res.json(movie))
        .catch(next)
  } else {
    return res.status(400).end()
  }
})


// Read all movies
app.get('/movies', (req, res, next) => {
  const limit = req.query.limit
  const offset = req.query.offset

  Movie
      .findAndCountAll({
        offset,
        limit
      })
      .then(movies => {
        const result = {
          data: movies.rows,
          total: movies.count
        }
        res.json(result)
      })
      .catch(next)
})

// Read a single movie
app.get('/movies/:id', (req, res, next) => {
  Movie
      .findByPk(req.params.id)
      .then(movie => {
        if (movie) {
          res.json(movie)
        } else {
          res.status(404).json({ message: 'The movie doesn\'t exists' }).end()
        }
      })
      .catch(next)
})

// Update a single movie
app.put('/movies/:id', (req, res, next) => {
  Movie
      .findByPk(req.params.id)
      .then(movie => {
          if (movie) {
              return movie.update(req.body)
                  .then(movie => res.json(movie))
          }
          return res.status(404).json({ message: 'The movie you want to update doesn\'t exists' }).end()
      })
      .catch(next)
})

// Delete a single movie 
app.delete('/movies/:id', (req, res, next) => {
  Movie
      .destroy({
        where: { id: req.params.id }
      })
      .then(movieDeleted => {
        if (movieDeleted) {
          return res.status(200).json({ message: 'Succesfully deleted.' }).end()
        }
        return res.status(404).json({ message: 'The movie you want to delete doesn\'t exists' }).end()
      })
      .catch(next)
})

app.listen(port, () => console.log("listening on port " + port))
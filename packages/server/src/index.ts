import express from 'express'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('hello world!')
})

app.listen(1337, () => {
  console.log(`App listening at http://localhost:${1337}`)
})

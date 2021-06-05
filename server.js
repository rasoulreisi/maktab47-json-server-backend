const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const fs = require('fs')
const path = require('path')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// general upload API (for test)
server.post('/upload', upload.single('image'), function (req, res, next) {
  // req.file is the `image` file
  // req.body will hold the text fields, if there were any
  res.json(req.file)
})

// list all files API (for test)
server.get('/files', (req, res, next) => {
  fs.readdir('./uploads/', (err, files) => {
    if (err) return next(err)
    res.json(files)
  })
})

// download (preview) a file API
server.get('/files/:file_id', (req, res, next) => {
  const { file_id } = req.params
  res.set('Content-Type', 'image/jpeg')
  res.sendFile(path.join(__dirname, 'uploads/'+file_id))
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)

// Add createdAt field with timestamp value when posting to any route
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

// Use default router (CRUDs of db.json)
server.use(router)

server.listen(3000, () => {
  console.log('JSON Server is running')
})

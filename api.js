const express = require('express')
const router = express.Router()
const db = require('./db')
const fn = () => {}

router.get('/api/getArticle', (req, res) => {
  const key = req.query.id
  //console.log(key)
  db.Article.findOne({'_id':key}, (err, doc) => {
    if (err) {
      console.log(err)
    } else if (doc) {
      res.send(doc)
    }
  })
})

router.get('/api/getArticles', (req, res) => {
  //const user = req.query.user
  const user = req.query.state.user.name
  var data_t	
  db.Article.find({'user':user}, 'title date content', (err, doc) => {
    if (err) {
      console.log(err)
    } else if (doc) {
	  //data_t=doc.sort({"content":1})
	  //console.log(data_t)
      res.send(JSON.stringify(doc))
    }
  })
  
})

router.post('/api/setup', function (req, res) {
  new db.User(req.body)
    .save()
    .then(() => {
      res.status(200).end()
      db.initialized = true
    })
    .catch(() => res.status(500).end())
})

router.post('/api/login', (req, res) => {
  const {name, pwd} = req.body
  db.User.findOne({name}, 'pwd', (err, doc) => {
    switch (true) {
      case !!err:
        console.log(err)
        break
      case !doc:
        res.send({state: 0, msg: '账号不存在'})
        break
      case doc.pwd === pwd:
        res.send({state: 1, msg: '登陆成功'})
        break
      case doc.pwd !== pwd:
        res.send({state: 2, msg: '密码错误'})
        break
      default :
        res.send({state: 3, msg: '未知错误'})
    }
  })
})

router.post('/api/saveArticle', (req, res) => {
  const id = req.body._id
  const article = {
    title: req.body.title,
    date: req.body.date,
    content: req.body.content,
    user: req.body.user
  }
  if (id) {
    db.Article.findByIdAndUpdate(id, article, fn)
  } else {
    new db.Article(article).save()
  }
  res.status(200).end()
})

router.post('/api/deleteArticle', (req, res) => {
  db.Article.findByIdAndRemove(req.body.id, fn)
  res.status(200).end()
})

router.post('/api/getLinks', (req, res) => {
  db.Link.find(null, (err, doc) => {
    if (err) {
      console.log(err)
    } else if (doc) {
      res.send(doc)
    }
  })
})

router.post('/api/saveLinks', (req, res) => {
  const links = req.body || []
  db.Link.remove(null, fn)
  const promises = links.map(({name, href}) => new db.Link({name, href}).save())
  Promise.all(promises)
    .then(() => res.status(200).end())
    .catch(() => res.status(500).end())
})

router.post('/api/savePwd', (req, res) => {
  const {name, pwd} = req.body
  db.User.findOneAndUpdate({name}, {pwd}, fn)
  res.status(200).end()
})

module.exports = router

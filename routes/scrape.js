const router = require('express').Router()

const controllers = require('../controllers')

router.post('/', controllers.scrape.init)

module.exports = router
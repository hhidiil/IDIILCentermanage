const express = require('express')
const userRouter = require('../services/user.ctrl.js')
const classRouter = require('../services/classes.ctrl.js')
const fileDeal = require('../services/upload.ctrl.js')
const apiRouter = express.Router()


apiRouter.use('/user', userRouter)
apiRouter.use('/classes', classRouter)
apiRouter.use('/file', fileDeal)

module.exports = apiRouter

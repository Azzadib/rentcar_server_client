import express from 'express'
import path from 'path'
import cokieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'

import models from './models/IndexModel'
import routes from './routes/IndexRoute'

const app = express()

app.use(express.json()) //* parse body params and attach to body
app.use(express.urlencoded({ extended: true }))
app.use(cokieParser())
app.use(helmet())
app.use(compress())
app.use(cors())

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import MainRouter from './../client/MainRouter'
import { StaticRouter } from 'react-router-dom'
import Template from './../template'
//! command code below before building for production
import devBundle from './devBundle'

//! use only on development
devBundle.compile(app)

app.use('/api/test', (_, res) => {
    res.status(200).send({ message: 'This is test page for car-rental api.' })
})

const CURRENT_WORKING_DIR = process.cwd()
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

//* middleware
app.use(async (req, res, next) => {
    req.context = { models }
    next()
})

app.use('/api/car', routes.CarRoute)
app.use('/api/caim', routes.CarImageRoute)
app.use('/api/comment', routes.CarCommentRoute)
app.use('/api/trans', routes.TransactionRoute)
app.use('/api/user', routes.UserRoute)

app.get('/*', (req, res) => {
    const context = {}
    const markup = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
            <MainRouter/>
        </StaticRouter>
    )

    if (context.url) {
        return res.redirect(303, context.url)
    }

    res.status(200).send(Template())
})

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') res.status(401).json({ "error": err.name + ": " + err.message })
    else if (err) {
        res.status(400).json({ "error": err.name + ": " + err.message })
        console.log(err)
    }
})

export default app
const express = require('express')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const authJWT = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')

//Pour permettre au autres application de communiquer avec node (avec front ANGULAR)
app.use(cors())
app.options('*', cors)

//Definition du fichier envirennement
require('dotenv/config')

const API = process.env.API_URL

//Import Routers
const productsRouter = require("./routers/products")
const categoriesRouter = require("./routers/categories")
const ordersRouter = require("./routers/orders")
const usersRouter = require("./routers/users")

//Middlware
//Middlware qui intervient sur la requette pour mentionner qu'elle est de type json
app.use(express.json())
//Display logs (requests...) in specifics format
app.use(morgan('tiny'))
//Fonction de Verification de JWT
app.use(authJWT())
//Gestion des errors detectés
app.use(errorHandler)
//Declarer folder comme static folder
app.use("/public/uploads", express.static(__dirname + "/public/uploads"))

//Routers
app.use(`${API}/product`, productsRouter)
app.use(`${API}/categories`, categoriesRouter)
app.use(`${API}/orders`, ordersRouter)
app.use(`${API}/users`, usersRouter)


//Get request qui renvoie un code HTML pour la route par defaut
app.get("/", (req, res) => {
    res.send("Home Page")
})

//Connexion sur la base de données 
mongoose.connect(process.env.CONNECT_STRING)
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log(err);
    })

// Connexion au serveur sur le port 8080
app.listen(8080, () => {
    console.log("Server Started : http://localhost:8080");
})
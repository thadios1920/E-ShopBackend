const express = require('express')
const router = express.Router()
const {User} = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv/config')

//Get Request to get All Users
router.get(`/`, async (req,res)=>{
    try {
        const UserList = await User.find().select('-passwordHash') // <= Probleme ici !!
        res.send(UserList)
    } catch (error) {
        console.log(error);
    }
})

//Get Request Retourne un User specifique
router.get('/:id', async (req, res) => {
    try {
        user = await User.findById(req.params.id).select('-passwordHash') //sans password
        res.send(user)
    } catch (error) {
        console.log(error);
    }

})

//Ajouter un nouveau User
router.post('/', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),//bcrypt pour vrypter les passwords
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

//Put Request Modifier un user existant
router.put('/:id', async (req, res) => {

    const userExist = await User.findById(req.params.id)
    let newPassword
    if (req.body.password) {//Verifier si il ya un champ password dans la requette 
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash
    }

    user = await User.findByIdAndUpdate(
        req.params.id,
        {
        name: req.body.name,
        email: req.body.email,
        passwordHash: newPassword,//bcrypt pour vrypter les passwords
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
        }, { new: true }// Pour retourner les nouvelles données non pas les anciennes
    )
    if (!user) {
        return res.send('User not found')
    }
    res.send(user)
})
//Creer un compte
router.post('/register', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

//S'authentifier 
router.post('/login',async (req,res)=>{
    const secret = process.env.SECRET_KEY
    const user = await User.findOne({email : req.body.email})
    if (!user) {
        return res.status(400).send('User not found')
    }
    if (user && bcrypt.compareSync(req.body.password,user.passwordHash)) {
        const token = jwt.sign({
            userID : user.id,
            isAdmin : user.isAdmin
        },
        secret,{expiresIn : '1d'})
        res.status(200).send({
            message:'User Authenticated',
            email:user.email,
            token:token
    })
    }else{
        res.status(400).send('Wrong password')
    }
})

//Renvoie le nembre des utilisateurs 
router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments()//Pour fonctionner countDocument pas de params
    if (!userCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        userCount: userCount
    });
});

//Delete Request Supprimer un utilisateur
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then(user => {
            if (user) { return res.send(200).json({ success: true, message: 'User DELETED' }) }
        })
        .catch(err => { console.log(err); })
})

//Exporter le module
module.exports = router
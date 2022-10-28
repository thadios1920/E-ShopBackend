const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

//Get Request Retourne toute la liste des Categories
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false })
    }
    res.send(categoryList);
})

//Get Request Retourne une Category specifique
router.get('/:id', async (req, res) => {
    try {
        category = await Category.findById(req.params.id)
        res.send(category)
    } catch (error) {
        console.log(error);
    }

})

//Post Request Ajouter une categorie 
router.post(`/`, (req, res) => {
    //New categorie va avoire le contenue du requette 
    const category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    //New categorie va etre enregistrer dans la BD
    category.save()
        .then(createdcategory => { res.status(201).json(createdcategory) })
        .catch(err => { console.log(err) })

})

//Put Request Modifier une category existante
router.put('/:id', async (req, res) => {
    category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        }, { new: true }// Pour retourner les nouvelles données non pas les anciennes
    )
    if (!category) {
        return res.send('Category not found')
    }
    res.send(category)
})

//Delete Request Supprimer une categorie
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then(category => {
            if (category) { return res.send(200).json({ success: true, message: 'Category DELETED' }) }
        })
        .catch(err => { console.log(err); })
})

module.exports = router;
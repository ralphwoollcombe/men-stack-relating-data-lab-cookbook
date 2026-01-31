const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Ingredient = require('../models/ingredient.js');

router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});
    res.render('ingredients/index.ejs', { ingredients: ingredients });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  try {
    const newIngredient = new Ingredient(req.body);
  console.log(newIngredient)
  await newIngredient.save();    
    res.redirect('/ingredients')
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.delete('/:ingredientId', async (req, res) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.ingredientId);
    res.redirect('/ingredients');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;

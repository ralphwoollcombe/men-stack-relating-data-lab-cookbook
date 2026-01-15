const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');


//routes

router.get('/', async (req, res) => {
  try {
      // console.log('res.locals.user', res.locals.user)
        const userRecipes = await Recipe.find({
        owner: res.locals.user._id
      })
        res.render('recipes/index.ejs', {
          recipes: userRecipes,
        })
  } catch (error) {
      console.log(error);
      res.redirect('/')
  }
  // const allRecipes = await Recipe.find({}).populate('owner');
  // console.log('all recipes', allRecipes)
  //   res.render('recipes/index.ejs', {
  //   recipes: allRecipes
  // });
});

router.get('/new', async (req, res) => {
  try {
    const ingredients = await Ingredient.find({}).sort('name');
    res.render('recipes/new.ejs', { ingredients: ingredients });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.post('/', async (req,res) => {
  try {
    const name = req.body.name;
    const instructions = req.body.instructions;
    const ingredients = req.body.ingredients;
    const newRecipe = new Recipe({
      name, instructions, ingredients
    });
  newRecipe.owner = req.session.user._id;
  console.log(newRecipe)
  await newRecipe.save();
  res.redirect('/recipes')
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }
})

router.get('/:recipeId', async (req,res) => {
  const recipe = await Recipe.findById(
    req.params.recipeId
  ).populate('ingredients');
    res.render("recipes/show.ejs", {
      recipe
    });
})

router.delete('/:recipeId', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        if (recipe.owner.equals(req.session.user._id)) {
            console.log('Permission granted')
            await Recipe.deleteOne();
            res.redirect('/recipes')
        } else {
            res.send('You do not have the permission to delete this recipe')
        }
    } catch (error) {
        console.log(error);
        res.redirect('/')
    };
});

router.get('/:recipeId/edit', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        console.log('recipe ID', req.params.recipeId)
        res.render('recipes/edit.ejs', {
            recipe: recipe,
        })
    } catch (error) {
        console.log(error);
        res.redirect('/')
    };
})

router.put('/:recipeId', async (req, res) => {
  try {
    const currentrecipe = await Recipe.findById(req.params.recipeId);
    if (currentrecipe.owner.equals(req.session.user._id)) {
      await currentrecipe.updateOne(req.body);
      res.redirect('/recipes');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;

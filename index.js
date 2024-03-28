const express = require('express');
const axios = require('axios');
const ejs = require('ejs');

require('dotenv').config();

const app = express();

const key_api = process.env.API_KEY; 

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/home', async (req, res) => {
    try {
        // Obtener recetas aleatorias
        const response = await axios.get(`https://api.spoonacular.com/recipes/random?number=3&apiKey=${key_api}`);
        const randomRecipes = response.data.recipes;
        
        // Renderizar la vista con las recetas aleatorias
        res.render('index.ejs', { randomRecipes });
    } catch (error) {
        console.error("Error fetching random recipes:", error);
        res.status(500).send("An error occurred while fetching random recipes.");
    }
});

app.post('/search', async (req, res) => {
    const {query} = req.body;
    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${key_api}`)
    const recipes = response.data.results;
    res.render('results', {recipes})
});

app.get('/recipe/:id', async (req, res) => {
    const {id} = req.params;
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${key_api}`)
    const recipe = response.data;
    res.render('recipe', {recipe})
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log('Server is running')
})

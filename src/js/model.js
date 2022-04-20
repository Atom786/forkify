import { async } from 'regenerator-runtime/runtime';
import { API_URL, KEY } from './configuration.js';
import { getJSON, sendJSON } from './helpers.js';
import { RESULTS_PER_PAGE } from './configuration.js';
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
};

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        cookingTime: recipe.cooking_time,
        image: recipe.image_url,
        publisher: recipe.publisher,
        ingredients: recipe.ingredients,
        servings: recipe.servings,
        sourceUrl: recipe.source_url,
        title: recipe.title
    };
}

export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}${id}`);
        state.recipe = createRecipeObject(data);
        //console.log(response, data);

        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else
            state.recipe.bookmarked = false;
        console.log(state.recipe);
    }
    catch (error) {
        console.error(`${error}`);
        throw error;
    }
};

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`);
        //console.log(data);
        state.search.results = data.data.recipes.map(recipes => {
            return {
                id: recipes.id,
                title: recipes.title,
                publisher: recipes.publisher,
                image: recipes.image_url,
            };
        });
        //console.log(state.search.results);
    }
    catch (error) {
        console.error(`${error}`);
        throw error;
    }
}
//loadSearchResults('pizza');
state.search.page = 1;

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ingredient => {
        ingredient.quantity = (ingredient.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = newServings;
};

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id) { state.recipe.bookmarked = true; }
    persistBookmarks();
};

export const deleteBookmark = function (id) {
    const index = state.bookmarks.findIndex(el => el.id === id); //Deleting bookmarks
    state.bookmarks.splice(index, 1);

    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
    try {
        //console.log(Object.entries(newRecipe));
        const ingredients = Object.entries(newRecipe)
            .filter(entries => entries[0].startsWith('ingredient') && entries[1] !== '')
            .map(ings => {
                const ingsArray = ings[1].replaceAll(' ', '').split(',');
                if (ingsArray.length !== 3) throw new Error("Wrong input Plz enter valid inputs");
                const [quantity, unit, description] = ingsArray;
                return { quantity: quantity ? +quantity : null, unit, description };
            });
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };
        //console.log(recipe);
        const data = await sendJSON(`${API_URL}?key= ${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        console.log(data);
    }
    catch (error) {
        throw error;
    }
};
const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};
init();
//console.log(state.bookmarks);
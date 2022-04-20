import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// add type="module" to script tag in index.html

//const recipeContainer = document.querySelector('.recipe');

//console.log("Testing");
/*
if (module.hot) {
  module.hot.accept();
}
*/
// Function for loading and rendering recipe
const controlRecipes = async function () {
  try {
    //Getting the id from the url
    const id = window.location.hash.slice(1);
    //console.log(id);
    if (!id) return;

    recipeView.renderSpinner();   // Calling spinner 

    //
    resultsView.update(model.getSearchResultsPage());

    // 1) Loading Recipes
    await model.loadRecipe(id);      // Calling from model.js
    //const { recipe } = model.state;

    // 2) Rendering Recipes
    recipeView.render(model.state.recipe); // Calling from recipeView.js

    // 3) Rendering Initial Pagination
    //paginationView.render(model.state.search);
  }
  catch (error) {
    console.log(error);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //console.log(resultsView);
    // 1) Getting search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Loading search results
    await model.loadSearchResults(query);

    // 3) Rendering search results
    //console.log(model.state.search.results);
    //resultsView.render(model.state.search.results);
    //console.log(model.getSearchResultsPage(1));
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  }
  catch (error) {
    console.log(error);
  }
};
controlSearchResults();

// Rendering Pagination
const controlPagination = function (goToPage) {
  //console.log('Page Controller');
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
}

// Updating the recipe
const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.render(model.state.recipe); // Updating recipe view
};

//Bookmarks
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  //console.log(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id);
  //console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks); // Rendering(Showing) bookmarks
}

const controlAddRecipes = async function (newRecipe) {
  try {
    //console.log(newRecipe);
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe); // Rendering added recipe
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 5000);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message);
  }
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipes);
};
init();

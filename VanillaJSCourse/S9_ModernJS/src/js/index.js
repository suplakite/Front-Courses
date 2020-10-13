// Global app controller
import Search from "./modules/Search";
import List from "./modules/List";
import Likes from "./modules/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";
import Recipe from "./modules/Recipe";

// Global State of the app
// - Search object
// - Current recipe obj
// - Shopping list obj
// - Liked recipes

const state = {};
/* SEARCH CONTROLLER */
const controlSearch = async () => {
  // Get query from view
  const query = searchView.getInput();
  console.log(query);

  if (query) {
    // New search obj and add it to state
    state.search = new Search(query);

    // Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      // Search for recipes
      await state.search.getResults();

      // render results on UI
      console.log(state.search.result);
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      clearLoader();
      alert(error);
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);

    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/* RECIPE CONTROLER */

const controlRecipe = async () => {
  // GET ID FROM URL
  const id = window.location.hash.replace("#", "");
  console.log(id);
  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    ///highlight selected item
    if (state.search) searchView.highlightSelected(id);

    // Create new Recipe
    state.recipe = new Recipe(id);
    // get recipe data
    try {
      await state.recipe.getRecipe();

      state.recipe.parseIngredients();

      state.recipe.calcTime();
      state.recipe.calcServings();
      clearLoader();

      recipeView.renderRecipe(state.recipe, likes.isLiked(id)); //
    } catch (error) {
      alert(error);
    }
    //Calculate servings and cooking time
    // render recipr
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

// LIST CONTROLER
const controlList = () => {
  // Create a new list if there is none yet
  if (!state.list) state.list = new List();

  // add each ingredient to list and Ui

  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);

    listView.renderItem(item);
  });
};

// LIKES CONTROLER
const controlLikes = () => {
  const currentID = state.recipe.id;
  if (!state.likes.isLiked(currentID)) {
    // Add liked to the state likes
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // toggle like btn
    likesView.toggleLikeBtn(true);
    // Add like to UI list
    likesView.renderLike(newLike);
  } else {
    // remove like from state
    state.likes.deleteLike(currentID);
    likesView.toggleLikeBtn(false);
    // togle like btn
    //remove like from ui lsit
    likesView.deleteLike(currentID);
  }

  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// restore likes on load
window.addEventListener("load", () => {
  state.likes = new Likes();
  //restore likes
  state.likes.readStorage();
  //togle btn
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  // render likes
  state.likes.likes.forEach((el) => {
    likes.likesView(like);
  });
});

// delete and update list
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  console.log(id);

  // delete btn
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // delete from state and UI
    state.list.deleteItem(id);
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

// Recipe button
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServIngr(state.recipe);
    }
    state.recipe.updateServings("dec");
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServIngr(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ing to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLikes();
  }
  console.log(state.recipe);
});

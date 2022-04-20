import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    // Getting elements 
    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _buttonOpen = document.querySelector('.nav__btn--add-recipe');
    _buttonClose = document.querySelector('.btn--close-modal');

    //Calling addRecipe
    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    // Changing class
    toggleWindow() {
        this._window.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    }

    // Rendering Form
    _addHandlerShowWindow() {
        this._buttonOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    //  Hiding Form
    _addHandlerHideWindow() {
        this._buttonClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    // Uploading Recipe
    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataArray = [...new FormData(this)];
            const data = Object.fromEntries(dataArray);
            handler(data);
        });
    }

    _generateMarkup() {

    }
}
export default new AddRecipeView();
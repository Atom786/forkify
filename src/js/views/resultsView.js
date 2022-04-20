import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = "Sorry We couldn't find that recipe please try another one";
  _message = '';

  _generateMarkup() {
    console.log(this._data);
    return this._data.map(this._generateMarkupPreview).join('');
  }
  _generateMarkupPreview(result) {
    // put # bfore ${results.id} and crossorigin = "anonymous" in img
    const id = window.location.hash.slice(1);
    return `
      <li class="preview">
        <a class="preview__link ${result.ids === id ? 'preview__link--active' : ''}" href="#${result.id}"> 
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" crossorigin="anonymous"/>
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
          </div>
        </a>
      </li>
        `;
  }
}
export default new ResultsView();
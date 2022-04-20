import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;
    //console.log(this._data);
    //console.log(this._generateMarkup());
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Updating data
  update(data) {
    //if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(this._parentElement.querySelectorAll('*'));
    //console.log(newElements);
    //console.log(currentElements);

    //Looping

    newElements.forEach((newElement, i) => {
      const currentElement = currentElements[i];
      //console.log(currentElement, newElement.isEqualNode(currentElement));
      //console.log(newElement.firstChild);
      //newElement && newElement.firstChild
      if (newElement && !(newElement.isEqualNode(currentElement)) && (newElement.firstChild?.nodeValue.trim() !== '')) {
        //console.log(newElement.firstChild.nodeValue.trim());
        currentElement.textContent = newElement.textContent;
      }

      //Changing content without loading image
      if (!newElement.isEqualNode(currentElement)) {
        Array.from(newElement.attributes).forEach(attribute => currentElement.setAttribute(attribute.name, attribute.value));
      }
    });
  }

  // Function clearing html code from parentElement
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // Function generating Spinner
  renderSpinner() {
    const markup = `<div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    //this._parentElement.innerHTML = '';
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Error Handling
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Event Handler
  addHandlerRender(controlRecipes) {
    // Function executes on hashchange: id of url change and on loading
    window.addEventListener('hashchange', controlRecipes);
    window.addEventListener('load', controlRecipes);
  }

}
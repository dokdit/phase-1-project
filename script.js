const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const resultContainer = document.getElementById('result-container');
const errorMessage = document.getElementById('error-message');
const favoritesList = document.getElementById('favorites-list');

const favorites = []; // Array to store favorite words

searchBtn.addEventListener('click', () => {
  performSearch();
});

searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    performSearch();
  }
});

function performSearch() {
  const word = searchInput.value.trim();

  if (word !== '') {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(response => response.json())
      .then(data => {
        displayResults(data);
        errorMessage.textContent = '';
      })
      .catch(error => {
        console.error(error);
        resultContainer.innerHTML = '';
        errorMessage.textContent = 'An error occurred while fetching the data.';
      });
  }
}

function displayResults(data) {
  resultContainer.innerHTML = '';

  if (data.length === 0) {
    resultContainer.innerHTML = 'No results found.';
    return;
  }

  data.forEach(entry => {
    const word = entry.word;
    const meanings = entry.meanings;

    const entryDiv = document.createElement('div');
    entryDiv.classList.add('entry');
    

    const wordHeading = document.createElement('h2');
    wordHeading.textContent = word;
    entryDiv.appendChild(wordHeading);

    meanings.forEach(meaning => {
      const partOfSpeech = meaning.partOfSpeech;
      const definitions = meaning.definitions;

      const meaningDiv = document.createElement('div');
      meaningDiv.classList.add('meaning');

      // Change the background color to pink
      meaningDiv.style.backgroundColor = 'pink';

      const partOfSpeechHeading = document.createElement('h3');
      partOfSpeechHeading.textContent = `(${partOfSpeech})`;
      meaningDiv.appendChild(partOfSpeechHeading);

      definitions.forEach(definition => {
        const definitionText = document.createElement('p');
        definitionText.textContent = definition.definition;
        meaningDiv.appendChild(definitionText);
      });

      entryDiv.appendChild(meaningDiv);
    });

    const favoriteBtn = document.createElement('button');
    favoriteBtn.textContent = 'Add to Favorites';
    //click event for adding a word to favorites
    favoriteBtn.addEventListener('click', () => {
      addFavorite(word);
    });

    entryDiv.appendChild(favoriteBtn);
    resultContainer.appendChild(entryDiv);
  });
}

function addFavorite(word) {
  if (!favorites.includes(word)) {
    favorites.push(word);
    updateFavoritesList();
  }
}

function updateFavoritesList() {
  favoritesList.innerHTML = '';

  if (favorites.length === 0) {
    favoritesList.innerHTML = '<li>No favorite words yet.</li>';
    return;
  }

  favorites.forEach(word => {
    const listItem = document.createElement('li');
    const favoriteBtn = document.createElement('button');
    favoriteBtn.textContent = word;
    favoriteBtn.addEventListener('click', () => {
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(data => {
          displayResults(data);
          errorMessage.textContent = '';
        })
        .catch(error => {
          console.error(error);
          resultContainer.innerHTML = '';
          errorMessage.textContent = 'An error occurred while fetching the data.';
        });
    });
    listItem.appendChild(favoriteBtn);
    favoritesList.appendChild(listItem);
  });
}



updateFavoritesList();



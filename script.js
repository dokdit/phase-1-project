// Get references to HTML elements
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const resultContainer = document.getElementById('result-container');
const errorMessage = document.getElementById('error-message');
const favoritesList = document.getElementById('favorites-list');

// Array to store favorite words
const favorites = [];

// Event listener for the "click" event on the search button
searchBtn.addEventListener('click', () => {
  performSearch();
});

// Event listener for the "keyup" event on the search input field, specifically for the "Enter" key
searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    performSearch();
  }
});

// Function to perform the search
function performSearch() {
  const word = searchInput.value.trim();

  if (word !== '') {
    // Fetch data from API
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

// Function to display search results
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
    // Click event for adding a word to favorites
    favoriteBtn.addEventListener('click', () => {
      addFavorite(word);
    });

    entryDiv.appendChild(favoriteBtn);
    resultContainer.appendChild(entryDiv);
  });
}

// Function to add a word to favorites
function addFavorite(word) {
  if (!favorites.includes(word)) {
    favorites.push(word);
    updateFavoritesList();
  }
}


// Function to update the favorites list
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

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '   x';
    removeBtn.addEventListener('click', () => {
      removeFavorite(word);
    });
    listItem.appendChild(removeBtn);

    favoritesList.appendChild(listItem);
  });
}

function removeFavorite(word) {
  const wordIndex = favorites.indexOf(word);
  if (wordIndex !== -1) {
    favorites.splice(wordIndex, 1);
    updateFavoritesList();
  }
}

// Initial function call to update the favorites list
updateFavoritesList();

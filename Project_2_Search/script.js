document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const loadingSpinner = document.getElementById("loading-spinner");
    const searchLegend = document.getElementById("search-legend");
    const resultsContainer = document.getElementById("results-container");

    let typingTimer;
    const doneTypingInterval = 500;

    searchInput.addEventListener("input", debounce(handleSearchInput, doneTypingInterval));

    async function handleSearchInput() {
        clearTimeout(typingTimer);

        if (searchInput.value.trim() === "") {
            hideLoadingAndLegend();
            clearResults();
        } else {
            typingTimer = setTimeout(async () => {
                try {
                    showLoadingAndLegend();
                    const searchTerm = searchInput.value;
                    const apiUrl = `https://dummyjson.com/products/search?q=${searchTerm}&limit=5&delay=1000`;

                    const response = await fetch(apiUrl);

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    displayResults(data.products);
                    hideLoadingAndLegend();
                } catch (error) {
                    console.error('Error fetching data:', error);
                    hideLoadingAndLegend();
                }
            }, doneTypingInterval);
        }
    }

    function displayResults(results) {
        clearResults();

        if (results.length > 0) {
            for (const result of results) {
                const resultElement = document.createElement("div");
                resultElement.classList.add("results");

                const nameElement = document.createElement("div");
                nameElement.classList.add("results-name");
                nameElement.textContent = result.title;

                const priceElement = document.createElement("div");
                priceElement.classList.add("results-price");
                priceElement.textContent = `$${result.price.toFixed(2)}`;

                resultElement.appendChild(nameElement);
                resultElement.appendChild(priceElement);

                resultsContainer.appendChild(resultElement);
            }
            resultsContainer.style.display = "block";
        } else {
            const notFoundElement = document.createElement("div");
            notFoundElement.classList.add("results");
            notFoundElement.textContent = "No results found.";

            resultsContainer.appendChild(notFoundElement);
            resultsContainer.style.display = "block";
        }
    }

    function showLoadingAndLegend() {
        loadingSpinner.style.display = "block";
        searchLegend.style.display = "block";
    }

    function hideLoadingAndLegend() {
        if (!searchInput.value) {
            searchLegend.style.display = "none";
        }
        loadingSpinner.style.display = "none";
    }

    function clearResults() {
        resultsContainer.style.display = "none";
        resultsContainer.innerHTML = "";
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});

document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const propertiesGrid = document.getElementById("properties-grid");
  const loadMoreBtn = document.getElementById("load-more-btn");
  const resultsCount = document.querySelector(
    ".results-count span:first-child"
  );
  const totalCount = document.querySelector(".results-count span:last-child");
  const filterForm = document.querySelector(".filters-sidebar");
  const resetBtn = document.querySelector(".btn-reset");
  const applyBtn = document.querySelector(".btn-apply-filters");

  // State variables
  let properties = [];
  let filteredProperties = [];
  let visibleCount = 6;

  // Default values
  const DEFAULTS = {
    minPrice: 0,
    maxPrice: 100000,
    minSize: 0,
    maxSize: 500,
  };

  // Load properties from JSON
  async function loadProperties() {
    try {
      const response = await fetch("../data/properties.json");
      if (!response.ok) throw new Error("Network response was not ok");

      properties = await response.json();
      // Initialize properties with default values if missing
      properties.forEach((p) => {
        p.amenities = p.amenities || [];
      });
      filteredProperties = [...properties];
      totalCount.textContent = properties.length;
      displayProperties();
    } catch (error) {
      console.error("Error loading properties:", error);
      showError("Error loading data. Please try again later.");
    }
  }

  function showError(message) {
    propertiesGrid.innerHTML = `<div class="error-message"><p>${message}</p></div>`;
  }

  // Display property cards
  function displayProperties() {
    propertiesGrid.innerHTML = "";

    if (filteredProperties.length === 0) {
      propertiesGrid.innerHTML = `
        <div class="no-results">
          <p>Nothing found. Try changing your search parameters.</p>
        </div>
      `;
      return;
    }

    const toShow = filteredProperties.slice(0, visibleCount);
    toShow.forEach((property) => {
      const card = document.createElement("div");
      card.className = "property-card";
      card.innerHTML = `
        <img src="${property.image}" alt="${
        property.title
      }" class="property-image" 
             onerror="this.onerror=null;this.src='../images/placeholder.jpg'">
        <div class="property-details">
          <h3 class="property-title">${property.title}</h3>
          <div class="property-location">
            <i class="fas fa-map-marker-alt"></i>
            ${property.location}
          </div>
          <div class="property-features">
            <div class="feature">
              <i class="fas fa-bed"></i>
              ${property.bedrooms} кім.
            </div>
            <div class="feature">
              <i class="fas fa-bath"></i>
              ${property.bathrooms} санв.
            </div>
            <div class="feature">
              <i class="fas fa-ruler-combined"></i>
              ${property.size} м²
            </div>
          </div>
          <div class="property-price">
            ${
              property.transaction === "rent"
                ? `₴${property.price.toLocaleString("uk-UA")}/міс`
                : `₴${property.price.toLocaleString("uk-UA")}`
            }
          </div>
          <div class="property-actions">
            <button class="btn-details">Детальніше</button>
            <button class="btn-favorite">
              <i class="far fa-heart"></i>
            </button>
          </div>
        </div>
      `;
      propertiesGrid.appendChild(card);
    });

    updateResultsCount();
    toggleLoadMoreButton();
  }

  // Main filter function
  function filterProperties() {
    // Get all filter values
    const filters = getCurrentFilters();

    // Apply filters
    filteredProperties = properties.filter((property) => {
      return (
        matchesSearch(property, filters.searchTerm) &&
        matchesType(property, filters.propertyType) &&
        matchesTransaction(property, filters.transactionType) &&
        matchesPrice(property, filters.minPrice, filters.maxPrice) &&
        matchesSize(property, filters.minSize, filters.maxSize) &&
        matchesAmenities(property, filters.selectedAmenities)
      );
    });

    // Apply sorting
    sortProperties(filters.sortValue);

    // Reset visible count and update UI
    visibleCount = 6;
    displayProperties();
  }

  // Get all current filter values
  function getCurrentFilters() {
    const priceInputs = document.querySelectorAll(
      ".filter-group:nth-of-type(4) .range-input"
    );
    const sizeInputs = document.querySelectorAll(
      ".filter-group:nth-of-type(6) .range-input"
    );

    return {
      searchTerm: document
        .querySelector(".filter-input")
        .value.trim()
        .toLowerCase(),
      propertyType: document.querySelector("#sort-by").value,
      transactionType: document.querySelector(
        'input[name="transaction-type"]:checked'
      ).value,
      minPrice: getValidNumber(priceInputs[0], DEFAULTS.minPrice),
      maxPrice: getValidNumber(priceInputs[1], DEFAULTS.maxPrice),
      minSize: getValidNumber(sizeInputs[0], DEFAULTS.minSize),
      maxSize: getValidNumber(sizeInputs[1], DEFAULTS.maxSize),
      selectedAmenities: getSelectedAmenities(),
      sortValue: document.querySelector(
        ".filter-group:last-of-type .filter-select"
      ).value,
    };
  }

  // Filter helper functions
  function matchesSearch(property, searchTerm) {
    if (!searchTerm) return true;
    return (
      property.title.toLowerCase().includes(searchTerm) ||
      property.location.toLowerCase().includes(searchTerm)
    );
  }

  function matchesType(property, type) {
    if (!type) return true;
    return property.type === type;
  }

  function matchesTransaction(property, transactionType) {
    return property.transaction === transactionType;
  }

  function matchesPrice(property, minPrice, maxPrice) {
    return property.price >= minPrice && property.price <= maxPrice;
  }

  function matchesSize(property, minSize, maxSize) {
    return property.size >= minSize && property.size <= maxSize;
  }

  function matchesAmenities(property, amenities) {
    if (amenities.length === 0) return true;
    return amenities.every((a) => property.amenities.includes(a));
  }

  // Get selected amenities from checkboxes
  function getSelectedAmenities() {
    const amenityCheckboxes = document.querySelectorAll(
      '.checkbox-options input[type="checkbox"]'
    );
    const amenityValues = ["balcony", "garden", "garage", "pool", "elevator"];

    const selected = [];
    amenityCheckboxes.forEach((checkbox, index) => {
      if (checkbox.checked && index < amenityValues.length) {
        selected.push(amenityValues[index]);
      }
    });
    return selected;
  }

  // Validate number input
  function getValidNumber(input, defaultValue) {
    if (!input) return defaultValue;
    const value = parseInt(input.value);
    return isNaN(value) ? defaultValue : Math.max(0, value);
  }

  // Sort properties
  function sortProperties(sortValue) {
    switch (sortValue) {
      case "price-asc":
        filteredProperties.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredProperties.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filteredProperties.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
        break;
      default:
        // No sorting
        break;
    }
  }

  // Reset all filters
  function resetFilters() {
    // Reset radio buttons
    document.querySelector(
      'input[name="transaction-type"][value="rent"]'
    ).checked = true;

    // Reset property type dropdown
    document.querySelector("#sort-by").value = "";

    // Reset location search
    document.querySelector(".filter-input").value = "";

    // Reset price inputs
    const priceInputs = document.querySelectorAll(
      ".filter-group:nth-of-type(4) .range-input"
    );
    if (priceInputs.length >= 2) {
      priceInputs[0].value = DEFAULTS.minPrice;
      priceInputs[1].value = DEFAULTS.maxPrice;
    }

    // Reset price sliders
    const priceSliders = document.querySelectorAll(".range-slider .slider");
    if (priceSliders.length >= 2) {
      priceSliders[0].value = DEFAULTS.minPrice;
      priceSliders[1].value = DEFAULTS.maxPrice;
    }

    // Reset size inputs
    const sizeInputs = document.querySelectorAll(
      ".filter-group:nth-of-type(6) .range-input"
    );
    if (sizeInputs.length >= 2) {
      sizeInputs[0].value = DEFAULTS.minSize;
      sizeInputs[1].value = DEFAULTS.maxSize;
    }

    // Reset amenities checkboxes
    document
      .querySelectorAll('.checkbox-options input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    // Reset sort dropdown
    document.querySelector(".filter-group:last-of-type .filter-select").value =
      "newest";

    // Reset application state
    filteredProperties = [...properties];
    visibleCount = 6;
    displayProperties();
  }

  function updateResultsCount() {
    if (resultsCount) {
      resultsCount.textContent = Math.min(
        visibleCount,
        filteredProperties.length
      );
    }
    if (totalCount) {
      totalCount.textContent = filteredProperties.length;
    }
  }

  function toggleLoadMoreButton() {
    if (loadMoreBtn) {
      loadMoreBtn.style.display =
        visibleCount >= filteredProperties.length ? "none" : "block";
    }
  }

  // Initialize event listeners
  function setupEventListeners() {
    // Load more properties
    loadMoreBtn?.addEventListener("click", () => {
      visibleCount += 6;
      displayProperties();
    });

    // Filter changes
    filterForm?.addEventListener("change", filterProperties);
    filterForm?.addEventListener("input", (e) => {
      if (
        e.target.classList.contains("range-input") ||
        e.target.type === "checkbox" ||
        e.target.classList.contains("filter-input")
      ) {
        filterProperties();
      }
    });

    // Apply filters button
    applyBtn?.addEventListener("click", filterProperties);

    // Reset filters
    resetBtn?.addEventListener("click", resetFilters);
  }

  // Initialize the page
  loadProperties();
  setupEventListeners();
});

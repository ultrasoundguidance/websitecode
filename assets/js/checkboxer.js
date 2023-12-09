/* eslint-env browser */

/**
 * Remove parent divs when one particular child is empty.
 * Used on procedure and index pages to remove tags from
 * display and the generated table of contents.
 */
$('.postItem:empty').parent().remove();

buildChecks();

/**
 * Create an unordered list of checkboxes from headings with
 * the data-slug attribute. Adds labels, Tailwind styling, and
 * event handlers, then adds the list-item checkboxes to the DOM.
 * On first display, calls a function to check for extant preferences.
 */
function buildChecks() {
  // Pull all elements with custom data-slug value
  const grabTags = document.querySelectorAll('[data-slug]');

  // Tailwind classes to assign checkboxes and labels
  const inputAssignedClasses =
    'mr-4 form-check text-primary-900 dark:text-accent-400 rounded';
  const labelAssignedClasses =
    'text-primary-900 dark:text-accent-400 font-medium';

  // Root element to build lists inside of
  const tagBlock = document.getElementById('toc-list');

  let ugPrefs;
  let appPath = [location.pathname];
  let appPrefs;
  ugPrefs = JSON.parse(localStorage.getItem('ugPrefs'));

  if (ugPrefs != null) {
    if (appPath in ugPrefs) {
      appPrefs = ugPrefs[appPath];
    }
  } else {
    appPrefs = {};
  }

  // (1.) Loop through list of elements with slugs
  for (tag of grabTags) {
    // (1.) Create new list items to hold the elements
    let newLi = document.createElement('li');
    newLi.className = 'toc-list-item';

    // (2.a.) Create new checkboxes
    let newInput = document.createElement('input');
    newInput.type = 'checkbox';
    newInput.value = tag.id;
    newInput.name = tag.textContent.trim();

    // (2.a.i) Add event listener to checkbox
    newInput.addEventListener(
      'click',
      checkBoxHandler.bind(null, newInput.value)
    );

    // (2.b.) and labels for those checkboxes
    let newInputLabel = document.createElement('label');
    newInputLabel.htmlFor = newInput.value;
    newInputLabel.textContent = tag.textContent.trim();

    // (3.) Add Tailwind styling
    newInput.classList = inputAssignedClasses;
    newInputLabel.classList = labelAssignedClasses;

    // (4.) and add them to the DOM
    tagBlock.appendChild(newLi);
    newLi.appendChild(newInput);
    newLi.appendChild(newInputLabel);

    if (appPrefs != null) {
      if (newInput.value in appPrefs) {
        newInput.checked = true;
      }
    }
  }
  firstRender();
}

/**
 * On click, examines state of all checkboxes. If:
 *   - No boxes are checked, displays all categories.
 *   - 1 box is checked, hides all other categories.
 *   - >=1 box is checked, toggles display of this category.
 * After resolving display, writes preferences to localStorage.
 */
function checkBoxHandler(inputId, evt) {
  const checked = getBoxes('CHECKED');
  const unchecked = getBoxes('UNCHECKED');
  const categories = getBoxes('CATEGORIES');

  // (1.b.) If no boxes are checked,
  if (checked.length == 0) {
    // Make all videos visible,
    categories.forEach((categorie) => categorie.classList.remove('hidden'));
  } else if (checked.length == 1) {
    // (2.b) If this is the only unchecked box
    // (2.c) Loop through all categories

    for (category of categories) {
      // (2.d) and loop through all unchecked boxes

      for (uncheck of unchecked) {
        // (2.e.) and if a category is unchecked,

        if (category.dataset.visibility == uncheck.value) {
          // (2.f.) then hide it

          category.classList.add('hidden');
        }
      }
    }
  } else {
    // (3.a) Find the box that matches,
    const checkedCategory = document.querySelector(
      `[data-visibility=${CSS.escape(inputId)}]`
    );
    // (3.b) and adjust its display
    checkedCategory.classList.toggle('hidden');
  }

  setPreferences();
}

/**
 * After buildChecks() runs on page initialization, check for stored
 * preferences. If any previous sessions stored checked box values,
 * change display to reflect the last visit's state.
 */
function firstRender() {
  const checked = getBoxes('CHECKED');
  if (checked.length > 0) {
    const unchecked = getBoxes('UNCHECKED');
    for (uncheck of unchecked) {
      const categoryToHide = document.querySelector(
        `[data-visibility=${CSS.escape(uncheck.value)}]`
      );
      categoryToHide.classList.toggle('hidden');
    }
  }
}

/**
 * Builds an object to store the state of all checkboxes. Then,
 * writes the object to localStorage as a string.
 */
function setPreferences() {
  // Get existing preferences
  let ugPrefs = JSON.parse(localStorage.getItem('ugPrefs'));

  // If there are none, build the object
  if (ugPrefs === null) {
    ugPrefs = {};
    ugPrefs[location.pathname] = {};
  }

  // Build an object to store this page's preferences
  let appPrefs = {};

  // Store this session's preferences in the new object
  const checked = getBoxes('CHECKED');
  if (checked.length > 0) {
    for (let i = 0; i < checked.length; i++) {
      appPrefs[`${checked[i].value}`] = true;
    }
  }

  // Overwrite the old session's preferences with the new one
  ugPrefs[location.pathname] = appPrefs;

  // Write the object
  localStorage.setItem('ugPrefs', JSON.stringify(ugPrefs));
}

/**
 * Simple function to return a list of un/checked boxes as NodeLists.
 */
function getBoxes(KIND) {
  switch (KIND) {
    case 'CHECKED':
      return document.querySelectorAll('input:checked');
    case 'UNCHECKED':
      return document.querySelectorAll('input:not(:checked)');
    case 'CATEGORIES':
      return document.querySelectorAll('[data-visibility]');
    case 'BOXES':
      return document.querySelectorAll('input[type="checkbox"]');
  }
}

/**
 * Read preferences from localStorage. Sanitizes the inputs by
 * comparing the list of keys read in to a list of all categories
 * present on the page, and discarding anything that either
 *   (1) doesn't match a category name
     (2) isn't a boolean.
 */
function getPreferences() {
  // Check if there are preferences in localStorage
  const appPath = [location.pathname];
  const maxLength = 2000;

  let appPrefs = sanitizePreferences(appPath, maxLength);
  return appPrefs;
}

/**
 * Get string data from localStorage and cap at appropriate length.
 * Then parse the string data and compare to categories on the page.
 * Only load data that matches categories on the page, and manually
 * assign 'true' values, instead of relying on data stored in
 * localStorage.
 */
function sanitizePreferences(appPath, maxLength) {
  // Pull string data
  let ugPrefs = localStorage.getItem('ugPrefs');

  if (ugPrefs !== null) {
    // Prevent overruns
    if (ugPrefs.length > maxLength) {
      return {};
    }

    // Load categories
    const categoryDivs = getBoxes('BOXES');
    let categories = [];
    for (i = 0; i < categoryDivs.length; i++) {
      categories.push(categoryDivs[i].value);
    }

    // Pull parsed JSON preferences
    ugPrefs = JSON.parse(localStorage.getItem('ugPrefs'));

    // Adjust for page preferences instead of global object
    let initialPrefs = ugPrefs[appPath];
    let sanitizedPrefs = {};

    // Check if page preferences are valid categories
    for (initialPref in initialPrefs) {
      if (categories.includes(initialPref)) {
        sanitizedPrefs[`${initialPref}`] = true;
      }
    }

    return sanitizedPrefs;
  }

  // If there are no preferences, return empty object
  return {};
}

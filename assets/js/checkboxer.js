/* eslint-env browser */

/**
 * Remove parent divs when one particular child is empty
 * Used on procedure and index pages to remove tags from
 * display and the generated table of contents.
 */

$('.postItem:empty').parent().remove();

/**
 * Pull elements with custom data-slug value, then
 * build list items with checkboxes and labels,
 * apply custom Tailwind styling, and add them to
 * the DOM.
 *
 * If no boxes are checked, display all categories.
 *
 *
 */

buildChecks();

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
  let appPrefs;
  ugPrefs = JSON.parse(localStorage.getItem('ugPrefs'));

  if (ugPrefs != null) {
    if (location.pathname in ugPrefs) {
      appPrefs = ugPrefs[location.pathname];
    } else {
      appPrefs = null;
    }
  }

  // (1.) Loop through list of elements with slugs
  for (i = 0; i < grabTags.length; i++) {
    // (1.) Create new list items to hold the elements
    let newLi = document.createElement('li');
    newLi.className = 'toc-list-item';

    // (2.a.) Create new checkboxes
    let newInput = document.createElement('input');
    newInput.type = 'checkbox';
    newInput.value = grabTags[i].id;
    newInput.name = grabTags[i].textContent.trim();

    // (2.a.i) Add event listener to checkbox
    newInput.addEventListener('click', renderBoxes.bind(null, newInput.value));

    // (2.b.) and labels for those checkboxes
    let newInputLabel = document.createElement('label');
    newInputLabel.htmlFor = newInput.value;
    newInputLabel.textContent = grabTags[i].textContent.trim();

    // (3.) Add Tailwind styling
    newInput.classList = inputAssignedClasses;
    newInputLabel.classList = labelAssignedClasses;

    // (4.) and add them to the DOM
    tagBlock.appendChild(newLi);
    newLi.appendChild(newInput);
    newLi.appendChild(newInputLabel);

    if (appPrefs !== null) {
      if (newInput.value in ugPrefs[location.pathname]) {
        newInput.checked = true;
      }
    }
  }
  firstRender();
}

function renderBoxes(inputId, evt) {
  const checked = getBoxes('CHECKED');
  const unchecked = getBoxes('UNCHECKED');
  const categories = document.querySelectorAll('[data-visibility]');

  // (1.b.) If no boxes are checked,
  if (checked.length == 0) {
    // Make all videos visible,
    categories.forEach((categorie) => categorie.classList.remove('hidden'));
  } else if (checked.length == 1) {
    // (2.b) If this is the only unchecked box
    // (2.c) Loop through all categories

    for (i = 0; i < categories.length; i++) {
      // (2.d) and loop through all unchecked boxes

      for (j = 0; j < unchecked.length; j++) {
        // (2.e.) and if a category is unchecked,

        if (categories[i].dataset.visibility == unchecked[j].value) {
          // (2.f.) then hide it

          categories[i].classList.add('hidden');
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

function firstRender() {
  const checked = getBoxes('CHECKED');
  if (checked.length > 0) {
    const unchecked = getBoxes('UNCHECKED');
    for (i = 0; i < unchecked.length; i++) {
      const categoryToHide = document.querySelector(
        `[data-visibility=${CSS.escape(unchecked[i].value)}]`
      );
      categoryToHide.classList.toggle('hidden');
    }
  }
}

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

function getBoxes(KIND) {
  if (KIND === 'CHECKED') {
    return document.querySelectorAll('input:checked');
  } else if (KIND === 'UNCHECKED') {
    return document.querySelectorAll('input:not(:checked)');
  }
}

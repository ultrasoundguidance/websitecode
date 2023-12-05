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
  }
}

function renderBoxes(inputId, evt) {
  // (1.) Make a list of all checked boxes
  const grabChecked = document.querySelectorAll('input:checked');

  // (1.a.) Get list of categories
  const grabCategories = document.querySelectorAll('[data-visibility]');

  // (1.b.) If no boxes are checked,
  if (grabChecked.length == 0) {
    // Make all videos visible,
    grabCategories.forEach((categorie) => categorie.classList.remove('hidden'));
    console.log('No videos hidden');
    // and don't do anything else
    return;
  }

  // (2.a.) Create list of unchecked boxes
  const grabUnchecked = document.querySelectorAll('input:not(:checked)');

  // (2.b) If this is the only unchecked box
  if (grabChecked.length == 1) {
    // (2.c) Loop through all categories
    for (i = 0; i < grabCategories.length; i++) {
      // (2.d) and loop through all unchecked boxes
      for (j = 0; j < grabUnchecked.length; j++) {
        // (2.e.) and if a category is unchecked,
        if (grabCategories[i].dataset.visibility == grabUnchecked[j].value) {
          // (2.f.) then hide it
          grabCategories[i].classList.add('hidden');
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

function setPreferences() {
  // Get existing preferences
  let ugPrefs = JSON.parse(localStorage.getItem('ugPrefs'));

  // If there are none, build the object
  if (ugPrefs === null) {
    ugPrefs = {};
    ugPrefs[application.pathname] = {};
  }

  // Build an object to store this page's preferences
  let appPrefs = {};

  // Store this session's preferences in the new object
  const grabChecked = document.querySelectorAll('input:checked');
  for (let i = 0; i < grabChecked.length; i++) {
    appPrefs[`${grabChecked[i].value}`] = true;
  }

  // Overwrite the old session's preferences with the new one
  ugPrefs[location.pathname] = appPrefs;

  // Write the object
  localStorage.setItem('ugPrefs', JSON.stringify(ugPrefs));
}

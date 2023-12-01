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
  // (1.a.) Get list of categories
  const grabCategories = document.querySelectorAll('[data-visibility]');

  // (1.b.) Get list of unchecked boxes
  const grabUnchecked = document.querySelectorAll('input:not(:checked)');

  // (1.c.) Get list of checked boxes
  const grabChecked = document.querySelectorAll('input:checked');

  // (2.) If one box is checked, hide all other boxes
}

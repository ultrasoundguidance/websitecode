/* eslint-env browser */

/**
 * Remove parent divs when one particular child is empty
 * Used on procedure and index pages to remove tags from
 * display and the generated table of contents.
 */
 
 $(".postItem:empty").parent().remove();

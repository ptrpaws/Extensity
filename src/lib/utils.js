/**
 * Truncates a string to a certain length, appending '...'.
 * @param {string} str The string to prune.
 * @param {number} length The maximum length.
 * @returns {string}
 */
export function prune(str, length) {
  if (!str || str.length <= length) {
    return str;
  }
  return str.slice(0, length - 3) + '...';
}

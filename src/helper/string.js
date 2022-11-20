module.exports = {
  /**
   *
   * @param {string} str
   * @param {string} prefix
   * @return {string}
   */
  removePrefix: function (str, prefix) {
    if (!str.startsWith(prefix)) return str;
    return str.slice(prefix.length);
  },
};

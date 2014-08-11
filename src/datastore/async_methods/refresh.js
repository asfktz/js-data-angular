function errorPrefix(resourceName, id) {
  return 'DS.refresh(' + resourceName + ', ' + id + '[, options]): ';
}

/**
 * @doc method
 * @id DS.async_methods:refresh
 * @name refresh
 * @description
 * Like find(), except the resource is only refreshed from the server if it already exists in the data store.
 *
 * ## Signature:
 * ```js
 * DS.refresh(resourceName, id)
 * ```
 * ## Example:
 *
 * ```js
 *  // Exists in the data store, but we want a fresh copy
 *  DS.get('document', 5);
 *
 *  DS.refresh('document', 5)
 *  .then(function (document) {
 *      document; // The fresh copy
 *  });
 *
 *  // Does not exist in the data store
 *  DS.get('document', 6); // undefined
 *
 *  DS.refresh('document', 6).then(function (document) {
 *      document; // undeinfed
 *  }); // false
 * ```
 *
 * ## Throws
 *
 * - `{IllegalArgumentError}`
 * - `{NonexistentResourceError}`
 *
 * @param {string} resourceName The resource type, e.g. 'user', 'comment', etc.
 * @param {string|number} id The primary key of the item to refresh from the server.
 * @param {object=} options Optional configuration passed through to `DS.find` if it is called.
 * @returns {Promise} A Promise created by the $q server.
 *
 * ## Resolves with:
 *
 * - `{object}` - `item` - A reference to the refreshed item.
 *
 * ## Rejects with:
 *
 * - `{IllegalArgumentError}`
 * - `{NonexistentResourceError}`
 */
function refresh(resourceName, id, options) {
  var IA = this.errors.IA;

  options = options || {};

  if (!this.definitions[resourceName]) {
    throw new this.errors.NER(errorPrefix(resourceName, id) + resourceName);
  } else if (!this.utils.isString(id) && !this.utils.isNumber(id)) {
    throw new IA(errorPrefix(resourceName, id) + 'id: Must be a string or a number!');
  } else if (!this.utils.isObject(options)) {
    throw new IA(errorPrefix(resourceName, id) + 'options: Must be an object!');
  } else {
    options.bypassCache = true;

    if (this.get(resourceName, id)) {
      return this.find(resourceName, id, options);
    } else {
      var deferred = this.$q.defer();
      deferred.resolve();
      return deferred.promise;
    }
  }
}

module.exports = refresh;

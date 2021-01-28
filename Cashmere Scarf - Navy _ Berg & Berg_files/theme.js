window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;

    options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;

    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + iframeWrapperClass + '"></div>');
      
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = $.extend({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param {object} variant - Currently selected variant
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param {object} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  });

  return Variants;
})();


/*================ Sections ================*/
/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Product = (function() {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    productThumbs: '[data-product-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]'
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    var sectionId = this.$container.attr('data-section-id');
    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());

    var options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject
    };

    this.settings = {};
    this.namespace = '.product';
    this.variants = new slate.Variants(options);
    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);

    this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
    this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));

    if (this.$featuredImage.length > 0) {
      this.settings.imageSize = slate.Image.imageSize(this.$featuredImage.attr('src'));
      slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);

      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
    }
  }

  Product.prototype = $.extend({}, Product.prototype, {

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      if (variant) {
        $(selectors.priceWrapper, this.$container).removeClass('hide');
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(selectors.priceWrapper, this.$container).addClass('hide');
        return;
      }

      if (variant.available) {
        $(selectors.addToCart, this.$container).prop('disabled', false);
        $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {
      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);

      $(selectors.productPrice, this.$container)
        .html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $compareEls.removeClass('hide');
      } else {
        $comparePrice.html('');
        $compareEls.addClass('hide');
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;
      var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);

      this.$featuredImage.attr('src', sizedImgUrl);
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }
  });

  return Product;
})();


/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // Toggle new/edit address forms
  $('.address-new-toggle').on('click', function() {
    $newAddressForm.toggleClass('hide');
  });

  $('.address-edit-toggle').on('click', function() {
    var formId = $(this).data('form-id');
    $('#EditAddress_' + formId).toggleClass('hide');
  });

  $('.address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  var config = {
    recoverPasswordForm: '#RecoverPassword',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }
})();


/*================ Custom ================*/
theme.collectionPage = (function() {

  function init() {

  }

  return {
    init
  };
})();
theme.lazyLoad = (function() {

  function initLazyLoad() {
    const loadMoreBtn = document.querySelector('.trigger_exemptify');
    initLazyOnScroll();
    initLazyOnHover();

    if (loadMoreBtn !== null) {
      loadMoreBtn.addEventListener('click', () => afterLoadMore())
    }

    function initLazyOnScroll() {
      const windowHeight = window.innerHeight;
      const lazyImages = document.querySelectorAll('.lazy-image');
      const lazyBGImages = document.querySelectorAll('.lazy-bg-image');
      const imageNum = document.querySelectorAll('.lazy-image').length;

      for (let i = 0; i in lazyBGImages; i++) {
        const lazyImage = lazyBGImages[i];

        if (windowHeight > lazyBGImages[i].getBoundingClientRect().top) {
          setTimeout(() => {
            setSrc(lazyBGImages[i])
          }, 500)
        }

        window.addEventListener('scroll', function() {
          if (windowHeight > lazyBGImages[i].getBoundingClientRect().top) {

            if (lazyBGImages[i].classList.contains('lazy-bg-image')) {
              setSrc(lazyBGImages[i])
            }
          }
        });
      }

      for (let i = 0; i in lazyImages; i++) {
        const lazyImage = lazyImages[i];

        if (lazyImages[i].closest('.hidden') && collectionPage) {
          return;
        }

        if (windowHeight > lazyImages[i].getBoundingClientRect().top) {
          setTimeout(() => {
            setSrc(lazyImages[i])
          }, 500)
        }

        window.addEventListener('scroll', function() {
          if (windowHeight > lazyImages[i].getBoundingClientRect().top) {

            if (lazyImages[i].classList.contains('lazy-image')) {
              setSrc(lazyImages[i])
            }
          }
        });
      }
    }

    function setSrc(image) {
      if (image.classList.contains('lazy-bg-image')) {

        if (image.dataset.imageMobile !== undefined && window.innerWidth < 992) {
          image.style.backgroundImage = `url('${image.dataset.imageMobile}')`;
        } else {
          image.style.backgroundImage = `url('${image.dataset.image}')`;  
        }

        image.classList.remove('lazy-bg-image');
      }

      if (image.classList.contains('lazy-image')) {
         if (image.dataset.imageMobile !== undefined && window.innerWidth < 992) {
          image.setAttribute('src', image.dataset.imageMobile);
        } else {
          image.setAttribute('src', image.dataset.image);
        }
      }

      imageHasBeenLoaded(image).then(() => {
        // Image have loaded.
        console.log('Image has been loaded')

        if (image.classList.contains('lazy-image')) {
          image.classList.remove('lazy-image');
        }

        image.classList.add('loaded-image');
      });
    }

    function imageHasBeenLoaded(image) {
      return new Promise(resolve => image.onload = resolve)
    }

    function initLazyOnHover() {
      const productImages = document.querySelectorAll('.tempimage');

      for (let i = 0; i in productImages; i++) {
        productImages[i].addEventListener('mouseenter', function(e) {
          if (productImages[i].querySelector('.flipimage').classList.contains('lazy-image-hover')) {
            productImages[i].querySelector('.flipimage').classList.remove('lazy-image-hover');
            productImages[i].querySelector('.flipimage').setAttribute('src', productImages[i].querySelector('.flipimage').dataset.image);
          }
        });
      }
    }

    function afterLoadMore() {
      const productImages = document.querySelectorAll('.tempimage');

      for (let i = 0; i in productImages; i++) {
        productImages[i].querySelector('.flipimage').classList.remove('lazy-image-hover');
        productImages[i].querySelector('.flipimage').setAttribute('src', productImages[i].querySelector('.flipimage').dataset.image);
      }
    }
  }

  return {
    initLazyLoad: initLazyLoad
  };
})();
theme.megaFilter = (function() {
  let addedFiltersObj = {
    color: [],
    size: [],
    brand: []
  };
  let fetchNumber = 0;
  let resProducts = '';

  const prodArr = JSON.parse(sessionStorage.getItem('filterProdArr'));

  function initMegaFilter() {
    productFilterIn();

    function productFilterIn() {
      const products = document.querySelectorAll('.product');
      const colorFilter = document.getElementById('color-filter');
      const sizeFilter = document.getElementById('size-filter');
      const brandFilter = document.getElementById('brand-filter');
      const filterHeader = document.querySelector('.filter-wrap p.header');
      let allSizes = [];
      let allColors = [];
      let allBrands = [];

      // for (let i = 0; i in products; i++) {
      //   let variantsFilterItems = products[i].querySelectorAll('.variants-filter item');
      //   let productBrand = products[i].querySelector('.product-brand') !== null ? products[i].querySelector('.product-brand').dataset.filter : 'No brand';

      //   allBrands.push(productBrand)

      //   for (let i = 0; i in variantsFilterItems; i++) {
      //     if (variantsFilterItems[i].classList.contains('product-sizes')) {
      //       allSizes.push(variantsFilterItems[i].dataset.filter)
      //     }
      //     if (variantsFilterItems[i].classList.contains('product-colors')) {
      //       allColors.push(variantsFilterItems[i].dataset.filter)
      //     }
      //   }
      // }

      for (let i = 0; i in prodArr; i++) {
        allBrands.push(prodArr[i].vendor)

        for (let j = 0; j in prodArr[i].variants; j++) {
          allSizes.push(prodArr[i].variants[j].option1)
        }

        for (let j = 0; j in prodArr[i].tags; j++) {
          if (prodArr[i].tags[j].startsWith('BASECOLOUR_')) {
            allColors.push(prodArr[i].tags[j].replace('BASECOLOUR_', ''))
          }
        }
      }

      // Remove duplicates
      const uniqueSizes = [...new Set(allSizes)]
      const uniqueColors = [...new Set(allColors)]
      const uniqueMaterials = [...new Set(allMaterials)]
      const uniqueModels = [...new Set(allModels)]
      const uniquePatterns = [...new Set(allPatterns)]
      let templateColors = '';
      let templateSizes = '';
      let templateMaterials = '';
      let templateModels = '';
      let templatePatterns = '';

      templateColors = `
        <div class="select-wrap">
          <div class="nice-select select">Color</div>
          <ul class="drop-list">
          ${uniqueColors.map((color) =>
          `<li data-value="${color}" data-option="color"><span>${color}</span></li>`).join('')}
          <ul>
        </div>
      `;

      templateSizes = `
        <div class="select-wrap">
          <div class="nice-select select">Size</div>
          <ul class="drop-list">
          ${uniqueSizes.map((size) =>
          `<li data-value="${size}" data-option="size"><span>${size}</span></li>`).join('')}
          <ul>
        </div>
      `;

      templateMaterials = `
        <div class="select-wrap">
          <div class="nice-select select">Material</div>
          <ul class="drop-list">
          ${uniqueMaterials.map((material) =>
          `<li data-value="${material}" data-option="material"><span>${material}</span></li>`).join('')}
          <ul>
        </div>
      `;

      templateModels = `
        <div class="select-wrap">
          <div class="nice-select select">Model</div>
          <ul class="drop-list">
          ${uniqueModels.map((model) =>
          `<li data-value="${model}" data-option="model"><span>${model}</span></li>`).join('')}
          <ul>
        </div>
      `;

      templatePatterns = `
        <div class="select-wrap">
          <div class="nice-select select">Pattern</div>
          <ul class="drop-list">
          ${uniquePatterns.map((pattern) =>
          `<li data-value="${pattern}" data-option="pattern"><span>${pattern}</span></li>`).join('')}
          <ul>
        </div>
      `;

      colorFilter.innerHTML = templateColors;
      sizeFilter.innerHTML = templateSizes;
      brandFilter.innerHTML = templateBrands;

      filterHeader.classList.remove('pre-load');

      const selectors = document.querySelectorAll('.filter-wrap select');

      for (let i = 0; i in selectors; i++) {
        selectors[i].addEventListener('change', function() {
          const productWrapper = document.querySelectorAll('.product-wrapper');
          const filterOpt = this.dataset.option;
          const filterValue = this.value;

          // Add selected filter to right array in the global filter object
          if (filterOpt == 'color' && addedFiltersObj.color.indexOf(filterValue) === -1) {
            addedFiltersObj.color.push(filterValue);
          }

          if (filterOpt == 'brand' && addedFiltersObj.brand.indexOf(filterValue) === -1) {
            addedFiltersObj.brand.push(filterValue);
          }

          if (filterOpt == 'size' && addedFiltersObj.size.indexOf(filterValue) === -1) {
            addedFiltersObj.size.push(filterValue);
          }

          // filterInColorSizeBrand(filterValue, productWrapper, filterOpt)
          renderProducts(prodArr)
        });
      }

      if (window.innerWidth > 1024) {
        const selectorWrapsDesktop = document.querySelectorAll('.select-wrap');
        const selectorDesktop = document.querySelectorAll('.filter .drop-list li');

        for (let i = 0; i in selectorWrapsDesktop; i++) {

          selectorWrapsDesktop[i].addEventListener('click', function() {
            const productWrapper = document.querySelectorAll('.product-wrapper');

            removeActiveFromAll();

            if (this.classList.contains('active')) {
              this.classList.remove('active');
            } else {
              this.classList.add('active');
            }
          });

          window.addEventListener('click', function(e) {
            if (!e.target.closest('.select-wrap') || e.target.closest('.drop-list')) {
              selectorWrapsDesktop[i].classList.remove('active');
            }
          });
        }

        function removeActiveFromAll() {
          for (let i = 0; i in selectorWrapsDesktop; i++) {
            selectorWrapsDesktop[i].classList.remove('active');
          }
        }

        for (let i = 0; i in selectorDesktop; i++) {
          selectorDesktop[i].addEventListener('click', function() {
            const productWrapper = document.querySelectorAll('.product-wrapper');
            const filterOpt = this.dataset.option;
            const filterValue = this.dataset.value;

            // this.closest('.drop-list').querySelector('li.current').classList.remove('current');

            // this.classList.add('current');

            // this.closest('.select-wrap').querySelector('.select').innerHTML = this.textContent;

            // Add selected filter to right array in the global filter object
            if (filterOpt == 'color' && addedFiltersObj.color.indexOf(filterValue) === -1) {
              addedFiltersObj.color.push(filterValue);
            }

            if (filterOpt == 'brand' && addedFiltersObj.brand.indexOf(filterValue) === -1) {
              addedFiltersObj.brand.push(filterValue);
            }

            if (filterOpt == 'size' && addedFiltersObj.size.indexOf(filterValue) === -1) {
              addedFiltersObj.size.push(filterValue);
            }

            // filterInColorSizeBrand(filterValue, productWrapper, filterOpt)
            renderProducts(prodArr)
          });
        }
      }
    }
  }

  function renderProducts(productsArr) {
    const filteredProductsWrap = document.querySelector('.filtered-products');
    const originalProductsWrap = document.querySelector('.not-filtered');
    const pagination = document.querySelector('.pagination-wrap');
    const filterSelectWrap = document.querySelector('.product-filter');

    let productsTemplate = '';

    productsArr.map((product) => {
      productsTemplate += `
        <div class="col-6 col-md-4 col-lg-4 product-wrapper filtered ${product.variants.length > 1 ? 'multiple-sizes' : ''}">
          <div class="relative">
            <a href="/products/${product.handle}" class="product">
              <div class="product-image">
                <div class="badge badge-sold-out ${product.available === false ? '' : 'd-none'}"><span>Sold out</span></div>
                <img data-image="${product.images[0] === null ? '' : product.images[0]}" />
              </div>
              <p class="text-uppercase product-header">${product.vendor}</p>
              <p class="text-uppercase product-header">${product.title}</p>
              <p class="product-price">
                ${product.compare_at_price !== null && product.compare_at_price !== 0 
                ? `<span class="new-price"><span class="money">${product.price / 100} kr</span></span>
                <span class="old-price"><span class="money">${product.compare_at_price / 100} kr</span></span>`
                : `<span class="money">${product.price / 100} kr</span>`}
              </p>
              <div class="material"><p class="small">${product.variants[0].option3 !== null ? product.variants[0].option3 : ''}</p></div>
              <div class="variants-filter">
                ${product.variants.map((variant) => variant.available === true ? `<item class="product-sizes" data-filter="${variant.option1}"></item>` : '')}
                ${`<item class="product-colors" data-filter="${product.tags.map((tag) => tag.startsWith('BASECOLOUR_') ? tag.replace('BASECOLOUR_', '') : '').join('')}"></item>`}
                <item class="product-brand" data-filter="${product.vendor}"></item>
              </div>
            </a>
            <div class="all-sizes justify-content-center">
              ${product.variants.map((variant) => `
                <a href="/products/${product.handle}?variant=${variant.id}" class="size d-flex${variant.available !== true ? ' out-of-stock' : ''}"><span>${variant.option1}</span></a>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    })

    if (addedFiltersObj.color.length === 0 &&
      addedFiltersObj.size.length === 0 &&
      addedFiltersObj.brand.length === 0) {
      if (pagination !== null) {
        pagination.classList.remove('d-none');
      }
      filterSelectWrap.classList.remove('searching')
      originalProductsWrap.classList.remove('d-none');
      filteredProductsWrap.innerHTML = '';
    } else {
      if (pagination !== null) {
        pagination.classList.add('d-none');
      }
      originalProductsWrap.classList.add('d-none');
      filteredProductsWrap.innerHTML = productsTemplate;
    }

    if (typeof ACSCurrency !== "undefined" && typeof ACSCurrency.moneyFormats !== "undefined") { mlvedaload(); }

    multiFilter();
  }

  function multiFilter() {

    // Set up filter ojbect in session storage to be able to filter on next page
    if (addedFiltersObj.color.length === 0 && addedFiltersObj.brand.length === 0 && addedFiltersObj.size.length === 0) {
      sessionStorage.removeItem('filtered');
    } else {
      sessionStorage.setItem('filtered', JSON.stringify(addedFiltersObj));
    }

    const products = document.querySelectorAll('.filtered-products .product-wrapper');
    const addedFiltersWrap = document.querySelector('.filter-items-wrap');
    const filterSelectWrap = document.querySelector('.product-filter');
    const resetAll = document.querySelector('.reset-all');
    const resetAllCount = document.querySelector('.reset-all #filter-reset-num');
    const brandFilter = addedFiltersObj.brand;
    const sizeFilter = addedFiltersObj.size;
    const colorFilter = addedFiltersObj.color;
    const noItemsInFilter = brandFilter.length + sizeFilter.length + colorFilter.length;

    // Set up filter tags
    let addedFiltersTemplate = `
      <div class="added-filters">
        ${addedFiltersObj.color.map(item => 
          `<div class="filter-item remove-filter" data-filter="${item}"><span>${item}</span> <span><img src="https://cdn.shopify.com/s/files/1/0169/8175/3956/t/4/assets/icon-white-close.svg?63377" /></span></div>`
        ).join('')}
        ${addedFiltersObj.brand.map(item => 
          `<div class="filter-item remove-filter" data-filter="${item}"><span>${item}</span> <span><img src="https://cdn.shopify.com/s/files/1/0169/8175/3956/t/4/assets/icon-white-close.svg?63377" /></span></div>`
        ).join('')}
        ${addedFiltersObj.size.map(item => 
          `<div class="filter-item remove-filter" data-filter="${item}"><span>${item}</span> <span><img src="https://cdn.shopify.com/s/files/1/0169/8175/3956/t/4/assets/icon-white-close.svg?63377" /></span></div>`
        ).join('')}
      </div>
    `;

    noItemsInFilter === 0 ? addedFiltersWrap.innerHTML = '' : addedFiltersWrap.innerHTML = addedFiltersTemplate;

    const addedFiltersItems = document.querySelectorAll('.added-filters .filter-item');

    filterSelectWrap.classList.add('searching');
    resetAllCount.innerHTML = addedFiltersItems.length;

    addedFiltersItems.length === 0 ? resetAll.classList.add('d-none') : resetAll.classList.remove('d-none');

    for (let i = 0; i in addedFiltersItems; i++) {
      addedFiltersItems[i].addEventListener('click', function(e) {
        addedFiltersItems[i].remove();

        updateFilterObj(this.dataset.filter)
      })
    }

    for (let i = 0; i in products; i++) {
      const product = products[i];
      const allBrands = product.querySelector('.product-brand').dataset.filter;
      const allColors = product.querySelector('.product-colors') !== null ? product.querySelector('.product-colors').dataset.filter : 'No color';
      const allSizesItems = product.querySelectorAll('.product-sizes');
      const allSizes = [];

      for (let i = 0; i in allSizesItems; i++) {
        allSizes.push(allSizesItems[i].dataset.filter);
      }

      // Hide all products so we can later show matched ones
      product.classList.add('filtered');

      if (brandFilter.length === 0 && colorFilter.length === 0 && sizeFilter.length === 0) {
        product.classList.remove('filtered');
      }

      let match = {
        brand: brandFilter.length === 0 ? true : false,
        color: colorFilter.length === 0 ? true : false,
        size: sizeFilter.length === 0 ? true : false
      }

      // If filter value exist in product filter, set it to true
      for (let i = 0; i in brandFilter; i++) {
        if (brandFilter[i] == allBrands) {
          match.brand = true;
        }
      }

      for (let i = 0; i in colorFilter; i++) {
        if (colorFilter[i] == allColors) {
          match.color = true;
        }
      }

      for (let i = 0; i in allSizes; i++) {
        const size = allSizes[i];

        for (let i = 0; i in sizeFilter; i++) {
          if (sizeFilter[i] == size) {
            match.size = true;
          }
        }
      }

      //If all match, show product
      if (match.brand && match.color && match.size) {
        product.querySelector('.product-image img').setAttribute('src', product.querySelector('.product-image img').dataset.image);
        product.classList.remove('filtered');
      }
    }

    resetFilter(resetAll);
  }

  function resetFilter(button) {
    button.addEventListener('click', function() {
      addedFiltersObj = {
        color: [],
        size: [],
        brand: []
      };
      renderProducts(filterProdArr);
    });
  }

  function updateFilterObj(value) {
    console.log('Updated filter');

    // Get value of clicked filter tag and remove it from right array
    addedFiltersObj.color = addedFiltersObj.color.filter(item => item !== value);
    addedFiltersObj.brand = addedFiltersObj.brand.filter(item => item !== value);
    addedFiltersObj.size = addedFiltersObj.size.filter(item => item !== value);

    renderProducts(filterProdArr);
  }

  return {
    initMegaFilter
  };
})();

theme.multiFilter = (function() {
  let addedFiltersObj = {
    size: [],
    color: [],
    material: [],
    model: [],
    pattern: []
  };

  function initMultiFilter() {
    const loadMorBtn = document.querySelector('.trigger_exemptify');

    if (sessionStorage.getItem('filter') !== null) {
      addedFiltersObj = JSON.parse(sessionStorage.getItem('filter'));

      multiFilter();
    }

    function setupMultiFilter() {
      const products = document.querySelectorAll('.card');
      const colorFilter = document.getElementById('color-filter');
      const sizeFilter = document.getElementById('size-filter');
      const materialFilter = document.getElementById('material-filter');
      const modelFilter = document.getElementById('model-filter');
      const patternFilter = document.getElementById('pattern-filter');
      // const filterHeader = document.querySelector('.filter-wrap p.header');
      let allSizes = [];
      let allColors = [];
      let allMaterials = [];
      let allModels = [];
      let allPatterns = [];

      // Check all products to see what filters they have
      for (let i = 0; i in products; i++) {
        let variantsFilterItems = products[i].querySelectorAll('.variants-filter item');

        for (let i = 0; i in variantsFilterItems; i++) {
          if (variantsFilterItems[i].classList.contains('product-sizes')) {
            allSizes.push(variantsFilterItems[i].dataset.filter)
          }
          if (variantsFilterItems[i].classList.contains('product-colors')) {
            allColors.push(variantsFilterItems[i].dataset.filter)
          }
          if (variantsFilterItems[i].classList.contains('product-materials')) {
            allMaterials.push(variantsFilterItems[i].dataset.filter)
          }
          if (variantsFilterItems[i].classList.contains('product-models')) {
            allModels.push(variantsFilterItems[i].dataset.filter)
          }
          if (variantsFilterItems[i].classList.contains('product-patterns')) {
            allPatterns.push(variantsFilterItems[i].dataset.filter)
          }
        }
      }

      // Remove duplicates
      const uniqueSizes = [...new Set(allSizes)]
      const uniqueColors = [...new Set(allColors)]
      const uniqueMaterials = [...new Set(allMaterials)]
      const uniqueModels = [...new Set(allModels)]
      const uniquePatterns = [...new Set(allPatterns)]
      let templateColors = '';
      let templateSizes = '';
      let templateMaterials = '';
      let templateModels = '';
      let templatePatterns = '';

      templateColors = `
        <div class="select-wrap">
          <div class="nice-select select">Color</div>
          <ul class="drop-list">
          ${uniqueColors.map((color) =>
          `<li data-value="${color}" data-option="color"><span>${color}</span></li>`).join('')}
          <ul>
        </div>
      `;

      templateSizes = `
        <div class="select-wrap">
          <div class="nice-select select">Size</div>
          <ul class="drop-list">
          ${uniqueSizes.map((size) =>
          `<li data-value="${size}" data-option="size"><span>${size}</span></li>`).join('')}
          <ul>
        </div>
      `;

      templateMaterials = `
        <div class="select-wrap">
          <div class="nice-select select">Material</div>
          <ul class="drop-list">
          ${uniqueMaterials.map((material) =>
          `<li data-value="${material}" data-option="material"><span>${material}</span></li>`).join('')}
          <ul>
        </div>
      `;

      templateModels = `
        <div class="select-wrap">
          <div class="nice-select select">Model</div>
          <ul class="drop-list">
          ${uniqueModels.map((model) =>
          `<li data-value="${model}" data-option="model"><span>${model}</span></li>`).join('')}
          <ul>
        </div>
      `;

      templatePatterns = `
        <div class="select-wrap">
          <div class="nice-select select">Pattern</div>
          <ul class="drop-list">
          ${uniquePatterns.map((pattern) =>
          `<li data-value="${pattern}" data-option="pattern"><span>${pattern}</span></li>`).join('')}
          <ul>
        </div>
      `;

      colorFilter.innerHTML = templateColors;
      sizeFilter.innerHTML = templateSizes;
      materialFilter.innerHTML = templateMaterials;
      modelFilter.innerHTML = templateModels;
      patternFilter.innerHTML = templatePatterns;

      // Opacity 0, show headers when filters are populated
      // filterHeader.classList.remove('pre-load');

      const selectorWrapsDesktop = document.querySelectorAll('.select-wrap');
      const selectorDesktop = document.querySelectorAll('.filter-wrap .drop-list li');

      for (let i = 0; i in selectorWrapsDesktop; i++) {
        selectorWrapsDesktop[i].addEventListener('click', function(e) {
          const productWrapper = document.querySelectorAll('.card');

          // Close all drop downs on click anywhere
          removeActiveFromAll();

          if (this.classList.contains('active')) {
            this.classList.remove('active');
          } else {
            this.classList.add('active');
          }
        });

        window.addEventListener('click', function(e) {
          if (!e.target.closest('.select-wrap') || e.target.closest('.drop-list') || !e.target.classList.contains('open')) {
            selectorWrapsDesktop[i].classList.remove('active');
          }
        });
      }

      function removeActiveFromAll() {
        for (let i = 0; i in selectorWrapsDesktop; i++) {
          selectorWrapsDesktop[i].classList.remove('active');
        }
      }

      for (let i = 0; i in selectorDesktop; i++) {
        selectorDesktop[i].addEventListener('click', function() {
          const menuOpen = document.getElementById('mobile-filter-button');
          const filterOpt = this.dataset.option;
          const filterValue = this.dataset.value;
          prevFilterOptChecker = filterOpt;

          // Set new filter header on click, should not be default on multifilter
          // this.closest('.drop-list').querySelector('li.current').classList.remove('current');

          // this.classList.add('current');

          // this.closest('.select-wrap').querySelector('.select').innerHTML = this.textContent;

          // Add selected filter to right array in the global filter object
          if (filterOpt == 'color' && addedFiltersObj.color.indexOf(filterValue) === -1) {
            addedFiltersObj.color.push(filterValue);
          }

          if (filterOpt == 'size' && addedFiltersObj.size.indexOf(filterValue) === -1) {
            addedFiltersObj.size.push(filterValue);
          }

          if (filterOpt == 'material' && addedFiltersObj.material.indexOf(filterValue) === -1) {
            addedFiltersObj.material.push(filterValue);
          }

          if (filterOpt == 'model' && addedFiltersObj.model.indexOf(filterValue) === -1) {
            addedFiltersObj.model.push(filterValue);
          }

          if (filterOpt == 'pattern' && addedFiltersObj.pattern.indexOf(filterValue) === -1) {
            addedFiltersObj.pattern.push(filterValue);
          }

          if (window.innerWidth < 769) {
            menuOpen.classList.remove('open');
          }

          multiFilter()
        });
      }

    }

    setupMultiFilter();
    // toggleFilter();
    moveFilter();
  }

  function updateFilterObj(value) {
    console.log('Updated filter');

    // Get value of clicked filter tag and remove it from right array
    addedFiltersObj.color = addedFiltersObj.color.filter(item => item !== value);
    addedFiltersObj.size = addedFiltersObj.size.filter(item => item !== value);
    addedFiltersObj.material = addedFiltersObj.material.filter(item => item !== value);
    addedFiltersObj.model = addedFiltersObj.model.filter(item => item !== value);
    addedFiltersObj.pattern = addedFiltersObj.pattern.filter(item => item !== value);

    multiFilter()
  }

  function multiFilter() {

    // Set up filter ojbect in session storage to be able to filter on next page
    if (addedFiltersObj.color.length === 0 && addedFiltersObj.material.length === 0 && addedFiltersObj.size.length === 0 && addedFiltersObj.model.length === 0 && addedFiltersObj.pattern.length === 0) {
      sessionStorage.removeItem('filter');
    } else {
      sessionStorage.setItem('filter', JSON.stringify(addedFiltersObj));
    }

    const products = document.querySelectorAll('.card');
    const filterWrap = document.querySelector('.filter-wrap');
    const addedFiltersWrap = document.querySelector('.added-filters-wrap');
    const materialFilter = addedFiltersObj.material;
    const modelFilter = addedFiltersObj.model;
    const patternFilter = addedFiltersObj.pattern;
    const sizeFilter = addedFiltersObj.size;
    const colorFilter = addedFiltersObj.color;
    const searchNotInProg = materialFilter.length === 0 && colorFilter.length === 0 && sizeFilter.length === 0 && modelFilter.length === 0 && patternFilter.length === 0;

    // Set up filter tags
    let addedFiltersTemplate = `
      <div class="added-filters">
        ${addedFiltersObj.color.map(item => 
          `<div class="filter-item">${item} <span class="remove-filter" data-filter="${item}"></span></div>`
        ).join('')}
        ${addedFiltersObj.size.map(item => 
          `<div class="filter-item">${item} <span class="remove-filter" data-filter="${item}"></span></div>`
        ).join('')}
        ${addedFiltersObj.material.map(item => 
          `<div class="filter-item">${item} <span class="remove-filter" data-filter="${item}"></span></div>`
        ).join('')}
        ${addedFiltersObj.model.map(item => 
          `<div class="filter-item">${item} <span class="remove-filter" data-filter="${item}"></span></div>`
        ).join('')}
        ${addedFiltersObj.pattern.map(item => 
          `<div class="filter-item">${item} <span class="remove-filter" data-filter="${item}"></span></div>`
        ).join('')}
      </div>
    `;

    addedFiltersWrap.innerHTML = addedFiltersTemplate;

    const addedFiltersItems = document.querySelectorAll('.added-filters .filter-item')

    for (let i = 0; i in addedFiltersItems; i++) {
      addedFiltersItems[i].querySelector('.remove-filter').addEventListener('click', function(e) {
        addedFiltersItems[i].remove();

        updateFilterObj(this.dataset.filter)
      })
    }

    for (let i = 0; i in products; i++) {
      const product = products[i];
      const allColors = product.querySelector('.product-colors') !== null ? product.querySelector('.product-colors').dataset.filter : 'No match';
      const allMaterials = product.querySelector('.product-materials') !== null ? product.querySelector('.product-materials').dataset.filter : 'No match';
      const allModels = product.querySelector('.product-models') !== null ? product.querySelector('.product-models').dataset.filter : 'No match';
      const allPatterns = product.querySelector('.product-patterns') !== null ? product.querySelector('.product-patterns').dataset.filter : 'No match';
      const allSizesItems = product.querySelectorAll('.product-sizes');
      const allSizes = [];

      for (let i = 0; i in allSizesItems; i++) {
        allSizes.push(allSizesItems[i].dataset.filter);
      }

      filterWrap.classList.add('searching');
      product.classList.add('filter');

      if (searchNotInProg) {
        product.classList.remove('filter');
        filterWrap.classList.remove('searching');
      }

      let match = {
        material: materialFilter.length === 0 ? true : false,
        model: modelFilter.length === 0 ? true : false,
        pattern: patternFilter.length === 0 ? true : false,
        color: colorFilter.length === 0 ? true : false,
        size: sizeFilter.length === 0 ? true : false
      }

      // If filter value exist in product filter, set it to true
      for (let i = 0; i in materialFilter; i++) {
        if (materialFilter[i] == allMaterials) {
          match.material = true;
        }
      }

      for (let i = 0; i in modelFilter; i++) {
        if (modelFilter[i] == allModels) {
          match.model = true;
        }
      }

      for (let i = 0; i in patternFilter; i++) {
        if (patternFilter[i] == allPatterns) {
          match.pattern = true;
        }
      }

      for (let i = 0; i in colorFilter; i++) {
        if (colorFilter[i] == allColors) {
          match.color = true;
        }
      }

      for (let i = 0; i in allSizes; i++) {
        const size = allSizes[i];

        for (let i = 0; i in sizeFilter; i++) {
          if (sizeFilter[i] == size) {
            match.size = true;
          }
        }
      }

      //If all match, show product
      if (match.material && match.color && match.size && match.model && match.pattern) {
        product.classList.remove('filter');
      }
    }
  }

  function moveFilter() {
    const mobileFilterWrap = document.querySelector('.collection-filters-container');
    const desktopFilterWrap = document.querySelector('.desktop-filter-wrap')
    const filter = document.querySelector('.filter-wrap');

    if (window.innerWidth < 769) {
      mobileFilterWrap.appendChild(filter);
    }
  }

  function toggleFilter() {
    const filterToggleButton = document.querySelector('.filter-toggle');
    const filterWrap = document.querySelector('.filter-wrap');

    filterToggleButton.addEventListener('click', function() {
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        this.textContent = 'FILTERS'
        filterWrap.classList.remove('active')
      } else {
        this.classList.add('active');
        this.textContent = 'HIDE'
        filterWrap.classList.add('active')
      }
    });
  }

  return {
    initMultiFilter
  };
})();
theme.niceSelect = (function() {
  // Nice select plugin, used on collection page

  function init() {

    $.fn.niceSelect = function(method) {

      // Methods
      if (typeof method == 'string') {
        if (method == 'update') {
          this.each(function() {
            var $select = $(this);
            var $dropdown = $(this).next('.nice-select');
            var open = $dropdown.hasClass('open');

            if ($dropdown.length) {
              $dropdown.remove();
              create_nice_select($select);

              if (open) {
                $select.next().trigger('click');
              }
            }
          });
        } else if (method == 'destroy') {
          this.each(function() {
            var $select = $(this);
            var $dropdown = $(this).next('.nice-select');

            if ($dropdown.length) {
              $dropdown.remove();
              $select.css('display', '');
            }
          });
          if ($('.nice-select').length == 0) {
            $(document).off('.nice_select');
          }
        } else {
          console.log('Method "' + method + '" does not exist.')
        }
        return this;
      }

      // Hide native select
      this.hide();

      // Create custom markup
      this.each(function() {
        var $select = $(this);

        if (!$select.next().hasClass('nice-select')) {
          create_nice_select($select);
        }
      });

      function create_nice_select($select) {
        $select.after($('<div></div>')
          .addClass('nice-select')
          .addClass($select.attr('class') || '')
          .addClass($select.attr('disabled') ? 'disabled' : '')
          .attr('tabindex', $select.attr('disabled') ? null : '0')
          .html('<span class="current"></span><ul class="list"></ul>')
        );

        var $dropdown = $select.next();
        var $options = $select.find('option');
        var $selected = $select.find('option:selected');

        $dropdown.find('.current').html($selected.data('display') || $selected.text());

        $options.each(function(i) {
          var $option = $(this);
          var display = $option.data('display');

          $dropdown.find('ul').append($('<li></li>')
            .attr('data-value', $option.val())
            .attr('data-display', (display || null))
            .addClass('option' +
              ($option.is(':selected') ? ' selected' : '') +
              ($option.is(':disabled') ? ' disabled' : ''))
            .html($option.text())
          );
        });
      }

      /* Event listeners */

      // Unbind existing events in case that the plugin has been initialized before
      $(document).off('.nice_select');

      // Open/close
      $(document).on('click.nice_select', '.nice-select', function(event) {
        var $dropdown = $(this);

        $('.nice-select').not($dropdown).removeClass('open');
        $dropdown.toggleClass('open');

        if ($dropdown.hasClass('open')) {
          $dropdown.find('.option');
          $dropdown.find('.focus').removeClass('focus');
          $dropdown.find('.selected').addClass('focus');
        } else {
          $dropdown.focus();
        }
      });

      // Close when clicking outside
      $(document).on('click.nice_select', function(event) {
        if ($(event.target).closest('.nice-select').length === 0) {
          $('.nice-select').removeClass('open').find('.option');
        }
      });

      // Option click
      $(document).on('click.nice_select', '.nice-select .option:not(.disabled)', function(event) {
        var $option = $(this);
        var $dropdown = $option.closest('.nice-select');

        $dropdown.find('.selected').removeClass('selected');
        $option.addClass('selected');

        var text = $option.data('display') || $option.text();
        $dropdown.find('.current').text(text);

        $dropdown.prev('select').val($option.data('value')).trigger('change');
      });

      // Keyboard events
      $(document).on('keydown.nice_select', '.nice-select', function(event) {
        var $dropdown = $(this);
        var $focused_option = $($dropdown.find('.focus') || $dropdown.find('.list .option.selected'));

        // Space or Enter
        if (event.keyCode == 32 || event.keyCode == 13) {
          if ($dropdown.hasClass('open')) {
            $focused_option.trigger('click');
          } else {
            $dropdown.trigger('click');
          }
          return false;
          // Down
        } else if (event.keyCode == 40) {
          if (!$dropdown.hasClass('open')) {
            $dropdown.trigger('click');
          } else {
            var $next = $focused_option.nextAll('.option:not(.disabled)').first();
            if ($next.length > 0) {
              $dropdown.find('.focus').removeClass('focus');
              $next.addClass('focus');
            }
          }
          return false;
          // Up
        } else if (event.keyCode == 38) {
          if (!$dropdown.hasClass('open')) {
            $dropdown.trigger('click');
          } else {
            var $prev = $focused_option.prevAll('.option:not(.disabled)').first();
            if ($prev.length > 0) {
              $dropdown.find('.focus').removeClass('focus');
              $prev.addClass('focus');
            }
          }
          return false;
          // Esc
        } else if (event.keyCode == 27) {
          if ($dropdown.hasClass('open')) {
            $dropdown.trigger('click');
          }
          // Tab
        } else if (event.keyCode == 9) {
          if ($dropdown.hasClass('open')) {
            return false;
          }
        }
      });

      // Detect CSS pointer-events support, for IE <= 10. From Modernizr.
      var style = document.createElement('a').style;
      style.cssText = 'pointer-events:auto';
      if (style.pointerEvents !== 'auto') {
        $('html').addClass('no-csspointerevents');
      }

      return this;

    };
  }

  return {
    init
  };
})();
theme.oldJS = (function() {
  // This is a messy file...

  function init() {

    window.addEventListener('scroll', function() {
      var mainMenu = document.getElementById('main-nav-menu');
      var mainHeader = document.getElementById('main-header');

      if (!mainMenu.classList.contains('open')) {
        if (window.scrollY > 199) {
          mainHeader.classList.add('custom-hide');
          setTimeout(function() {
            mainHeader.classList.add('custom-trans');
          }, 500)

          if (this.oldScroll > this.scrollY) {
            mainHeader.classList.add('custom-show');
          } else {
            mainHeader.classList.remove('custom-show');
          }
          this.oldScroll = this.scrollY;
        } else {
          mainHeader.classList.remove('custom-show');
          mainHeader.classList.remove('custom-hide');
          mainHeader.classList.remove('custom-trans');
        }
      }
    });

    var cache = {};
    $('#Search').on('change keyup', function() {
      var term = $(this).val();
      if (term.length < 2) {
        $('.detail-paragraph').show();
        return;
      }

      //console.log(term);
      if (term in cache) {
        //console.info(cache[term]);
        $('#quick-search').html(cache[term]);
        $('.detail-paragraph').hide();
        return;
      }
      $.ajax({
        url: window.location.origin + "/search",
        data: {
          q: "*" + term + "*",
          // type: "product",
          view: "autocomplete",
        },
        dataType: "html"
      }).done(function(data) {

        $('.detail-paragraph').hide();
        if (data.length) {
          cache[term] = data;
        }
        $('#quick-search').html(data);
        if (window.BOLD && BOLD.common && BOLD.common.eventEmitter &&
          typeof BOLD.common.eventEmitter.emit === 'function' && BOLDCURRENCY.currentCurrency) {
          trimPrice('search');
          BOLD.common.eventEmitter.emit('BOLD_CURRENCY_double_check');
        }
        //console.log(data);
      }).fail(function(response, data) {
        //console.log(data);
      });
    });

    $('.modal-search form').on('submit', function() {
      var $val = $('#Search');
      var val = $val.val();
      if (val[0] !== "*") {
        val = "*" + val;
      }
      if (val[val.length - 1] !== "*") {
        val = val + "*";
      }
      $val.css("color", "white");
      $val.blur();
      $val.val(val);
    });




    $('.carousel').css('visibility', 'hidden');
    $('.carousel').each(function() {
      // $(this).slick({
      //     centerMode: true,
      //     centerPadding: '20px',
      //     slidesToShow: 5,
      //     slidesToScroll: 1,
      //     initialSlide: Math.floor($(this).find('div').length / 2),
      //     dots: true,
      //     autoplay: true,
      //     autoplaySpeed: 2000,
      //     responsive: [
      //       {
      //         breakpoint: 768,
      //         settings: {
      //           slidesToShow: 3,
      //           initialSlide: Math.floor($(this).find('div').length / 2),
      //         }
      //       },
      //       {
      //         breakpoint: 400,
      //         settings: {
      //           slidesToShow: 1,
      //           initialSlide: Math.floor($(this).find('div').length / 2),
      //         }
      //       }
      //     ]
      //   });

      $(this).slick({
        dots: true,
        slidesToShow: 5,
        infinite: true,
        // centerMode: true,
        responsive: [{
            breakpoint: 768,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 500,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      });

      $(this).css('visibility', 'visible');
      //
      // $(this).parents('section').css({
      //   opacity: 1,
      //   height: 'auto',
      // })

    });


    var resizeProductImage = function() {
      console.log("resize product image");
      setTimeout(function() {
        $('.productimage-slider').slick('resize');
        $('.productimage-slider').slick('setPosition');
      }, 0);
    };

    if ($('.productimage-slider').length) {
      var $slider = $('.productimage-slider').slick({
        centerMode: true,
        centerPadding: '0px',
        slidesToShow: 1,
        dots: true,
        fade: true,
        autoplay: false,
        responsive: [{
          breakpoint: 1200,
          settings: {
            dots: true
          }
        }]
      });

      var $slider = $('.productimage-slider');

      var getItems = function() {
        var items = [];
        $slider.find('img').each(function() {

          var $href = $(this).data('image'),
            //$size   = $(this).data('size').split('x'),
            $width = $(this)[0].naturalWidth,
            $height = $(this)[0].naturalHeight;

          if ($width == 0) {
            $width = 2880;
          }
          if ($height == 0) {
            $height = 3998;
          }

          var item = {
            src: $href,
            w: $width,
            h: $height
          };

          items.push(item);
        });
        return items;
      };

      var items = getItems();


      var $pswp = $('.pswp')[0];
      $(document).on('click', '.magnify', function(event) {
        event.preventDefault();



        var $index = $slider.slick('slickCurrentSlide');
        var options = {
          index: $index,
          bgOpacity: 1,
          showHideOpacity: true
        };

        // Initialize PhotoSwipe
        var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
        lightBox.init();
      });

      $(document).on('click', '.productimage-slider img', function(e) {
        if ($(window).width() < 992) {
          e.preventDefault();

          var $index = $slider.slick('slickCurrentSlide');
          var options = {
            index: $index,
            bgOpacity: 1,
            showHideOpacity: true
          };

          // Initialize PhotoSwipe
          var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
          lightBox.init();
        }
      })

      $('.productimage-slider').on('init reInit afterChange', function(event, slick, currentSlide, nextSlide) {
        var i = (currentSlide ? currentSlide : 0) + 1;
        $('.productimagecontrols span.count').text(i + '/' + slick.slideCount);
      });
      // $('.productdetails span.magnify').on('click',function(){
      //   $('.productdetails .image').addClass('fullscreen');
      //   $('html').addClass('fullscreen');
      //   resizeProductImage();
      // });
      // $('.productdetails span.close').on('click',function(){
      //   $('.productdetails .image').removeClass('fullscreen');
      //   $('.productdetails .image').removeClass('zoom');
      //   $('html').removeClass('fullscreen');
      //   $('.productimage-slider').slick('resize');
      //   resizeProductImage();
      // });
      // $('body').on('click', '.productdetails .image.fullscreen .slick-list',function(){
      //   $('.productdetails .image').toggleClass('zoom');
      //   $('.productimage-slider').slick('resize');
      //   resizeProductImage();
      // });
      //
      // $(document).on('click', '.productimage-slider img', function () {
      //   resizeProductImage();
      // });

      window.productImageSlider = $slider;


      $('.productimage-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        const lazySlides = document.querySelectorAll('.lazy-click-image');

        for (let i = 0; i in lazySlides; i++) {
          if (window.innerWidth < 992) {
            lazySlides[i].setAttribute('src', lazySlides[i].dataset.imageMobile);
          } else {
            lazySlides[i].setAttribute('src', lazySlides[i].dataset.image);
          }

          lazySlides[i].classList.remove('lazy-click-image');
        }
      });
    }


    // Hamburger menu
    $(".hamburger").click(function() {
      $("#main-nav-menu").toggleClass('open');
      $(this).toggleClass("change");
    });

    // Search modal
    $(".search").click(function() {
      $(".modal-search").fadeToggle();
      $('#Search').focus();
    });
    $(".modal-search .closebtn").click(function() {
      $(".modal-search").fadeToggle();
    });

    var sgContainerClass = '.modal-sizeguide';

    // Sizeguide modal
    $("button.sizeguide").click(function(e) {
      e.preventDefault();
      $(sgContainerClass).fadeToggle();
    });
    $(".sizeguidewrap .closebutton").click(function(e) {
      e.preventDefault();
      $(sgContainerClass).fadeToggle();
    });
    $(document).on('click', sgContainerClass, function(e) {
      if ($(e.target).hasClass('modal-sizeguide')) {
        $(sgContainerClass).fadeOut();
      }
    });

    // Showmore
    $(".productdetails").on('click', 'a.open', function(event) {
      event.preventDefault();
      $(".productdetails div.medium-serif-paragraph").addClass('showingmore');
      $(this).removeClass('open').addClass('closer');

    });
    $(".productdetails").on('click', 'a.closer', function(event) {
      event.preventDefault();
      $(".productdetails div.medium-serif-paragraph").removeClass('showingmore');
      $(this).removeClass('closer').addClass('open');
    });

    $(".prodintro").on('click', 'a.open', function(event) {
      event.preventDefault();
      $(".prodintro div.medium-serif-paragraph").addClass('showingmore');
      $(this).removeClass('open').addClass('closer');

    });
    $(".prodintro").on('click', 'a.closer', function(event) {
      event.preventDefault();
      $(".prodintro div.medium-serif-paragraph").removeClass('showingmore');
      $(this).removeClass('closer').addClass('open');
    });


    if ($('.productdetails').length > 0) {
      var toggleShowmoreButton = function() {

        var compareHeight = 90;
        if ($(window).width() <= 500) {
          compareHeight = 75;
        }

        var keepClass = false;
        if ($('.productdetails .medium-serif-paragraph').hasClass('showingmore')) {
          keepClass = true;
        }

        if ($('.productdetails .medium-serif-paragraph').addClass('showingmore').height() < compareHeight) {
          $('.productdetails .medium-serif-paragraph a.showmore').hide();
        } else {
          $('.productdetails .medium-serif-paragraph a.showmore').show();
        }

        if (!keepClass) {
          $('.productdetails .medium-serif-paragraph').removeClass('showingmore');
        }
      };
      toggleShowmoreButton();
      $(window).on('resize', toggleShowmoreButton);
    }

    // // Mega menu
    // $(".menu > li").hover(function(e) {
    //   if ($(window).width() > 500) {
    //     $(this).find(".mega-menu").css('display', 'block');
    //   }
    // });

    // // Sub menu
    // $(".menu > li").hover(function() {
    //   $(this).find(".sub-menu").css('display', 'block');
    // });

    $('.menu > li > a').on('click', function(e) {
      if ($(window).width() <= 500) {
        e.preventDefault();
        if ($(this).parent().find('.mega-menu').hasClass('open')) {
          $(this).parent().find('.mega-menu').removeClass('open');
        } else {
          $(this).parents('.menu').find('.mega-menu').removeClass('open');
          $(this).parent().find('.mega-menu').toggleClass('open');
        }
      }
    });

    var showHeaderCart = function() {

      var offset = -$(document).scrollTop();
      $(".bag-dropdown").toggle();
      $(".bag-dropdown").toggleClass('open');
      $('body').toggleClass('cart-open');
      $('body').css({
        top: offset + 'px'
      });
    };

    // Mini cart
    $(".top .right li:last-of-type .bag").click(function() {
      showHeaderCart(this);
    });

    var hideHeaderCart = function(e) {
      e.preventDefault();
      $('.bag-dropdown').toggle();
      $('.bag-dropdown').toggleClass('open');
      var offset = $('body').css('top');
      offset = offset.replace(/[^0-9\-+]/ig, '');

      $('body').toggleClass('cart-open');
      window.scrollTo({
        top: +offset * -1
      });
    };

    $(document).on('click', '.cart-continue-shopping, .cart-backdrop, .close-cart', function(e) {
      hideHeaderCart(e, this);
    });

    // $(document).on('click', ".bag-dropdown", function(e) {
    //   if (e.target.className !== "minus" && e.target.className !== 'plus') {
    //    e.preventDefault();
    //    e.stopPropagation();
    //  }
    // });

    //Padmenu
    $('.greenmenuclosebutton').on('click', function() {
      $('.padselectmenu').hide();
    });

    $('.collection-filters-container').on('change', function() {
      console.log("filters");
    });


    var toggleMobileFilterFunc = function(e) {
      if ($(e.target).parents('#collection-filters').length === 0 && $(e.target).attr('id') === "mobile-filter-button") {
        $('#mobile-filter-button').removeClass('open');
        $('body').removeClass('mobile-filter-open');
      }
    };

    $('#mobile-filter-button').click(function(e) {
      e.preventDefault();

      $(this).addClass('open');
      $('body').addClass('mobile-filter-open');
    });

    $('#close-mobile-filters').click(function(e) {
      e.preventDefault();

      $('#mobile-filter-button').removeClass('open');
      $('body').removeClass('mobile-filter-open');
    });

    $(document).on('click', 'body.mobile-filter-open', function(e) {
      if (
        $(e.target).attr('id') !== 'collection-filters' &&
        $(e.target).parents('#collection-filters').length === 0 &&
        $(e.target).attr('id') !== "mobile-filter-button"
      ) {
        $('#mobile-filter-button').removeClass('open');
        $('body').removeClass('mobile-filter-open');
      }
    });

    if (sessionStorage.getItem("bb-ribbon-closed") !== "yes") {
      var $ribbon = $('#ribbon');
      $ribbon.removeClass('closed');
      $ribbon.show();
    }

    if (sessionStorage.getItem("bb-ribbon-closed") === "yes") {
      if (window.innerWidth < 501) {
        document.getElementById('shopify-section-header').style.paddingTop = '90px';
      }
    }

    $('#ribbon .ribbon-close').on('click', function(e) {
      e.preventDefault();
      $('#ribbon').addClass('closed');
      $('#ribbon').hide();
      sessionStorage.setItem('bb-ribbon-closed', "yes");

      if (window.innerWidth < 501) {
        document.getElementById('shopify-section-header').style.paddingTop = '90px';
      }

      if (window.innerWidth > 501) {
        document.getElementById('shopify-section-header').style.paddingTop = '122px';
      }
    });


    // $('.productdetails .image .productimage-slider').on('click', function (e) {
    //   if ($(window).width() < 992) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //
    //     $('.productdetails .image').addClass('fullscreen');
    //
    //     setTimeout(function () {
    //       $('.productdetails .image').addClass('zoom');
    //       $('.productimage-slider').slick('resize');
    //       $('.productimage-slider').slick('setPosition');
    //     }, 10);
    //   }
    //
    // });

    var updateCartTimeout = null;
    $(document).on('click', '#cart-summary .qty .minus', function() {
      var input = $(this).next('input');
      if (input.val() > 0) {
        input.val(+input.val() - 1);
        updateCartPage($(this).parents('form'));
      }
    });

    $(document).on('click', '#cart-summary .qty .plus', function() {
      var input = $(this).prev('input');
      input.val(+input.val() + 1);
      updateCartPage($(this).parents('form'));
    });

    $(document).on('change', '#cart-summary .qty input', function() {
      updateCartPage($(this).parents('form'));
    });

    var updateCartPage = function($form) {
      if (updateCartTimeout) {
        clearTimeout(updateCartTimeout);
      }

      updateCartTimeout = setTimeout(function() {
        $.ajax({
          url: $form.attr('action'),
          type: "POST",
          headers: {
            'Accept': 'text/html'
          },
          data: $form.serialize(),
          success: function(data) {
            var $html = $(data);

            $('#cart-summary').html($html.find('#cart-summary').html());
            updateCartTimeout = null;
            location.reload()
          },
          error: function(jXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            updateCartTimeout = null;
          }
        });
      }, 100);
    };

    $(document).on('click', '#header-cart-form .qty .minus', function(e) {
      var input = $(this).next('input');
      if (+input.val() > 0) {
        input.val(+input.val() - 1);
        updateHeaderCart($(this).parents('form'));
      }

      return false;
    });
    $(document).on('click', '#header-cart-form .qty .plus', function(e) {
      var input = $(this).prev('input');
      input.val(+input.val() + 1);
      updateHeaderCart($(this).parents('form'));

      return false;
    });

    $(document).on('change', '#header-cart-form .qty input', function() {
      updateHeaderCart($(this).parents('form'))
    });

    var getHeaderCartLine = function(item, metafields) {
      var $item = $('<div class="item">');
      $item.attr('data-key', item.key);

      var $img = $('<img>').attr('src', item.image);
      $item.append($img);

    };

    var headerCartTO = null;
    var updateHeaderCart = function($form) {
      if (headerCartTO) {
        clearTimeout(headerCartTO);
      }

      headerCartTO = setTimeout(function() {
        $.ajax({
          url: '/cart',
          type: "POST",
          data: $form.serialize(),
          success: function(data) {
            $('#header-cart-count').html(data.item_count);

            $.get('/cart?view=header', function(res) {
              $('#header-cart-form').html(res);
              if (window.BOLD && BOLD.common && BOLD.common.eventEmitter &&
                typeof BOLD.common.eventEmitter.emit === 'function' && BOLDCURRENCY.currentCurrency) {
                BOLD.common.eventEmitter.emit('BOLD_CURRENCY_double_check');
              }
            });
            headerCartTO = null;
          },
          error: function(jXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            headerCartTO = null;
          }
        });
      }, 100);
    };

    var giftWrapCheckbox = $("[data-add-gift-wrap]");
    var giftWrapID = giftWrapCheckbox.data("id");

    $(document).on('click', '[data-add-to-cart]', function(e) {
      var self = this;
      e.preventDefault();
      console.log('ADDDDDDD')
      var slectedVal = parseInt(document.querySelector('.custom-dropdown .list .option.selected').dataset.value);
      // var $form = $(this).parents('form');
      $(this).attr('disabled', true);

      var itemsAdded = 1;

      if (giftWrapCheckbox.is(":checked")) {
        itemsAdded = 2;

        var itemsArray = [
          {
            quantity: 1,
            id: giftWrapID
          },
          {
            quantity: 1,
            id: slectedVal
          }
        ]
      } else {
        var itemsArray = [
          {
            quantity: 1,
            id: slectedVal
          }
        ]
      }

      $.post('/cart/add.js', { 
        items: itemsArray
        }, function(res) {
        if (res.id) {
          // $('#header-cart-count').html(1 + +$('#header-cart-count').html());
          // $.get('/cart?view=header', function(res) {
          //   $('#header-cart-form').html(res);
          //   $(self).attr('disabled', false);

          //   showHeaderCart($('.top .right li:last-of-type .bag'));
          //   if (window.BOLD && BOLD.common && BOLD.common.eventEmitter && typeof BOLD.common.eventEmitter.emit === 'function' && BOLDCURRENCY.currentCurrency) {
          //     BOLD.common.eventEmitter.emit('BOLD_CURRENCY_double_check');
          //   }
          // });
        }
      }, 'json').done(function() {
        $('#header-cart-count').html(itemsAdded + +$('#header-cart-count').html());
        $.get('/cart?view=header', function(res) {
          $('#header-cart-form').html(res);
          $(self).attr('disabled', false);

          showHeaderCart($('.top .right li:last-of-type .bag'));
          if (window.BOLD && BOLD.common && BOLD.common.eventEmitter && typeof BOLD.common.eventEmitter.emit === 'function' && BOLDCURRENCY.currentCurrency) {
            BOLD.common.eventEmitter.emit('BOLD_CURRENCY_double_check');
          }
        });
      });
    });


    $(document).on('click', '#RecoverPassword', function(e) {
      e.preventDefault();

      $('#recover-password-form').show();
      $('#customer_login').hide();
    });

    let loadArr = [];
    let loadCount = 1;

    if (sessionStorage.getItem('pageLoad') !== null) {
      loadArr = JSON.parse(sessionStorage.getItem('pageLoad'));
      loadCount = JSON.parse(sessionStorage.getItem('pageLoad')).pop();
      console.log(loadCount)
    }

    $(document).on('click', '.pagination-container .load-more-button a', function(e) {
      e.preventDefault();
      var self = this;

      $(this).text('Loading...');
      $.get($(this).attr('href') + "&view=ajax", function(res) {
        var $container = $(self).parents('.collection-flex-row');

        loadCount += 1;

        loadArr.push(loadCount)

        sessionStorage.setItem('pageLoad', JSON.stringify(loadArr))

        $(self).parents('.pagination-container').remove();
        $container.html($container.html() + res);

        theme.lazyLoad.initLazyLoad();
        removeZeros();
      });
    });

    if (document.querySelector('.template-collection') !== null) {
      $(".newwrapper").on('click', '.list li', function(e) {
        var sortBy = $(this).data('value');

        window.location.href = window.location.pathname + '?sort_by=' + sortBy;

      });

      if (sessionStorage.getItem('pageLoad') !== null) {
        const arrNums = JSON.parse(sessionStorage.getItem('pageLoad'));
        const currCollection = document.getElementById('collection-name').dataset.value;

        for (let i = 0; i in arrNums; i++) {
          setTimeout(() => {
            $.get(`/collections/${currCollection}?page=${arrNums[i]}` + "&view=ajax", function(res) {
              var $container = $('.load-more-button a').parents('.collection-flex-row');

              $('.load-more-button a').parents('.pagination-container').remove();
              $container.html($container.html() + res);
              removeZeros();
              theme.lazyLoad.initLazyLoad();
            });
          }, i * 500)
        }
      }
    }

    const menuLinks = document.querySelectorAll('#main-nav-menu a');

    for (let i = 0; i in menuLinks; i++) {
      menuLinks[i].addEventListener('click', () => {
        sessionStorage.removeItem('pageLoad');
      })
    }

    const time = window.innerWidth < 769 ? 800 : 400;

    setTimeout(() => {
      theme.niceSelect.init();
      $('select').niceSelect();
    }, time)



  }

  return {
    init
  };
})();

theme.productPage = (function() {

  function initProductPage() {
    pickSize();

    function pickSize() {
      const sizeDropdown = document.querySelector('.pricensize .custom-dropdown');
      const sizeItems = document.querySelectorAll('.pricensize .custom-dropdown .list .option');
      const dropDownHeader = document.querySelector('.pricensize .custom-dropdown div.current');

      dropDownHeader.addEventListener('click', function() {
        if (sizeDropdown.classList.contains('active')) {
          sizeDropdown.classList.remove('active');
        } else {
          sizeDropdown.classList.add('active');
        }
      });

      for (let i = 0; i in sizeItems; i++) {
        sizeItems[i].addEventListener('click', function() {
          resetAllOnChange();
          dropDownHeader.innerHTML = this.innerHTML;

          this.classList.add('selected');
          sizeDropdown.classList.remove('active');
        });
      }

      window.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-dropdown')) {
          sizeDropdown.classList.remove('active');
        }
      });

      function resetAllOnChange() {
        for (let i = 0; i in sizeItems; i++) {
          sizeItems[i].classList.remove('selected');
          document.getElementById('product-add').disabled = false;
          document.getElementById('out-of-stock-text').innerHTML = '';
        }
      }
    }
  }

  return {
    initProductPage: initProductPage
  };
})();
theme.slickSlider = (function() {
	// slick slider plugin

  function init() {

    !function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(i){"use strict";var e=window.Slick||{};(e=function(){var e=0;return function(t,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(t),appendDots:i(t),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(t),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(t).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,void 0!==document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=e++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):!0===o?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),!0===s.options.rtl&&!1===s.options.vertical&&(e=-e),!1===s.transformsEnabled?!1===s.options.vertical?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):!1===s.cssTransitions?(!0===s.options.rtl&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),!1===s.options.vertical?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),!1===s.options.vertical?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this.getNavTarget();null!==t&&"object"==typeof t&&t.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;!0===e.options.arrows&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),!0!==e.options.infinite&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(!0===o.options.dots){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),!0!==e.options.centerMode&&!0!==e.options.swipeToSlide||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),!0===e.options.draggable&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>1){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(!1===r.originalSettings.mobileFirst?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||!1===l||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!=0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t;if(e=this.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),!0===e.options.accessibility&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),!0===e.options.accessibility&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),!0===e.options.accessibility&&e.$list.off("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>1&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(t){t.stopImmediatePropagation();var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&(e.focussed=o.is(":focus"),e.autoPlay())},0)})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){return this.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){return this.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o=this;return t=!0===o.options.centerMode?o.slideWidth*Math.floor(o.options.slidesToShow/2):0,!0===o.options.swipeToSlide?(o.$slideTrack.find(".slick-slide").each(function(s,n){if(n.offsetLeft-t+i(n).outerWidth()/2>-1*o.swipeLeft)return e=n,!1}),Math.abs(i(e).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),!0===t.options.accessibility&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),-1!==s&&i(this).attr({"aria-describedby":"slick-slide-control"+e.instanceUid+s})}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.$slides.eq(s).attr("tabindex",0);e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;!0===e.options.dots&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),!0===e.options.accessibility&&e.$dots.on("keydown.slick",e.keyHandler)),!0===e.options.dots&&!0===e.options.pauseOnDotsHover&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),!0===e.options.accessibility&&e.$list.on("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||n.$slider.attr("data-sizes"),r=document.createElement("img");r.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,e,t])})},r.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,t])},r.src=t})}var t,o,s,n=this;if(!0===n.options.centerMode?!0===n.options.infinite?s=(o=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(o=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),s=n.options.slidesToShow/2+1+2+n.currentSlide):(o=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,s=Math.ceil(o+n.options.slidesToShow),!0===n.options.fade&&(o>0&&o--,s<=n.slideCount&&s++)),t=n.$slider.find(".slick-slide").slice(o,s),"anticipated"===n.options.lazyLoad)for(var r=o-1,l=s,d=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)r<0&&(r=n.slideCount-1),t=(t=t.add(d.eq(r))).add(d.eq(l)),r--,l++;e(t),n.slideCount<=n.options.slidesToShow?e(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?e(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&e(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),!0===t.options.accessibility&&(t.initADA(),t.options.focusOnChange&&i(t.$slides.get(t.currentSlide)).attr("tabindex",0).focus()))},e.prototype.prev=e.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),(r=document.createElement("img")).onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},e.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,!0===t.options.rtl?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":void 0!==arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var r=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(!0===s.options.fade&&(s.options.centerMode=!1),!0===s.options.infinite&&!1===s.options.fade&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=!0===s.options.centerMode?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));s||(s=0),t.slideCount<=t.options.slidesToShow?t.slideHandler(s,!1,!0):t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=(l=a.getNavTarget()).slick("getSlick")).slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)}},e.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,!1===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||void 0===s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),void 0!==t)return t;return o}});

  }

  return {
    init
  };
})();

$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('product', theme.Product);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

  if(jQuery('[data-product-json]').length)
  {
    var productData = JSON.parse(jQuery('[data-product-json]').html().trim());
    var fixSelectedPrice = function(variantId)
    {
        //console.log(variantId);
        for (var i = 0; i < productData.variants.length; i++) {
            var productVariant = productData.variants[i];
            if (productVariant.id == variantId) {
                var price = productVariant.price;
                var eurPriceHtml = '&euro;' + (price / 100) + ' EUR';

                if (jQuery('.pricetag .money').data('original-value') != price) {
                    if (window.BOLD && BOLD.common && BOLD.common.eventEmitter &&
                        typeof BOLD.common.eventEmitter.emit === 'function' && BOLDCURRENCY.currentCurrency) {

                        var currentCurrency = BOLDCURRENCY.currentCurrency;
                        var currentCurrencyPrice =  BOLDCURRENCY.converter.convertPrice((price/100),currentCurrency);
                        var currentCurrencyPriceNoDecimals = Math.ceil(currentCurrencyPrice);
                        currentCurrencyPrice = currentCurrencyPriceNoDecimals;
                        var currentMoneyFormat = BOLDCURRENCY.moneyFormats[currentCurrency].money_format;
                        var currentCurrencyPriceHtml = currentMoneyFormat.replace("{{amount}}", currentCurrencyPrice).replace("{{amount_no_decimals}}", currentCurrencyPriceNoDecimals);

                        jQuery('.pricetag .money').data('original-value', price);
                        jQuery('.pricetag .money').data('eur', eurPriceHtml);
                        jQuery('.pricetag .money').data(currentCurrency.toLowerCase(), currentCurrencyPriceHtml);

                        jQuery('.pricetag .money').attr('data-original-value', price);
                        jQuery('.pricetag .money').attr('data-eur', eurPriceHtml);
                        jQuery('.pricetag .money').attr('data-'+currentCurrency.toLowerCase(), currentCurrencyPriceHtml);

                        BOLD.common.eventEmitter.emit('BOLD_CURRENCY_double_check');

                    }
                    else  // Try later if bold not ready
                    {
                        setTimeout(function () {
                            fixSelectedPrice(variantId);
                        }, 1000);
                    }
                }
            }
        }
    }

    jQuery('body').on('click','.nice-select li',function(){
        //console.log(jQuery(this).data('value'));
        var variantId = jQuery(this).data('value');
        //jQuery(this).parents('.nice-select:first').prev().val(jQuery(this).data('value')).trigger('change');

        fixSelectedPrice(variantId);
    });

    setTimeout(function(){
        fixSelectedPrice(jQuery('[data-product-select]').val());
    },500);

  }
  else
  {
      var fixBoldPrices = function ()
      {
          if (window.BOLD && BOLD.common && BOLD.common.eventEmitter &&
              typeof BOLD.common.eventEmitter.emit === 'function' && BOLDCURRENCY.currentCurrency) {

              BOLD.common.eventEmitter.emit('BOLD_CURRENCY_double_check');

          }
          else  // Try later if bold not ready
          {
              setTimeout(function () {
                  fixBoldPrices();
              }, 1000);
          }
      }
      setTimeout(fixBoldPrices,500);
  }

  // Lazy load
  if (document.querySelectorAll('.lazy-image').length || document.querySelectorAll('.lazy-image-hover').length) {
    theme.lazyLoad.initLazyLoad();
  }

  // theme.niceSelect.init();

  theme.slickSlider.init();

  theme.oldJS.init();

  // PDP
  if (document.querySelectorAll('.template-product').length) {
    theme.productPage.initProductPage();
  }

  /*
  var originalValues = [];
  var fetchOriginalValues = function()
  {
      jQuery('[data-original-value]').each(function(){
          originalValues.push(jQuery(this).data('original-value'));
      });
      if(originalValues.length == 0)
      {
          setTimeout(fetchOriginalValues,10);
      }
      console.log(originalValues);
  }
  fetchOriginalValues();

  var checkOriginalValues = function()
  {
      if(originalValues.length > 0)
      {
          var orgIndex = 0;
          var orgFixes = 0;
          jQuery('[data-original-value]').each(function(){
              if(originalValues[orgIndex] != jQuery(this).data('original-value'))
              {
                  jQuery(this).data('original-value',originalValues[orgIndex]);
                  orgFixes++;
              }
              orgIndex++;
          });
          if(orgFixes > 0)
          {
              clearInterval(checkOriginalValuesTimer);
              BOLD.common.eventEmitter.emit('BOLD_CURRENCY_double_check');
          }
      }
      checkOriginalValuesCounter--;
      if(checkOriginalValuesCounter <= 0)
      {
        clearInterval(checkOriginalValuesTimer);
      }
  }
  var checkOriginalValuesCounter = 10;
  var checkOriginalValuesTimer = setInterval(checkOriginalValues,500);
  */


});

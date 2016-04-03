/**
 * main.js
 *
 * Author: Marian Friedmann
 *
 */

/**
 * Disqus function makes it possible to work with the
 * disqus comment count.
 *
 */

var Disqus = function() {
  var data = true,
      _self = this;

  this.options = {};
  this.options.cache = 120 * 1000;
};

/**
 * Set data
 *
 * @param {object}  data  disqus data returned by retrieveData function
 */

Disqus.prototype.setCache = function (data) {
  var date = Date.now();
  data.timestamp = date;
  localStorage.setItem('data', JSON.stringify(this.processData(data)));
  return this;
};

/**
 * Get cached data
 *
 * @return {data|boolean}  cached data object or false if cache time is expired
 */

Disqus.prototype.getCache = function () {
  var data = JSON.parse(localStorage.getItem('data'));

  if (data && data.timestamp >= Date.now() - this.options.cache) {
    return data;
  } else {
    return false;
  }
};

/**
 * Return comment count for given identifier. Should
 * be called inside ready function to make sure
 * current data is available.
 *
 * @param  {string} identifier disqus identifier
 * @return {number}            comment count for identifier
 */

Disqus.prototype.getComments = function(identifier) {
  var cache = this.getCache();
  if (cache[identifier]) {
    return cache[identifier].posts;
  }
  return 0;
};

/**
 * Ready function to make sure current data is available.
 *
 * @param  {Function} callback function that is called when
 *                             current data is available
 */

Disqus.prototype.ready = function(callback) {
  var _self = this;
  if (!_self.getCache()) {
    _self.retrieveData(function(data) {
      _self.setCache(data);
      callback();
    });
  } else {
    callback();
  }
};

/**
 * Retrieve data from disqus api
 *
 * @return {Function}  callback containing retrieved data
 */

Disqus.prototype.retrieveData = function (callback) {
  var apiKey = '@@DISQUS_PUBLIC_KEY',
      xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var json = JSON.parse(xhr.responseText);
      callback(json);
    }
  };

  xhr.open('GET', 'https://disqus.com/api/3.0/forums/listThreads.json?forum=frdmn&limit=100&include=open&api_key='+apiKey, true);
  xhr.send(null);
};

/**
 * Process disqus data object, remove items lacking identifiers
 *
 * @param  {object}  data  disqus data returned by retrieveData function
 * @return {object}        processed data
 */

Disqus.prototype.processData = function (data) {
  var output = {};
  output.timestamp = data.timestamp;
  data.response.forEach(function(v,k) {
    var id = v.identifiers[0];
    if (id) {
      output[id] = v;
    }
  });
  return output;
};

$.fn.removeClassPrefix = function(prefix) {
    this.each(function(i, el) {
        var classes = el.className.split(" ").filter(function(c) {
            return c.lastIndexOf(prefix, 0) !== 0;
        });
        el.className = $.trim(classes.join(" "));
    });
    return this;
};

$(function() {
  var $headerNav = $('.header-archive'),
      $archiveToggle = $('.archive-toggle'),
      $titleBar = $('#static-title-bar'),
      $body = $('body');

  $headerNav.headroom({
    offset: 180,
    tolerance: 5,
    classes : {
        pinned : 'header-archive--visible',
    },
    onPin : function() {
      if(!$headerNav.hasClass('header-archive')) $headerNav.addClass('header-archive');
      if(this.lastKnownScrollY < 200) $headerNav.removeClass('header-archive--visible');
    },
    onUnpin : function() {
      if(!$headerNav.hasClass('header-archive')) $headerNav.addClass('header-archive');
    },
    onTop : function() {
      if(!$headerNav.hasClass('header-archive')) $headerNav.addClass('header-archive');
      $headerNav.removeClass('header-archive--visible');
    },
    onNotTop : function() {
      if(!$headerNav.hasClass('header-archive')) $headerNav.addClass('header-archive');
    }
  });

  $archiveToggle.click(function() {
    $archiveToggle.toggleClass('archive-toggle--active');
    $headerNav.toggleClass('header-archive--active');
    $body.toggleClass('no-scroll');
    $titleBar.toggleClass('title-bar--hidden');
    $headerNav.removeClass('header-archive--page-colors');
    setTimeout(function() {
      if($headerNav.hasClass('header-archive--active')) {
        $headerNav.addClass('header-archive--page-colors');
      }
    },300);
  });

  $('.post-content pre code').each(function() {
    $(this).parent().wrap('<div class="code-block"></div>');
    hljs.configure({
      languages: []
    });
    hljs.initHighlighting();
  });

  $('.post-content p img').each(function() {
    $(this).parent().wrap('<div class="img-block"></div>');
  });

  var test = new Disqus();

  $('a[data-page-color]').hover(function() {
    var color = $(this).attr('data-page-color');
    $('html').removeClassPrefix('color--');
    $('html').addClass('color--' + color);
  });

  $('[data-page-color-reset]').mouseleave(function() {
    var color = $('html').attr('data-page-color-original');
    $('html').removeClassPrefix('color--');
    $('html').addClass('color--' + color);
  });

  test.ready(function(e) {
    $('.comment-single').each(function() {
      var $c = $(this),
          id = $c.attr('data-disqus-identifier'),
          comments = test.getComments(id),
          label = "Comments";

      if (comments === 1) label = "Comment";
      $c.text(comments + ' ' + label);
    });

    $('.comment').each(function() {
      var $c = $(this),
          id = $c.attr('data-disqus-identifier'),
          comments = test.getComments(id),
          buzz = false;

      [15,30,100].forEach(function(v,k) {
        if (v <= comments) {
          buzz = Array(k + 2).join('🔥');
        }
      });

      if (buzz) {
        $c.html('<span class="tooltip">' + buzz + '<span class="tooltip__content">Hot Topic!<br><i class="tooltip__highlight">' + comments + '</i> comments <br>waiting inside!</span></span>');
        setTimeout(function() {
          $c.parent().addClass('comment-wrap--active');
        },50);
      }
    });
  });


});

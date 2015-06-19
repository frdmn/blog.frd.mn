/**
 * main.js
 *
 * Author: Marian Friedmann
 *
 */

var Buzz = function(obj) {
  this.element = obj.buzz;
  this.count = false;

  var buzz = this;
  buzz.waitForContent(function() {
    buzz.show();
  });
};

Buzz.prototype.waitForContent = function(callback) {
  var buzz = this;
  var interval = setInterval(function() {
    if (buzz.element.innerHTML) {
      buzz.count = buzz.element.innerHTML;
      clearInterval(interval);
      callback();
    }
  }, 50);
};

Buzz.prototype.show = function () {
  this.element.parentNode.parentNode.className = this.element.parentNode.parentNode.className + ' buzz--active';
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
  });

  $('.post-content pre code').each(function() {
    $(this).parent().wrap('<div class="code-block"></div>');
  });

  $('.disqus-comment-count').each(function() {
    var obj = {};
    obj.buzz = this;
    var buzz = new Buzz(obj);
  });

});

/**
 * main.js
 *
 * Author: Marian Friedmann
 *
 */


/**
 * Buzz function makes it possible to work with the disqus comment count.
 *
 * @param  {object} obj        containing relevant information
 * @param  {bool}   fullOutput triggers full output (including buzz-bar)
 *
 * obj.buzz        = wrapper element, containing disqus comment span
 * obj.steps       = steps for the buzz bar; optional
 * obj.buzzIcon    = character/string that is used to generate the
 *                   buzz-bar, according to obj.steps
 * obj.template    = template to output comments (and buzz-bar);
 *                   {{buzz}} and {{comments}} will be replaced
 *                   by buzz-bar and comment count
 * obj.activeClass = active class thats aplied to obj.buzz
 */

var Buzz = function(obj, fullOutput) {
  this.wrapper = obj.buzz;
  this.element = this.wrapper.childNodes[0];

  this.fullOutput = fullOutput || false;

  /*defaults*/
  this.steps = obj.steps || '20,50,100';
  this.buzzIcon = obj.buzzIcon || '💜';
  this.template = obj.template || '{{buzz}} {{comments}}';
  this.wrapperActiveClass = obj.activeClass || 'active';

  this.comments = false;
  this.progress = '';

  this.steps = this.steps.split(',');

  this.waitForContent();
};

Buzz.prototype.waitForContent = function(callback) {
  var buzz = this;
  var interval = setInterval(function() {
    if (buzz.element.innerHTML) {
      buzz.comments = buzz.element.innerHTML;
      clearInterval(interval);
      buzz.show();
    }
  }, 50);
};

Buzz.prototype.show = function () {
  var buzz = this;
  var content = this.template.replace('{{comments}}', this.comments);
  if (this.fullOutput) {
    buzz.steps.forEach(function(val,key) {
      if (buzz.comments >= parseFloat(val)) {
        buzz.progress += buzz.buzzIcon;
      }
    });
    content = content.replace('{{buzz}}', this.progress);
  }
  this.wrapper.innerHTML = content;
  setTimeout(function() {
    buzz.wrapper.className = buzz.wrapper.className + ' ' + buzz.wrapperActiveClass;
  }, 100);
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

  $('.buzz-wrap').each(function() {
    var obj = {};
    obj.buzz = this;
    obj.buzzIcon = '🔥';
    obj.activeClass = 'buzz-wrap--active';
    obj.template = '<span class="buzz buzz--frontpage tooltip">{{buzz}}<span class="tooltip__content">{{comments}} Comments!</span></span>';
    var buzz = new Buzz(obj, true);
  });

  $('.comments').each(function() {
    var obj = {};
    obj.buzz = this;
    obj.activeClass = 'comments--active';
    obj.template = '{{comments}} Comments!';
    var buzz = new Buzz(obj);
  });

});

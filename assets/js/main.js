/**
 * main.js
 *
 * Author: Marian Friedmann
 *
 */

$(function() {
  var $headerNav = $(".header-archive");

  $headerNav.headroom({
    offset: 600,
    classes : {
        pinned : "header-archive--visible",
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
});

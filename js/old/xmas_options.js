var XMAS_OPTIONS = (function() {  
  /**
   * Either shows or hides the option bars.  If a callback function is specified, 
   * it will be executed after the animations complete.
   */
  var toggleOptions = function($optionHeader, callback) {
    var $this = $optionHeader;
    var $arrow = $this.siblings(".arrow");
    if ($this.hasClass("showing")) {
      changeArrow($arrow, "down");
      $this.removeClass("showing").siblings(".content").slideUp("fast", function() { $this.addClass("bl"); });
    } else {
      changeArrow($arrow, "up");
      $this.addClass("showing").removeClass("bl").siblings(".content").slideDown("fast");
    }
    
    if (callback) {
      callback.apply();
    }
  }

  /**
   * For the option bars, this changes the little arrow graphic.
   */
  var changeArrow = function($arrow, direction) { $arrow.removeClass("left right up down").addClass(direction); };

  /**
   * Shows the provided message element, then fades away after a set time.
   */
  var showSuccessMessage = function($message) { $message.show().delay(2500).fadeOut("fast"); };
  
  return {
    changeArrow: changeArrow
   ,toggleOptions: toggleOptions
   ,showSuccessMessage: showSuccessMessage
  };
})();
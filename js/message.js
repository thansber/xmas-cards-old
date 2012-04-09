define( /* Message */
["jquery"], 
function($) {
  
  var $messages = null;
  var $message = null;
  
  var messageTypes = {
    Error: "error",
    Info: "info"
  };
  
  return {
    hide: function() {
      $message.text("");
      $messages.removeClass();
    },
    
    init: function() {
      $messages = $("#messages");
      $message = $messages.find(".text");
    },
    
    show: function(text, options) {
      var opt = $.extend({}, options);
      $message.text(text).removeClass();
      if (opt.type) {
        $messages.addClass(opt.type);
      }
      $messages.addClass("displayed");
    },
    
    success: function($elem, msg, opt) {
      var defaults = {
        fadeAway: true
      };
      var opt = $.extend(defaults, opt);
      var $quickbarMessage = $elem.siblings(".success.message");
      $quickbarMessage.text(msg).addClass("displayed");
      
      if (opt.fadeAway) {
        $quickbarMessage.addClass("fadeable");
      }
    },
    
    Types: messageTypes
  };
});
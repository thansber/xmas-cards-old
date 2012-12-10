define(
["io"], 
function(IO) {
  
  var currentYear = -1;
  
  var QUICKBAR_KEY = "XMAS_CARDS_QUICKBAR";
  var CURRENT_YEAR_KEY = "XMAS_CARDS_CURRENT_YEAR";
  
  var setCurrentYear = function(year) {
    IO.write(CURRENT_YEAR_KEY, "" + year);
    currentYear = +year;
  };
  
  return {
    getCurrentYear: function() {
      currentYear = IO.read(CURRENT_YEAR_KEY);
      if (!currentYear) {
        currentYear = new Date().getFullYear();
        setCurrentYear(currentYear);
      }
      return "" + currentYear;
    },
    
    isQuickbarDisplayed: function() {
      var value = IO.read(QUICKBAR_KEY);
      if (value === undefined) {
        value = "1";
        IO.write(QUICKBAR_KEY, value);
      }
      return !!(+value);
    },
    
    quickbarDisplayChanged: function() {
      IO.write(QUICKBAR_KEY, +$("#quickbar").hasClass("displayed"));
    },
    
    setCurrentYear: setCurrentYear,
    
    updateQuickbarArrowLabel: function() {
     var label = !!(+IO.read(QUICKBAR_KEY)) ? "Hide the new recipient/group inputs to save room" : "Display inputs to add new recipients and groups";
     $("#quickbar .arrow").attr("title", label);
    }
  };
});
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
      return !!(+IO.read(QUICKBAR_KEY));
    },
    
    quickbarDisplayChanged: function() {
      IO.write(QUICKBAR_KEY, +$("#quickbar").hasClass("displayed"));
    },
    
    setCurrentYear: setCurrentYear
  };
});
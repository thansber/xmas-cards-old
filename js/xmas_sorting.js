var XMAS_SORTING = (function() {
  
  var currentYear = XMAS_IO.getCurrentYear();
  
  var sortByGroup = function(a, b) {
    if (a.group == b.group) {
      return compareString(a.name, b.name);
    }
    if (!a.group || a.group.length == 0) {
      return 1;
    }
    if (!b.group || b.group.length == 0) {
      return -1;
    }
    return compareString(a.group, b.group);
  };

  var sortByName = function(a, b) { return compareString(a.name, b.name); };
  
  var sortBySent = function(a, b) {
    var c = compareBoolean(a.years[currentYear], b.years[currentYear], "sent");
    if (c == 0) {
      c = sortByGroup(a, b);
    }
    return c;
  };
  
  var sortByReceived = function(a, b) {
    var c = compareBoolean(a.years[currentYear], b.years[currentYear], "recv");
    if (c == 0) {
      c = sortByGroup(a, b);
    }
    return c;
  };
  
  var compareString = function(a, b) {
    var x = a.toLowerCase();
    var y = b.toLowerCase();
    return (x < y) ? -1 : ((x > y) ? 1 : 0);
  };
  
  var compareBoolean = function(aObj, bObj, property) {
    var aBool = false;
    var bBool = false;
    if (aObj != null) {
      aBool = aObj[property];
    }
    if (bObj != null) {
      bBool = bObj[property];
    }
    if (aBool == bBool) {
      return 0;
    } else if (aBool) {
      return -1;
    } else {
      return 1;
    }
  }
  
  return {
    byGroup: sortByGroup
   ,byName: sortByName
   ,bySent: sortBySent
   ,byReceived: sortByReceived
  };
})();
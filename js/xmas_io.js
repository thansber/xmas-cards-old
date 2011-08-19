var XMAS_IO = (function() {

  var $roster = null;
  var GROUPS_ID = "_GROUPS_";
  var GROUP_DELIM = "|"; 
  var CURRENT_YEAR_ID = "_CURRENT_YEAR_";
  var PREV_YEARS_ID = "_PREV_YEARS_";
  var OTHER_EVENTS_ID = "_OTHER_EVENTS_";
  var OTHER_EVENTS_DELIM = "|";
  
  var STORED_DATA = [GROUPS_ID, CURRENT_YEAR_ID, PREV_YEARS_ID, OTHER_EVENTS_ID];
  
  var init = function(opt) { $roster = $("#roster"); };
  
  /* --------------------------- */
  /* ----- PRIVATE METHODS ----- */
  /* --------------------------- */
  var buildEntryFromInput = function(group) {
    var $dialog = $("#entry");
    var name = $(".name.value input", $dialog).val();
     
    var entry = {};
    entry.entry = true;
    entry.name = name;
    entry.group = group;
    entry.years = {};
    
    $("#entryPrevYears tbody tr").each(function() {
      var $this = $(this);
      var year = $("td.year", $this).html();
      var sent = $("td.sent input", $this).attr("checked");
      var received = $("td.received input", $this).attr("checked");
      entry.years[year] = {};
      entry.years[year].sent = sent;
      entry.years[year].recv = received;
    });
    
    return entry;
  };
  
  var buildGroupFromInput = function() {
    // First check for a new group
    var group = $("#entryGroup").val();
    var isNew = false;
    if (group.length > 0) {
      newGroup(group);
      isNew = true;
    } else {
      group = $("#existingGroups").val();
    }
    
    return {newGroup:isNew, groupName:group};
  };
  
  
  /**
   * Reads the group data entered and adds it to the delimited list of groups.
   */
  var newGroup = function(name) {
    if (localStorage[GROUPS_ID] == null) {
      localStorage[GROUPS_ID] = "";
    }
    localStorage[GROUPS_ID] += (localStorage[GROUPS_ID].length > 0 ? GROUP_DELIM : "") + name;
    return name;
  };
  
  /* -------------------------- */
  /* ----- PUBLIC METHODS ----- */
  /* -------------------------- */
  
  /**
   * Reads all data stored for this domain and creates an object containing the stored data. 
   */
  var backupStoredData = function() {
    var data = {};
    for (var key in STORED_DATA) {
      data[STORED_DATA[key]] = localStorage[STORED_DATA[key]];
    }
    
    $.extend(true, data, loadRoster());
    return data;
  };
  
  var deleteRosterEntry = function(name) { localStorage.removeItem(name); };
  
  var editRosterEntry = function(oldName) {
    var groupResult = buildGroupFromInput();
    var entry = buildEntryFromInput(groupResult.groupName);
    var currentYear = getCurrentYear();

    // Need to retain the current year sent/received since it does not appear in the dialog
    var oldEntry = JSON.parse(localStorage[oldName]);
    if (!oldEntry.years[currentYear]) {
      oldEntry.years[currentYear] = {};
    }
    entry.years[currentYear] = {};
    entry.years[currentYear].sent = oldEntry.years[currentYear].sent;
    entry.years[currentYear].recv = oldEntry.years[currentYear].recv;
    
    // If the user changed names, delete the old entry and create a new one
    if (entry.name != oldName) {
      localStorage.removeItem(oldName);
    }
    
    var entryAsText = JSON.stringify(entry);
    localStorage[entry.name] = entryAsText;
  };
  
  var getCurrentYear = function() { return localStorage[CURRENT_YEAR_ID]; };
  var getEvents = function() { 
    var events = localStorage[OTHER_EVENTS_ID];
    if (events == null || events.length == 0) {
      return events;
    }
    return events.split(OTHER_EVENTS_DELIM);
  };
  var getNumPrevYears = function() { return getPrevYears().length; };
  
  var getPrevYears = function() {
    var prevYears = localStorage[PREV_YEARS_ID];
    if (prevYears == null || prevYears.length == 0) {
      return [];
    }
    return prevYears.split(",");
  };
  
  var importData = function() {
    var data = JSON.parse($("#dataTransfer .field.import textarea").val());
    for (var d in data) {
      localStorage[d] = (typeof data[d] == "object" ? JSON.stringify(data[d]) : data[d]);
    }
    XMAS_UI.init();
    XMAS_UI.show();
  };
  
  /**
   * Reads all group entries from storage and returns them as an array.
   */
  var loadGroups = function() {
    var groups = localStorage[GROUPS_ID];
    if (!groups) {
      return [];
    }
    return groups.split(GROUP_DELIM); 
  };
  
  /**
   * Reads all roster entries from storage and returns them as a JSON object.
   */
  var loadRoster = function() { 
    var values = {};
    for (var i = 0, n = localStorage.length; i < n; i++) {
      var key = localStorage.key(i);
      if (key.charAt(0) != "_") {
        var value = localStorage[key];
        var json = JSON.parse(value); 
        values[key] = json;
      }
    } 
    return values;
  };
  
  /**
   * Creates a new event based on the user's input and stored it to the list of events.
   */
  var newEvent = function() {
    var $dialog = $("#otherEvents");
    var event = $("input.event", $dialog).val();
    
    if (localStorage[OTHER_EVENTS_ID] == null) {
      localStorage[OTHER_EVENTS_ID] = "";
    }
    localStorage[OTHER_EVENTS_ID] += (localStorage[OTHER_EVENTS_ID].length > 0 ? OTHER_EVENTS_DELIM : "") + event;
    return event;
  };
  
  /**
   * Reads the data entered in the new roster dialog and adds it to the roster entries.
   */
  var newRosterEntry = function() {  
    var groupResult = buildGroupFromInput();
    var entry = buildEntryFromInput(groupResult.groupName);
    var entryAsText = JSON.stringify(entry);
    localStorage[entry.name] = entryAsText;
    
    return groupResult;
  };
  
  /**
   * Saves any changes to the roster table.  This method exists in case we need to save
   * other things in addition to the roster and acts as a wrapper method.
   */
  var save = function() { saveRoster(); };
  
  /**
   * If a group or the checkboxes change for the current year in the roster table,
   * the roster is updated to reflect those changes.
   */
  var saveRoster = function() {
    var s = "";
    var currentYear = getCurrentYear();
    $("tbody tr", $roster).each(function() {
      var $this = $(this);
      var name = $("td:eq(0)", $this).html();
      var group = $("td:eq(1)", $this).html();
      var sent = $("td:eq(2) input", $this).attr("checked");
      var received = $("td:eq(3) input", $this).attr("checked");
      
      var entry = localStorage[name];
      // If we can't find the entry, just move on, although how the heck would this happen?
      if (entry != null) {
        var entryJson = JSON.parse(entry);
        entryJson.group = group;
        entryJson.years[currentYear] = {};
        entryJson.years[currentYear].sent = sent;
        entryJson.years[currentYear].recv = received;
        localStorage[name] = JSON.stringify(entryJson);
      }
    });
  };
  
  var saveYearSetup = function() {
    var currentYear = parseInt($("#currentYear").val());
    var numPrevYears = parseInt($("#prevYears").val());
    
    if (isNaN(currentYear)) {
      alert("Current year must be a valid number");
      return false;
    }
    
    if (isNaN(numPrevYears)) {
      numPrevYears = 0;
    }
    
    localStorage[CURRENT_YEAR_ID] = currentYear;
    var prevYears = [];
    for (var i = 1; i <= numPrevYears; i++) {
      prevYears.push(currentYear - i);
    }
    
    localStorage[PREV_YEARS_ID] = prevYears.toString();
    
    XMAS_UI.buildNewEntryPrevYears();
    
    $("#dialogs").hide();
    XMAS_UI.show();    
    return true;
  };
  
  var selectEvent = function(event) {
    localStorage[CURRENT_YEAR_ID] = event;
    localStorage[PREV_YEARS_ID] = "";
    $("#dialogs").hide();
    XMAS_UI.show();    
    return true;
  };
  
  var supportsLocalStorage = function() {
    try { 
      return 'localStorage' in window && window['localStorage'] !== null; 
    } catch(e) { 
      return false; 
    }
  };
  
  return {
    init: init
   ,backupStoredData: backupStoredData
   ,deleteRosterEntry: deleteRosterEntry
   ,editRosterEntry: editRosterEntry
   ,getCurrentYear: getCurrentYear
   ,getEvents: getEvents
   ,getNumPrevYears: getNumPrevYears
   ,getPrevYears: getPrevYears
   ,importData: importData
   ,loadRoster: loadRoster
   ,loadGroups: loadGroups
   ,newEvent: newEvent
   ,newRosterEntry: newRosterEntry
   ,save: save
   ,saveYearSetup: saveYearSetup
   ,selectEvent: selectEvent
   ,supportsLocalStorage: supportsLocalStorage
  };
})();
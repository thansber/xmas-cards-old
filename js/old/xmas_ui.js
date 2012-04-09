var XMAS_UI = (function() {
  
  var $roster = null;
  
  /**
   * Initializes variables using the provided options as follows:
   * 
   * roster - the element for the roster table
   * years - array of previous years containing historical data, 
   *         only those years provided will be shown as columns 
   *         in the roster table
   */
  var init = function(opt) {
    $roster = $("#roster");
    buildNewEntryPrevYears();
    buildNewEntryGroups();
    buildExistingEntries();
  };
  
  
  /* --------------------------- */
  /* ----- PRIVATE METHODS ----- */
  /* --------------------------- */
  var buildExistingEntries = function() {
    var roster = rosterToArray().sort(XMAS_SORTING.byName);
    var $entriesDropDown = $("#existingEntries");
    var $deleteEntriesDropDown = $("#existingDeleteEntries");
    
    $entriesDropDown.empty();
    $deleteEntriesDropDown.empty();
    
    newOption("", "--- Select a name ---").appendTo($entriesDropDown);
    newOption("", "--- Select a name ---").appendTo($deleteEntriesDropDown);
    
    for (var r in roster) {
      var name = roster[r].name;
      newOption(name, name).appendTo($entriesDropDown);
      newOption(name, name).appendTo($deleteEntriesDropDown);
    }
  };
  
  var buildNewEntryGroups = function() {
    var groups = XMAS_IO.loadGroups();
    groups.sort();
    var $groupDropDown = $("#existingGroups");
    
    $groupDropDown.empty();
    
    for (var g in groups) {
      var group = groups[g];
      newOption(group, group).appendTo($groupDropDown);
    }
  };
  
  /**
   * Builds the text for a previous year based on the sent/received values in the roster.
   * If a recipient had both sent/received flags set to true the text would be 
   * "Sent & Received".  If only one flag is set, the corresponding text is displayed.
   */
  var buildYearResult = function(entry, year) {
    if (!entry.years || entry.years[year] == null) {
      return "";
    }

    var yearResult = "";
    if (entry.years[year].sent) {
      yearResult += "Sent";
      if (entry.years[year].recv) {
        yearResult += " &amp; ";
      }
    }
    if (entry.years[year].recv) {
      yearResult += "Received";
    }
    return yearResult;
  };
  
  var clearDialog = function(dialogId) {
    $("#" + dialogId)
      .find("input[type='text']").val("").end()
      .find("input[type='checkbox']").attr("checked", false);
  };
  
  /**
   * Retrieves the group attached to a roster entry using the name in the roster table.
   */
  var getSavedGroup = function($groupCell, roster) {
    var $nameCell = $groupCell.closest("tr").find("td.name");
    var name = $nameCell.html();
    var group = roster[name].group;
    return group;
  };
  
  /**
   * Builds a new <td> element for the roster table.  
   * Can be used for <th> elements as well.
   */
  var newCell = function(html, cssClasses, isHeader) {
    var htmlTag = isHeader ? "th" : "td";
    var $cell = $("<" + htmlTag + "/>");
    if (html) {
      $cell.html(html);
    }
    if (cssClasses) {
      if (!$.isArray(cssClasses)) {
        cssClasses = $.makeArray(cssClasses);
      }
      for (var c in cssClasses) {
        $cell.addClass(cssClasses[c]);
      }
    }
    return $cell;
  };
  
  /**
   * Builds an <option> element.
   */
  var newOption = function(v, h) { return $("<option/>").val(v).html(h); };
  
  /**
   * Converts the roster to an array for easier iteration.
   */
  var rosterToArray = function() {
    var rosterArray = [];
    var roster = XMAS_IO.loadRoster();
    for (var r in roster) {
      var entry = $.extend(true, {}, roster[r]);
      entry.name = r;
      rosterArray.push(entry);
    }
    return rosterArray;
  }
  
  /**
   * Builds the <th> elements for the roster table.
   */
  var showHeaders = function(years) {
    var currentYear = XMAS_IO.getCurrentYear();
    $("thead tr", $roster).remove();
    var $header = $("<tr/>");
    newCell("Name", "name", true).appendTo($header);
    newCell("Group", "group", true).appendTo($header);
    newCell(currentYear + " Sent", "current", true).appendTo($header);
    newCell(currentYear + " Received", "current", true).appendTo($header);
    
    for (var i in years) {
      newCell("" + years[i], "year", true).appendTo($header);
    }
    
    $header.appendTo($("thead", $roster));
  };  
  
  var toggleEntryDialogMode = function(cssClassToShow, cssClassToHide) {
    $("#dialogs #entry")
      .find("." + cssClassToHide).hide().end()
      .find("." + cssClassToShow).show();
  };
  
  /* -------------------------- */
  /* ----- PUBLIC METHODS ----- */
  /* -------------------------- */
  /**
   * Updates the roster table by rebuilding it.  
   * 
   * @param sortFunction - function that applies a default sorting algorithm to the roster
   */
  var show = function(sortFunction) {
    $("thead", $roster).empty();
    $("tbody", $roster).empty();
    
    // Only want to display at most the last 2 years, all we have room for 
    var years = XMAS_IO.getPrevYears();
    if (years.length > 2) {
      years = years.slice(0, 2);
    }
    showHeaders(years);
    
    if (sortFunction == null) {
      sortFunction = XMAS_SORTING.byGroup;
    }
    
    var roster = rosterToArray().sort(sortFunction);
    var currentYear = XMAS_IO.getCurrentYear();      

    for (var i = 0, n = roster.length; i < n; i++) {
      var rosterEntry = roster[i];
      var name = rosterEntry.name;
      var $row = $("<tr/>");
      var group = rosterEntry.group;
      
      newCell(name, "name").appendTo($row);
      newCell(group, "group").appendTo($row);
      var $sent = $("<input/>").attr("type","checkbox").appendTo(newCell(null, "sent").appendTo($row));
      var $received = $("<input/>").attr("type","checkbox").appendTo(newCell(null, "received").appendTo($row));
      
      var currentYearSent = false;
      var currentYearReceived = false;
      
      var entryCurrentYear = rosterEntry.years ? rosterEntry.years[currentYear] : null; 
      if (entryCurrentYear != null) {
        if (entryCurrentYear.sent != null) {
          currentYearSent = entryCurrentYear.sent;
        }
        if (entryCurrentYear.recv != null) {
          currentYearReceived = entryCurrentYear.recv;
        }
      }

      $sent.attr("checked", currentYearSent);
      $received.attr("checked", currentYearReceived);

      for (var y in years) {
        newCell(buildYearResult(rosterEntry, years[y]), "year").appendTo($row);
      }
      
      $row.appendTo($("tbody", $roster));
    }
    
    updateTotals();
  };
  
  var buildNewEntryPrevYears = function() {
    var $prevYears = $("#entryPrevYears");
    var $tbody = $("tbody", $prevYears);
    var $checkbox = $("<input/>").attr("type", "checkbox");
    var years = XMAS_IO.getPrevYears();
    
    $tbody.empty();
    
    for (var y in years) {
      var year = years[y];
      var $row = $("<tr/>");
      newCell(year, "year").appendTo($row);
      newCell($checkbox.clone(), "sent").appendTo($row);
      newCell($checkbox.clone(), "received").appendTo($row);
      $row.appendTo($tbody);
    }
  };
  
  var checkYearSetup = function() {
    var currentYear = XMAS_IO.getCurrentYear(); 
    if (currentYear == null || currentYear.length == 0) {
      XMAS_UI.showDialog("years");
      $("#years .close").hide();
    }
  };
  
  var deleteRosterEntry = function() {
    var selectedValue = $("#existingDeleteEntries").val();
    if (selectedValue.length == 0) {
      return false;
    }
    
    XMAS_IO.deleteRosterEntry(selectedValue);
    
    updateTotals();
    buildExistingEntries();    
    $("#footer .options #groupsOff").click();
    $("#dialogs").hide();
    XMAS_OPTIONS.showSuccessMessage($("#footer .maintenance .success.delete"));
    show();
  };
  
  var editEntryMode = function() { 
    toggleEntryDialogMode("edit", "new"); 
    enableEntryInput(false);
    $("#existingEntries").val("");
  };
  
  var enableEntryInput = function(inputEnabled) {
    $("#dialogs #entry")
      .find("input").attr("disabled", !inputEnabled).end()
      .find("select:not(#existingEntries)").attr("disabled", !inputEnabled);
  };
  
  var exportData = function(data) {
    showDialog("dataTransfer");
    var $dialog = $("#dataTransfer");
    $dialog
      .find(".import").hide().end()
      .find(".export").show();
    $(".field.export textarea", $dialog).val(JSON.stringify(data));
  };

  /**
   * Disables group drop-downs in the roster table, 
   * showing only the selected values.
   */
  var hideGroupDropDowns = function() {
    $("tbody td.group", $roster).each(function() {
      var $groupCell = $(this);
      var group = $("option:selected", $groupCell);
      $("select", $groupCell).remove();
      if (group && group.length > 0) {
        $groupCell.html(group.val());
      }
    });
  };
  
  var isEditMode = function() { return $("#existingEntries:visible").length > 0; };
  
  var loadEntryToEdit = function(name) {
    if (name.length == 0) {
      enableEntryInput(false);
      clearDialog("entry");
      return;
    }
    var roster = XMAS_IO.loadRoster();
    var entry = roster[name];
    
    $("#entryName").val(name);
    $("#existingGroups").val(entry.group);
    
    $("#entryPrevYears tbody tr").each(function() {
      var $row = $(this);
      var year = $("td.year", $row).html();
      var entryYear = entry.years[year];
      if (entryYear != null) {
        $("td.sent input", $row).attr("checked", entryYear.sent);
        $("td.received input", $row).attr("checked", entryYear.recv);
      }
    });
    
    enableEntryInput(true);
  };
  
  var newEntryMode = function() { toggleEntryDialogMode("new", "edit"); enableEntryInput(true); };
  
  var otherEvents = function() {
    var $dialog = $("#otherEvents");
    $(".close", $dialog).show();
    var $select = $(".existingEvent .event", $dialog);
    $select.empty();
    $select.append(newOption("", "-- Select an event --"));
    var events = XMAS_IO.getEvents();
    for (var e in events) {
      $select.append(newOption(events[e], events[e]));
    }
    
    showDialog("otherEvents");
  };
  
  var saveRosterEntry = function() {
    var result = (isEditMode() ? XMAS_IO.editRosterEntry($("#existingEntries").val()) : XMAS_IO.newRosterEntry());
    updateTotals();
    buildExistingEntries();
    
    if (result && result.newGroup) {
      $("tbody td.group select", $roster).append(newOption(result.groupName, result.groupName));
      buildNewEntryGroups();
    }
     
    $("#footer .options #groupsOff").click();
    $("#dialogs").hide();
    XMAS_OPTIONS.showSuccessMessage($("#footer .maintenance .success.entry"));
    show();
  };
  
  var setupYears = function() {
    $("#years .close").show();
    $("#currentYear").val(XMAS_IO.getCurrentYear());
    $("#prevYears").val(XMAS_IO.getNumPrevYears());
    showDialog("years");
  };
  
  /**
   * Displays a "dialog" for adding a new roster entry or group
   */
  var showDialog = function(dialogId) {
    clearDialog(dialogId);
    $("#dialogs")
      .find(".dialog").hide().end()
      .find("#" + dialogId).show().end()
      .fadeIn("fast");
    $("#" + dialogId + " input:first").focus();
  };
  
  /**
   * Enables group drop-downs in the roster table.
   */
  var showGroupDropDowns = function() {
    var groups = XMAS_IO.loadGroups();    
    var $groupDropDown = $("<select/>");
    newOption("", "").appendTo($groupDropDown);
    for (var g in groups) {
      var $option = newOption(groups[g], groups[g]);
      $option.appendTo($groupDropDown);
    }
    
    var roster = XMAS_IO.loadRoster();
    $("tbody td.group", $roster).empty().each(function() {
      var savedGroup = getSavedGroup($(this), roster); 
      var $clonedGroup = $groupDropDown.clone();
      if (savedGroup) {
        $clonedGroup.val(savedGroup);
      }
      $clonedGroup.appendTo($(this));
    });
  }; 
  
  var showImportData = function() {
    showDialog("dataTransfer");
    var $dialog = $("#dataTransfer");
    $dialog
      .find(".export").hide().end()
      .find(".import").show();
  };
  
  /**
   * Updates the total values at the top of the page.
   */
  var updateTotals = function() {
    var roster = rosterToArray();
    $("#header .currentYear").html(XMAS_IO.getCurrentYear());
    $("#totalValue").html(roster.length);
    $("#sentValue").html($("tbody td.sent input:checked", $roster).length);
    $("#receivedValue").html($("tbody td.received input:checked", $roster).length);
  };  
  
  return {
    init: init
   ,show: show
   ,buildNewEntryPrevYears: buildNewEntryPrevYears
   ,checkYearSetup: checkYearSetup
   ,deleteRosterEntry: deleteRosterEntry
   ,editEntryMode: editEntryMode
   ,enableEntryInput: enableEntryInput
   ,exportData: exportData
   ,hideGroupDropDowns: hideGroupDropDowns
   ,loadEntryToEdit: loadEntryToEdit
   ,newEntryMode: newEntryMode
   ,otherEvents: otherEvents
   ,saveRosterEntry: saveRosterEntry
   ,setupYears: setupYears
   ,showDialog: showDialog
   ,showGroupDropDowns: showGroupDropDowns
   ,showImportData: showImportData
   ,updateTotals: updateTotals
  };
  
})();
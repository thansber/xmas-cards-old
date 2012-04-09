$(document).ready(function() {
    
  if (!XMAS_IO.supportsLocalStorage()) {
    alert("Please upgrade to the most recent version of your browser if you want to use this application");
    return false;
  }
  
  /* =========================================================================== */
  /* First time users must set the current year and any previous years they want */
  /* =========================================================================== */
  XMAS_UI.checkYearSetup();
  XMAS_IO.init();
  XMAS_UI.init();
  XMAS_UI.show();
    
  $("#roster tbody td input").click(function() { XMAS_UI.updateTotals(); });
  
  /* ================== */
  /* Option Box Effects */
  /* ================== */
  $("#footer .options h2").click(function() { XMAS_OPTIONS.toggleOptions($(this)); });  
  $("#footer .options .arrow").click(function() { $(this).siblings("h2").click(); });
  
  /* ============================ */
  /* Save Changes to Roster Table */
  /* ============================ */
  $("#footer .save #save").click(function() {
    $("#footer .options #groupsOff").click();
    XMAS_IO.save();
    XMAS_OPTIONS.showSuccessMessage($(this).siblings(".success"));
    XMAS_UI.show(XMAS_SORTING.byGroup);
  });
  
  /* ============== */
  /* Group Toggling */
  /* ============== */
  $("#footer .options #groupsOn").click(function() {
    $(this).hide()
      .siblings("#groupOnMessage").show().end()
      .siblings("#groupsOff").show();
    
    XMAS_UI.showGroupDropDowns();
  });
  
  $("#footer .options #groupsOff").click(function() {
    $(this).hide()
      .siblings("#groupOnMessage").hide().end()
      .siblings("#groupsOn").show();
    
    XMAS_UI.hideGroupDropDowns();
  });
  
  /* ======= */
  /* Sorting */
  /* ======= */
  $("#footer .options #groupSort").click(function() { XMAS_UI.show(XMAS_SORTING.byGroup); });
  $("#footer .options #nameSort").click(function() { XMAS_UI.show(XMAS_SORTING.byName); });
  $("#footer .options #sentSort").click(function() { XMAS_UI.show(XMAS_SORTING.bySent); });
  $("#footer .options #receivedSort").click(function() { XMAS_UI.show(XMAS_SORTING.byReceived); });
  
  /* ======= */
  /* Dialogs */
  /* ======= */
  $("#footer .options #addEntry").click(function() { XMAS_UI.newEntryMode(); XMAS_UI.showDialog("entry"); });
  $("#footer .options #editEntry").click(function() { XMAS_UI.editEntryMode(); XMAS_UI.showDialog("entry"); });
  $("#footer .options #deleteEntry").click(function() { XMAS_UI.showDialog("entryDelete"); });
  $("#footer .options #yearSetup").click(function() { XMAS_UI.setupYears(); });
  $("#footer .options #otherEventSetup").click(function() { XMAS_UI.otherEvents(); });
  
  $("#entry #existingEntries").change(function() { XMAS_UI.loadEntryToEdit($(this).val()); });
  $("#entry button.save").click(function() { XMAS_UI.saveRosterEntry(); });
  $("#entryDelete button.delete").click(function() { XMAS_UI.deleteRosterEntry(); });
  $("#years button.save").click(function() { XMAS_IO.saveYearSetup(); });
  $("#otherEvents button.save").click(function() { XMAS_IO.selectEvent(XMAS_IO.newEvent()); });
  $("#otherEvents .existingEvent .event").change(function() { XMAS_IO.selectEvent($(this).val()); });
  $("#dataTransfer button.import").click(function() { XMAS_IO.importData(); });
  
  $("#dialogs .dialog .close").click(function() { $("#dialogs").hide(); return false; });
    
  /* ===== */
  /* Admin */
  /* ===== */
  $("#backupData").click(function() {
    XMAS_UI.exportData(XMAS_IO.backupStoredData());
  });
  
  $("#importData").click(function() {
    XMAS_UI.showImportData();
  });
  
  $("#importTestData").click(function() {
    for (var r in XMAS_ROSTER) {
      var entry = jQuery.extend(true, {}, XMAS_ROSTER[r]);
      entry.entry = true;
      entry.name = r;
      localStorage[r] = JSON.stringify(entry);
    }

    var groups = "";
    for (var g in XMAS_SAVED_GROUPS) {
      groups += (groups.length > 0 ? "|" : "") + XMAS_SAVED_GROUPS[g];
    }
    localStorage["_GROUPS_"] = groups;

    var events = "";
    for (var e in OTHER_EVENTS) {
      events += (events.length > 0 ? "|" : "") + OTHER_EVENTS[e];
    }
    localStorage["_OTHER_EVENTS_"] = events;
    
    XMAS_UI.init();
    XMAS_UI.show();
  });
});
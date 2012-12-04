define( /* Recipient */
["group", "io", "settings", "util"], 
function(Group, IO, Settings, Util) {
  
  var roster = {};
  var sortedNames = [];
  
  var $header = null;
  
  var ROSTER_KEY = "XMAS_CARDS_ROSTER";
  var SENT_FLAG = 2;
  var RECEIVED_FLAG = 1;
  
  var addRecipientToGroup = function(name, appending) {
    var entry = roster[name];
    var $group = Group.find(entry.group);
    var $entry = buildRecipientMarkup(name);
    var $roster = $group.find(".roster");
    
    if (appending) {
      $roster.append($entry);
      enableDraggable($entry);
    } else {
      sortGroupEntries(name, $entry);
    }
    groupMembershipChanged($group);
  };
  
  var addWithYears = function(name, groupIndex, options) {
    var opt = $.extend({save:true, rebuild:true, recalculate:true, append:true}, options);
    
    if (roster[name]) {
      return {error:"You have already added someone with the name '" + name + "', each recipient should have a unique name.  Otherwise, you might get confused seeing 2 recipients with the same name."};
    }
    
    sortedNames.push(name);
    sortRoster();

    var years = {};
    years[Settings.getCurrentYear()] = 0;
    
    roster[name] = {
      group: +groupIndex,
      years: years
    };
    
    if (opt.save) {
      saveRoster();
    }
    addRecipientToGroup(name, opt.append);
    if (opt.rebuild) {
      rebuildLayout();
    }
    if (opt.recalculate) {
      updateCounts();
    }
  
    return true;
  };
  
  var buildRecipientMarkup = function(name) {
    var markup = [];
    var m = 0;
    var entry = roster[name];
    var years = entry.years;
    var currentYear = +Settings.getCurrentYear();
    
    markup[m++] = "<li class='entry' data-name='" + name + "'>";
    markup[m++] = "<h4 class='name'>";
    markup[m++] = "<span class='view text' title='Click to edit or drag to move to another group'>" + name + "</span>";
    markup[m++] = "<input type='text' class='edit recipient name' value='" + name + "' />";
    markup[m++] = "<a class='delete recipient' title='Delete this recipient'>X</a>";
    markup[m++] = "</h4>";

    for (var i = currentYear; i > currentYear - 3; i--) {
      var yearData = entry.years[""+ i];
      var status = parseYearStatus(yearData);
      if (yearData !== null && yearData !== undefined) {
        if (!status) {
          status = {};
        }
        markup[m++] = "<div class='" + (!status.sent && !status.received ? "empty " : "") + (i === currentYear ? "current " : "") + "year-wrapper'>";
        markup[m++] = "<span class='year'>" + i + "</span>";
        markup[m++] = "<span class='" + (status.sent ? "done " : "") + "sent'>Sent</span>";
        markup[m++] = "<span class='" + (status.received ? "done " : "") + "received'>Recv'd</span>";
        markup[m++] = "</div>"
      }
    }
    
    markup[m++] = "</li>";
    
    return $(markup.join(""));
  };
  
  var calculateSummaryCounts = function() {
    var total = 0;
    var sent = 0;
    var received = 0;
    var currentYear = Settings.getCurrentYear();
    for (var name in roster) {
      var entry = roster[name];
      var status = parseYearStatus(entry.years[currentYear]);
      if (status) {
        if (status.sent) {
          sent++;
        }
        if (status.received) {
          received++;
        }
      }
      
      total++;
    }
    
    return {total:total, sent:sent, received:received};
  };
  
  var enableDraggable = function($entry) {
    $entry.find(".name .text").draggable(Util.draggableOptions());
  };
  
  var getEntry = function(name) {
    var $group = Group.find(roster[name].group);
    if ($group.length === 0) {
      return null;
    }
    return $group.find(".roster li[data-name='" + name + "']");
  };
  
  var getNumGroupMembers = function($group) {
    return $group.find(".roster .entry").length;
  };
  
  var groupMembershipChanged = function($group) {
    var numMembers = getNumGroupMembers($group);
    $group.find(".empty.message").toggle(numMembers === 0);
    $group.find(".name .count").text("(" + numMembers + ")");
  };
  
  var parseYearStatus = function(yearData) {
    if (!yearData) {
      return null;
    }
    
    var status = +yearData;
    if (status === null || status === undefined) {
      return null;
    }
    
    return {
      sent: status & SENT_FLAG,
      received: status & RECEIVED_FLAG
    };
  };
  
  var rebuildLayout = function() {
    $("#main").isotope("reLayout");
  };
  
  var saveRoster = function() {
    IO.writeObject(ROSTER_KEY, roster);
  };
  
  var sortByName = function(a, b) {
    var lowerA = a.toLowerCase();
    var lowerB = b.toLowerCase();
    return (lowerA === lowerB) ? 0 : (lowerA > lowerB ? 1 : -1);
  };
  
  var sortGroupEntries = function(name, $entry) {
    
    var $group = Group.find(roster[name].group);
    var $roster = $group.find(".roster");
    var $entries = $roster.find("li");
    
    // Build an array of the existing names
    var namesInGroup = $.map($entries, function(item) {
      return $(item).data("name");
    });
    // Add the new one and sort this array
    namesInGroup.push(name);
    namesInGroup.sort(sortByName);
    // Insert the new entry using its new position before the entry that used to take its place
    var newIndex = namesInGroup.indexOf(name);
    if (newIndex === namesInGroup.length - 1) {
      $roster.append($entry);
      enableDraggable($entry);
    } else {
      $entry.insertBefore($entries.eq(newIndex));
    }
  };
  
  var sortRoster = function() {
    sortedNames.sort(sortByName);
  };
  
  var updateCounts = function() {
    var counts = calculateSummaryCounts();
    var summaryLines = ["total", "sent", "received"];
    
    for (var i in summaryLines) {
      var type = summaryLines[i];
      $header.find("." + type).toggleClass("single", counts[type] === 1).find(".count").text(counts[type]);
    }
  };
  
  var updateYear = function(name, year, sr, done) {
    var entry = roster[name];
    
    if (!entry) {
      console.error("No roster entry found for [" + name + "]");
      return false;
    }
    
    var flag = (sr === "sent" ? SENT_FLAG : (sr === "received" ? RECEIVED_FLAG : 0));
    
    if (!flag) {
      console.error("Invalid value for sent/received [" + sr + "]");
      return false;
    }
    
    if (done) {
      entry.years[+year] |= flag;
    } else {
      entry.years[+year] &= ~flag;
    }
    
    return true;
  };
  
  return {
    add: function(name, groupIndex, opt) {
      return addWithYears(name, groupIndex, opt);
    },
    
    adjustGroupIndexes: function(deletedGroupIndex) {
      for (var name in roster) {
        if (roster[name].group > deletedGroupIndex) {
          roster[name].group--;
        }
      }
    },
    
    calculateSummaryCounts: calculateSummaryCounts,
    
    getGroupMembers: function(groupIndex) { 
      var memberNames = [];
      for (var name in roster) {
        if (roster[name].group === groupIndex) {
          memberNames.push(name);
        }
      }
      return memberNames;
    },
    
    init: function() {
      roster = IO.readObject(ROSTER_KEY);
      if (!roster) {
        roster = {};
        saveRoster();
      }
      
      for (var name in roster) {
        sortedNames.push(name);
      }
      
      sortRoster();
      
      for (var i = 0; i < sortedNames.length; i++) {
        addRecipientToGroup(sortedNames[i], true);
      }
      
      $header = $("#summaryCounts");
      $header.find(".currentYear").text(Settings.getCurrentYear());
      updateCounts();
    },
    
    rebuildLayout: rebuildLayout,
    
    remove: function(name, $entry, options) {
      var opt = $.extend({save:true, rebuild:true, recalculate:true}, options);
      delete roster[name];
      var sortedNameIndex = sortedNames.indexOf(name);
      if (sortedNameIndex > -1) {
        sortedNames.splice(sortedNameIndex, 1);
      }
      
      var $group = $entry.closest(".group.container");
      $entry.remove();
      
      if (opt.save) {
        saveRoster();
      }
      
      groupMembershipChanged($group);

      if (opt.rebuild) {
        rebuildLayout();
      }
      
      if (opt.recalculate) {
        updateCounts();
      }
    },
    
    saveRoster: saveRoster,
    
    update: function(name, year, $button) {
      var sentReceived = "unknown";
      if ($button.hasClass("sent")) {
        sentReceived = "sent";
      } else if ($button.hasClass("received")) {
        sentReceived = "received";
      }
      
      if (!updateYear(name, year, sentReceived, $button.hasClass("done"))) {
        return false;
      }
      
      saveRoster();
      updateCounts();
      
      return true;
    },
    
    updateCounts: updateCounts,
    
    updateGroup: function(name, $entry, newGroup, options) {
      var opt = $.extend({save:true, rebuild:true}, options);
      var newGroupIndex = typeof(newGroup) === "number" ? newGroup : Group.findAll().index(newGroup);
      roster[name].group = newGroupIndex;
      
      var $oldGroup = $entry.closest(".group.container");
      var $movedEntry = $entry.detach();
      var $newGroup = typeof(newGroup) === "number" ? Group.find(newGroup) : newGroup;
      sortGroupEntries(name, $movedEntry);
      
      if (opt.save) {
        saveRoster();
      }

      groupMembershipChanged($oldGroup);
      groupMembershipChanged($newGroup);
      
      if (opt.rebuild) {
        rebuildLayout();
      }
    },
    
    updateName: function(oldName, newName) {
      if (oldName === newName) {
        return;
      }
      var data = $.extend(true, {}, roster[oldName]);
      var $entry = getEntry(oldName);

      roster[newName] = data;
      delete roster[oldName];
      
      var $newEntry = null;
      
      if ($entry.length > 0) {
        $newEntry = $entry.detach();
        sortedNames[sortedNames.indexOf(oldName)] = newName;
        sortRoster();
        sortGroupEntries(newName, $newEntry);
        $newEntry.data("name", newName);
      }
      
      saveRoster();
      
      return $newEntry;
    },
    
    updateYear: updateYear
  };
});
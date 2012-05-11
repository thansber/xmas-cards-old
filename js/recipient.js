define( /* Recipient */
["group", "io", "settings"], 
function(Group, IO, Settings) {
  
  var roster = {};
  
  var ROSTER_KEY = "XMAS_CARDS_ROSTER";
  var SENT_FLAG = 2;
  var RECEIVED_FLAG = 1;
  
  var addRecipientToGroup = function(name) {
    var entry = roster[name];
    var $group = Group.find(entry.group);
    $group.find(".roster").append(buildRecipientMarkup(name));
    groupMembershipChanged($group);
  };
  
  var addWithYears: function(name, groupIndex, yearData, options) {
    var opt = $.extend({save:true, rebuild:true}, options);
    
    if (roster[name]) {
      return {error:"You have already added someone with the name '" + name + "', each recipient should have a unique name.  Otherwise, you might get confused seeing 2 recipients with the same name."};
    }

    var years = {};
    if (yearData) {
      years = $.extend({}, yearData);
    } else {
      years[Settings.getCurrentYear()] = 0;
    }
    
    roster[name] = {
      group: +groupIndex,
      years: years
    };
    
    if (opt.save) {
      saveRoster();
    }
    addRecipientToGroup(name);
    if (opt.rebuild) {
      rebuildLayout();
    }
    
    return true;
  }
  
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
      var status = +entry.years[""+ i];
      if (status !== null && status !== undefined) {
        var sent = status & SENT_FLAG;
        var received = status & RECEIVED_FLAG;
        markup[m++] = "<div class='" + (!sent && !received ? "empty " : "") + (i === currentYear ? "current " : "") + "year-wrapper'>";
        markup[m++] = "<span class='year'>" + i + "</span>";
        markup[m++] = "<span class='" + (sent ? "done " : "") + "sent'>Sent</span>";
        markup[m++] = "<span class='" + (received ? "done " : "") + "received'>Recv'd</span>";
        markup[m++] = "</div>"
      }
    }
    
    markup[m++] = "</li>";
    
    return $(markup.join(""));
  };
  
  var getNumGroupMembers = function($group) {
    return $group.find(".roster .entry").length;
  };
  
  var groupMembershipChanged = function($group) {
    var numMembers = $group.find(".roster .entry").length;
    $group.find(".empty.message").toggle(getNumGroupMembers($group) === 0);
    $group.find(".name .count").text("(" + numMembers + ")");
  };
  
  var rebuildLayout = function() {
    $("#main").isotope("reLayout");
  };
  
  var saveRoster = function() {
    IO.writeObject(ROSTER_KEY, roster);
  };
  
  var updateYear = function(name, year, sr, done) {
    var entry = roster[name];
    
    if (!entry) {
      console.error("No roster entry found for [" + name + "]");
      return false;
    }
    
    var flag = (sr === "sent" ? SENT_FLAG : sr === "received" ? RECEIVED_FLAG : 0);
    
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
  }
  
  return {
    add: function(name, groupIndex) {
      return addWithYears(name, groupIndex);
    },
    
    adjustGroupIndexes: function(deletedGroupIndex) {
      for (var name in roster) {
        if (roster[name].group > deletedGroupIndex) {
          roster[name].group--;
        }
      }
    },
    
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
        addRecipientToGroup(name);
      }
    },
    
    rebuildLayout: rebuildLayout,
    
    remove: function(name, $entry, options) {
      var opt = $.extend({save:true, rebuild:true}, options);
      delete roster[name];
      
      var $group = $entry.closest(".group.container");
      $entry.remove();
      
      if (opt.save) {
        IO.writeObject(ROSTER_KEY, roster);
      }
      
      groupMembershipChanged($group);

      if (opt.rebuild) {
        rebuildLayout();
      }
    },
    
    saveRoster: saveRoster,
    
    update: function(name, year, $button) {
      var sentReceived = $button.hasClass("sent") ? "sent" : ($button.hasClass("received") ? "received" : "unknown");
      if (!updateYear(name, year, sentReceived, $button.hasClass("done")) {
        return false;
      }
      
      saveRoster();
      
      return true;
    },
    
    updateGroup: function(name, $entry, newGroup, options) {
      var opt = $.extend({save:true, rebuild:true}, options);
      var newGroupIndex = typeof(newGroup) === "number" ? newGroup : Group.findAll().index(newGroup);
      roster[name].group = newGroupIndex;
      
      var $oldGroup = $entry.closest(".group.container");
      var $movedEntry = $entry.detach();
      var $newGroup = typeof(newGroup) === "number" ? Group.find(newGroup) : newGroup;
      $newGroup.find(".roster").append($movedEntry);
      
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
      roster[newName] = data;
      delete roster[oldName];
      
      saveRoster();
    },
    
    updateYear: updateYear
  };
});
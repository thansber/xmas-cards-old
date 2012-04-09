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
  
  var buildRecipientMarkup = function(name) {
    var markup = [];
    var m = 0;
    var entry = roster[name];
    var years = entry.years;
    var currentYear = +Settings.getCurrentYear();
    
    markup[m++] = "<li class='entry' data-name='" + name + "'>";
    markup[m++] = "<h4 class='name'>";
    markup[m++] = "<span class='text'>" + name + "</span>";
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
  
  return {
    add: function(name, groupIndex) {

      if (roster[name]) {
        return {error:"You have already added someone with the name '" + name + "', each recipient should have a unique name.  Otherwise, you might get confused seeing 2 recipients with the same name."};
      }
      
      var years = {};
      years[Settings.getCurrentYear()] = 0;
      
      roster[name] = {
        group: +groupIndex,
        years: years
      };
      
      IO.writeObject(ROSTER_KEY, roster);
      addRecipientToGroup(name);
      rebuildLayout();
      
      return true;
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
        IO.writeObject(ROSTER_KEY, roster);
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
    
    saveRoster: function() {
      IO.writeObject(ROSTER_KEY, roster);
    },
    
    update: function(name, year, $button) {
      var entry = roster[name];
      
      if (!entry) {
        console.error("No roster entry found for [" + name + "]");
        return false;
      }
      
      var flag = $button.hasClass("sent") ? SENT_FLAG : ($button.hasClass("received") ? RECEIVED_FLAG : 0);
      
      if (!flag) {
        console.error("Button clicked did not have one of the expected classes");
        return false;
      }
      
      var done = $button.hasClass("done");
      
      if (done) {
        entry.years[+year] |= flag;
      } else {
        entry.years[+year] &= ~flag;
      }
      
      IO.writeObject(ROSTER_KEY, roster);
      
      return true;
    },
    
    updateGroup: function(name, $entry, newGroupIndex, options) {
      var opt = $.extend({save:true, rebuild:true}, options);
      roster[name].group = newGroupIndex;
      
      var $oldGroup = $entry.closest(".group.container");
      var $movedEntry = $entry.detach();
      var $newGroup = Group.find(newGroupIndex);
      $newGroup.find(".roster").append($movedEntry);
      
      if (opt.save) {
        IO.writeObject(ROSTER_KEY, roster);
      }

      groupMembershipChanged($oldGroup);
      groupMembershipChanged($newGroup);
      
      if (opt.rebuild) {
        rebuildLayout();
      }
    }
  };
});
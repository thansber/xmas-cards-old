define( /* Dialog */
["jquery", "group", "message", "recipient"],
function($, Group, Message, Recipient) {
  
  var $dialogs = null;
  
  var buttonHandlers = {
    "delete.group": function($dialog, $button) {
      if ($button.hasClass("cancel")) {
        hide();
      } else if ($button.hasClass("confirm")) {
        var name = $dialog.data("name");
        var groupIndex = Group.getIndex(name);
        var members = Recipient.getGroupMembers(groupIndex);
        var $recipientDecision = $dialog.find(".recipient.decision.message");
        
        if ($recipientDecision.is(":visible")) {
          var selectedChoice = $recipientDecision.find("input[name='recipient-choice']:checked").val();
          var $group = Group.find(groupIndex);
          var $entries = $group.find(".roster .entry");
          var deferUpdates = {save:false, rebuild:false, recalculate:false};
          
          if (selectedChoice === "move") {
            $.each(members, function(i, name) {
              Recipient.updateGroup(name, $entries.eq(i), -1, deferUpdates);
            });
          } else if (selectedChoice === "delete") {
            $.each(members, function(i, name) {
              Recipient.remove(name, $entries.eq(i), deferUpdates);
            });
          }
        }
        
        Group.remove(groupIndex);
        Recipient.adjustGroupIndexes(groupIndex);
        Recipient.saveRoster();
        Recipient.rebuildLayout();
        Recipient.updateCounts();
        
        Message.show(name + " has been deleted.");
        hide();
      }
    },
    
    "delete.recipient": function($dialog, $button) {
      if ($button.hasClass("cancel")) {
        hide();
      } else if ($button.hasClass("confirm")) {
        var name = $dialog.data("name");
        var group = $dialog.data("group");
        var $group = Group.find(Group.getIndex(group));
        Message.show(name + " has been deleted.");
        Recipient.remove(name, $group.find(".entry[data-name='" + name + "']"));
        hide();
      }
    }
  };
  
  var showCallbacks = {
    "delete.group": function($dialog, opt) {
      var $group = opt.jqGroup;
      var name = $group.children(".name").find(".text").text();
      var numEntries = $group.find(".entry").length;
      
      $dialog.toggleClass("empty", numEntries === 0)
        .find(".group.name").text(name).end()
        .find(".member.count").text(numEntries);
      $dialog.data({name:name});
    },
    "delete.recipient": function($dialog, opt) {
      $dialog.find(".recipient.name").text(opt.name);
      $dialog.data({name:opt.name, group:opt.group});
    },
    "migrate": function($dialog, opt) {
      $dialog.trigger("migration.start");
    }
  };
  
  var findDialog = function(dialogClass) {
    return $dialogs.find(".dialog." + dialogClass);
  };
  
  var hide = function() {
    $dialogs.find(".dialog").removeClass("displayed");
  };

  return {
    handleButton: function(dialogClass, $button) {
      var $dialog = findDialog(dialogClass);
      var buttonHandler = buttonHandlers[dialogClass];
      if (buttonHandler) {
        buttonHandler.call(this, $dialog, $button);
      }
    },
    
    hide: hide,
    
    init: function() {
      $dialogs = $("#dialogs");
    },
    
    show: function(dialogClass, opt) {
      $dialogs.removeClass("hidden");
      var $dialog = findDialog(dialogClass);
      var displayDialog = function() { 
        $dialog.addClass("displayed"); 
        $("html, body").animate({scrollTop: 0}, "fast");
      };
      
      if (showCallbacks[dialogClass]) {
        showCallbacks[dialogClass].call(this, $dialog, opt);
      }
      setTimeout(displayDialog, 20);
    }
  };
});
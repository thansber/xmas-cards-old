define(
/* Handlers */ 
["jquery", "dialogs", "group", "message", "recipient", "settings"], 
function($, Dialog, Group, Message, Recipient, Settings) {

  var $quickbar = null;
  var $newRecipient = null;
  var $newRecipientGroup = null;
  var $newGroup = null;
  
  var dialogButtonHandlers = {
    ".delete.recipient" : "delete.recipient",
    ".delete.group" : "delete.group"
  };
  
  return {
    init: function() {
      $quickbar = $("#quickbar");
      $newRecipient = $("#newRecipient");
      $newRecipientGroup = $("#recipientGroup");
      $newGroup = $("#newGroup");

      // ======================================
      // -------------- QUICKBAR --------------
      // ======================================
      $quickbar.find("input").on("blur change", function() {
          var $this = $(this);
          if ($this.val().length === 0) {
            $this.addClass("helpful").val($this.attr("title"));
          } else if ($this.val() === $this.attr("title")) {
            $this.addClass("helpful");
          } else {
            $this.removeClass("helpful");
          }
      }).on("focus", function() {
          $(this).removeClass("helpful").select();
      });
      
      $quickbar.find("button.add").click(function(event) {
        var $target = $(event.target);
        
        Message.hide();
        
        if ($target.hasClass("recipient")) { 
          var result = Recipient.add($newRecipient.val(), $newRecipientGroup.val());
          if (result.error) {
            Message.show(result.error, {type:Message.Types.Error});
          } else {
            Message.success($target, "Recipient added");
            $newRecipient.select().focus();
          }
        } else if ($target.hasClass("group")) {
          var result = Group.add($newGroup.val());
          if (result && result.error) {
            Message.show(result.error, {type:Message.Types.Error});
          } else {
            Message.success($target, "Group added");
            $newGroup.select().focus();
          }
        }
      });
      
      $quickbar.find(".message").on("transitionend webkitTransitionEnd", function() {
        var $this = $(this);
        if ($this.hasClass("fadeable") && !($this.hasClass("fading"))) {
          $this.addClass("fading").removeClass("fadeable");
        } else if ($this.hasClass("fading")) {
          $this.removeClass("fadeable fading displayed");
        }
      });
      
      $quickbar.find(".arrow").click(function() {
        $quickbar.toggleClass("displayed");
        if (!($quickbar.hasClass("displayed"))) {
          clearQuickbarError();
        }
        Settings.quickbarDisplayChanged();
      });
      
      $("#messages .close").click(function() {
        Message.hide();
      });
      
      // =====================================
      // ------------ MAIN ROSTER ------------
      // =====================================
      $("#main .group.container").live("drop", function(event, ui) {
        var $newGroup = $(this);
        var $name = $(ui.draggable);
        var $entry = $name.closest(".entry");
        Recipient.updateGroup($name.text(), $entry, $newGroup);
      });
      
      $("#main .group.container:not(.default) > .name .view").live("click", function() {
        var $name = $(this).parent();
        $name.find(".view").hide();
        $name.find(".edit").show();
        $name.find(".edit.group.text").select().focus();
      });
      
      $("#main .group.container > .name .edit.group.text").live("blur", function() {
        var $this = $(this);
        var $name = $this.parent();
        var $group = $this.closest(".group.container");
        var newGroupName = $this.val();

        Group.update($group, newGroupName);
        $name.find(".edit").hide();
        $name.find(".view").show();
      });
      
      $("#main .delete.group").live("click", function() {
        var $this = $(this);
        Dialog.show("delete.group", {jqGroup:$this.closest(".group.container")});
      });
      
      $("#main .group.container .roster").live("click", function(e) {
        var $target = $(e.target);
        
        if ($target.is(".sent, .received")) {
          $target.toggleClass("done");
          var $yearWrapper = $target.parent();
          var name = $yearWrapper.siblings(".name").find(".text").text();
          var year = $yearWrapper.find(".year").text();
          $yearWrapper.toggleClass("empty", $yearWrapper.find(".done").length === 0);
          Recipient.update(name, year, $target);
        } else if ($target.is(".delete.recipient")) {
          Dialog.show("delete.recipient", {
            name: $target.siblings(".text").text(),
            group: $target.closest(".group.container").children(".name").find(".text").text()
          });
        } else if ($target.is(".view.text")) {
          $target.hide();
          $target.siblings(".edit").data("old-value", $target.text()).show().select().focus();
        }
      });
      
      $("#main .group.container .roster .edit.recipient.name").live("blur", function() {
        var $this = $(this);
        var newName = $this.val();
        Recipient.updateName($this.data("old-value"), newName);
        $this.hide();
        $this.siblings(".view").text(newName).show();
      });
      
      // =====================================
      // -------------- DIALOGS --------------
      // =====================================
      $("#dialogs .close").click(function() {
        Dialog.hide();
        return false;
      });
      
      $("#dialogs button").click(function(e) {
        var $target = $(e.target);
        var $dialog = $target.closest("section");
        
        for (var cssClass in dialogButtonHandlers) {
          if ($dialog.is(cssClass)) {
            Dialog.handleButton(dialogButtonHandlers[cssClass], $target);
          }
        }
        
        return false;
      });
      
      $("#dialogs .dialog").on("transitionend webkitTransitionEnd", function() {
        if ($(this).is(":not(.displayed)")) {
          $("#dialogs").addClass("hidden");
        }
      });
      
      $quickbar.find("input").blur();
    }
  };
});
  
define( /* Group */
["jquery", "io", "util"], 
function($, IO, Util) {
  
  var groups = [];
  var $recipientGroups = null;
  var $groups = null;
  
  var droppableOptions = {
    hoverClass: "drop-hover"
  };

  var DEFAULT_GROUP_NAME = "Unassigned";
  var DEFAULT_GROUP_NAME_REGEX = new RegExp(DEFAULT_GROUP_NAME, "i"); 
  var GROUP_KEY = "XMAS_CARDS_GROUPS";

  
  var buildGroupMarkup = function(name) {
    var markup = [];
    var m = 0;
    
    markup[m++] = "<div class='group container'>";
    markup[m++] = "<h3 class='name'>";
    markup[m++] = "<span class='view text' title='Click to change the name'>"+ name + "</span>";
    markup[m++] = " <span class='view count'></span>";
    markup[m++] = "<input type='text' class='edit group text' value='" + name + "' />"
    markup[m++] = "<a class='delete group' title='Delete this group'>X</a>";
    markup[m++] = "</h3>";
    markup[m++] = "<ul class='roster'></ul>";
    markup[m++] = "<span class='empty message'>Nobody has been added yet</span>";
    markup[m++] = "</div>";
    
    var $group = $(markup.join(""));
    $groups.append($group);
    return $group;
  };
  
  var findGroup = function(index) {
    return (index === -1 ? $groups.find(".default.group.container") : findAllGroups().eq(index));
  };
  
  var findAllGroups = function() {
    return $groups.find(".group.container").not(".default");
  };
  
  var getIndex = function(name) {
    return $.inArray(name, groups);
  };
  
  var newGroup = function(name, index) {
    Util.addOption($recipientGroups, name, index);
    return buildGroupMarkup(name);
  };
  
  return {
    add: function(name) {
      if (DEFAULT_GROUP_NAME_REGEX.test(name)) {
        return {error:"You may not create a group called '" + DEFAULT_GROUP_NAME + "', this is reserved for use by the application."};
      }
      if (getIndex(name) > -1) {
        return {error:"There is already a group named '" + name + "', it would be very confusing to add one with the same name."};
      }
      groups.push(name);
      IO.writeObject(GROUP_KEY, groups);
      var $group = newGroup(name, groups.length - 1);
      $group.droppable(droppableOptions);
      $groups.isotope("appended", $group);
    },

    droppableOptions: droppableOptions,
    find: findGroup,
    findAll: findAllGroups,
    getAll: function() { return groups },
    getIndex: getIndex,
    
    init: function() {
      groups = IO.readObject(GROUP_KEY);
      if (!groups) {
        groups = [];
        IO.writeObject(GROUP_KEY, groups);
      }
      
      $recipientGroups = $("#recipientGroup");
      $groups = $("#main");
      
      for (var i = 0; i < groups.length; i++) {
        newGroup(groups[i], i);
      }
    },
    
    lookup: function(name) {
      return groups[getIndex(name)];
    },
    
    remove: function(index) {
      groups.splice(index, 1);
      IO.writeObject(GROUP_KEY, groups);
      
      $groups.isotope("remove", findGroup(index));
      Util.removeOption($recipientGroups, index + 1);
      
      $recipientGroups.find("option:gt(" + index + ")").each(function() {
        var $this = $(this);
        $this.val(+$this.val() - 1);
      });
    },
    
    update: function($group, name) {
      var index = findAllGroups().index($group);
      groups[index] = name;
      IO.writeObject(GROUP_KEY, groups);
      
      $group.children(".name").find(".view.text").text(name);
      $recipientGroups.find("option").eq(index + 1).text(name);
    }
  };
});
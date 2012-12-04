define( /* Util */
["jquery"], 
function($) {
  return {
    addOption: function($select, label, value) {
      $select.append($("<option value=\"" + value + "\">" + label + "</option>"));
    },
    
    draggableOptions: function() {
      return {
        appendTo: "body",
        containment: "document",
        cursor: "crosshair",
        helper: "clone",
        revert: "invalid",
        zIndex: 10
      }
    },
    
    removeOption: function($select, index) {
      $select.find("option").eq(index).remove();
    }
  };
});
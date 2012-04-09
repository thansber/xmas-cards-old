define( /* Util */
["jquery"], 
function($) {
  return {
    addOption: function($select, label, value) {
      $select.append($("<option value=\"" + value + "\">" + label + "</option>"));
    },
    
    removeOption: function($select, index) {
      $select.find("option").eq(index).remove();
    }
  };
});
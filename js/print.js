define( /* Print */
["jquery", "group", "recipient", "settings"],
function($, Group, Recipient, Settings) {

	 var $list = null;
	 var currentYear = null;
	
	 var drawGroup = function(name) {
  		var markup = [], m = 0;
  		var recipients = Recipient.getGroupMembersSorted(Group.getIndex(name));
  		
  		if (recipients.length === 0) {
  			 return;
  		}
  		
  		var roster = Recipient.getRoster();
  		
  		markup[m++] = '<h4>' + name + "</h4>";
  		markup[m++] = '<table>';
  		markup[m++] = '<thead><tr><th class="name">Name</th><th>Sent</th><th>Recv</th></tr></thead>';
  		markup[m++] = '<tbody>';
		
  		recipients.forEach(function(member, i) {
   			var yearData = Recipient.parseYearStatus(roster[member]["years"][currentYear]) || {};
   			markup[m++] = '<tr>';
   			markup[m++] = '<td class="name">' + member + "</td>";
   			markup[m++] = '<td class="sent">' + (!!yearData.sent ? 'X' : '') + '</td>';
   			markup[m++] = '<td class="recv">' + (!!yearData.received ? 'X' : '') + '</td>';
   			markup[m++] = '</tr>';
  		});
		
  		markup[m++] = '</tbody>';
  		markup[m++] = '</table>';
		
  		$list.append($(markup.join("")));
	 };
	
	 return {
	   init: function() {
    		$list = $("#list");
    		currentYear = Settings.getCurrentYear();
    },
    
    show: function() {
    		$list.empty();
    		
    		drawGroup("Unassigned");
    		
    		var groups = Group.getAll();
    		groups.forEach(function(group, i) {
    			drawGroup(group);
    		});
    		
    		window.print();
    }
  };    
});	
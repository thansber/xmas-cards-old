define( /* Migration */
["jquery", "dialogs", "group", "io", "recipient", "settings"], 
function($, Dialog, Group, IO, Recipient, Settings) {
  
  var OLD_GROUPS = "_GROUPS_";
  var OLD_CURRENT_YEAR = "_CURRENT_YEAR_";
  var OLD_PREV_YEARS = "_PREV_YEARS_";
  var OLD_OTHER_EVENTS = "_OTHER_EVENTS_";
  
  var $dialog = null;
    
  var hasOldData = function() {
    if (IO.read(OLD_GROUPS) || IO.read(OLD_CURRENT_YEAR) || IO.read(OLD_PREV_YEARS) || IO.read(OLD_OTHER_EVENTS)) {
      return true;
    }
    
    for (var i = 0; i < localStorage.length; i++) {
      if (isOldPerson(IO.readObject(localStorage.key(i)))) {
        return true;
      }
    }
    
    return false;
  };
  
  var isOldPerson = function(entry) {
    return entry && ((entry.years && $.isPlainObject(entry.years)) || entry.group);
  };
  
  var loadOldData = function() {
    var sampleData = '{"_GROUPS_":"Family|Bucknell|DASD Friends|Neighbors|High School Friends|Other Friends","_CURRENT_YEAR_":"2011","_PREV_YEARS_":"2010,2009","_OTHER_EVENTS_":"Todds 33rd bday","Trisha and Justin Brubaker":{"group":"Bucknell","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":false},"2009":{"sent":true,"recv":false},"2010":{"sent":true,"recv":false},"2011":{"sent":"checked"}},"entry":true,"name":"Trisha and Justin Brubaker"},"Jed Brody":{"group":"Family","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":false},"2009":{"sent":true,"recv":false},"2010":{"sent":true,"recv":false},"2011":{"sent":"checked"}},"entry":true,"name":"Jed Brody"},"Andrews Family":{"entry":true,"name":"Andrews Family","group":"High School Friends","years":{"2009":{},"2010":{},"2011":{"sent":"checked","recv":"checked"}}},"Uncle Bob and fam":{"group":"Family","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked"}},"entry":true,"name":"Uncle Bob and fam"},"Doran Family":{"entry":true,"name":"Doran Family","group":"High School Friends","years":{"2009":{"sent":"checked"},"2010":{"sent":"checked"},"2011":{"sent":"checked","recv":"checked"}}},"Grandma Connie":{"group":"Family","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Grandma Connie"},"Whitnah Family":{"entry":true,"name":"Whitnah Family","group":"DASD Friends","years":{"1229":{"sent":false,"recv":false},"2008":{"sent":false,"recv":false},"2009":{"sent":false,"recv":false},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}}},"Dunbar Family":{"group":"Neighbors","years":{"1229":{"sent":false,"recv":false},"2008":{"sent":true,"recv":false},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Dunbar Family"},"PV":{"group":"DASD Friends","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":false,"recv":false},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":false},"2011":{"sent":"checked"}},"entry":true,"name":"PV"},"Denny and Barbie":{"entry":true,"name":"Denny and Barbie","group":"Family","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":false,"recv":false},"2009":{"sent":false,"recv":false},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}}},"Julia and Juan Rosa":{"group":"High School Friends","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked"}},"entry":true,"name":"Julia and Juan Rosa"},"Darlington Family":{"entry":true,"name":"Darlington Family","group":"Bucknell","years":{"2009":{"sent":"checked","recv":"checked"},"2010":{"sent":"checked"},"2011":{"sent":"checked","recv":"checked"}}},"Brogan Family":{"group":"DASD Friends","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":false},"2009":{"sent":false,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked"}},"entry":true,"name":"Brogan Family"},"Susie and Sander":{"group":"Bucknell","years":{"1229":{"sent":false,"recv":false},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Susie and Sander"},"Kirk Family":{"group":"DASD Friends","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":false,"recv":false},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Kirk Family"},"Wil and Liz Briones":{"group":"Bucknell","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":false},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Wil and Liz Briones"},"Grandma Tee":{"group":"Family","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":false},"2009":{"sent":true,"recv":false},"2010":{"sent":true,"recv":false},"2011":{"sent":"checked"}},"entry":true,"name":"Grandma Tee"},"Cauffman Family":{"group":"Bucknell","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Cauffman Family"},"Grygielko Family":{"group":"Other Friends","years":{"1229":{"sent":false,"recv":false},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Grygielko Family"},"Crisi Family":{"group":"DASD Friends","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Crisi Family"},"Cari Kramer neighbor":{"entry":true,"name":"Cari Kramer neighbor","group":"Neighbors","years":{"2009":{"recv":"checked"},"2010":{"sent":"checked","recv":"checked"},"2011":{"sent":"checked","recv":"checked"}}},"Kurten Family":{"entry":true,"name":"Kurten Family","group":"Bucknell","years":{"2009":{"sent":"checked","recv":"checked"},"2010":{"sent":"checked","recv":"checked"},"2011":{"sent":"checked","recv":"checked"}}},"Mom and Dad":{"group":"Family","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Mom and Dad"},"Jenny and Eric":{"group":"Bucknell","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Jenny and Eric"},"Lisa Hansberger":{"group":"Family","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Lisa Hansberger"},"Grandma Ruthie":{"group":"Family","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Grandma Ruthie"},"Smitty Family":{"group":"Bucknell","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked"}},"entry":true,"name":"Smitty Family"},"Rivera Family":{"group":"Family","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Rivera Family"},"Rachel and Matt":{"entry":true,"name":"Rachel and Matt","group":"Family","years":{"2009":{},"2010":{},"2011":{"sent":"checked"}}},"Howard Family":{"group":"Neighbors","years":{"1229":{"sent":false,"recv":false},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Howard Family"},"Debbie and Jerry":{"group":"Family","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Debbie and Jerry"},"Allyson and Mark Patterson":{"entry":true,"name":"Allyson and Mark Patterson","group":"DASD Friends","years":{"2009":{"sent":"checked","recv":"checked"},"2010":{"sent":"checked","recv":"checked"},"2011":{"sent":"checked","recv":"checked"}}},"Schorle Family":{"entry":true,"name":"Schorle Family","group":"High School Friends","years":{"2009":{"sent":"checked"},"2010":{"sent":"checked"},"2011":{"sent":"checked","recv":"checked"}}},"Wagner Family":{"group":"Bucknell","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Wagner Family"},"Maddy Teacher":{"group":"Other Friends","years":{"1229":{"sent":false,"recv":false},"2008":{"sent":false,"recv":false},"2009":{"sent":false,"recv":false},"2010":{"sent":true,"recv":false},"2011":{}},"entry":true,"name":"Maddy Teacher"},"Dana Kolesar":{"group":"High School Friends","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Dana Kolesar"},"Kloubec Family Dan, Danielle, Katherine":{"entry":true,"name":"Kloubec Family Dan, Danielle, Katherine","group":"Family","years":{"2009":{},"2010":{},"2011":{"sent":"checked","recv":"checked"}}},"Laura and Scott Grodewald":{"group":"Bucknell","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Laura and Scott Grodewald"},"Gayl Family":{"entry":true,"name":"Gayl Family","group":"High School Friends","years":{"2009":{},"2010":{},"2011":{"sent":"checked","recv":"checked"}}},"Gotro Family":{"group":"DASD Friends","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Gotro Family"},"Ellis Family":{"group":"Bucknell","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Ellis Family"},"Richmond Family ":{"entry":true,"name":"Richmond Family ","group":"DASD Friends","years":{"2009":{"sent":"checked","recv":"checked"},"2010":{"sent":"checked","recv":"checked"},"2011":{"sent":"checked","recv":"checked"}}},"Showers Family":{"group":"Neighbors","years":{"1229":{"sent":false,"recv":false},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Showers Family"},"Brianna and Sasha Alexander":{"entry":true,"name":"Brianna and Sasha Alexander","group":"Family","years":{"2009":{},"2010":{},"2011":{"sent":"checked"}}},"Barbara and Frank Weber":{"group":"High School Friends","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Barbara and Frank Weber"},"Eckenroth Family":{"entry":true,"name":"Eckenroth Family","group":"Bucknell","years":{"2009":{"sent":"checked","recv":"checked"},"2010":{"sent":"checked","recv":"checked"},"2011":{"sent":"checked","recv":"checked"}}},"Mom-Mom":{"group":"Family","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Mom-Mom"},"Cole Family":{"group":"Bucknell","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Cole Family"},"LE":{"group":"DASD Friends","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":false,"recv":false},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":false},"2011":{"sent":"checked"}},"entry":true,"name":"LE"},"Julie Valenti":{"group":"Family","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Julie Valenti"},"Jamie and Kelly Graham":{"group":"Bucknell","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked"}},"entry":true,"name":"Jamie and Kelly Graham"},"extra for us":{"group":"Other Friends","years":{"1229":{"sent":false,"recv":false},"2008":{"sent":false,"recv":false},"2009":{"sent":true,"recv":false},"2010":{"sent":true,"recv":false},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"extra for us"},"Jared and Jessica Pray":{"group":"Bucknell","years":{"1229":{"sent":true,"recv":true},"2008":{"sent":true,"recv":true},"2009":{"sent":true,"recv":true},"2010":{"sent":true,"recv":true},"2011":{"sent":"checked","recv":"checked"}},"entry":true,"name":"Jared and Jessica Pray"}}';
    var json = JSON.parse(sampleData);
    for (var key in json) {
      IO.writeObject(key, json[key]);
    }  
  };
  
  var migrateGroups = function() {
    var oldGroups = IO.read(OLD_GROUPS);
    if (!oldGroups) {
      return;
    }
    
    var oldGroupArray = oldGroups.replace(/\"/g, "").split("|");
    for (var i = 0; i < oldGroupArray.length; i++) {
      console.log("migrating group " + oldGroupArray[i]);
      Group.add(oldGroupArray[i]);
    }
    
    localStorage.removeItem(OLD_GROUPS);
  };
  
  var migrateRoster = function() {
    var currentYear = Settings.getCurrentYear();
    var addOptions = {save:false, rebuild:false, recalculate:false};
    
    for (var i = localStorage.length - 1; i >= 0; i--) {
      var name = localStorage.key(i);
      if (name === OLD_PREV_YEARS) {
    	  continue;
      }
      var entry = IO.readObject(name);
      if (isOldPerson(entry)) {
        var groupIndex = Group.getIndex(entry.group);
        console.log("migrating " + name + " to group " + entry.group + ", group index " + groupIndex);
        Recipient.add(name, groupIndex, addOptions);
        
        for (var y = 0; y < 3; y++) {
          var year = +currentYear - y;
          if (entry.years[year]) {
            Recipient.updateYear(name, year, "sent", !!entry.years[year].sent);
            Recipient.updateYear(name, year, "received", !!entry.years[year].recv);
          }
        }
        
        localStorage.removeItem(name);
      } 
    }
    
    Recipient.saveRoster();
  }
  
  var removeOldUnusedEntries = function() {
    localStorage.removeItem(OLD_CURRENT_YEAR);
    localStorage.removeItem(OLD_PREV_YEARS);
    localStorage.removeItem(OLD_OTHER_EVENTS);
  };
  
  return {
    
    init: function() {
      $dialog = $("#dialogs .migrate.dialog");
      loadOldData(); // TODO: remove this
      
      $dialog.on("migration.start", function() {
        setTimeout(function() {
          migrateGroups();
          migrateRoster();
          removeOldUnusedEntries();
          $dialog.find(".loader").hide();
          $dialog.find(".complete").addClass("displayed");
        }, 1000);
      });
      
      if (hasOldData()) {
        Dialog.show("migrate");
      }
    }
  };
});
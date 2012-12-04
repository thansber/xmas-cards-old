require(
["jquery", "dialogs", "group", "handlers", "io", "message", "migration", "recipient", "settings", "util",
 "lib/jquery-ui-1.8.18.custom.min", "lib/jquery.isotope"], 
function($, Dialog, Group, Handlers, IO, Message, Migration, Recipient, Settings, Util) {
  $(document).ready(function() {
    IO.init();
    Message.init();
    Handlers.init();

    Dialog.init();
    Group.init();
    Recipient.init();
    
    $("#quickbar").toggleClass("displayed", Settings.isQuickbarDisplayed());
    
    $("#main").isotope({
      itemSelector: ".group.container",
      transformsEnabled: false
    });

    //Migration.init();

    $("#main .roster .entry .name .text").draggable(Util.draggableOptions());
    $("#main .group.container").droppable(Group.droppableOptions);
  });
});
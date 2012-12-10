require(
["jquery", "dialogs", "group", "handlers", "io", "message", "print", "recipient", "settings", "util",
 "lib/jquery-ui-1.8.18.custom.min", "lib/jquery.isotope"], 
function($, Dialog, Group, Handlers, IO, Message, Print, Recipient, Settings, Util) {
  $(document).ready(function() {
    IO.init();
    Message.init();
    Handlers.init();

    Dialog.init();
    Group.init();
    Recipient.init();
    Print.init();
    
    $("#quickbar").toggleClass("displayed", Settings.isQuickbarDisplayed());
    Settings.updateQuickbarArrowLabel();
    
    $("#main").isotope({
      itemSelector: ".group.container",
      transformsEnabled: false
    });

    $("#main .roster .entry .name .text").draggable(Util.draggableOptions());
    $("#main .group.container").droppable(Group.droppableOptions);
  });
});
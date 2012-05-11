require(
["jquery", "dialogs", "group", "handlers", "io", "message", "migration", "recipient", "settings", 
 "lib/jquery-ui-1.8.18.custom.min", "lib/jquery.isotope"], 
function($, Dialog, Group, Handlers, IO, Message, Migration, Recipient, Settings) {
  $(document).ready(function() {
    console.log("starting xmas app");
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

    Migration.init();

    $("#main .roster .entry .name .text").draggable({
      appendTo: "body",
      containment: "document",
      cursor: "crosshair",
      helper: "clone",
      revert: "invalid",
      zIndex: 10
    });
    
    
    $("#main .group.container").droppable(Group.droppableOptions);
  });
});
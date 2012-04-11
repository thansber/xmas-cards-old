require(
["jquery", "dialogs", "group", "handlers", "io", "message", "recipient", "settings", 
 "lib/jquery-ui-1.8.18.custom.min", "lib/jquery.isotope"], 
function($, Dialog, Group, Handlers, IO, Message, Recipient, Settings) {
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
require(
["jquery", "dialogs", "group", "handlers", "io", "message", "recipient", "settings", "lib/jquery.isotope"], 
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
    });
    
    
  });
});
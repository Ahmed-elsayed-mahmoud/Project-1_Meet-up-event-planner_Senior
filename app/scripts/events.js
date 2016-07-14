(function() {

    'use strict'

    var eventDiv = document.querySelector('#event');
    var linkCreate = document.querySelector('#linkCreate');
    var linkEvents = document.querySelector('#linkEvents');
    var loading = document.querySelector('#loading');

    var emailIn = window.location.search;
    if (emailIn.substring(0, 1) == '?') {
        emailIn = emailIn.substring(1);
    }
    linkCreate.setAttribute("href", "create_event.html?" + emailIn);
    linkEvents.setAttribute("href", "events.html?" + emailIn);


    var HTMLEvent =
        '<div class="list-group" style="width:70%;">' +
        '<div class="page-wraper list-group-item active">' +
        '    <h3 class="list-group-item-heading"><font color="black">%eventName%</font></h3>' +
        '    <h4 class="list-group-item-heading">Type</h4>' +
        '    <p class="list-group-item-text">%eventType%</p>' +
        '    <h4 class="list-group-item-heading">Host</h4>' +
        '    <p class="list-group-item-text">%eventHost%</p>' +
        '    <h4 class="list-group-item-heading">Start Date/Time</h4>' +
        '    <p class="list-group-item-text">%eventStart%</p>' +
        '    <h4 class="list-group-item-heading">End Date/Time</h4>' +
        '    <p class="list-group-item-text">%eventEnd%</p>' +
        '    <h4 class="list-group-item-heading">Attendee</h4>' +
        '    <p class="list-group-item-text">%eventGuests%</p>' +
        '    <h4 class="list-group-item-heading">Location</h4>' +
        '    <p class="list-group-item-text">%eventLocation%</p>' +
        '    <h4 class="list-group-item-heading">Message</h4>' +
        '    <p class="list-group-item-text">%eventMessage%</p>' +
        '</div>' +
        '</div>';

    var eventSnap = [];
    var innerHTM = '';
    var firebaseObj = new Firebase('https://event-manager-app.firebaseio.com/Events');
    firebaseObj.orderByChild("n").on("child_added", function(snapshot) {
        if (snapshot.val().emailID == emailIn) {
            var message = snapshot.val().message;
            var myEvent = HTMLEvent.replace('%eventName%', snapshot.val().name).replace('%eventType%', snapshot.val().type).replace('%eventHost%', snapshot.val().host).replace('%eventStart%', snapshot.val().startdatetime).replace('%eventEnd%', snapshot.val().enddatetime).replace('%eventGuests%', snapshot.val().guests).replace('%eventLocation%', snapshot.val().location).replace('%eventMessage%', message);
            innerHTM += myEvent;
            eventDiv.innerHTML = innerHTM;
            if (innerHTM.length == 0) {
                loading.innerHTML = "No Events created yet.";
            }
        }
    });
    if (emailIn.length == 0) {
        loading.innerHTML = "You must Login or Rgister first."
    }


}());
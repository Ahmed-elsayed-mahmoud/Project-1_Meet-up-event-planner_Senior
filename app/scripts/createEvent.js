(function() {

    'use strict'

    let eventNameInput = document.querySelector('input[name="eventName"]');
    let eventTypeInput = document.querySelector('input[name="eventType"]');
    let eventHostInput = document.querySelector('input[name="eventHost"]');
    let eventDateStartInput = document.querySelector('input[name="eventDateStart"]');
    let eventDateEndInput = document.querySelector('input[name="eventDateEnd"]');
    let eventLocationInput = document.querySelector('input[name="eventLocation"]');
    let eventGuestsText = document.querySelector('textarea[name="eventGuests"]');
    let eventMessageText = document.querySelector('textarea[name="eventMessage"]');
    let submitBtn = document.querySelector('button[type="submit"]');
    let validationMessage = document.querySelector('#message');
    var linkCreate = document.querySelector('#linkCreate');
    var linkEvents = document.querySelector('#linkEvents');

    var emailIn = window.location.search;
    if (emailIn.substring(0, 1) == '?') {
        emailIn = emailIn.substring(1);
    }
    linkCreate.setAttribute("href", "create_event.html?" + emailIn);
    linkEvents.setAttribute("href", "events.html?" + emailIn);
    class IssueTracker {
        constructor() {
            this.issues = [];
        }

        addIssue(issue) {
            this.issues.push(issue);
        }

        getIssues() {
            let message = '';
            switch (this.issues.length) {
                case 0:
                    break;
                case 1:
                    message = 'Please correct the following issue:\n' + this.issues[0];
                    break;
                default:
                    message = 'Please correct the following issues:\n' + this.issues.join('\n');
                    break;
            }
            return message;
        }

    }

    var locationInput = document.getElementById('eventLocation');
    var autocomplete = new google.maps.places.Autocomplete(locationInput);

    autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();

    });

    function checkRequiredFields(issuesTrackerObj) {
        if (eventNameInput.value.length == 0) {
            issuesTrackerObj.addIssue('Event Name is required.');
        }
        if (eventTypeInput.value.length == 0) {
            issuesTrackerObj.addIssue('Event Type is required.');
        }
        if (eventHostInput.value.length == 0) {
            issuesTrackerObj.addIssue('Event Host is required.');
        }
        if (eventLocationInput.value.length == 0) {
            issuesTrackerObj.addIssue('Event Location is required.');
        }
        if (eventGuestsText.value.length == 0) {
            issuesTrackerObj.addIssue('Event guests required at least one.');
        }
        if (eventDateEndInput.value.length == 0) {
            issuesTrackerObj.addIssue('Event End Date/Time is required.');
        }
        if (eventDateStartInput.value.length == 0) {
            issuesTrackerObj.addIssue('Event Start Date/Time is required.');
        }

    }

    function validDate(date) {
        if (date !== "Invalid Date" && !isNaN(date)) {
            return true;
        }
        return false;
    }

    function checkDate(issuesTrackerObj) {
        var curDate = new Date();
        var startDate = new Date(eventDateStartInput.value);
        var endDate = new Date(eventDateEndInput.value);

        if (validDate(startDate) && validDate(endDate)) {

            if (startDate > endDate) {
                issuesTrackerObj.addIssue('End Date should be greater than start date');
            }
            if (startDate < curDate) {
                issuesTrackerObj.addIssue('Start date should not be before today.');
            }
            if (endDate < curDate) {
                issuesTrackerObj.addIssue('End date should not be before today.');
            }
        }
    }
    submitBtn.onclick = function(event) {
        event.preventDefault();

        var guests = eventGuestsText.value.split('\n');
        var message;
        if (eventMessageText.value.length == 0) {
            message = "-";
        }

        let issuesTrackerObj = new IssueTracker();
        checkRequiredFields(issuesTrackerObj);
        checkDate(issuesTrackerObj);

        if (emailIn.length == 0) {
            issuesTrackerObj.addIssue('You must sign in first.');
        }

        let inputIssues = issuesTrackerObj.getIssues();

        if (inputIssues.length === 0 && emailIn.length != 0) {
            validationMessage.innerHTML = '';
            var firebaseObj = new Firebase('https://event-manager-app.firebaseio.com/Events');

            firebaseObj.push({
                name: eventNameInput.value,
                type: eventTypeInput.value,
                host: eventHostInput.value,
                startdatetime: eventDateStartInput.value.toString(),
                enddatetime: eventDateEndInput.value.toString(),
                guests: guests,
                location: eventLocationInput.value,
                message: message,
                emailID: emailIn,
                '.priority': emailIn
            }, function(error, authData) {
                if (error) {
                    validationMessage.innerHTML = error;
                } else {
                    window.location.href = 'events.html?' + emailIn;
                }
            });
        } else {
            validationMessage.innerHTML = inputIssues.replace(/(\r\n|\n|\r)/gm, "<br>&nbsp;&#9888; &nbsp;");
        }
    };

    function chechDateTime(dig) {
        let issuesTrackerObj = new IssueTracker();

        var startDate = new Date(eventDateStartInput.value);
        var endDate = new Date(eventDateEndInput.value);

        if (!validDate(startDate) && dig == 1) {
            issuesTrackerObj.addIssue('Start Date is not valid.');
        }
        if (!validDate(endDate) && dig == 2) {
            issuesTrackerObj.addIssue('End Date is not valid.');
        }

        let inputIssues = issuesTrackerObj.getIssues();


        if (inputIssues.length !== 0) {
            validationMessage.innerHTML = inputIssues.replace(/(\r\n|\n|\r)/gm, "<br>&nbsp;&#9888; &nbsp;");;
        } else {
            validationMessage.innerHTML = '';
        }

    }
    eventDateStartInput.onblur = function() {
        chechDateTime(1);
    };
    eventDateEndInput.onblur = function() {
        chechDateTime(2);
    };

}());
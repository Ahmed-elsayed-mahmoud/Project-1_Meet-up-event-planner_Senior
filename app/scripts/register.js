(function() {
    'use strict';

    var firebaseObj = new Firebase('https://meet-up-event-planner.firebaseio.com');

    let userNameInput = document.querySelector('input[name="name"]');
    let emailInput = document.querySelector('input[name="email"]');
    let passwordInput = document.querySelector('input[name="password"]');
    let submitBtn = document.querySelector('input[type="submit"]');
    let telInput = document.querySelector('input[name="mobNum"]');
    let validationMessage = document.querySelector('#message');

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

    function checkPassword(issuesTrackerObj) {
        let passwordVal = passwordInput.value;

        if (passwordVal.length < 8) {
            issuesTrackerObj.addIssue('Password is fewer than 8 characters.');
        } else if (passwordVal.length > 20) {
            issuesTrackerObj.addIssue('Password is greater than 20 characters.');
        }

        if (!passwordVal.match(/[\!\@\#\$\%\^\&\*]/g)) {
            issuesTrackerObj.addIssue('missing a symbol (!, @, #, $, %, ^, &, *) in your password.');
        }

        if (!passwordVal.match(/\d/g)) {
            issuesTrackerObj.addIssue('missing a number in your password.');
        }

        if (!passwordVal.match(/[a-z]/g)) {
            issuesTrackerObj.addIssue('missing a lowercase letter in your password.');
        }

        if (!passwordVal.match(/[A-Z]/g)) {
            issuesTrackerObj.addIssue('missing an uppercase letter in your password.');
        }

        let illegalCharacterGroup = passwordVal.match(/[^A-z0-9\!\@\#\$\%\^\&\*]/g);
        if (illegalCharacterGroup) {
            illegalCharacterGroup.forEach(function(illegalChar) {
                issuesTrackerObj.addIssue('Password includes illegal character: ' + illegalChar);
            });
        }

    }

    function checkMobNum(issuesTrackerObj) {
        let telNum = telInput.value;
        if (!telNum.match(/^\d{11}$/g)) {
            issuesTrackerObj.addIssue('Enter a valid Mobile Number.');
        }
    }

    function checkEmail(issuesTrackerObj) {
        if (!emailInput.value.match(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i)) {
            issuesTrackerObj.addIssue('Enter a vaild e-mail.');
        }

    }

    function validate() {
        let issuesTrackerObj = new IssueTracker();
        if (passwordInput.value.length > 0) {
            checkPassword(issuesTrackerObj);
        }
        if (telInput.value.length > 0) {
            checkMobNum(issuesTrackerObj);
        }
        if (emailInput.value.length > 0) {
            checkEmail(issuesTrackerObj);
        }
        let inputIssues = issuesTrackerObj.getIssues();

        passwordInput.setCustomValidity(inputIssues);

        if (inputIssues.length !== 0) {
            validationMessage.innerHTML = inputIssues.replace(/(\r\n|\n|\r)/gm, "<br>&nbsp;&#9888; &nbsp;");
        } else {
            validationMessage.innerHTML = '';
        }
    }

    function checkRequiredFields(issuesTrackerObj) {
        if (userNameInput.value.length == 0) {
            issuesTrackerObj.addIssue('User Name is required.');
        }
        if (emailInput.value.length == 0) {
            issuesTrackerObj.addIssue('Email is required.');
        }
        if (passwordInput.value.length == 0) {
            issuesTrackerObj.addIssue('Password is required.');
        }

    }
    submitBtn.onclick = function(event) {
        event.preventDefault();

        let issuesTrackerObj = new IssueTracker();
        checkRequiredFields(issuesTrackerObj);
        if (passwordInput.value.length !== 0) {
            checkPassword(issuesTrackerObj);
        }
        if (telInput.value.length !== 0) {
            checkMobNum(issuesTrackerObj);
        }
        if (emailInput.value.length !== 0) {

        }
        let inputIssues = issuesTrackerObj.getIssues();


        /*
        Let input.setCustomValidity() do its magic :)
         */
        passwordInput.setCustomValidity(inputIssues);

        if (inputIssues.length === 0) {
            firebaseObj.createUser({
                email: emailInput.value,
                password: passwordInput.value
            }, function(error, userData) {
                if (error) {
                    validationMessage.innerHTML = error;
                    console.log('Error creating user:', error);
                } else {
                    window.setTimeout(function() {
                        window.location = 'create_event.html?' + emailInput.value;
                    }, 2000);
                }
            });
        } else {
            validationMessage.innerHTML = inputIssues.replace(/(\r\n|\n|\r)/gm, "<br>&nbsp;&#9888; &nbsp;");
        }
    };


    passwordInput.onblur = function() {
        validate();
    };
    telInput.onblur = function() {
        validate();
    };
    emailInput.onblur = function() {
        validate();
    };

}());
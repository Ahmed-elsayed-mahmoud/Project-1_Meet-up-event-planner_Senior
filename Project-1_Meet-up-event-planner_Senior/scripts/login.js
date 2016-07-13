(function() {
    'use strict';

    let emailInput = document.querySelector('input[type="email"]');
    let passwordInput = document.querySelector('input[type="password"]');
    let submitBtn = document.querySelector('input[type="submit"]');
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

    function checkRequiredFields(issuesTrackerObj) {
        if (emailInput.value.length == 0) {
            issuesTrackerObj.addIssue('Email is required.');
        }
        if (passwordInput.value.length == 0) {
            issuesTrackerObj.addIssue('Password is required.');
        }

    }

    function checkEmail(issuesTrackerObj) {
        if (!emailInput.value.match(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i)) {
            issuesTrackerObj.addIssue('Enter a vaild e-mail.');
        }

    }

    function checkPassword(issuesTrackerObj) {
        let passwordVal = passwordInput.value;

        if (passwordVal.length < 8 | passwordVal.length > 20 || !passwordVal.match(/[\!\@\#\$\%\^\&\*]/g) || !passwordVal.match(/\d/g) || !passwordVal.match(/[a-z]/g) || !passwordVal.match(/[A-Z]/g)) {
            issuesTrackerObj.addIssue('Wrong Password');
        }

    }

    function validate() {
        let issuesTrackerObj = new IssueTracker();
        if (passwordInput.value.length > 0) {
            checkPassword(issuesTrackerObj);
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
    submitBtn.onclick = function() {
        event.preventDefault();

        let issuesTrackerObj = new IssueTracker();
        checkRequiredFields(issuesTrackerObj);
        if (passwordInput.value.length !== 0) {
            checkPassword(issuesTrackerObj);
        }
        if (emailInput.value.length !== 0) {
            checkEmail(issuesTrackerObj);
        }

        let inputIssues = issuesTrackerObj.getIssues();

        passwordInput.setCustomValidity(inputIssues);

        if (inputIssues.length === 0) {
            var firebase = new Firebase('https://meet-up-event-planner.firebaseio.com');
            firebase.authWithPassword({
                email: emailInput.value,
                password: passwordInput.value
            }, function(error, authData) {
                if (error) {
                    validationMessage.innerHTML = error;
                    console.log('Login Failed!', error);
                } else {
                    console.log('Authenticated successfully with payload:', authData);
                    window.location.href = 'create_event.html?' + emailInput.value;
                }
            });
        } else {
            validationMessage.innerHTML = inputIssues.replace(/(\r\n|\n|\r)/gm, "<br>&nbsp;&#9888; &nbsp;");
        }
    };

    passwordInput.onblur = function() {
        validate();
    };
    emailInput.onblur = function() {
        validate();
    };
}());
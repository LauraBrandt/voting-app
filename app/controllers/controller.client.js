'use strict';

(function () {
    var apiUrl = window.location.origin + '/api/';

    /********* Create Poll page *********/
    var newOptionButton = document.querySelector('.addOption');
    var answersForm = document.querySelector('.answersForm');

    if (newOptionButton) {
        newOptionButton.addEventListener('click', function () {
            var newOption = document.createElement("input");
            newOption.classList.add("form-control");
            newOption.classList.add("answers");
            newOption.setAttribute("type", "text");
            newOption.setAttribute("name", "answers");
            answersForm.appendChild(newOption);
            newOption.focus();
        }, false);
    }

    /********* View Poll page *********/

    var newUserOptionButton = document.querySelector('.addUserOption');

    if (newUserOptionButton) {
        newUserOptionButton.addEventListener('click', function () {
            /*
                Replaces li with "Add new option" button with the following:

                li.list-group-item.newAnswer.radio
                    label
                        input(type='radio' name='answer' checked='checked')
                        input.radioText(type='text')
            */
            var parent = document.querySelector('.newAnswer');
            var oldElem = newUserOptionButton;

            var newElem = document.createElement("label");

            var newElemRadio = document.createElement("input");
            newElemRadio.setAttribute("type", "radio");
            newElemRadio.setAttribute("name", "answer");
            newElemRadio.setAttribute("checked", "checked");

            var newElemInput = document.createElement("input");
            newElemInput.setAttribute("type", "text");
            newElemInput.classList.add("radioText");

            newElem.appendChild(newElemRadio);
            newElem.appendChild(newElemInput);

            oldElem.parentNode.replaceChild(newElem, oldElem);
            parent.classList.add("radio");
            newElemInput.focus();

            /* On blur, if text was entered,
                    adds value attribute to the new radio button equal to the value in the new text box
                or if blank,
                    reverts to "Add new option" button
            */
            var newOptionText = document.querySelector('.radioText');
            newOptionText.addEventListener("blur", function() {
                if (newOptionText.value) {
                    newElemRadio.setAttribute("value", newOptionText.value);
                }
                else {
                    newElem.parentNode.replaceChild(oldElem, newElem);
                    parent.classList.remove("radio");
                }
            });
        }, false);
    }

    /********* My Polls page *********/

    var deleteButtons = document.querySelectorAll(".delete");

    if (deleteButtons) {
        for (var i=0;i<deleteButtons.length;i++){
            deleteButtons[i].addEventListener("click", function() {
                ajaxFunctions.ajaxRequest('GET', apiUrl+this.id, function (data) {
                    var poll = JSON.parse(data);
                    var message = "Are you sure you want to delete the poll '" + poll.question + "'?";
                    if (confirm(message) == true) {
                        ajaxFunctions.ajaxRequest('DELETE', apiUrl+poll._id, function(data) {
                            window.location=data;
                        });
                    }

                });
            });
        }
    }

    /********* pagination (various pages) *********/
    var pageInfo = document.querySelector(".page-info");

    if (pageInfo) {
        var pageNum = parseInt(pageInfo.id, 10) + 1;

        var activeElement = document.querySelector("#p"+pageNum);
        if (activeElement) {
          activeElement.classList.add("active");
        }

        var prevButton = document.querySelector(".prev");
        var nextButton = document.querySelector(".next");
        var numPages = parseInt(document.querySelector(".page-info").getAttribute("name"), 10);
        if (pageNum === 1 && prevButton) {
            prevButton.classList.add("disabled");
        }
        if (pageNum === numPages && nextButton) {
            nextButton.classList.add("disabled");
        }
    }


})();

/********* View Poll page *********/

function beforeVoteSubmit() {
    // Blur new answer textbox, so if empty won't be included in options,
    // and if filled, value of textbox is given to its radio button
    var radioText = document.querySelector('.radioText');
    if (radioText) {
        radioText.blur();
    }
    // Make sure current user/ip hasn't already voted on the poll
    if (document.querySelector('.voteButton').classList.contains('disabled')) {
        alert("You can only vote once on a poll.");
        return false;
    }
    // Make sure a radio button is selected before submitting
    var answerRadios = document.getElementsByName('answer');
    var isChecked = false;
    for ( var i = 0; i < answerRadios.length; i++) {
        if(answerRadios[i].checked) {
            isChecked = true;
            break;
        }
    }
    if(!isChecked) {
        alert("Please choose an option.");
        return false;
    }

    return true;
}

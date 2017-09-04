'use strict';

(function () {
    //console.log('in the controller!!');
    var apiUrl = window.location.origin + '/api/';
    
    var newOptionButton = document.querySelector('.addOption');
    var answersForm = document.querySelector('.answersForm');
    
    if (newOptionButton) {
        newOptionButton.addEventListener('click', function () {
            //console.log('newOptionButton clicked');
            var newOption = document.createElement("input");
            newOption.classList.add("form-control");
            newOption.classList.add("answers");
            newOption.setAttribute("type", "text");
            newOption.setAttribute("name", "answers");
            answersForm.appendChild(newOption);
        }, false);
    }
    
    var newUserOptionButton = document.querySelector('.addUserOption');
    
    if (newUserOptionButton) {
        newUserOptionButton.addEventListener('click', function () {
            //console.log('newUserOptionButton clicked');
            /*
                Replaces li with "Add new option" button with the following:
                
                li.list-group-item.newAnswer.radio
                    label
                        input(type='radio' name='answer' checked='checked')
                        input(type='text')
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
            
            /* Adds value attribute to the new radio button,
                equal to the value in the new text box*/
            var newOptionText = document.querySelector('.radioText');
            newOptionText.addEventListener("change", function() {
                newElemRadio.setAttribute("value", newOptionText.value);
            });
        }, false);
    }
    
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
    
})();

'use strict';

(function () {
    
    var newOptionButton = document.querySelector('.addOption');
    var answersForm = document.querySelector('.answersForm');
    
    newOptionButton.addEventListener('click', function () {
        var newOption = document.createElement("input");
        newOption.classList.add("form-control");
        newOption.classList.add("answers");
        newOption.setAttribute("type", "text");
        newOption.setAttribute("name", "answers");
        answersForm.appendChild(newOption);
    }, false);
    
})();

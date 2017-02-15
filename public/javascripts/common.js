/**
 * Created by leigh on 17/2/15.
 */
function respError(message){
    document.getElementById('container-body-id').innerHTML = message
}

var app = angular.module('cityEditor', []);

function setResponse(response) {
    var div = angular.element(document.getElementById('container-body-id'));
    div.html(response)
    return div
}
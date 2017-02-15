app.controller('blockCtrl', function($scope, $http){
    $scope.getCityBlocks = function(params) {
        $http({
            url:    'blocks/index',
            method: 'GET',
            params:   params,
        }).success(function(response){
            document.getElementById('container-body-id').innerHTML = response
        }).error(respError)
    };
});

app.controller('navCtrl', function($scope, $http, $compile){
    $scope.getCities = function (params) {
        $http({
            url:    'cities',
            method: 'GET',
            params:   params,
        }).success(function(response){
            $compile(setResponse(response))($scope)
        }).error(respError)
    };

    $scope.getBlocks = function (params) {
        $http({
            url:    'blocks',
            method: 'GET',
            params:   params,
        }).success(function(response){
            alert(JSON.stringify(response))
            $compile(setResponse(response))($scope)
        }).error(respError)
    }
});
'use strict';


app.controller('searchBookCtrl', ['$scope','Inventory', function($scope, Inventory){
    $scope.books = [];

    $scope.getByName = function (str) {
        return Inventory.getByName(str);
    }
}]);
'use strict';

app.controller('showBookCtrl', function($scope, $stateParams,  Book){
    var bookId = $stateParams.bookId;
    Book.getBookById(bookId).then(function(data){
        $scope.book = data;
    }, function(err){
        $scope.error = err;
    });

});



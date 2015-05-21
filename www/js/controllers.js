'use strict';

angular.module('starter.controllers', [])
.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});


app.controller('searchBookCtrl', ['$scope','Inventory', function($scope, Inventory){
  $scope.books = [];
  // Inventory.getFirst(15).then(function(books){
  //   $scope.books = books;
  // });
  $scope.getByName = function (str) {
  	return Inventory.getByName(str);
  } 
}]);

app.controller('searchMemeberCtrl', ['$scope', 'Member', function($scope, Member){
  $scope.getMemberByPhone = function (number) {
    return Member.getMemberByPhone(number);
  };
}]);

// 还书控制器，传递函数findReturnBooksByMember来获取该会员需要还的书.
app.controller('returnBookCtrl', ['$scope', 'Books', function($scope, Books){
  $scope.books = [];
  $scope.findReturnBooksByMember = function (memberId) {
    return Books.getReturnBooksByMemberId(memberId);
  }
}]);


app.controller('borrowBookCtrl', ['$scope', 'Books', function($scope, Books){
  $scope.books = [];

}]);

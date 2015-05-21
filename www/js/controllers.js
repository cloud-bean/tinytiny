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

  $scope.getByName = function (str) {
  	return Inventory.getByName(str);
  } 
}]);

app.controller('searchMemeberCtrl', ['$scope', 'Member', 'Books', 'GENERAL_CONFIG', function($scope, Member, Books, GENERAL_CONFIG){
  $scope.getMemberByPhone = function (number) {
    return Member.getMemberByPhone(number);
  };

  $scope.checkedCount = 0;
  $scope.returnResultMessage = '';

  $scope.remove = function (index) {
    if($scope.records[index].isSelected)
      $scope.checkedCount--;
    $scope.records[index].isSelected = false;
  };

  $scope.add = function (index) {
    if(! $scope.records[index].isSelected)
      $scope.checkedCount++;
    $scope.records[index].isSelected = true;
  };

  $scope.clearData = function () {
    $scope.secretKey = '';
    $scope.checkedCount = 0;
    $scope.records = [];
    $scope.returnResultMessage = '';
  };

  $scope.returnSelectedBooks = function(){
    // todo: Book service to return the book that selected to return.
    // todo: change the url to show a success message and return to homepage.
    var count = $scope.checkedCount;
    var _records = $scope.records;

    // clear the input data.
    $scope.clearData();

    for(var i = 0; i < _records.length; i++){
        if (_records[i].isSelected) {
            var recordId =_records[i]['_id'];
            console.log('recordId: ' + recordId);
            Books.returnBook(recordId).then(function (data) {
                $scope.returnResultMessage +=  '归还成功!' + data.toString();
                //'<p><strong>'
                //    + records[i].inventory.inv_code
                //    + '</strong>'
                //    + records[i].inventory.name
                //    + '&nbsp;&nbsp;&nbsp;&nbsp;归还成功!</p>';

                if (--count === 0) {
                    // all done.
                    $scope.returnResultMessage += "全部归还成功！";
                }
            }, function (err) {
                $scope.returnResultMessage +=   '归还失败!' + err.toString();
                //console.log('err to return:' + recordId);
                //+ records[i].inventory.inv_code
                //+ '</strong>'
                //+ records[i].inventory.name
                //+ '&nbsp;&nbsp;&nbsp;&nbsp;归还失败!</p>';
            });
        }
    }
  };

  $scope.isValid = function (key) {
    return key === GENERAL_CONFIG.secretKey ? true : false;
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

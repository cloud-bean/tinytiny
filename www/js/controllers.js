'use strict';


app.controller('searchBookCtrl', ['$scope','Inventory', function($scope, Inventory){
    $scope.books = [];

    $scope.getByName = function (str) {
        return Inventory.getByName(str);
    }
}]);

app.controller('searchMemeberCtrl',['$scope', '$timeout', '$state','$ionicPopup', 'Member', 'Books', 'GENERAL_CONFIG', function($scope, $timeout, $state, $ionicPopup, Member, Books, GENERAL_CONFIG){

    $scope.getMemberByPhone = function (number) {
        return Member.getMemberByPhone(number);
    };

    $scope.checkedCount = 0;
    $scope.returnResultMessage = '';
    $scope.isAllSelected = false;

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

    $scope.toggleSelect = function () {
        $scope.isAllSelected = !$scope.isAllSelected;
        $scope.checkedCount = $scope.records.length;
        for(var index=0; index< $scope.checkedCount; index++){
            $scope.records[index].isSelected = $scope.isAllSelected;
        }
        console.log('selectAll to ' +  $scope.isAllSelected.toString());
    };

    $scope.clearData = function () {
        console.log('clearData...');
        $scope.secretKey = '';
        $scope.checkedCount = 0;
        $scope.returnResultMessage = '';
        $scope.member = null;
        $scope.records = null;
        $scope.filter = '';
    };

    $scope.alertAndJump = function(){
        // 1. 弹出提示框，
        // 2. 3s后跳转到首页。

        var alertPopup = $ionicPopup.alert({
            title: '还书操作结果',
            template: $scope.returnResultMessage
        });

        alertPopup.then(function (res) {
            $state.transitionTo('tab.search');
        })
    };

    $scope.returnSelectedBooks = function(){
        // todo: Book service to return the book that selected to return.
        // todo: change the url to show a success message and return to homepage.
        var count = $scope.checkedCount; // 共有基本要还。
        $scope.succCount = count;  // 检查成功执行还书操作的记录数
        var _records = $scope.records;

        // clear the input data.
        $scope.clearData();

        for(var i = 0; count && (i < _records.length); i++){
            if (_records[i].isSelected) {  // 判断是否是选中要归还的。
                var recordId =_records[i]['_id'];
                var recordBookName = _records[i].inventory.name;
                console.log('recordId: ' , recordId, 'recordName', recordBookName);
                Books.returnBook(recordId, recordBookName).then(function (data) { // data is the book name
                    $scope.returnResultMessage += data +  ' 归还成功!' ;
                    $scope.succCount--;
                    console.log('succCount:', $scope.succCount);
                }, function (err) {
                    $scope.returnResultMessage += err + ' 归还失败!' ; // error is the recoredID.
                }).then(function(){
                    console.log('returnResultMessage' + $scope.returnResultMessage);
                    if ($scope.succCount === 0){
                        $scope.alertAndJump();
                    }
                });
            }
        }
    };

    $scope.isValid = function (key) {
        return key === GENERAL_CONFIG.secretKey ? true : false;
    };
}]);



app.controller('rentBookCtrl', ['$scope', 'Books', function($scope, Books){
    $scope.books = [];
}]);


app.controller('helpCtrl', ['$scope',  function($scope){

}]);

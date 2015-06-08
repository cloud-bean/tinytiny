'use strict';

app.controller('returnBookCtrl',
    ['$scope', '$timeout', '$state', '$ionicPopup', 'Member', 'Book', 'GENERAL_CONFIG', '$ionicLoading', '$ionicScrollDelegate',
        function($scope, $timeout, $state, $ionicPopup, Member, Book, GENERAL_CONFIG, $ionicLoading, $ionicScrollDelegate){

    $scope.getMemberByPhone = function (number) {
        return Member.getMemberByPhone(number);
    };


    $scope.isSubmit = false;
    $scope.checkedCount = 0;
    $scope.resultMessage = '';
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
        $scope.checkedCount = $scope.isAllSelected ? $scope.records.length : 0;
        for(var index=0; index< $scope.records.length; index++){
            $scope.records[index].isSelected = $scope.isAllSelected;
        }
        console.log('selectAll to ' +  $scope.isAllSelected.toString());
    };

    $scope.clearData = function () {
        console.log('clearData...');
        $scope.secretKey = '';
        $scope.checkedCount = 0;
        $scope.resultMessage = '';
        $scope.member = {};
        $scope.records = [];
        $scope.filter = {
            value: ''
        };
        $scope.isAllSelected = false;

        $ionicScrollDelegate.scrollTop(); // 滚动到top
    };

    $scope.alertAndJump = function(message){
        $ionicLoading.hide();
        // 1. 弹出提示框，
        var alertPopup = $ionicPopup.alert({
            title: '还书操作结果',
            template: message
        });

        alertPopup.then(function (res) {
            $state.go('tab.search');
        })
    };

    $scope.returnSelectedBooks = function(){
        $scope.isSubmit = true;

        var count = $scope.checkedCount; // 共有几本要还。
        $scope.succCount = 0;  // 检查成功执行还书操作的记录数
        $scope.failCount = 0;
        var _records = $scope.records;

        $ionicLoading.show({
            template:"<spinner></spinner><br/>还书中..."
        });

        for(var i = 0; count && (i < _records.length); i++){
            if (_records[i].isSelected) {  // 判断是否是选中要归还的。
                var recordId =_records[i]['_id'];
                var recordBookName = _records[i].inventory.name;
                console.log('recordId: ' , recordId, 'recordName', recordBookName);
                Book.returnBook(recordId, recordBookName).then(function (data) { // data is the book name
                    $scope.resultMessage += '<i class="icon ion-ios-checkmark positive icon-large"></i>' + data +  ' 归还成功!<br/>' ;
                    $scope.checkedCount--;
                    $scope.succCount++;
                    console.log('succCount:', $scope.succCount);
                }, function (err) {
                    $scope.checkedCount--;
                    $scope.failCount++;
                    $scope.resultMessage += '<i class="icon ion-alert-circled assertive icon-large"></i>' + err + ' 归还失败!<br/>' ; // error is the recoredID.
                }).then(function(){
                    console.log('resultMessage' + $scope.resultMessage);
                    if ($scope.checkedCount === 0){
                        var message = $scope.resultMessage;
                        // clear the input data.
                        $scope.clearData();
                        $scope.alertAndJump(message);
                    }
                });
            }
        }
    };

    $scope.isValid = function (key) {
        return key === GENERAL_CONFIG.secretKey ? true : false;
    };
}]);


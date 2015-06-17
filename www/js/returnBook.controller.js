'use strict';

app.controller('returnBookCtrl',
  ['$scope', '$timeout', '$state', '$ionicPopup', 'Member', 'Book', 'GENERAL_CONFIG', '$ionicLoading', '$ionicScrollDelegate','$rootScope',
    function($scope, $timeout, $state, $ionicPopup, Member, Book, GENERAL_CONFIG, $ionicLoading, $ionicScrollDelegate,$rootScope){
      var getRecordsByMemberId = function (id) {
        // get the books
        Book.getReturnBooksByMemberId(id).then(function(results){
          console.log('loading return books ...');

          $scope.records = results;
          $scope.totalNumber = results.length;

          $ionicLoading.hide();
        }, function(err){
          showMsg('error', err);
          $ionicLoading.hide();
          console.log('err at get return books by member id: ' + err);
        });
      };
      var showMsg = function (type, msg) {
        if (type === 'error') {
          $scope.error = msg;
        } else if(type == 'warning'){
          $scope.warning = msg;
        } else {
          $scope.info = msg;
        }
      };

      var clearData = function () {
        console.log('clear Data...');
        $scope.secretKey = '';
        $scope.checkedCount = 0;
        $scope.resultMessage = '';
        $scope.error = '';
        $scope.warning = '';
        $scope.info = '';
        $scope.hasSubmit = false;
        $scope.submit_err = '';
        $scope.isAllSelected = false;
        $scope.member = null;
        $scope.records = null;
        $scope.search = {
          value: ''
        };

        $ionicScrollDelegate.scrollTop(); // 滚动到top
      };

      clearData();

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

      $scope.toggleSelectAll= function () {
        $scope.isAllSelected = !$scope.isAllSelected;
        $scope.checkedCount = $scope.isAllSelected ? $scope.records.length : 0;
        for(var index=0; index< $scope.records.length; index++){
          $scope.records[index].isSelected = $scope.isAllSelected;
        }
        console.log('selectAll to ' +  $scope.isAllSelected.toString());
      };
      
      $scope.toggleSelected = function(index){
        var oldSelectedStatus = $scope.records[index].isSelected;
        $scope.records[index].isSelected = !oldSelectedStatus;
        if (!oldSelectedStatus)
          $scope.checkedCount++;
        else
          $scope.checkedCount--;
      };

      $scope.searchMembers = function(){
        $scope.error = '';
        var searchStr = $scope.search.value;
        var IsNumeric = function(input)
        {
          return (input - 0) === input && (''+input).trim().length > 0;
        };

        if(searchStr.length != 11 && !IsNumeric(searchStr)){
          $scope.error = '手机号应为11位数字，请重试。';
          return;
        }

        $ionicLoading.show({
          noBackdrop: true,
          template: '<ion-spinner></ion-spinner><br/>查询手机号' + searchStr + '...'
        });

        Member.getMemberByPhone(searchStr).then(function (result) {
          console.log('loading Member...', result);

          $scope.member = result.member;
          // member's valid date
          $scope.member.end_time = result.end_time;

          console.log($scope.member);
          $ionicLoading.show({
            noBackdrop: true,
            template: '<ion-spinner></ion-spinner><br/>查询会员借书信息...'
          });
          getRecordsByMemberId(result.member['_id']);
        }, function (err) {
          $scope.error = err;
          $ionicLoading.hide();
        });
      };

      $scope.clearSearch = function() {
        clearData();
      };

      $scope.alertAndJump = function(message){
        $ionicLoading.hide();
        // 1. 弹出提示框，
        var alertPopup = $ionicPopup.alert({
          title: '还书操作结果',
          template: message
        });

        clearData();
        $rootScope.clearSearch();
        alertPopup.then(function (res) {
          $state.go('tab.search');
        })
      };

      $scope.returnSelectedBooks = function(){
        $scope.submit_err = '';

        if(!$scope.member){
          $scope.submit_err = '请输入手机号获取会员信息';
          return ;
        }

        if($scope.checkedCount === 0){
          $scope.submit_err = '至少选择一本书归还';
          return ;
        }

        if (!$scope.isValid($scope.secretKey)){
          $scope.submit_err = '口令错误，请重新输入';
          return ;
        }

        $scope.hasSubmit = true;

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


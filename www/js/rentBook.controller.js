'use strict';

app.controller('rentBookCtrl',
  ['$scope', '$ionicPopup', '$state','Book', 'Member', 'GENERAL_CONFIG', '$ionicLoading', '$ionicScrollDelegate','$rootScope',
    function($scope, $ionicPopup, $state, Book, Member, GENERAL_CONFIG, $ionicLoading, $ionicScrollDelegate,$rootScope){
      $scope.init = function(){
        $ionicScrollDelegate.scrollTop(); // 滚动到top
        $scope.isSubmit = false;
        $scope.books = [];
        $scope.member = {};
        $scope.member_error =  '' ;
        $scope.book_error =  '' ;
        $scope.resultMessage = '';
        $scope.checkedCount = 0;
        $scope.secretKey = '';  // important!!! whatever succ or err , it must be clear.
        $scope.searchedBook = {};
        $scope.search = {
          phone: '',
          invcode: ''
        };
      };

      $scope.init();

      $scope.clearSearchMember = function () {
        $scope.search.phone = '';
        $scope.member_error = '';
        $scope.member = null;
      };

      $scope.clearSearchBook = function () {
        $scope.search.invcode = '';
        $scope.book_error = '';
      };

      $scope.searchMembers = function(){
        var searchStr = $scope.search.phone;
        $scope.member_error =  '' ;
        $scope.member = null;
        var IsNumeric = function(input)
        {
          return (input - 0) === input && (''+input).trim().length > 0;
        };

        if(searchStr.length != 11 && !IsNumeric(searchStr)){
          $scope.member_error = '手机号应为11位数字，请重试。';
          return;
        }

        $ionicLoading.show({
          noBackdrop: true,
          template: '<ion-spinner></ion-spinner><br/>查询手机号' + searchStr + '...'
        });

        Member.getMemberByPhone(searchStr).then(function (result) {
          console.log('loading Member...', result);
          $scope.member = result.member;
          $scope.member.can_rent_count = result.member.max_book - result.rentCount;
          $scope.member.end_time = result.end_time;
          if(!$scope.member) {
            $scope.member_error = '没找到，请检查您输入的手机号是否是注册会员时使用的手机号，重试或者联系工作人员！';
          }
          $ionicLoading.hide();
        }, function (err) {
          $scope.member_error = err;
          $ionicLoading.hide();
        });
      };

      $scope.searchBook = function() {
        var searchStr = $scope.search.invcode;

        $scope.book_error = '';
        var IsNumeric = function(input)
        {
          return (input - 0) === input && (''+input).trim().length > 0;
        };

        if(searchStr.length != 12 && !IsNumeric(searchStr)){
          $scope.book_error = '绘本入库编码应为12位数字，请重试。';
          return;
        }

        $ionicLoading.show({
            noBackdrop: true,
            template: '<ion-spinner></ion-spinner><br/>添加绘本 ' + searchStr + '...'
          });

        Book.getBookByInvCode(searchStr).then(function (result) {
            var book = result;
            if (!book)
              $scope.book_error = '没有找到这个绘本，请核对入库编号并重试。';
            else
              $scope.addBook(book);

            $ionicLoading.hide();
          }, function(err){
            $scope.book_error = err;
            $ionicLoading.hide();
          });
      };

      $scope.getBookByInvCode = function (invCode){
        return Book.getBookByInvCode(invCode);
      };

      $scope.addBook = function(searchedBook){
        var _book =  searchedBook;
        var _hasIt = false;

        if(_book.isRent){
          //alert('这个绘本已经借出了');
          $ionicPopup.alert({
            title: '不好意思哈',
            template: '这个绘本已经借出了'
          });
        } else {
          for(var i=0; i<$scope.books.length; i++){
            if ($scope.books[i]['_id']=== _book['_id']){
              _hasIt = true;
            }
          }
          if(!_hasIt){
            _book.isSelected = true;
            $scope.books.push(_book);
            $scope.checkedCount++;
          }
        }

        // after check and add to books, clear it.
        $scope.searchedBook = {};
        $scope.book_filter = {
          value:''
        };
      };

      $scope.clearData = function(){
        $scope.init();
      };

      var canRent = function(){
        if (!$scope.member) return false;

        if($scope.member.locked){
          $scope.warnMessage = '你的账户目前已被锁定，请联系工作人员激活。';
          return false;
        }

        if(parseInt($scope.member.end_time) < parseInt(new Date().getTime())){
          $scope.warnMessage = '你的借书有效期已到。';
          return false;
        }

        if ($scope.member.can_rent_count < $scope.checkedCount){
          $scope.warnMessage = '你不能借这么多本书，请先还书或者少借几本书';
          return false;
        }

        if(!$scope.isValid($scope.secretKey)) {
          $scope.warnMessage = '口令错误，请重新输入';
          $scope.secretKey = '';
          return false;
        }

        $scope.warnMessage = '';
        return true;
      };
      $scope.toggleSelected = function(index){
        var oldSelectedStatus = $scope.books[index].isSelected;
        $scope.books[index].isSelected = !oldSelectedStatus;
        if (!oldSelectedStatus)
          $scope.checkedCount++;
        else
          $scope.checkedCount--;
      };

      $scope.alertAndJump = function (message){
        // 1. 弹出提示框，
        // 2. 点击确定返回首页 即搜索页
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: '借书操作结果',
          template: message
        });
        $rootScope.clearSearch();

        alertPopup.then(function (res) {
          $state.go('tab.search');
        })
      };

      $scope.rentBook = function (memberId){
        if (!canRent()) return;
        $scope.warnMessage = '';

        var count = $scope.checkedCount; // 几本书要借
        $scope.succCount = 0;  // 检查成功执行借书操作的记录数
        $scope.failCount = 0;
        var _books = $scope.books;

        $scope.isSubmit = true;

        $ionicLoading.show({
          template:"<spinner></spinner><br/>借书中..."
        });

        for(var i = 0; count && (i < _books.length); i++){
          if (_books[i].isSelected) {  // 判断是否是选中。
            var bookId =_books[i]['_id'];
            var bookName = _books[i].name;
            //var memberId = _member.id;
            console.log('memberId', memberId, 'bookId: ' , bookId, 'bookName', bookName);
            Book.rentBook(memberId, bookId, bookName).then(function (data) { // data is the book name
              $scope.resultMessage += '<i class="icon ion-ios-checkmark positive icon-large"></i>' + data +  ' 借阅成功!<br/>' ;
              $scope.succCount++;
              $scope.checkedCount --;
              console.log('succCount:', $scope.succCount);
            }, function (err) {
              $scope.checkedCount --;
              $scope.failCount++;
              $scope.resultMessage += '<i class="icon ion-alert-circled assertive icon-large"></i>' + err + ' 借阅失败!<br/>' ; // error is the recoredID.
            }).then(function(){
              console.log('resultMessage' + $scope.resultMessage);
              if ($scope.checkedCount === 0){
                // 完成任务之后清除数据并跳转。
                var message = $scope.resultMessage;
                $scope.clearData();
                $scope.alertAndJump(message);
              }
            });
          }
        }
      };

      $scope.isValid = function(key) {
        return key === GENERAL_CONFIG.secretKey ? true : false;
      };
    }]);

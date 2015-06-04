'use strict';

app.controller('rentBookCtrl',
    ['$scope', '$ionicPopup', '$state','Book', 'Member', 'GENERAL_CONFIG', '$ionicScrollDelegate',
    function($scope, $ionicPopup, $state, Book, Member, GENERAL_CONFIG, $ionicScrollDelegate){
    $scope.init = function(){
        $ionicScrollDelegate.scrollTop(); // 滚动到top
        $scope.books = [];
        $scope.member = {};
        $scope.resultMessage = '';
        $scope.checkedCount = 0;
        $scope.secretKey = '';  // important!!! whatever succ or err , it must be clear.
        $scope.searchedBook = {};
        $scope.book_filter = {
            value: ''
        };
        $scope.member_filter = {
            value: ''
        }
    };

    $scope.init();

    $scope.getMemberByPhone = function(number) {
        return Member.getMemberByPhone(number);
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

        var alertPopup = $ionicPopup.alert({
            title: '借书操作结果',
            template: message
        });

        alertPopup.then(function (res) {
            $state.go('tab.search');
        })
    };

    $scope.rentBook = function (memberId){
        // todo: Book service to rent the book that selected to rent.
        // todo: change the url to show a success message and return to homepage.
        var count = $scope.checkedCount; // 几本书要借
        $scope.succCount = 0;  // 检查成功执行借书操作的记录数
        $scope.failCount = 0;
        var _books = $scope.books;

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

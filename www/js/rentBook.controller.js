'use strict';

app.controller('rentBookCtrl', ['$scope', '$ionicPopup', '$state','Book', 'Member', 'GENERAL_CONFIG', function($scope, $ionicPopup, $state, Book, Member, GENERAL_CONFIG){
    $scope.init = function(){
        $scope.books = [];
        $scope.member = {};
        $scope.infoMsg='there is the rentBook ctrl.';
        $scope.resultMessage = '';
        $scope.checkedCount = 0;
        $scope.secretKey = '';
        $scope.searchedBook = {};
    };

    $scope.getMemberByPhone = function(number) {
        return Member.getMemberByPhone(number);
    };

    $scope.getBookByInvCode = function (invCode){
        return Book.getBookByInvCode(invCode);
    };

    $scope.addBook = function(searchedBook){
        console.log('$scope.searchedBook', $scope.searchedBook);
        //var _book =  $scope.searchedBook;
        console.log('searchedBook', searchedBook);
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

    };


    $scope.clearData = function(){
        $scope.init();
    };
    
    $scope.toggleSelected = function(index){
        $scope.books[index].isSelected = !$scope.books[index].isSelected;
    };

    $scope.alertAndJump = function (){
        // 1. 弹出提示框，
        // 2. 点击确定返回首页 即搜索页

        var alertPopup = $ionicPopup.alert({
            title: '借书操作结果',
            template: $scope.resultMessage
        });

        alertPopup.then(function (res) {
            $state.transitionTo('tab.search');
        })
    };

    $scope.rentBook = function (){
        // todo: Book service to rent the book that selected to rent.
        // todo: change the url to show a success message and return to homepage.
        var count = $scope.checkedCount; // 几本书要借
        $scope.succCount = count;  // 检查成功执行借书操作的记录数
        var _books = $scope.books;
        var _member = $scope.member;
        // clear the input data.
        $scope.clearData();

        for(var i = 0; count && (i < _books.length); i++){
            if (_books[i].isSelected) {  // 判断是否是选中。
                var bookId =_books[i]['_id'];
                var bookName = _books[i].name;
                var memberId = _member['_id'];
                console.log('memberId', memberId, 'bookId: ' , bookId, 'bookName', bookName);
                Book.rentBook(memberId, bookId, bookName).then(function (data) { // data is the book name
                    $scope.resultMessage += data +  ' 借阅成功!' ;
                    $scope.succCount--;
                    console.log('succCount:', $scope.succCount);
                }, function (err) {
                    $scope.resultMessage += err + ' 借阅失败!' ; // error is the recoredID.
                }).then(function(){
                    console.log('resultMessage' + $scope.resultMessage);
                    if ($scope.succCount === 0){
                        $scope.alertAndJump();
                    }
                });
            }
        }
    };

    $scope.isValid = function(key) {
        return key === GENERAL_CONFIG.secretKey ? true : false;
    };
}]);

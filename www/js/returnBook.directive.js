'use strict';

app.directive('returnBook', function(Book, $ionicLoading, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            getData: '&source',
            totalNumber: '=total',
            member: '=model',
            records: '=result',
            search: '=?filter',
            minlen: '@',
            error: '='
        },
        link: function(scope, element, attrs) {
            attrs.minLength = parseInt(scope.minlen) || 11;  // 11 is the phone number length for default.
            scope.placeholder = attrs.placeholder || '';
            scope.search = {value: ''};

            // 显示一个错误消息，2s后消失。
            var showErrMsg = function (msg){
                scope.error = msg;
                $timeout(function(){
                    scope.error = '';
                }, 2000);
            };

            if (attrs.class)
                element.addClass(attrs.class);

            scope.searchMembers = function(){
                var searchStr = scope.search.value;
                var IsNumeric = function(input)
                {
                    return (input - 0) === input && (''+input).trim().length > 0;
                };

                if(searchStr.length != 11 && !IsNumeric(searchStr)){
                    showErrMsg('手机号应为11位数字，请重试。');
                    return;
                }

                $ionicLoading.show({
                    noBackdrop: true,
                    template: '<ion-spinner></ion-spinner><br/>查询手机号' + searchStr + '...'
                });
                scope.getData({number: searchStr}).then(function (result) {
                    console.log('loadingMember...');

                    scope.member = result.member;
                    // member's valid date
                    scope.member.end_time = result.end_time;

                    $ionicLoading.show({
                        noBackdrop: true,
                        template: '<ion-spinner></ion-spinner><br/>查询会员...'
                    });

                    // get the books
                    Book.getReturnBooksByMemberId(result.member['_id']).then(function(results){
                        console.log('loading return books ...');
                        //console.log(results);
                        scope.records = results;
                        scope.totalNumber = results.length;

                        $ionicLoading.hide();
                    }, function(err){
                        showErrMsg(':( 非常抱歉亲，查询出错，请重试或联系工作人员！');
                        $ionicLoading.hide();
                        console.log('err at get return books by member id: ' + err);
                    });


                }, function (err) {
                    showErrMsg(':( 没找到会员亲，请检查您输入的手机号是否是注册会员时使用的手机号，重试或者联系工作人员！');
                    $ionicLoading.hide();
                });
            };

            scope.clearSearch = function() {
                scope.search.value = '';
            };
        },
        template: `
            <div class="item item-input-inset">
                <label class="item-input-wrapper">
                <input type="text" placeholder="{{placeholder}}" ng-model="search.value" style="width:100%;">
                </label>
                <a class="button button-icon icon ion-ios-close-empty " ng-show="search.value.length > 0" ng-click="clearSearch()"> </a>
                <button class="button button-small button-positive" ng-click="searchMembers()">
                &nbsp;&nbsp;查找会员&nbsp;&nbsp;
            </button>
            </div>
            `
    }
});

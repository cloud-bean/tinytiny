'use strict';

app.directive('memberSearch', function($ionicLoading, $timeout){
   return {
       restrict: 'E',
       scope: {
           model: "=",
           getData: "&source",
           search: "=?filter",
           error: "=",
           minlength: "@"
       },
       replace: true,
       link: function(scope, element, attrs){
           // $watch(newValue)
           attrs.minLength = scope.minlength || 0;
           scope.placeholder = attrs.placeholder || '';
           scope.search = {value: ''};

           var timeout;
           // 显示一个错误消息，2s后消失。
           var showErrMsg = function (msg){
               scope.error = msg;
               $timeout(function(){
                   scope.error = '';
               }, 2000);
           };

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

               if (timeout) $timeout.cancel(timeout);
               timeout = $timeout(function(){
                   $ionicLoading.show({
                       noBackdrop: true,
                       template: '<ion-spinner></ion-spinner><br/>查询手机号 ' + searchStr + '...'
                   });
                   scope.getData({phoneNumber: searchStr}).then(function (result) {
                       scope.model = result.member;
                       scope.model.can_rent_count = result.member.max_book - result.rentCount;
                       scope.model.end_time = result.end_time;
                       if(scope.model.length === 0) {
                           showErrMsg('搜索完成，没有找到。');
                       }
                       $ionicLoading.hide();
                   }, function(err){
                       showErrMsg('搜索失败，请重试。');
                       scope.model = [];
                       $ionicLoading.hide();
                   });

               }, 1000);

           };


           scope.clearSearch = function() {
               scope.search.value = '';
           };
       },
       template: `<div class="item item-input-inset">
                    <label class="item-input-wrapper">
                        <i class="icon ion-person"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" placeholder="{{placeholder}}" ng-model="search.value" style="width:100%;">
                    </label>
                    <a class="button button-icon icon ion-ios-close-empty " ng-show="search.value.length > 0" ng-click="clearSearch()"> </a>
                    <button class="button button-small button-positive" ng-click="searchMembers()">
                    &nbsp;&nbsp;查找会员&nbsp;&nbsp;
                </button>
                </div>`
   }
});

app.directive('bookSearch', function($timeout, $ionicLoading){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            minlength: '@',
            model: '=',
            getData: '&source',
            search: '=?filter',
            error: '='
        },
        link: function(scope, ele, attrs){
            attrs.minLength = scope.minlength || 0;
            scope.placeholder = attrs.placeholder || '';
            scope.search = {value: ''};

            var timeout;
            // 显示一个错误消息，2s后消失。
            var showErrMsg = function (msg){
                scope.error = msg;
                $timeout(function(){
                    scope.error = '';
                }, 2000);
            };

            scope.searchBook = function() {
                var searchStr = scope.search.value;
                if(searchStr.length < 0) return;

                if (timeout) $timeout.cancel(timeout);
                timeout = $timeout(function(){

                    $ionicLoading.show({
                        noBackdrop: true,
                        template: '<ion-spinner></ion-spinner><br/>查询绘本 ' + searchStr + '...'
                    });
                    scope.getData({invCode: searchStr}).then(function (result) {
                        scope.model = result;
                        if(scope.model.length === 0) {
                            showErrMsg('搜索完成，没有找到。');
                        }
                        $ionicLoading.hide();
                    }, function(err){
                        showErrMsg('搜索失败，请重试。');
                        scope.model = [];
                        $ionicLoading.hide();
                    });

                }, 1000);
            };

            //if (attrs.source) {
            //    scope.$watch('search.value', function (newValue, oldValue) {
            //        if (newValue.length == attrs.minLength) {
            //            if (timeout) $timeout.cancel(timeout);
            //            timeout = $timeout(function(){
            //
            //                $ionicLoading.show({
            //                    noBackdrop: true,
            //                    template: '<ion-spinner></ion-spinner><br/>查询绘本 ' + newValue + '...'
            //                });
            //                scope.getData({invCode: newValue}).then(function (result) {
            //                    scope.model = result;
            //                    if(scope.model.length === 0) {
            //                        showErrMsg('搜索完成，没有找到。');
            //                    }
            //                    $ionicLoading.hide();
            //                }, function(err){
            //                    showErrMsg('搜索失败，请重试。');
            //                    scope.model = [];
            //                    $ionicLoading.hide();
            //                });
            //
            //            }, 1000);
            //        } else {
            //            scope.model = [];
            //            scope.error =null;
            //        }
            //    });
            //}

            scope.clearSearch = function() {
                scope.search.value = '';
            };
        },
        template: `<div class="item item-input-inset">
                    <label class="item-input-wrapper">
                    <i class="icon ion-ios-barcode"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="text" placeholder="{{placeholder}}" ng-model="search.value" style="width:100%;">
                    </label>
                    <a class="button button-icon icon ion-ios-close-empty"  ng-show="search.value.length > 0" ng-click="clearSearch()"> </a>
                    <button class="button button-small button-positive" ng-click="searchBook()">
                    &nbsp;&nbsp;加入借书单&nbsp;&nbsp;
                </button>
                </div>`
    //'<div class="item-input-wrapper">' +
    //    '<i class="icon ion-ios-barcode"></i>' +
    //    '<input type="search" placeholder="{{placeholder}}" ng-model="search.value">' +
    //    '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
    //    '</div>'
    }
})

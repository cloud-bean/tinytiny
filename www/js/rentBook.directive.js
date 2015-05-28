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

           if (attrs.source) {
               scope.$watch('search.value', function (newValue, oldValue) {

                   if (timeout) $timeout.cancel(timeout);
                   timeout = $timeout(function(){
                       if (newValue.length == attrs.minLength) {
                           $ionicLoading.show({
                               template: '<ion-spinner></ion-spinner><br/>找找 ' + newValue + '...'
                           });
                           scope.getData({phoneNumber: newValue}).then(function (result) {
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
                       } else {
                           scope.model = [];
                           scope.error =null;
                       }
                   }, 1000);
               });
           }

           scope.clearSearch = function() {
               scope.search.value = '';
           };
       },
       template: '<div class="item-input-wrapper">' +
       '<i class="icon ion-person"></i>' +
       '<input type="search" placeholder="{{placeholder}}" ng-model="search.value">' +
       '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
       '</div>'
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

            if (attrs.source) {
                scope.$watch('search.value', function (newValue, oldValue) {

                    if (timeout) $timeout.cancel(timeout);
                    timeout = $timeout(function(){
                        if (newValue.length == attrs.minLength) {
                            $ionicLoading.show({
                                template: '<ion-spinner></ion-spinner><br/>找找 ' + newValue + '...'
                            });
                            scope.getData({invCode: newValue}).then(function (result) {
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
                        } else {
                            scope.model = [];
                            scope.error =null;
                        }
                    }, 1000);
                });
            }

            scope.clearSearch = function() {
                scope.search.value = '';
            };
        },
        template: '<div class="item-input-wrapper">' +
        '<i class="icon ion-ios-book"></i>' +
        '<input type="search" placeholder="{{placeholder}}" ng-model="search.value">' +
        '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
        '</div>'
    }
})

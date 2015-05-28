'use strict';

app.directive('searchBook', function($timeout, $ionicLoading) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            getData: '&source',
            model: '=?',
            search: '=?filter',
            error: '='
        },
        link: function(scope, element, attrs) {
            attrs.minLength = attrs.minLength || 0;
            scope.placeholder = attrs.placeholder || '';
            scope.search = {value: ''};

            // 显示一个错误消息，2s后消失。
            var showErrMsg = function (msg){
                scope.error = msg;
                $timeout(function(){
                    scope.error = '';
                }, 2000);
            };

            var timeout;
            if (attrs.class)
                element.addClass(attrs.class);

            if (attrs.source) {
                scope.$watch('search.value', function (newValue, oldValue) {

                    if (timeout) $timeout.cancel(timeout);
                    timeout = $timeout(function(){
                        if (newValue.length > attrs.minLength) {
                            $ionicLoading.show({
                                noBackdrop: true,
                                template: '<ion-spinner></ion-spinner><br/>找找 ' + newValue + '...'
                            });
                            scope.getData({str: newValue}).then(function (results) {
                                scope.model = results;
                                if(scope.model.length === 0) {
                                    showErrMsg('搜索完成，没有找到类似的绘本。');
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
                    '<i class="icon ion-ios-search"></i>' +
                    '<input type="search" placeholder="{{placeholder}}" ng-model="search.value">' +
                    '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
                  '</div>'
    };
});

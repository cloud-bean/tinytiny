'use strict';

app.directive('ionSearch', function($timeout, $ionicLoading) {
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
            var timeout;
            if (attrs.class)
                element.addClass(attrs.class);

            if (attrs.source) {
                scope.$watch('search.value', function (newValue, oldValue) {

                    if (timeout) $timeout.cancel(timeout);
                    timeout = $timeout(function(){
                        if (newValue.length > attrs.minLength) {
                            $ionicLoading.show({
                                template: '<i class="ion-load-c"></i><br/>找找 ' + newValue + '...'
                            });
                            scope.getData({str: newValue}).then(function (results) {
                                scope.model = results;
                                if(scope.model.length === 0) {
                                    scope.error = '没有找到类似的绘本。';
                                    $timeout(function(){
                                        scope.error = '';
                                    }, 2000);
                                }
                                $ionicLoading.hide();
                            }, function(err){
                                scope.error = '没有找到类似的绘本。';
                                $timeout(function(){
                                    scope.error = '';
                                }, 2000);
                                scope.model = [];
                                scope.hideLoading();
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

app.directive('memberSearch', function(Books, $ionicLoading) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            getData: '&source',
            clearData: '&clear',
            model: '=?',
            records: '=result',
            search: '=?filter',
            minlen: '@',
            error: '='
        },
        controller: function($scope, $ionicLoading){
            $scope.showLoading = function(number){
                $ionicLoading.show({
                    template: '<i class="ion-load-c"></i><br/>查询手机号' + number + '...'
                })
            };

            $scope.hideLoading = function() {
                $ionicLoading.hide();
            };
        },
        link: function(scope, element, attrs) {
            attrs.minLength = parseInt(scope.minlen) || 11;
            scope.placeholder = attrs.placeholder || '';
            scope.search = {value: ''};

            if (attrs.class)
                element.addClass(attrs.class);

            if (attrs.source) {
                scope.$watch('search.value', function (newValue, oldValue) {
                    if (newValue.length === attrs.minLength) {
                        $ionicLoading.show({
                            template: '<i class="ion-load-c"></i><br/>查询手机号' + newValue + '...'
                        });

                        scope.getData({number: newValue}).then(function (result) {
                            scope.model = result;
                            // member's valid date
                            var active_time = new Date(result.active_time).getTime();
                            scope.model.end_time = active_time + parseInt(result.valid_days) * 24 * 3600 * 1000;;

                            $ionicLoading.hide();

                            // get the books
                            Books.getReturnBooksByMemberId(result['_id']).then(function(results){
                                scope.records = results;
                            }, function(err){
                                console.log('err at get return books by member id: ' + err);
                            });
                        }, function (err) {
                            scope.error = '没找到会员';
                            $ionicLoading.hide();
                        });
                    } else {
                        scope.model = null;
                        scope.error = null;
                        scope.clearData();
                    }
                });
            }

            scope.clearSearch = function() {
                scope.search.value = '';
            };
        },
        template: '<div class="item-input-wrapper">' +
                    '<i class="icon ion-ios-phone"></i>' +
                    '<input type="search" placeholder="{{placeholder}}" ng-model="search.value">' +
                    '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
                    '</div>'
    }
});
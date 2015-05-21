'use strict';

app.directive('ionSearch', function($timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            getData: '&source',
            model: '=?',
            search: '=?filter'
        },
        controller: function($scope, $ionicLoading){
            $scope.showLoading = function(str){
                $ionicLoading.show({
                    template: '<i class="ion-load-c"></i><br/>找找 ' + str + '...'
                })
            };

            $scope.hideLoading = function() {
                $ionicLoading.hide();
            };
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
                            scope.showLoading(newValue);
                            scope.getData({str: newValue}).then(function (results) {
                                scope.model = results;
                                scope.hideLoading();
                            }, function(err){
                                scope.model = [];
                                scope.hideLoading();
                            });
                        } else {
                            scope.model = [];
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

app.directive('memberSearch', function($ionicLoading) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            getData: '&source',
            model: '=?',
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
                        // show loding...
                        //scope.showLoading(newValue);
                        $ionicLoading.show({
                            template: '<i class="ion-load-c"></i><br/>查询手机号' + newValue + '...'
                        });

                        scope.getData({number: newValue}).then(function (result) {
                            scope.model = result;
                            // loading is ok.
                            //scope.hideLoading();
                            $ionicLoading.hide();
                        }, function (err) {
                            console.log(err);
                            scope.error = '没找到会员';
                            $ionicLoading.hide();
                        });
                    } else {
                        scope.model = null;
                        scope.error = null;
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
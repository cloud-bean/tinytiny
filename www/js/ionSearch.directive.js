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

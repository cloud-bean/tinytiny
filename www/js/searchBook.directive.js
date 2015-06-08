'use strict';

app.directive('searchBook', function($timeout, $ionicLoading, $ionicPlatform) {
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

            scope.searchBooks = function(){
                var searchStr = scope.search.value;
                if(searchStr.length === 0) return;

                if (timeout) $timeout.cancel(timeout);
                timeout = $timeout(function(){
                    $ionicLoading.show({
                        noBackdrop: true,
                        template: '<ion-spinner></ion-spinner><br/>找找 ' + searchStr + '...'
                    });


                    console.log('should hide the keyboard');

                    $ionicPlatform.ready(function() {
                        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                        // for form inputs)
                        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                        }
                    });

                    scope.getData({str: searchStr}).then(function (results) {
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

                }, 1000);
            };

            // if (attrs.source) {
            //     scope.$watch('search.value', function (newValue, oldValue) {
            //         if (newValue.length > attrs.minLength) {
                        
            //         } else {
            //             scope.model = [];
            //             scope.error =null;
            //         }
            //     });
            // }

            scope.clearSearch = function() {
                scope.search.value = '';
            };
        },
        template: `
                    <div class="item item-input-inset">
                        <label class="item-input-wrapper">
                        <input type="text" placeholder="{{placeholder}}" ng-model="search.value" style="width:100%;">
                        </label>
                        <a class="button button-icon icon ion-ios-close-empty " ng-show="search.value.length > 0"  ng-click="clearSearch()"> </a>
                        <button class="button button-small button-positive" ng-click="searchBooks()">
        &nbsp;&nbsp;搜&nbsp;&nbsp;&nbsp;&nbsp;索&nbsp;&nbsp;
                        </button>
                        </div>
                  `
};
});

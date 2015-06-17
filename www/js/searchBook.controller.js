'use strict';

app.controller('searchBookCtrl', 
        ['$scope','Inventory', '$timeout', '$ionicLoading', '$ionicPlatform','$rootScope',
        function($scope, Inventory, $timeout, $ionicLoading, $ionicPlatform,$rootScope){
    
    var minSearchLength = 2;
    $scope.search = {
        value: ''
    };
   
    var MESSAGE = {
        'error': {
            'netdown': '网络错误',
            'other': '其他错误'
        },
        'warning': {
            'nodata': '无数据',
            'tooshort': '输入太少',
            'other': ' 其他警告信息' 
        },
        'info': {
            'succ': 'get data'
        }
    }


    var clearMsg = function (){
        $scope.error = '';
        $scope.warning = '';
        $scope.info = '';
    }

    var clearState = function (){
        $scope.books = [];
        clearMsg();
    }

    $rootScope.clearSearch = function () {
        $scope.search.value = '';
        clearState();
    }
    
    clearState();

    $scope.searchBooks = function () {
        
        var timeout;
        // clear data: message, book lists
        
        var searchStr = '' + $scope.search.value;
        clearState();

        // if search.value.length > 2
        if (searchStr.length <  minSearchLength) {
            $scope.warning = MESSAGE.warning.tooshort;
        } else {
            if(timeout) $timeout.cancel(timeout);

            timeout = $timeout(function() {
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

                Inventory.getByName(searchStr).then(function (results) {
                    $scope.books = results;
                    if(results.length === 0) {
                       $scope.warning =  '搜索完成，没有找到类似的绘本。';
                    }
                        $ionicLoading.hide();
                    }, function(err){
                        $scope.error =  err;
                        $ionicLoading.hide();
                    });

            }, 1000);

        }

    }

}]);

'use strict';

app.controller('BarcodeCtrl', function($scope, $cordovaBarcodeScanner) {

  $scope.scan = function (){
    // document.addEventListener("deviceready", function () {
    //   $cordovaBarcodeScanner
    //     .scan()
    //     .then(function(barcodeData) {
    //       // Success! Barcode data is here
    //       console.log('barCodeData is:', barCodeData);
    //     }, function(error) {
    //       // An error occurred
    //       console.log('failed to get barCodeData,error is:', error);
    //     });
    //   }, false);
    console.log('scaning...');
    $ionicPlatform.ready(function() {
      // $cordovaPlugin.someFunction().then(success, error);
      $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
          // Success! Barcode data is here
          console.log('barCodeData is:', barCodeData);
        }, function(error) {
          // An error occurred
          console.log('failed to get barCodeData,error is:', error);
        });
    });
    
  };

  $scope.encode = function(){
    // document.addEventListener("deviceready", function () {

        console.log('encoding...');
        // NOTE: encoding not functioning yet
        // $cordovaBarcodeScanner
        //   .encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com")
        //   .then(function(success) {
        //     // Success!
        //     console.log('encoded data is ', success);
        //   }, function(error) {
        //     // An error occurred
        //     console.log('failed to encode, error is', error);
        //   });

      // }, false);
  };
  
});
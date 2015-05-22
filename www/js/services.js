'use strict';

app.constant('GENERAL_CONFIG', {
  baseUrl: 'http://hbg-pre-build.herokuapp.com',
  apiKey: 'xinnix',
  secretKey: 'ok'
});

app.factory('Inventory', ['$http', '$q', 'GENERAL_CONFIG', function($http, $q, GENERAL_CONFIG){
  var self = this;

  self.getByName = function(name) {
    var _url = GENERAL_CONFIG.baseUrl + '/inventories/mob/name/' + name;
    var deferred = $q.defer();
    $http.get(_url).success(function(data){
      deferred.resolve(data);
    }).error(function(err){
      deferred.reject(err);
    });

    return deferred.promise;
  };
  return self;
}]);

app.factory('Member', ['$http', '$q', 'GENERAL_CONFIG', function($http, $q, GENERAL_CONFIG){
  var self = this;
  
  self.getMemberByPhone = function(number) {
    var deferred = $q.defer();
    $http.get(GENERAL_CONFIG.baseUrl + '/members/mob/phone/' + number)
    .success(function(data){
      deferred.resolve(data);
    }).error(function(err){
      deferred.reject(err);
    });

    return deferred.promise;
  };

  return self;
}]);

app.factory('Books', function($http, $q, GENERAL_CONFIG) {
  var self = this;

  self.getReturnBooksByMemberId = function (mId){
    var deferred = $q.defer();
    var url = GENERAL_CONFIG.baseUrl + '/records/mob/' + mId;

    $http.get(url).success(function(data){
      var records = [];
      for(var i=0; i < data.length; i++){
        if (data[i].status === 'R') // R: renting
          records.push(data[i]);
      }
      deferred.resolve(records);
    }).error(function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  self.returnBook = function (recordId, recordBookName){
    var deferred = $q.defer();
    var url = GENERAL_CONFIG.baseUrl + '/records/mob/return/' + recordId;
    // todo: send a put action. and get the return.
    $http.get(url).success(function(data){
      deferred.resolve(recordBookName);  // if succ, data shoule be record obj.
    }).error(function(err){
      deferred.reject(recordBookName);
    });
    return deferred.promise;
  };

  return self;
});
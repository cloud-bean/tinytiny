'use strict';

app.constant('GENERAL_CONFIG', {
  baseUrl: 'http://hbg-pre-build.herokuapp.com',
  apiKey: 'xinnix',
  max_number: 999,
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

  // get the count of the member renting now
  self.getRentCount = function (mId) {
    var deferred = $q.defer();
    $http.get(GENERAL_CONFIG.baseUrl + '/records/mob/rentCount/' + mId)
    .success(function(data){
        deferred.resolve(data.count); // data as { count: x}
    }).error(function(err){
        deferred.reject(err);
    });

    return deferred.promise;
  };

  return self;
}]);

app.factory('Book', function($http, $q, $timeout, GENERAL_CONFIG) {
  var self = this;

  self.getBookByInvCode = function (invCode){
    var deferred = $q.defer();
    var url = GENERAL_CONFIG.baseUrl + '/inventories/invCode/' + invCode;
    $http.get(url).success(function(data){
      deferred.resolve(data);
    }).error(function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  /**
   * 获取要归还的图书列表
   * @param mId 数据库中会员的id号
   * @returns {*} promise
   */
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

  /**
   * 执行还书操作
   * @param recordId：记录id号
   * @param recordBookName 归还的图书的名字，方便返回提示信息。
   * @returns {*}
   */
  self.returnBook = function (recordId, recordBookName){
    var deferred = $q.defer();
    var url = GENERAL_CONFIG.baseUrl + '/records/mob/return/' + recordId;
    // todo: 这里需要加上一个 验证码，后端验证权限。
    $http.get(url).success(function(data){
      deferred.resolve(recordBookName);  // if succ, data shoule be record obj.
    }).error(function(err){
      deferred.reject(recordBookName);
    });
    return deferred.promise;
  };

  /**
   * 执行借书操作
   * @param memberId
   * @param bookId
   * @param bookName
   * @returns {*}
   */
  self.rentBook = function(memberId, bookId, bookName) {
    var deferred = $q.defer();
    var url = GENERAL_CONFIG.baseUrl + '/records/mob/create';
    //// todo: send a put action. and get the return.
    //$http.post(url).success(function(data){
    //  deferred.resolve(bookName);  // if succ, data shoule be record obj.
    //}).error(function(err){
    //  deferred.reject(bookName);
    //});
    var dataStr = 'mId=' + memberId + '&bId=' + bookId + '&status=R';

    $http({
      url: url,
      data: dataStr,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(data){
      deferred.resolve(bookName);
    }).error(function(err){
      deferred.reject(bookName);
    });

    //// mock the operation.
    //$timeout(function(){
    //  deferred.resolve(bookName);
    //}, 1000);

    return deferred.promise;
  };

  return self;
});

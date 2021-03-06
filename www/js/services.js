'use strict';

app.constant('GENERAL_CONFIG', {
  // baseUrl: 'http://localhost:3000',
    baseUrl: 'http://120.25.227.156:8000',
  //baseUrl: 'http://hbg-pre-build.herokuapp.com',
  apiKey: 'xinnix',
  max_number: 999,
  secretKey: 'yundou',
  netTimeout: 6000,
  netTimeoutLong: 6000,
  netErr: '无法连接服务器，请检查你的网络设置后重试',
  serverErr: '服务器'
});

app.factory('Inventory', ['$http', '$q', 'GENERAL_CONFIG', function($http, $q, GENERAL_CONFIG){
  var self = this;

  self.getByName = function(name) {
    var _url = GENERAL_CONFIG.baseUrl + '/inventories/mob/name/' + name;
    var deferred = $q.defer();
    $http.get(_url, {timeout: GENERAL_CONFIG.netTimeout}).success(function(data){
      deferred.resolve(data);
    }).error(function(err, status){
      if (status === 0 )
        err = GENERAL_CONFIG.netErr;
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
    $http.get(GENERAL_CONFIG.baseUrl + '/members/mob/phone/' + number, {timeout: GENERAL_CONFIG.netTimeout})
      .success(function(data, status){
        console.log('status', status);
        // data struct:
        // { member: member,
        //   rentCount: count,
        //   end_time: the invalid day}
        var active_time = new Date(data.member.active_time).getTime();
        data.end_time = active_time + parseInt(data.member.valid_days)*24*3600*1000;
        deferred.resolve(data);

      }).error(function(err, status){
        console.log('status', status);
        if ( status === 0 ) {
          err = GENERAL_CONFIG.netErr;
        }
        deferred.reject(err);
      });

    return deferred.promise;
  };

  // get the count of the member renting now
  self.getRentCount = function (mId) {
    var deferred = $q.defer();
    $http.get(GENERAL_CONFIG.baseUrl + '/records/mob/rentCount/' + mId, {timeout: GENERAL_CONFIG.netTimeout})
      .success(function(data){
        deferred.resolve(data.count); // data as { count: x}
      }).error(function(err, status){
        if (status === 0 )
          err = GENERAL_CONFIG.netErr;
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
    $http.get(url, {cache: false, timeout: GENERAL_CONFIG.netTimeout}).success(function(data){
      deferred.resolve(data);
    }).error(function(err, status){
      if (status === 0 )
        err = GENERAL_CONFIG.netErr;
      deferred.reject(err);
    });
    return deferred.promise;
  };

  self.getBookById = function(id){
    var _url = GENERAL_CONFIG.baseUrl + '/inventories/' + id;
    var deferred = $q.defer();

    $http.get(_url, {timeout: GENERAL_CONFIG.netTimeout}).success(function(data){
      deferred.resolve(data);
    }).error(function(err, status){
      if (status === 0 ){
        err = GENERAL_CONFIG.netErr;
        deferred.reject(err);
      }
      deferred.reject('faild to get the book');
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

    $http.get(url, {timeout: GENERAL_CONFIG.netTimeout}).success(function(data){
      var records = [];
      for(var i=0; i < data.length; i++){
        if (data[i].status === 'R') // R: renting
          records.push(data[i]);
      }
      deferred.resolve(records);
    }).error(function(err, status){
      if (status === 0 )
        err = GENERAL_CONFIG.netErr;
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
    $http.get(url, {timeout: GENERAL_CONFIG.netTimeoutLong}).success(function(data){
      deferred.resolve(recordBookName);  // if succ, data shoule be record obj.
    }).error(function(err, status){
      if (status === 0 ){
        err = GENERAL_CONFIG.netErr;
        deferred.reject(err);
      }

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
      timeout: GENERAL_CONFIG.netTimeoutLong,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(data){
      deferred.resolve(bookName);
    }).error(function(err, status){
      if (status === 0 ) {
        err = GENERAL_CONFIG.netErr;
        deferred.reject(err);
      }
      deferred.reject(bookName);
    });


    return deferred.promise;
  };

  return self;
});

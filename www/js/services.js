'use strict';

angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

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

  self.returnBook = function (recordId){
    var deferred = $q.defer();
    var url = GENERAL_CONFIG.baseUrl + '/records/mob/return/' + recordId;
    // todo: send a put action. and get the return.
    $http.get(url).success(function(data){
      deferred.resolve(data);  // if succ, data shoule be record obj.
    }).error(function(err){
      deferred.reject(recordId);
    });
    return deferred.promise;
  };

  return self;
});
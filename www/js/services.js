angular.module('starter.services', ['ngResource'])
  //.constant('baseURL', 'http://localhost:3000/')
.constant('baseURL', 'https://serene-acadia-35580.herokuapp.com/')

  .factory('departmentFactory', ['$resource','baseURL', function ($resource, baseURL) {
    return $resource(baseURL+'department/:id', null, {
      'delete': {
        method: 'DELETE',
        params:{
          id:'@id'
        }
      }
    });
  }])

  .factory('designationFactory', ['$resource','baseURL', function ($resource, baseURL) {
    return $resource(baseURL+'designation/:id', null, {
      'delete': {
        method: 'DELETE',
        params:{
          id:'@id'
        }
      }
    });
  }])

  .factory('mDataFactory', function(){
    var meetingNames = [
      {label:"Meeting 1", value:"Meeting 1"},
      {label:"Meeting 2", value:"Meeting 2"},
      {label:"Meeting 3", value:"Meeting 3"},
      {label:"Meeting 4", value:"Meeting 4"},
      {label:"Other", value:"Other"}
    ];

    var meetingType = [
      {label:"Regular", value:"Regular"},
      {label:"Urgent", value:"Urgent"}
    ];

    var mData = {};

    mData.getMeetingName = function () {
      return meetingNames;
    };

    mData.getMeetingType = function () {
      return meetingType;
    };

    return mData;
  })

  .factory('employeeData', function (departmentFactory, designationFactory) {
    var departments = departmentFactory.query();
    var designations =  designationFactory.query();

    var employeeCredentials = {username:"", password:"", designation:"", department:"" };

    var empData = {};

    empData.getDepartments = function () {
      return departments;
    };

    empData.getDesignations = function () {
      return designations;
    };

    empData.getEmployee = function () {
      return employeeCredentials;
    };

    return empData;
  })

  .factory('facultyFactory', ['$resource','baseURL', function ($resource, baseURL) {
    return $resource(baseURL+'faculty/:id');
  }])

  .factory('$localStorage', ['$window', function($window) {
    return {
      store: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      remove: function (key) {
        $window.localStorage.removeItem(key);
      },
      storeObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key,defaultValue) {
        return JSON.parse($window.localStorage[key] || defaultValue);
      }
    }
  }])

  .factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', 'baseURL', '$ionicPopup','$location', function($resource, $http, $localStorage, $rootScope, baseURL, $ionicPopup, $location){

    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;


    function loadUserCredentials() {
      var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
      if (credentials.username != undefined) {
        useCredentials(credentials);
      }
    }

    function storeUserCredentials(credentials) {
      $localStorage.storeObject(TOKEN_KEY, credentials);
      useCredentials(credentials);
    }

    function useCredentials(credentials) {
      isAuthenticated = true;
      username = credentials.username;
      authToken = credentials.token;
      // Set the token as header for your requests!
      $http.defaults.headers.common['x-access-token'] = authToken;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      username = '';
      isAuthenticated = false;
      $http.defaults.headers.common['x-access-token'] = authToken;
      $localStorage.remove(TOKEN_KEY);
    }

    authFac.login = function(loginData) {
      console.log("111 " + JSON.stringify(loginData))
      $http.defaults.headers.common["Access-Control-Allow-Origin"] = '*';
      //$http.defaults.headers.post["Content-Type"] = "text/plain";
      $resource(baseURL + "users/login")
        .save(loginData,
          function(response) {
            storeUserCredentials({username:loginData.username, token: response.token});
            $rootScope.$broadcast('login:Successful');
            $location.path('/tabs');
          },
          function(response){
            isAuthenticated = false;

            console.log("err = " + JSON.stringify(response))
            var message = '<div><p>' +  response.data.err.message +
              '</p><p>' + response.data.err.name + '</p></div>';

            var alertPopup = $ionicPopup.alert({
              title: '<h4>Login Failed!</h4>',
              template: message
            });

            alertPopup.then(function(res) {
              console.log('Login Failed!');
            });
          }

        );
    };

    authFac.logout = function() {
      $resource(baseURL + "users/logout").get(function(response){
      });
      destroyUserCredentials();
    };

    authFac.register = function(registerData) {

      $resource(baseURL + "users/register")
        .save(registerData,
          function(response) {
        //    authFac.login({username:registerData.username, password:registerData.password});

            $rootScope.$broadcast('registration:Successful');
            var alertPopup = $ionicPopup.alert({
              title: 'Congratulation, User Verified!',
              template: 'You can get your login details from the email sent to your email address'
            });

            alertPopup.then(function(res) {
              console.log('Registration Successful!');
              $location.path('/signIn');
            });
          },
          function(response){
            var message = '<div><p>' +  response.data.err +
              '</p><p>' + response.data.err + '</p></div>';

            var alertPopup = $ionicPopup.alert({
              title: '<h4>Registration Failed!</h4>',
              template: message
            });

            alertPopup.then(function(res) {
              console.log('Registration Failed!');
            });
          }

        );
    };

    authFac.isAuthenticated = function() {
      return isAuthenticated;
    };

    authFac.getUsername = function() {
      return username;
    };

    loadUserCredentials();

    return authFac;

  }])

  .factory('profileFactory', ['$resource','baseURL', function ($resource, baseURL) {
    return $resource(baseURL+'users/userProfile/:name');
  }])

  .factory('notificationFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL+'users/userMeeting/:name');
  }])

  .factory('meetingFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL+'meeting/:id', null, {
      'update': {
        url: baseURL+'meeting/:id/:to/:faculty',
        method: 'PUT',
        params:{
          id:'@id', to:'@to'
        }
      },
      'confirm': {
        method: 'PUT',
        params:{
          id:'@id'
        }
      },
      'delete': {
        method: 'DELETE',
        params:{
          id:'@id'
        }
      }
    });
  }])

  .factory('membershipFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL+'group/:id');
  }])

  .factory('countFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL+'count/:countId');

  }])
;



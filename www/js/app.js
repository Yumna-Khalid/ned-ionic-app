
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ionic.cloud', 'starter.controllers', 'starter.services', 'ngCordova', 'ngMessages'])
  /*.constant('ApiEndpoint', {
    url: 'http://localhost:8100/api'
  })*/

  .config(function($ionicCloudProvider) {
    $ionicCloudProvider.init({
      "core": {
        "app_id": "3f067dab"
      }
    });
  })

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    var notificationOpenedCallback = function(jsonData) {
      console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    };

    window.plugins.OneSignal.init("7fb8956a-586b-4dee-95da-f4aab829628f",
      {googleProjectNumber: "403909109849"},
      notificationOpenedCallback);

    // Show an alert box if a notification comes in when the user is in your app.
    window.plugins.OneSignal.enableInAppAlertNotification(true);

  });

})


.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider

      .state('home',{
        url:'/home',
        templateUrl: 'templates/home.html',
        controller:'progressController'
      })
      .state('data',{
        url:'/data',
        templateUrl:'templates/data.html',
        controller:'FormController'
      })
      .state('login',{
        url:'/login',
        templateUrl:'templates/login.html',
        controller: 'AppController'
      })
      .state('signIn',{
      url:'/signIn',
      templateUrl:'templates/signIn.html',
      controller:'LoginController'
     })
      .state('faculty', {
        url: '/faculty',
        templateUrl: 'templates/faculty.html',
        controller: 'FacultyController'
      })
      .state('tabs', {
        url:'/tabs',
        absolute: true,
        templateUrl:'templates/tabs.html',
        controller:'AppController'
      })
      .state('tabs.profile', {
        url:'/profile',
        views : {
          'tab-profile' : {
            templateUrl: 'templates/tab-profile.html'
          }
        }
      })

      .state('tabs.home', {
        url:'/home',
        views : {
          'tab-home' : {
            templateUrl : 'templates/tab-home.html',
            controller:'HomeController'
          }
        }
      })
      .state('tabs.notifications', {
        url:'/notifications',
        views :{
          'tab-notifications' : {
            templateUrl : 'templates/tab-notifications.html',
            controller: 'NotificationController'
          }
        }
      })
      .state('tabs.meeting',{
        url : '/scheduleMeeting',
        views : {
          'tab-meeting' : {
            templateUrl : 'templates/tab-meeting.html',
            controller:'FacultyController'
          }
        }
      })
      .state('tabs.meetingdetail',{
        url:'/meeting/:id',
        views : {
          'tab-notifications' : {
            templateUrl:'templates/meeting-detail.html',
            controller:'MeetingController'
          }
        }
      })

      .state('tabs.myMeetingdetail',{
        url:'/personalmeeting/:id',
        views : {
          'tab-home' : {
            templateUrl:'templates/my-meetings.html',
            controller:'MeetingController'
          }
        }
      })

      .state('admin',{
        url:'/admin',
        templateUrl: 'templates/admin.html'
      })

    .state('department',{
      url:'/department',
      templateUrl: 'templates/department.html',
      controller:'DepartmentController'
    })

    .state('designation',{
      url:'/designation',
      templateUrl: 'templates/designation.html',
      controller:'DesignationController'
    })

    .state('category',{
      url:'/category',
      templateUrl: 'templates/category.html',
      controller: 'GroupController'
    })

 // $urlRouterProvider.otherwise('/admin');
  $urlRouterProvider.otherwise('/home');
   //$urlRouterProvider.otherwise('/tabs/notifications');
//  $urlRouterProvider.otherwise('/tabs/scheduleMeeting');
  });

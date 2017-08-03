angular.module('starter.controllers', ['ionic.cloud', 'checklist-model', 'ng-fusioncharts'])

  .controller('AppController',['$scope', '$ionicDeploy', '$ionicPopup', '$rootScope', 'AuthFactory', '$location', 'profileFactory', function ($scope, $ionicDeploy, $ionicPopup, $rootScope, AuthFactory, $location, profileFactory) {
    $scope.loggedIn = false;
    $scope.username = '';
    $scope.faculty = {};

    // When check() is called, Deploy checks for a new snapshot on the active deploy channel.
    $ionicDeploy.check().then(function(snapshotAvailable) {
      if (snapshotAvailable) {
        // When snapshotAvailable is true, you can apply the snapshot
        $ionicDeploy.download().then(function() {
          $ionicDeploy.extract().then(function(){
            $ionicPopup.show({
              title: 'Update available',
              subTitle: 'An update was just downloaded. Would you like to restart your app to use the latest features?',
              buttons: [
                { text: 'Not now' },
                {
                  text: 'Restart',
                  onTap: function(e) {
                    $ionicDeploy.load();
                  }
                }
              ]
            });
          });
        });
      }
    });


    if(AuthFactory.isAuthenticated()) {
      $scope.loggedIn = true;
      $scope.username = AuthFactory.getUsername();
      profileFactory.get({user:$scope.username},
        function (response) {
          $scope.faculty = response;
        },
        function (response) {
        }
      );
//      $location.path('/tabs/profile');
    }
    else {
      $location.path('/login')
    }

    $scope.logOut = function() {
      AuthFactory.logout();
      $scope.loggedIn = false;
      $scope.username = '';
      $scope.faculty = {};
      $location.path('login');
    };

    $rootScope.$on('login:Successful', function () {
      $scope.loggedIn = AuthFactory.isAuthenticated();
      $scope.username = AuthFactory.getUsername();
      profileFactory.get({user:$scope.username},
        function (response) {
          $scope.faculty = response;
        },
        function (response) {
        }
      );
    });

    $rootScope.$on('registration:Successful', function () {
      $scope.loggedIn = AuthFactory.isAuthenticated();
      $scope.username = AuthFactory.getUsername();
    });

  }])

  .controller('FormController', ['$scope', 'employeeData', '$localStorage', 'AuthFactory', '$http', function ($scope, employeeData, $localStorage, AuthFactory, $http) {
  $scope.employee = employeeData.getEmployee();

  $scope.departments = employeeData.getDepartments();

  $scope.designations = employeeData.getDesignations();

  $scope.validation = true;

  $scope.verifyEmp = function () {
    console.log($scope.employee);

    $scope.employee.username = employeeData.getEmployee.username;
    $scope.employee.personal_no = employeeData.getEmployee.personal_no;
    $scope.employee.designation = employeeData.getEmployee.designation;
    $scope.employee.department = employeeData.getEmployee.department;
    $scope.employee.email = employeeData.getEmployee.email;
    $scope.employee.contact_no = employeeData.getEmployee.contact_no;

    $scope.empForm.$setPristine();
  };

  $scope.refresh = function(){
    $scope.employee.username = "";
    $scope.employee.personal_no ="";
    $scope.employee.password = "";
    $scope.employee.designation = "";
    $scope.employee.department = "";
    $scope.employee.email = "";
    $scope.employee.contact_no = "";

    $scope.empForm.$setPristine();
  };

  $scope.doRegister = function() {
    //window.plugins.OneSignal.getIds(function(ids) {
      //alert('getIds: ' + JSON.stringify(ids));
     // $scope.employee.userid = ids.userId;
      //alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);
      AuthFactory.register($scope.employee);
   // });
  };

    /*$scope.meeting={title:'ABC', description:'description here', time:'11:00 PM'};

    $scope.btnClick = function() {

      $http({
        method: "POST",
        url: "https://onesignal.com/api/v1/notifications",
        data: {
          app_id: "7fb8956a-586b-4dee-95da-f4aab829628f",
          headings: {"en" : $scope.meeting.title},
          contents: {"en": $scope.meeting.description + " at: " + $scope.meeting.time},
          included_segments: ["Active Users"]

        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic M2E5ZWZjM2EtNTc0NC00YTljLThiOTAtM2RlYWVmY2M3MDdm"
        }
      }).then(successCallback, errorCallback);
      function successCallback() {
        console.log("success")
      }

      function errorCallback(error) {
        console.log("error " + JSON.stringify(error))

      }
    }*/
}])

  .controller('PopupController',['$scope', '$ionicPopup' , '$location', function($scope,$ionicPopup, $location){
    $scope.validEmp = true;
    if($scope.validEmp == true){
      $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Congratulation, User Verified!',
          template: 'You can get your login details from the email sent to your email address'
        });

        alertPopup.then(function(res) {
          console.log('Thank you for advice.');
          $location.path('/faculty');
        });
      };
    } else {
      $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Try again later!',
          template: 'No Connection Found.'
        });

        alertPopup.then(function(res) {
          console.log('Thank you for advice.');
        });
      };
    }
  }])

  .controller('progressController', function($scope,$state, $interval) {


    $scope.progressval = 0;
    $scope.stopInterval = null;


    function startProgress() {
      $scope.progressval = 0;
      if ($scope.stopInterval)
        $interval.cancel($scope.stopInterval);

      $scope.stopInterval = $interval(function () {
        $scope.progressval = $scope.progressval + 1;
        if ($scope.progressval >= 100) {
          $interval.cancel($scope.stopInterval);
          $state.go('login');
          return;
        }
      }, 25);
    }
    startProgress();
  })

  .controller('LoginController', ['$scope', '$localStorage','$http', 'AuthFactory', 'facultyFactory', function ($scope, $localStorage, $http, AuthFactory, facultyFactory) {

    $scope.loginData = $localStorage.getObject('userinfo','{}');

    $scope.doLogin = function() {
      /*  if($scope.rememberMe)
       $localStorage.storeObject('userinfo',$scope.loginData);
       */
      AuthFactory.login($scope.loginData);
    };
  }])

  .controller('FacultyController', ['$scope', 'membershipFactory', 'facultyFactory', 'meetingFactory', 'mDataFactory', 'employeeData', '$ionicModal','$ionicPopup', '$filter',
    function ($scope, membershipFactory, facultyFactory, meetingFactory, mDataFactory, employeeData, $ionicModal, $ionicPopup, $filter) {

      $scope.meetingNames = mDataFactory.getMeetingName();
      $scope.meetingType = mDataFactory.getMeetingType();
      $scope.user={
      check:[]
    };
    $scope.showCheckbox = false;
    $scope.filtText = '';
    $scope.addMeeting = {
      meeting: "",
      meetingType: "Regular",
      description: "",
      venu:"",
      meetingDate:null,
      time:"",
      participant: [],
      participants:[],
      userids:[]
    };

    $scope.toggleSelect = function () {
      $scope.showCheckbox = !$scope.showCheckbox;
    };

    // for unique elements in array
    function uniqBy(a, key) {
      var seen = {};
      return a.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
      })
    }

    //remove redundent elements from array
    Array.prototype.remove = function() {
      var what, a = arguments, L = a.length, ax;
      while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
        }
      }
      return this;
    };
    //var ary = ['three', 'seven', 'eleven', 'seven', 'seven'];

    //remove array from another array
    function difference(source, toRemove){
      return source.filter(function(value){
        return toRemove.indexOf(value) == -1;
      });
    }

    membershipFactory.query(
      function (response) {
        $scope.memberships = response;
      },
      function (response) {
      });

    facultyFactory.query(
      function (response) {
        $scope.faculties = response;
        $scope.items2 = $scope.faculties;
        $scope.items2 = $scope.faculties;
      },
      function (response) {
      });
   // $scope.items2 = $scope.items;
    $scope.search={};

    $scope.$watch('search.searchKey', function(val) {
      $scope.faculties = $filter('filter')($scope.items2, val);
    });
   // $scope.items2 = $scope.faculties;

   // $scope.$watch('search', function(val) {
  //    $scope.faculties = $filter('filter')($scope.items2, val);
   // });

      //modal for display groups
    $ionicModal.fromTemplateUrl('templates/group-modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    //model for display employees
    $ionicModal.fromTemplateUrl('templates/employee-modal.html', {
      scope: $scope
    }).then(function(modal){
      $scope.employeeModal = modal;
    });

      //modal for display all employees
      $ionicModal.fromTemplateUrl('templates/all_faculty.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.all_faculty_modal = modal;
      });


      // to show employee modal
    $scope.openModal = function(setFilter){
        $scope.filtText = setFilter;
        $scope.employeeModal.show();
    };

    // to close all modals
    $scope.closeModal = function (tab) {
      if(tab == 1){
        $scope.employeeModal.hide();
      }
      if(tab == 4){
        $scope.all_faculty_modal.hide();
      }
      if(tab == 2){
        $scope.all_faculty_modal.hide();
        $scope.employeeModal.hide();
        $scope.modal.hide();
      }
      if(tab == 3){
        $scope.modal.hide();
        $scope.addMeeting.participant = uniqBy($scope.addMeeting.participant, JSON.stringify);
        $scope.addMeeting.participant=difference($scope.addMeeting.participant,[""]);
      }
    };

    $scope.checkedddd={};

    $scope.clickGroup = function(group,index){
      $scope.myValues=[];
      $scope.emps = $filter('filter')($scope.items2, group);
      for (var i in $scope.emps) {
        $scope.myValues.push($scope.emps[i].name)
      }
      if($scope.checkedddd.check[index]) {
        for (var i in $scope.emps) {
          $scope.addMeeting.participant.push($scope.emps[i].name)
        }
      }
      if(!$scope.checkedddd.check[index]){
        $scope.addMeeting.participant=difference($scope.addMeeting.participant,$scope.myValues);
      }
    };

    $scope.meeting={title:'ABC', description:'description here', time:'11:00 PM'};
    $scope.sendNotification = function(){
      meetingFactory.save($scope.addMeeting,
        function(response) {
          var alertPopup = $ionicPopup.alert({
            title: 'Meeting Scheduled!',
            template: 'Meeting has been scheduled. you can update it later'
          });

          alertPopup.then(function(res) {
          });
          /*$scope.playerids=response.meetingid
          $scope.playerids.remove(null);
          console.log($scope.playerids);
          meetingFactory.get({id:$scope.playerids},
            function(result){
              $http({
                method: "POST",
                url: "https://onesignal.com/api/v1/notifications",
                data: {
                  app_id: "7fb8956a-586b-4dee-95da-f4aab829628f",
                  headings: {"en" : $scope.meeting.title},
                  contents: {"en": $scope.meeting.description + " at: " + $scope.meeting.time},
                  include_player_ids: $scope.playerids
                },
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Basic M2E5ZWZjM2EtNTc0NC00YTljLThiOTAtM2RlYWVmY2M3MDdm"
                }
              }).then(successCallback, errorCallback);
              function successCallback() {
                console.log("success")
              }

              function errorCallback(error) {
                console.log("error " + JSON.stringify(error))
              }
          })*/
        },
        function(response){
        });
    };

      //...............*All done for Admin panel*................//
      $scope.added = function () {
      }
      $scope.departments = employeeData.getDepartments();
      $scope.designations = employeeData.getDesignations();

      $scope.addDpt = function () {
        $scope.newEmp = {name:"", dpt:"", dsg:""};
        var myPopup = $ionicPopup.show({
          template: '<input type="text" placeholder="Enter Name" ng-model="newEmp.name" required>' +
          '<select ng-model="newEmp.dpt" ng-options="department.value as department.label for department in departments" required>' +
          '<option value="">Select Department</option></select>' +
          '<select ng-model="newEmp.dsg" ng-options="designation.value as designation.label for designation in designations" required>' +
          '<option value="">Select Designation</option></select>',
          title: 'Add new employee',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Add</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.newEmp.name || !$scope.newEmp.dpt || !$scope.newEmp.dsg) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return $scope.newEmp;
                }
              }
            }
          ]
        });
        myPopup.then(function(res) {
          console.log('Tapped! '+ res);
          // post request
          facultyFactory.save($scope.newEmp,
            function(response) {
              var alertPopup = $ionicPopup.alert({
                title: 'New Employee is Added!'
              });

              alertPopup.then(function(res) {
              });
            },
            function(response){
            });
        });
      };

      $scope.deleteDpt = function (id, index) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Deleting...',
          template: 'Are you sure you want to delete this item?'
        });
        confirmPopup.then(function(res) {
          if(res) {
            departmentFactory.delete({id: id},{cancel:true},
              function(response){
                console.log(response);
                $scope.departments.splice(index, 1);
              });
            console.log('You are sure');
          } else {
            console.log('You are not sure');
          }
        });
      };

  }])

  .controller('NotificationController', ['$scope', '$state', '$http', 'notificationFactory', 'meetingFactory', '$ionicModal', '$ionicPopup', '$location', '$cordovaCalendar', function($scope, $state, $http, notificationFactory, meetingFactory, $ionicModal, $ionicPopup, $location, $cordovaCalendar){

    $scope.notifications=[];
    $scope.invitees;
    $scope.mid;
    $scope.partId;
    $scope.checkin=[];
    $scope.radio={};

    notificationFactory.get({user:$scope.username},
      function (response) {
        $scope.notifications = response.meetings;
       // console.log($scope.faculty.name);
        for(var x=0; x<$scope.notifications.length; x++){
          for(var i=0;i<$scope.notifications[x].participants.length; i++) {
            if ($scope.notifications[x].participants[i].participant == $scope.faculty.name) {
              $scope.notifications[x].response = $scope.notifications.participants[x].response;
            }
          }
        }
      },
      function (response) {
      }
    );

    $scope.$watch('username', function(){
      if($scope.loggedIn===true && !($scope.username === '')){
        notificationFactory.get({user:$scope.username},
          function (response) {
            $scope.notifications = response.meetings;
          },
          function (response) {
          }
        );
      }
    });

    $ionicModal.fromTemplateUrl('templates/going-modal.html', {
      scope: $scope
    }).then(function(modal){
      $scope.modal = modal;
    });

    // A confirm dialog for Delete
    $scope.showConfirm = function(meetingId, index) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Not Going',
        template: 'Are you sure you want to ignore this meating?<br /><b>Warning: </b>You cannot respond to this meeting later'
      });

      confirmPopup.then(function(res) {
        if(res) {
          $http({
            'method': 'DELETE',
            'url': 'https://serene-acadia-35580.herokuapp.com/users/userMeeting/' + meetingId,
            'headers': {
              'Content-Type': 'application/json'
            },
            'data': ""
          })
            .success(function () {
              $scope.notifications.splice(index, 1);
            })
            .error(function (data, status) {
              console.log(data.errors);
            });
          $state.go($state.current, {}, {reload: true});
        } else {
          console.log('You are not sure');
        }
      });
    };

    // obtain date ranges
    function getDates(d1, d2) {
      var oneDay = 24 * 3600 * 1000;
      for (var d = [], ms = d1 * 1, last = d2 * 1; ms <= last; ms += oneDay) {
        d.push(new Date(ms));
      }
      return d;
    }

    //remove redundent elements from array

    Array.prototype.remove = function() {
      var what, a = arguments, L = a.length, ax;
      while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
        }
      }
      return this;
    };
    //var ary = ['three', 'seven', 'eleven', 'seven', 'seven'];

// on respond....
    $scope.respond = function(startDate, endDate, meetingid, invitees){
      $scope.dateArray=[];
      $scope.mid = meetingid;
      $scope.invitees=invitees;
      $scope.modal.show();
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      $scope.dateArray = getDates(startDate, endDate);
      console.log($scope.dateArray);
    };

    // for unique elements in array
    function uniqBy(a, key) {
      var seen = {};
      return a.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
      })
    }

    //remove array from another array
    function difference(source, toRemove){
      return source.filter(function(value){
        return toRemove.indexOf(value) == -1;
      });
    }

    $scope.sendResponse = function(item){
      for(var x=0; x<$scope.invitees.length; x++){
        if($scope.invitees[x].participant==$scope.faculty.name){
          $scope.partId = $scope.invitees[x]._id;
        }
      }
      console.log(item);
      $scope.checkin.remove(false);
      $scope.checkin = uniqBy($scope.checkin, JSON.stringify);
      $scope.checkin=difference($scope.checkin,[null]);
      console.log($scope.checkin);
      switch(item){
        case 'A':
              console.log('a is clicked');
              meetingFactory.update({id: $scope.mid, to: $scope.partId}, $scope.checkin,
                function(response){
                  var alertPopup = $ionicPopup.alert({
                    title: 'Response Sent',
                    template: 'Your response has been sent'
                  });

                  alertPopup.then(function(res) {
                  });
                });
              break;
        case 'B':
              console.log('b is cliccked');
              $scope.checkin=[];
              meetingFactory.update({id: $scope.mid, to: $scope.partId}, $scope.checkin);
              break;
        default:
              console.log('nothing is clicked');
      }
      $scope.modal.hide();
      $location.path('/tabs/notifications');
    }

    $scope.addCalendar = function (title, date, venu) {
      $cordovaCalendar.createEvent({
        title: title,
        location: venu,
        notes: 'Bring sandwiches',
        startDate: new Date(date),
        endDate: new Date(date)
      }).then(function (result) {
        alert("Event created successfully "+ date);
      }, function (err) {
        alert("There was an error: " + err);
      });
    }

    //disable response button

  }])

  .controller('MeetingController', ['$scope', '$state', '$stateParams', 'meetingFactory','countFactory', '$ionicPopup','$filter', function($scope, $state, $stateParams,  meetingFactory, countFactory, $ionicPopup, $filter){
    $scope.counter = [];
    $scope.countercount=false;

    meetingFactory.get({
        id: $stateParams.id
      },
      function (response) {
        $scope.meeting = response;
        $scope.startDate = new Date(response.fromDate);
        $scope.finalDate = new Date(response.endDate);
        $scope.days = getDates($scope.startDate, $scope.finalDate);

        for (var x = 0; x < $scope.days.length; x++) {
            $scope.invite = $filter('filter')($scope.meeting.participants, $scope.days[x]);
          $scope.counter.push($scope.invite.length);
        }
      },
      function (response) {
      }
    );

    countFactory.query({
        countId: $stateParams.id
      },
      function (response) {
        $scope.count = response;

        $scope.myDataSource = {
          chart: {
            caption: 'Participants Available',
            theme: "ocean"
          },
          data:$scope.count
        };
      },
      function (response) {
      });

    $scope.clickedMe = function () {
      $scope.countercount=!$scope.countercount;
    };

    function getDates(d1, d2) {
      var oneDay = 24 * 3600 * 1000;
      for (var d = [], ms = d1 * 1, last = d2 * 1; ms <= last; ms += oneDay) {
        d.push(new Date(ms));
      }
      return d;
    }

    $scope.confirmMeeting = function (meeting) {
            $scope.data = {fromdate:"", endDate:""}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
              template: '<label class="item item-input"><span class="input-label">Date<input type="date" ng-model="data.meetingDate"></label>' +
              '<label class="item item-input"><span class="input-label">Time<input type="time" ng-model="data.time">',
              title: 'Confirm the Meeting',
              subTitle: 'Please enter the final date and time on which meeting has to be gone',
              scope: $scope,
              buttons: [
                { text: 'Cancel' },
                {
                  text: '<b>Confirm</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    if (!$scope.data.meetingDate || !$scope.data.time) {
                      //don't allow the user to close unless he enters wifi password
                      e.preventDefault();
                    } else {
                      return $scope.data;
                    }
                  }
                }
              ]
            });
            myPopup.then(function(res) {
              console.log('Tapped! '+ res);
              meetingFactory.confirm({id: meeting},$scope.data);
            });
    };

    $scope.cancelMeeting = function (meetid) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Cancel the Meeting',
        template: 'Are you sure you want to cancel this meeting?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          meetingFactory.delete({id: meetid},{cancel:true},
            function(response){
              console.log(response);
              $scope.cancelled=response.cancel;
            });
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });

    };
  }])

  .controller('HomeController', ['$scope', 'meetingFactory', function($scope, meetingFactory){
    meetingFactory.query({user:$scope.username},{},
      function (response) {
        $scope.myMeetings = response;
        console.log(JSON.stringify($scope.myMeetings));
      },
      function (response) {
      }
    );

    $scope.$watch('username', function(){
      if($scope.loggedIn===true && !($scope.username === '')){
        meetingFactory.query({user:$scope.username},{},
          function (response) {
            $scope.myMeetings = response;
            console.log(JSON.stringify($scope.myMeetings));
          },
          function (response) {
          }
        );
      }
    });
  }])

  .controller('DepartmentController', ['$scope', 'departmentFactory', '$ionicPopup', function($scope, departmentFactory, $ionicPopup) {
    departmentFactory.query(
      function (response) {
        $scope.departments = response;
      },
      function (response) {
      }
    );

    $scope.addDpt = function () {
      $scope.newDpt = {label:"", value:""};
      var myPopup = $ionicPopup.show({
        template: '<input type="text" placeholder="Enter Department Name" ng-model="newDpt.value" required>',
        title: 'Add new Department',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Add</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.newDpt.value) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.newDpt;
              }
            }
          }
        ]
      });
      myPopup.then(function(res) {
        $scope.newDpt.label = $scope.newDpt.value;
        console.log($scope.newDpt.label +'Tapped! '+ res);
        // post request
        departmentFactory.save($scope.newDpt,
          function(response) {
            var alertPopup = $ionicPopup.alert({
              title: 'New Department is Added!'
            });

            alertPopup.then(function(res) {
            });
          },
          function(response){
          });
      });
    };

    $scope.deleteDpt = function (id, index) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Deleting...',
        template: 'Are you sure you want to delete this item?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          departmentFactory.delete({id: id},{cancel:true},
            function(response){
              console.log(response);
              $scope.departments.splice(index, 1);
            });
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });
    };
  }])

  .controller('DesignationController', ['$scope', 'designationFactory', '$ionicPopup', function($scope, designationFactory, $ionicPopup) {
    designationFactory.query(
      function (response) {
        $scope.designations = response;
      },
      function (response) {
      });
    $scope.addDsg = function () {

      $scope.newDsg = {label:"", value:""};
      var myPopup = $ionicPopup.show({
        template: '<input type="text" placeholder="Enter Designation" ng-model="newDsg.value" required>',
        title: 'Add new Dsignation',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Add</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.newDsg.value) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.newDsg;
              }
            }
          }
        ]
      });
      myPopup.then(function(res) {
        $scope.newDsg.label = $scope.newDsg.value;
        console.log($scope.newDsg.label +'Tapped! '+ res);
        // post request
        designationFactory.save($scope.newDsg,
          function(response) {
            var alertPopup = $ionicPopup.alert({
              title: 'New designation is Added!'
            });

            alertPopup.then(function(res) {
            });
          },
          function(response){
          });
      });
    };

    $scope.deleteDsg = function (id, index) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Deleting...',
        template: 'Are you sure you want to delete this item?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          designationFactory.delete({id: id},{cancel:true},
            function(response){
              console.log(response);
              $scope.designations.splice(index, 1);
            });
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });
    }
  }])

  .controller('GroupController', ['$scope', 'membershipFactory', '$ionicPopup', function($scope, membershipFactory, $ionicPopup) {


    membershipFactory.query(
      function (response) {
        $scope.groups = response;
      },
      function (response) {
      });

    $scope.addCtg = function () {

      $scope.newCtg = {label:"", value:""};
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="newCtg.value" required>',
        title: 'Add new Group',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Add</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.newCtg.value) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.newCtg;
              }
            }
          }
        ]
      });
      myPopup.then(function(res) {
        $scope.newCtg.label = $scope.newCtg.value;
        console.log($scope.newCtg.label +'Tapped! '+ res);
        // post request
        membershipFactory.save($scope.newCtg,
          function(response) {
            var alertPopup = $ionicPopup.alert({
              title: 'New Group is Added!'
            });

            alertPopup.then(function(res) {
            });
          },
          function(response){
          });
      });
    };

    $scope.deleteCtg = function (id, index) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Deleting...',
        template: 'Are you sure you want to delete this item?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          membershipFactory.delete({id: id},{cancel:true},
            function(response){
              console.log(response);
              $scope.groups.splice(index, 1);
            });
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });
    }
  }])

;

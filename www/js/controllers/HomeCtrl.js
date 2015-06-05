/*

  Home Controller
    - First to display the main menu
    - Shows User Info
    - Shows which castle we are in
    - Shows laws of the Kingdom
    - Lets user enter venues screen
    - Lets user enter Kingdom screen
    - Lets user view information about themselves
*/


app.controller('HomeCtrl', 
    ['$http', '$rootScope', '$scope', '$state', '$ionicModal',
    function($http, $rootScope, $scope, $state, $ionicModal) {
      console.log("Initialized Home Controller");

      $scope.castle = {};
      $scope.castle = $rootScope.myCastle;

      

      $rootScope.$on('HourAdvanced', function(event, data){
        //Convert Time to english
        $rootScope.display.time = convertTimeTo12HourClock(data.hour, true);
        //Apply time change to scope
        $scope.$apply();
      });

      $rootScope.$on('NewDay', function(event, data){
        console.log("Received a New Day!");
        console.log(data);
      });


      

        

      //END METHODS
      

    }]
  );
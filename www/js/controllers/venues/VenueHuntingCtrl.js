app.controller('VenueHuntingCtrl', 
    ['$http', '$rootScope', '$scope', '$state', '$ionicModal',
    function($http, $rootScope, $scope, $state, $ionicModal) {

      //Save the current castle (avoids calling rootScope over and over again)
      var this_castle = $rootScope.currentCastle;
      $scope.purchased = false;

      $scope.has_overseer = false;
      $scope.type = "success";

      //Are the hunters working? (It is between the working hours)
      $scope.working = false;

      //Is the hunt running? (Player clicked Work or overseer is running it)
      var running = false;

      //Speed at which progress is made 
      var rate_of_completion = 10; //ms


      $scope.hours = this_castle.VENUES.HUNTING_GUILD.hours; //working hours
      $scope.progress = 0;                          //progress to completion
      
      //Amount to complete the job
      var complete_amt = 100;


      

      // Progress Bar
      var progressBar = new ProgressBar.Line('#venue-hunt-bar', {
        strokeWidth:3,
        color:"#33BB44",
        trailWidth:3
      });
      // ------- 


      $rootScope.$on('HourAdvanced', function(event, data){
        if(!$scope.purchased) return;
        //Convert Time to english
        if(data.hour >= $scope.hours[1]+1 || data.hour <= $scope.hours[0]-1){
          $scope.working = false;
          
        } else  {
          $scope.working = true;
        }
        $scope.$apply();
      });

      $rootScope.$on('NewDay', function(event, data){
        //data.day, season, year
      });

      //Player changes castles, update all variables
      $rootScope.$on('ChangedCastle', function(event, data){
        //TODO: this
      });



      $scope.purchase = function(){
        this_castle.PLAYER.coin -= 50;
        $scope.purchased = true;
      }
      
      

    }]
  );
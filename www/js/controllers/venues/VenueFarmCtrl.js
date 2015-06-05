app.controller('VenueFarmCtrl', 
    ['$http', '$rootScope', '$scope', '$state', '$ionicModal',
    function($http, $rootScope, $scope, $state, $ionicModal) {

      //Save the current castle (avoids calling rootScope over and over again)
      var this_castle = $rootScope.currentCastle;

      $scope.has_overseer = false;
      $scope.type = "success";

      //Are the farmers working? (It is between the working hours)
      $scope.working = false;

      //Is the farm running? (Player clicked Work or overseer is running it)
      var running = false;

      //Speed at which progress is made 
      var rate_of_completion = 10; //ms

      //Amount of progress made
      $scope.change_in_units = this_castle.VENUES.FARM.change;


      $scope.yield = this_castle.VENUES.FARM.yield; //foods
      $scope.hours = this_castle.VENUES.FARM.hours; //working hours
      $scope.progress = 0;                          //progress to completion
      
      //Amount to complete the job
      var complete_amt = 100;

      //Max number of workers the farm can have
      $scope.maxWorkers = this_castle.VENUES.FARM.farms * 5;

      //Cost of upgrading the farm and workers
      $scope.farmCost = Math.pow(4, this_castle.VENUES.FARM.farms);
      $scope.workerCost = Math.pow(4, this_castle.VENUES.FARM.workers);

      

      // Progress Bar
      var progressBar = new ProgressBar.Line('#venue-farm-bar', {
        strokeWidth:3,
        color:"#33BB44",
        trailWidth:3,
        text:{
          value:$scope.yield + " Food",
          color:"#000000"
        }
      });
      // ------- 


      //Upgrade
      $ionicModal.fromTemplateUrl('modals/farm-upgrade-modal.html', function(modal) {
        $scope.modal = modal;
      }, {
        scope: $scope,
        animation: 'slide-in-up'
      });

      // Open our new task modal
      $scope.showUpgrades = function() {
        console.log("Showing Upgrades");
        $scope.modal.show();
      };

      // Close the new task modal
      $scope.closeUpgrades = function() {
        $scope.modal.hide();
      };
      //


      $rootScope.$on('HourAdvanced', function(event, data){
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

        console.log(this_castle);

      });

      //Player changes castles, update all variables
      $rootScope.$on('ChangedCastle', function(event, data){
        //TODO: this
      });



      setInterval(function(){

        //Save data to castle
        $rootScope.currentCastle.VENUES.FARM = {
          yield:$scope.yield,
          change:$scope.change_in_units,
          hours:[6,20],
          food:this_castle.VENUES.FARM.food,
          active:true,
          farms:this_castle.VENUES.FARM.farms,
          workers:this_castle.VENUES.FARM.workers,
        };


        if(!running || !$scope.working) return;
        //If the workers are working, make progress
        if($scope.working){
          //Update progress bar
          progressBar.set($scope.progress/100);
          $scope.progress = $scope.progress + $scope.change_in_units;
        }


        if($scope.progress >= complete_amt){
          yieldProduct();
        }

      }, rate_of_completion);

      /**
        Increases the food gathered after working has been completed

      */
      function yieldProduct(){
        //Increase the food and reset progress
        this_castle.VENUES.FARM.food = this_castle.VENUES.FARM.food + $scope.yield;
        $scope.progress = 0;

        //Update progress bar
        progressBar.set($scope.progress/100);

        //If we have no overseer, stop running
        if(!$scope.has_overseer) running = false;

        //Update the scope
        $scope.$apply();
      }

      //Manual way to run the job
      $scope.work = function(){
        running = true;
      }

      //Upgrades
      $scope.purchaseOverseer = function(){
        $scope.has_overseer = true;
        running = true;
        this_castle.PLAYER.coin -= 10;
      }

      $scope.buyFarm = function(){
        this_castle.PLAYER.coin -= $scope.farmCost;
        if(this_castle.VENUES.FARM.farms >= this_castle.LIMITS.farms) return;
        this_castle.VENUES.FARM.farms += 1;
        $scope.maxWorkers = this_castle.VENUES.FARM.farms * 5;
        updateYield();
      }

      $scope.buyWorker = function(){
        this_castle.PLAYER.coin -= $scope.workerCost;
        if(this_castle.VENUES.FARM.workers >= $scope.maxWorkers) return;
        this_castle.VENUES.FARM.workers += 1;
        updateYield();
      }

      //Update the numbers for food and time
      function updateYield(){
        this_castle.VENUES.FARM.yield = (this_castle.VENUES.FARM.farms * 1);
        this_castle.VENUES.FARM.change = (this_castle.VENUES.FARM.workers * 0.5)/(this_castle.VENUES.FARM.farms);

        $scope.change_in_units = this_castle.VENUES.FARM.change;
        $scope.yield = this_castle.VENUES.FARM.yield;

        $(progressBar.text).html($scope.yield + " Food");

        $scope.farmCost = Math.pow(4, this_castle.VENUES.FARM.farms);
        $scope.workerCost = Math.pow(4, this_castle.VENUES.FARM.workers);
      }

      

    }]
  );
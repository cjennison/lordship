// Ionic Starter App
/** CONSTANTS **/
var SPEED_OF_DAY    = 1000,
    DAYS_IN_SEASON  = 90,
    HOURS_IN_DAY    = 24;

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('lordship', ['ionic', 'ui.bootstrap'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})
//Initial Setup Configurations
.run(['$rootScope', '$state', '$stateParams', '$anchorScroll', '$ionicSideMenuDelegate',
  function ($rootScope, $state, $stateParams, $anchorScroll, $ionicSideMenuDelegate) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.display = {};
    $rootScope.state = "state_HOME";


    //NOTE:
    /*

      These are Kingdom Variables that will need to be applied to their own class
      once the kingdom is developed. Taxes, Payments, and setup are Kingdom jobs
      Not the job of the

    */

    //NEW GAME SETUP
    $rootScope.coin = 10;
    $rootScope.events = [];
    $rootScope.newEvents = 0;


    //CASTLE SETUP
    $rootScope.castles = generateCastles(10);
    var myCastle = $rootScope.castles[Math.round(Math.random()*($rootScope.castles.length-1))];
    $rootScope.currentCastle = myCastle;

    //First item
    $rootScope.currentCastle.VENUES.FARM = {
      yield:1,
      change:0.5,
      hours:[6,20],
      active:true,
      farms:1,
      workers:1,
      food:0
    };

    $rootScope.currentCastle.PLAYER.coin = 55;

    //Navigation Controls
    $rootScope.goto_Venues = function(untoggle){
      console.log("Go to Venues");
      $rootScope.state = "state_VENUES";
      if(untoggle) $ionicSideMenuDelegate.toggleLeft();
    };

    $rootScope.goto_Stats = function(untoggle){
      console.log("Go to Stats");
      $rootScope.state = "state_STATS";
      if(untoggle) $ionicSideMenuDelegate.toggleLeft();
    };

    $rootScope.goto_Home = function(untoggle){
      console.log("Go to Castle");
      $rootScope.state = "state_HOME";
      if(untoggle) $ionicSideMenuDelegate.toggleLeft();
    };

    $rootScope.do_Taxes = function(){
      console.log("Doing Taxes");

      var total_earned_coin = 0,
          total_taxed_food = 0,
          total_purchased_food = 0;

      for(var i in $rootScope.castles){
        var castle = $rootScope.castles[i];
        var result = castle.takeFoodTaxes();
        if(result !== false){
          $rootScope.coin += result.earned_coin;
          total_earned_coin += result.earned_coin;
          total_taxed_food += result.taxed_food;
          total_purchased_food += result.purchased_food;
        }
      }

      var ev = new Event({
        title:$rootScope.day + " :Tax Day",
        text1:total_purchased_food + " Food was purchased",
        text2: "Earned " + total_earned_coin + " Coin"
      });

      addNewEvent($rootScope.events, ev);
      $rootScope.newEvents++;

    }

    $rootScope.pay_Employees = function(){
      for(var i in $rootScope.castles){
        var castle = $rootScope.castles[i];
        var farm_result = castle.payFarmEmployees();
        if(farm_result){
          addNewEvent($rootScope.events, farm_result);
          $rootScope.newEvents++;
        }
      }
    }




  }
])
//Day Runner
.run(['$rootScope', '$state', '$stateParams', '$anchorScroll',
  function ($rootScope, $state, $stateParams, $anchorScroll) {

    //TODO: Get Saved Day/Season/Time
    $rootScope.time = 5; 
    $rootScope.day = 1;
    $rootScope.season = 1;
    $rootScope.year = 0;

    //Runs the Daily Timer
    setInterval(function(){
      $rootScope.time++;

      //Emit Hour
      $rootScope.$emit("HourAdvanced", {
       hour:$rootScope.time 
      });
      if($rootScope.time >= HOURS_IN_DAY){
        //A new day has dawned
        $rootScope.time = 0;
        $rootScope.day++;
        if($rootScope.day > DAYS_IN_SEASON){
          $rootScope.season++;
          $rootScope.day = 1;
          if($rootScope.season > 4) {
            $rootScope.season = 1;
            $rootScope.year++;
          }
        }

        //Emit new day
        $rootScope.$emit("NewDay", {
          day:$rootScope.day, 
          season:$rootScope.season, 
          year:$rootScope.year
        });

        /*
        var ev = new Event({
          title:"New Day",
          text1:"Day: " + $rootScope.day + ", Season: " + $rootScope.season
        });
        addNewEvent($rootScope.events, ev);
        $rootScope.newEvents++;
        */

        //If the day is divisible by 7
        if($rootScope.day % 7 == 0){
          //It's payday
          $rootScope.pay_Employees();
        }

        //Take Taxes
        $rootScope.do_Taxes();

      }
    }, SPEED_OF_DAY);
  }
]);

app.controller('VenueCtrl', 
    ['$http', '$rootScope', '$scope', '$state', '$ionicSideMenuDelegate',
    function($http, $rootScope, $scope, $state, $ionicSideMenuDelegate) {



      $scope.toggleNavigation = function() {
        $ionicSideMenuDelegate.toggleLeft();
      };

      $scope.toggleEvents = function() {
        $ionicSideMenuDelegate.toggleRight();
        $rootScope.newEvents = 0;
      };

    }]
  );
function Castle(opts){

  this.TAX = opts.TAX;
  // FOOD, COIN
  this.LORD = opts.LORD;
  this.KINGDOM = opts.KINGDOM || "Kingdom of Caldominus";
  this.MORALE = Math.round(Math.random()*50) + 50;
  this.NAME = opts.NAME;
  this.COST = {
    food:1,
    armor:10,
    sword:8,
    pelt:3
    //Add more commodoties
  }

  //Generate Economy
  this.ECONOMY = {
    //Put stuff in the economy, please.
    food:200, //required to feed soldiers and royalty
    coin:2000 //required for all transactions
  }

  //Player Venues
  this.VENUES = {
    //Save the players work here
    FARM:{},
    BLACKSMITH:{},
    HUNTING_GUILD:{},
  }

  this.LIMITS = {
    farms:30
  }

  this.PLAYER = {
  }

  this.POPULATION = 100;
  this.takeFoodTaxes = function(){
    if(this.VENUES.FARM.active){
      
      //Reduce the amount of food by the tax
      var total_tax_food = Math.ceil(this.TAX.FOOD * this.VENUES.FARM.food);
      var remaining_food = this.VENUES.FARM.food - total_tax_food;

      //Purchase the remaining food needed
      //TODO: Make actual purchase mechanic
      var perc_to_purchase = Math.round(Math.random()*10 + 20)/100;
      var total_purchase_food = Math.ceil(remaining_food * perc_to_purchase);
      remaining_food = remaining_food - total_purchase_food;

      //Calculate coin profited
      var coin = total_purchase_food * this.COST.food;

      //Update the economy
      this.ECONOMY.food += total_tax_food;
      this.ECONOMY.coin -= coin;

      //Add coin to player's purse
      this.PLAYER.coin += coin;

      //Update the Venue
      this.VENUES.FARM.food = remaining_food;


      //Return information for the event
      return {
        earned_coin:coin,
        taxed_food:total_tax_food,
        purchased_food:total_purchase_food
      }
    } else {
      return false
    }
    
  };

  this.payFarmEmployees = function(){
      //FARM
      if(this.VENUES.FARM.active){
        var work_cost = this.VENUES.FARM.workers * 1;
        var ev;

        if(this.PLAYER.coin < work_cost){
          ev = new Event({
            title:"Pay Failure",
            text1:"Could not pay" + work_cost + " coins",
            text2:"for work. Morale drops."
          });
        } else {
          ev = new Event({
            title:"Farm Payday",
            text1:"Paid " + this.VENUES.FARM.workers + " farmers " + work_cost + " coins."
          });
          this.PLAYER.coin -= work_cost;
        }

        return ev;
      }
      return null;
    }
        
}


function generateCastles(num){
  var castles = [];
  for(var i = 0;i < num; i++){
    var opts = {
      TAX:{
        FOOD:(Math.round(Math.random()*10) + 1)/100,
        COIN:(Math.round(Math.random()*15) + 1)/100 
      },
      LORD:generateRandomLord(),
      NAME:generateRandomCastleName()
    }
    castles.push(new Castle(opts));
  }

  return castles;
}



function generateRandomLord(){
  var names = ["Bootyus", "Hoornian", "Debianum", "Geronimon", "Oxyndonus", "Cembralatus"];
  var titles = ["North", "South", "East", "West"];

  return names[Math.round(Math.random()*names.length-1)] + " of the " + titles[Math.round(Math.random()*titles.length-1)]

}

function generateRandomCastleName(){
  var familyNames = ["Winterguard", "Summerneck", "Havenfeld", "Oxenford", "Joggenwarn", "Horpensok", "UgUgBigCastle"];

  return familyNames[Math.round(Math.random()*(familyNames.length-1))]
}
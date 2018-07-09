function Character(name, life, damage){
  this.name = name;
  this.life = life;
  this.damage = damage;
  this.maxLife = life;
  this.counter = 2;
  this.maxCounter = 2;
  this.potionCounter = +(Math.random() > 0.7) * 2;
}

Character.prototype.setLife = function(dmg) {
  this.life -= dmg; 
}

Character.prototype.getDamage = function() {
  return this.damage; 
}

Character.prototype.attack = function(obj) {
  obj.setLife(this.getDamage()); 
}

Character.prototype.isAlive = function() {
  return this.life > 0; 
}

Character.prototype.getLife = function() {
  return this.life;
}

Character.prototype.renewLife = function() { 
  this.life = this.maxLife;
}

Character.prototype.renewCounter = function() {
	this.counter = this.maxCounter;
}

Character.prototype.shouldUseSkill = function() {
  return (this.life < this.maxLife / 2 && this.counter > 0); 
}

Character.prototype.shouldUsePotion = function() {
  return (this.life < this.maxLife / 2 && this.potionCounter > 0);
}


function Hero () {
  Character.apply(this, arguments);
}

Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

function RobberFactory(name) {
  return new Hero(name, 350, 20);
}

function FighterFactory(name) {
  return new Hero(name, 280, 50);
}

function WizardFactory(name) {
  return new Hero(name, 250, 40);
}

Hero.prototype.setLife = function(dmg) { 
  if ( this.shouldUseSkill() ) { 
    this.counter--;   
  } else {
      this.life -= dmg;
    } 
}

Hero.prototype.getDamage = function() {
  if ( this.shouldUsePotion() ) {
    this.potionCounter--;
    return this.damage * 2;
  }
  return this.damage;
}


function Monster () {
  Character.apply(this, arguments);
}

Monster.prototype = Object.create(Character.prototype);
Monster.prototype.constructor = Monster;

function GoblinFactory(name) {
  return new Monster(name, 220, 60);
}

function OrksFactory(name) {
  return new Monster(name, 350, 20);
}

function VampireFactory(name) {
  return new Monster(name, 300, 30);
}

function EmptyMonsterFactory() {
  return new Monster('Empty', 1, 0);
}

Monster.prototype.getDamage = function() { 
  if ( this.shouldUseSkill() ) {
    this.counter--;
    return this.damage * 2;
  }
  return this.damage;
}

Monster.prototype.setLife = function(dmg) {
  if ( this.shouldUsePotion() ) {
    this.potionCounter--;   
  } else {
      this.life -= dmg;
    }     
}


function Game(firstPlayer, secondPlayer) {
  this.firstPlayer = firstPlayer;
  this.secondPlayer = secondPlayer;
  this.firstPlayer.renewLife();
  this.secondPlayer.renewLife();
  this.firstPlayer.renewCounter();
  this.secondPlayer.renewCounter();
}

Game.prototype.fight = function() { 
  while (this.firstPlayer.isAlive() && this.secondPlayer.isAlive()) { 
    this.firstPlayer.attack(this.secondPlayer);
    this.secondPlayer.attack(this.firstPlayer);
  }
}

Game.prototype.getWinner = function() {
  this.fight();
  console.log('- ' + this.firstPlayer.name + ' VS ' + this.secondPlayer.name);

  let currentWinner = this.firstPlayer;
  if (this.secondPlayer.isAlive()) {
    currentWinner = this.secondPlayer;
  }
  console.log('-- The winner is ' + currentWinner.name);
  return currentWinner;
}

function Tournament(playersNumber, validHeroNames, validMonsterNames) {
  this.playersNumber = playersNumber;
  this.validHeroNames = validHeroNames;
  this.validMonsterNames = validMonsterNames;
  this.registratedPlayers = [];
}

Tournament.prototype.registration = function(player) {
  if (this.registratedPlayers.length == this.playersNumber) {
    console.log('Tournament is full');
    return;
  }
  if ( (player instanceof Hero) && (this.validHeroNames.indexOf(player.name) > -1) ) {
    this.registratedPlayers.push(player);
    console.log('Player ' + player.name + ' is registrated');
  }
  else if ( (player instanceof Monster) && (this.validMonsterNames.indexOf(player.name) > -1) ) {
    this.registratedPlayers.push(player);
    console.log('Player ' + player.name + ' is registrated');
  }
  else console.log('Player ' + player.name + ' is not permitted');
} 

Tournament.prototype.getListOfGames = function(playersList) {
  let listOfGames = [];
  for (let i = 0; i < playersList.length; i += 2) {
    listOfGames.push( new Game(playersList[i], playersList[i+1]) );
  }
  return listOfGames;
}

Tournament.prototype.simulate = function() {
  stillAlivePlayers = this.registratedPlayers.slice();
  while (stillAlivePlayers.length > 1) {
    console.log('');
    console.log('In a current round...');
    let listOfWinners = [];
    if (stillAlivePlayers.length % 2 == 1) {
      stillAlivePlayers.push(EmptyMonsterFactory());
    }
    let roundGames = this.getListOfGames(stillAlivePlayers);
    for (let i = 0; i < roundGames.length; i++) {
      listOfWinners.push(roundGames[i].getWinner());
    }
    stillAlivePlayers = listOfWinners;
  }
  console.log(stillAlivePlayers[0].name + ' IS A ABSOLUTELY CHAMPION');
}

const allowedHero = ['Bronislav', 'Stepan', 'Anatoliy'];
const allowedMonster = ['Antoha', 'Kolyan','Gosha'];

const Tour = new Tournament(5, allowedHero, allowedMonster);

Tour.registration(GoblinFactory('Gosha'));
Tour.registration(FighterFactory('Anatoliy'));
Tour.registration(RobberFactory('Serezha'));
Tour.registration(OrksFactory('Kolyan'));
Tour.registration(WizardFactory('Bronislav'));
Tour.registration(VampireFactory('Antoha'));
Tour.registration(WizardFactory('Stepan'));

Tour.simulate();
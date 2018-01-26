'use strict';

var PlayScene = require('./play_scene.js');
var IntroMenu = require('./IntroMenu');
var EndMenu = require('./EndMenu');
var WinMenu = require('./WinMenu');

var BootScene = {
  preload: function () {
  },

  create: function () {
    this.game.state.start('preloader');
  }
};

var PreloaderScene = {
  preload: function () {
   // this.game.load.baseURL = 'https://bornunez.github.io/undefined/src';
    
    //this.game.load.crossOrigin = 'anonymous';

    //Carga los sonidos
    this.game.load.audio('intro_theme', '/music/intro_theme.mp3');
    this.game.load.audio('game_theme', '/music/game_theme.mp3');
    this.game.load.audio('gameover_theme', '/music/gameover_theme.mp3');
    this.game.load.audio('boss_theme', '/music/boss_theme.mp3');
    this.game.load.audio('win_theme', '/music/win_theme.mp3');
    this.game.load.audio('kill_enemy', '/music/kill_enemy.mp3');
    this.game.load.audio('hero_attack', '/music/hero_attack.mp3');
    this.game.load.audio('hero_hurt', '/music/hero_hurt.mp3');
    this.game.load.audio('hero_arrow_shoot', '/music/hero_arrow_shoot.mp3');
    this.game.load.audio('hero_arrow_hit', '/music/hero_arrow_hit.mp3');
    this.game.load.audio('pick_rublo', '/music/pick_rublo.mp3');
    this.game.load.audio('pick_item', '/music/pick_item.mp3');
    this.game.load.audio('cyclops_awake', '/music/cyclops_awake.mp3');
    this.game.load.audio('open_chest', '/music/open_chest.mp3');
    this.game.load.audio('open_door', '/music/open_door.mp3');
    //Abrir y cerrar inventario
    this.game.load.audio('open_pause', '/music/open_pause.mp3')
    this.game.load.audio('close_pause', '/music/close_pause.mp3')

    //Carga de imagenes individuales
    this.game.load.image('trigger','/images/trigger.png');
    this.game.load.image('door','/images/Puertas.png');
    this.game.load.image('HUD', '/images/HUD.png');
    this.game.load.image('arrow', '/images/arrow.png');
    this.game.load.image('arrowicon', '/images/arrowicon.png');
    this.game.load.image('rublos', '/images/rublos.png');
    this.game.load.image('keys', '/images/keys.png');
    this.game.load.image('keybossicon','/images/keyboss.png');
    this.game.load.image('playButton','/images/playButton.png');
    this.game.load.image('bossDoor','/images/boss_door.png');
    this.game.load.image('lockedDoor','/images/locked_door.png');
    this.game.load.image('asciiforce','/images/asciiforce.png');

    //Carga de spritesheets
    this.game.load.spritesheet('inventory','/images/inventory.png', 256, 222, 2);
    this.game.load.spritesheet('itembox', '/images/itembox.png', 22, 22, 2);
    this.game.load.spritesheet('hearts', '/images/hearts.png', 8, 8, 3);
    this.game.load.spritesheet('numbers', '/images/numbers.png',8,8, 10);
    this.game.load.spritesheet('chest', '/images/chest.png', 32, 24, 2);

    //Carga de spritesheets mediante json para las animaciones
    this.game.load.atlas('bossAnimations', '/images/bossspritesheet.png', '/json/bossspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('cyclopsAnimations', '/images/cyclopsspritesheet.png', '/json/cyclopsspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('heroAnimations', '/images/herospritesheet.png', '/json/herospritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('enemyAnimations', '/images/enemyspritesheet.png', '/json/enemyspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('swordAnimations', '/images/swordspritesheet.png', '/json/swordspritesheet.json',  Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
   
    //Mapa
    this.game.load.tilemap('map', '/mapas/EastPalace1.json',null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', '/mapas/TileSet32.png');
    this.game.load.image('objetos', '/mapas/TileSet16.png');
  },

  create: function () {
    //Comienza la musica
    this.game.state.start('introMenu');
  }
};


window.onload = function () {
  var game = new Phaser.Game(1080, 720, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader' , PreloaderScene);
  game.state.add('introMenu',IntroMenu);
  game.state.add('play', PlayScene);
  game.state.add('end', EndMenu);
  game.state.add('win', WinMenu);

  game.state.start('boot');
};

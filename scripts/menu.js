define(function () {
    'use strict';
    var game;

    function Menu(_game) {
        game = _game;
    }

    Menu.prototype = {
        preload: function () {
            this.load.image('menu', 'media/backgrounds/mainMenu.png');
            this.load.spritesheet('btn-game-start', 'media/buttons/btn-game-start.png', 401, 143);
        },

        create: function () {
            this.input.keyboard.createCursorKeys();
            this.background = this.add.tileSprite(0, 0, game.width, game.height, 'menu');

            this.add.button(580, 200, 'btn-game-start', this.startGame, this, 1, 0, 2);
        },

        update: function () {
        },

        startGame: function () {
            this.game.state.start('game');
        }
    };

    return Menu;
});

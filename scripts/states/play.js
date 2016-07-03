define(['extensions/Container'], function (Container) {
    'use strict';

    var game;

    var map;
    var tileset;
    var tileSize;
    var layer;
    var player;
    var facing = 'right';
    var jumpTimer = 0;
    var cursors;
    var jumpButton;
    var digButton;

    function Play(_game) {
        game = _game;
    }

    Play.prototype = {
        preload: function () {
            game.load.tilemap('map', 'assets/tilemaps/maps/map_data.json', null, Phaser.Tilemap.TILED_JSON);

            game.load.spritesheet('ground', 'assets/tilemaps/tiles/ground.png', 32, 32);
            game.load.spritesheet('tiles', 'assets/tilemaps/tiles/tiles.png', 32, 32);

            game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
            game.load.spritesheet('droid', 'assets/games/starstruck/droid.png', 32, 32);
            game.load.image('starSmall', 'assets/games/starstruck/star.png');
            game.load.image('starBig', 'assets/games/starstruck/star2.png');
        },

        create: function () {

            game.physics.startSystem(Phaser.Physics.ARCADE);

            game.stage.backgroundColor = '#000000';

            tileSize = 32;

            map = game.add.tilemap('map');

            map.addTilesetImage('ground', 'ground');
            map.addTilesetImage('tiles', 'tiles');

            map.setCollisionBetween(2, 3);

            map.setTileIndexCallback(3, this.hitCoin, this);

            layer = map.createLayer('Tile Layer 1');

            //  Un-comment this on to see the collision tiles
            layer.debug = false;

            //layer.resizeWorld();

            game.physics.arcade.gravity.y = 250;

            player = game.add.sprite(32, 32, 'dude');
            sprite.anchor.set(0.5);
            game.physics.enable(player, Phaser.Physics.ARCADE);

            player.body.bounce.y = 0.2;
            player.body.collideWorldBounds = true;
            player.body.setSize(20, 32, 5, 16);

            player.animations.add('left', [0, 1, 2, 3], 10, true);
            player.animations.add('turn', [4], 20, true);
            player.animations.add('right', [5, 6, 7, 8], 10, true);

            game.camera.follow(player);

            cursors = game.input.keyboard.createCursorKeys();
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            digButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
        },

        update: function () {

            game.physics.arcade.collide(player, layer);

            player.body.velocity.x = 0;

            if (cursors.left.isDown) {
                player.body.velocity.x = -150;

                if (facing != 'left') {
                    player.animations.play('left');
                    facing = 'left';
                }
            }
            else if (cursors.right.isDown) {
                player.body.velocity.x = 150;

                if (facing != 'right') {
                    player.animations.play('right');
                    facing = 'right';
                }
            }
            else {
                if (facing != 'idle') {
                    player.animations.stop();

                    if (facing == 'left') {
                        player.frame = 0;
                    }
                    else {
                        player.frame = 5;
                    }

                    facing = 'idle';
                }
            }

            if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
                player.body.velocity.y = -250;
                jumpTimer = game.time.now + 750;
            }

            if (digButton.isDown) {
                var xTile = Math.floor(player.x / tileSize);
                var yTile = Math.floor(player.y / tileSize);

                console.log("x, y " + xTile + " " + yTile);
                var tile = map.getTile(xTile, yTile + 2, layer, true);
                console.log(tile);

                if (tile.index != -1) {
                    map.putTile(-1, xTile, yTile + 2);
                    layer.dirty = true;
                }
            }
        },

        hitCoin: function (sprite, tile) {
            var xTile = tile.x;
            var yTile = tile.y;

            console.log("hit Coin " + xTile + " " + yTile);

            map.putTile(1, xTile, yTile);
            layer.dirty = true;

            return false;
        },

        render: function () {

            // game.debug.text(game.time.physicsElapsed, 32, 32);
            // game.debug.body(player);
            // game.debug.bodyInfo(player, 16, 24);

        }
    };

    return Play;
});
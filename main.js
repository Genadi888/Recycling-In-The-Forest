'use strict'

/* 
    * © Genadi Fidanov, gf32716973@edu.mon.bg
    * All rights reserved.
*/

console.log("You are playing Recycling In The Forest, enjoy your stay!\n© Genadi Fidanov, gf32716973@edu.mon.bg");

let map;

let dude;
let dude2;

let currentItem;

let cursors;

let keyW;
let keyA;
let keyS;
let keyD;
let keyESC;
let keyENTER;

let groundLayer;
let dudeKgs = 0;
let dude2Kgs = 0;

let text;
let text2;
let text3;
let style;
let style2;
let style3;

let volumeText;
let volumeTextStyle;

let gameHasFinished = false; //? boolean, който отчита дали играта е спечелена или не

let dudePickupSound;
let dude2PickupSound;
let music1;
let music2;
let winSound;
let powup;
let congratsMelody;
let calmMusic;
let calmMusicIsPlaying = false;

let mushroom;

let blockLog;
let warningBubble;

let background;

const game = new Phaser.Game(
    832,
    576,
    Phaser.CANVAS,
    '', {
    preload,
    create,
    update,
    render
}
);

let dude1VelX = 200;
let dude1VelY = 200;
let dude2VelX = 200;
let dude2VelY = 200;

let mushroomX = 900; //? x е 900 за да не може да се стигне гъбката, когато не трябва
let mushroomY = 0;

let playtimeTimer;
let mushTimerSpawn;
let mushTimerDestroy;

let masterVolIcon;
let masterVolButton;
let masterVolButtonClicked = false;
let gameAudioIsMuted = false;

let volumeAdjustSprite;

let lowerVolButton;
let lowerVolButtonClicked = false;

let increaseVolButton;
let increaseVolButtonClicked = false;

let playtimeTimerEnded = false;

let randomItemIndex;
let isForGreen;
let isForBlue;
let isForYellow;

let copyrightTextStyle;
let copyrightText;

let welcomeTextStyle;
let welcomeText;

let startButton;
let helpButton;
let creditsButton;

let menuBackground;

let recycleLogo; //! left
let recycleLogo2; //! right
let recycleLogosYpos = -80;

let recycleLogoXpos = game.width / 2 - 85;
let recycleLogo2Xpos = recycleLogoXpos + 200;

let gameHasStarted = false;

let helpTextContent = "Instructions on how to play:\n\n Controls:\n Use the arrow/WASD keys to move the players.\nIn the top right corner you can adjust the volume.\n\n Main gameplay:\n The two players need to clean the forest from the constantly spawning trash\n in the span of 3 minutes. Each object has its own weight\n and will be added to a player's total when collected.\n Once in a while a mushroom appears, which\n when collected will give a speed-boost. When\n the time runs out a dialog box comes down\n and each player will have to complete a recycling process.\n\nEnjoy playing the game :) !\n\nPress ESC to go back to the welcome screen.";
let creditsTextContent = `Recycle items art by Clint Bellanger,\n"mushroom" sf by "dklon",\n"calm music" by "Aspecty",\n"pickup sound" by M. Baradari,\ncredit for "recycling music"\ngoes to www.screenhog.com.`;
let inHelpScene = false;
let inCreditsScene = false;

let dialogBox;

let canClick = false;
let dialogBoxCreated = false;

let bins;
let draggingItem;
let dialogBoxText;
let dialogBoxTextStyle;
let congratsText;
let congratsTextStyle;
let creditsText;
let creditsTextStyle;
let helpText;
let helpTextStyle;

let defWindowText = "Drag the item into a container.";

let dragItemBinTypeArray = ['isForBlue', 'isForGreen', 'isForYellow', 'isForBlue', 'other', 'isForGreen', 'isForGreen', 'isForBlue', 'isForBlue', 'isForYellow', 'isForYellow', 'isForYellow', 'isForYellow', 'isForYellow', 'isForYellow', 'isForYellow'];
let draggingItemIndex = 0;

let draggingIsDone = false; //? един местещ опит е завършен
let P1FinishedProcess = false; //? първият играч е завършил разделното събиране

let clickedOnCenter = false; //? този boolean разрешава местенето на предмета само ако първонач. се е кликнало върху него

let gameHasCreatedEverything = false;
let gameEnded = false;

let startTime;
let totalTime;
let timeElapsed;
let gameTimer;
let timeLabel;

let windowFinishedTravelling = false;


function preload() {
    game.load.tilemap('tilemap', './tilemap/forest_place.json', null, Phaser.Tilemap.TILED_JSON) //зареждаме картата
    game.load.image('grass', './images/grass_background.png');
    game.load.spritesheet('dude_key', './images/red_dude.png', 272 / 4, 288 / 4);
    game.load.spritesheet('dude_green_key', './images/green_dude.png', 272 / 4, 288 / 4);
    game.load.spritesheet('master_volume_icon', './images/volume_sprite.png', 690 / 2, 286 / 1);
    game.load.spritesheet('recycle_items', './images/recycle_items_spritesheet.png', 1024 / 16, 64 / 1);
    game.load.spritesheet('menu_buttons_sprite_key', './images/menu_buttons_sprite.png', 1200 / 3, 200 / 1);
    game.load.spritesheet('recycled_items', './images/household_items_sprite.png', 960 / 10, 96 / 1);
    game.load.spritesheet('bins', './images/bins_sprite.png', 96 / 3, 32 / 1);
    game.load.spritesheet('volume_adjust_buttons', './images/volume_adjust_buttons_sprite.png', 200 / 2, 100 / 1);
    game.load.image('block', './images/improved_bar.png');
    game.load.image('tileset', './images/32x32_tileset_terrains_shops.png');
    game.load.image('mushroom_key', './images/mushroom.png');
    game.load.image('menu_background', './images/menu_background.png');
    game.load.image('recycle_logo', './images/recycle_logo.png');
    game.load.image('dialog_box', './images/dialog_box.png');
    game.load.image('grass_objects_key', './images/tiles.png');
    game.load.image('block_log_key', './images/block_log.png');
    game.load.image('warning_bubble_key', './images/warning_bubble.png');
    game.load.image('brush_key', './images/cleaning_brush.png');
    game.load.image('steve_key', './images/steve.png');
    game.load.audio('pickup_sound', './audio/pickup_sound.wav');
    game.load.audio('powUp_sound', './audio/powup_sound.wav');
    game.load.audio('plant_music', './audio/plant_music.mp3');
    game.load.audio('congrats_melody', './audio/congrats_melody.ogg');
    game.load.audio('calm_music', './audio/calm_music.mp3');
}

function render() {
    // if (gameHasStarted) {
    //     game.debug.body(dude);
    // game.debug.body(dude2);
    //     game.debug.body(groundLayer);

    // }
}

function create() {
    welcomeScreen(); //? създаваме първоначалното меню
}

let recycledItemsFrame = 0;
let groupedItemsInWindow = 0;

let dude2IsFollowed = true;
let pathUnblocked = false;
let bubbleAppeared = false;

let bubbleTravelled = false;
let signsInfoBoxAppeared = false;
let signsInfoBox;

let signsInfoBoxGroup;
let signsInfoBoxText;

let brushPicked = false;
let playerMovementBlocked = false;

function signsInfoBoxCreate() {
    signsInfoBoxGroup = game.add.group();

    signsInfoBox = game.add.sprite(940, 940, 'dialog_box');
    signsInfoBox.anchor.setTo(0.5, 1);
    signsInfoBox.scale.setTo(0.5);
    signsInfoBox.height = signsInfoBox.height / 2;

    const signsInfoBoxTextStyle = { font: "13px Bahnschrift", fill: "#ffffff", align: 'center' };
    signsInfoBoxText = game.add.text(signsInfoBox.x, signsInfoBox.y - 50, "Go north-east to find the laundry shop.\nThere you can get a brush and clean\nyour dirty items before you give them\nfor recycling.", signsInfoBoxTextStyle);
    signsInfoBoxText.anchor.setTo(0.5)

    signsInfoBoxGroup.add(signsInfoBox);
    signsInfoBoxGroup.add(signsInfoBoxText);

    signsInfoBoxAppeared = true;
}

let cleaningBox;
let cleaningBoxText;
let cleaningBoxGroup;
let itemToClean;
let player1Cleaned = false;

function itemCleaning(itemIndexToClean) {
    if (itemIndexToClean > 15) {
        if (player1Cleaned) {
            cleaningBoxText.setText("You cleaned them all!\nNow you may recycle the items.");
            setTimeout(() => {
                cleaningBoxGroup.kill();  //? край на почистването
                playerMovementBlocked = false;
                game.canvas.style.cursor = "default";
            }, 3000);
            return;
        }

        cleaningBoxText.setText("You cleaned them all!\nNow it's your opponent's turn.");
        setTimeout(() => {
            player1Cleaned = true;
            cleaningBoxText.setText("Click on the item to clean it")
            setTimeout(() => {
                cleaningBoxText.setText("")
            }, 3000);
            itemCleaning(0); //? започни отначало
        }, 3000);
        return;
    }
    if (itemIndexToClean === 4) {
        itemCleaning(itemIndexToClean + 1);
        return;
    }

    itemToClean = game.add.sprite(game.camera.x + game.width / 2, game.camera.y + game.height / 2, 'recycle_items');
    itemToClean.anchor.setTo(0.5);
    itemToClean.scale.setTo(2);

    cleaningBoxGroup.add(itemToClean);

    const tintValuesCopy = tintValuesArray.slice();
    itemToClean.frame = itemIndexToClean;
    itemToClean.tint = tintValuesCopy.shift();
    itemToClean.inputEnabled = true;

    itemToClean.events.onInputDown.add(() => {
        itemToClean.tint = tintValuesCopy.shift();
        if (tintValuesCopy.length <= 0) {
            itemToClean.kill();
            itemCleaning(itemIndexToClean + 1);
            return;
        }
    }, this);
}

const tintValuesArray = [0x313131, 0x3D3D3D, 0x4C4C4C, 0x5F5F5F, 0xffffff]

function cleaningPart() {
    playerMovementBlocked = true;
    dude2.body.velocity.x = 0;
    dude2.body.velocity.y = 0;
    dude2.animations.stop()

    cleaningBoxGroup = game.add.group();

    cleaningBox = game.add.sprite(game.camera.x + game.width / 2, game.camera.y + game.height / 2, 'dialog_box');
    cleaningBox.anchor.setTo(0.5);
    cleaningBoxGroup.add(cleaningBox);

    cleaningBoxText = game.add.text(cleaningBox.x, cleaningBox.y - 150, "Click on the item to clean it", 
    { font: "24px Bahnschrift", fill: "#FFFFFF", align: "center" })
    cleaningBoxText.anchor.setTo(0.5, 0)
    cleaningBoxGroup.add(cleaningBoxText);
    
    setTimeout(() => {
        cleaningBoxText.setText("");
    }, 3000);

    itemCleaning(0); //? като параметър даваме индекс на предмета за почистване
    
    game.canvas.style.cursor = "url(images/cleaning_brush.png), auto";

    // document.getElementsByTagName().style.cursor = "pointer";


    // game.canvas.style.cursor = "grabbing"

    // const tableElement = document.querySelector('#canvas');
    // const tableStyle = getComputedStyle(tableElement);
    // const tableOpacity = parseFloat(tableStyle.opacity);
    // tableElement.style.cursor = "url(images/cleaning_brush_cursor.png), auto";
    // const cursorProperty = document.getElementsByTagName("canvas").style.border = "5px solid black"
}

function update() {
    if (brushPicked && (dude2.x >= 1529 && dude2.x <= 1545) && (dude2.y >= 156 && dude2.y <= 179)) {
        cleaningPart();
        brushPicked = false;
    }

    if (playtimeTimerEnded && (dude2.x >= 1785 && dude2.x <= 1800) && (dude2.y >= 156 && dude2.y <= 166)) {
        brush.kill();
        brushPicked = true;
    }

    if (!bubbleAppeared && pathUnblocked && (dude2.x >= 588 && dude2.x <= 1115) && (dude2.y >= 832 && dude2.y <= 1159)) {
        // console.log(dude2.x);
        warningBubble = game.add.sprite(930, 940, 'warning_bubble_key');
        bubbleAppeared = true;
    }

    if (bubbleAppeared) {
        // const bubbleTween = game.add.tween(warningBubble).to({ y: 900 }, 2000, Phaser.Easing.Bounce.Out, true);
        // bubbleTween.onComplete.add(() => {
        //     // game.add.tween(warningBubble).to({ y: 940 }, 1000, Phaser.Easing.Linear.None, true);
        // }, this);

        if (!bubbleTravelled && warningBubble.y >= 930) {
            warningBubble.y -= 0.2;
            // console.log(warningBubble.y);

            if (warningBubble.y <= 930) {
                bubbleTravelled = true;
            }
        }
        if (bubbleTravelled) {
            warningBubble.y += 0.2;
            // console.log(warningBubble.y);

            if (warningBubble.y >= 940) {
                bubbleTravelled = false;
            }
        }

        if (!((dude2.x >= 588 && dude2.x <= 1115) && (dude2.y >= 832 && dude2.y <= 1159))) {
            warningBubble.alpha = 0;
        } else {
            warningBubble.alpha = 1;
        }

        if ((dude2.x >= 914 && dude2.x <= 974) && (dude2.y >= 1020 && dude2.y <= 1022)) {
            warningBubble.alpha = 0;
            if (!signsInfoBoxAppeared) {
                signsInfoBoxCreate();
            }
        } else {
            // warningBubble.alpha = 1;
            if (signsInfoBoxAppeared) {
                signsInfoBoxGroup.kill()
                signsInfoBoxAppeared = false;
            }
        }
    }


    if (inHelpScene) {
        dude.animations.play('right');
        dude2.animations.play('left');
    }

    if (recycledItemsFrame >= 10) { //? ако всички рециклирани предмети в спрайта са се изредили, не създавай повече предмети
        recycledItemCreateInterval.stop();
    }

    if (gameEnded) { //? тук рециклираните отпадъци може да се блъскат взаимно
        game.physics.arcade.collide(recycledItemsGroup, recycledItemsGroup);
    }

    if (canClick && !draggingIsDone) { //? ако имаме разрешение да кликваме и не сме приключили местенето на отпадъци, изпълняваме функцията
        draggingAndDroppingItem();
        // if (!groupedItemsInWindow) {
        // groupItemsInWindow();
        //     groupedItemsInWindow = true;
        // }
    }

    if (dialogBoxCreated) {
        createDialogBoxPart();
    }

    if (!gameHasStarted) {
        recycleLogo.angle += 1;
        recycleLogo2.angle += 1;
    }

    if (gameHasStarted) {
        if (!gameHasCreatedEverything) {
            createPlayablePart();
        }

        // masterVolButton.y = game.camera.y
        // masterVolButton.x = game.camera.x

        if (gameHasFinished || dialogBoxCreated) {
            mushTimerSpawn.stop();
            currentItem.kill()
        }

        game.physics.arcade.collide(dude, mushroom, collisionHandler1, null, this);
        game.physics.arcade.collide(dude2, mushroom, collisionHandler2, null, this);

        if (timeElapsed >= totalTime && !windowFinishedTravelling && !playtimeTimerEnded) { //? ако времето на главния таймер е изтекло, зануляваме текста и преминаваме към следващата фаза на играта
            text3.setText("00:00")
            playtimeTimerEnded = true;

            // dude.body.velocity.y = 0; //? забраняваме движението на играчите и спираме анимациите
            // dude.body.velocity.x = 0;
            // dude2.body.velocity.y = 0;
            // dude2.body.velocity.x = 0;
            // dude.animations.stop()
            // dude2.animations.stop()

            console.log('playtime ended!');

            game.camera.fade(null, 1000)
            setTimeout(() => {
                game.camera.fadeIn(null, 1000)
                blockLog.kill();
                pathUnblocked = true;
            }, 3000);
            // game.camera.onFadeComplete.add(() => , this);

            // setTimeout(() => {
            //    dialogWindow();
            // }, 1000);
        }

        if (game.physics.arcade.collide(dude, groundLayer) == true) {
            dude.immovable = true;
        } else {
            dude.immovable = false;
        }

        if (game.physics.arcade.collide(dude2, groundLayer) == true) {
            dude2.immovable = true;
        } else {
            dude2.immovable = false;
        }

        text.setText("Player 1's Kgs: " + dudeKgs.toFixed(3));  //? с тези два реда всеки текст вече се актуализира с резултатите на играчите
        text2.setText("Player 2's Kgs: " + dude2Kgs.toFixed(3));

        clicksHandler();

        game.scale.refresh();
        game.physics.arcade.collide(dude, dude2)
        game.physics.arcade.collide(dude, blockLog)
        game.physics.arcade.collide(dude2, blockLog)

        itemCollect(); //? с тази функция отпадъците се взимат

        if (!playerMovementBlocked) { //? ако времето на таймера свърши, забрани движението
            if (cursors.up.isDown) {
                dude.body.velocity.y = - dude1VelY;
                dude.body.velocity.x = 0;
                dude.animations.play('up')
            }
            else if (cursors.down.isDown) {
                dude.body.velocity.y = dude1VelY;
                dude.body.velocity.x = 0;
                dude.animations.play('down')
            }
            else if (cursors.left.isDown) {
                dude.body.velocity.x = -dude1VelX;
                dude.body.velocity.y = 0;
                dude.animations.play('left')
            }
            else if (cursors.right.isDown) {
                dude.body.velocity.x = dude1VelX;
                dude.body.velocity.y = 0;
                dude.animations.play('right')
            }
            else {
                dude.body.velocity.x = 0;
                dude.body.velocity.y = 0;
                dude.animations.stop();
            }

            if (keyW.isDown) {
                dude2.body.velocity.y = - dude2VelY;
                dude2.body.velocity.x = 0;
                dude2.animations.play('up')
            }
            else if (keyS.isDown) {
                dude2.body.velocity.y = dude2VelY;
                dude2.body.velocity.x = 0;
                dude2.animations.play('down')
            }
            else if (keyA.isDown) {
                dude2.body.velocity.x = -dude2VelX;
                dude2.body.velocity.y = 0;
                dude2.animations.play('left')
            }
            else if (keyD.isDown) {
                dude2.body.velocity.x = dude2VelX;
                dude2.body.velocity.y = 0;
                dude2.animations.play('right')
            }
            else {
                dude2.body.velocity.x = 0;
                dude2.body.velocity.y = 0;
                dude2.animations.stop();
            }
        }
    }
}

const createMap = function () {
    map = game.add.tilemap('tilemap') //? създаваме я като променлива, името го взимаме от load
    map.addTilesetImage('shop_stuff', 'tileset') //? първото е името на tileset-а (намира се в .json файла), второто ключа на image.png
    // map.createLayer('uncollidable layer')
    groundLayer = map.createLayer('Layer 1') //? кой леър искам да нарисувам, пъврият винаги ще се сблъсква с човечето
    map.createLayer('Layer 2')

    map.setCollisionByExclusion([])
    game.physics.enable(groundLayer);
}

const createPlayers = function () {
    dude = game.add.sprite(game.width / 2 + 35, game.height / 2, 'dude_key');
    dude.anchor.setTo(0.5);
    dude.frame = 10;
    dude.animations.add('left', [4, 5, 6, 7], 5, true);
    dude.animations.add('right', [8, 9, 10, 11], 5, true);
    dude.animations.add('up', [12, 13, 14, 15], 5, true);
    dude.animations.add('down', [0, 1, 2, 3], 5, true);

    dude2 = game.add.sprite(game.width / 2 - 35, game.height / 2, 'dude_green_key');
    dude2.anchor.setTo(0.5);
    dude2.frame = 6;
    dude2.animations.add('left', [4, 5, 6, 7], 5, true);
    dude2.animations.add('right', [8, 9, 10, 11], 5, true);
    dude2.animations.add('up', [12, 13, 14, 15], 5, true);
    dude2.animations.add('down', [0, 1, 2, 3], 5, true);

    game.physics.enable(dude);
    game.physics.enable(dude2);

    game.camera.follow(dude);
    game.camera.follow(dude2);

    game.world.setBounds(0, 0, 1984, 1632);

    dude.body.collideWorldBounds = true;
    dude2.body.collideWorldBounds = true;

    game.physics.arcade.collide(dude, dude2);

    //?  This adjusts the collision body size to be a 100x50 box.
    //?  50, 25 is the X and Y offset of the newly sized box.

    dude.body.setSize(47, 53, 9, 8);
    dude2.body.setSize(47, 53, 9, 8);
}

function render() {
    // game.debug.cameraInfo(game.camera, 32, 32);
    // if (gameHasStarted) {
    //     game.debug.body(dude2);
    // }
}

const createItems = function () {
    randomItemIndex = game.rnd.integerInRange(0, 15);

    currentItem = game.add.sprite(0, 0, 'recycle_items');
    currentItem.frame = randomItemIndex; //! произволен предмет от спрайта
    currentItem.anchor.setTo(0.5);
    game.physics.arcade.enable(currentItem);
    currentItem.x = game.rnd.integerInRange(94, 675);  //? предметът се появява в този диапазон
    currentItem.y = game.rnd.integerInRange(94, 484);

    while (game.physics.arcade.distanceBetween(dude.body, currentItem) < 150 || game.physics.arcade.distanceBetween(dude2.body, currentItem) < 150) {
        currentItem.x = game.rnd.integerInRange(94, 675); //? търси нова позиция на предмета, докато новото му място не е на разстояние по-голямо или равно на 150 от dude1 или dude2
        currentItem.y = game.rnd.integerInRange(94, 484);
    }
}

function playerKgCalculator(playerId) { //? добавя килограми към променливата за килограми на конкретния играч
    let kgsToAdd = 0;

    switch (currentItem.frame) {
        case 0: kgsToAdd += 0.045; break; //! paper bag
        case 1: kgsToAdd += 1.500; break; //! brown bottle
        case 2: kgsToAdd += 0.385; break; //! big gray can
        case 3: kgsToAdd += 0.523; break; //! cardboard box
        case 4: kgsToAdd += 0.400; break; //! cracked cup
        case 5: kgsToAdd += 1.500; break; //! green bottle
        case 6: kgsToAdd += 1.600; break; //! jar
        case 7: kgsToAdd += 3.900; break; //! newspaper
        case 8: kgsToAdd += 1.100; break; //! pizza box
        case 9: kgsToAdd += 0.200; break; //! plastic water bottle
        case 10: kgsToAdd += 0.130; break; //! plastic cup
        case 11: kgsToAdd += 1.000; break; //! plastic bottle milk
        case 12: kgsToAdd += 1.090; break; //! plastic red bottle
        case 13: kgsToAdd += 0.280; break; //! small gray can
        case 14: kgsToAdd += 0.290; break; //! red soda can
        case 15: kgsToAdd += 0.980; break; //! spray can
    }

    playerId === 'dude' ? dudeKgs += kgsToAdd : dude2Kgs += kgsToAdd; //? към коя променлива да добави
}

const itemCollect = function () {
    game.physics.arcade.collide(dude, currentItem, function (dude, currentItem) { //! червеното
        currentItem.kill()   //? предметът се взима от първото човече
        playerKgCalculator('dude');
        createItems()  //? отново се създава предметът
        dudePickupSound.play()
    });

    game.physics.arcade.collide(dude2, currentItem, function (dude2, currentItem) { //! зеленото
        currentItem.kill()    //? предметът се взима от първото човече
        playerKgCalculator('dude2');
        createItems()   //? отново се създава предметът
        dude2PickupSound.play()
    });

}

const createKeys = function () {
    keyW = game.input.keyboard.addKey(Phaser.Keyboard.W)
    keyA = game.input.keyboard.addKey(Phaser.Keyboard.A)
    keyS = game.input.keyboard.addKey(Phaser.Keyboard.S)
    keyD = game.input.keyboard.addKey(Phaser.Keyboard.D)

    cursors = game.input.keyboard.createCursorKeys()
}

const mushroomCreate = function () {
    let rndMush = game.rnd.integerInRange(1, 7)

    if (!gameHasFinished) {
        switch (rndMush) {
            case 1: mush1(); break;
            case 2: mush2(); break;
            case 3: mush3(); break;
            case 4: mush4(); break;
            case 5: mush5(); break;
            case 6: mush6(); break;
            case 7: mush7(); break;
        }
    }
}

const mushroomsKill = function () {
    mushroom.x = mushroomX;
    mushroom.y = mushroomY;
    mushTimerDestroy.destroy();
}

const mush1 = function () { //? една от възможните позиции на гъбката
    mushroom.x = 116;
    mushroom.y = 162;
    mushTimerDestroy = game.time.create(false);
    mushTimerDestroy.loop(6000, mushroomsKill, this);
    mushTimerDestroy.start();
}
const mush2 = function () {
    mushroom.x = 198;
    mushroom.y = 290;
    mushTimerDestroy = game.time.create(false);
    mushTimerDestroy.loop(6000, mushroomsKill, this);
    mushTimerDestroy.start();
}
const mush3 = function () {
    mushroom.x = 510;
    mushroom.y = 215;
    mushTimerDestroy = game.time.create(false);
    mushTimerDestroy.loop(6000, mushroomsKill, this);
    mushTimerDestroy.start();
}
const mush4 = function () {
    mushroom.x = 390;
    mushroom.y = 380;
    mushTimerDestroy = game.time.create(false);
    mushTimerDestroy.loop(6000, mushroomsKill, this);
    mushTimerDestroy.start();
}
const mush5 = function () {
    mushroom.x = 626;
    mushroom.y = 476;
    mushTimerDestroy = game.time.create(false);
    mushTimerDestroy.loop(6000, mushroomsKill, this);
    mushTimerDestroy.start();
}
const mush6 = function () {
    mushroom.x = 170;
    mushroom.y = 459;
    mushTimerDestroy = game.time.create(false);
    mushTimerDestroy.loop(6000, mushroomsKill, this);
    mushTimerDestroy.start();
}
const mush7 = function () {
    mushroom.x = 373;
    mushroom.y = 130;
    mushTimerDestroy = game.time.create(false);
    mushTimerDestroy.loop(6000, mushroomsKill, this);
    mushTimerDestroy.start();
}

const createText = function () {
    style = { font: "21px Consolas", fill: "#ff0000" }; //? стила на текста
    style2 = { font: "21px Consolas", fill: "#39e600" };
    style3 = { font: "18px Times New Roman", fill: "#FFFFFF" };
    volumeTextStyle = { font: "11px Consolas", fill: "#FFFFFF" };

    text = game.add.text(9, 3, "Player 1's kgs: ", style); //? тук добавяме текст в играта
    text2 = game.add.text(456, 3, "Player 2's kgs: ", style2);
    text3 = game.add.text(game.width / 2 + 2, 15, `00:00`, style3);
    volumeText = game.add.text(game.width / 2 + 334, 14.5, `100%`, volumeTextStyle);

    text.anchor.setTo(0)
    text2.anchor.set(0);
    text3.anchor.set(0.5);
    volumeText.anchor.set(0.5);
}

const createStatusBar = function () {
    statusbar = game.add.image(game.width / 2, 0, 'block');
    statusbar.anchor.x = 0.5
    statusbar.anchor.y = 0
}


function groupStatusBar() {
    statusBarGroup = game.add.group();
    statusBarGroup.add(statusbar);
    statusBarGroup.add(volumeText);
    statusBarGroup.add(text);
    statusBarGroup.add(text2);
    statusBarGroup.add(text3);
    statusBarGroup.add(masterVolButton)
    statusBarGroup.add(lowerVolButton);
    statusBarGroup.add(increaseVolButton);

    statusBarGroup.fixedToCamera = true;
}

const createBackground = function () {
    background = game.add.image(0, 0, 'grass');
    // background.width = game.width;
    // background.height = game.height;
}

function lowerMasterVolume() {
    if (!game.sound.mute) {
        game.sound.volume -= 0.1;
        volumeText.setText((game.sound.volume * 100).toFixed(0) + "%");
    }

}
function increaseMasterVolume() {
    if (!game.sound.mute) {
        game.sound.volume += 0.1;
        volumeText.setText((game.sound.volume * 100).toFixed(0) + "%");
    }
}

let statusBarGroup;
let brush;
let steve;

function createPlayablePart() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // game.scale.pageAlignHorizontally = true;  //? тук подравняваме играта в центъра на страницата
    // game.scale.pageAlignVertically = true;

    createBackground();      //? създаваме поляната
    createMap();         //? създаваме tile-картата
    createPlayers();
    createItems();         //? с тази функция предметите се създават
    createKeys();         //? функцията за движение чрез клавишите
    mushAssign();       //? създаваме гъбката
    createStatusBar();
    createText();
    createAudio();

    game.time.advancedTiming = true;

    mushTimerSpawn = game.time.create(false);
    mushTimerSpawn.loop(26000, mushroomCreate, this);
    mushTimerSpawn.start();


    mushTimerDestroy = game.time.create(false);
    mushTimerDestroy.loop(6000, mushroomsKill, this);

    lowerVolButton = game.add.button(728, 14.5, 'volume_adjust_buttons', lowerMasterVolume, this); lowerVolButton.frame = 0;
    lowerVolButton.scale.setTo(0.15);
    lowerVolButton.anchor.setTo(0.5);

    increaseVolButton = game.add.button(773, 14.5, 'volume_adjust_buttons', increaseMasterVolume, this); increaseVolButton.frame = 1;
    increaseVolButton.scale.setTo(0.15);
    increaseVolButton.anchor.setTo(0.5);

    masterVolButton = game.add.button(802, 16, 'master_volume_icon', masterVolButtonClick, this); masterVolButton.frame = 0;
    masterVolButton.scale.setTo(0.1);
    masterVolButton.anchor.setTo(0.5);

    masterVolButton.onInputOver.add(masterVolButtonOver, this);
    masterVolButton.onInputOut.add(masterVolButtonOut, this);

    blockLog = game.add.sprite(544, 540, 'block_log_key');
    game.physics.arcade.enable(blockLog);
    blockLog.body.immovable = true;

    brush = game.add.sprite(1741, 130, 'brush_key');
    brush.anchor.setTo(0.5);
    brush.scale.setTo(0.6);

    steve = game.add.sprite(1698, 130, 'steve_key');
    steve.anchor.setTo(0.5);
    steve.scale.setTo(1.7);

    startTime = new Date();
    totalTime = 2; //? секундите за таймера
    timeElapsed = 0; //? изминали секунди
    createPlaytimeTimer();

    groupStatusBar();
    playtimeTimer = game.time.events.loop(100, () => {
        updatePlaytimeTimer();
    });

    gameHasCreatedEverything = true; //? вече всичко е създадено и обръщаме boolean-a
}

let binsArray = [null, null, null];

function createDialogBoxPart() {
    dude.body.velocity.y = 0; //? забраняваме движението на играчите и спираме анимациите
    dude.body.velocity.x = 0;
    dude2.body.velocity.y = 0;
    dude2.body.velocity.x = 0;
    dude.animations.stop();
    dude2.animations.stop();

    console.log('dialogBox.y: ', dialogBox.y);

    if (dialogBox.y >= game.camera.y + 288) {
        let index = 0;
        for (let i = 220; i <= 612; i += 196) { //? създаваме 3те кошчета
            binsArray[index] = game.add.sprite(game.camera.x + i, game.camera.y + 410, 'bins');
            // windowGroup.add(bins);
            binsArray[index].anchor.setTo(0.5);
            binsArray[index].scale.setTo(2);
            binsArray[index].alpha = 0;
            game.add.tween(binsArray[index]).to({ alpha: 1 }, 0, "Linear", true, 0);
            binsArray[index].frame = index++;
        }

        if (draggingItemIndex === 4) {
            draggingItemIndex++;
        }

        draggingItemCreate(); //? създаваме предмета
        groupItemsInWindow();

        canClick = true; //? с този boolean разрешаваме кликането върху прозореца
        dialogBoxCreated = false;
    }
}

function updatePlaytimeTimer() {
    let currentTime = new Date();

    let timeDifference = startTime.getTime() - currentTime.getTime();
    //? Изминалото време в секунди
    timeElapsed = Math.abs(timeDifference / 1000);
    //? Оставащато време в секунди
    let timeRemaining = totalTime - timeElapsed;
    //? Конвертираме секундите в минути
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = Math.floor(timeRemaining) - (60 * minutes);
    //? При визуализация на минутите, ако са по малки от 10 - добаяме "0" пред тях
    let result = (minutes < 10) ? "0" + minutes : minutes;
    //? При визуализация на секундите, ако са по малки от 10 - добаяме "0" пред тях
    result += (seconds < 10) ? ":0" + seconds : ":" + seconds;

    if (!playtimeTimerEnded) { //? ако този таймер не е изтекъл, да се актуализира текстът
        timeLabel.text = result;
    }
}

function createPlaytimeTimer() {
    timeLabel = text3;
    timeLabel.anchor.setTo(0.5);
    timeLabel.align = 'center';
}

let recycledItemsGroup;

let recycledItemCreateInterval;
let recycledItemCollideInterval;

let recycledItemPosIndex = 0;

let recycledItem;

let recycledItemWasCreated = false;

function recycledCreateFunction() {
    recycledItem = recycledItemsGroup.create(0 + recycledItemPosIndex * 83, -100, 'recycled_items', recycledItemsFrame);
    recycledItem.body.gravity.y = 400;
    recycledItem.body.bounce.setTo(0, 0.5);
    recycledItem.scale.setTo(0.8);

    recycledItemsFrame++;
    recycledItemPosIndex++;
    recycledItemWasCreated = true;
}
function recycledCollideFunction() {
    if (recycledItemWasCreated) {
        if (recycledItem.y > 20) {
            recycledItem.body.gravity.y = 200;

            if (recycledItemsFrame >= 10) {
                recycledItemCollideInterval.stop(); //? спираме проверката за позиция
            }

            recycledItem.body.collideWorldBounds = true; //? разрешаваме сблъсъка на предмета с границите на играта
        }
    }
}

function recycledItemIntervalsCreate() {
    recycledItemCreateInterval = game.time.create(false);
    recycledItemCreateInterval.loop(1000, recycledCreateFunction, this); //? на всяка секунда ще се появява нов падащ предмет 
    recycledItemCreateInterval.start();

    recycledItemCollideInterval = game.time.create(false);
    recycledItemCollideInterval.loop(100, recycledCollideFunction, this); //? на всеки 100мс проверяваме позицията на предмета
    recycledItemCollideInterval.start();
}


function recycledItemsFalling() {
    recycledItemsGroup = game.add.group();
    recycledItemsGroup.enableBody = true;
    recycledItemsGroup.physicsBodyType = Phaser.Physics.ARCADE;

    //? създаваме маска, която ще показва обектите само когато са извън статус полето (при падане)
    let mask = game.add.graphics(0, 0);
    mask.width = game.width;
    mask.height = 35;

    recycledItemIntervalsCreate();

    mask.drawRect(0, 35, game.width, game.height - 35);

    //? ако искаме предметите да не се показат пред диалоговия прозорец
    //// mask.drawRect(0, 35, game.width / 2 - 250, game.height - 35);
    //// mask.drawRect(game.width / 2 - 250, 35, 500, game.height / 2 - 223);
    //// mask.drawRect(game.width / 2 + 250, 35, game.width / 2 - 250, game.height - 35);
    //// mask.drawRect(game.width / 2 - 250, game.height / 2 + 187, 500, 500);

    //? прилагаме маската към всички елементи на групата
    recycledItemsGroup.mask = mask;
}

function draggingAndDroppingItem() {
    if (draggingItemIndex === 0 && !calmMusicIsPlaying) {
        calmMusic.play();
        calmMusicIsPlaying = true;
    }

    let dragItemBinType = dragItemBinTypeArray[draggingItemIndex]; //? тук взимаме типа на отпадъка (за кой контейнер е) 

    switch (dragItemBinType) {
        case 'isForBlue': dialogBoxText.setText("Move the item into the container for\npaper/carboard."); break;
        case 'isForGreen': dialogBoxText.setText("Move the item into the container for\nglass."); break;
        case 'isForYellow': dialogBoxText.setText("Move the item into the container for\nmetal/plastic."); break;
        case 'other':
            draggingItem.kill();
            draggingItemIndex++; //? прескачаме един елемент
            draggingItemCreate();
            draggingIsDone = false;
            break;
        default:
            if (!P1FinishedProcess) {
                dialogBoxText.setText("Congrats! You did a great recycling job!\nNow it's your opponent's turn.");
                draggingItem.kill();
                draggingIsDone = true;
                draggingItemIndex = 0;
                P1FinishedProcess = true;
                calmMusic.stop();
                calmMusicIsPlaying = false;
                setTimeout(() => { draggingIsDone = false; draggingItemCreate() }, 3500); //? започва отброяване до появата на следващия предмет 
            } else {
                if (dudeKgs > dude2Kgs) {
                    dialogBoxText.y += 60;
                    dialogBoxText.setText(`Game Over\n\nPlayer 1 collected ${(dudeKgs - dude2Kgs).toFixed(1)}kg.\ntrash more than Player 2.\n\nTotal trash collected: ${(dudeKgs + dude2Kgs).toFixed(1)}kg.\nPress ESC to go back to\nthe welcome screen.`);
                    gameEnded = true;
                    createCongratsText();
                    recycledItemsFalling();
                    calmMusic.stop();
                    calmMusicIsPlaying = true; //? тук попречваме на спокойната мелодийка да се повтори отново
                    congratsMelody.play();
                }
                else if (dudeKgs < dude2Kgs) {
                    dialogBoxText.y += 60;
                    dialogBoxText.setText(`Game Over\n\nPlayer 2 collected ${(dude2Kgs - dudeKgs).toFixed(1)}kg.\ntrash more than Player 1.\n\nTotal trash collected: ${(dudeKgs + dude2Kgs).toFixed(1)}kg.\nPress ESC to go back to\nthe welcome screen.`);
                    gameEnded = true;
                    createCongratsText();
                    recycledItemsFalling();
                    calmMusic.stop();
                    calmMusicIsPlaying = true;
                    congratsMelody.play();
                }
                else {
                    dialogBoxText.y += 60;
                    dialogBoxText.setText(`Game Over\n\nThe two players collected\nequal amounts of trash.\n\nTotal trash collected: ${(dudeKgs + dude2Kgs).toFixed(1)}kg.\nPress ESC to go back to\nthe welcome screen.`);
                    gameEnded = true;
                    createCongratsText();
                    recycledItemsFalling();
                    calmMusic.stop();
                    calmMusicIsPlaying = true;
                    congratsMelody.play();
                }

                draggingItem.kill();
                canClick = false;
            }
            break;
    }

    const dragItemYPosCheck = draggingItem.y >= game.camera.y + 380 && draggingItem.y <= (game.camera.y + game.height)
    // console.log('dragCheckYPos: ', dragItemYPosCheck);
    // console.log('dragItemY: ', draggingItem.y);
    // console.log('(game.camera.y + game.height) - 420', (game.camera.y + game.height) - 420);

    if (dragItemYPosCheck && (draggingItem.x >= game.camera.x + 200 && draggingItem.x <= (game.camera.x + game.width) - 600)) {
        if (dragItemBinType === 'isForGreen') {
            dialogBoxText.setText("Correct!");
            dudePickupSound.play();
            draggingItem.kill();
            clickedOnCenter = false;
            draggingIsDone = true;
            draggingItemIndex++;
            setTimeout(() => { draggingIsDone = false; draggingItemCreate() }, 1200); //? започва отброяване до появата на следващия предмет
        } else {
            dialogBoxText.setText("Try again!");
            draggingItem.kill();
            clickedOnCenter = false;
            draggingIsDone = true;
            setTimeout(() => { draggingIsDone = false; draggingItemCreate() }, 1200); //? започва отброяване до появата на следващия предмет
        }
    }
    else if (dragItemYPosCheck && (draggingItem.x >= game.camera.x + 396 && draggingItem.x <= (game.camera.x + game.width) - 400)) {
        if (dragItemBinType === 'isForYellow') {
            dialogBoxText.setText("Correct!");
            dudePickupSound.play();
            draggingItem.kill();
            clickedOnCenter = false;
            draggingIsDone = true;
            draggingItemIndex++;
            setTimeout(() => { draggingIsDone = false; draggingItemCreate() }, 1200); //? започва отброяване до появата на следващия предмет
        } else {
            dialogBoxText.setText("Try again!");
            draggingItem.kill();
            clickedOnCenter = false;
            draggingIsDone = true;
            setTimeout(() => { draggingIsDone = false; draggingItemCreate() }, 1200); //? започва отброяване до появата на следващия предмет
        }
    }
    else if (dragItemYPosCheck && (draggingItem.x >= game.camera.x + 592 && draggingItem.x <= (game.camera.x + game.width) - 200)) {
        if (dragItemBinType === 'isForBlue') {
            dialogBoxText.setText("Correct!");
            dudePickupSound.play();
            draggingItem.kill();
            clickedOnCenter = false;
            draggingIsDone = true;
            draggingItemIndex++;
            setTimeout(() => { draggingIsDone = false; draggingItemCreate() }, 1200); //? започва отброяване до появата на следващия предмет
        } else {
            dialogBoxText.setText("Try again!");
            draggingItem.kill();
            clickedOnCenter = false;
            draggingIsDone = true;
            setTimeout(() => { draggingIsDone = false; draggingItemCreate() }, 1200); //? започва отброяване до появата на следващия предмет
        }
    }
}

function createCongratsText() {
    congratsTextStyle = { font: "16px Tahoma ", fill: "#ED4335", fontWeight: "Italic" };
    congratsText = game.add.text(game.camera.x + game.width / 2, game.camera.y + game.height / 2 - 135, "Look at all these recycled objects you have contributed making!", congratsTextStyle);
    congratsText.anchor.setTo(0.5);
}

function dialogWindow() {
    music1.stop()
    currentItem.kill(); //? преуверяваме се, че предметът изчезва

    dialogBox = game.add.image(game.camera.x + game.width / 2, game.camera.y - 187, 'dialog_box');
    console.log('dialogbox created!!');
    dialogBox.anchor.setTo(0.5);
    let dialogBoxTween = game.add.tween(dialogBox).to({ y: '+475' }, 2000, Phaser.Easing.Linear.None, true);
    dialogBoxTween.onComplete.add(dialogWindowText, this);
    // dialogBoxTween.onComplete.add(groupItemsInWindow, this);

    windowFinishedTravelling = true;
    dialogBoxCreated = true;
    // setTimeout(() => {
    // }, 2000);
}

let windowGroup;

function groupItemsInWindow() {
    windowGroup = game.add.group();
    windowGroup.add(dialogBox);
    windowGroup.add(binsArray[0]);
    windowGroup.add(binsArray[1]);
    windowGroup.add(binsArray[2]);
    windowGroup.add(dialogBoxText);
    windowGroup.add(draggingItem);

    // console.log(draggingItem);
    // windowGroup.fixedToCamera = true;
}

function dialogWindowText() {
    dialogBoxTextStyle = { font: "24px Tahoma ", fill: "#ffffff" }; //? стила на текста
    dialogBoxText = game.add.text(game.camera.x + game.width / 2, game.camera.y + 168, defWindowText, dialogBoxTextStyle); //? тук добавяме текст в заглавното меню
    dialogBoxText.anchor.setTo(0.5);
    dialogBoxText.align = 'center';
    dialogBoxText.alpha = 0;
    game.add.tween(dialogBoxText).to({ alpha: 1 }, 0, "Linear", true, 0);
}

function draggingItemCreate() {
    if (typeof (draggingItemIndex) !== "undefined") { //? ако индексът е с валиден тип, продължи създаването
        console.log('Dragging item created!');
        console.log('game.width / 2 : ' + game.width / 2, 'game.height / 2 : ' + game.height / 2);
        // console.log(game.camera.x, game.camera.y);
        draggingItem = game.add.sprite(game.camera.x + game.width / 2, game.camera.y + game.height / 2, 'recycle_items');
        draggingItem.frame = draggingItemIndex;
        draggingItem.anchor.setTo(0.5);
        //// draggingItem.fixedToCamera = true;
    }
}

function createWelText() {
    welcomeTextStyle = { font: "50px Arial ", fill: "#ff0000", fontWeight: 'bold', align: 'center' }; //? стила на текста
    welcomeText = game.add.text(game.width / 2, 100, "Welcome to\nRecycling In The Forest!", welcomeTextStyle); //? тук добавяме текст в заглавното меню
    welcomeText.anchor.setTo(0.5);

    copyrightTextStyle = { font: "15px Times New Roman ", fill: "#ffffff", fontWeight: 'italic' };
    copyrightText = game.add.text(18, 541, `© Genadi Fidanov, gf32716973@edu.mon.bg.`, copyrightTextStyle); //? тук добавяме текст в заглавното меню

    let grd = welcomeText.context.createLinearGradient(0, 0, 0, welcomeText.height);
    //?  добавяме два цвята за граница
    grd.addColorStop(0, '#DCE35B');
    grd.addColorStop(1, '#45B649');
    //?  и прилагаме градиента към текста
    welcomeText.fill = grd;
    welcomeText.setShadow(-5, 5, 'rgba(0,0,0,0.5)', 0);
}

function welcomeScreen() {
    // game.scale.pageAlignHorizontally = true;  //? тук подравняваме играта в центъра на страницата
    // game.scale.pageAlignVertically = true;

    gameHasFinished = false;
    gameHasStarted = false;

    P1FinishedProcess = false;
    draggingItemIndex = 0;
    recycledItemPosIndex = 0;

    gameHasCreatedEverything = false;

    playtimeTimerEnded = false;

    dudeKgs = 0;
    dude2Kgs = 0;
    timeElapsed = 0;

    windowFinishedTravelling = false;
    dialogBoxCreated = false;

    recycledItemsFrame = 0;

    menuBackground = game.add.image(0, 0, 'menu_background');

    createWelText();

    createWelScreenButtons();

    keyESC = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    keyESC.onDown.add(escButtonEvent)
    keyENTER = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    keyENTER.onDown.add(startButtonEvent)
}

function masterVolButtonOver() {
    masterVolButton.scale.setTo(0.105)
}
function masterVolButtonOut() {
    masterVolButton.scale.setTo(0.1)
}

function startButtonOver() {
    startButton.scale.setTo(0.4);

    recycleLogo.y = startButton.y;
    recycleLogo2.y = startButton.y;
    recycleLogo.x = startButton.x - (startButton.width / 2 + 20);
    recycleLogo2.x = startButton.x + (startButton.width / 2 + 20);
}
function startButtonOut() {
    startButton.scale.setTo(0.3)

    recycleLogo.y = recycleLogosYpos;
    recycleLogo2.y = recycleLogosYpos;
}

function helpButtonOver() {
    helpButton.scale.setTo(0.4)

    recycleLogo.y = helpButton.y;
    recycleLogo2.y = helpButton.y;
    recycleLogo.x = helpButton.x - (helpButton.width / 2 + 20);
    recycleLogo2.x = helpButton.x + (helpButton.width / 2 + 20);
}
function helpButtonOut() {
    helpButton.scale.setTo(0.3)

    recycleLogo.y = recycleLogosYpos;
    recycleLogo2.y = recycleLogosYpos;
}

function creditsButtonOver() {
    creditsButton.scale.setTo(0.4)

    recycleLogo.y = creditsButton.y;
    recycleLogo2.y = creditsButton.y;
    recycleLogo.x = creditsButton.x - (creditsButton.width / 2 + 20);
    recycleLogo2.x = creditsButton.x + (creditsButton.width / 2 + 20);
}
function creditsButtonOut() {
    creditsButton.scale.setTo(0.3)

    recycleLogo.y = recycleLogosYpos;
    recycleLogo2.y = recycleLogosYpos;
}

function startButtonEvent() {
    if (!inCreditsScene && !inHelpScene && !gameEnded) {
        gameHasStarted = true;
        copyrightText.kill();
        recycleLogo.kill();
        recycleLogo2.kill();
        menuBackground.kill()
        welcomeText.kill();

        startButton.pendingDestroy = true; //? тук премахваме бутоните
        helpButton.pendingDestroy = true;
        creditsButton.pendingDestroy = true;
    }
}
function helpButtonEvent() {
    inHelpScene = true;
    recycleLogo.kill();
    recycleLogo2.kill();

    welcomeText.kill();
    helpTextStyle = { font: "20px Arial Narrow", fill: "#ffffff", fontWeight: 'bold', align: 'center' };
    helpText = game.add.text(game.width / 2, 220, helpTextContent, helpTextStyle);
    helpText.anchor.setTo(0.5);

    dude = game.add.sprite(67, game.height / 2, 'dude_key');
    dude.anchor.setTo(0.5);
    dude.scale.setTo(1.3);
    dude.angle = -50;
    dude.frame = 9;
    dude.animations.add('right', [8, 9, 10, 11], 5, true);

    dude2 = game.add.sprite(game.width - 70, game.height - 70, 'dude_green_key');
    dude2.anchor.setTo(0.5);
    dude2.scale.setTo(1.3);
    dude2.frame = 7;
    dude2.animations.add('left', [4, 5, 6, 7], 5, true);

    mushroom = game.add.sprite(111, 268, 'mushroom_key');
    mushroom.anchor.setTo(0.5);
    mushroom.height = 50;
    mushroom.width = 50;
    mushroom.angle = -50;

    randomItemIndex = game.rnd.integerInRange(0, 15);

    currentItem = game.add.sprite(game.width - 132, game.height - 65, 'recycle_items');
    currentItem.frame = randomItemIndex; //! произволен предмет от спрайта
    currentItem.anchor.setTo(0.5);
    game.physics.arcade.enable(currentItem);

    startButton.pendingDestroy = true; //? тук премахваме бутоните
    helpButton.pendingDestroy = true;
    creditsButton.pendingDestroy = true;
}
function creditsButtonEvent() {
    inCreditsScene = true;
    recycleLogo.kill();
    recycleLogo2.kill();

    welcomeText.kill();
    creditsTextStyle = { font: "30px Times New Roman ", fill: "#14A0F9", fontWeight: 'bold', align: 'center' };
    creditsText = game.add.text(game.width / 2, game.height / 2 - 80, creditsTextContent, creditsTextStyle);
    creditsText.anchor.setTo(0.5);

    startButton.pendingDestroy = true; //? тук премахваме бутоните
    helpButton.pendingDestroy = true;
    creditsButton.pendingDestroy = true;
}

function escButtonEvent() {
    if (inCreditsScene || inHelpScene || gameEnded) {
        escButtonCleanup(); //? провеждаме функцията за почиставане
        welcomeScreen();
        inHelpScene = false;
        inCreditsScene = false;
        gameEnded = false;
        gameHasStarted = false;
    }
}

function escButtonCleanup() {
    if (gameEnded) { //? Ако ESC бутона е натиснат след края на играта, да се изпълни следния код:
        recycledItemCreateInterval.stop(); //? спираме създаването на падащите елементи и проверката за позиция
        recycledItemCollideInterval.stop();

        background.kill();

        dude.kill();
        dude2.kill();

        groundLayer.kill();

        statusbar.kill();
        dialogBox.kill();
        text.kill();
        text2.kill();
        text3.kill();

        masterVolButton.kill();

        congratsText.kill();
        dialogBoxText.kill();
    } else if (inHelpScene) {  //? ако е натиснат в "help" сцената
        helpText.kill();
        dude.kill();
        dude2.kill();
        mushroom.kill();
        currentItem.kill();
    } else if (inCreditsScene) {
        creditsText.kill();
    }

    //? Правим всички тези проверки за да избегнем "undefined" грешки.
}

const masterVolButtonClick = function () {
    if (!masterVolButtonClicked) {
        console.log(game.sound.volume);
        game.sound.mute = true;
        gameAudioIsMuted = true;
        masterVolButton.frame = 1;
        masterVolButtonClicked = true;
    }
    else {
        console.log(game.sound.volume);
        game.sound.mute = false;
        gameAudioIsMuted = false;
        masterVolButton.frame = 0;
        masterVolButtonClicked = false;
    }
}

const mushAssign = function () {
    mushroom = game.add.sprite(mushroomX, mushroomY, 'mushroom_key')
    mushroom.scale.setTo(0.1);
    mushroom.anchor.setTo(0.5);
    mushroom.height = 50;
    mushroom.width = 50;
    game.physics.arcade.enable(mushroom);
    mushroom.body.immovable = true;
}

function collisionHandler1(obj1, obj2) {
    mushroomsKill()
    dude1VelX += 100;
    dude1VelY += 100;
    powup.play();

    this.time.events.add(Phaser.Timer.SECOND * 5, function () {
        dude1VelX -= 100;
        dude1VelY -= 100;
    });
}
function collisionHandler2(obj1, obj2) {
    mushroomsKill()
    dude2VelX += 100;
    dude2VelY += 100;
    powup.play();

    this.time.events.add(Phaser.Timer.SECOND * 5, function () {
        dude2VelX -= 100;
        dude2VelY -= 100;
    });
}

function clicksHandler() {
    if (canClick && game.input.mousePointer.isDown &&
        ((game.input.x >= game.width / 2 - 40 && game.input.x <= game.width / 2 + 40) &&
            (game.input.y >= game.height / 2 - 40 && game.input.y <= game.height / 2 + 40))) {

        clickedOnCenter = true;
    }

    // console.log(clickedOnCenter);
    // console.log(game.input.x);
    console.log('dude2 x: ', dude2.x, 'dude2 y: ', dude2.y);

    if (clickedOnCenter && canClick && game.input.mousePointer.isDown &&
        ((game.input.x >= game.width / 2 - 210 &&
            game.input.x <= game.width / 2 + 210) &&
            (game.input.y >= game.height / 2 - 155 &&
                game.input.y <= game.height / 2 + 155))) {

        console.log('able to drag!'); //!! the following code doesn't execude
        draggingItem.y = game.camera.y + game.input.y;
        draggingItem.x = game.camera.x + game.input.x;
    }
    else if (canClick && !game.input.mousePointer.isDown) {
        draggingItem.y = game.camera.y + game.height / 2;
        draggingItem.x = game.camera.x + game.width / 2;
    }
}

function createAudio() {
    dudePickupSound = game.add.audio('pickup_sound');   //? добавяме звуковите ефекти и музика
    dude2PickupSound = game.add.audio('pickup_sound');
    music1 = game.add.audio('plant_music');
    music1.play();
    powup = game.add.audio('powUp_sound');
    congratsMelody = game.add.audio('congrats_melody');
    calmMusic = game.add.audio('calm_music');
}

function createWelScreenButtons() {
    recycleLogo = game.add.image(recycleLogoXpos, recycleLogosYpos, 'recycle_logo');
    recycleLogo.scale.setTo(0.03);
    recycleLogo.anchor.setTo(0.5);

    recycleLogo2 = game.add.image(recycleLogo2Xpos, recycleLogosYpos, 'recycle_logo');
    recycleLogo2.scale.setTo(0.03);
    recycleLogo2.anchor.setTo(0.5);

    startButton = game.add.button(game.width / 2, game.height / 2 - 50, 'menu_buttons_sprite_key', startButtonEvent, this); startButton.frame = 2;
    startButton.scale.setTo(0.3)
    startButton.anchor.setTo(0.5)

    startButton.onInputOver.add(startButtonOver, this);
    startButton.onInputOut.add(startButtonOut, this);

    helpButton = game.add.button(game.width / 2, startButton.y + 70, 'menu_buttons_sprite_key', helpButtonEvent, this); helpButton.frame = 1;
    helpButton.scale.setTo(0.3)
    helpButton.anchor.setTo(0.5)

    helpButton.onInputOver.add(helpButtonOver, this);
    helpButton.onInputOut.add(helpButtonOut, this);

    creditsButton = game.add.button(game.width / 2, helpButton.y + 70, 'menu_buttons_sprite_key', creditsButtonEvent, this); creditsButton.frame = 0;
    creditsButton.scale.setTo(0.3)
    creditsButton.anchor.setTo(0.5)

    creditsButton.onInputOver.add(creditsButtonOver, this);
    creditsButton.onInputOut.add(creditsButtonOut, this);
}
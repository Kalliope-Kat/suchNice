var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var FPS = 30;
var RADTODEG = 180/Math.PI;
var DEGTORAD = Math.PI/180;
var vel = 8;
var angle = 360;
var throwAngle, mouseDragDistance;
var itemX, itemY;
var gravityY;
var itemsToThrow, numberOfHits;

var canvas, stage, queue, context;
var gameState;
var startButton, instructionsButton, restartButton;
var titleScreen, instructionsScreen, winScreen, button, backDrop1, grumpyCat, easterHit, easterBackdrop;
var gameLevelNumber;
var gameOver, score, scoreText;
var TITLE = 0, INSTRUCTIONS = 1, CREATE_GAME = 2, IN_GAME = 3, GAME_OVER = 4, PAUSED = 5, THROWING_ITEM= 6, WIN_GAME = 7;
var LVL1 = 11, LVL2 = 9, LVL3 = 7, LVL4 = 5, LVL5 = 3;

var mouseX, mouseY, mousePositionText;

var powerText, angleText, userAngle, userPower;

var walk, blocks, blockArray, spriteX, spriteY, powerUpX, powerUpY;

var itemToChuck, powerUp, cupCake, gingerBread;

var walkingDirection;

var gameOver, timeLimit = 120;

var jamieMode, paused, ammoBar, ammoBarWidth;

var score;//High score persistance if time available 

var startXposition, startYposition, endXposition, endYposition;
var ball;
blockArray = [];

var isDown = false;
var shape, player, aimer, containShot, refPoint;



function openCanvas() {
    
    canvas = document.getElementById('game');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    context = canvas.getContext("2d");
    stage = new createjs.Stage(canvas);

}

function drawTitleScreen() {
    titleScreen.x = 0;
    titleScreen.y = 0;

    var text = new createjs.Text("Such Nice!", "50px Arial", "#253742"); 
    text.x = 270; 
    text.y = 100;
    text.textBaseline = "alphabetic";

    startButton.x = 500;
    startButton.y = 500;
    instructionsButton.x = 600;
    instructionsButton.y = 500;

    stage.addChild(titleScreen);
//    stage.addChild(text);
    stage.addChild(startButton);
    stage.addChild(instructionsButton);
    
}

function displaySprites() {
    walk.x=spriteX;
    walk.y=spriteY;
    walk.gotoAndPlay(walkingDirection);
    stage.addChild(walk);
    
    // for(i = 0; i < 5; i++){
    //     blocks.x=i*31+20;
    //     blocks.y=215;
    //     blocks.gotoAndStop(i);
    //     blockArray.push(blocks.clone());
    // }
    // for(j = 0; j < 5; j++){
    //     stage.addChild(blockArray[j]);  
    // }
    
}

function drawAmmoBar() {
    var text = new createjs.Text("Ammo", "18px Arial", "#DDD"); 
    text.x = 7; 
    text.y = 11;
    ammoBar = new createjs.Shape();
            ammoBar.graphics.setStrokeStyle(2, 'square', 'square');
            ammoBar.graphics.beginStroke(('#444'));
            ammoBar.graphics.beginFill("#DDD").drawRect(60,10,150, 25);
            ammoBar.graphics.beginFill("#C55").drawRect(60,10,ammoBarWidth, 25);
            ammoBar.graphics.endStroke();
            ammoBar.graphics.endFill();
            
            ammoBar.graphics.endStroke();
            stage.addChild(ammoBar);
            stage.addChild(text);
}

function upDateAmmoBar() {
    var newWidth;
    switch(gameLevelNumber){
        case 1:
            newWidth = itemsToThrow/11;
            ammoBarWidth = newWidth*150;
            stage.removeChild(ammoBar);
            drawAmmoBar();
            break;
        case 2:
            newWidth = itemsToThrow/9;
            ammoBarWidth = newWidth*150;
            stage.removeChild(ammoBar);
            drawAmmoBar();
            break;
        case 3:
            newWidth = itemsToThrow/7;
            ammoBarWidth = newWidth*150;
            stage.removeChild(ammoBar);
            drawAmmoBar();
            break;
        case 4:
            newWidth = itemsToThrow/5;
            ammoBarWidth = newWidth*150;
            stage.removeChild(ammoBar);
            drawAmmoBar();
            break;
        case 5:
            newWidth = itemsToThrow/3;
            ammoBarWidth = newWidth*150;
            stage.removeChild(ammoBar);
            drawAmmoBar();
            break;
    }
}



function drawNewSprite() {
    var walkSheet = new createjs.SpriteSheet({
        images: [queue.getResult("mySprites")],
        frames: [[160,0,19,49,0,10.05,48.6],[179,0,34,44,0,17.05,43.6],[213,0,22,46,0,9.05,45.6],[235,0,17,49,0,8.05,48.6],[0,49,25,49,0,10.05,48.6],[25,49,31,46,0,14.05,45.6],[56,49,33,44,0,16.05,43.6],[89,49,30,44,0,17.05,43.6],[119,49,28,46,0,17.05,45.6],[147,49,19,49,0,10.05,48.6],[166,49,23,49,0,14.05,48.6],[189,49,31,46,0,16.05,45.6],[220,49,34,44,0,17.05,43.6],[0,98,19,49,0,9.05,48.6],[19,98,34,44,0,17.05,43.6],[53,98,22,46,0,13.05,45.6],[75,98,17,49,0,9.05,48.6],[92,98,25,49,0,15.05,48.6],[117,98,31,46,0,17.05,45.6],[148,98,33,44,0,17.05,43.6],[181,98,30,44,0,13.05,43.6],[211,98,28,46,0,11.05,45.6],[0,147,19,49,0,9.05,48.6],[19,147,23,49,0,9.05,48.6],[42,147,31,46,0,15.05,45.6],[73,147,34,44,0,17.05,43.6]],
        animations: {
            standRight: [0, 0, "standRight"],
            walkRight: [1, 12, "walkRight", 0.5],
            standLeft: [13, 13, "standLeft"],
            walkLeft: [14, 25, "walkLeft", 0.5]
            }     
        });
    
    walk = new createjs.Sprite(walkSheet);

    // walk.x=spriteX;
    // walk.y=spriteY;
    // walk.gotoAndPlay(walkingDirection);
    // stage.addChild(walk);
}

function drawInstructionsScreen() {
    stage.removeAllChildren();
    instructionsScreen.x = 0;
    instructionsScreen.y = 0;

    var text = new createjs.Text("Instructions", "50px Arial", "#EFC94C"); 
    text.x = 270; 
    text.y = 100;

    var text2 = new createjs.Text("You have 5 cupcakes and you must hit grumpy cat at least 3 times.", "20px Arial", "#EFC94C"); 
    text2.x = 97; 
    text2.y = 220;

    var text3 = new createjs.Text("Drag and hold the mouse to the desired angle and power level.  ", "17px Arial", "#EFC94C"); 
    text3.x = 175; 
    text3.y = 280;

    var text4 = new createjs.Text("Relase the mouse to fire.  ", "17px Arial", "#EFC94C"); 
    text4.x = 310; 
    text4.y = 320;

    startButton.x = 600;
    startButton.y = 500;


    stage.addChild(instructionsScreen);
//    stage.addChild(text);
    stage.addChild(text2);
    stage.addChild(text3);
    stage.addChild(text4);
    stage.addChild(startButton);
}

function drawGameScreen() {
    stage.removeAllChildren();
    gameScreen.x = 0;
    gameScreen.y = 0;


    stage.addChild(backDrop1);
    
    

    grumpyCat.x = 590;
    grumpyCat.y = 410;
    stage.addChild(grumpyCat);
    
    easterHit.x = 0;
    easterHit.y = 5;
    stage.addChild(easterHit);
    console.log("easter egg added to screen");
    //displaySprites();
    //displayCupCake();
    ammoBarWidth = 150;
    drawAmmoBar();
    startPowerUp();
    displayItemToChuck();
	displayPlayer();
}

function drawGameOverScreen() {
    stage.removeAllChildren();
    gameOverScreen.x = 0;
    gameOverScreen.y = 0;

    var text = new createjs.Text("Game Over", "50px Arial", "#253742"); 
    text.x = 270; 
    text.y = 100;
    text.textBaseline = "alphabetic";

    var finalScoreText = new createjs.Text("Final Score: "+ score, "30px Arial", "#253742"); 
    finalScoreText.x = 300; 
    finalScoreText.y = 200;
    finalScoreText.textBaseline = "alphabetic";

    restartButton.x = 500;
    restartButton.y = 500;


    stage.addChild(gameOverScreen);
//    stage.addChild(text);
    stage.addChild(finalScoreText);
    stage.addChild(restartButton);
}

function drawWinScreen() {
    stage.removeAllChildren();
    winScreen.x = 0;
    winScreen.y = 0;

    var finalScoreText = new createjs.Text("Final Score: "+ score, "30px Arial", "#253742"); 
    finalScoreText.x = 300; 
    finalScoreText.y = 260;
    finalScoreText.textBaseline = "alphabetic";

    restartButton.x = 500;
    restartButton.y = 500;

    stage.addChild(winScreen);
    stage.addChild(finalScoreText);
    stage.addChild(restartButton);
}

fileManifest = [
                {src:"title_revised.png", id:"titleScreen"},
                {src:"instructions_revised.png", id:"instructionsScreen"},
                {src:"startButton.jpg", id:"startButton"},
                {src:"instructionsButton.jpg", id:"instructionsButton"},
                {src:"restartButton.jpg", id:"restartButton"},
                {src:"gameScreen.jpg", id:"gameScreen"},
                {src:"gameOver_revised.png", id:'gameOverScreen'},
                {src:"sprites.png", id:"mySprites"},
                {src:"gameBackdrop.png", id:"backDrop1"},
                {src:"grumpyCat3.png", id:"grumpyCat"},
                {src:"tempCupCake.png", id:"cupCake"},
                {src:"win_revised.png", id:"winScreen"},
                {src:"GingerbreadMan.png", id:"gingerBread"},
                {src:"easterHit.png", id:"easterHit"},
                {src:"easterBackdrop.png", id:"easterBackdrop"},
                {src:"WinScreen.png", id:"winScreen"},
                {src:"GingerbreadMan.png", id:"gingerBread"},
				{src:"PlayerBody.png", id:"playerBody"},
				{src:"Aiming.png", id:"aiming"}
    
            ];

function loadFiles() {
    queue = new createjs.LoadQueue(true, "assets/img/");
    queue.on("complete", loadComplete, this);
    queue.loadManifest(fileManifest);
}

function handleButtonClick() {
    startButton.addEventListener("click", function (event){ 
        gameState = CREATE_GAME;
    });

    instructionsButton.addEventListener("click", function (event){
            gameState = INSTRUCTIONS;
        });

    restartButton.addEventListener("click", function (event){
            resetGame();
            gameOver = false;
            jamieMode = false;
            gameState = CREATE_GAME;
            itemsToThrow = LVL1;
            gameLevelNumber = 1;
            score = 0;
        });
}

function loadComplete(evt) {
    titleScreen = new createjs.Bitmap(queue.getResult("titleScreen"));
    instructionsScreen = new createjs.Bitmap(queue.getResult("instructionsScreen"));
    startButton = new createjs.Bitmap(queue.getResult("startButton"));
    instructionsButton = new createjs.Bitmap(queue.getResult("instructionsButton"));
    restartButton = new createjs.Bitmap(queue.getResult("restartButton"));
    gameScreen = new createjs.Bitmap(queue.getResult("gameScreen"));
    gameOverScreen = new createjs.Bitmap(queue.getResult("gameOverScreen"));
    backDrop1 = new createjs.Bitmap(queue.getResult("backDrop1"));
    grumpyCat = new createjs.Bitmap(queue.getResult("grumpyCat"));
    cupCake = new createjs.Bitmap(queue.getResult("cupCake"));
    gingerBread = new createjs.Bitmap(queue.getResult("gingerBread"));
    winScreen = new createjs.Bitmap(queue.getResult("winScreen"));
    easterHit = new createjs.Bitmap(queue.getResult("easterHit"));
    easterBackdrop = new createjs.Bitmap(queue.getResult("easterBackdrop"));
	player = new createjs.Bitmap(queue.getResult("playerBody"));
	aimer = new createjs.Bitmap(queue.getResult("aiming"));
	refPoint = new createjs.Shape();
	refPoint.graphics.beginFill("red").drawRoundRect(0,0,20,20,1);
	containShot = new createjs.Container();
	containShot.addChild(refPoint, aimer);

    var blockSheet = new createjs.SpriteSheet({
        images: [queue.getResult("mySprites")],
        frames: [[0,0,32,32,0,16,16],[32,0,32,32,0,16,16],[64,0,32,32,0,16,16],[96,0,32,32,0,16,16],[128,0,32,32,0,16,16]]
        });

    blocks = new createjs.Sprite(blockSheet);

    var walkSheet = new createjs.SpriteSheet({
        images: [queue.getResult("mySprites")],
        frames: [[160,0,19,49,0,10.05,48.6],[179,0,34,44,0,17.05,43.6],[213,0,22,46,0,9.05,45.6],[235,0,17,49,0,8.05,48.6],[0,49,25,49,0,10.05,48.6],[25,49,31,46,0,14.05,45.6],[56,49,33,44,0,16.05,43.6],[89,49,30,44,0,17.05,43.6],[119,49,28,46,0,17.05,45.6],[147,49,19,49,0,10.05,48.6],[166,49,23,49,0,14.05,48.6],[189,49,31,46,0,16.05,45.6],[220,49,34,44,0,17.05,43.6],[0,98,19,49,0,9.05,48.6],[19,98,34,44,0,17.05,43.6],[53,98,22,46,0,13.05,45.6],[75,98,17,49,0,9.05,48.6],[92,98,25,49,0,15.05,48.6],[117,98,31,46,0,17.05,45.6],[148,98,33,44,0,17.05,43.6],[181,98,30,44,0,13.05,43.6],[211,98,28,46,0,11.05,45.6],[0,147,19,49,0,9.05,48.6],[19,147,23,49,0,9.05,48.6],[42,147,31,46,0,15.05,45.6],[73,147,34,44,0,17.05,43.6]],
        animations: {
            standRight: [0, 0, "standRight"],
            walkRight: [1, 12, "walkRight", 0.5],
            standLeft: [13, 13, "standLeft"],
            walkLeft: [14, 25, "walkLeft", 0.5]
            }     
        });
    
    walk = new createjs.Sprite(walkSheet);

    handleButtonClick();
    initMouseCords();
    spriteX = 50;
    spriteY = 450;
    mousePositionText = new createjs.Text("Mouse X: " +mouseX + "  Mouse Y:" + mouseY, "15px Arial", "#253742");
    scoreText = new createjs.Text("Score: "+ score, "19px Arial Bold", "#253742"); 
    itemsText = new createjs.Text("Ammo: " + itemsToThrow, "19px Arial Bold", "#253742");
	powerText = new createjs.Text("Power: ", "19px Arial Bold", "#253742");
	angleText = new createjs.Text("\u00B0", "19px Arial Bold", "#253742");
    drawScore();
    startLoop();
    itemX = 50;
    itemY = 500;
    
    numberOfHits = 0;
}



function displayItemToChuck() {
    selectRandomItem();
    if(itemToChuck === cupCake){
    cupCake = new createjs.Bitmap(queue.getResult('cupCake'));
    itemToChuck = cupCake;
    }
    else if(itemToChuck === gingerBread){
    gingerBread = new createjs.Bitmap(queue.getResult('gingerBread'));
    itemToChuck = gingerBread;
    }
    itemToChuck.x = spriteX;
    itemToChuck.y = spriteY;
    stage.addChild(itemToChuck);
	stage.setChildIndex(itemToChuck, 1);
	itemToChuck.visible = false;
}

var container;

function displayPlayer()
{
	player.x = 40;
	player.y = 500;
	stage.addChild(player);
	
	aimer.x = 80;
	aimer.y = 520;
	aimer.regX = 72;
	aimer.regY = 80;
	stage.addChild(aimer);
	
}

function displayNewItemToChuck() {
    selectRandomItem();
    itemToChuck.x = spriteX;
    itemToChuck.y = spriteY;
	stage.setChildIndex(itemToChuck, 1);
    stage.addChild(itemToChuck);
	itemToChuck.visible = false;
}

function selectRandomItem() {
    var rand = Math.floor(Math.random()* 10);
    if(rand < 5){
        itemToChuck = cupCake;
    }
    else if(rand > 5){
        itemToChuck = gingerBread;
    }

}

function selectRandomPowerUpItem() {
    var rand = Math.floor(Math.random()* 10);
    if(rand < 5){
        powerUp = cupCake;
    }
    else if(rand > 5){
        powerUp = gingerBread;
    }

}

function startPowerUp() {
    powerUpX = 900;
    powerUpY = 100;
    selectRandomPowerUpItem();
    if(powerUp === cupCake){
    cupCake = new createjs.Bitmap(queue.getResult('cupCake'));
    powerUp = cupCake;
    }
    else if(powerUp === gingerBread){
    gingerBread = new createjs.Bitmap(queue.getResult('gingerBread'));
    powerUp = gingerBread;
    }
    powerUp.x = powerUpX;
    powerUp.y = powerUpY;
    stage.addChild(powerUp);
}

function movePowerUp() {
    //var Xcoord = powerUpX;
    //powerUp.y = 100;
    var rand;
    if( powerUpX < -100 ){
        direction = 6;
        rand = Math.floor(Math.random()* 100);
        powerUp.y = rand;
    }
    if(powerUpX > 850){
        direction = -6;
        rand = Math.floor(Math.random()* 100);
        powerUp.y = rand;
    }
    powerUpX += direction;
    powerUp.x = powerUpX;
}

function changePowerUpYCoord() {
    var rand = Math.floor(Math.random()* 100);
    powerUpY = rand;
}



function handleMouseDown(event) {
    if(gameState === IN_GAME){
        startXposition = mouseX;
        startYposition = mouseY;
		isDown = true;
    }
}

function handleMouseRelease(event) {
    if(gameState === IN_GAME){
        endXposition = mouseX;
        endYposition = mouseY;
        
        updateItemTossedMovement();
        gameState = THROWING_ITEM;
        itemsToThrow--;
        upDateAmmoBar();
        isDown = false;
		stage.removeChild(shape);
		stage.removeChild(powerText);
		stage.removeChild(angleText);
		itemToChuck.visible = true;
    }
}

function calcAnglePower(mouseX, mouseY)
{
		var dy = (mouseY - startYposition);
        var dx = (mouseX - startXposition);
        var theta = Math.atan2(dy, dx);
        theta *= RADTODEG;
		
		userAngle = (theta - 180)*-1;
		
        theta += 180;
        throwAngle = theta;
		throwAngle = Math.floor(throwAngle);
		userAngle = Math.floor(userAngle);
		dy *= dy;
        dx *= dx;
        mouseDragDistance = Math.sqrt(dx + dy);
        gravityY = 0;

		mouseDragDistance = Math.floor(mouseDragDistance);
		displayShotInfo();
}

function displayShotInfo()
{
	userPower = mouseDragDistance;
	if(userPower > 300)
	{
		userPower = 300;
	}
}

function handleMouseMove(event)
{
	if(gameState === IN_GAME && isDown === true)
	{
		stage.removeChild(shape);
		shape = new createjs.Shape();
		stage.addChild(shape);
		
		calcAnglePower(mouseX, mouseY);
		
		powerText.text = "Power: " + userPower;
		angleText.text = userAngle + "\u00B0";
		
		
		if(userAngle <= 90)
		{
			aimer.setTransform(80,520,1,1,throwAngle,0,0,72,80);
		}
		else if(userAngle >90 && userAngle < 270)
		{
			aimer.setTransform(110,520,1,-1,throwAngle,0,0,72,80);
		}
		else if(userAngle > 270 && userAngle <= 360)
		{
			aimer.setTransform(80,520,1,1,throwAngle,0,0,72,80);
		}
		console.log(aimer.x + ", " + aimer.y);
		
		powerText.x = mouseX + 5;
		powerText.y = mouseY + 40;
		
		angleText.x = startXposition + 5;
		angleText.y = startYposition - 10;
		
		stage.addChild(powerText);
		stage.addChild(angleText);
		
		shape.graphics.beginStroke("000").moveTo(startXposition,startYposition).lineTo(mouseX,mouseY);
		
		stage.update();
			
	}

}

function init() {
    
    score = 0;
    gameLevelNumber = 1;
    itemsToThrow = LVL1;
    openCanvas();
    loadFiles();
    gameOver = false;
    jamieMode = false;
    walkingDirection = "walkRight";
    

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    stage.on("mousedown", handleMouseDown);
    stage.on("pressup", handleMouseRelease);
	stage.on("stagemousemove", handleMouseMove);
     
}

function handleKeyDown(event) {
    if(!gameOver) {
    switch(event.keyCode) {
        case 38:
            console.log("Up");
            break;
        case 37:
            console.log("Left");
            walkingDirection = "walkLeft";
            score--;
            break;
        case 39:
            console.log("Right");
            walkingDirection = "walkRight";
            score++;
            break;
        case 40:
            console.log("Down");
            break;
    }
}

}

function handleKeyUp(event) {
    if(!gameOver) {
    switch(event.keyCode) {
        case 38:
        case 37:
            break;
        case 39:
            break;
        case 40:
            break;
        case 74:
            if(jamieMode){
                jamieMode = false;
                    switch(gameLevelNumber){
                        case 1:
                            itemsToThrow = LVL1;
                            break;
                        case 2:
                            itemsToThrow = LVL2;
                            break;
                        case 3:
                            itemsToThrow = LVL3;
                            break;
                        case 4:
                            itemsToThrow = LVL4;
                            break;
                        case 5:
                            itemsToThrow = LVL5;
                            break;
                        }
                
            } else {
                jamieMode = true;
                //var storeItemCount = itemsToThrow;
                itemsToThrow = 1000000;
            }
            upDateAmmoBar();
            break;
        case 80:
            console.log("Pause Pressed");
            if(paused){
                paused = false;
                gameState = IN_GAME;
            }
            else{                
                paused = true;
                gameState = PAUSED;
            }
            break;
    }
   // displaySprites();
    //displayCupCake();
}


}

function initMouseCords() {
    stage.on("stagemousemove", function(evt) {

        mouseX = evt.stageX;
        mouseY = evt.stageY;

    }); 
}

function drawMouseCords() {
    mousePositionText.x = 20;
    mousePositionText.y = 15;
    stage.addChild(mousePositionText);
}

function drawScore() {
    scoreText.x = 700; 
    scoreText.y = 12;

    stage.addChild(scoreText);
}

function drawLevelSign() {
    var gameLevel = new createjs.Shape();
            gameLevel.graphics.setStrokeStyle(4, 'square', 'square');
            gameLevel.graphics.beginStroke(('#333'));
            gameLevel.graphics.beginFill("#EFC94C").drawRect(0,0,200, 200);
            gameLevel.graphics.endStroke();
            gameLevel.graphics.endFill();
            
            gameLevel.graphics.endStroke();
            

    var level = new createjs.Text("Level", "30px Arial", "#253742");
        level.x = 65;
        level.y = 50;

    var levelNumber = new createjs.Text(gameLevelNumber, "35px Arial", "#253742");
        levelNumber.x = 90;
        levelNumber.y = 100;    

    var levelContainer = new createjs.Container();
            levelContainer.x = 300;
            levelContainer.y = 800;
            levelContainer.addChild(gameLevel, level, levelNumber);

            var tween = createjs.Tween.get(levelContainer, {loop:false})
                         .to({x:300, y:200}, 1500, createjs.Ease.bounceOut)
                         .wait(1500)
                         
                         .to({x:300, y:800}, 2500, createjs.Ease.bounceOut);

            stage.addChild(levelContainer);
}

function drawBall() {
        ball = new createjs.Shape();
        ball.graphics.setStrokeStyle(1);
        ball.graphics.beginStroke('#00F');
        ball.graphics.beginFill("#00F").drawCircle(0,0,10);
        ball.x = itemX;
        ball.y = itemY;

        stage.addChild(ball);
}

function moveBall() {
    updateItemMovement();
    ball.x = itemX;
    ball.y = itemY;
}

function updateTossedItem() {
    updateItemTossedMovement();
    itemToChuck.x = spriteX;
    itemToChuck.y = spriteY;
}

function updateItemTossedMovement() {

    var previousXLocation = spriteX;
    var previousYLocation = spriteY;
    var radians = throwAngle * DEGTORAD;
    if( mouseDragDistance * 0.1 > 30) {
        mouseDragDistance = 295;
    }
    var spriteXmod = (((mouseDragDistance*0.1)+8)*Math.cos(radians));
    var spriteYmod = (((mouseDragDistance*0.1)+2)*Math.sin(radians));

    spriteX += spriteXmod;
    spriteY += spriteYmod;
        
    spriteY += gravityY;
    gravityY += 0.7;

}

function checkForCollision() {
    var powerUpDetected = ndgmr.checkPixelCollision(powerUp, itemToChuck);
    var collision = ndgmr.checkPixelCollision(grumpyCat,itemToChuck);
    var easterCollision = ndgmr.checkRectCollision(easterHit,itemToChuck);


    if( powerUpDetected ) {
            
            stage.removeChild(itemToChuck);
            itemsToThrow += 2;
            spriteX = 50;
            spriteY = 500;
            displayItemToChuck();
            gameState = IN_GAME;
            score++;
    }
    if( collision ){
            spriteX = 50;
            spriteY = 450;
            displayItemToChuck();
            gameState = IN_GAME;
            score++;
            numberOfHits++;

    }
    if(easterCollision){
        console.log("Hit easter egg!");
        spriteX = 50;
        spriteY = 500;
        stage.addChild(easterBackdrop);
        grumpyCat.x = 590;
        grumpyCat.y = 410;
        stage.addChild(grumpyCat);
        stage.removeChild(powerUp);
        startPowerUp();
        drawAmmoBar();
        displayItemToChuck();
        gameState = IN_GAME;
    }
         if ( itemToChuck.y + 45 >= canvas.height ) {
            spriteX = 50;
            spriteY = 450;
            displayItemToChuck();
            gameState = IN_GAME;
         }
         if ( itemToChuck.x + 50 >= canvas.width || itemToChuck.x < 0){
            spriteX = 50;
            spriteY = 450;
            displayItemToChuck();
            gameState = IN_GAME;
           } 

           
}


function resetGame() {
    score = 0;
	numberOfHits = 0;
    gameLevelNumber = 1;
}



function goToNextLevel() {
    numberOfHits = 0;
    gameLevelNumber++;
    switch(gameLevelNumber){
        case 1:
            itemsToThrow = LVL1;
            break;
        case 2:
            itemsToThrow = LVL2;
            break;
        case 3:
            itemsToThrow = LVL3;
            break;
        case 4:
            itemsToThrow = LVL4;
            break;
        case 5:
            itemsToThrow = LVL5;
            break;
    }
    gameState = CREATE_GAME;
}

function resetThrowItem() {
    itemX = 100;
    itemY = 500;
    drawBall();
}

function startGame() {
    score = 0;
}

function startLoop() {
    createjs.Ticker.addEventListener("tick", loop);
    createjs.Ticker.setFPS(FPS);
}

function updateItemMovement() {

    var previousXLocation = itemX;
    var previousYLocation = itemY;
    var radians = throwAngle * DEGTORAD;
    var itemXmod = ((mouseDragDistance*.1)*Math.cos(radians));
    var itemYmod = ((mouseDragDistance*.1)*Math.sin(radians));
    

    itemX += itemXmod;
    itemY += itemYmod;
   
    
    itemY += gravityY;
    gravityY += 0.5;


}


function main() {
    init();
    gameState = TITLE;
    gameOver = false;
    
}
function loop() {
    scoreText.text = "Score: " + score;
	powerText.text = "Power: " + userPower;
	angleText.text = userAngle + "\u00B0";
    switch(gameState) {
     //case CONSTRUCT:
       //construct();
       //gameState = HOLD;
       //break;
       case TITLE:
       drawTitleScreen();
        break;
       case INSTRUCTIONS:
        drawInstructionsScreen();
         break;
       case CREATE_GAME:
         drawGameScreen();
         
         drawLevelSign();
         //drawBall();
         //startGame();
         //showGame();
         //hideTitle();
         gameState = IN_GAME;
         break;
       case IN_GAME:

         drawScore();
         movePowerUp();
         //moveBall();
         if(gameLevelNumber === 5 && numberOfHits === 3){
            drawWinScreen();
            gameState = WIN_GAME;
            gameOver = true;
            break;
         }
         if(numberOfHits === 3){
            goToNextLevel();
         }
         if(itemsToThrow === 0 || itemsToThrow < 3 - numberOfHits) {

            gameState = GAME_OVER;
            gameOver = true;
         }
              
         break;
       case THROWING_ITEM:
         //drawBall();
         //moveBall();
         updateTossedItem();
         checkForCollision();
         movePowerUp();
         drawScore();

         break;

       case GAME_OVER:
         drawGameOverScreen();
         break;
       case WIN_GAME:
        //drawWinScreen();
         break;
       case PAUSED:
            break;
   }
stage.update();
}
if( !!(window.addEventListener)) {
    window.addEventListener ("DOMContentLoaded", main);

}else{//MSIE
    window.attachEvent("onload", main);
}

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

var canvas, stage, queue, context;
var gameState;
var startButton, instructionsButton, restartButton;
var titleScreen, instructionsScreen, button, backDrop1, grumpyCat;
var gameTimer, gameLevelNumber;
var gameOver, score, scoreText;
var TITLE = 0, INSTRUCTIONS = 1, CREATE_GAME = 2, IN_GAME = 3, GAME_OVER = 4, PAUSED = 5, THROWING_ITEM= 6;

var mouseX, mouseY, mousePositionText;

var walk, blocks, blockArray, spriteX, spriteY;

var walkingDirection;

var gameOver, timeLimit = 120;

var jamieMode, paused;

var score;//High score persistance if time available 

var startXposition, startYposition, endXposition, endYposition;
var ball;
blockArray = [];



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
    stage.addChild(text);
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

    walk.x=spriteX;
    walk.y=spriteY;
    walk.gotoAndPlay(walkingDirection);
    stage.addChild(walk);
}

function drawInstructionsScreen() {
    stage.removeAllChildren();
    instructionsScreen.x = 0;
    instructionsScreen.y = 0;

    var text = new createjs.Text("Instructions", "50px Arial", "#EFC94C"); 
    text.x = 270; 
    text.y = 100;

    startButton.x = 600;
    startButton.y = 500;


    stage.addChild(instructionsScreen);
    stage.addChild(text);
    stage.addChild(startButton);
}

function drawGameScreen() {
    stage.removeAllChildren();
    gameScreen.x = 0;
    gameScreen.y = 0;


    stage.addChild(backDrop1);

    grumpyCat.x = 520;
    grumpyCat.y = 350;
    stage.addChild(grumpyCat);
    displaySprites();
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
    stage.addChild(text);
    stage.addChild(finalScoreText);
    stage.addChild(restartButton);
}

fileManifest = [
                {src:"titleScreen.jpg", id:"titleScreen"},
                {src:"instructionsScreen.jpg", id:"instructionsScreen"},
                {src:"startButton.jpg", id:"startButton"},
                {src:"instructionsButton.jpg", id:"instructionsButton"},
                {src:"restartButton.jpg", id:"restartButton"},
                {src:"gameScreen.jpg", id:"gameScreen"},
                {src:"gameOverScreen.jpg", id:'gameOverScreen'},
                {src:"sprites.png", id:"mySprites"},
                {src:"gameBackdrop_1.jpg", id:"backDrop1"},
                {src:"grumpyCat.png", id:"grumpyCat"}
    
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
            gameState = CREATE_GAME;
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
    spriteY = 500;
    mousePositionText = new createjs.Text("Mouse X: " +mouseX + "  Mouse Y:" + mouseY, "15px Arial", "#253742");
    scoreText = new createjs.Text("Score: "+ score, "19px Arial", "#253742"); 
    drawScore();
    startLoop();
    itemX = 100;
    itemY = 500;
}

function handleMouseDown(event) {
    if(gameState === IN_GAME){
        startXposition = mouseX;
        startYposition = mouseY;
    }
}

function handleMouseRelease(event) {
    if(gameState === IN_GAME){
        endXposition = mouseX;
        endYposition = mouseY;
        console.log("Start X & Y: " + startXposition + ", " + startYposition);
        console.log("End X & Y: " + endXposition + ", " + endYposition);
        var dy = (endYposition - startYposition);
        var dx = (endXposition - startXposition);
        var theta = Math.atan2(dy, dx);
        theta *= RADTODEG;
        theta += 180;
        throwAngle = theta;
        console.log("Angle: "+ theta);

        dy *= dy;
        dx *= dx;
        mouseDragDistance = Math.sqrt(dx + dy);
        console.log("Distance: "+mouseDragDistance);
        gravityY = 0;
        updateItemMovement();
        updateItemTossedMovement();
        gameState = THROWING_ITEM;
        
    }
}

function init() {
    resetGameTimer();
    score = 0;
    gameLevelNumber = 1;
    openCanvas();
    loadFiles();
    gameOver = false;
    jamieMode = false;
    walkingDirection = "walkRight";
    

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    stage.on("mousedown", handleMouseDown);
    stage.on("pressup", handleMouseRelease);
     
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
            console.log("Up released");
            break;
        case 37:
            console.log("Left released");
            walkingDirection = "walkLeft";
            break;
        case 39:
            console.log("Right released");
            walkingDirection = "walkRight";
            break;
        case 40:
            console.log("Down released");
            break;
        case 74:
            console.log("J key released");
            if(jamieMode){
                jamieMode = false;
            } else {
                jamieMode = true;
            }
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
    displaySprites();
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
    scoreText.y = 15;

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
    walk.x=spriteX;
    walk.y=spriteY;
}

function updateItemTossedMovement() {

    var previousXLocation = spriteX;
    var previousYLocation = spriteY;
    var radians = throwAngle * DEGTORAD;
    var spriteXmod = ((mouseDragDistance*0.1)*Math.cos(radians));
    var spriteYmod = ((mouseDragDistance*0.1)*Math.sin(radians));

    spriteX += spriteXmod;
    spriteY += spriteYmod;
        
    spriteY += gravityY;
    gravityY += 0.7;

}

function checkForCollision() {
    var collision = ndgmr.checkPixelCollision(grumpyCat,walk);
         if( collision ){
            spriteX = 50;
            spriteY = 500;
            drawNewSprite();
            gameState = IN_GAME;
            score++;
         }
         if ( walk.y + 10 >= canvas.height ) {
            spriteX = 50;
            spriteY = 500;
            drawNewSprite();
            gameState = IN_GAME;
         }
         if ( walk.x + 20 >= canvas.width || walk.x - 20 < 0){
            spriteX = 50;
            spriteY = 500;
            drawNewSprite();
            gameState = IN_GAME;
           } 
}


function resetGameTimer() {
    timerCount = 0;
    gameTimer = 0;
}

function resetGame() {
    resetGameTimer();
    score = 0;
    gameLevelNumber = 1;
}

function runGameTimer() {
    timerCount += 1;
    if (timerCount%(FPS/10) ===0 ) {
        gameTimer = timerCount/(FPS);
    }
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
    if(throwAngle < 360){
        //throwAngle++;
    }
    //mouseDragDistance = 25;
    
    itemY += gravityY;
    gravityY += 0.5;


}


function main() {
    init();
    gameState = TITLE;
    gameOver = false;
    
}
function loop() {
    runGameTimer();
     scoreText.text = "Score: " + score;
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
         resetGameTimer();
         break;
       case IN_GAME:
         //gameLoop();

         drawScore();
         //moveBall();
         if(gameTimer > timeLimit) { gameState = GAME_OVER; gameOver = true; }
         break;
       case THROWING_ITEM:
         //drawBall();
         //moveBall();
         updateTossedItem();
         checkForCollision();
         drawScore();
         break;

       case GAME_OVER:
         drawGameOverScreen();
         //hideGame();
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

var c = document.getElementById("drawCanvas");
var pen = c.getContext("2d");
c.width = 400*3;
c.height = 400*3;
//not necessary to understand, just setting up canvas ^

pen.font = "50px cursive";

var keyDown = [];

onkeydown = (e) => {
    keyDown[e.key] = true;
}
onkeyup = (e) => {
    keyDown[e.key] = false;
}

setInterval(update, 1000/60); 
//calls update 60 times a second

var dinoHeight = 0;
var dinoVelocity = 0;
var dinoTallness = 50*3;
var ducking = false;
var gravity = 0.5*3;

var dinoImg = new Image();
dinoImg.src = "wilbur.png";
var birdImg = new Image();
birdImg.src = "death.png";
var obstacleImg = new Image();
obstacleImg.src = "cccactus.png";

var obstacleTimer = 0;

var score = 0;

var birdTimer = Math.random() * 3000 + 1000;

function update(){
    if(dinoHeight != Infinity){
        score += 1;
    }
    birdTimer -= 1000/60;
    obstacleTimer -= 1000/60;
    if(obstacleTimer < 0){
        new obstacle();
        obstacleTimer = Math.random() * 3000 + 1000;
    }
    if(birdTimer < 0){
        new bird();
        birdTimer = Math.random() * 3000 + 1000;
    }
    //clear canvas
    pen.clearRect(0, 0, 400*3, 400*3);

    pen.fillStyle = "black";
    //draw ground
    pen.fillRect(0, 300*3, 400*3, 100*3);

    pen.fillText("Score: " + score, 50*3, 50*3);

    //draw dino
    pen.strokeRect(50*3, 250*3 - dinoHeight + 50*3 - dinoTallness, 50*3, dinoTallness);
    pen.drawImage(dinoImg, 50*3, 250*3 - dinoHeight + 50*3 - dinoTallness, 50*3, dinoTallness);

    if(dinoHeight <= 0){
        if(keyDown[" "] || keyDown["w"]){
            dinoVelocity = 15*3;
        }
    }

    if(keyDown["s"]){
        ducking = true;
        dinoTallness = 30*3;
        dinoVelocity = -30*3;
    } else {
        ducking = false;
        dinoTallness = 50*3;
    }

    dinoVelocity -= gravity;
    dinoHeight += dinoVelocity;

    if(dinoHeight <= 0){
        dinoHeight = 0;
        dinoVelocity = 0;
    }

    var dinoRect = [[50*3, 250*3 - dinoHeight + 50*3 - dinoTallness], [50*3, 250*3 - dinoHeight + 50*3 - dinoTallness + dinoTallness], [50*3 + 50*3, 250*3 - dinoHeight + 50*3 - dinoTallness], [50*3 + 50*3, 250*3 - dinoHeight + dinoTallness + 50*3 - dinoTallness]];

    //same as "i in" from python
    for(i of obstacles){
        i.update();
        i.draw();
        var obstRect = [[i.x, i.y], [i.x, i.y + 25*3], [i.x + 25*3, i.y], [i.x + 25*3, i.y + 25*3]];
        if(touching(dinoRect, obstRect) || touching(obstRect, dinoRect)){
            console.log("ded");
            dinoHeight = Infinity;
        }
    }

    for(i of birds){
        i.update();
        i.draw();
        var obstRect = [[i.x, i.y], [i.x, i.y + 25*3], [i.x + 25*3, i.y], [i.x + 25*3, i.y + 25*3]];
        if(touching(dinoRect, obstRect) || touching(obstRect, dinoRect)){
            console.log("ded");
            dinoHeight = Infinity;
        }
    }
}

var obstacles = [];

var birds = [];

function obstacle(){
    obstacles.push(this);
    this.x = 400*3;
    this.y = 275*3;
    this.update = function(){
        this.x -= 3*3;
    }
    this.draw = function(){
        pen.fillStyle = "red";
        pen.strokeRect(this.x, this.y, 25*3, 25*3);
        pen.drawImage(obstacleImg, this.x, this.y, 25*3, 25*3);
    }
}

function bird(){
    birds.push(this);
    this.x = 400*3;
    this.y = 230*3;
    this.update = function(){
        this.x -= 3*3;
    }
    this.draw = function(){
        pen.fillStyle = "red";
        pen.drawImage(birdImg, this.x, this.y, 25*3, 25*3);
        pen.strokeRect(this.x, this.y, 25*3, 25*3);
    }
}

function touching(r1, r2){
    //r1 = [[1, 2], [1, 3], [3, 2], [3, 3]];
    //r1 = top left, bottom left, top right, bottom right

    for(i of r1){
        if(i[0] < r2[2][0] && i[0] > r2[0][0] && i[1] > r2[0][1] && i[1] < r2[1][1]){
            return true;
        }
    }
}
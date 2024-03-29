'use strict';

const form = document.getElementById("form");
const teamLabelsTextarea =  document.getElementById("teams-labels");
const teamMembersTextarea = document.getElementById( "teams-members" );

let shuffle = function( array ) {
	array.sort(function(a, b){return 0.5 - Math.random()});
}

let lottery = function( members, groupNames ) {
 
  let current = 0, teams = Array();
  const modulo = members.length % groupNames.length;
  const minPerGroup = Math.floor(members.length / groupNames.length );
  const maxPerGroup = Math.floor(members.length / groupNames.length ) + (modulo > 0);  
  shuffle( members );
  for ( let i = 0; i<groupNames.length; i++) {
    if ( i < modulo || modulo === 0 ) {
      teams.push(members.slice(i*(maxPerGroup), (i+1)*(maxPerGroup)));
    } else {
      teams.push(members.slice((maxPerGroup*modulo+(i-modulo)*minPerGroup), (maxPerGroup*modulo+(i-modulo+1)*minPerGroup)));
    }
  }  
  return groupMembersByLabels( teams, groupNames );
}

let groupMembersByLabels = function( teamsArray, labelsArray ) {
  let constitution = {};
  shuffle(labelsArray);
  for ( let i = 0; i < labelsArray.length; i++ ) {
    constitution[labelsArray[i]] = teamsArray[i];
  }
  return constitution;
}

let toArray = function( string ) {
  string = string.trim();
  string = string.replace(/\n/g, ",");
  let array = string.split(",");
  array = array.filter(function(entry) { return entry.trim() != ''; });
  return array;
};

let addCopyListener = function() {
  const copyButton = document.getElementById('copy');
  copyButton.addEventListener('click', () => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('finalteams'));
    selection.removeAllRanges();
    selection.addRange(range);
    try {
      document.execCommand('copy');
      selection.removeAllRanges();
      const original = copyButton.textContent;
      copyButton.textContent = 'copied!'; 
      setTimeout(() => {
        copyButton.textContent = original;
      }, 1000);
    } catch(e) {
      console.log(e);
    }
  });
}

let displayResults = function(teams, where, teamsArray) {   
  let inner = '';
  const originalLabels = toArray( teamLabelsTextarea.value );
  for ( let i =0 ; i < originalLabels.length; i++ ) {
    let property = originalLabels[i];
    inner += `<section><h2>${property} </h2><p>`;
    for (let i=0; i<teams[property].length; i++) {
       inner += `<span>${teams[property][i]}</span>`;
      if (i < teams[property].length - 1) {
        inner += ', ';
      }
    }
     inner += ` (${teams[property].length})</p></section>`;
  }
    where.innerHTML = inner;
}

addCopyListener();

form.addEventListener( "submit", function( event ) {  
  event.preventDefault();
  const namesArray = toArray( teamMembersTextarea.value );
  const teamsArray = toArray( teamLabelsTextarea.value );
  const teams = lottery( namesArray, teamsArray );
  displayResults( teams, document.getElementById("finalteams"), teamsArray );
});


// Credits Bouncing random balls by Roberto Pérez https://codepen.io/todomagichere/pen/BqeMvd Thank you!

//Gravity
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

let canvas = document.createElement('canvas');
canvas.id = 'screen';
document.body.appendChild(canvas);
canvas.width = 2*window.innerWidth;
canvas.height = 2*window.innerHeight;
canvas.style.width = "100vw";
canvas.style.height = "100vh";
var screenWidth = canvas.width/2;
var screenHeight = canvas.height/2;
var ctx = canvas.getContext("2d");
ctx.scale(2,2);
var fps = 90;
var interval = 1000/fps;
var lastTime = (new Date()).getTime();
var currentTime = 0;
var delta = 0;

function mainLoop() {
    window.requestAnimationFrame(mainLoop);

    currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime);

    if (delta > interval) {
        ctx.fillStyle = "#FCEEB5";
        ctx.fillRect(0, 0, screenWidth, screenHeight);
        draw();
        controlBall();
        lastTime = currentTime - (delta % interval);
    }
}

function controlBall() {
    if (randomNumber(1,100) < 2) {
        ballArray.push(new Ball());            
    }
    if (ballArray.length === 40) {
        for (var i = 0; i < 20; i++) {
            ballArray.shift();
        }
    }    
}

function draw() {
    drawBall();
}

var ballArray = [];
var colorArray = ["#EE786E", "#A2CCB6"];
var gravity = 0.9;

function drawBall() {
    for (var i = 0; i < ballArray.length; i++) {
        var ball = ballArray[i];
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        
        ball.x += ball.xd;
        if (ball.x + ball.radius > screenWidth || ball.x - ball.radius < 0) {
            ball.xd *= -1;
        }
        
        ball.gravitySpeed += gravity;
        ball.y += (ball.yd + ball.gravitySpeed);
        if (ball.y + ball.radius > screenHeight) {
            if (ball.xd !== 0) {
                ball.xd *= ball.friction  ;
            }
            ball.y = screenHeight - ball.radius;
            ball.gravitySpeed = -(ball.gravitySpeed * ball.bounce);
        }
    }
}

function Ball() {
    this.radius = randomNumber(5, 20);
    this.color = colorArray[randomNumber(0, colorArray.length -1)];
    this.x = randomNumber(this.radius, screenWidth - this.radius);
    this.y = -this.radius;
    this.yd = 0;
    this.xd = randomNumber(-5, 5);
    this.gravitySpeed = 0;
    this.bounce = 0.8;
    this.friction = 0.99;
    return this;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

mainLoop();
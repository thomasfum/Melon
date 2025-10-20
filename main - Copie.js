//from https://github.com/pkisung/watermelon-game
//https://github.com/TCK2001/Suika-game
//https://cdnjs.com/libraries/matter-js/0.19.0
//https://github.com/liabru/matter-js/tree/master
//images
//https://www.nintendo-difference.com/news/une-traduction-anglaise-disponible-pour-suika-game-sur-nintendo-switch-avec-un-theme-halloween-notre-video-de-gameplay-maison/
import { FRUITS_PUBLIC } from "./fruits.js";
import { FRUITS_PUBLIC_2 } from "./fruits.js";
import { FRUITS_HLW } from "./fruits.js";
 let 	
	Bodies = Matter.Bodies,
	Body = Matter.Body,
	Engine = Matter.Engine,
	Events = Matter.Events,
	Render = Matter.Render,
	Runner = Matter.Runner,
	World = Matter.World;
	  
	let FRUITS=  FRUITS_PUBLIC;
	PreloadImages();
	
	let num_suika = 0;
	let skin = 0;
	let bestScore=0;
	
	//setCookie("BestScore",33,1000);
	bestScore=getCookie("BestScore");
	//console.log("BS",bestScore+1);
	if(bestScore=="")
		bestScore=0;
	document.getElementById("BestScore").innerHTML=+bestScore;
	// Canvas setup
	var canvas2 = document.getElementById("canvas");
	var canvas = document.getElementById("world");
	
	canvas.height = document.getElementById("world").clientHeight;//window.innerHeight;
	canvas.width = document.getElementById("world").clientWidth;//window.innerWidth;
	console.log("h="+canvas.height);
	
	
	window.addEventListener("resize", function () {
		canvas.height = document.getElementById("world").clientHeight;//window.innerHeight;
		canvas.width = document.getElementById("world").clientWidth;//window.innerWidth;
		console.log("hr="+canvas.height);	
		/*
	   // set the render size to equal window size
        Render.setSize(render, canvas.width, canvas.height);	
		  // update the render bounds to fit the scene
        Render.lookAt(render, Composite.allBodies(engine.world), {
            x: 50,
            y: 50
        });
		*/
	});  
	 var nextIndex = Math.floor(Math.random() * 6);  
	  
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}  
	  
function percentX(percent) {
  return Math.round((percent / 100) * canvas.width);
}
function percentY(percent) {
  return Math.round((percent / 100) * canvas.height);
}
var ratio= canvas.height/850;//850 original height
var XYRatio=850/620*2;
const engine = Engine.create();
const render = Render.create({
  engine, 
  //element: canvas,
  canvas: canvas2,
  options: {
    wireframes: false,
    background: "#FF000000F7F4C8",
    width: canvas.width,//620,
    height: canvas.height,//850,
  }
}); 

const world = engine.world;

const leftWall = Bodies.rectangle(percentX(-50)/XYRatio+canvas.width/2, percentY(50), percentX(2), percentY(100), {
    isStatic: true, 
    render: { fillStyle: "rgba(0, 0, 255, 0)" /*"#E6B143" */}
  })

const rightWall = Bodies.rectangle(percentX(50)/XYRatio+canvas.width/2, percentY(50), percentX(2), percentY(100), {
  isStatic: true, 
  render: { fillStyle: "rgba(0, 0, 255, 0)" /*"#E6B143"*/ }
})

const groundWall = Bodies.rectangle(canvas.width/2,percentY(96), percentX(50), percentY(4), {
  isStatic: true, 
  render: { fillStyle: "rgba(0, 0, 255, 0)" /*"#E6B143"*/ }
})

const topLine = Bodies.rectangle(percentX(0)/XYRatio+canvas.width/2, percentY(20), percentX(100)/XYRatio, percentY(1), {
//const topLine = Bodies.rectangle(percentX(50)/XYRatio, percentY(80), percentX(100)/XYRatio, percentY(1), {
  name: "topLine",
  isSensor: true,
  isStatic: true,
  render: { fillStyle:"rgba(0, 0, 255, 0)" /*"#E6B143"*/}
})

var NextFruit = Bodies.circle(10, percentY(10),  FRUITS[nextIndex].radius*ratio, {
    index: -1,
    isSleeping: false,
	  isStatic: true,
    render: {
      sprite: { texture: `${FRUITS[nextIndex].name}.png`, 
	  xScale: ratio,
	  yScale: ratio,
	  }}});

function Swipe()
{
	//console.log("Swipe");
	const smallBody= [];
	engine.world.bodies.forEach((body)=>{
		if((body.isStatic==false)&&(body.isSleeping == false))
		{
			console.log("body.index= "+body.index);
			if(body.index<3)
			{
				smallBody.push(body);
			}
		}
	});
		World.remove(world, smallBody);
}

function Restart()
{
		document.getElementById("gameover").style.opacity = "0";	
		setTimeout(function(){ 
			document.getElementById("gameover").style.display = "none"; 
			document.getElementById("gameover").style.opacity = "1";	
		}, 600);
		let score=0;
		document.getElementById("Score").innerHTML=score;
		document.getElementById("BestScore").innerHTML=bestScore;
		Matter.Composite.clear(engine.world,true);
		addFruit();
		isGameOver = false;
		disableAction=false;
		num_suika=0;
	
	
}
document.getElementById("gameover").onclick = function() {
		Restart();
	};
document.getElementById("Swipe").onclick = function() {
		Swipe();
	};
	
function PreloadImages()
{
	FRUITS.forEach((f)=>{
		 new Image().src = `${f.name}.png`;
	});
}
	
document.getElementById("Score").onclick = function() {
		skin++;
		if(skin>1)
			skin=0;
		if(skin==0)
			FRUITS=  FRUITS_PUBLIC;
		//if(skin==2)
		//	FRUITS=  FRUITS_PUBLIC_2;
		if(skin==1)
			FRUITS=  FRUITS_HLW;
		PreloadImages();
		
		var body = document.getElementsByTagName('body')[0];
		if(skin==0)
			body.style.backgroundImage = 'url(./images/background.jpg)';
		if(skin==1)
			body.style.backgroundImage = 'url(./images/background2.jpg)';
		
		
		Restart();
	};

World.add(world, [rightWall, leftWall, groundWall, topLine,NextFruit]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;
let isGameOver = false;

//--------------------------------------------------
// CalculateScore
//--------------------------------------------------
function CalculateScore()
{
	let score=0;
	engine.world.bodies.forEach((body)=>{
		if((body.isStatic==false) &&(body.isSleeping==false)) 
		{
			score+=FRUITS[body.index].score;
		}
	});
	document.getElementById("Score").innerHTML=score;
	return score;
}

//--------------------------------------------------
// addFruit
//--------------------------------------------------
function addFruit() {
 
  var fruit = FRUITS[nextIndex];

  const body = Bodies.circle(canvas.width/2, percentY(10),  fruit.radius*ratio, {
    index: nextIndex,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png`, 
	  xScale: ratio,
	  yScale: ratio,
	  },
	  
    },
    restitution: 0.2
  });
  World.add(world, body);
  nextIndex= Math.floor(Math.random() * 6);
  currentBody = body;
  currentFruit = fruit;

	
	World.remove(world, NextFruit);
	 
	NextFruit = Bodies.circle(percentX(84.2), percentY(23),  FRUITS[nextIndex].radius*ratio, {
    index: -1,
    isSleeping: false,
	  isStatic: true,
    render: {
      sprite: { texture: `${FRUITS[nextIndex].name}.png`, 
	  xScale: ratio,
	  yScale: ratio,
	  }}});
	 World.add(world, NextFruit);
  
}


//--------------------------------------------------
// LaunchFruit
//--------------------------------------------------
function LaunchFruit(event) 
{
	
	//check if lost
	let lost=false;
	engine.world.bodies.forEach((body)=>{
		if((body.isStatic==false)&&(body.isSleeping == false))
		{
			//console.log(body.position.y+" "+topLine.position.y);
			if(body.position.y<topLine.position.y)
			{
				lost=true;
			}
		}
	});
	if(lost==true)
	{
		console.log("Gameover");
		let score=CalculateScore();
		if(score>bestScore)
			bestScore=score;
		document.getElementById("BestScore").innerHTML=bestScore;
		setCookie("BestScore",bestScore,1000);
		disableAction=true;
		isGameOver = true;
		engine.world.bodies.forEach((body)=>{if(body.isStatic==false) body.isSleeping= true});
		document.getElementById("gameover").innerHTML="Game Over";
		document.getElementById("gameover").style.background="crimson";
		document.getElementById("gameover").style.display = "block";
	}
	else
	{
		//launch fruit
		currentBody.isSleeping = false;
		disableAction = true;

		setTimeout(() => {
			addFruit();
			disableAction = false;
			CalculateScore();
		}, 800);
	}
}

//--------------------------------------------------
// mouse click
//--------------------------------------------------
function ClickMouse(event) 
{
	/*
  document.body.textContent =
    "clientX: " + event.clientX +
    " - clientY: " + event.clientY;
	*/
	if(disableAction == true)
		return;
	
	if((event.clientX + currentFruit.radius*ratio <  percentX(+55)/XYRatio+canvas.width/2)&& (event.clientX - currentFruit.radius*ratio >  percentX(-55)/XYRatio+canvas.width/2)  )
	{
		Body.setPosition(currentBody, {
		  x: event.clientX,
		  y: currentBody.position.y,
		});
		LaunchFruit();
	}
	
}
document.addEventListener("click", ClickMouse);

//--------------------------------------------------
// key down
//--------------------------------------------------
window.onkeydown = (event) => {
	
	document.getElementById("info").innerHTML="c="+event.code;
	
	if(isGameOver == true)
	{ 
		switch(event.code) {
			case "Space":
				Restart();
			break;
		}
		
	}
	
	if(disableAction) { 
		return;
	}
  
  switch(event.code) {
	case "ArrowLeft":
    case "KeyA":
      if(currentBody.position.x - currentFruit.radius*ratio > percentX(-45)/XYRatio+canvas.width/2)
      Body.setPosition(currentBody, {
      x: currentBody.position.x -  percentX(2),
      y: currentBody.position.y,
    });
    break;
	case "ArrowRight":
    case "KeyD":
      if(currentBody.position.x + currentFruit.radius*ratio < percentX(+45)/XYRatio+canvas.width/2)
      Body.setPosition(currentBody, {
      x: currentBody.position.x +  percentX(2),
      y: currentBody.position.y,
    });
    break;
	case "ArrowDown":
    case "KeyS":
	case "Space":
		LaunchFruit();
      break;
  }
}

Events.on(render, "afterRender", (event) => {
	
	const ctx = canvas2.getContext("2d");
	ctx.beginPath();
	if(skin==0)
		ctx.fillStyle = "rgba(241,213,130,255)";
	if(skin==1)
		ctx.fillStyle = "rgba(158,128,250,255)";
	ctx.fillRect(canvas.width/2-percentX(100)/XYRatio/2, percentY(19),  percentX(95)/XYRatio, percentY(2));
	ctx.stroke();

});

//--------------------------------------------------
// collision
//--------------------------------------------------
Events.on(engine,"collisionStart", (event) => {
  event.pairs.forEach((collision) => {
	  
	  if(!((collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")))
		CalculateScore();
    if(collision.bodyA.index === collision.bodyB.index){
      const index = collision.bodyA.index;
		
      if(index === FRUITS.length - 1){
        return;
      }

      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newFruit = FRUITS[index + 1 ];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius*ratio,
        {
          render: {
          sprite: { texture: `${newFruit.name}.png`,
			xScale: ratio,
			yScale: ratio,		  
			}
          },
          index: index + 1,
        }
      );

      World.add(world, newBody);
	  if (newBody.index >= 10) {
            num_suika++;
          }
    }
	/*
    if(!disableAction &&  (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine"))
	{
		let score=CalculateScore();
		if(score>bestScore)
			bestScore=score;
		document.getElementById("BestScore").innerHTML="Best Score: "+bestScore;
		setCookie("BestScore",bestScore,1000);
		disableAction=true;
		isGameOver = true;
		engine.world.bodies.forEach((body)=>{if(body.isStatic==false) body.isSleeping= true});
		document.getElementById("gameover").innerHTML="Game Over";
		document.getElementById("gameover").style.background="crimson";
		document.getElementById("gameover").style.display = "block";
	}
	*/
	if (num_suika === 2) 
	{
		let score=CalculateScore();
		if(score>bestScore)
			bestScore=score;
		document.getElementById("BestScore").innerHTML=bestScore;
		setCookie("BestScore",bestScore,1000);
        disableAction=true;
		isGameOver = true;
		engine.world.bodies.forEach((body)=>{if(body.isStatic==false) body.isSleeping= true});
		document.getElementById("gameover").innerHTML="YOU WIN";
		document.getElementById("gameover").style.background="chartreuse";
		document.getElementById("gameover").style.display = "block";
    }
  });
});

addFruit();


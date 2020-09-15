import { Component,  ViewChild, ElementRef,OnInit } from '@angular/core';

@Component({
  selector: 'homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  // @ViewChild('canvas', { static: true })
  // canvas: ElementRef<HTMLCanvasElement>;  

ngOnInit(){
	  (function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.requestAnimationFrame || 
								  window.webkitRequestAnimationFrame || window.requestAnimationFrame || function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
	  window.requestAnimationFrame = requestAnimationFrame as any;
	})();

	// Terrain stuff.
	var terrain = document.getElementById("terCanvas") as any,
		background = document.getElementById("bgCanvas") as any,
		terCtx = terrain.getContext("2d"),
		bgCtx = background.getContext("2d"),
		width = window.innerWidth,
		height = document.body.offsetHeight;
    (height < 600)?height = 600:height;

	terrain.width = background.width = width;
	terrain.height = background.height = height;

	// Some random points
	var points = [],
		displacement = 140,
		power = Math.pow(2,Math.ceil(Math.log(width)/(Math.log(2))));
	
	// set the start height and end height for the terrain
	points[0] = (height - (Math.random()*height/2))-displacement;
	points[power] = (height - (Math.random()*height/2))-displacement;

	// create the rest of the points
	for(var i = 1; i<power; i*=2){
		for(var j = (power/i)/2; j <power; j+=power/i){
			points[j] = ((points[j - (power/i)/2] + points[j + (power/i)/2]) / 2) + Math.floor(Math.random()*-displacement+displacement );
		}
		displacement *= 0.6;
	}

	// draw the terrain
	terCtx.beginPath();
					
	for(var i = 0; i<=width; i++){
		if(i === 0){
			terCtx.moveTo(0, points[0]);
		}else if(points[i] !== undefined){
			terCtx.lineTo(i, points[i]);
		}
	}

	terCtx.lineTo(width,terrain.height);
	terCtx.lineTo(0,terrain.height);
	terCtx.lineTo(0,points[0]);
	terCtx.fill();
	// terCtx.fillStyle="#3b8beb";


	// Second canvas used for the stars
	bgCtx.fillStyle = '#05004c';
	bgCtx.fillRect(0,0,width,height);

	// stars
	function Star(options){
		this.size = Math.random()*1;
		this.speed = Math.random()*.1;
		this.x = options.x;
		this.y = options.y;
	}

	Star.prototype.reset = function(){
		this.size = Math.random()*2;
		this.speed = Math.random()*.1;
		this.x = width;
		this.y = Math.random()*height;
	}
	
	Star.prototype.update = function(){
		this.x-=this.speed;
		if(this.x<0){
		  this.reset();
		}else{
		  bgCtx.fillRect(this.x,this.y,this.size,this.size); 
		}
	}
	
	function ShootingStar(){
		this.reset();
	}
	
	ShootingStar.prototype.reset = function(){
		this.x = Math.random()*width;
		this.y = 0;
		this.len = (Math.random()*80)+10;
		this.speed = (Math.random()*10)+6;
		this.size = (Math.random()*1)+0.5;
    // this is used so the shooting stars arent constant
		this.waitTime =  new Date().getTime() + (Math.random()*3000);
		this.active = false;
	}
	
	ShootingStar.prototype.update = function(){
		if(this.active){
			this.x-=this.speed;
			this.y+=this.speed;
			if(this.x<0 || this.y >= height){
			  this.reset();
			}else{
			bgCtx.lineWidth = this.size;
				bgCtx.beginPath();
				bgCtx.moveTo(this.x,this.y);
				bgCtx.lineTo(this.x+this.len, this.y-this.len);
				bgCtx.stroke();
			}
		}else{
			if(this.waitTime < new Date().getTime()){
				this.active = true;
			}			
		}
	}

	var entities = [];
	
	// init the stars
	for(var i=0; i < height; i++){
		entities.push(new Star({x:Math.random()*width, y:Math.random()*height}));
	}
  
	// Add 2 shooting stars that just cycle.
	entities.push(new ShootingStar());
	entities.push(new ShootingStar());
	entities.push(new ShootingStar());
	entities.push(new ShootingStar());
	entities.push(new ShootingStar());
	entities.push(new ShootingStar());
	//animate background
	function animate(){
		bgCtx.fillStyle = '#05004c';
		bgCtx.fillRect(0,0,width,height);
		bgCtx.fillStyle = '#ffffff';
		bgCtx.strokeStyle = '#ffffff';

		var entLen = entities.length;
	  
		while(entLen--){
			entities[entLen].update();
		}
		
		requestAnimationFrame(animate);
	}
	animate();


}


 //  constructor() { }

 //  ngOnInit(): void {
 //  	(function() {
 //    let requestAnimationFrame = window.requestAnimationFrame || window.requestAnimationFrame || 
	// 							  window.webkitRequestAnimationFrame || window.requestAnimationFrame || function( callback ){
 //                window.setTimeout(callback, 1000 / 60);
 //              };
	//   window.requestAnimationFrame = requestAnimationFrame as any;
	// })();

	// // Terrain stuff.
	// let terrain = document.getElementById("terCanvas") as any,
	// 	background = document.getElementById("bgCanvas") as any,
	// 	terCtx = terrain.getContext("2d"),
	// 	bgCtx = background.getContext("2d"),
	// 	width = window.innerWidth,
	// 	height = document.body.offsetHeight;
 //    (height < 800)?height = 800:height;

	// terrain.width = background.width = width;
	// terrain.height = background.height = height;

	// // Some random points
	// let points = [],
	// 	displacement = 140,
	// 	power = Math.pow(2,Math.ceil(Math.log(width)/(Math.log(2))));
	
	// // set the start height and end height for the terrain
	// points[0] = (height - (Math.random()*height/2))-displacement;
	// points[power] = (height - (Math.random()*height/2))-displacement;

	// // create the rest of the points
	// for(let i = 1; i<power; i*=2){
	// 	for(let j = (power/i)/2; j <power; j+=power/i){
	// 		points[j] = ((points[j - (power/i)/2] + points[j + (power/i)/2]) / 2) + Math.floor(Math.random()*-displacement+displacement );
	// 	}
	// 	displacement *= 0.6;
	// }

	// // draw the terrain
	// terCtx.beginPath();
					
	// for(let i = 0; i<=width; i++){
	// 	if(i === 0){
	// 		terCtx.moveTo(0, points[0]);
	// 	}else if(points[i] !== undefined){
	// 		terCtx.lineTo(i, points[i]);
	// 	}
	// }

	// terCtx.lineTo(width,terrain.height);
	// terCtx.lineTo(0,terrain.height);
	// terCtx.lineTo(0,points[0]);
	// terCtx.fill();


	// // Second canvas used for the stars
	// bgCtx.fillStyle = '#05004c';
	// bgCtx.fillRect(0,0,width,height);

	// // stars
	// function Star(options){
	// 	this.size = Math.random()*2;
	// 	this.speed = Math.random()*.1;
	// 	this.x = options.x;
	// 	this.y = options.y;
	// }

	// Star.prototype.reset = function(){
	// 	this.size = Math.random()*2;
	// 	this.speed = Math.random()*.1;
	// 	this.x = width;
	// 	this.y = Math.random()*height;
	// }
	
	// Star.prototype.update = function(){
	// 	this.x-=this.speed;
	// 	if(this.x<0){
	// 	  this.reset();
	// 	}else{
	// 	  bgCtx.fillRect(this.x,this.y,this.size,this.size); 
	// 	}
	// }
	
	// function ShootingStar(){
	// 	this.reset();
	// }
	
	// ShootingStar.prototype.reset = function(){
	// 	this.x = Math.random()*width;
	// 	this.y = 0;
	// 	this.len = (Math.random()*80)+10;
	// 	this.speed = (Math.random()*10)+6;
	// 	this.size = (Math.random()*1)+0.1;
 //    // this is used so the shooting stars arent constant
	// 	this.waitTime =  new Date().getTime() + (Math.random()*3000)+500;
	// 	this.active = false;
	// }
	
	// ShootingStar.prototype.update = function(){
	// 	if(this.active){
	// 		this.x-=this.speed;
	// 		this.y+=this.speed;
	// 		if(this.x<0 || this.y >= height){
	// 		  this.reset();
	// 		}else{
	// 		bgCtx.lineWidth = this.size;
	// 			bgCtx.beginPath();
	// 			bgCtx.moveTo(this.x,this.y);
	// 			bgCtx.lineTo(this.x+this.len, this.y-this.len);
	// 			bgCtx.stroke();
	// 		}
	// 	}else{
	// 		if(this.waitTime < new Date().getTime()){
	// 			this.active = true;
	// 		}			
	// 	}
	// }

	// let entities = [];
	
	// // init the stars
	// for(let i=0; i < height; i++){
	// 	entities.push(new Star({x:Math.random()*width, y:Math.random()*height}));
	// }
  
	// // Add 2 shooting stars that just cycle.
	// entities.push(new ShootingStar());
	// entities.push(new ShootingStar());
	
	// //animate background
	// function animate(){
	// 	bgCtx.fillStyle = '#05004c';
	// 	bgCtx.fillRect(0,0,width,height);
	// 	bgCtx.fillStyle = '#ffffff';
	// 	bgCtx.strokeStyle = '#ffffff';

	// 	let entLen = entities.length;
	  
	// 	while(entLen--){
	// 		entities[entLen].update();
	// 	}
		
	// 	requestAnimationFrame(animate);
	// }
	// animate();

 //  }


    


}

import { neutral_90, neutral_45, neutral_10, primary_70, primary_30, primary_50 } from './themeSelection.js';

const canvas = document.getElementById('homeCanvas');
const ctx = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
const NUMBER_OF_PARTICLES = canvas.width / 2.3;
const NUMBER_DYNAMIC_PARTICLES = 100;
let particleArray = [];
let particleArrayText = [];
let particleArrayImage = [];
let adjustX = 6;
let adjustY = 0;

// handle mouse
const mouse = {
  x: null,
  y: null,
  radius: 100
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('mousemove', function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener("resize", () => {
  resizeCanvas();
});

canvas.addEventListener("click", () => {
  for(let i = 0; i < NUMBER_DYNAMIC_PARTICLES; i++){
    let x = mouse.x - (Math.random() * 200 - 100);
    let y = mouse.y - (Math.random() * 200 - 100);
    particleArray.push(new Particle(x, y));
  }
  animateWhenClicking();
})

ctx.fillStyle = neutral_90;
ctx.font = '10px Verdana';
// ctx.textAlign = 'center';
ctx.fillText('Inês Borges', 0, 13, canvas.width);
const textCoordinates = ctx.getImageData(0, 0, canvas.width, 100);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = "hsl(225, 100%, "+ Math.random() * 40 + 30 +"%)";
    this.speed = Math.random() * 5 + 1;
    this.size = Math.random() * 3 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 40) + 5;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  fall(){
    this.y += this.speed;
    if(this.y > canvas.height) this.delete;
  }
}

class ParticleText {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 40) + 5;
  }
  draw() {
    ctx.fillStyle = neutral_10;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  mouseInteraction() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

function init() {
  particleArray = [];
  for (let i = 0; i < NUMBER_OF_PARTICLES; i++) {
    let x = Math.random() * canvas.width;
    let y = 0;
    particleArray.push(new Particle(x, y));
  }

  particleArrayText = [];
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        particleArrayText.push(new ParticleText(positionX * 15, positionY * 15));
      }
    }
  }
}
init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].fall();
  }
  for (let i = 0; i < particleArrayText.length; i++) {
    particleArrayText[i].draw();
    particleArrayText[i].mouseInteraction();
  }
  connect();
  requestAnimationFrame(animate);
}
animate();

function animateWhenClicking(){
  ctx.clearRect(0,0, canvas.width, canvas.height);
  for (let i = particleArray.length - NUMBER_DYNAMIC_PARTICLES; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].fall();
  }
}

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particleArrayText.length; a++) {
    for (let b = a; b < particleArrayText.length; b++) {
      //let dx = mouse.x - this.x;
      //let dy = mouse.y - this.y;
      //let distance = Math.sqrt(dx * dx + dy * dy);
      let dx = particleArrayText[a].x - particleArrayText[b].x;
      let dy = particleArrayText[a].y - particleArrayText[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      opacityValue = (1 - (distance / 25)) * 100;
      ctx.strokeStyle = neutral_10.substring(0, 11) + opacityValue + '%' + neutral_10.substring(13);
      if (distance < 25) {

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particleArrayText[a].x, particleArrayText[a].y);
        ctx.lineTo(particleArrayText[b].x, particleArrayText[b].y);
        ctx.stroke();
      }
    }
  }
}

// Image part -------------------------------------------------

function drawImage(){
  let imageWidth = png.width;
  let imageHeight = png.height;

  const data = ctx.getImageData(0, 0, canvas.width, 900);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  class ParticleImage{
    constructor(x, y, color, size){
      this.x = x + canvas.width/2 - png.width*2;
      this.y = y + 200 - png.width*2;
      this.color = color;
      this.size = size;
      this.baseX = x + canvas.width/2 - png.width*2;
      this.baseY = y + 200 - png.width*2;
      this.density = Math.random() * 10 + 2;
    }

    draw(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.Pi * 2);
      ctx.closePath();
      ctx.fill();
    }

    mouseInteraction(){
      ctx.fillStyle = this.color;

      // Collision detection
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;

      const maxDistance = 100;
      let force = (maxDistance - distance) / maxDistance;
      if(force < 0) force = 0;

      let directionX = forceDirectionX * force * this.density * 0.6;
      let directionY = forceDirectionY * force * this.density * 0.6;

      if(distance < mouse.radius + this.size){
        this.x -= directionX;
        this.y -= directionY;
      }else {
        if(this.x !== this.baseX){
          let dx = this.x - this.baseX;
          this.x -= dx / 20;
        }
        if(this.y !== this.baseY){
          let dy = this.y - this.baseY;
          this.y -= dy/20;
        }
      }
      this.draw();
    }
  }

  function initImage(){
    particleArrayImage = [];

    for(let y = 0; y < data.height; y++){
      for(let x=0; x < data.width; x++){
        if(data.data[(y * 4 * data.width) + (x * 4) + 3] > 128){
          let positionX = x;
          let positionY = y;
          let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," + data.data[(y * 4 * data.width) + (x * 4) + 1] + "," + data.data[(y * 4 * data.width) + (x * 4) + 2] + ")";
          particleArrayImage.push(new ParticleImage(positionX, positionY, color))
        }
      }
    }
  }

  function animateImage() {
    requestAnimationFrame(animateImage);
    ctx.fillStyle = "rgba(0,0,0,0.00)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < particleArrayImage.length; i++){
      particleArrayImage[i].mouseInteraction();
    }
  }
  initImage();
  animateImage();

  window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    initImage();
  });
}

const png = new Image();
png.src = "data:image/png;base64,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";

window.addEventListener("load", () => {
  console.log("page has loaded");
  ctx.drawImage(png, 0, 0); // This is part of the canvas API
  drawImage(); // This is the custom method
});
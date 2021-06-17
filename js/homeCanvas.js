import { neutral_90, neutral_45, neutral_10, primary_70, primary_30, primary_50 } from './themeSelection.js';

const canvas = document.getElementById('homeCanvas');
const ctx = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
const NUMBER_OF_PARTICLES = canvas.width / 2.3;
const NUMBER_DYNAMIC_PARTICLES = 100;
let particleArray = [];
let particleArrayText = [];
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
ctx.textAlign = 'center';
ctx.fillText('Inês Borges', canvas.width / 2, 0, canvas.width);
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
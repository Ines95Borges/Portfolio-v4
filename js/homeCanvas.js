document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("homeCanvas");
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const NUMBER_OF_PARTICLES = canvas.width / 2;
  let particleArray;

  const mouse = {
    x: null,
    y: null,
    radius: 150
  }

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    console.log(mouse.x, mouse.y);
  });

  function drawTextOnCanvas(size, text, position){
    // Draw text on canvas
    ctx.font = `${size}px Courier New`;
    ctx.textAlign = "center";
    ctx.fillText(`${text}`, canvas.width / 2, position);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  class Particle {
    constructor(x, y){
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 2;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 30 + 1;
    }

    draw(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

  }

  function init(){ // On load draws particles on screen
    particleArray = [];
    for(let i = 0; i < NUMBER_OF_PARTICLES; i++){
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      particleArray.push(new Particle(x, y));
    }
  }
  init();

  function animate(){ // loop to draw canvas infinitively
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < particleArray.length; i++){
      particleArray[i].draw();
    }
    drawTextOnCanvas(60, "Inês Borges", 100);
    drawTextOnCanvas(30, "Portfolio", 170);
    requestAnimationFrame(animate);
  }
  animate();

});
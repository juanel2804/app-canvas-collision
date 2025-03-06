// Selecciona el elemento <canvas> del documento HTML
const canvas = document.getElementById("canvas");

// Obtiene el contexto 2D del canvas para poder dibujar
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la ventana actual del navegador
const window_height = window.innerHeight;
const window_width = window.innerWidth;

// Ajusta el tamaño del canvas al tamaño de la ventana
canvas.height = window_height;
canvas.width = window_width;

// Establece el color de fondo del canvas
canvas.style.background = "#ff8";

// Cargar sonido de colisión
const collisionSound = new Audio("collision.mp3");
collisionSound.volume = 0.5; // Ajustar volumen

// Pedir al usuario el número de círculos y velocidad
let numCircles = parseInt(prompt("¿Cuántos círculos quieres? (Número entre 1 y 50)", "10"));
if (isNaN(numCircles) || numCircles < 1 || numCircles > 50) numCircles = 10;

let speedFactor = parseFloat(prompt("Elige la velocidad de los círculos (0.1 a 5)", "2"));
if (isNaN(speedFactor) || speedFactor < 0.1 || speedFactor > 5) speedFactor = 2;

// Clase Circle para representar un círculo en el canvas
class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.speed = speed;
    this.dx = (Math.random() * 2 - 1) * this.speed;
    this.dy = (Math.random() * 2 - 1) * this.speed;
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    this.draw(context);
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.posX += this.dx;
    this.posY += this.dy;
  }
}

function detectCollision(circle1, circle2) {
  let dx = circle2.posX - circle1.posX;
  let dy = circle2.posY - circle1.posY;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return distance < circle1.radius + circle2.radius;
}

function resolveCollision(circle1, circle2) {
  let tempDx = circle1.dx;
  let tempDy = circle1.dy;
  circle1.dx = circle2.dx;
  circle1.dy = circle2.dy;
  circle2.dx = tempDx;
  circle2.dy = tempDy;
  
  // Reproducir sonido de colisión
  let sound = collisionSound.cloneNode();
  sound.play().catch(err => console.log("Error al reproducir el sonido: ", err));
}

// Crear múltiples círculos aleatorios sin que se superpongan
let circles = [];

for (let i = 0; i < numCircles; i++) {
  let radius = Math.floor(Math.random() * 30) + 20;
  let x, y;
  let overlapping;

  do {
    overlapping = false;
    x = Math.random() * (window_width - radius * 2) + radius;
    y = Math.random() * (window_height - radius * 2) + radius;
    
    for (let j = 0; j < circles.length; j++) {
      let other = circles[j];
      let dx = x - other.posX;
      let dy = y - other.posY;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < radius + other.radius) {
        overlapping = true;
        break;
      }
    }
  } while (overlapping);
  
  let speed = (Math.random() * 3 + 1) * speedFactor;
  let color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  let text = (i + 1).toString();
  circles.push(new Circle(x, y, radius, color, text, speed));
}

let updateCircles = function () {
  requestAnimationFrame(updateCircles);
  ctx.clearRect(0, 0, window_width, window_height);
  circles.forEach((circle, index) => {
    circle.update(ctx);
    for (let j = index + 1; j < circles.length; j++) {
      if (detectCollision(circle, circles[j])) {
        resolveCollision(circle, circles[j]);
      }
    }
  });
};

// Asegurar que el usuario interactúe antes de reproducir sonidos
window.addEventListener("click", () => {
    let sound = collisionSound.cloneNode();
    sound.play().catch(err => console.log("Error al iniciar sonido: ", err));
}, { once: true });

updateCircles();
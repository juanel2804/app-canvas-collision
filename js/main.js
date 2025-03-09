document.getElementById("startButton").addEventListener("click", () => {
  let numCircles = parseInt(document.getElementById("numCircles").value);
  let speedFactor = parseFloat(document.getElementById("speedFactor").value);

  if (isNaN(numCircles) || numCircles < 1 || numCircles > 50) {
      alert("Por favor, ingresa un número de círculos entre 1 y 50.");
      return;
  }
  if (isNaN(speedFactor) || speedFactor < 0.1 || speedFactor > 5) {
      alert("Por favor, ingresa una velocidad entre 0.1 y 5.");
      return;
  }

  document.querySelector(".container").style.display = "none";
  document.getElementById("canvas-container").style.display = "flex";
  iniciarAnimacion();
});

document.getElementById("stopButton").addEventListener("click", () => {
  cancelAnimationFrame(animationFrame);
});

document.getElementById("restartButton").addEventListener("click", () => {
  location.reload();
});

let animationFrame;

function iniciarAnimacion() {
  const canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = 700;
  canvas.height = 500;
  canvas.style.border = "8px solid #1e3a8a";
  canvas.style.borderRadius = "25px";
  canvas.style.boxShadow = "0px 0px 20px rgba(30, 58, 138, 0.7)";
  canvas.style.background = "radial-gradient(circle, #ffffcc, #ffcc00)";
  
  document.getElementById("canvas-container").style.flexDirection = "column";
  document.getElementById("canvas-container").style.alignItems = "center";

  let numCircles = parseInt(document.getElementById("numCircles").value);
  let speedFactor = parseFloat(document.getElementById("speedFactor").value);

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
          context.fillStyle = this.color;
          context.strokeStyle = "#000";
          context.lineWidth = 3;
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.font = "bold 20px Arial";
          context.fillText(this.text, this.posX, this.posY);
          context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
          context.fill();
          context.stroke();
          context.closePath();
      }

      update(context) {
          this.posX += this.dx;
          this.posY += this.dy;

          if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) {
              this.dx = -this.dx;
          }
          if (this.posY + this.radius > canvas.height || this.posY - this.radius < 0) {
              this.dy = -this.dy;
          }
          this.draw(context);
      }
  }

  function detectCollision(circle1, circle2) {
      let dx = circle2.posX - circle1.posX;
      let dy = circle2.posY - circle1.posY;
      let distance = Math.sqrt(dx * dx + dy * dy);
      return distance < circle1.radius + circle2.radius;
  }

  function resolveCollision(circle1, circle2) {
      let dx = circle2.posX - circle1.posX;
      let dy = circle2.posY - circle1.posY;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) return;

      let angle = Math.atan2(dy, dx);
      let speed1 = Math.sqrt(circle1.dx * circle1.dx + circle1.dy * circle1.dy);
      let speed2 = Math.sqrt(circle2.dx * circle2.dx + circle2.dy * circle2.dy);
      let direction1 = Math.atan2(circle1.dy, circle1.dx);
      let direction2 = Math.atan2(circle2.dy, circle2.dx);

      circle1.dx = speed2 * Math.cos(direction2);
      circle1.dy = speed2 * Math.sin(direction2);
      circle2.dx = speed1 * Math.cos(direction1);
      circle2.dy = speed1 * Math.sin(direction1);
  }

  let circles = [];
  for (let i = 0; i < numCircles; i++) {
      let radius = Math.floor(Math.random() * 30) + 20;
      let x, y, overlapping;
      do {
          overlapping = false;
          x = Math.random() * (canvas.width - radius * 2) + radius;
          y = Math.random() * (canvas.height - radius * 2) + radius;
          for (let j = 0; j < circles.length; j++) {
              let other = circles[j];
              if (detectCollision({ posX: x, posY: y, radius }, other)) {
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

  function updateCircles() {
      animationFrame = requestAnimationFrame(updateCircles);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles.forEach((circle, index) => {
          circle.update(ctx);
          for (let j = index + 1; j < circles.length; j++) {
              if (detectCollision(circle, circles[j])) {
                  resolveCollision(circle, circles[j]);
              }
          }
      });
  }

  updateCircles();
}
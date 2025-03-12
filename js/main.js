document.getElementById("startButton").addEventListener("click", () => {
    let numCircles = parseInt(document.getElementById("numCircles").value);
    let speedFactor = parseFloat(document.getElementById("speedFactor").value);
    let level = 1;

    if (isNaN(numCircles) || numCircles < 1 || numCircles > 50) {
        alert("Por favor, ingresa un número de globos entre 1 y 50.");
        return;
    }
    if (isNaN(speedFactor) || speedFactor < 0.1 || speedFactor > 5) {
        alert("Por favor, ingresa una velocidad entre 0.1 y 5.");
        return;
    }

    document.querySelector(".container").style.display = "none";

    const statsContainer = document.createElement("div");
    statsContainer.style.display = "flex";
    statsContainer.style.justifyContent = "center";
    statsContainer.style.gap = "20px";
    document.body.appendChild(statsContainer);

    const scoreContainer = document.createElement("div");
    scoreContainer.id = "score";
    scoreContainer.textContent = "Score: 0";
    statsContainer.appendChild(scoreContainer);
    
    const poppedContainer = document.createElement("div");
    poppedContainer.id = "popped";
    poppedContainer.textContent = "Globos explotados: 0";
    statsContainer.appendChild(poppedContainer);

    const levelContainer = document.createElement("div");
    levelContainer.id = "level";
    levelContainer.textContent = "Nivel: 1";
    statsContainer.appendChild(levelContainer);

    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = 700;
    canvas.height = 500;
    canvas.style.background = "#FDE68A";
    document.body.appendChild(canvas);

    let ctx = canvas.getContext("2d");
    let balloons = [];
    let score = 0;
    let balloonsPopped = 0;
    let gamePaused = false;
    let totalBalloonsSpawned = 0;
    let animationFrame;

    const balloonColors = ["red", "blue", "green"];
    const balloonScores = { "red": 10, "blue": 20, "green": 30 };

    function checkGameStatus() {
        if (balloons.length === 0 && totalBalloonsSpawned >= numCircles) {
            if (balloonsPopped >= numCircles / 2 && numCircles > 0) {
                level++;
                alert(`¡Subiste de nivel! Ahora estás en el nivel ${level}`);
                speedFactor += 0.5;
                numCircles -= 1;
                balloonsPopped = 0;
                totalBalloonsSpawned = 0;
                spawnBalloon();
                levelContainer.textContent = `Nivel: ${level}`;
            } else {
                alert("Game Over");
                cancelAnimationFrame(animationFrame);
                document.body.innerHTML = ''; 
                document.querySelector(".container").style.display = "block";
            }
        }
    }

    function spawnBalloon() {
        if (totalBalloonsSpawned >= numCircles) return;
        let radius = Math.max(Math.floor(Math.random() * 30) + 20 - (speedFactor * 2), 10);
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = canvas.height + radius;
        let speed = speedFactor;
        let color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        balloons.push({ x, y, radius, color, speed, fading: false, opacity: 1 });
        totalBalloonsSpawned++;
        if (totalBalloonsSpawned < numCircles) {
            setTimeout(spawnBalloon, Math.random() * 2000 + 500);
        }
    }

    function updateBalloons() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        balloons.forEach(balloon => {
            if (!gamePaused) {
                if (balloon.fading) {
                    balloon.opacity -= 0.05;
                } else {
                    balloon.y -= balloon.speed;
                }
            }
            if (balloon.opacity > 0) {
                ctx.globalAlpha = balloon.opacity;
                ctx.beginPath();
                ctx.arc(balloon.x, balloon.y, balloon.radius, 0, Math.PI * 2);
                ctx.fillStyle = balloon.color;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        });
        balloons = balloons.filter(balloon => balloon.opacity > 0);
        animationFrame = requestAnimationFrame(updateBalloons);
        checkGameStatus();
    }

    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        balloons.forEach(balloon => {
            if (Math.hypot(mouseX - balloon.x, mouseY - balloon.y) < balloon.radius) {
                balloon.fading = true;
                balloonsPopped++;
                score += 10;
                scoreContainer.textContent = `Score: ${score}`;
                poppedContainer.textContent = `Globos explotados: ${balloonsPopped}`;
            }
        });
    });

    spawnBalloon();
    updateBalloons();
});


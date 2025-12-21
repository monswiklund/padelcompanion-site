// Simple Confetti Engine
// Export global function to start/stop confetti

(function () {
  let canvas;
  let ctx;
  let w;
  let h;
  let particles = [];
  let animationId;
  let isActive = false;

  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
  ];

  function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  function ConfettiParticle() {
    this.x = Math.random() * w; // x-coordinate
    this.y = Math.random() * h - h; // y-coordinate
    this.r = randomFromTo(10, 30); // radius
    this.d = Math.random() * 150 + 10; // density
    this.color = colors[randomFromTo(0, colors.length - 1)];
    this.tilt = Math.floor(Math.random() * 10) - 10;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function () {
      ctx.beginPath();
      ctx.lineWidth = this.r / 2;
      ctx.strokeStyle = this.color;
      ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
      ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
      return ctx.stroke();
    };
  }

  function renderConfetti() {
    if (!isActive) return;

    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.draw();
    }

    updateConfetti();
    animationId = requestAnimationFrame(renderConfetti);
  }

  function updateConfetti() {
    var particle;
    var remainingFlakes = 0;
    for (var i = 0; i < particles.length; i++) {
      particle = particles[i];
      particle.tiltAngle += particle.tiltAngleIncremental;
      particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
      particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

      if (particle.y <= h) remainingFlakes++;

      // If it goes off screen, reset relative to top
      if (particle.x > w + 20 || particle.x < -20 || particle.y > h) {
        if (isActive && particles.length <= 150) {
          // Recycle
          particle.x = Math.random() * w;
          particle.y = -10;
          particle.tilt = Math.floor(Math.random() * 10) - 10;
        } else {
          // Remove if we are stopping or have too many
          // actually for simplicity just recycle unless stopped
          if (isActive) {
            particle.x = Math.random() * w;
            particle.y = -10;
          }
        }
      }
    }
  }

  window.startConfetti = function () {
    if (isActive) return;

    // Create/Resize canvas
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "confetti-canvas";
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none"; // Click through
      canvas.style.zIndex = "9999";
      document.body.appendChild(canvas);
      ctx = canvas.getContext("2d");
    }

    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // Window resize handler
    window.addEventListener("resize", function () {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    });

    isActive = true;
    particles = [];
    for (var i = 0; i < 150; i++) {
      particles.push(new ConfettiParticle());
    }
    renderConfetti();
  };

  window.stopConfetti = function () {
    isActive = false;
    if (ctx) ctx.clearRect(0, 0, w, h);
    if (animationId) cancelAnimationFrame(animationId);
    if (canvas) canvas.remove();
    canvas = null;
  };
})();

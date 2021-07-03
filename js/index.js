window.addEventListener("load", function () {
    const DotsHandler = (function () {
        const canvas = document.getElementById("canvas"),
              ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.display = "block";

        const Dots = {
            count: 100,
            colors: ["#fff", "#8a8aff", "#2fced5"],
            dots: [],
            render: function() {
                requestAnimationFrame(Dots.render);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < Dots.count; i++) {
                    Dots.dots[i].render();
                }
            },
            init: function() {
                for (let i = 0; i < Dots.count; i++) {
                    Dots.dots[i] = new Dot();
                }
                Dots.render();
            }
        };

        class Dot {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = -0.5 + Math.random();
                this.vy = -0.5 + Math.random();
                this.radius = Math.random() * 0.9 + 0.1;
                this.color = Dots.colors[Math.floor(Math.random() * Dots.colors.length)];
            }
            render() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
                if (this.y <= 0 || this.y >= canvas.height) {
                    this.vx = this.vx;
                    this.vy = -this.vy;
                } else if (this.x <= 0 || this.x >= canvas.width) {
                    this.vx = -this.vx;
                    this.vy = this.vy;
                }
                this.x += this.vx;
                this.y += this.vy;
            }
        }

        window.addEventListener("resize", function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        return {
            init: Dots.init,
        };
    })();

    DotsHandler.init();
});

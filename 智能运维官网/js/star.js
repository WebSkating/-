// 星星效果
(function() {

    if (!window.addEventListener) return;

    var canvas = document.querySelector("#starCanvas");
    var context = canvas.getContext("2d");
    var stars = {},
        particleIndex = 0,
        settings = {
            r: 1400, // 根据是设计稿确定的轨迹半径
            height: 260, // 露出的圆弧的高度
            density: 300,
            maxLife: 100,
            groundLevel: canvas.height,
            leftWall: 0,
            rightWall: canvas.width,
            alpha: 0.0,
            maxAlpha: 0.1,
            maxX: 20,//最大偏移量
            maxY:20,
            particleSize:16
        };

    function resizeCanvas() {
        canvas.width = 1000;
        canvas.height = 559;
        // settings.rightWall = canvas.width;
        // settings.groundLevel = canvas.height;
        // settings.height = 260 + (canvas.height - 800) / 2;
        redraw();
    }

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    function redraw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgba(0,0,0,0)";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function Star() {
        // 横坐标随机
        this.x = Math.floor(Math.random() * canvas.width);
        this.y = Math.floor(Math.random() * canvas.height);

        this.vx = Math.random() * 0.05 + 0.025; // 水平偏移，也是移动速度

        // 星星的尺寸
        this.particleSize = settings.particleSize;
        particleIndex++;
        stars[particleIndex] = this;
        this.alpha = 0.0;
        this.maxAlpha = settings.maxAlpha;
        // this.maxAlpha = 0.2 + (this.y / canvas.height) * Math.random() * 0.8;
        this.alphaAction = 1;
        this.tx = 0.0;
        this.ty = 0.0;
        this.maxY = settings.maxY;
        this.maxX = settings.maxX;
        this.xAction = 1;
    }
    Star.prototype.draw = function() {
        // 横坐标移动
        // this.x += this.vx;
        //控制坐标回到原来位置
        if (this.xAction == 1) {
            if (this.tx < this.maxX) {
                this.tx += this.vx;
                this.x += this.vx;
                this.y+=this.vx;
            } else {
                this.xAction = -1;
            }
        } else {
            if (this.tx > 0.1) {
                this.tx -= this.vx;
                this.x -= this.vx;
                this.y -= this.vx;
            } else {
                this.xAction = 1;
            }
        }
        // 透明度慢慢起来
        if (this.alphaAction == 1) {
            if (this.alpha < this.maxAlpha) {
                this.alpha += 0.0002;
            } else {
                this.alphaAction = -1;
            }
        } else {
            if (this.alpha > 0.05) {
                this.alpha -= 0.0002;
            } else {
                this.alphaAction = 1;
            }
        }
        //溢出控制
        if (this.x + (this.particleSize * 2) >= settings.rightWall) {
            // x到左侧
            this.x = this.x - settings.rightWall;
        }

        // 绘制星星
        context.beginPath();
        context.fillStyle = "rgba(255,255,255," + this.alpha.toString() + ")";
        context.arc(this.x, this.y, this.particleSize, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
    };

    function render() {

        redraw();

        // 星星的数目
        // IE下CUP性能有限，数目小
        var length = 10;
        if (!history.pushState) {
            // IE9
            length = 5;
        } else if (document.msHidden != undefined) {
            // IE10+
            length = 7;
        }

        if (Object.keys(stars).length > length) {
            settings.density = 0;
        }

        for (var i = 0; i < settings.density; i++) {
            if (Math.random() > 0.97) {
                new Star();
            }
        }

        // 星星实时移动
        for (var i in stars) {
            stars[i].draw();
        }

        requestAnimationFrame(render);
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(fn) {
            setTimeout(fn, 17);
        };
    }

    render();

})();

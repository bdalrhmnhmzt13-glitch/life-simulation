// محاكاة الحياة - HAMZA
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

let humans = [];
let houses = [];
let trees = [];
let currentGender = 'male';

class Human {
    constructor(x, y, gender) {
        this.x = x;
        this.y = y;
        this.gender = gender;
        this.size = 25;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.walkTimer = 0;
        this.color = gender === 'male' ? {r:59,g:130,b:246} : {r:236,g:72,b:153};
    }
    update() {
        this.vy += 0.5;
        this.x += this.vx;
        this.y += this.vy;
        if (this.y > canvas.height - this.size - 20) {
            this.y = canvas.height - this.size - 20;
            this.vy = 0;
            this.onGround = true;
        }
        if (this.onGround) {
            this.walkTimer++;
            if (this.walkTimer > 60) {
                this.direction = Math.random() > 0.5 ? 1 : -1;
                this.walkTimer = 0;
            }
            this.vx = this.direction * 0.8;
        }
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width - this.size) this.x = canvas.width - this.size;
    }
    draw() {
        ctx.fillStyle = `rgb(${this.color.r},${this.color.g},${this.color.b})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = '#ffdbac';
        ctx.fillRect(this.x+5, this.y-8, this.size-10, 8);
    }
}

class House {
    constructor(x,y) { this.x=x-30; this.y=y-40; }
    draw() {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(this.x, this.y, 60, 50);
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.moveTo(this.x-10, this.y);
        ctx.lineTo(this.x+30, this.y-30);
        ctx.lineTo(this.x+70, this.y);
        ctx.fill();
    }
}

class Tree {
    constructor(x,y) { this.x=x-20; this.y=y-30; }
    draw() {
        ctx.fillStyle = '#92400e';
        ctx.fillRect(this.x+15, this.y, 10, 40);
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(this.x+20, this.y-10, 20, 0, Math.PI*2);
        ctx.fill();
    }
}

function drawBackground() {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#475569';
    ctx.fillRect(0,canvas.height-20,canvas.width,20);
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width/rect.width;
    const scaleY = canvas.height/rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {x: (clientX-rect.left)*scaleX, y: (clientY-rect.top)*scaleY};
}

canvas.addEventListener('mousedown', (e) => {
    const pos = getMousePos(e);
    if (e.shiftKey) houses.push(new House(pos.x, pos.y));
    else if (e.ctrlKey) trees.push(new Tree(pos.x, pos.y));
    else humans.push(new Human(pos.x, pos.y, currentGender));
});

document.getElementById('btn-male').addEventListener('click', () => currentGender = 'male');
document.getElementById('btn-female').addEventListener('click', () => currentGender = 'female');
document.getElementById('btn-clear').addEventListener('click', () => humans = []);
document.getElementById('btn-reset').addEventListener('click', () => {
    humans = []; houses = []; trees = [];
    houses.push(new House(100,300), new House(400,300));
    trees.push(new Tree(200,300), new Tree(500,300));
    for(let i=0;i<3;i++) humans.push(new Human(250+i*50,300, i%2?'male':'female'));
});

function animate() {
    humans.forEach(h => h.update());
    drawBackground();
    houses.forEach(h => h.draw());
    trees.forEach(t => t.draw());
    humans.forEach(h => h.draw());
    document.getElementById('stats-humans').textContent = humans.length;
    document.getElementById('stats-houses').textContent = houses.length;
    document.getElementById('stats-trees').textContent = trees.length;
    requestAnimationFrame(animate);
}

window.onload = () => {
    houses.push(new House(100,300), new House(400,300));
    trees.push(new Tree(200,300), new Tree(500,300));
    for(let i=0;i<3;i++) humans.push(new Human(250+i*50,300, i%2?'male':'female'));
    animate();
};

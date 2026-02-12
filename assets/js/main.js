// محاكاة الحياة - HAMZA (The Coder)
// النسخة المحسنة - بدون تعليق 🚀

const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// ضبط حجم الكانفس بشكل صحيح
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// المتغيرات
let humans = [];
let houses = [];
let trees = [];
let currentGender = 'male';
let dayCounter = 1;
let lastTime = 0;

// إعدادات المحاكاة
const SETTINGS = {
    GRAVITY: 0.3,
    SPEED: 1.2,
    HUMAN_SIZE: 20
};

// ================ الكلاسات ================
class Human {
    constructor(x, y, gender) {
        this.x = x;
        this.y = y;
        this.gender = gender;
        this.size = SETTINGS.HUMAN_SIZE;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.walkTimer = Math.floor(Math.random() * 60);
    }

    update() {
        // الفيزياء
        this.vy += SETTINGS.GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        // الأرض
        if (this.y > canvas.height - this.size - 20) {
            this.y = canvas.height - this.size - 20;
            this.vy = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }

        // المشي
        if (this.onGround) {
            this.walkTimer++;
            if (this.walkTimer > 60) {
                this.direction = Math.random() > 0.5 ? 1 : -1;
                this.walkTimer = 0;
            }
            this.vx = this.direction * SETTINGS.SPEED * 0.5;
        }

        // الحدود
        if (this.x < 0) {
            this.x = 0;
            this.direction = 1;
        }
        if (this.x > canvas.width - this.size) {
            this.x = canvas.width - this.size;
            this.direction = -1;
        }
    }

    draw() {
        // الظل
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.size/2, this.y + this.size - 2, this.size/2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // الجسم
        ctx.fillStyle = this.gender === 'male' ? '#3b82f6' : '#ec4899';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        
        // الرأس
        ctx.fillStyle = '#ffdbac';
        ctx.fillRect(this.x + 4, this.y - 6, this.size - 8, 6);
        
        // العيون
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 6, this.y - 4, 2, 2);
        ctx.fillRect(this.x + this.size - 8, this.y - 4, 2, 2);
    }
}

class House {
    constructor(x, y) {
        this.x = x - 30;
        this.y = y - 40;
        this.width = 60;
        this.height = 50;
    }

    draw() {
        // جسم المنزل
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // السقف
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.moveTo(this.x - 10, this.y);
        ctx.lineTo(this.x + this.width/2, this.y - 30);
        ctx.lineTo(this.x + this.width + 10, this.y);
        ctx.fill();
        
        // الباب
        ctx.fillStyle = '#451a03';
        ctx.fillRect(this.x + 22, this.y + 25, 16, 25);
        
        // النوافذ
        ctx.fillStyle = '#bfdbfe';
        ctx.fillRect(this.x + 8, this.y + 10, 12, 12);
        ctx.fillRect(this.x + 40, this.y + 10, 12, 12);
    }
}

class Tree {
    constructor(x, y) {
        this.x = x - 20;
        this.y = y - 30;
    }

    draw() {
        // الجذع
        ctx.fillStyle = '#92400e';
        ctx.fillRect(this.x + 15, this.y, 10, 40);
        
        // الأوراق
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y - 10, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y - 20, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 40, this.y - 20, 15, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ================ وظائف الرسم ================
function drawBackground() {
    // السماء
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // الأرض
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    // العشب
    ctx.fillStyle = '#10b981';
    for (let i = 0; i < canvas.width; i += 15) {
        ctx.fillRect(i, canvas.height - 25, 2, 8);
    }
    
    // الشمس
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(50, 50, 25, 0, Math.PI * 2);
    ctx.fill();
}

function updateStats() {
    const statsHumans = document.getElementById('stats-humans');
    const statsHouses = document.getElementById('stats-houses');
    const statsTrees = document.getElementById('stats-trees');
    const statsDay = document.getElementById('stats-day');
    
    if (statsHumans) statsHumans.textContent = humans.length;
    if (statsHouses) statsHouses.textContent = houses.length;
    if (statsTrees) statsTrees.textContent = trees.length;
    if (statsDay) statsDay.textContent = Math.floor(dayCounter);
}

// ================ التحكم ================
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        e.preventDefault();
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const pos = getMousePos(e);
    
    if (e.shiftKey) {
        houses.push(new House(pos.x, pos.y));
    } else if (e.ctrlKey) {
        trees.push(new Tree(pos.x, pos.y));
    } else {
        humans.push(new Human(pos.x, pos.y, currentGender));
    }
});

// اللمس للأندرويد
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const pos = getMousePos(e);
    humans.push(new Human(pos.x, pos.y, currentGender));
});

// ================ الأزرار ================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-male')?.addEventListener('click', () => currentGender = 'male');
    document.getElementById('btn-female')?.addEventListener('click', () => currentGender = 'female');
    document.getElementById('btn-house')?.addEventListener('click', () => {
        houses.push(new House(canvas.width/2, canvas.height/2));
    });
    document.getElementById('btn-tree')?.addEventListener('click', () => {
        trees.push(new Tree(canvas.width/2, canvas.height/2));
    });
    document.getElementById('btn-clear')?.addEventListener('click', () => humans = []);
    document.getElementById('btn-reset')?.addEventListener('click', resetSimulation);
});

function resetSimulation() {
    humans = [];
    houses = [];
    trees = [];
    
    // إضافة كائنات أولية
    houses.push(new House(100, canvas.height - 100));
    houses.push(new House(400, canvas.height - 100));
    trees.push(new Tree(200, canvas.height - 100));
    trees.push(new Tree(500, canvas.height - 100));
    trees.push(new Tree(600, canvas.height - 100));
    
    for (let i = 0; i < 3; i++) {
        humans.push(new Human(250 + i * 50, canvas.height - 100, i % 2 === 0 ? 'male' : 'female'));
    }
}

// ================ حلقة المحاكاة ================
function animate() {
    try {
        // تحديث البشر
        for (let human of humans) {
            human.update();
        }
        
        // الرسم
        drawBackground();
        
        for (let house of houses) {
            house.draw();
        }
        
        for (let tree of trees) {
            tree.draw();
        }
        
        for (let human of humans) {
            human.draw();
        }
        
        // تحديث الإحصائيات
        dayCounter += 0.001;
        updateStats();
        
    } catch (e) {
        console.error('خطأ:', e);
    }
    
    requestAnimationFrame(animate);
}

// ================ بدء المحاكاة ================
window.onload = function() {
    console.log('🚀 محاكاة الحياة - HAMZA (The Coder)');
    resetSimulation();
    animate();
};

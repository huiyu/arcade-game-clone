// 这是我们的玩家要躲避的敌人
var Enemy = function() {

    // 初始化对象
    this.init();

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

// 初始化坐标和移动速度
Enemy.prototype.init = function() {
    // 基础速度加上浮动速度
    this.speed = settings.baseSpeed + Math.random() * settings.floatingSpeed;
    // 横坐标
    this.x = -100;
    // 随机选择纵坐标位置
    this.y = [60, 145, 230][Math.floor(Math.random() * 3)];
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {

    // 跑出屏幕范围之外就重置该对象
    if (this.x > 510) {
        this.init();
    }

    // 如果碰撞则初始化玩家
    if (this.isCollide(player)) {
        player.init();
        // 玩家丧失一条命
        player.lives--;
    }

    // 给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上都是以同样的速度运行的
    this.x += this.speed * dt;
};

// 碰撞检测
Enemy.prototype.isCollide = function(player) {
    var threshold = 50;
    return Math.abs(player.x - this.x) < threshold
        && Math.abs(player.y - this.y) < threshold;
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 玩家类
var Player = function() {

    // 初始化玩家位置
    this.init();

    // 玩家生命
    this.lives = settings.maxLives;

    // 级别
    this.level = 1;

    // 玩家的图片
    this.sprite = 'images/char-boy.png';
};

// 初始化玩家位置
Player.prototype.init = function() {
    // 随机选择玩家坐标
    this.x = Math.floor(Math.random() * 5) * 101;
    this.y = 380;
};

// 更新玩家的位置
Player.prototype.update = function() {
    // 如果成功通过，则重置玩家
    if (this.isSuccess()) {
        this.levelUp();
        this.init();
    }
};

// 成功通过
Player.prototype.isSuccess = function() {
    return this.y < 0;
};

// 难度提升
Player.prototype.levelUp = function() {
    this.level++;
    settings.floatingSpeed += 100;

    // 添加新敌人
    allEnemies.push(new Enemy());
    // 添加石头
    allRocks.push(new Rock());
};

// 判断是否游戏结束
Player.prototype.gameOver = function() {
    return this.lives === 0 || this.level === settings.maxLevel;
};

// 渲染玩家
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // 显示生命数
    ctx.drawImage(Resources.get('images/Heart.png'), 5, 538, 30, 51);
    ctx.font = '20pt Impact';
    ctx.lineWidth = 6;
    ctx.fillStyle = 'black';
    ctx.fillText(' ' + player.lives, 40, 576);
    // 显示游戏难度
    ctx.fillStyle = 'yellow';
    ctx.fillText('Level ' + player.level, 420, 576);
};

Player.prototype.handleInput = function(keyCode) {
    if (keyCode === 'left') {
        this.moveLeft()
    } else if (keyCode === 'right') {
        this.moveRight();
    } else if (keyCode === 'up') {
        this.moveUp();
    } else if (keyCode === 'down') {
        this.moveDown();
    } else if (keyCode === 'enter' && player.gameOver()) {
        // 重启游戏
        start();
    }
    // 忽略其他键盘点击事件
};

// 玩家左移
Player.prototype.moveLeft = function() {
    var x = this.x - 101;
    if (this.x > 0 && !this.hasRock(x, this.y)) {
        this.x = x;
    }
};

// 玩家右移
Player.prototype.moveRight = function() {
    var x = this.x + 101;
    if (this.x < 404 && !this.hasRock(x, this.y)) {
        this.x = x;
    }
};

// 玩家上移
Player.prototype.moveUp = function() {
    var y = this.y - 82;
    if (this.y > 0 && !this.hasRock(this.x, y)) {
        this.y = y;
    }
};

// 玩家下移
Player.prototype.moveDown = function() {
    var y = this.y + 82;
    if (y < 460 && !this.hasRock(this.x, y)) {
        this.y = y;
    }
};

// 位置上是否有石头
Player.prototype.hasRock = function(x, y) {
    return allRocks.some(function(rock) {
        return Math.abs(rock.x - x) < 50 && Math.abs(rock.y - y) < 50;
    });
};

// 石头
var Rock = function() {

    // 初始化位置
    this.init();

    this.sprite = 'images/Rock.png';
};

Rock.prototype.init = function() {
    // 随机选择横坐标位置
    this.x = Math.floor(Math.random() * 5) * 101;
    // 随机选择纵坐标位置
    this.y = [60, 145, 230][Math.floor(Math.random() * 3)];
};

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 游戏设置
var settings;
// 玩家
var player;
// 敌人
var allEnemies;
// 石头
var allRocks;

// 启动游戏
var start = function() {
    // 设置
    settings = {
        // 敌人的初始基础速度
        baseSpeed: 200,
        // 敌人初始浮动速度
        floatingSpeed: 200,
        // 敌人初始数量
        enemyNumber: 2,
        // 玩家初始生命
        maxLives: 3,
        // 最高级别
        maxLevel: 5
    };

    player = new Player();
    allEnemies = [];
    for (var i = 0; i < settings.enemyNumber; i++) {
        var enemy = new Enemy();
        allEnemies.push(enemy);
    }
    allRocks = [];


};

start();

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

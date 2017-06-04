// 设置
var settings = {
    // 敌人的基础速度
    baseSpeed: 200,
    // 敌人浮动速度
    floatingSpeed: 200,
    // 敌人数量
    enemyNumber: 5
};

// 这是我们的玩家要躲避的敌人
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

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
    var ranIdx = Math.floor(Math.random() * 3);
    this.y = [60, 145, 230][ranIdx];
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的

    // 超出屏幕范围之外就重置该对象
    if (this.x > 510) {
        this.init();
    }

    // 如果碰撞则初始化玩家
    if (this.isCollide(player)) {
        player.init();
    }

    // 更新位置
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

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function() {

    // 初始化玩家位置
    this.init();

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
        this.init();
    }
};

// 成功通过
Player.prototype.isSuccess = function() {
    return this.y < 0;
};

// 渲染玩家
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
    }
    // 忽略其他键盘点击事件
};

// 玩家左移
Player.prototype.moveLeft = function() {
    if (this.x > 0) {
        this.x -= 101;
    }
};

// 玩家右移
Player.prototype.moveRight = function() {
    if (this.x < 404) {
        this.x += 101;
    }
};

// 玩家上移
Player.prototype.moveUp = function() {
    if (this.y > 0) {
        this.y -= 82;
    }
};

// 玩家下移
Player.prototype.moveDown = function() {
    if (this.y < 380) {
        this.y += 82;
    }
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面

var player = new Player();

var allEnemies = [];
for (var i = 0; i < settings.enemyNumber; i++) {
    var enemy = new Enemy();
    allEnemies.push(enemy);
}

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

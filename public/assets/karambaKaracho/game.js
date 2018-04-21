var game = new Phaser.Game(1200, 800, Phaser.CANVAS, '', {
  preload: preload,
  create: create,
  render: render
});

function preload() {
  game.load.image('whiskey', './whiskey.png');
  game.load.image('gin', './gin.png');
  game.load.image('platform', './platform.png');
  game.load.image('moving_platform', './moving_platform.png');
  game.load.image('heino', './heino.png');
  game.load.image('spiral', './spiral.png');
  game.load.physics('physicsData', './sprite_physics.json');
  game.load.audio('clink', './bottle.wav');
  game.load.audio('whiskeyOgg', './whiskey.ogg');
  game.load.audio('ginOgg', './gin.ogg');

}

var bottleCollisionGroup;
var platforms = [];
var clink;
var userPlatform;
var whiskey;
var gin;
var spiral;

function create() {

  game.stage.backgroundColor = '#124184';
  game.stage.disableVisibilityChange = true;

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.gravity.y = 1000;

  spiral = game.add.sprite(600, 400, 'spiral');
  spiral.anchor.setTo(0.5, 0.5);
  spiral.scale.setTo(0.7, 0.7);


  //  Create collision group for the blocks
  bottleCollisionGroup = game.physics.p2.createCollisionGroup();

  var style = {font: "bold 64px Arial", fill: "#111", boundsAlignH: "center", boundsAlignV: "middle"};

  //  The Text is positioned at 0, 100
  window.countDownText = game.add.text(1030, 600, "60", style);

  //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
  //  (which we do) - what this does is adjust the bounds to use its own collision group.
  game.physics.p2.updateBoundsCollisionGroup();

  spawnPlatform(700, "left");
  spawnPlatform(500, "right");
  spawnPlatform(300, "left");
  spawnPlatform(150, "right", true);
  initHeino();

  clink = game.add.audio('clink');
  whiskey = game.add.audio('whiskeyOgg');
  gin = game.add.audio('ginOgg');
  clink.allowMultiple = true;
}

function render() {
}

function spawnNewBottleOfType(type) {
  let bottle = game.add.sprite(700, 0, type);
  game.physics.p2.enable(bottle);
  bottle.body.clearShapes();
  bottle.body.loadPolygon('physicsData', type);
  bottle.body.setCollisionGroup(bottleCollisionGroup);
  bottle.body.collides([bottleCollisionGroup]);
  bottle.body.rotation = Math.PI / 2;
  bottle.body.onBeginContact.add(bottleHit, this);
}

function initHeino() {
  let heino = game.add.sprite(800, 700, 'heino');
  game.physics.p2.enable(heino);
  heino.body.kinematic = true;
  heino.body.setCollisionGroup(bottleCollisionGroup);
  heino.body.collides([bottleCollisionGroup]);
  heino.body.onBeginContact.add(heinoHit, this);
}

function bottleHit(body, bodyB, shapeA, shapeB, equation) {
  let res = Phaser.Point.distance(
      new Phaser.Point(equation[0].bodyB.velocity[0], equation[0].bodyB.velocity[1]),
      new Phaser.Point(equation[0].bodyA.velocity[0], equation[0].bodyA.velocity[1]));

  clink.volume = (res * 2)/100;
  clink.play();
}

function heinoHit(body, bodyB, shapeA, shapeB, equation) {
  if (body) {
    let points = 0;
    if (body.sprite.key === 'whiskey') {
      points = 3;
      whiskey.play();
    }
    else {
      gin.play();
      points = 10;
    }

    window.scoreCallback(points);

    game.physics.p2.enable(body.sprite);
    body.sprite.kill();
  }
}

function spawnPlatform(y, side, isUserPlatform = false) {
  let x, rotation, platformX;
  if (side === "left") {
    x = 300;
    platformX = 300;
    rotation = 0;
  }
  if (side === "right") {
    x = 900;
    platformX = 1150;
    rotation = Math.PI / 2;
  }

  let platform = game.add.sprite(x, y, 'platform');
  game.physics.p2.enable(platform);
  platform.body.kinematic = true;
  platform.body.setCollisionGroup(bottleCollisionGroup);
  platform.body.collides([bottleCollisionGroup]);
  platform.body.onBeginContact.add(bottleHit, this);

  let moving_platform = game.add.sprite(platformX, y - 60, 'moving_platform');
  game.physics.p2.enable(moving_platform);
  moving_platform.body.clearShapes();
  moving_platform.body.loadPolygon('physicsData', 'moving_platform');
  moving_platform.body.kinematic = true;

  if (!isUserPlatform) {
    moving_platform.body.velocity.x = 100;
  }
  else {
    userPlatform = {
      side,
      moving_platform,
      platform,
    };
  }

  moving_platform.body.rotation = rotation;
  moving_platform.body.setCollisionGroup(bottleCollisionGroup);
  moving_platform.body.collides([bottleCollisionGroup]);

  platforms.push({
    side,
    moving_platform,
    platform,
    isUserPlatform,
  });
}

function update() {
}

function render() {
  spiral.angle -= 0.2;
  platforms.forEach((platform) => {
    if (platform.isUserPlatform) {
      if (platform.moving_platform.body.x <= 550) {
        platform.moving_platform.body.velocity.x *= -1;
      }
      if (platform.moving_platform.body.x >= 1150) {
        platform.moving_platform.body.velocity.x = 0;
      }
    }
    else {
      if (platform.side === "left") {
        if (platform.moving_platform.body.x >= 435 ||
            platform.moving_platform.body.x <= 0) {
          platform.moving_platform.body.velocity.x *= -1;
        }
      }
      if (platform.side === "right") {
        if (platform.moving_platform.body.x <= 760 ||
            platform.moving_platform.body.x >= 1200) {
          platform.moving_platform.body.velocity.x *= -1;
        }
      }
    }
  });
}

// TVPARTY events and data
window.newEvent = (event) => {
  userPlatform.moving_platform.body.velocity.x = -(event.powerLevel*40);
};

window.register = (scoreCallBack) => {
  window.scoreCallback = scoreCallBack;
};

window.setCountDownText = (text) => {
  window.countDownText.text = text;
};

window.spawnNewBottle = () => {
  let n = Math.random() * 100;
  if (n < 10) {
    spawnNewBottleOfType('gin');
  }
  else {
    spawnNewBottleOfType('whiskey');
  }
};


// index.js
const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: true
        }
      },
    scene: {
        preload: preload,
        create: create,
        update: update
    }

    
};
var game = new Phaser.Game(config);
var player;
var star=[];

var scoreText;
var score = 0;


function preload () {
    this.load.image('sky', 'assets/sky.png');
  // el suelo es una imagen de 400x32 px
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 
    'assets/dude.png',
    { frameWidth: 32, frameHeight: 48 }
  );
}
function create () {
    this.add.image(400, 300, 'sky');
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 300, 'ground').setScale(2).refreshBody(); // añadimos la plataforma de más abajo, duplicamos sus dimensiones y actualizamos. Después de redimensionar será una imagen de 800x64px
    // luego añadimos otras plataformas en pantalla
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(400, 220, 'ground');

    // añadimos el sprite
// for(var i=0;i<4;i++){
//     star[i] = this.physics.add.sprite(Math.random(1, 800), Math.random(1, 600), 'star');
//     star[i].setBounce(0.2);
//     star[i].setCollideWorldBounds(true);
//     this.physics.add.collider(star, platforms);
// }
// star = this.physics.add.sprite(Math.floor((Math.random() * (800 - 1 + 1)) + 1), Math.floor((Math.random() * (600 - 1 + 1)) + 1), 'star');
// //fijamos un rebote y limitamos al mundo visible
// star.setBounce(0.2);
// star.setCollideWorldBounds(true);
//fijamos su gravedad

// evitamos que traspase las plataformas
this.physics.add.collider(star, platforms);





stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 50 }
});

stars.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

});
this.physics.add.collider(stars, platforms);


//agregamos el player
player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    player.body.setGravityY(40)

    
this.physics.add.collider(player, platforms);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
      });
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });

      //recoge estrellas, funciona solo agregandolo al final
      this.physics.add.overlap(player, stars, collectStar, null, this);
      scoreText = this.add.text(100, 100, 'Points: 0', { font: '18px Arial', fill: '#000' });

      bombs = this.physics.add.group();

      this.physics.add.collider(bombs, platforms);
      
      this.physics.add.collider(player, bombs, hitBomb, null, this);

    }
function update () {
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        // se fija velocidad de -160 en el eje X
        player.setVelocityX(-160);
        // se ejecuta la animación correspondiente (left)
        player.anims.play('left', true);
    }
    // animación de moverse a la derecha
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    // animación de estar quieto
    else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    // animación de saltar
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectStar (player, star){
    
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}
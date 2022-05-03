kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
})
scene("menu", () =>{
    function addButton(txt, p, f) {

        const btn = add([
            text(txt),
            pos(p),
            area({ cursor: "pointer", }),
            scale(1),
            origin("center"),
        ])
    
        
        keyPress('space', () => {
            go("game", {
                level: 0,
                score: 0
            })
        })
        
    
    }
    add([text(`The Legend of Dink`, 50), origin('center'), pos(800, 200)])
    add([text(`& Some Odd Swords`, 48), origin('center'), pos(1000, 270)])
    add([text(`(press space to start)`, 32), origin('center'), pos(width()/ 2, height() /2)])
    addButton("", vec2(200, 100), () => "game")
    
   
    
})


let move_speed = 120;
let dinkHealth = 15;
//dink sprites
loadSprite('link-going-left', 'dink_left_2.png')
loadSprite('link-going-left2', 'dink_left_3.png')
loadSprite('link-going-right', 'dink_right_2.png')
loadSprite('link-going-right2', 'dink_right_3.png')
loadSprite('link-going-down', 'dink_front_2.png')
loadSprite('link-going-down2', 'dink_front_3.png')
loadSprite('link-going-up', 'dink_back_2.png')
loadSprite('link-going-up2', 'dink_back_3.png')

//game sprites
loadSprite('left-wall', 'left_wall.png')
loadSprite('top-wall', 'top_wall.png')
loadSprite('bottom-wall', 'bottom_wall.png')
loadSprite('right-wall', 'right_wall.png')
loadSprite('top-door', 'door.png')
loadSprite('fire-pot', 'fire (2).png')
loadSprite('lanterns', 'lantern-removebg-preview.png')
loadSprite('slicer', 'slicer (2).png')
loadSprite('skeletor', 'skeletor (2).png')
loadSprite('kaboom', 'kaboom (2).png')
loadSprite('stairs', 'stairs.png')
loadSprite('dorito', 'dorito1.png')
loadSprite('bg', 'bgbig.png')
loadSprite('chest', 'chest.png')
loadSprite('key', 'key1.png')
loadSprite('odor', 'outsidedoor.png')
loadSprite('tree', 'tree1.png')
loadSprite('grass', 'grass.png')
loadSprite('bgrass', 'badgrass.png')
loadSprite('tinny', 'tinny1.png')
loadSprite('buff', 'buff_dorito (1).png')
loadSprite('udoor', 'unlocked_door.png')
loadSprite('can1', 'monster.png')
loadSprite('glover', 'glover.png')
loadSprite('popeye', 'popeye.png')
loadSprite('oddSword', 'oddSword1.png')
loadSprite('boss', 'boss.png')


scene("game",({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const maps = [[
  
        'aeeeeeeeeeeb',
        'a        ? b',
        'a       z  b',
        'a    f     b',
        'a          b',
        'a      6   b',
        'a   z      b',
        'a          b',
        'arrrrrdrrrrb',
    ],

    [
    'aeeeeeeeedeeb',
    'a   ?b  f f b',
    'a   wb      b',
    'a    b      b',
    'a    w      b',
    'a           b',
    'a           b',
    'a      w    b',
    'aeeseeeeeeeeb',],
    [
        'aeeeeeeeedeeb',
        'a M    f    b',
        'a    f  w   b',
        'a           b',
        'a    w      b',
        'a      eeee b',
        'a      b    b',
        'a      b?   b',
        'aeeseeeeeeeeb',],

     ['aeeeeeeeeeeb',
     'a          b',
     'a          b',
     'a     8    b',
     'a       :  b',
     'a          b',
     'a       k  b',
     'a          b',
     'arrrrrdrrrrb',],

    ['______________',
     '__________-___',
     'b_____________',
     'b_____7_______',
     'd_____ _______',
     'b_____________',
     'b_______-_____',
     '______________',
     '____-_________',
     '____________7_',
     '____________ _',
     '_____-________',
     '____bbpbb_____',],

     ['aeeeeeeeeeeb',
     'a     a  : b',
     'a     a    b',
     'a          b',
     'a   f      b',
     'a          b',
     'aee    z   b',
     'a ? k      b',
     'arrrrrdrrrrb',],

     ['aeeeeeeeeeeb',
     'a     a    b',
     'a     8    b',
     'a          b',
     'a   f      b',
     'a          b',
     'aee    z   b',
     'a ? k      b',
     'arrrrrdrrrrb',],
     [],
     [],
     [],

      {
        width: 48,
        height: 48,
        ' ': () => [
            sprite('grass'),
        ],
    }]
    const levelCfg = {
        width: 48,
        height: 48,
        'a': [sprite('left-wall'), solid(), 'wall', 'wall2'],
        'b': [sprite('right-wall'), solid(), 'wall', 'wall2'],
        'l': [sprite('lanterns'), solid()],
        's': [sprite('stairs'), 'back-level'],
        'f': [sprite('fire-pot'), solid(), 'wall'],
        'z': [sprite('slicer'), 'slicer', {dir: -1}, 'danger'],
        'k': [sprite('skeletor'), 'danger', 'skeletor', { dir: -1, timer: 0 }],
        'd': [sprite('top-door'), 'locked', 'wall', solid()],
        '0': [sprite('odor'), 'difdoor', 'wall', solid()],
        'g': [sprite('glover'), 'danger', 'glover', { dir: -1, timer: 0 }],
        'e': [sprite('top-wall'), solid(), 'wall'],
        'r': [sprite('bottom-wall'), solid(), 'wall'],
        'w': [sprite('dorito'), 'dorito', {dir: -1}, 'danger'],
        '6': [sprite('boss'), 'dorito', {dir: -1}, 'danger'],
        'c': [sprite('chest'), 'wall', solid()],
        '7': [sprite('tree'), 'wall', solid()],
        '?': [sprite('key'), 'key'],
        'o': [sprite('tinny'), 'tinny', {dir: -1}, 'danger'],
        '_': [sprite('grass')],
        '-': [sprite('bgrass'), 'danger'],
        '8': [sprite('buff'), 'dorito2', {dir: -1}, 'danger'],
        'p': [sprite('udoor'), 'door', 'wall', solid()],
        'M': [sprite('can1'), 'monster'],
        ':': [sprite('popeye'), 'spin'],
        '9': [sprite('oddSword'), 'danger'],
    }
    addLevel(maps[level], levelCfg)

    add([sprite('bg'), layer('bg')])
    const scoreLabel = add([
        text('0'),
        pos(400, 450),
        layer('ui'),
        {
          value: score,
        },
        scale(2),
      ])

    add([text('level ' + parseInt(level + 1)), pos(400, 470), scale(2)])


//Player Conrtols


const player = add([
    sprite('link-going-right'),
    pos(75, 190),
    {
        dir: vec2(1,0),
    }
])

player.action(() => {
    player.resolve()
})
player.overlaps('next-level', () => {
    go("game", {
        level: (level + 1) % maps.length,
        score: scoreLabel.value
    })
})
player.overlaps('back-level', () => {
    go("game", {
        level: (level - 1) % maps.length,
        score: scoreLabel.value
    })
})
keyDown('left', () => {
    if (dinkHealth > 15){
        player.changeSprite('link-going-left2')
    } else {
        player.changeSprite('link-going-left')
    }
    player.move(-move_speed, 0)
    player.dir = vec2(-1,0)
    gloveX = -120;
})

keyDown('right', () => {
    if (dinkHealth > 15){
        player.changeSprite('link-going-right2')
    } else {
        player.changeSprite('link-going-right')
    }
    player.move(move_speed, 0)
    player.dir = vec2(1,0)
    gloveX = 120;
})

keyDown('up', () => {
    if (dinkHealth > 15){
        player.changeSprite('link-going-up2')
    } else {
        player.changeSprite('link-going-up')
    }
    player.move(0, -move_speed)
    player.dir = vec2(0, -1)
    gloveY = -120;
})

keyDown('down', () => {
    if (dinkHealth > 15){
        player.changeSprite('link-going-down2')
    } else {
        player.changeSprite('link-going-down')
    }
    player.move(0, move_speed)
    player.dir = vec2(0, 1)
    gloveY = 120;
})



function spawnKaboom(p) {
   const obj = add([sprite('kaboom'), pos(p), 'kaboom'])
   wait(.25, () => {
       destroy(obj)
   })
}
function spawnKey(p) {
    const obj = add([sprite('key'), pos(p), 'key'])
 }



keyPress('space', () => {
    spawnKaboom(player.pos.add(player.dir.scale(48)))
})


player.collides('chest', () => {
    
})


//player controls end
var sHealth = 3;
collides('kaboom', 'skeletor', (k, s) => {
    camShake(4)
    wait(.25, ()=> {
        sHealth = sHealth - 1;
        if(sHealth <= 0){
            destroy(s)
            spawnKey(player.pos.add(player.dir.scale(48)))
        } else {
            skeleSpeed = skeleSpeed * 2;
            console.log(sHealth)
        }
        
    })
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
})

const sliceSpeed = 150
action('slicer', (s) => {
    s.move(s.dir * sliceSpeed, 0)
})

collides('slicer', 'wall', (s) => {
    s.dir = -s.dir
})



var skeleSpeed = 100
action('skeletor', (s) => {
    s.move(0, s.dir * skeleSpeed)
    s.timer -= dt()
    if (s.timer <= 0) {
      s.dir = -s.dir
      s.timer = rand(5)
    }
  })

collides('skeletor', 'wall', (s) => {
    s.dir = -s.dir
})

//glover

let gloveX = 0;
let gloveY = 0;
action('glover', (s) => {
    s.move(gloveX, gloveY)
  })

collides('glover', 'wall', (s) => {
    gloveX = -gloveX
    gloveY = -gloveY
})

//key functions
let hasKey = 0

player.overlaps('key', (key) => {
    destroy(key)
    hasKey = hasKey + 1
    console.log(hasKey)
})

player.collides('locked', () => {
    if(hasKey >= 1){
        go("game", {
            level: (level + 1) % maps.length,
            score: scoreLabel.value
        })
    } else {

        camShake(1)
    }

})
//keyfunctions end

//monster functions
let hasDrink = 0

player.overlaps('monster', (key) => {
    destroy(key)
    hasDrink = hasDrink + 1
    move_speed = move_speed * 2.5
    scoreLabel.value++
    console.log(hasDrink)
})
//monster functions end

//spin functions
let hasSpin = 0

player.overlaps('spin', (key) => {
    destroy(key)
    hasSpin = hasSpin + 1
    dinkHealth = dinkHealth + 20;
    scoreLabel.value++
    console.log(hasSpin)
})
//spin functions end

//outside
player.collides('difdoor', () => {
        go("game", {
            level: 4,
            score: scoreLabel.value
        })

})

player.collides('door', () => {
    go("game", {
        level: (level + 1),
        score: scoreLabel.value
    })

})

//dorito brain
let dHealth = 5;
let dSpeed = 100;

collides('dorito', 'kaboom', (s, k) => {
    camShake(4)
    wait(.25, ()=> {
        dHealth = dHealth - 1;
        if(dHealth <= 0){
            destroy(s)
        } else {
            dSpeed = dSpeed * 2;
            console.log(dHealth)
            spawnTinny(player.pos.add(player.dir.scale(48)))
        }
        
    })
    
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
    console.log(dHealth)
})

action('dorito', (s) => {
    s.move( s.dir * dSpeed, 0)
    s.timer -= dt()
    if (s.timer <= 0) {
      s.dir = -s.dir
      s.timer = rand(5)
    }
  })
  collides('dorito', 'wall2', (s) => {
    s.dir = -s.dir
})

function spawnTinny(p) {
    const obj = add([sprite('tinny'), pos(p), 'tinny'])
 }
//dorito brain end

//buff dorito brain
let dbHealth = 10;
let dbSpeed = 100;

collides('dorito2', 'kaboom', (s, k) => {
    camShake(4)
    wait(.25, ()=> {
        dbHealth = dbHealth - 1;
        if(dbHealth <= 0){
            destroy(s)
        } else {
            dbSpeed = dbSpeed * 2;
            console.log(dbHealth)
            spawnTinny(player.pos.add(player.dir.scale(48)))
        }
        
    })
    
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
    console.log(dbHealth)
})

action('dorito2', (s) => {
    s.move( s.dir * dSpeed, 0)
    s.timer -= dt()
    if (s.timer <= 0) {
      s.dir = -s.dir
      s.timer = rand(5)
    }
  })
  collides('dorito2', 'wall2', (s) => {
    s.dir = -s.dir
})

function spawnTinny(p) {
    const obj = add([sprite('tinny'), pos(p), 'tinny'])
 }
// buff dorito brain end



player.overlaps('danger', () => {
    dinkHealth = dinkHealth - 1;
    if(dinkHealth <= 0) {
        go('lose', {score: scoreLabel.value})
    } else {
        console.log(dinkHealth)
    }
})



console.log(hasKey)
})

scene("lose", ({ score}) => {
    add([text(`Score: ${score}`, 32), origin('center'), pos(width()/ 2, height() /2)])
    keyPress('space', () => {
        go("game", {
            level: 0,
            score: 0
        })
        move_speed = 120;
        dinkHealth = 15;
    })
})

start("menu")
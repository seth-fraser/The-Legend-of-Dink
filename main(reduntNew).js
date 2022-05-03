kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
})


const move_speed = 120;

loadSprite('link-going-left', 'dink_left (2).png')
loadSprite('link-going-right', 'dink_right (2).png')
loadSprite('link-going-down', 'dink_front (2).png')
loadSprite('link-going-up', 'dink_back (2).png')
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


scene("game",({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const maps = [[
  
        'aeeeeeeeeeeb',
        'a          b',
        'a    f  z  b',
        'a          b',
        'a          b',
        'a ?        b',
        'a      z   b',
        'a          b      k',
        'arrrr0drrrrb',
    ],
    [
    'aeeeeeeeedeeb',
    'a      f    b',
    'a    f  w   b',
    'a           b',
    'a    w      b',
    'a    ?      b',
    'a   s       b',
    'a      w    b',
    'aeeeeeeeeeeeb',],
    ['aeeeeeeeeeeb',
     'a  s       b',
     'a  f    k  b',
     'a          b',
     'a    k     b',
     'a          b',
     'a      z   b',
     'a          b',
     'arrrrr0rrrrb',],
    [],
    ['______________',
     '______________',
     '__    _________',
     '______7_______',
     '______ _______',
     '______________',
     '________-_____',
     '______________',
     '______________',
     '______________',
     '______________',
     '______________',
     '______________',], {
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
        'e': [sprite('top-wall'), solid(), 'wall'],
        'r': [sprite('bottom-wall'), solid(), 'wall'],
        'w': [sprite('dorito'), 'dorito', {dir: -1}, 'danger'],
        'c': [sprite('chest'), 'wall', solid()],
        '7': [sprite('tree'), 'wall', solid()],
        '?': [sprite('key'), 'key'],
        '_': [sprite('grass')],
        '-': [sprite('bgrass'), 'danger'],
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
    pos(5, 190),
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
    player.changeSprite('link-going-left')
    player.move(-move_speed, 0)
    player.dir = vec2(-1,0)
})

keyDown('right', () => {
    player.changeSprite('link-going-right')
    player.move(move_speed, 0)
    player.dir = vec2(1,0)
})

keyDown('up', () => {
    player.changeSprite('link-going-up')
    player.move(0, -move_speed)
    player.dir = vec2(0, -1)
})

keyDown('down', () => {
    player.changeSprite('link-going-down')
    player.move(0, move_speed)
    player.dir = vec2(0, 1)
})



function spawnKaboom(p) {
   const obj = add([sprite('kaboom'), pos(p), 'kaboom'])
   wait(.5, () => {
       destroy(obj)
   })
}

keyPress('space', () => {
    spawnKaboom(player.pos.add(player.dir.scale(48)))
})


player.collides('chest', () => {
    
})


//player controls end

collides('kaboom', 'skeletor', (k, s) => {
    camShake(4)
    wait(1, ()=> {
        destroy(k)
    })
    destroy(s)
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



const skeleSpeed = 100
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

//outside
player.collides('difdoor', () => {
        go("game", {
            level: 4,
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

//dorito brain end

player.overlaps('danger', () => {
    go('lose', {score: scoreLabel.value})
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
    })
})

start("game", { level: 0, score: 0})
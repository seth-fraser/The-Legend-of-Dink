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
loadSprite('bg', 'bgbig.png')


scene("game",({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const maps = [[
  
        'aeeeeeeeeeeb',
        'a          b',
        'a       z  b',
        'a          b',
        'a    f     b',
        'a          b',
        'a      z   b',
        'a          b      k',
        'arrrrrdrrrrb',
    ],
    [
    'aeeeeeeeeeedeeeeeeeeeeb',
    'a                f    b',
    'a      k              b',
    'a         f       k   b',
    'a                     b',
    'a            k        b',
    'a   s                 b',
    'a                     b',
    'arrrrrdrrrrrrrrrrrrrrrb',],
    ['aeeeeeeeeeeb',
     'a  s       b',
     'a  f    k  b',
     'a          b',
     'a    k     b',
     'a          b',
     'a      z   b',
     'a          b',
     'arrrrrdrrrrb',]]
    const levelCfg = {
        width: 48,
        height: 48,
        'a': [sprite('left-wall'), solid(), 'wall'],
        'b': [sprite('right-wall'), solid(), 'wall'],
        'l': [sprite('lanterns'), solid()],
        's': [sprite('stairs'), 'back-level'],
        'f': [sprite('fire-pot'), solid(), 'wall'],
        'z': [sprite('slicer'), 'slicer', {dir: -1}, 'danger'],
        'k': [sprite('skeletor'), 'danger', 'skeletor', { dir: -1, timer: 0 }],
        'd': [sprite('top-door'), 'next-level', 'wall'],
        'e': [sprite('top-wall'), solid(), 'wall'],
        'r': [sprite('bottom-wall'), solid(), 'wall'],
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





player.overlaps('danger', () => {
    go('lose', {score: scoreLabel.value})
})
})

scene("lose", ({ score}) => {
    add([text(score, 32), origin('center'), pos(width()/ 2, height() /2)])
})

start("game", { level: 0, score: 0})
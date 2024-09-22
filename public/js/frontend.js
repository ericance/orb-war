const canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");

const socket = io()

const devicePixelRatio = window.devicePixelRatio || 1
const scoreElement = document.querySelector('#scoreElement')

canvas.width = innerWidth
canvas.height = innerHeight

const x = canvas.width / 2
const y = canvas.height / 2

const frontEndPlayers = {}

socket.on('updatePlayers', (backEndPlayers) => {
	for (const id in backEndPlayers) {
		const backEndPlayer = backEndPlayers[id]

		if (!frontEndPlayers[id]) {
			frontEndPlayers[id] = new Player({
				x: backEndPlayer.x,
				y: backEndPlayer.y,
				radius: 10,
				color: backEndPlayer.color
			})
		} else {
			if (id === socket.id) {
				frontEndPlayers[id].x = backEndPlayer.x
				frontEndPlayers[id].y = backEndPlayer.y

				const lastBackendInputIndex = playerInputs.findIndex((input) => {
					return backEndPlayer.sequenceNumber === input.sequenceNumber
				})
				if (lastBackendInputIndex > -1)
					playerInputs.splice(0, lastBackendInputIndex + 1)

				playerInputs.forEach((input) => {
					frontEndPlayers[id].x += input.dx
					frontEndPlayers[id].y += input.dy
				})
			} else {
				gsap.to(frontEndPlayers[id], {
					x: backEndPlayer.x,
					y: backEndPlayer.y,
					duration: 0.015,
					ease: 'linear',
				})
			}
		}
	}

	for (const id in frontEndPlayers) {
		if (!backEndPlayers[id]) {
			delete frontEndPlayers[id]
		}
	}
})

let animationId
function animate() {
	animationId = requestAnimationFrame(animate)
	ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	for (const id in frontEndPlayers) {
		const player = frontEndPlayers[id]
		player.draw()
	}
}

animate()

const keys = {
	w: {
		pressed: false
	},
	a: {
		pressed: false
	},
	s: {
		pressed: false
	},
	d: {
		pressed: false
	}
}

const SPEED = 10
const playerInputs = []
let sequenceNumber = 0
setInterval(() => {
	if (keys.w.pressed) {
		sequenceNumber++
		playerInputs.push({ sequenceNumber, dx: 0, dy: -SPEED })
		frontEndPlayers[socket.id].y -= SPEED
		socket.emit('keydown', { keycode: 'KeyW', sequenceNumber })
	}
	if (keys.a.pressed) {
		sequenceNumber++
		playerInputs.push({ sequenceNumber, dx: -SPEED, dy: 0 })
		frontEndPlayers[socket.id].x -= SPEED
		socket.emit('keydown', { keycode: 'KeyA', sequenceNumber })
	}
	if (keys.s.pressed) {
		sequenceNumber++
		playerInputs.push({ sequenceNumber, dx: 0, dy: SPEED })
		frontEndPlayers[socket.id].y += SPEED
		socket.emit('keydown', { keycode: 'KeyS', sequenceNumber })
	}
	if (keys.d.pressed) {
		sequenceNumber++
		playerInputs.push({ sequenceNumber, dx: SPEED, dy: 0 })
		frontEndPlayers[socket.id].x += SPEED
		socket.emit('keydown', { keycode: 'KeyD', sequenceNumber })
	}
}, 15)

window.addEventListener('keydown', (event) => {
	if (!frontEndPlayers[socket.id]) return

	switch (event.code) {
		case 'KeyW':
			keys.w.pressed = true
			break
		case 'KeyA':
			keys.a.pressed = true
			break
		case 'KeyS':
			keys.s.pressed = true
			break
		case 'KeyD':
			keys.d.pressed = true
			break
	}
})

window.addEventListener('keyup', (event) => {
	if (!frontEndPlayers[socket.id]) return

	switch (event.code) {
		case 'KeyW':
			keys.w.pressed = false
			break
		case 'KeyA':
			keys.a.pressed = false
			break
		case 'KeyS':
			keys.s.pressed = false
			break
		case 'KeyD':
			keys.d.pressed = false
			break
	}
})
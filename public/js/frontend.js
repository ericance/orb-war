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
			frontEndPlayers[id].x = backEndPlayer.x
			frontEndPlayers[id].y = backEndPlayer.y
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

window.addEventListener('keydown', (event) => {
	if (!frontEndPlayers[socket.id]) return
	switch (event.code) {
		case 'KeyW':
			frontEndPlayers[socket.id].y -= 5
			socket.emit('keydown', 'KeyW')
			break
		case 'KeyA':
			frontEndPlayers[socket.id].x -= 5
			socket.emit('keydown', 'KeyA')
			break
		case 'KeyS':
			frontEndPlayers[socket.id].y += 5
			socket.emit('keydown', 'KeyS')
			break
		case 'KeyD':
			frontEndPlayers[socket.id].x += 5
			socket.emit('keydown', 'KeyD')
			break
	}
})
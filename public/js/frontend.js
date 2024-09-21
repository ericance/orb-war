const canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");

const socket = io()

canvas.width = innerWidth
canvas.height = innerHeight

const scoreElement = document.querySelector('#scoreElement');

const x = canvas.width / 2
const y = canvas.height / 2

const frontEndPlayers = {}

socket.on('updatePlayers', (backEndPlayers) => {
	for (const id in backEndPlayers) {
		const backendPlayer = backEndPlayers[id]

		if (!frontEndPlayers[id]) {
			frontEndPlayers[id] = new Player({
				x: backendPlayer.x,
				y: backendPlayer.y,
				radius: 20,
				color: 'hsl(0, 100%, 50%)'
			})
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
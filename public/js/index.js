const canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");

const socket = io()

canvas.width = innerWidth
canvas.height = innerHeight

const scoreElement = document.querySelector('#scoreElement');

const x = canvas.width / 2
const y = canvas.height / 2

const players = {}

socket.on('updatePlayers', (backendPlayers) => {
	for (const id in backendPlayers) {
		const backendPlayer = backendPlayers[id]

		if (!players[id]) {
			players[id] = new Player({
				x: backendPlayer.x,
				y: backendPlayer.y,
				radius: 20,
				color: 'hsl(0, 100%, 50%)'
			})
		}
	}

	for (const id in players) {
		if (!backendPlayers[id]) {
			delete players[id]
		}
	}

	console.log(players)
})

let animationId
function animate() {
	animationId = requestAnimationFrame(animate)
	ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	for (const id in players) {
		const player = players[id]
		player.draw()
	}

}

animate()
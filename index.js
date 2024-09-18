const canvas = document.querySelector('canvas');

canvas.width = innerWidth
canvas.height = innerHeight

var ctx = canvas.getContext("2d");

class Player {
	constructor(x, y, radius, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

class Projectile {
	constructor(x, y, radius, color, velocity) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.velocity = velocity;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}

const player = new Player(canvas.width / 2, canvas.height / 2, 30, '#000')
// player.draw();

const projectiles = []
function animate() {
	requestAnimationFrame(animate)
	// For shooting a dot instead of a line uncomment and move player draw under the clearRect()
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	player.draw();
	projectiles.forEach(projectile => {
		projectile.update()
	})
}

window.addEventListener('click', (object) => {
	const angle = Math.atan2(
		object.clientY - canvas.height / 2,
		object.clientX - canvas.width / 2
	);
	const velocity = {
		x: Math.cos(angle),
		y: Math.sin(angle),
	}
	console.log(angle);
	projectiles.push(
		new Projectile(canvas.width / 2, canvas.height / 2, 2, 'red', velocity)
	)
})

animate()

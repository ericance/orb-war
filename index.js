
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

class Enemy {
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
const projectiles = []
const enemies = []

function spawnEnemies() {
	setInterval(() => {
		const radius = Math.random() * (30 - 5) + 5;
		let x
		let y

		// 50% chance to set y to 0
		if (Math.random() < 0.5) {
			x = Math.random() < 0.5 ? - radius : canvas.width + radius;
			y = Math.random() * canvas.height;
		} else {
			x = Math.random() * canvas.width;
			y = Math.random() < 0.5 ? - radius : canvas.height + radius;

		}
		const color = 'red';
		const angle = Math.atan2(
			canvas.height / 2 - y,
			canvas.width / 2 - x
		);
		const velocity = {
			x: Math.cos(angle),
			y: Math.sin(angle),
		}
		enemies.push(new Enemy(x, y, radius, color, velocity))
	}, 1000);
}

function animate() {
	requestAnimationFrame(animate)
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	player.draw();
	projectiles.forEach(projectile => {
		projectile.update()
	})

	enemies.forEach(enemy => {
		enemy.update()
	})
}

addEventListener('click', (object) => {
	const angle = Math.atan2(
		object.clientY - canvas.height / 2,
		object.clientX - canvas.width / 2
	);
	const velocity = {
		x: Math.cos(angle),
		y: Math.sin(angle),
	}
	projectiles.push(
		new Projectile(canvas.width / 2, canvas.height / 2, 2, 'red', velocity)
	)
})

animate()
spawnEnemies()


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

const player = new Player(canvas.width / 2, canvas.height / 2, 30, '#fff')
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
		const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
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

let animationId
function animate() {
	animationId = requestAnimationFrame(animate)
	ctx.fillStyle = 'rgba(0,0,0,.1)'
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	player.draw();
	projectiles.forEach((projectile, index) => {
		projectile.update()

		// remove from edges of screen
		if (
			projectile.x + projectile.radius < 0 ||
			projectile.x - projectile.radius > canvas.width ||
			projectile.y + projectile.radius < 0 ||
			projectile.y - projectile.radius > canvas.height
		) {
			setTimeout(() => {
				projectiles.splice(index, 1)
			}, 0);
		}
	})

	enemies.forEach((enemy, index) => {
		enemy.update()

		const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

		// end game
		if (dist - enemy.radius - player.radius < 1) {
			cancelAnimationFrame(animationId)
		}

		projectiles.forEach((projectile, projectileIndex) => {
			// (why hypot???)
			const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

			// objects touch
			if (dist - enemy.radius - projectile.radius < 1) {
				setTimeout(() => {
					enemies.splice(index, 1)
					projectiles.splice(projectileIndex, 1)
				}, 0);
			}
		});
	});
}

addEventListener('click', (object) => {
	console.log(projectiles)
	const angle = Math.atan2(
		object.clientY - canvas.height / 2,
		object.clientX - canvas.width / 2
	);
	const velocity = {
		x: Math.cos(angle) * 6,
		y: Math.sin(angle) * 6,
	}
	projectiles.push(
		new Projectile(canvas.width / 2, canvas.height / 2, 5, '#fff', velocity)
	)
})

animate()
spawnEnemies()

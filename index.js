const canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");

canvas.width = innerWidth
canvas.height = innerHeight

const scoreElement = document.querySelector('#scoreElement');
const startGameBtn = document.querySelector('#startGameBtn');
const modalElement = document.querySelector('#modalElement')
const bigScoreElement = document.querySelector('#bigScoreElement')

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

const friction = 0.98
class Particle {
	constructor(x, y, radius, color, velocity) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.velocity = velocity;
		this.alpha = 1;
	}

	draw() {
		ctx.save();
		ctx.globalAlpha = this.alpha;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.restore();
	}

	update() {
		this.draw()
		this.velocity.x *= friction
		this.velocity.y *= friction
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
		this.alpha -= 0.01;
	}
}

const x = canvas.width / 2
const y = canvas.height / 2

let player = new Player(x, y, 30, '#fff')
let projectiles = []
let particles = []
let enemies = []

function init() {
	player = new Player(x, y, 30, '#fff')
	projectiles = []
	particles = []
	enemies = []
	score = 0
	bigScoreElement.textContent = score;
	scoreElement.textContent = score;
}

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
let score = 0
function animate() {
	animationId = requestAnimationFrame(animate)
	ctx.fillStyle = 'rgba(0,0,0,.1)'
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	player.draw();
	particles.forEach((particle, index) => {
		if (particle.alpha <= 0) {
			particles.splice(index, 1)
		} else {
			particle.update()
		}
	})

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
			modalElement.style.display = 'flex'
			bigScoreElement.textContent = score
		}

		projectiles.forEach((projectile, projectileIndex) => {
			// (why hypot???)
			const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

			// when projectiles touch enemy
			if (dist - enemy.radius - projectile.radius < 1) {
				// increase our score
				score += 100
				scoreElement.textContent = score
				// create explosions
				for (let i = 0; i < enemy.radius; i++) {
					particles.push(
						new Particle(projectile.x, projectile.y, Math.random() * 2,
							enemy.color, {
							x: (Math.random() - 0.5) * (Math.random() * 8),
							y: (Math.random() - 0.5) * (Math.random() * 8),
						}))

				}
				if (enemy.radius - 10 > 10) {

					score += 100
					scoreElement.textContent = score

					gsap.to(enemy, {
						radius: enemy.radius - 10
					})
					setTimeout(() => {
						projectiles.splice(projectileIndex, 1)
					}, 0);
				} else {
					// remove from scene
					score += 250
					scoreElement.textContent = score
					setTimeout(() => {
						enemies.splice(index, 1)
						projectiles.splice(projectileIndex, 1)
					}, 0);
				}
			}
		});
	});
}

addEventListener('click', (object) => {
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

startGameBtn.addEventListener('click', () => {
	init()
	animate()
	spawnEnemies()
	modalElement.style.display = 'none'
})

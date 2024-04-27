class Bullet {
    // fallingSpeed - speed of falling bullet at the end of life time
    constructor(scene, sprite = "bullet1", location = [400, 300], scale = 1, direction = [-1, 1], velocity = 400, distance = 400, blockedLayers = [], fallingSpeed = 1, depth = 0) {
        this.scene = scene;
        this.scale = scale;
        this.distance = distance;
        this.fallingSpeed = fallingSpeed;
        this.velocity = velocity;

        this.sprite = scene.add.sprite(...location, sprite);
        this.sprite.setDepth(depth);
        this.sprite.setOrigin(0, 0.5);
        this.sprite.rotation = Phaser.Math.Angle.Between(0, 0, direction[0], direction[1]); // rotated bullet to direction vector
        this.sprite.scale = this.scale;

        this.destroyed = false;

        // setting circle collider. P.S. collider can't be rotated with "arcade" physics!!!
        // setCircle make circle collider with position from the top-left of the game object (this.sprite)
        const colliderRadius = 6;
        const offsetY = (this.sprite.height - 2 * colliderRadius) / 2;

        this.scene.physics.add.existing(this.sprite);
        this.sprite.body.setCircle(colliderRadius, - this.sprite.height / 2 + offsetY + Math.cos(this.sprite.rotation) * (this.sprite.width - colliderRadius), offsetY + Math.sin(this.sprite.rotation) * (this.sprite.width - colliderRadius));
        this.sprite.body.collideWorldBounds = false;

        // set layers, which block with bullet
        blockedLayers.forEach(layer => {
            scene.physics.add.collider(this.sprite, layer, this.onHit, null, scene);
        });
    }

    // please, I need your delta time 
    update(deltaTime) {
        this.distance -= this.velocity * deltaTime;

        // simulate bullet falling at the end of life time
        this.sprite.alpha = clamp(this.distance / this.velocity / this.fallingSpeed, 0, 1);
        this.sprite.scale = this.scale * clamp(this.distance / this.velocity / this.fallingSpeed, 0, 1);

        this.sprite.x = this.sprite.x + deltaTime * this.velocity * Math.cos(this.sprite.rotation);
        this.sprite.y = this.sprite.y + deltaTime * this.velocity * Math.sin(this.sprite.rotation);

        this.destroyed = this.destroyed || this.distance < 0;
        if (this.destroyed) {
            this.sprite.destroy();
        }
    }

    onHit(self, other) {
        self.destroyed = true;
        self.destroy();

        // Call onHit method of other object
        try {
            other.onHit();
        } catch (error) {

        }
    }
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export { Bullet }
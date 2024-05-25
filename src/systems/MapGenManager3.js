import { DisjointSet } from "./DisjointSet.js";

// @ts-ignore
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

// @ts-ignore
Array.prototype.first = function () {
    return this[0];
}

// @ts-ignore
Array.prototype.last = function () {
    return this[this.length - 1];
}

function randInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

// @ts-ignore
export class MapGenManager3 {
    static codes = {
        ground: 139,
        floor: {
            fulls: [88, 89, 90, 91, 92, 93, 104, 105, 106, 107, 108, 109],
            parts: [68, 69, 70, 84, 85, 86, 100, 101, 102, 116, 117, 118]
        },
        walls: {
            w1: 167,
            // empty: 167, // inside walls
            zero: 15, // no walls

            top: 1,
            bottom: 49,
            lb: 48,
            rb: 50,
            lu: 0,
            ru: 2,
            left: 16,
            right: 18,
            ilu: 19,
            iru: 21,
            ilb: 37,
            irb: 35
        },
        upper: {
            plate: 36,
            u_plate: 52,

            lu: 98,
            lu2: 114,

            ru: 97,
            ru2: 113,

            ilb: 37,
            u_ilb: 53,

            irb: 35,
            u_irb: 51,

            b_ilu: 64,
            b_iru: 67,
            b_b: 33,
            b_lb: 32,
            b_rb: 34
        },
        decals: {
            traps: [243, 244, 245],
            bones: [240, 241, 242, 258, 259, 274,
                261]
        },
        leaves: {
            l1: [256, 272],
            l2: [257, 273]
        }
    }

    constructor(width, height) {
        this.width = Math.max(width, 5)
        this.height = Math.max(height, 6)

        this.gen()
    }

    gen() {
        this.ground = []
        this.floor = []
        this.walls = []
        this.decals = []
        this.upper = []
        this.leaves = []
        for (let i = 0; i < this.height; i++) {
            this.ground[i] = []
            this.floor[i] = []
            this.walls[i] = []
            this.decals[i] = []
            this.upper[i] = []
            this.leaves[i] = []
        }

        // ground & floor
        this.gen_bottom()
        this.generateBinaryMap()
        this.walls = this.binaryMap
        this.fixTileset();
        this.gen_upper()
        // decals & leaves
        this.gen_other()
    }

    generateBinaryMap() {
        this.binaryMap = [];
        this.placedRooms = [];
        this.jointRoomPairs = [];
        this.maxRooms = 15;
        this.initBinaryMap();
        this.generateInitialRoom();
        this.generateRooms();
        this.joinAllRooms();
    }

    initBinaryMap() {
        for (let y = 0; y < this.height; y++) {
            this.binaryMap[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.binaryMap[y][x] = MapGenManager3.codes.walls.w1;
            }
        }
    }

    generateInitialRoom() {
        let roomWidth = Phaser.Math.Between(7, 12);
        let roomHeight = Phaser.Math.Between(7, 12);
        let posX = Math.floor(this.width / 2) - Math.floor(roomWidth / 2);
        let posY = Math.floor(this.height / 2) - Math.floor(roomHeight / 2);

        let room = { x: posX, y: posY, width: roomWidth, height: roomHeight };
        this.placedRooms.push(room);
        this.carveRoom(room);
    }

    generateRooms() {
        let tries = 0;
        let maxTries = 1000;
        while (this.placedRooms.length < this.maxRooms && tries < maxTries) {
            if (this.generateRoom()) {
                tries = 0;
            }
            tries += 1;
        }
    }

    generateRoom() {
        let baseRoom = Phaser.Utils.Array.GetRandom(this.placedRooms);
        let adjacent = this.generateAdjacentRoom(baseRoom, false);

        if (!adjacent) {
            return false;
        }

        this.placedRooms.push(adjacent);
        this.carveRoom(adjacent);

        if (Math.random() < 0.8) {
            this.expandRoom(adjacent);
        }

        return true;
    }

    expandRoom(baseRoom) {
        let tries = 0;
        let maxTries = 300;
        while (this.placedRooms.length < this.maxRooms && tries < maxTries) {
            let newRoom = this.generateAdjacentRoom(baseRoom, true);
            if (newRoom) {
                this.placedRooms.push(newRoom);
                this.carveRoom(newRoom);
                this.jointRoomPairs.push([this.placedRooms.indexOf(baseRoom), this.placedRooms.length - 1]);
                return;
            }
            tries++;
        }
    }

    generateAdjacentRoom(baseRoom, touching) {
        let direction = Phaser.Math.Between(0, 3); // 0: up, 1: right, 2: down, 3: left
        let roomWidth = Phaser.Math.Between(6, 12);
        let roomHeight = Phaser.Math.Between(6, 12);

        let extraDistance = + (!(touching)) * 2;

        let newRoom = {
            x: baseRoom.x + ((direction === 1) ? baseRoom.width + extraDistance : (direction === 3) ? -roomWidth - extraDistance : 0),
            y: baseRoom.y + ((direction === 2) ? baseRoom.height + extraDistance : (direction === 0) ? -roomHeight - extraDistance : 0),
            width: roomWidth,
            height: roomHeight
        };

        // fix dimension mismatch equal to 1, which corrupts the tilemap
        if (direction == 0 || direction == 2) {
            newRoom.width += Math.abs(baseRoom.x + baseRoom.width - (newRoom.x + newRoom.width)) % 2
        }
        if (direction == 1 || direction == 3) {
            newRoom.height += Math.abs(baseRoom.y + baseRoom.height - (newRoom.y + newRoom.height)) % 2
        }

        let touchingRoom = touching ? baseRoom : null;

        if (this.isValidRoomPosition(newRoom, touchingRoom)) {
            return newRoom;
        }

        return null;
    }

    isValidRoomPosition(room, touchingRoom = null) {
        if (room.x < 1 || room.y < 1 || room.x + room.width >= this.width || room.y + room.height >= this.height) {
            return false;
        }

        for (let other of this.placedRooms) {
            let extraDistance = + (touchingRoom != other) * 2;
            if (!(room.x + room.width + extraDistance <= other.x ||
                room.x >= other.x + other.width + extraDistance ||
                room.y + room.height + extraDistance <= other.y ||
                room.y >= other.y + other.height + extraDistance)) {
                return false;
            }
        }

        return true;
    }

    carveRoom(room) {
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                this.binaryMap[y][x] = MapGenManager3.codes.walls.zero;
            }
        }
    }

    joinAllRooms() {
        this.connectedSets = new DisjointSet(this.placedRooms.length);
        for (let x of this.jointRoomPairs) {
            this.connectedSets.union(x[0], x[1]);
        }

        let touchingPairs = [];
        let nonTouchingPairs = [];

        // Determine if rooms are touching or not and categorize them accordingly
        for (let i = 0; i < this.placedRooms.length; i++) {
            for (let j = i + 1; j < this.placedRooms.length; j++) {
                if (this.areRoomsTouching(this.placedRooms[i], this.placedRooms[j])) {
                    touchingPairs.push([i, j]);
                } else {
                    nonTouchingPairs.push([i, j]);
                }
            }
        }

        // Join all touching rooms first
        for (let [i, j] of touchingPairs) {
            if (!this.connectedSets.connected(i, j)) {
                this.joinRooms(this.placedRooms[i], this.placedRooms[j]);
                this.connectedSets.union(i, j);
            }
        }

        // Then join non-touching rooms
        for (let [i, j] of nonTouchingPairs) {
            if (!this.connectedSets.connected(i, j)) {
                this.joinRooms(this.placedRooms[i], this.placedRooms[j]);
                this.connectedSets.union(i, j);
            }
        }
    }

    areRoomsTouching(roomA, roomB) {
        const touchingHorizontally = Math.abs((roomA.x + roomA.width) - roomB.x) <= 2 || Math.abs((roomB.x + roomB.width) - roomA.x) <= 2;
        const verticalIntersection = this.calcIntersectionAxis(roomA, roomB, 'y')
        const touchingVertically = Math.abs((roomA.y + roomA.height) - roomB.y) <= 2 || Math.abs((roomB.y + roomB.height) - roomA.y) <= 2;
        const horizontalIntersection = this.calcIntersectionAxis(roomA, roomB, 'x')
        return (touchingHorizontally && verticalIntersection >= 2) || (touchingVertically && horizontalIntersection >= 2);
    }

    calcIntersectionAxis(firstRect, secondRect, axis) {
        if (axis !== 'x' && axis !== 'y') {
            return 0; // Invalid axis, return no intersection
        }

        // Determine the start and end points of the rectangles on the specified axis
        let startFirst = firstRect[axis];
        let endFirst = firstRect[axis] + (axis === 'x' ? firstRect.width : firstRect.height);
        let startSecond = secondRect[axis];
        let endSecond = secondRect[axis] + (axis === 'x' ? secondRect.width : secondRect.height);

        // Calculate intersection length
        let maxStart = Math.max(startFirst, startSecond);
        let minEnd = Math.min(endFirst, endSecond);
        let intersection = Math.max(0, minEnd - maxStart);

        return intersection;
    }

    joinRooms(roomA, roomB) {
        let startPoint = { x: roomA.x + Math.floor(roomA.width / 2) - 1, y: roomA.y + Math.floor(roomA.height / 2) - 1 };
        let endPoint = { x: roomB.x + Math.floor(roomB.width / 2) - 1, y: roomB.y + Math.floor(roomB.height / 2) - 1 };

        let currentPoint = { ...startPoint };
        let nextStepX = (currentPoint.x < endPoint.x) ? 1 : -1;
        let nextStepY = (currentPoint.y < endPoint.y) ? 1 : -1;

        // Correct the path before the corner to ensure the 2x2 structure
        let fixCorner = true;

        while (currentPoint.x !== endPoint.x) {
            for (let dx = 0; dx < 2; dx++) {
                for (let dy = 0; dy < 2; dy++) {
                    let doorX = currentPoint.x + dx * nextStepX;
                    let doorY = currentPoint.y + dy;
                    this.binaryMap[doorY][doorX] = MapGenManager3.codes.walls.zero;
                }
            }
            currentPoint.x += nextStepX;

            // Fix for corner issue - adjust y position before the loop exits
            if (fixCorner && currentPoint.x + nextStepX === endPoint.x) {
                for (let dy = 0; dy < 2; dy++) {
                    let doorY = currentPoint.y + dy * nextStepY;
                    this.binaryMap[doorY][currentPoint.x + (1 * nextStepX)] = MapGenManager3.codes.walls.zero;
                }
                fixCorner = false; // Prevent further corner fixing
            }
        }

        while (currentPoint.y !== endPoint.y) {
            for (let dx = 0; dx < 2; dx++) {
                for (let dy = 0; dy < 2; dy++) {
                    let doorX = currentPoint.x + dx;
                    let doorY = currentPoint.y + dy * nextStepY;
                    this.binaryMap[doorY][doorX] = MapGenManager3.codes.walls.zero;
                }
            }
            currentPoint.y += nextStepY;
        }
    }

    gen_bottom() {
        // ground
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                this.ground[j][i] = MapGenManager3.codes.ground
            }
        }

        // floor
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                // @ts-ignore
                this.floor[j][i] = MapGenManager3.codes.floor.fulls.random()
            }
        }
    }

    fixTileset() {
        const _walls = this.walls
        const _width = this.width
        const _height = this.height
        function change_by_pred(predicate, value) {
            for (let j = 2; j < _height - 1; j++) {
                for (let i = 1; i < _width - 1; i++) {
                    if (predicate({ x: i, y: j })) _walls[j][i] = value
                }
            }
        }

        function change_by_pred_border(predicate, value) {
            for (let j = 1; j < _height; j++) if (predicate({ x: 0, y: j })) _walls[j][0] = value
            for (let j = 1; j < _height; j++) if (predicate({ x: _width - 1, y: j })) _walls[j][_width - 1] = value
            for (let i = 0; i < _width; i++) if (predicate({ x: i, y: 1 })) _walls[1][i] = value
            for (let i = 0; i < _width; i++) if (predicate({ x: i, y: _height - 1 })) _walls[_height - 1][i] = value
        }

        function change_by_pred_border_top(predicate, value) {
            for (let i = 0; i < _width; i++) if (predicate({ x: i, y: 1 })) _walls[1][i] = value
        }

        // top walls
        change_by_pred(p => {
            return _walls[p.y - 1][p.x] == MapGenManager3.codes.walls.zero &&
                _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y][p.x - 1] != MapGenManager3.codes.walls.zero &&
                _walls[p.y][p.x + 1] != MapGenManager3.codes.walls.zero
        }, MapGenManager3.codes.walls.top)

        // bottom walls
        change_by_pred(p => {
            return _walls[p.y - 1][p.x] != MapGenManager3.codes.walls.zero &&
                _walls[p.y][p.x] != MapGenManager3.codes.walls.zero &&
                _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.zero &&
                _walls[p.y][p.x - 1] != MapGenManager3.codes.walls.zero &&
                _walls[p.y][p.x + 1] != MapGenManager3.codes.walls.zero
        }, MapGenManager3.codes.walls.bottom)

        // left walls
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y][p.x - 1] == MapGenManager3.codes.walls.zero
        }, MapGenManager3.codes.walls.left)

        // right walls
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y][p.x + 1] == MapGenManager3.codes.walls.zero
        }, MapGenManager3.codes.walls.right)

        // lb walls
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.left &&
                _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.zero &&
                _walls[p.y][p.x - 1] == MapGenManager3.codes.walls.zero
        }, MapGenManager3.codes.walls.lb)

        // rb walls
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.right &&
                _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.zero &&
                _walls[p.y][p.x + 1] == MapGenManager3.codes.walls.zero
        }, MapGenManager3.codes.walls.rb)

        // ilu walls
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                (_walls[p.y + 1][p.x] == MapGenManager3.codes.walls.right || _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.rb) &&
                (_walls[p.y][p.x + 1] == MapGenManager3.codes.walls.bottom || _walls[p.y][p.x + 1] == MapGenManager3.codes.walls.rb)
        }, MapGenManager3.codes.walls.ilu)

        // iru walls
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                (_walls[p.y + 1][p.x] == MapGenManager3.codes.walls.left || _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.lb) &&
                (_walls[p.y][p.x - 1] == MapGenManager3.codes.walls.bottom || _walls[p.y][p.x - 1] == MapGenManager3.codes.walls.lb)
        }, MapGenManager3.codes.walls.iru)

        // irb walls
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y - 1][p.x] == MapGenManager3.codes.walls.right &&
                (_walls[p.y][p.x + 1] == MapGenManager3.codes.walls.top || _walls[p.y][p.x + 1] == MapGenManager3.codes.walls.zero)
        }, MapGenManager3.codes.walls.irb)

        // ilb walls
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y - 1][p.x] == MapGenManager3.codes.walls.left &&
                (_walls[p.y][p.x - 1] == MapGenManager3.codes.walls.top || _walls[p.y][p.x - 1] == MapGenManager3.codes.walls.zero)
        }, MapGenManager3.codes.walls.ilb)

        // lu walls
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.left &&
                _walls[p.y][p.x + 1] == MapGenManager3.codes.walls.top
        }, MapGenManager3.codes.walls.lu)

        // ru walls
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.right &&
                _walls[p.y][p.x - 1] == MapGenManager3.codes.walls.top
        }, MapGenManager3.codes.walls.ru)

        // left border
        change_by_pred_border(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y][p.x + 1] == MapGenManager3.codes.walls.zero
        }, MapGenManager3.codes.walls.right)

        change_by_pred_border(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y][p.x + 1] == MapGenManager3.codes.walls.top
        }, MapGenManager3.codes.walls.irb)

        change_by_pred_border(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y][p.x + 1] == MapGenManager3.codes.walls.bottom
        }, MapGenManager3.codes.walls.ilu)

        // right border
        change_by_pred_border(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y][p.x - 1] == MapGenManager3.codes.walls.zero
        }, MapGenManager3.codes.walls.left)

        change_by_pred_border(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y][p.x - 1] == MapGenManager3.codes.walls.top
        }, MapGenManager3.codes.walls.ilb)

        change_by_pred_border(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y][p.x - 1] == MapGenManager3.codes.walls.bottom
        }, MapGenManager3.codes.walls.iru)

        // bottom border
        change_by_pred_border(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y - 1][p.x] == MapGenManager3.codes.walls.zero
        }, MapGenManager3.codes.walls.top)

        change_by_pred_border(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y - 1][p.x] == MapGenManager3.codes.walls.left
        }, MapGenManager3.codes.walls.ilb)

        change_by_pred_border(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y - 1][p.x] == MapGenManager3.codes.walls.right
        }, MapGenManager3.codes.walls.irb)

        // top border
        change_by_pred_border_top(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.zero
        }, MapGenManager3.codes.walls.bottom)

        change_by_pred_border_top(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                (_walls[p.y + 1][p.x] == MapGenManager3.codes.walls.left || _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.lb)
        }, MapGenManager3.codes.walls.iru)

        change_by_pred_border_top(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.w1 &&
                (_walls[p.y + 1][p.x] == MapGenManager3.codes.walls.right || _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.rb)
        }, MapGenManager3.codes.walls.ilu)
    }
    gen_upper() {
        const _walls = this.walls
        const _width = this.width
        const _height = this.height
        const _upper = this.upper

        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                this.upper[j][i] = MapGenManager3.codes.walls.zero
            }
        }

        function change_by_pred(predicate, value, d = [0, 0, 0, 0]) {
            for (let j = 2 + d[0]; j < _height - 1 + d[1]; j++) {
                for (let i = 1 + d[2]; i < _width - 1 + d[3]; i++) {
                    if (predicate({ x: i, y: j })) _upper[j][i] = value
                }
            }
        }

        // uniq cases
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.left &&
                _walls[p.y + 1][p.x - 1] == MapGenManager3.codes.walls.left
        }, MapGenManager3.codes.walls.ilb, [-1, 0, 0, 1])

        change_by_pred(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.left &&
                _walls[p.y][p.x + 1] == MapGenManager3.codes.walls.left
        }, MapGenManager3.codes.upper.lu, [-1, 0, -1, 0])

        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.left &&
                _walls[p.y - 1][p.x + 1] == MapGenManager3.codes.walls.left
        }, MapGenManager3.codes.upper.lu2, [0, 1, -1, 0])

        change_by_pred(p => {
            return _walls[p.y - 1][p.x] == MapGenManager3.codes.walls.left &&
                _walls[p.y][p.x - 1] == MapGenManager3.codes.walls.left
        }, MapGenManager3.codes.upper.u_ilb, [0, 1, 0, 1])

        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.right &&
                _walls[p.y + 1][p.x + 1] == MapGenManager3.codes.walls.right
        }, MapGenManager3.codes.walls.irb, [-1, 0, -1, 0])

        change_by_pred(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.right &&
                _walls[p.y][p.x - 1] == MapGenManager3.codes.walls.right
        }, MapGenManager3.codes.upper.ru, [-1, 0, 0, 1])

        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.right &&
                _walls[p.y - 1][p.x - 1] == MapGenManager3.codes.walls.right
        }, MapGenManager3.codes.upper.ru2, [0, 1, 0, 1])

        change_by_pred(p => {
            return _walls[p.y - 1][p.x] == MapGenManager3.codes.walls.left &&
                _walls[p.y][p.x + 1] == MapGenManager3.codes.walls.left
        }, MapGenManager3.codes.upper.u_irb, [0, 1, -1, 0])

        // w-walls
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.zero &&
                _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.left &&
                _walls[p.y + 1][p.x + 1] == MapGenManager3.codes.walls.right
        }, MapGenManager3.codes.walls.lu, [-1, 0, -1, 0])

        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.zero &&
                _walls[p.y + 1][p.x - 1] == MapGenManager3.codes.walls.left &&
                _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.right
        }, MapGenManager3.codes.walls.ru, [-1, 0, 0, 1])

        // left upper
        change_by_pred(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.lu
        }, MapGenManager3.codes.upper.lu, [-1, 0, -1, 1])
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.lu
        }, MapGenManager3.codes.upper.lu2, [-1, 1, -1, 1])

        // right upper
        change_by_pred(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.ru
        }, MapGenManager3.codes.upper.ru, [-1, 0, -1, 1])
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.ru
        }, MapGenManager3.codes.upper.ru2, [-1, 1, -1, 1])

        // upper
        change_by_pred(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.top
        }, MapGenManager3.codes.upper.plate, [-1, 0, -1, 1])
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.top
        }, MapGenManager3.codes.upper.u_plate, [-1, 1, -1, 1])

        // inner left bottom
        change_by_pred(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.upper.ilb
        }, MapGenManager3.codes.upper.ilb, [-1, 0, -1, 1])
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.upper.ilb
        }, MapGenManager3.codes.upper.u_ilb, [-1, 1, -1, 1])

        // inner left bottom
        change_by_pred(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.upper.irb
        }, MapGenManager3.codes.upper.irb, [-1, 0, -1, 1])
        change_by_pred(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.upper.irb
        }, MapGenManager3.codes.upper.u_irb, [-1, 1, -1, 1])

        // top inner left
        change_by_pred(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.ilu
        }, MapGenManager3.codes.upper.b_ilu, [-2, 0, -1, 1])

        // top inner right
        change_by_pred(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.iru
        }, MapGenManager3.codes.upper.b_iru, [-2, 0, -1, 1])

        // top
        change_by_pred(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.bottom
        }, MapGenManager3.codes.upper.b_b, [-2, 0, -1, 1])

        // top left
        change_by_pred(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.lb
        }, MapGenManager3.codes.upper.b_lb, [-2, 0, -1, 1])

        // top right
        change_by_pred(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.rb
        }, MapGenManager3.codes.upper.b_rb, [-2, 0, -1, 1])

    }
    gen_other() {
        const _walls = this.walls
        const _width = this.width
        const _height = this.height
        const _decals = this.decals
        const _leaves = this.leaves

        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                this.decals[j][i] = MapGenManager3.codes.walls.zero
                this.leaves[j][i] = MapGenManager3.codes.walls.zero
            }
        }

        function change_by_pred_decals(predicate, value, d = [0, 0, 0, 0]) {
            for (let j = 2 + d[0]; j < _height - 1 + d[1]; j++) {
                for (let i = 1 + d[2]; i < _width - 1 + d[3]; i++) {
                    if (predicate({ x: i, y: j })) _decals[j][i] = value.random()
                }
            }
        }

        function change_by_pred_leaves(predicate, value, d = [0, 0, 0, 0]) {
            for (let j = 2 + d[0]; j < _height - 1 + d[1]; j++) {
                for (let i = 1 + d[2]; i < _width - 1 + d[3]; i++) {
                    if (predicate({ x: i, y: j })) {
                        _leaves[j][i] = value[0]
                        _leaves[j + 1][i] = value[1]
                    }
                }
            }
        }

        // traps

        // change_by_pred_decals(p => {
        //     return _walls[p.y][p.x] == MapGenManager3.codes.walls.zero &&
        //         randInt(0, 100) < 18
        // }, MapGenManager3.codes.decals.traps)

        change_by_pred_decals(p => {
            return _walls[p.y][p.x] == MapGenManager3.codes.walls.zero &&
                Math.random() < 0.005
        }, MapGenManager3.codes.decals.bones)

        // bones

        change_by_pred_leaves(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.bottom &&
                randInt(0, 100) < 5
        }, MapGenManager3.codes.leaves.l1)

        change_by_pred_leaves(p => {
            return _walls[p.y + 1][p.x] == MapGenManager3.codes.walls.bottom &&
                randInt(0, 100) < 5
        }, MapGenManager3.codes.leaves.l2)
    }

    // async export_json() {
    //     let template = (await (await fetch("gen_room_template.json")).text())
    //     template = template.replace(/@width/g, this.width.toString())
    //         .replace(/@height/g, this.height.toString())
    //         .replace("@Ground", this.ground.toString())
    //         .replace("@Floor", this.floor.toString())
    //         .replace("@Walls", this.walls.toString())
    //         .replace("@Decals", this.decals.toString())
    //         .replace("@Upper", this.upper.toString())
    //         .replace("@Leaves", this.leaves.toString())

    //     return template
    // }
}
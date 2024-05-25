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

        this.minDoorSize = 1;
        this.maxDoorSize = 4;

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
        //this.gen_walls()
        this.walls = this.binaryMap
        this.fixTileset();
        this.gen_upper()
        // decals & leaves
        this.gen_other()
    }

    generateBinaryMap() {
        this.binaryMap = [];
        this.placedRooms = [];
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

        if (Math.random() < 0.5) {
            this.expandRoom(adjacent);
        }

        return true;
    }

    expandRoom(baseRoom) {
        let tries = 0;
        let maxTries = 100;
        while (this.placedRooms.length < this.maxRooms && tries < maxTries) {
            let newRoom = this.generateAdjacentRoom(baseRoom, true);
            if (newRoom) {
                this.placedRooms.push(newRoom);
                this.carveRoom(newRoom);
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
            let extraDistance = + (!(touchingRoom == other)) * 2;
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
        for (let i = 0; i < this.placedRooms.length; i++) {
            for (let j = i + 1; j < this.placedRooms.length; j++) {
                if (!this.connectedSets.connected(i, j)) {
                    this.joinRooms(this.placedRooms[i], this.placedRooms[j]);
                    this.connectedSets.union(i, j);
                }
            }
        }
    }

    joinRooms(roomA, roomB) {
        let startPoint = { x: roomA.x + Math.floor(roomA.width / 2), y: roomA.y + Math.floor(roomA.height / 2) };
        let endPoint = { x: roomB.x + Math.floor(roomB.width / 2), y: roomB.y + Math.floor(roomB.height / 2) };

        let currentPoint = { ...startPoint };
        let nextStepX = (currentPoint.x < endPoint.x) ? 1 : -1;
        let nextStepY = (currentPoint.y < endPoint.y) ? 1 : -1;

        while (currentPoint.x !== endPoint.x) {
            for (let dx = 0; dx < 2; dx++) {
                for (let dy = 0; dy < 2; dy++) {
                    let doorX = currentPoint.x + dx * nextStepX;
                    let doorY = currentPoint.y + dy;
                    this.binaryMap[doorY][doorX] = MapGenManager3.codes.walls.zero;
                }
            }
            currentPoint.x += nextStepX;
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

    gen_walls() {
        const _walls = this.walls
        const _width = this.width
        const _height = this.height

        function is_valid(y, x) {
            return y >= 0 && y < _height && x >= 0 && x < _width
        }

        function is_border(y, x) {
            return y < 2 || y + 1 == _height || x < 1 || x + 1 == _width
        }

        for (let j = 0; j < _height; j++) {
            for (let i = 0; i < _width; i++) {
                _walls[j][i] = is_border(j, i) ? MapGenManager3.codes.walls.w1 : MapGenManager3.codes.walls.zero
            }
        }

        const rooms = []
        const walls = []

        function is_inside(obj, p) {
            return p.x >= obj.x &&
                p.y >= obj.y &&
                p.x < (obj.x + obj.width) &&
                p.y < (obj.y + obj.height)
        }

        function check_room_from(y, x) {
            for (const room of rooms) {
                if (is_inside(room, { x: x, y: y }))
                    return {
                        is_possible: false,
                        is_busy: true,
                        dx: room.width + 2
                    }
            }

            const ret = {
                size: {
                    width: 0,
                    height: 0,
                },
                is_possible: true
            }

            let i;
            for (i = x; _walls[y][i] == MapGenManager3.codes.walls.zero; i++);
            ret.size.width = i - x;
            if (ret.size.width < 3) return { is_possible: false, is_busy: false }

            for (i = y; _walls[i][x] == MapGenManager3.codes.walls.zero; i++);
            ret.size.height = i - y;
            if (ret.size.height < 3) return { is_possible: false, is_busy: false }

            return ret;
        }

        function add_room(y, x, size) {
            rooms.push({
                x: x,
                y: y,
                width: randInt(3, Math.max(size.width / 2, 3)),
                height: randInt(3, Math.max(size.height / 2, 3)),
                connected: false
            })
        }

        function gen_local_walls(room) {
            // for (let j = room.y; j < room.height + 3; j++) {
            //     for (let i = room.x - 2; i < room.width + 2; i++) {
            //         if(!is_inside(room, {x:i, y:j})) _walls[j][i] = MapGenManager3.codes.walls.w1
            //     }
            // }

            // bottom
            for (let dy = room.height; dy < room.height + 3; dy++) {
                for (let dx = -2; dx < room.width + 2; dx++) {
                    if (is_valid(room.y + dy, room.x + dx)) {
                        _walls[room.y + dy][room.x + dx] = MapGenManager3.codes.walls.w1
                    }
                }
            }

            // left
            for (let dx = -2; dx < 0; dx++) {
                for (let dy = 0; dy < room.height; dy++) {
                    if (is_valid(room.y + dy, room.x + dx)) {
                        _walls[room.y + dy][room.x + dx] = MapGenManager3.codes.walls.w1
                    }
                }
            }

            // right
            for (let dx = room.width; dx < room.width + 2; dx++) {
                for (let dy = 0; dy < room.height; dy++) {
                    if (is_valid(room.y + dy, room.x + dx)) {
                        _walls[room.y + dy][room.x + dx] = MapGenManager3.codes.walls.w1
                    }
                }
            }
        }

        // gen rooms
        for (let j = 2; j < _height - 1; j++) {
            for (let i = 1; i < _width - 1; i++) {
                // _walls[j][i]
                const temp = check_room_from(j, i)
                if (temp.is_possible) {
                    add_room(j, i, temp.size)
                    // @ts-ignore
                    gen_local_walls(rooms.last())
                } else if (temp.is_busy) {
                    // i += (temp.dx - 1)
                } else {
                    _walls[j][i] = MapGenManager3.codes.walls.w1
                }
            }
        }

        function find_room(p) {
            for (const room of rooms) {
                if (is_inside(room, p)) {
                    return room
                }
            }
        }

        function check_wall_from(y, x) {
            if (_walls[y][x] == MapGenManager3.codes.walls.zero || y + 3 >= _height || x + 2 >= _width) return { is_wall: false }

            for (const wall of walls) {
                if (is_inside(wall, { x: x, y: y }))
                    return { is_wall: false }
            }

            let dy
            for (dy = 0;
                _walls[y + dy][x - 1] == MapGenManager3.codes.walls.zero &&
                _walls[y + dy][x + 0] == MapGenManager3.codes.walls.w1 &&
                _walls[y + dy][x + 1] == MapGenManager3.codes.walls.w1 &&
                _walls[y + dy][x + 2] == MapGenManager3.codes.walls.zero; dy++);

            // vertical
            if (dy >= 2) {
                return {
                    is_wall: true,
                    width: 2,
                    height: dy,
                    is_vert: true,
                    rooms: [find_room({ y: y, x: x - 1 }), find_room({ y: y, x: x + 2 })]
                }
            }

            let dx
            for (dx = 0;
                _walls[y - 1][x + dx] == MapGenManager3.codes.walls.zero &&
                _walls[y + 0][x + dx] == MapGenManager3.codes.walls.w1 &&
                _walls[y + 1][x + dx] == MapGenManager3.codes.walls.w1 &&
                _walls[y + 2][x + dx] == MapGenManager3.codes.walls.w1 &&
                _walls[y + 3][x + dx] == MapGenManager3.codes.walls.zero; dx++);

            // horizontal
            if (dx >= 2) {
                return {
                    is_wall: true,
                    width: dx,
                    height: 3,
                    is_vert: false,
                    rooms: [find_room({ y: y - 1, x: x }), find_room({ y: y + 3, x: x })]
                }
            }

            return { is_wall: false }
        }

        function do_hole(wall) {
            if (wall.is_vert) {
                let j = 0, maxJ = wall.height
                if (wall.height > 3) {
                    j = randInt(0, 2) ? 0 : (maxJ - 2)
                    maxJ = j + 2
                }
                for (; j < maxJ; j++) {
                    for (let i = 0; i < wall.width; i++) {
                        _walls[wall.y + j][wall.x + i] = MapGenManager3.codes.walls.zero
                    }
                }
            } else {
                let i = 0, maxI = wall.width
                if (wall.width > 3) {
                    i = randInt(0, 2) ? 0 : (maxI - 2)
                    maxI = i + 2
                }
                for (; i < maxI; i++) {
                    for (let j = 0; j < wall.height; j++) {
                        _walls[wall.y + j][wall.x + i] = MapGenManager3.codes.walls.zero
                    }
                }
            }
        }

        function connect_rooms_from(room) {
            room.connected = true
            for (const wall of walls) {
                if (wall.rooms[0] == room && !wall.rooms[1].connected) {
                    connect_rooms_from(wall.rooms[1])
                    do_hole(wall)
                } else if (wall.rooms[1] == room && !wall.rooms[0].connected) {
                    connect_rooms_from(wall.rooms[0])
                    do_hole(wall)
                }
            }
        }

        // find walls
        for (let j = 2; j < _height - 1; j++) {
            for (let i = 1; i < _width - 1; i++) {
                const temp = check_wall_from(j, i)
                if (temp.is_wall) {
                    walls.push({
                        x: i,
                        y: j,
                        width: temp.width,
                        height: temp.height,
                        is_vert: temp.is_vert,
                        rooms: temp.rooms
                    })
                }
            }
        }

        // do holes
        connect_rooms_from(rooms[0])

        // remove not connected rooms
        for (const room of rooms) {
            if (!room.connected) {
                for (let dy = 0; dy < room.height; dy++) {
                    for (let dx = 0; dx < room.width; dx++) {
                        _walls[room.y + dy][room.x + dx] = MapGenManager3.codes.walls.w1
                    }

                }
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

        // do zerowalls
        // change_by_pred(p => {
        //     for(let dy = -1; dy <= 1; dy++){
        //         for(let dx = -1; dx <= 1; dx++){
        //             if(_walls[p.y+dy][p.x+dx] == MapGenManager3.codes.walls.zero)
        //                 return false
        //         }    
        //     }
        //     return true
        // }, MapGenManager3.codes.walls.empty)

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
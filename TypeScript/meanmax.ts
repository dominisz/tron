declare function readline(): string
declare function print(...output: any[]): void
declare function printErr(...output: any[]): void


class Player {
    private readonly WAIT = 'WAIT';
    private readonly MAX_PLAYERS = 3;
    private readonly REAPER = 0;
    private readonly WRECK = 4;
    private readonly RADIUS = 6000;

    private bots: any[] = [];
    private units: any[] = [];

    private lastThrottle = 0;
    private jumping = false;

    constructor() {
        for (let i = 0; i < this.MAX_PLAYERS; i++) {
            this.bots.push({});
        }

        this.gameLoop();
    }

    public gameLoop() {
        while (true) {
            this.inputForARound();

            print(this.selectMove());
            print(this.WAIT);
            print(this.WAIT);
        }
    }

    inputForARound() {
        for (let i = 0; i < this.MAX_PLAYERS; i++) {
            parseInt(readline(), 10);
        }
        for (let i = 0; i < this.MAX_PLAYERS; i++) {
            parseInt(readline(), 10);
        }

        this.bots.length = 0;
        this.units.length = 0;

        let unitCount = parseInt(readline(), 10);
        for (let i = 0; i < unitCount; i++) {
            const inputs = readline().split(' ');
            const unit = new Unit(
                parseInt(inputs[0]),
                parseInt(inputs[1]),
                parseInt(inputs[2]),
                parseFloat(inputs[3]),
                parseInt(inputs[4]),
                parseInt(inputs[5]),
                parseInt(inputs[6]),
                parseInt(inputs[7]),
                parseInt(inputs[8]),
                parseInt(inputs[9]),
                parseInt(inputs[10])
            );

            if (unit.unitType === this.REAPER) {
                this.bots.push(unit);
            } else if (unit.unitType === this.WRECK) {
                this.units.push(unit);
            }
        }
    }

    selectMove() {
        const player = this.bots[0];

        let [minDistance, closestUnit] = this.findSafePointClosestToBot();
        if (closestUnit === -1) {
            printErr('PANIC');
            [minDistance, closestUnit] = this.findPointClosestToBot();
        } else {
            printErr('SAFE');
        }

        // let [secondMinDistance, secondClosestUnit] = this.findClosestPointToUnit(this.units[closestUnit]);
        //
        // const closestMidPointDistance = this.distance(
        //     this.units[closestUnit],
        //     this.units[secondClosestUnit],
        // );

        let target: {x: number, y: number} = null;

        if (minDistance > this.units[closestUnit].radius) {
            target = {
                x: this.units[closestUnit].x,
                y: this.units[closestUnit].y,
            };
        }

        printErr('player v x y:', player.v, player.vx, player.vy);
        printErr('closestUnit id', this.units[closestUnit].unitId);

        // if(secondClosestUnit !== closestUnit
        //     && closestMidPointDistance < this.units[closestUnit].radius + this.units[secondClosestUnit].radius - 10) {
        //     target = this.getMidpoint(this.units[closestUnit], this.units[secondClosestUnit]);
        //     printErr('target', target)
        // }
        //
        // if(secondClosestUnit !== closestUnit && target){
        //     minDistance = this.distance(this.bots[0], {x: target[0], y: target[1]});
        // }


        let output = this.WAIT;

        if (this.jumping) {
            output = [
                Math.floor(player.x - player.vx * 1.25),
                Math.floor(player.y - player.vy * 1.25),
                Math.floor(this.lastThrottle * 0.8)
            ].join(' ');
            this.jumping = !this.jumping;
        } else if (target) {
            const throttle = minDistance > 600 ? 300 : Math.floor(minDistance / 2);
            printErr('minDistance', minDistance, throttle);
            this.lastThrottle = throttle;

            output = [
                target.x,
                target.y,
                throttle
            ].join(' ');
            this.jumping = !this.jumping;
        }

        printErr(closestUnit, this.units[closestUnit].radius);


        // const pos = {x: player.x, y: player.y};
        // const polarPos = this.cartToPolar(pos);
        // polarPos.angle += 22.5;
        // const target = this.polarToCart(polarPos);

        return output;
    }

    findPointClosestToBot() {
        let minDistance = 2 * this.RADIUS;
        let closestUnit = -1;
        for (let i = 0; i < this.units.length; i++) {
            let dist = this.distance(this.bots[0], this.units[i]);
            if (dist < minDistance /* && this.units[i].extra > 2*/) {
                minDistance = dist;
                closestUnit = i;
            }
        }

        return [minDistance, closestUnit];
    }
    findSafePointClosestToBot() {
        let minDistance = 2 * this.RADIUS;
        let closestUnit = -1;
        for (let i = 0; i < this.units.length; i++) {
            let dist = this.distance(this.bots[0], this.units[i]);
            let dist1 = this.distance(this.bots[1], this.units[i]);
            let dist2 = this.distance(this.bots[2], this.units[i]);

            if (dist < minDistance && dist1 > 1200 && dist2 > 1200) {
                minDistance = dist;
                closestUnit = i;
            }
        }

        return [minDistance, closestUnit];
    }
    findClosestPointToUnit(target) {
        let minDistance = 2 * this.RADIUS;
        let closestUnit = 0;
        for (let i = 0; i < this.units.length; i++) {
            let dist = this.distance(target, this.units[i]);
            if (dist < minDistance && i !== target) {
                minDistance = dist;
                closestUnit = i;
            }
        }

        return [minDistance, closestUnit];
    }

    distance(bot, unit) {
        return Math.sqrt((bot.x - unit.x) ** 2 + (bot.y - unit.y) ** 2);
    }

    getMidpoint(point1, point2) {
        printErr(point1.x, point2.x, point1.y, point2.y);
        return {
            x: Math.abs(point1.x - point2.x),
            y: Math.abs(point1.y - point2.y)
        };
    }

    cartToPolar({x, y}) {
        const r = Math.sqrt(x ** 2 + y ** 2);
        const angle = (Math.atan2(y, x) * 180) / Math.PI;
        return {r, angle};
    }

    polarToCart({r, angle}) {
        const x = r * Math.cos(angle * (Math.PI / 180));
        const y = r * Math.sin(angle * (Math.PI / 180));
        return {x, y};
    }
}

class Unit {
    public unitId: number;
    public unitType: number;
    public player: number;
    public mass: number;
    public radius: number;
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public extra: number;
    public extra2: number;

    public get v(): number {
       return Math.sqrt(this.vx **2 + this.vy ** 2)
    }

    constructor(unitId, unitType, player, mass, radius, x, y, vx, vy, extra, extra2){
        this.unitId = unitId;
        this.unitType = unitType;
        this.player = player;
        this.mass = mass;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.extra = extra;
        this.extra2 = extra2;
    }
}

const player = new Player();
player.gameLoop();

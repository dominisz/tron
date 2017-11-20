var Player = (function () {
    function Player() {
        this.WAIT = 'WAIT';
        this.MAX_PLAYERS = 3;
        this.REAPER = 0;
        this.WRECK = 4;
        this.RADIUS = 6000;
        this.bots = [];
        this.units = [];
        this.lastThrottle = 0;
        this.jumping = false;
        for (var i = 0; i < this.MAX_PLAYERS; i++) {
            this.bots.push({});
        }
        this.gameLoop();
    }
    Player.prototype.gameLoop = function () {
        while (true) {
            this.inputForARound();
            print(this.selectMove());
            print(this.WAIT);
            print(this.WAIT);
        }
    };
    Player.prototype.inputForARound = function () {
        for (var i = 0; i < this.MAX_PLAYERS; i++) {
            parseInt(readline(), 10);
        }
        for (var i = 0; i < this.MAX_PLAYERS; i++) {
            parseInt(readline(), 10);
        }
        this.bots.length = 0;
        this.units.length = 0;
        var unitCount = parseInt(readline(), 10);
        for (var i = 0; i < unitCount; i++) {
            var inputs = readline().split(' ');
            var unit = new Unit(parseInt(inputs[0]), parseInt(inputs[1]), parseInt(inputs[2]), parseFloat(inputs[3]), parseInt(inputs[4]), parseInt(inputs[5]), parseInt(inputs[6]), parseInt(inputs[7]), parseInt(inputs[8]), parseInt(inputs[9]), parseInt(inputs[10]));
            if (unit.unitType === this.REAPER) {
                this.bots.push(unit);
            }
            else if (unit.unitType === this.WRECK) {
                this.units.push(unit);
            }
        }
    };
    Player.prototype.selectMove = function () {
        var player = this.bots[0];
        var _a = this.findSafePointClosestToBot(), minDistance = _a[0], closestUnit = _a[1];
        if (closestUnit === -1) {
            printErr('PANIC');
            _b = this.findPointClosestToBot(), minDistance = _b[0], closestUnit = _b[1];
        }
        else {
            printErr('SAFE');
        }
        // let [secondMinDistance, secondClosestUnit] = this.findClosestPointToUnit(this.units[closestUnit]);
        //
        // const closestMidPointDistance = this.distance(
        //     this.units[closestUnit],
        //     this.units[secondClosestUnit],
        // );
        var target = null;
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
        var output = this.WAIT;
        if (this.jumping) {
            output = [
                Math.floor(player.x - player.vx * 1.25),
                Math.floor(player.y - player.vy * 1.25),
                Math.floor(this.lastThrottle * 0.8)
            ].join(' ');
            this.jumping = !this.jumping;
        }
        else if (target) {
            var throttle = minDistance > 600 ? 300 : Math.floor(minDistance / 2);
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
        var _b;
    };
    Player.prototype.findPointClosestToBot = function () {
        var minDistance = 2 * this.RADIUS;
        var closestUnit = -1;
        for (var i = 0; i < this.units.length; i++) {
            var dist = this.distance(this.bots[0], this.units[i]);
            if (dist < minDistance /* && this.units[i].extra > 2*/) {
                minDistance = dist;
                closestUnit = i;
            }
        }
        return [minDistance, closestUnit];
    };
    Player.prototype.findSafePointClosestToBot = function () {
        var minDistance = 2 * this.RADIUS;
        var closestUnit = -1;
        for (var i = 0; i < this.units.length; i++) {
            var dist = this.distance(this.bots[0], this.units[i]);
            var dist1 = this.distance(this.bots[1], this.units[i]);
            var dist2 = this.distance(this.bots[2], this.units[i]);
            if (dist < minDistance && dist1 > 1200 && dist2 > 1200) {
                minDistance = dist;
                closestUnit = i;
            }
        }
        return [minDistance, closestUnit];
    };
    Player.prototype.findClosestPointToUnit = function (target) {
        var minDistance = 2 * this.RADIUS;
        var closestUnit = 0;
        for (var i = 0; i < this.units.length; i++) {
            var dist = this.distance(target, this.units[i]);
            if (dist < minDistance && i !== target) {
                minDistance = dist;
                closestUnit = i;
            }
        }
        return [minDistance, closestUnit];
    };
    Player.prototype.distance = function (bot, unit) {
        return Math.sqrt(Math.pow((bot.x - unit.x), 2) + Math.pow((bot.y - unit.y), 2));
    };
    Player.prototype.getMidpoint = function (point1, point2) {
        printErr(point1.x, point2.x, point1.y, point2.y);
        return {
            x: Math.abs(point1.x - point2.x),
            y: Math.abs(point1.y - point2.y)
        };
    };
    Player.prototype.cartToPolar = function (_a) {
        var x = _a.x, y = _a.y;
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var angle = (Math.atan2(y, x) * 180) / Math.PI;
        return { r: r, angle: angle };
    };
    Player.prototype.polarToCart = function (_a) {
        var r = _a.r, angle = _a.angle;
        var x = r * Math.cos(angle * (Math.PI / 180));
        var y = r * Math.sin(angle * (Math.PI / 180));
        return { x: x, y: y };
    };
    return Player;
}());
var Unit = (function () {
    function Unit(unitId, unitType, player, mass, radius, x, y, vx, vy, extra, extra2) {
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
    Object.defineProperty(Unit.prototype, "v", {
        get: function () {
            return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
        },
        enumerable: true,
        configurable: true
    });
    return Unit;
}());
var player = new Player();
player.gameLoop();

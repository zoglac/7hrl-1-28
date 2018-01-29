var mazeState = {
    create: function(game) {
        var obj = this;

        obj.backColor = "#600000";
        obj.hallColor = "#606060";
        obj.mazeSize = 100;
        obj.squareSize = 10;

        obj.makeMaze();

        obj.phys = createPhysics(game);

        obj.viewer = createViewer(game, obj.mazeSize/2.0, obj.mazeSize/2.0, 20.0);
        obj.resize(game);

        for (var i=0; i<obj.mazeSize; i++)
            for (var j=0; j<obj.mazeSize; j++)
            {
                if (obj.maze[i][j] == 1)
                {
                    if ((i > 0 && Math.abs(obj.maze[i-1][j]) != 1) || (j > 0 && Math.abs(obj.maze[i][j-1]) != 1) ||
                                    (i < obj.mazeSize-1 && Math.abs(obj.maze[i+1][j]) != 1) || (j < obj.mazeSize-1 && Math.abs(obj.maze[i][j+1]) != 1))
                    {
                        obj.phys.addStatic(i,j,1,1,1);
                        //console.log("Static: "+i+", "+j);
                    }
                    else
                    {
                        obj.maze[i][j] = -1;
                    }
                }
            }
        var px; var py;
        do
        {
            px = Math.floor(Math.random()*obj.mazeSize); py = Math.floor(Math.random()*obj.mazeSize);
        }
        while (Math.abs(obj.maze[px][py]) == 1);

        obj.player = createPlayer(obj, px, py);
        console.log("Player: "+obj.player.x + ", " + obj.player.y);

        obj.enemies = [];
        var eloc = [];
        for (var i=0; i<100; i++)
        {
            var ex = Math.floor(Math.random()*obj.mazeSize); var ey = Math.floor(Math.random()*obj.mazeSize);
            //console.log(ex + ", " + ey);
            //eloc = [Math.floor(ex*obj.mazeSize), Math.floor(ey*obj.mazeSize)];
            //console.log(eloc);

            if (Math.abs(obj.maze[ex][ey]) != 1)
            {
                var en = createEnemy(obj.phys, ex+0.5, ey+0.5, 0);
                //en.mm.force
                obj.enemies.push(en);

                //console.log(i+": "+en.x+", "+en.y);
            }
        }
        /*for (var i=0; i<obj.enemies.length; i++)
        {
            console.log(i+": "+obj.enemies[i].x+", "+obj.enemies[i].y);
        }*/
    },

    update: function(game) {
        var obj = this;
        
        this.phys.step(game);

        obj.player.update(game);

        obj.viewer.viewx = obj.player.x;
        obj.viewer.viewy = obj.player.y;

        for (var i=0; i<obj.enemies.length; i++)
        {
            obj.enemies[i].update();
        }
    },

    render: function(game) {
        var obj = this;

        game.ctx.fillStyle = obj.backColor;
        game.ctx.fillRect(0, 0, game.width, game.height);

        for (var i=0; i<obj.mazeSize; i++)
        {
            for (var j=0; j<obj.mazeSize; j++)
            {
                if (obj.maze[i][j] == -1)
                {
                    game.ctx.fillStyle = "#000";
                    //game.ctx.fillRect(i*obj.squareSize, j*obj.squareSize, obj.squareSize, obj.squareSize);
                    obj.viewer.fillRect(game.ctx, i,j,1,1);
                }
                if (obj.maze[i][j] == 0)
                {
                    game.ctx.fillStyle = obj.hallColor;
                    //game.ctx.fillRect(i*obj.squareSize, j*obj.squareSize, obj.squareSize, obj.squareSize);
                    obj.viewer.fillRect(game.ctx, i,j,1,1);
                }
                if (obj.maze[i][j] == 1)
                {
                    game.ctx.fillStyle = "#222";
                    //game.ctx.fillRect(i*obj.squareSize, j*obj.squareSize, obj.squareSize, obj.squareSize);
                    obj.viewer.fillRect(game.ctx, i,j,1,1);
                }
                if (obj.maze[i][j] >= 2)
                {
                    game.ctx.fillStyle = obj.rooms[obj.maze[i][j]-2].col;
                    //game.ctx.strokeStyle = "#000";
                    //game.ctx.fillRect(i*obj.squareSize, j*obj.squareSize, obj.squareSize, obj.squareSize);
                    //game.ctx.strokeRect(i*obj.squareSize, j*obj.squareSize, obj.squareSize, obj.squareSize);
                    obj.viewer.fillRect(game.ctx, i,j,1,1);
                }
            }
        }

        game.ctx.fillStyle = "#f00";
        obj.viewer.fillCirc(game.ctx, obj.player.x, obj.player.y, 0.25);

        for (var i=0; i<obj.enemies.length; i++)
        {
            //console.log(i+": "+obj.enemies[i].x+", "+obj.enemies[i].y);
            game.ctx.fillStyle = "#fff";
            obj.viewer.fillCirc(game.ctx, obj.enemies[i].x, obj.enemies[i].y, 0.25);
        }
    },

    resize: function(game) {
        this.viewer.resize(game);
    },

    makeMaze: function(mazeSize) {
        console.log("Making maze");
        var obj = this;
        obj.maze = [];

        for (var i=0; i<obj.mazeSize; i++)
        {
            var row = [];
            for (var j=0; j<obj.mazeSize; j++)
            {
                row.push(1);
            }
            obj.maze.push(row);
        }

        //var roomNum = Math.round(gaussian(25.0, 10.0, 10.0, 100.0));
        //console.log("roomNum: "+roomNum);
        obj.usedSpace = 0;

        while(obj.usedSpace < obj.mazeSize*obj.mazeSize*0.5)
        {
            var roomLoc = [randbt(1, obj.mazeSize-1), randbt(1,obj.mazeSize-1)];
            var roomSize = [Math.floor(gaussian(10.0, 5.0, 3.0, 100.0)), Math.floor(gaussian(10.0, 5.0, 3.0, 100.0))];
            //console.log("Room "+i+": "+roomLoc+" - "+roomSize);

            for (var j=roomLoc[0]; j<roomLoc[0]+roomSize[0]; j++)
                for (var k=roomLoc[1]; k<roomLoc[1]+roomSize[1]; k++)
                {
                    if (j > 0 && j < obj.mazeSize-1 && k > 0 && k < obj.mazeSize-1 && obj.maze[j][k] == 1)
                    {
                        obj.maze[j][k] = -1;
                        obj.usedSpace++;
                    }
                }
        }

        //obj.rooms = [[0,0],[1,1]];
        //obj.rooms.concat([[2,2]]);
        //console.log("yo fam: "+obj.rooms);

        // Get the number of rooms
        obj.rooms = [];
        for (var i=0; i<obj.mazeSize; i++)
            for (var j=0; j<obj.mazeSize; j++)
            {
                if (obj.maze[i][j] == -1)
                    obj.rooms.push(obj.getRoom(i,j,2+obj.rooms.length));
            }

        for (var i=0; i< obj.rooms.length; i++)
        {
            obj.rooms[i].col = randColor();
            console.log("Room "+i+": "+obj.rooms[i].length+", "+obj.rooms[i].col);
        }

        // Connect rooms
        for (var i=0; i<obj.rooms.length; i++)
        {
            var numpath = Math.ceil(obj.rooms[i].length/50.0);
            for (var j=0; j<numpath; j++)
            {
                var spot = randEl(obj.rooms[i]);
                //console.log("spot: "+spot[0]+"? "+spot[1]);
                var roomNum = obj.maze[spot[0]][spot[1]];
                //console.log(spot + ": " + roomNum);

                // Wait until we get to another room
                var n = 10;
                while ((obj.maze[spot[0]][spot[1]] < 2 || obj.maze[spot[0]][spot[1]] == roomNum) && n >= 0)
                {
                    var dir = randbt(0, 4);
                    var len = randbt(0, 10);

                    while(len > 0)
                    {
                        if (spot[0] <= 0 || spot[0] >= obj.mazeSize-1 || spot[1] <= 0 || spot[1] >= obj.mazeSize-1)
                            break;

                        if (obj.maze[spot[0]][spot[1]] == 1)
                            obj.maze[spot[0]][spot[1]] = 0;

                        if (dir == 0)
                            spot[0]--;
                        if (dir == 1)
                            spot[0]++;
                        if (dir == 2)
                            spot[1]--;
                        if (dir == 3)
                            spot[1]++;

                        len--;
                    }
                    n--;
                }
            }
        }
    },

    getRoom: function(i, j, fill)
    {
        var obj = this;

        var ret = [[i,j]];
        obj.maze[i][j] = fill;

        if (i-1 >= 0 && obj.maze[i-1][j] == -1)
            ret = ret.concat(obj.getRoom(i-1, j, fill));
        if (i+1 < obj.mazeSize && obj.maze[i+1][j] == -1)
            ret = ret.concat(obj.getRoom(i+1, j, fill));
        if (j-1 >= 0 && obj.maze[i][j-1] == -1)
            ret = ret.concat(obj.getRoom(i, j-1, fill));
        if (i-1 < obj.mazeSize && obj.maze[i][j+1] == -1)
            ret = ret.concat(obj.getRoom(i, j+1, fill));

        //console.log(i+", "+j+": "+ret);

        return ret;
    },

    isAllConnected: function()
    {
        var obj = this;

        var tmaze = [];
        for (var i=0; i<obj.mazeSize; i++)
        {
            var row = [];
            for (var j=0; j<obj.mazeSize; j++)
            {
                row.push((obj.maze[i][j] == 1 ? 1 : 0));
            }
            tmaze.push(row);
        }

        for (var i=0; i<obj.mazeSize; i++)
            for (var j=0; j<obj.mazeSize; j++)
            {
                if (obj.allconn(tmaze, i,j) == obj.usedSpace)
                    return true;
                else
                    return false;
            }
        return false;
    },
    allconn: function(maze, i, j)
    {
        var ret = 1;
        maze[i][j] = 1;

        if (i-1 >= 0 && maze[i-1][j] == 0)
            ret += allconn(maze,i-1,j);
        if (i+1 < maze.length && maze[i+1][j] == 0)
            ret += allconn(maze,i+1,j);
        if (j-1 >= 0 && maze[i][j-1] == 0)
            ret += allconn(maze,i,j-1);
        if (j+1 < maze.length && maze[i][j+1] == 0)
            ret += allconn(maze,i,j+1);

        return ret;
    }
};

function randColor() {
    return rgbToHex(Math.round(gaussian(255/2.0, 255/5.0, 50.0, 255.0)), Math.round(gaussian(255/2.0, 255/5.0, 50.0, 255.0)), Math.round(gaussian(255/2.0, 255/5.0, 50.0, 255.0)));
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
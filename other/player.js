function createPlayer(maze, x, y)
{
    var pobj = [];

    pobj.x = x;
    pobj.y = y;

    pobj.mm = maze.phys.addMover(x,y, 0.5, 0, function(col){

    });

    pobj.update = function(game)
    {
        pobj.x = pobj.mm.x;
        pobj.y = pobj.mm.y;
        //console.log("Player!");
        pobj.mm.vx = 0;
        pobj.mm.vy = 0;

        var ax = 0; var ay = 0;
        var aa = 3.0;
        var vmax = 10.0;
        
        if (game.keyDown[65])
        {
            //console.log("left");
            ax = -aa;
        }
        if (game.keyDown[68])
        {
            //console.log("right");
            ax = aa;
        }
        if (game.keyDown[87])
        {
            //console.log("up");
            ay = -aa;
        }
        if (game.keyDown[83])
        {
            //console.log("down");
            ay = aa;
        }
        if (ax != 0 && ay != 0)
        {
            ax *= Math.sqrt(aa)/aa;
            ay *= Math.sqrt(aa)/aa;
        }

        //pobj.mm.force(ax, ay);
        pobj.mm.vx = ax;
        pobj.mm.vy = ay;

        var vv = dist(0,0,pobj.mm.vx,pobj.mm.vy);
        if (vv > vmax)
        {
            pobj.mm.vx *= (vmax/vv);
            pobj.mm.vy *= (vmax/vv);
        }

        //if (Math.abspobj.mm.vx )
    };

    return pobj;
}

function dist(x1,y1, x2,y2)
{
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}
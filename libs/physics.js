function createPhysics(game)
{
    var pobj = [];

    pobj.statics = [];
    pobj.addStatic = function(x,y,w,h,f)
    {
        var ss = [];
        ss.x = x; ss.y = y; ss.w = w; ss.h = h; ss.f = f;
        pobj.statics.push(ss);
    };

    pobj.movers = [];
    pobj.addMover = function(x,y,r,f,c)
    {
        var mm = [];
        mm.i = pobj.movers.length;
        mm.x = x; mm.y = y; mm.r = r; mm.f = f; mm.c = c;
        mm.vx = 0; mm.vy = 0;
        mm.force = function(ax,ay) {mm.vx+=ax; mm.vy+=ay;};
        pobj.movers.push(mm);
        return mm;
    };

    pobj.step = function(game)
    {
        for (var i=0; i<pobj.movers.length; i++)
        {
            var oldLoc = [pobj.movers[i].x, pobj.movers[i].y];
            pobj.movers[i].x += pobj.movers[i].vx*game.delta;
            pobj.movers[i].y += pobj.movers[i].vy*game.delta;

            /*if (i==0)
            {
                console.log(oldLoc + " - " + pobj.movers[i].vx + " - " + game.delta + " - " + pobj.movers[i].x);
            }*/
            //var anloc = [pobj.movers.x+pobj.movers.vx, pobj.movers.y+pobj.movers.vy];
            for (var j=0; j<pobj.statics.length; j++)
            {
                /*if (rectCircleColliding(pobj.movers[i], pobj.statics[j]))
                {
                    console.log("Col "+i+" - "+j);
                }*/

                /*var bb = bounces(pobj.statics[j], pobj.movers[i]);
                if (bb.bounces)
                {
                    console.log("Bounced");
                    bb.vx = pobj.movers[i].vx;
                    bb.vy = pobj.movers[i].vy;

                    var normal_len = bb.x*pobj.movers[i].vx + bb.y*pobj.movers[i].vy;
                    var normal = { x: bb.x*normal_len, y: bb.y*normal_len };
                    pobj.movers[i].vx -= 2*normal.x;
                    pobj.movers[i].vy -= 2*normal.y;
		            //this.speed = { x: this.speed.x-2*normal.x, y: this.speed.y-2*normal.y };

                    bb.other = pobj.statics[j];
                    pobj.movers[i].c(bb);
                }*/
            }

            //pobj.movers.x = anloc[0];
            //pobj.movers.y = anloc[1];
        }
    };

    return pobj;
}

function rectCircleColliding(circle,rect){
    if (Math.abs(circle.x - rect.x)+Math.abs(circle.y - rect.y) > 10)
        return false;

    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}

function bounces (rect, circle)
{
    if (Math.abs(rect.x-circle.x) + Math.abs(rect.y-circle.y) > 5)
        return { bounce: false }; 

    // compute a center-to-center vector
    var half = { x: rect.w/2, y: rect.h/2 };
    var center = {
        x: circle.x - (rect.x+half.x),
        y: circle.y - (rect.y+half.y)};

    // check circle position inside the rectangle quadrant
    var side = {
        x: Math.abs (center.x) - half.x,
        y: Math.abs (center.y) - half.y};
    if (side.x >  circle.r || side.y >  circle.r) // outside
        return { bounce: false }; 
    if (side.x < -circle.r && side.y < -circle.r) // inside
        return { bounce: false }; 
    if (side.x < 0 || side.y < 0) // intersects side or corner
    {
        var dx = 0, dy = 0;
        if (Math.abs (side.x) < circle.r && side.y < 0)
        {
            dx = center.x*side.x < 0 ? -1 : 1;
        }
        else if (Math.abs (side.y) < circle.r && side.x < 0)
        {
            dy = center.y*side.y < 0 ? -1 : 1;
        }

        return { bounce: true, x:dx, y:dy };
    }
    // circle is near the corner
    bounce = side.x*side.x + side.y*side.y  < circle.r*circle.r;
    if (!bounce) return { bounce:false }
    var norm = Math.sqrt (side.x*side.x+side.y*side.y);
    var dx = center.x < 0 ? -1 : 1;
    var dy = center.y < 0 ? -1 : 1;
    return { bounce:true, x: dx*side.x/norm, y: dy*side.y/norm };   
}
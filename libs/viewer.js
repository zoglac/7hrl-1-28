function createViewer(game, vx, vy, vs)
{
    var obj = this;

    obj.viewx = vx;
    obj.viewy = vy;
    obj.viewsize = vs;

    obj.unit = 1;
    obj.vieww = obj.viewsize;
    obj.viewh = obj.viewsize;
    obj.resize = function(game)
    {
        if (game.width > game.height)
        {
            obj.viewh = obj.viewsize;
            obj.vieww = obj.viewsize*(game.width/game.height);
            obj.unit = game.height/obj.viewsize;
        }
        else
        {
            obj.vieww = obj.viewsize;
            obj.viewh = obj.viewsize*(game.height/game.width);
            obj.unit = game.width/obj.viewsize;
        }
    };
    obj.getScreenLoc = function(x,y)
    {
        var ret = [0, 0];
        ret[0] = Math.floor(obj.unit*(x-obj.viewx+(0.5*obj.vieww)));
        ret[1] = Math.floor(obj.unit*(y-obj.viewy+(0.5*obj.viewh)));

        return ret;
    };
    /*obj.isIn = function(loc, size)
    {
        if 
    };*/
    obj.fillRect = function(ctx,x,y,w,h)
    {
        var loc = obj.getScreenLoc(x,y);
        var siz = [Math.ceil(w*obj.unit),Math.ceil(h*obj.unit)];

        if (loc[0] > -siz[0] && loc[0] < obj.vieww*obj.unit && loc[1] > -siz[1] && loc[1] < obj.viewh*obj.unit)
            ctx.fillRect(loc[0], loc[1], siz[0], siz[1]);
    }

    obj.fillCirc = function(ctx,x,y,r)
    {
        var loc = obj.getScreenLoc(x,y);
        var siz = Math.ceil(r*obj.unit);

        //console.log("c: "+x+", "+y+" - "+siz);

        if (loc[0] > -siz && loc[0] < obj.vieww*obj.unit && loc[1] > -siz && loc[1] < obj.viewh*obj.unit)
        {
            ctx.beginPath();
            ctx.arc(loc[0], loc[1], siz, 0, 2*Math.PI);
            ctx.fill();
            //ctx.fillRect(loc[0], loc[1], siz, siz);
        }
    }

    return this;
}
function Game(canvas)
{
    console.log("Using the correct one!");
    /// SETUP CANVAS ///////////////////////////////////////////////
    var obj = this;
    obj.canvas = canvas;
    obj.ctx = obj.canvas.getContext("2d");
    obj.minwidth = 100;
    obj.minheight = 100;
    obj.minratio = 0.2;
    obj.maxratio = 5.0;

    obj.data = {};
    obj.clearColor = "#e2e2e2";

    /// RESIZE ////////////////////////////////////////////////
    obj.resize = function()
    {
        obj.width = window.innerWidth;
        obj.height = window.innerHeight;
    
        if (obj.width < obj.minwidth)   obj.width = obj.minwidth;
        if (obj.height < obj.minheight) obj.height = obj.minheight;
    
        if ((obj.width/obj.height) < obj.minratio) obj.height = obj.width/obj.maxratio;
        if ((obj.width/obj.height) > obj.maxratio) obj.width = obj.height*obj.maxratio;
    
        obj.domDim = Math.min(obj.width, obj.height);
        obj.canvas.width = obj.width;
        obj.canvas.height = obj.height;
    
        if (obj.currState)
            obj.currState.resize(obj);
    };
    window.addEventListener( 'resize', obj.resize, false );
    obj.resize();
    

    /// STATE MANAGEMENT ///////////////////////////////////////////
    obj.state = {};
    obj.state.states = [];
    obj.state.add = function(name, st)
    {
        obj.state.states[name] = st;
    };

    obj.currState = null;
    obj.state.start = function(start)
    {
        // See if state exists
        if (!obj.state.states[start])
        {
            console.log("State doesn't exist");
            return;
        }
        
        // Set the new current state
        var unbegun = false;
        if (obj.currState == null)
            unbegun = true;

        obj.currState = obj.state.states[start];

        // Run create function
        obj.currState.create(obj);

        if (unbegun)
            obj.anim();
    };


    /// LOADING IMAGES ////////////////////////////////////////////////////////////////////////////
    obj.images = {};
    obj.loadImage = function(src)
    {
        if (obj.images[src])
            return obj.images[src];
        
        obj.images[src] = new Image();
        obj.images[src].src = src;
        obj.images[src].loaded = false;
        console.log("Trying to load "+src);
        obj.images[src].addEventListener('load', function() {
            obj.images[src].loaded = true;
            console.log("Image " + src + ": " + obj.images[src].width + ", " + obj.images[src].height);
        }, false);

        return obj.images[src];
    };

    /// DRAWING HELP ///////////////////////////////////////////////////////////////////////////////
    obj.drawFillText = function(color, font, x,y, txt)
    {
        obj.ctx.font = font;
        obj.ctx.textAlign = "center";
        obj.ctx.fillStyle = color;
        obj.ctx.fillText(txt, x,y);
    };
    obj.drawStrokeText = function(color, font, width, x,y, txt)
    {
        obj.ctx.font = font;
        obj.ctx.textAlign = "center";
        obj.ctx.strokeStyle = color;
        obj.ctx.lineWidth = width;
        obj.ctx.strokeText(txt, x,y);

        obj.ctx.lineWidth = 1;
    };
    obj.drawBubbleText = function(incolor, outcolor, font, width, x,y, txt)
    {
        obj.ctx.shadowBlur = 7;
        obj.ctx.shadowOffsetX = 3;
        obj.ctx.shadowOffsetY = 3;
        obj.ctx.shadowColor = '#333';
        obj.drawFillText(incolor, font, x,y, txt);
        obj.ctx.shadowBlur = 0;
        obj.ctx.shadowOffsetX = 0;
        obj.ctx.shadowOffsetY = 0;
        obj.drawStrokeText(outcolor, font, width, x,y, txt);
    };

    /// INPUT //////////////////////////////////////////////////////////
    obj.mouseDown = false;
    obj.mp = false;
    obj.mousePressed = false;
    obj.mr = false;
    obj.mouseReleased = false;
    obj.mousex = 0.0;
    obj.mousey = 0.0;

    window.addEventListener( 'mousedown', function(me){
        //console.log("glurp");
        obj.mouseDown = true;
        obj.mp = true;
    }, false );
    window.addEventListener( 'mouseup', function(me){
        //console.log("shlurp");
        obj.mouseDown = false;
        obj.mr = true;
    }, false );
    window.addEventListener( 'mouseout', function(me){
        obj.mouseDown = false;
    }, false );
    window.addEventListener( 'mousemove', function(me){
        //console.log("hurp");
        obj.mousex = me.clientX;
        obj.mousey = me.clientY;
    }, false );

    obj.mouseInArea = function(x,y, w,h)
    {
        return (obj.mousex >= x && obj.mousex < x+w
             && obj.mousey >= y && obj.mousey < y+h);
    };

    window.addEventListener( 'touchstart', function(me){
        obj.mouseDown = true;
        obj.mp = true;
        obj.mousex = me.targetTouches[0].pageX;
        obj.mousey = me.targetTouches[0].pageY;
    }, false );
    window.addEventListener( 'touchend', function(me){
        obj.mouseDown = false;
        obj.mr = true;
    }, false );
    window.addEventListener( 'touchmove', function(me){
        obj.mousex = me.targetTouches[0].pageX;
        obj.mousey = me.targetTouches[0].pageY;
    }, false );

    obj.keyDown = [];
    obj.keyPressed = [];
    obj.keyReleased = [];
    obj.kp = [];
    obj.kr = [];
    for (var i=0; i<256; i++)
    {
        obj.keyDown.push(false);
        obj.keyPressed.push(false);
        obj.keyReleased.push(false);
        obj.kp.push(false);
        obj.kr.push(false);
    }
    window.addEventListener( 'keydown', function(ke){
        var kk = ke.keyCode || ke.which;
        if (!obj.keyDown[kk])
            obj.kp[kk] = true;
            
        obj.keyDown[kk] = true;
        console.log("press "+kk);
        //console.log(kk);
    }, false );
    window.addEventListener( 'keyup', function(ke){
        var kk = ke.keyCode || ke.which;
        obj.keyDown[kk] = false;
        obj.kr[kk] = true;
        console.log("up "+kk);
    }, false );

    /// STEP ///////////////////////////////////////////////////////////
    obj.delta = 0.0;
    obj.lastUpdate = 0.0;
    obj.timers = [];
    obj.anim = function()
    {
        var now = Date.now();
        obj.delta = (now - obj.lastUpdate) / 1000.0;
        if (obj.delta > 1.0) obj.delta = 1.0
        obj.lastUpdate = now;

        obj.timers.forEach(function(tt){
            if (tt.dir)
            {
                if (tt.dir == "d")
                {
                    if (tt.time > 0)
                        tt.time -= obj.delta;
                    if (tt.time < 0)
                        tt.time = 0;
                }
                else
                {
                    tt.time += obj.delta;
                }
            }
        });

        obj.mousePressed = obj.mp;
        obj.mp = false;
        obj.mouseReleased = obj.mr;
        obj.mr = false;

        for (var i=0; i<256; i++)
        {
            obj.keyPressed[i] = obj.kp[i];
            obj.kp[i] = false;
            obj.keyReleased[i] = obj.kr[i];
            obj.kr[i] = false;
        }

        if (obj.currState)
        {
            obj.currState.update(obj);
            obj.mousePressed = false;
            obj.mouseReleased = false;

            obj.ctx.fillStyle = obj.clearColor;
            obj.ctx.fillRect(0, 0, obj.width, obj.height);
            obj.currState.render(obj);
        }

        requestAnimationFrame(obj.anim);
    };

    
}

function damp(val, min, max)
{
    if (val <= min || max <= min)
        return 0;
    if (val >= max)
        return 1.0;

    var ff = (val-min)/(max-min);
    return ((0.5*Math.sin((ff-0.5)*Math.PI)+0.5) * (max-min)) + min;
}
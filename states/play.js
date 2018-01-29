var score = 0;
var roundLength = 30.0;

var playState = {

    create: function(game) {
        var obj = this;
        this.menuback = game.loadImage("assets/images/menu.png");

        this.peepim = [];
        people.forEach(function(peep){
            obj.peepim[peep] = game.loadImage(getUserPic(peep));
        });

        this.timer = {time:roundLength, dir:"d"};
        game.timers.push(this.timer);

        this.streakmax = 5.0;
        this.streaktimer = {time: 0, dir:"d"};
        game.timers.push(this.streaktimer);
        this.streaknum = 0;

        this.notmax = 2.0;
        this.nottimer = {time:0, dir:"d"};
        game.timers.push(this.nottimer);
        this.notifcation = "";
        this.notcolor = "#fff";

        score = 0;

        this.person = 0;
        this.peeps = ["Abigail", "Jared", "Kristina", "Sam"];

        this.resize(game);

        this.setRound(people, 4);
        this.streaktimer.time = 0;

        this.imLocx = game.width/2;
        this.imLocy = game.height/2;
        this.imoffx = 0;
        this.imoffy = 0;
        this.imdrag = false;
    },

    update: function(game) {
        if (this.timer.time < 0.01)
        {
            document.body.style.cursor = "default";
            game.state.start("score");
        }

        if (game.mouseInArea(this.imLocx-(this.ims/2), this.imLocy-(this.ims/2), this.ims, this.ims))
        {
            document.body.style.cursor = "pointer";

            if (game.mousePressed)
            {
                this.imdrag = true;
                this.imoffx = game.mousex-this.imLocx;
                this.imoffy = game.mousey-this.imLocy;
            }
        }
        else
        {
            document.body.style.cursor = "default";
        }

        if (game.mouseReleased && this.imdrag)
        {
            this.imdrag = false;

            var wrong = false;

            for (var i=0; i<4; i++)
            {
                if (game.mouseInArea(this.buttx[i], this.butty[i], this.buttonWidth, this.buttonHeight))
                {
                    if (i==this.person)
                    {
                        score++;
                        this.setRound(people, 4);
                        this.streaktimer.time = this.streakmax;
                        this.streaknum++;
                        gotit = false;
                        if (this.streaknum == 5)
                            this.setNotification("Streak!", "#e5e280");
                        else if (this.streaknum > 0 && this.streaknum % 5 == 0)
                            this.setNotification("On Fire!", "#e5e280");
                        else
                            this.setNotification("Correct", "#6fc647");
                        break;
                    }
                    else
                    {
                        this.setNotification("Incorrect", "#bf0000");
                        this.streaktimer.time = 0.0;
                    }
                }
            }
        }

        if (this.streaktimer.time < 0.001)
            this.streaknum = 0;

        if (this.imdrag)
        {
            this.imLocx = game.mousex-this.imoffx;
            this.imLocy = game.mousey-this.imoffy;
        }
        else if (dist(this.imLocx,this.imLocy, this.retx,this.rety) > 0.01)
        {
            var movex = this.retx - this.imLocx;
            var movey = this.rety - this.imLocy;
            var moveam = dist(0,0, movex,movey);
            var mmax = 3000.0*game.delta;
            if (moveam > mmax)
            {
                movex *= mmax/moveam;
                movey *= mmax/moveam;
            }
            this.imLocx += movex;
            this.imLocy += movey;
        }
    },
    render: function(game) {
        if (this.menuback.loaded)
            game.ctx.drawImage(this.menuback, 0,0, game.width, game.height);

        // Draw timer
        if (this.timer.time > 5.0)
            game.drawFillText("#fff", this.scsize+"px Arial", this.scx, this.scy,"Time: "+Math.ceil(this.timer.time));
        else
            game.drawFillText("#d15757", this.scsize+"px Arial", this.scx, this.scy,"Time: "+Math.ceil(this.timer.time));

        // Draw score
        game.drawFillText("#fff", this.scsize+"px Arial", this.scx, this.tiy,"Score: " + score);
        
        for (var i=0; i<4; i++)
        {
            game.ctx.strokeStyle = "#fff";
            game.ctx.lineWidth = this.buttonBorder;
            game.ctx.fillStyle = "#de77ae";
            game.ctx.fillRect(this.buttx[i], this.butty[i], this.buttonWidth, this.buttonHeight);
            game.ctx.strokeRect(this.buttx[i], this.butty[i], this.buttonWidth, this.buttonHeight);
            game.drawFillText("#fff", this.buttfont+"px Arial", this.buttx[i]+(this.buttonWidth/2), this.butty[i]+(this.buttonHeight*0.65), this.peeps[i]);    
        }

        // Streak bar
        game.ctx.fillStyle = "#ffb5b5";
        if (this.streaknum >= 5)
            game.ctx.fillStyle = "#e5e280";
        game.ctx.fillRect(this.strx, this.stry, this.strwidth, this.strheight);
        if (this.streaktimer.time > 0.01)
        {
            game.ctx.fillStyle = "#fff";
            game.ctx.fillRect(this.strx, this.stry, this.strwidth*(this.streaktimer.time/this.streakmax), this.strheight);
        }
        if (this.streaknum > 0)
            game.drawFillText("#777", this.strsize+"px Arial", this.strx+(this.strwidth/2), this.stry+(this.strheight*0.65), this.streaknum.toString());

        // Notification
        if (this.nottimer.time > 0.01)
        {
            game.ctx.globalAlpha = (this.nottimer.time >= this.notmax/2 ? 1.0 : this.nottimer.time/(this.notmax/2));
            game.drawFillText(this.notcolor, this.notsize+"px Arial", this.notx, this.noty, this.notification);
            game.ctx.globalAlpha = 1.0;
        }

        // Draw the image in the middle
        game.ctx.globalAlpha = 1.0;
        if (this.imdrag)
            game.ctx.globalAlpha = 0.6;

        game.ctx.drawImage(this.peepim[this.peeps[this.person]], this.imLocx-(this.ims/2), this.imLocy-(this.ims/2), this.ims, this.ims);



        game.ctx.globalAlpha = 1.0;
    },
    resize: function(game) {
        this.scsize = game.domDim * 0.06;
        this.scout = this.scsize * (3.0/72.0);
        this.scx = game.width/2;
        this.scy = game.domDim * 0.07;
        this.tiy = game.domDim * 0.14;

        this.ims = (game.width+game.height) * 0.1;
        this.retx = game.width/2;
        this.rety = game.height/2;


        this.buttonWidth = game.domDim*0.37;
        if (game.width/game.height < (674.0/595.0))
            this.buttonWidth = game.width*(595.0/674.0)*0.37;
        this.buttonHeight = this.buttonWidth*0.41;
        this.buttonBorder = this.buttonWidth*0.01;
        this.buttfont = this.buttonWidth * 0.22;
        this.buout = this.buttfont * (3.0/72.0);
        this.buttonMargin = this.buttonWidth * 0.08;

        this.buttx = [this.buttonMargin, game.width-this.buttonMargin-this.buttonWidth, game.width-this.buttonMargin-this.buttonWidth, this.buttonMargin];
        this.butty = [this.buttonMargin, this.buttonMargin, game.height-this.buttonMargin-this.buttonHeight, game.height-this.buttonMargin-this.buttonHeight];
    
        this.strwidth = game.domDim*0.2;
        this.strheight = game.domDim*0.08;
        this.strx = (game.width-this.strwidth)/2;
        this.stry = (game.domDim*0.21)-(this.strheight/2);
        this.strsize = game.domDim*0.03;

        this.notsize = game.domDim * 0.09;
        this.notx = game.width/2;
        this.noty = game.height*0.9;
    },

    setRound: function(peeps, num){
        this.peeps = [];
    
        for (var i=0; i<num; i++)
        {
            var it = getRandEl(peeps);
    
            while (this.peeps.includes(it))
                it = getRandEl(peeps);
    
            this.peeps.push(it);
        }
    
        this.person = getRand(0, this.peeps.length-1);
    },

    setNotification(txt, color)
    {
        this.nottimer.time = this.notmax;
        this.notcolor = color;
        this.notification = txt;
    },

    scoreIncrease: function(str)
    {
        if (str == 0)
            return 1;

        return Math.ceil(str/5);
    }
};

function dist(x1,y1, x2,y2)
{
    return Math.sqrt( ((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)) );
}

function getRand(a, b)
{
    return a+Math.floor(Math.random()*(b-a+1));
}
function getRandEl(arr)
{
    if (arr.length > 0)
        return arr[Math.floor(Math.random()*arr.length)];
    else
        return null;
}
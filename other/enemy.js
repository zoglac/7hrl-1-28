function createEnemy(phys, x, y, type)
{
    var eobj = [];

    eobj.x = x;
    eobj.y = y;

    eobj.mm = phys.addMover(x,y, 0.5, 0, function(col){/*console.log("bounce");*/});
    eobj.mm.force(Math.random()-0.5, Math.random()-0.5);

    eobj.update = function()
    {
        eobj.x = eobj.mm.x;
        eobj.y = eobj.mm.y;
    };

    return eobj;
}
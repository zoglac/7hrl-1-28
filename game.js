function init()
{
    //console.log("hiss");
    thegame = new Game(document.getElementById("game"));

    thegame.state.add('maze', mazeState);

    thegame.state.start('maze');
}
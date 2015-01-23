//================================
//Config
//================================
Router.configure(
    {
        layoutTemplate:'layout',
        loadingTemplate:'loading'
        
    }
);

//================================
//Home
//================================
Router.route(
    '/',
    {
        name:'main'
    }
);

//================================
//Lobby
//================================
Router.route(
    '/lobby',
    {
        name:'lobby'
    }
);
//================================
//Game
//================================
Router.route(
    '/game/:gameId',
    {
        name:'game',
        data: function(){
            return {gameId:this.params.gameId}
        }
    }
);


//================================
//Config
//================================
Router.configure(
    {
        layoutTemplate:'layout',
        loadingTemplate:'loading',
        waitOn: function(){
            return [
               Meteor.subscribe('matches')
            ]
        }
        
    }
);


//================================
//Lobby
//================================
Router.route(
    '/',
    {
        name:'lobby',
        data: function(){
            return Matches.find({
                'status': 'waiting'
            });
        }
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
            return Matches.findOne(this.params.gameId);
        }
    }
);


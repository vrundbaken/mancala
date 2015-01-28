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


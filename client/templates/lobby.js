Template.lobby.events({
    'click #new-game': function( event, template) {
        //prevent default click behavior
        event.preventDefault();
        
        //TODO prevent user from creating more than 1 game with status waiting
        
        //creates a new game with current user as challenger
        var game = new Mancala.Game();
        console.log(game._id);
        Router.go('/game/' + game._id);
    },
    'click .join-game': function (event, template) {
        //prevent default click behavior
        event.preventDefault();
        var gameId = $(event.currentTarget).attr('data-game-id');
        var game = new Mancala.Game( gameId );
        
        //prevents user from starting game with self
        if (Meteor.userId() === game.challenger) {
            //if user is challenger go to existing game
            Router.go('/game/' + game._id)
        } else {
            game.opponent = Meteor.userId();
            game.status = 'ready';
            game.save();
            Router.go('/game/' + game._id)
        }
        
    }
});

Template.lobby.helpers({  
  games: function() {
      console.log('fetched matches')
      return Matches.find();
      
  }
});
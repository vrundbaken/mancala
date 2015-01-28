Template.lobby.events({
    'click #new-game': function( event, template) {
        //prevent default click behavior
        event.preventDefault();
        
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
        game.opponent = Meteor.userId();
        game.status = 'ready';
        game.save();
        Router.go('/game/' + game._id)
    }
});

Template.lobby.helpers({  
  games: function() {
      console.log('fetched matches')
      return Matches.find();
      
  }
});
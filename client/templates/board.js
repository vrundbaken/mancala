Template.board.helpers({
    pitA1: function(){
        return this.boardData[0];
    },
    pitA2: function(){
        return this.boardData[1];
    },
    pitA3: function(){
        return this.boardData[2];
    },
    pitA4: function(){
        return this.boardData[3];
    },
    pitA5: function(){
        return this.boardData[4];
    },
    pitA6: function(){
        return this.boardData[5];
    },
    pitB1: function(){
        return this.boardData[7];
    },
    pitB2: function(){
        return this.boardData[8];
    },
    pitB3: function(){
        return this.boardData[9];
    },
    pitB4: function(){
        return this.boardData[10];
    },
    pitB5: function(){
        return this.boardData[11];
    },
    pitB6: function(){
        return this.boardData[12];
    },
    bankA: function(){
        return this.boardData[6];
    },
    bankB: function(){
        return this.boardData[13];
    }
});

Template.board.events({
    'click .pit': function( event, template ){
        // Prevent default click behavior
        event.preventDefault();
        //Populates object with data from DB
        var game = new Mancala.Game(this._id);
        //Get index of clicked pit and converts to int
        var pit = Number($(event.currentTarget).attr('data-pit-id'));
        //Moves stones at selected pit if valid
        game.move(pit);
    }
});
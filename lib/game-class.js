Mancala.Game = function ( gameId ) {
    //if game id is given then find collection and load data into object
    if( gameId ) {
        var game = Matches.findOne( gameId );
        this._id = game._id;
        this.boardData = game.boardData;
        this.challenger = game.challenger;
        this.opponent = game.opponent;
        this.status = game.status;
        this.turn = game.turn;
    }else{
        this.boardData = [4,4,4,4,4,4,0,4,4,4,4,4,4,0];
        this.challenger = 'challenger'; //TODO set to userid that started the match
        this.opponent = 'opponent'; //TODO set this to opponent userId 
        this.status = 'created';// possible created,waiting,playing,finished
        this.turn = this.challenger;//TODO change this to be random
    }
    
        //game status
        //who's turn
        //start time
        //end time
    this.save();
}

Mancala.Game.prototype.move = function ( index ) {
    if(this.isValidMove( index ) !== true){
        return 'invalid move';
    }
    // Removes stones from clicked pit
    var numStones = this.boardData[index];
    this.boardData[index] = 0
    
    //adds one stone to each next pit counter clockwise till out
    for(var i = numStones; i > 0; i--){
        
        //13 is the end of the board, start over at index 0
        if(index === 13) {
            index = 0;
        //increment index by 1 to get the next pit    
        }else {
            index += 1;
        }

        //this skips other players store
        if (index === 13 && this.turn ===this.challenger) {
            index = 0; //skips opponent store
        }else if(index === 6 && this.turn ===this.opponent){ 
            index++; //skips opponent score
        }

        //if placing the last stone check if its being placed in empty pit on player side or in players store
        if (i === 1) {
            
            //STORE
            //Checks if last stone landed in current player store
            if(this.turn ===this.challenger && index ===6 || this.turn === this.opponent && index === 13) {
                this.boardData[index] += 1
                this.status = "Move Again"
             
            //EMPTY PIT
            //Checks last stone landed in empty pit on current player side    
            }else if(this.turn === this.challenger && index >= 0 && index <= 5 && this.boardData[index] === 0) {

                //determined the index of the pit perpendicular to empty pit
                var perpendicularIndex = 12 - index;

                //adds perpendicular pit stones to player store and + 1 for the stone that landed in the empty pit
                this.boardData[6] += this.boardData[perpendicularIndex] + 1;

                //removes stones from perpendicular pit
                this.boardData[perpendicularIndex] = 0;

                //sets turn to next player
                this.turn = this.opponent
                this.status = "Make a move"

            //EMPTY PIT   
            //Checks last stone landed in empty pit on current player side
            }else if (this.turn === this.opponent && index >= 7 && index <= 12 && this.boardData[index] === 0 ){

                //determined the index of the pit perpendicular to empty pit
                var perpendicularIndex = 12 - index;

                //adds perpendicular pit stones to player store and + 1 for the stone that landed in the empty pit
                this.boardData[13] += this.boardData[perpendicularIndex] + 1;

                //removes stones from perpendicular pit
                this.boardData[perpendicularIndex] = 0;

                //sets turn to next player
                this.turn = this.challenger
                this.status = "Make a move"
                
            //NORMAL  
            //Last stone didnt land anywhere special, loop will not repeat and it's next players turn
            }else{
                this.boardData[index] += 1;
                if (this.turn === this.opponent){
                    this.turn = this.challenger;
                }else {
                    this.turn = this.opponent;
                }
                this.status = "Make a move"
            } 
        //More stones to drop
        }else{
            // if not the last stone then just add to the next pocket and continues on the loop
            this.boardData[index] += 1
        }
    }
    this.save();
}

Mancala.Game.prototype.save = function(){
    var gameClean;
    if( this._id ) {

        //only allows relevant data to be inserted
        gameClean = _.pick(
            this,
            [
                'boardData',
                'turn',
                'status',
                'challenger',
                'opponent'
            ]
        );
        //updates db
        Matches.update(
            this._id,
            {
                $set: gameClean
            }
        );

    }else{

        //only allows relevant data to be inserted
         gameClean = _.pick(
            this,
            [
                'boardData',
                'turn',
                'status',
                'challenger',
                'opponent'
            ]
        );

        this._id = Matches.insert( gameClean, function( error ){
            if( error ){
                throw error;
            }
        } );

    }
}

Mancala.Game.prototype.isValidMove = function( index ) {
    //check if index an integer
    if( typeof index !== 'number' ){
        console.log('index must be an integer');
        return false;
       
    //check if turn is challenger and index is 0-5 and number of stones greater than 0
    }else if ( this.turn === this.challenger && index >= 0 && index <= 5 && this.boardData[index] > 0 ) {
        console.log('challenger made a valid move')
        return true;
        
    //check if turn is challenger and index is 0-5 and number of stones greater than 0
    }else if ( this.turn === this.opponent && index >= 7 && index <= 12 && this.boardData[index] > 0 ) {
        console.log('opponent made a valid move')
        return true;
    
    //pit is not one of the players
    } else {
        this.status = "you must choose a pit on your side with at least 1 stone, try again"
        return false;
    }
}

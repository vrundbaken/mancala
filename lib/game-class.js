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
        this.startTime = game.startTime;
    }else{
        this.boardData = [4,4,4,4,4,4,0,4,4,4,4,4,4,0];
        this.challenger = Meteor.userId(); 
        this.opponent = 'opponent'; //TODO set this to opponent userId 
        this.status = 'waiting'; 
        this.turn = this.challenger;//TODO change this to be random
        //saves data to db
        this.save();
    } 
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
            if(this.isPlayerStore( index )) {
                this.boardData[index] += 1
                this.status = "Move Again"
             
            //EMPTY PIT
            //Checks last stone landed in empty pit on current player side and perpendicular pit has stones   
            }else if(this.isCapture( index ) ) {

                this.capture( index );
                
            //NORMAL  
            //Last stone didnt land anywhere special, loop will not repeat and it's next players turn
            }else{
                //places the last stone in next pit in line
                this.boardData[index] += 1;
                //sets turn to next player
                this.nextTurn();
            } 
        //More stones to drop
        }else{
            // if not the last stone then just add to the next pocket and continues on the loop
            this.boardData[index] += 1
        }
    }
    //Checks if game is over
    this.gameOver();
    
    //Move is over update db
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
//Checks to make sure move is valid pit on players side with at least 1 stone
Mancala.Game.prototype.isValidMove = function( index ) {
    //waits for an opponent before begin playing
    if (this.status === 'waiting'){
        console.log('waiting for an opponent');
        return false;
        
    //If game is over no moves are allowed
    }else if ( this.status === 'Game over') {
        console.log('Game is over');
        return false;
    }
    //user can only play on their turn
    if (this.turn !== Meteor.userId()) {
        console.log('not your turn!');
        return false;
    //check if index an integer    
    }else if( typeof index !== 'number' ){
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

//checks if index is current players store
Mancala.Game.prototype.isPlayerStore = function( index ) {
    if(this.turn ===this.challenger && index === 6 || this.turn === this.opponent && index === 13) {
        return true;
    }else {
        return false;
    }
}

//checks if index is empty and is on current players side and perpdicular pit has stones
Mancala.Game.prototype.isCapture = function( index ) {
    if( this.turn === this.challenger && index >= 0 && index <= 5 && this.boardData[index] === 0 && this.boardData[12-index] > 0 ) {
        return true;
    }else if ( this.turn === this.opponent && index >= 7 && index <= 12 && this.boardData[index] === 0 && this.boardData[12-index] > 0 ) {
        return true;
    } else {
        return false;
    }
    
}

//Captures perpendicular stones and moves them to player store
Mancala.Game.prototype.capture = function ( index ) {
    //determined the index of the pit perpendicular to empty pit
    var perpendicularIndex = 12 - index;
    
    if (this.turn === this.challenger) {
         //adds perpendicular pit stones to player store and + 1 for the stone that would have landed in the empty pit
        this.boardData[6] += this.boardData[perpendicularIndex] + 1;
        //removes stones from perpendicular pit
        this.boardData[perpendicularIndex] = 0;
     
    } else if ( this.turn === this.opponent ) {
        //adds perpendicular pit stones to player store and + 1 for the stone that would have landed in the empty pit
        this.boardData[13] += this.boardData[perpendicularIndex] + 1;
        //removes stones from perpendicular pit
        this.boardData[perpendicularIndex] = 0;
    }
    this.nextTurn();
}

//Sets the turn to the other player
Mancala.Game.prototype.nextTurn = function () {
    
    //if active player is opponent set turn to challenger
    if (this.turn === this.opponent){
        this.turn = this.challenger;
        
    //if active player is challenger set turn to opponent
    }else {
        this.turn = this.opponent;
    }
    //Sets status to make a move
    this.status = 'make a move'
}

//Checks if all the pits in one side and adds all remaing stones to player store
Mancala.Game.prototype.gameOver = function () {
    console.log('checking if game is over')
    var challengerPits = 0;
    var opponentPits = 0;
    
    for(var i = 0; i < 6; i++) {
        challengerPits += this.boardData[i];
        console.log( challengerPits );
    }
    
    for( var i = 7; i < 13; i++) {
        opponentPits += this.boardData[i];
        console.log( opponentPits); 
    }
    //If true game is over 
    if(challengerPits === 0 || opponentPits === 0) {
        //move any remaining stones to appropriate store
        this.boardData[6] += challengerPits;
        this.boardData[13] += opponentPits;
        
        //Sets all pits that were moved to store to 0
        for(var i = 0; i < 6; i++) {
        this.boardData[i] = 0;
        }
        
        //Sets all pits that were moved to store to 0
        for(var i = 7; i < 13; i++) {
        this.boardData[i] = 0;
        }
        
        this.status = 'Game over'
        return true;
    }else {
        return false;
    }
}

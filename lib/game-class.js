Mancala.Game = function ( gameId ) {
    //if game id is given then find collection and load data into object
    //else create new game 
    //properties
    this.board = [4,4,4,4,4,4,0,4,4,4,4,4,4,0];
    this.challenger = Meteor.userId();
    this.status = 'created';// possible created,waiting,playing,finished
    this.turn = 'challenger';//TODO change this to be random
    
        //Opponent id
        //game status
        //who's turn
        //start time
        //end time
}

Mancala.Game.prototype.move = function ( index ) {
    
    // Removes stones from clicked pit
    var numStones = this.board[index];
    this.board[index] = 0
    
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
        if (index === 13 && this.turn ==='challenger') {
            index = 0; //skips opponent store
        }else if(index === 6 && this.turn ==='opponent'){ 
            index++; //skips opponent score
        }

        //if placing the last stone check if its being placed in empty pit on player side or in players store
        if (i === 1) {
            
            //STORE
            //Checks if last stone landed in current player store
            if(this.turn ==='challenger' && index ===6 || this.turn === 'opponent' && index === 13) {
                this.board[index] += 1
                return alert("move again");
             
            //EMPTY PIT
            //Checks last stone landed in empty pit on current player side    
            }else if(this.turn === 'challenger' && index >= 0 && index <= 5 && this.board[index] === 0) {

                //determined the index of the pit perpendicular to empty pit
                var perpendicularIndex = 12 - index;

                //adds perpendicular pit stones to player store and + 1 for the stone that landed in the empty pit
                this.board[6] += this.board[perpendicularIndex] + 1;

                //removes stones from perpendicular pit
                this.board[perpendicularIndex] = 0;

                //sets turn to next player
                this.turn = 'opponent'

            //EMPTY PIT   
            //Checks last stone landed in empty pit on current player side
            }else if (this.turn === 'opponent' && index >= 7 && index <= 12 && this.board[index] === 0 ){

                //determined the index of the pit perpendicular to empty pit
                var perpendicularIndex = 12 - index;

                //adds perpendicular pit stones to player store and + 1 for the stone that landed in the empty pit
                this.board[13] += this.board[perpendicularIndex] + 1;

                //removes stones from perpendicular pit
                this.board[perpendicularIndex] = 0;

                //sets turn to next player
                this.turn = 'challenger'
                
            //NORMAL  
            //Last stone didnt land anywhere special, loop will not repeat and it's next players turn
            }else{
                this.board[index] += 1;
                if (this.turn === 'opponent'){
                    this.turn = 'challenger';
                }else {
                    this.turn = 'opponent';
                }
            } 
        //More stones to drop
        }else{
            // if not the last stone then just add to the next pocket and continues on the loop
            this.board[index] += 1
        }
    }
}

//moves turn to next player

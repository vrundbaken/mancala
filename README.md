Meteor based Mancala game
============================


Mancala is a simple  2 player board game.

###Rules

The board is made up of 12 pits and 2 banks. Each players has 6 pits and 1 bank. A random player begins the same by selecting any of their 6 pits. Once selected one stone is placed in each pit counter clockwise from the selected pit. If the last stone lands in the players bank the player moves again. If the last stone lands in an empty pit on the players side he player takes that stone and all the stones in the other players pit that is perpendicular to the empty pit. The player does not deposit a stone in the other players bank, it is skipped. The game continues until one player has no more stones in their pits. Any remaining stones on the other players side are deposited into that players bank and the player with the most stones in the bank wins.

#### Demos

TBA

#### Game class

#####Properties:

* _id - game id
* boardData - array containing stone quanties and location
* challenger - user id of challenger
* opponent - user id of opponent
* status - current status of the game
* turn - current players turn

#####Methods:

* `Game( gameId)` - Class constructor. If gameId is given as a parameter the method finds the documents in the database and populated the object. If no id is given a new object with default starting data is created.
* `Game.move( index )` - accepts an index from 0-12 excluding 6. Indexs 0-5 represent pits A1-A6 and indexes 7-12 correspond to B1-B6. When the method is called 1 stone is placed in each following pits counter clockwise until all stones from the index have been placed and adhering to the mancala rules.
* `Game.save()` - When called all object data is saved into the meteor collection. If an _id does not exist a new document is created.
* `Game.isValidMove` - Checks to see if index is an int and is one of the current players pits. Also checks to see if number of stones at index if greater than 0. Returns true or false and updates status if player chose an invalid pit.



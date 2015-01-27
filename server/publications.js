Meteor.publish('matches', function(){
   return Matches.find(); 
});
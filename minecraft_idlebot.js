// OSX:
// - have nodejs (default works on OSX)
// - npm install mineflayer
// - edit this script, set server, change port if not default
// - username/pass are minecraft login email address + password
//
// set moveinterval to number of seconds between movements. This is also movement duration.
//
// - Log in using normal client, empty inventory (optional), put food in first inventory slot
// - Go to a safe area (inside, well lighted)
// - Log out of normal minecraft
// - Start this script and wait (preferably use normal IP, running remove often doesn't work):
// node minecraft_idlebot.js


var mineflayer = require('mineflayer');
var bot = mineflayer.createBot({
  host: "libercraft.net", // optional
  port: 25565,       // optional
  username: "whatever@whatever.org",
  password: "1l0v3my1r0nf@rm",
});

var moveinterval = 2; // 2 second movement interval
var lasttime = -1;
var moving = 0;
var actions = [ 'forward', 'back', 'left', 'right', 'jump']
var lastaction;

bot.on('chat', function(username, message) {
  if (username === bot.username) return;
  console.log(message);
});

bot.on('health',function() {
    if(bot.food < 15) {
        bot.activateItem();
        console.log("Ate something");
    }
});

bot.on('time', function() {
    if (lasttime<0) {
        lasttime = bot.time.age;
        console.log("Age set to " + lasttime)
    } else {
        var interval = moveinterval*20;
        if (bot.time.age - lasttime > interval) {
            if (moving == 1) {
                bot.setControlState(lastaction,false);
                console.log("Stopped moving");
                lasttime = bot.time.age;
            } else {
                lastaction = actions[Math.floor(Math.random() * actions.length)];
                bot.setControlState(lastaction,true);
                console.log("Started moving " + lastaction);
                lasttime = bot.time.age;
            }
        }
    }
})

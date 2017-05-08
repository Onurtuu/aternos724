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

var host = "libercraft.net";
var port = 25565;
var username = "bla@example.com"
var password = "1r0nf@rmp@rty"
var moveinterval = 2; // 2 second movement interval
var maxrandom = 5; // 0-5 seconds added to movement interval (randomly)

// code start
var bot = mineflayer.createBot({
  host: host,
  port: port,       // optional
  username: username,
  password: password
});

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
        var randomadd = Math.random() * maxrandom * 20;
        var interval = moveinterval*20 + randomadd;
        if (bot.time.age - lasttime > interval) {
            if (moving == 1) {
                bot.setControlState(lastaction,false);
                console.log("Stopped moving after " + interval + " seconds");
                lasttime = bot.time.age;
            } else {
                lastaction = actions[Math.floor(Math.random() * actions.length)];
                bot.setControlState(lastaction,true);
                console.log("Started moving " + lastaction +" after " + interval + "seconds");
                lasttime = bot.time.age;
            }
        }
    }
})
bot.on('end', function () {
    console.log("Disconnected. Waiting 10 seconds")
    sleep(10)
    lasttime = -1;
    moving = 0;
    bot = mineflayer.createBot({
        host: host,
        port: port,       // optional
        username: username,
        password: password
    });
    console.log("reconnected.")
})
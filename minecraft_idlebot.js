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
var connected = 0;
var actions = [ 'forward', 'back', 'left', 'right']
var lastaction;
var pi = 3.14159;

function getRandomArbitrary(min, max) {
       return Math.random() * (max - min) + min;

}

var sleep = require('sleep');

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
    if (connected <1) {
        return;
    }
    if (lasttime<0) {
        lasttime = bot.time.age;
        console.log("Age set to " + lasttime)
    } else {
        var randomadd = Math.random() * maxrandom * 20;
        var interval = moveinterval*20 + randomadd;
        if (bot.time.age - lasttime > interval) {
            if (moving == 1) {
                bot.setControlState(lastaction,false);
                moving = 0;
                console.log("Stopped moving after " + (interval/20) + " seconds");
                lasttime = bot.time.age;
            } else {
                var yaw = Math.random()*pi - (0.5*pi);
                var pitch = Math.random()*pi - (0.5*pi);
                bot.look(yaw,pitch,false);
                console.log("Changed looking direction to yaw " + yaw + " and pitch " + pitch);

                lastaction = actions[Math.floor(Math.random() * actions.length)];
                bot.setControlState(lastaction,true);
                moving = 1;
                console.log("Started moving " + lastaction +" after " + (interval/20) + "seconds");
                lasttime = bot.time.age;
                bot.activateItem();
            }
        }
    }
});

bot.on('spawn',function() {
    connected=1;
});

bot.on('end', function () {
    console.log("Disconnected. Waiting 10 seconds")
    bot.quit();
    sleep.sleep(10);
    lasttime = -1;
    moving = 0;
    connected=0;
    bot = mineflayer.createBot({
        host: host,
        port: port,       // optional
        username: username,
        password: password
    });
    console.log("reconnected.")
});
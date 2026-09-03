const mineflayer = require('mineflayer');

// Configuration: Change these to match your server
const config = {
    host: 'YOUR_SERVER_IP',      // e.g., 'my-server.aternos.me' or 'localhost'
    port: 25565,                 // Default Minecraft port is 25565
    username: 'AFK_Bot',         // The bot's in-game name
    version: false               // False lets the bot auto-detect the server version
};

let bot;

function createBot() {
    console.log(`[Bot] Connecting to ${config.host}:${config.port}...`);
    
    bot = mineflayer.createBot(config);

    // Triggered when the bot successfully logs into the server
    bot.on('spawn', () => {
        console.log('[Bot] Successfully joined the server!');
        bot.chat('Hello! I am an anti-AFK bot.');
        
        // Start the anti-AFK movement loop
        startAntiAFK();
    });

    // Handle chat messages (Optional: responds to player commands)
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        if (message === '!status') {
            bot.chat('I am online and keeping the chunk loaded!');
        }
    });

    // Auto-reconnect feature if the bot gets kicked or server restarts
    bot.on('end', (reason) => {
        console.log(`[Bot] Disconnected: ${reason}. Reconnecting in 10 seconds...`);
        setTimeout(createBot, 10000);
    });

    // Error handling to prevent the script from crashing
    bot.on('error', (err) => {
        console.error('[Bot] Error encountered:', err);
    });
}

// Anti-AFK Anti-Kick Loop
function startAntiAFK() {
    setInterval(() => {
        if (!bot || !bot.entity) return;

        // Randomly choose a small action to trick the server's idle detector
        const action = Math.random();

        if (action < 0.33) {
            // Jump
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        } else if (action < 0.66) {
            // Sneak
            bot.setControlState('sneak', true);
            setTimeout(() => bot.setControlState('sneak', false), 800);
        } else {
            // Look around slightly
            const yaw = bot.entity.yaw + (Math.random() - 0.5);
            const pitch = bot.entity.pitch + (Math.random() - 0.5);
            bot.look(yaw, pitch);
        }
    }, 20000); // Runs every 20 seconds
}

// Start the bot
createBot();


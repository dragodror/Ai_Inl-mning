const schedule = require('node-schedule');
const fs = require('fs');

// Function to perform the booked operation
function bookedOperation() {
    const timestamp = new Date().toISOString();
    fs.appendFile('log.txt', `Booked operation executed at ${timestamp}\n`, (err) => {
        if (err) throw err;
        console.log(`Booked operation executed at ${timestamp}`);
    });
}

// Schedule the booked operation to run every minute
const job = schedule.scheduleJob('* * * * *', bookedOperation);

console.log('Scheduled booked operation to run every minute.');
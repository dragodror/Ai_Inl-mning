//Prompt 1
const schedule = require('node-schedule');
const fs = require('fs');

// Function to perform the booked operation, promt 1, 
function bookedOperation() {
    const timestamp = new Date().toISOString();
    const filename = `log_${timestamp.replace(/[:.]/g, '-')}.txt`; // Replace colons and dots to make it a valid filename
    const content = `Booked operation executed at ${timestamp}\n`;

    fs.writeFile(filename, content, (err) => {
        if (err) throw err;
        console.log(`Booked operation executed and logged in ${filename}`);
    });
}

// Schedule the booked operation to run every minute
const job = schedule.scheduleJob('*/3 * * * * *', bookedOperation);

console.log('Scheduled booked operation to run every 15 seconds.');
//--------------------------------------------------------------------------------------------

//My Code
function stop() {

    job.cancel();
    console.log('Scheduled booked operation stopped.');
}

// Stop the booked operation after 5 minutes
setTimeout(stop, 300000);
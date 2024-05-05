// ==UserScript==
// @name         Live RPH
// @namespace    http://tampermonkey.net/
// @version      1
// @description Calculate your RPH in toolbelt on a day to day basis rather than month to month.
// @author       Tyler Kimbell
// @match        https://www.bctoolbelt.com/users/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487882/Real%20Time%20RPH%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/487882/Real%20Time%20RPH%20Calculator.meta.js
// ==/UserScript==
// empty objects for data storage:
let content = [];
let todayData = [];
let pastData = [];
let lastShiftData = [];
let lastShiftDataSorted = [];
//'start = ' section of request url
const currentDate = new Date();
const startTimestamp = getMidnightTimestamp(currentDate);
//'end = ' section of request url
const nextDay = new Date(currentDate);
nextDay.setDate(currentDate.getDate() + 1);
const endTimestamp = getMidnightTimestamp(nextDay) - 1;
//const requestUrl = `https://www.bctoolbelt.com/users/2714/timeline.json?start=${startTimestamp}&end=${endTimestamp}.999&interval=undefined`;
//Uncomment and replace with specific request url for a specific date. Be sure to comment out previous line if doing this.
//const requestUrl = 'https://www.bctoolbelt.com/users/{id}/timeline.json?start=1704780000&end=1704866399.999&interval=undefined';

async function fetchData(url, location) {
    const response = await fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then((data) => {
		if(location == 'now'){
			todayData = data.data;
		} else {
			pastData = data.data;
		}
	}).catch((error) => {
        console.error('Error fetching data:', error.message);
    });
}

async function fetchNow() {
	const startTimestamp = getMidnightTimestamp(currentDate);
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1); // Get the next day
    const endTimestamp = getMidnightTimestamp(nextDay) - 1;
    const endpointUrl = `https://www.bctoolbelt.com/users/${user.id}/timeline.json?start=${startTimestamp}&end=${endTimestamp}.999&interval=undefined`;

	await fetchData(endpointUrl, 'now').then(() => {
		// Data for timestamp
		const nowTimestamp = new Date();
    	const nowDate = nowTimestamp.toLocaleDateString();
    	const nowTime = nowTimestamp.toLocaleTimeString();
        // Filter elements with name: 'Chat'
        const chatElements = todayData.filter((element) => element.name === 'Chat');
        // Filter elements with name: 'On Call'
        const onCallElements = todayData.filter((element) => element.name === 'On Call');
        // Filter elements with name: 'Not Ready - Meeting'
        const notReadyMeetingElements = todayData.filter((element) => element.name === 'Not Ready - Meeting');
        // Filter elements with name: 'Not Ready - Break'
        const notReadyBreakElements = todayData.filter((element) => element.name === 'Not Ready - Break');
        // Filter elements with name: 'Not Ready - Away'
        const notReadyAwayElements = todayData.filter((element) => element.name === 'Not Ready - Away');
        // Filter elements with name: 'Not Ready - Training'
        const notReadyTrainingElements = todayData.filter((element) => element.name === 'Not Ready - Training');
        // Filter elements with name: 'Not Ready - Project'
        const notReadyProjectElements = todayData.filter((element) => element.name === 'Not Ready - Project');
        // Filter elements with name: 'Not Ready - Outbound'
        const notReadyOutboundElements = todayData.filter((element) => element.name === 'Not Ready - Outbound');
        // Filter elements with name: 'Not Ready - Chat'
        const notReadyChatElements = todayData.filter((element) => element.name === 'Not Ready - Chat');
        // Filter elements with name: 'Ready'
        const readyElements = todayData.filter((element) => element.name === 'Ready');
        // Filter elements with name: 'Ringing'
        const ringingElements = todayData.filter((element) => element.name === 'Ringing');
        // Filter elements with name: 'After Call Work'
        const afterCallWorkElements = todayData.filter((element) => element.name === 'After Call Work');
        // Filter elements with name: 'Case Reply'
        const caseReplyElements = todayData.filter((element) => element.name === 'Case Reply');
        // Calculate total duration for 'Chat' elements
        let totalDurationInSecondsChat = calculateTotalDuration(chatElements);
        // Calculate total duration for 'On Call' elements
        let totalDurationInSecondsOnCall = calculateTotalDuration(onCallElements);
        // Calculate total duration for 'Not Ready - Meeting' elements
        let totalDurationInSecondsNotReadyMeeting = calculateTotalDuration(notReadyMeetingElements);
        // Calculate total duration for 'Not Ready - Break' elements
        let totalDurationInSecondsNotReadyBreak = calculateTotalDuration(notReadyBreakElements);
        // Calculate total duration for 'Not Ready - Away' elements
        let totalDurationInSecondsNotReadyAway = calculateTotalDuration(notReadyAwayElements);
        // Calculate total duration for 'Not Ready - Training' elements
        let totalDurationInSecondsNotReadyTraining = calculateTotalDuration(notReadyTrainingElements);
        // Calculate total duration for 'Not Ready - Project' elements
        let totalDurationInSecondsNotReadyProject = calculateTotalDuration(notReadyProjectElements);
        // Calculate total duration for 'Not Ready - Outbound' elements
        let totalDurationInSecondsNotReadyOutbound = calculateTotalDuration(notReadyOutboundElements);
        // Calculate total duration for 'Not Ready - Chat' elements
        let totalDurationInSecondsNotReadyChat = calculateTotalDuration(notReadyChatElements);
        // Calculate total duration for 'Ready' elements
        let totalDurationInSecondsReady = calculateTotalDuration(readyElements);
        // Calculate total duration for 'Ringing' elements
        let totalDurationInSecondsRinging = calculateTotalDuration(ringingElements);
        // Calculate total duration for 'After Call Work' elements
        let totalDurationInSecondsAfterCallWork = calculateTotalDuration(afterCallWorkElements);
        // Calculate the combined total active duration for all elements except 'Case Reply'
        let totalTimeNotCountedInSeconds =
            totalDurationInSecondsOnCall +
            totalDurationInSecondsChat +
            totalDurationInSecondsNotReadyMeeting +
            totalDurationInSecondsNotReadyBreak +
            totalDurationInSecondsNotReadyAway +
            totalDurationInSecondsNotReadyTraining +
            totalDurationInSecondsNotReadyProject +
            totalDurationInSecondsNotReadyOutbound +
            totalDurationInSecondsRinging +
            totalDurationInSecondsAfterCallWork;
        // Calculate the total time logged in by adding the duration of every element in the data array
        let totalTimeLoggedInInSeconds =
            totalDurationInSecondsOnCall +
            totalDurationInSecondsNotReadyMeeting +
            totalDurationInSecondsNotReadyBreak +
            totalDurationInSecondsNotReadyAway +
            totalDurationInSecondsNotReadyTraining +
            totalDurationInSecondsNotReadyProject +
            totalDurationInSecondsNotReadyOutbound +
            totalDurationInSecondsNotReadyChat +
            totalDurationInSecondsReady +
            totalDurationInSecondsRinging +
            totalDurationInSecondsAfterCallWork;
        // Calculate the remaining time for RPH
        const remainingRPHInSeconds = totalTimeLoggedInInSeconds - totalTimeNotCountedInSeconds;
        //Adjusted by %10
        const remainingRPHAdjustTen = Math.round(remainingRPHInSeconds - remainingRPHInSeconds*.1);
        const remainingRPHInHours = remainingRPHAdjustTen / 3600;
        // Calculate RPH
        const rph = caseReplyElements.length / remainingRPHInHours;

        // Map data to content object
        content[0] = {"name": "timestamp", "value": `${nowDate}     |     ${nowTime}`};
        content[1] = {"name": "timeLogged", "value": `Total Time Logged in: ${formatTime(totalTimeLoggedInInSeconds)}`};
        content[2] = {"name": "ready", "value": `Time in Ready: ${formatTime(remainingRPHAdjustTen)} (%10 buffer inc.)`};
        content[3] = {"name": "calls", "value": `Time on Calls: ${formatTime(totalDurationInSecondsOnCall)}`};
        content[4] = {"name": "chats", "value": `Time on Chats: ${formatTime(totalDurationInSecondsChat)}`};
        content[5] = {"name": "away", "value": `Away: ${formatTime(totalDurationInSecondsNotReadyAway)}`};
        content[6] = {"name": "break", "value":`Break: ${formatTime(totalDurationInSecondsNotReadyBreak)}`};
        content[7] = {"name": "replies", "value": `Case Replies: ${caseReplyElements.length}`};
        content[9] = {"name": "todayRPH", "value": `Today's RPH: ${rph.toFixed(2)}`};
	});
}

async function fetchPrevious(depth) {
    const prevDate = new Date(currentDate);

    for(let n=1;n<depth;n++) {
        // Go back a day in iteration
        prevDate.setDate(currentDate.getDate() - n);

        // Get the day after the current iteration
        const prevEndDate = new Date(prevDate);
        prevEndDate.setDate(prevDate.getDate() + 1);

        let prevStartTimestamp = getMidnightTimestamp(prevDate);
        let prevEndTimestamp = getMidnightTimestamp(prevEndDate) - 1;

        // Store value for last shift date
        let lastShiftDate = new Date(prevDate);
        lastShiftDate.setDate(prevDate.getDate());

        // Set endpoint to fetch data from
        let prevEndpointUrl = `https://www.bctoolbelt.com/users/${user.id}/timeline.json?start=${prevStartTimestamp}&end=${prevEndTimestamp}.999&interval=undefined`;

        await fetchData(prevEndpointUrl, 'prev').then(() => {
            // Filter elements with name: 'Chat'
            const chatElements = pastData.filter((element) => element.name === 'Chat');
            // Filter elements with name: 'On Call'
            const onCallElements = pastData.filter((element) => element.name === 'On Call');
            // Filter elements with name: 'Not Ready - Meeting'
            const notReadyMeetingElements = pastData.filter((element) => element.name === 'Not Ready - Meeting');
            // Filter elements with name: 'Not Ready - Break'
            const notReadyBreakElements = pastData.filter((element) => element.name === 'Not Ready - Break');
            // Filter elements with name: 'Not Ready - Away'
            const notReadyAwayElements = pastData.filter((element) => element.name === 'Not Ready - Away');
            // Filter elements with name: 'Not Ready - Training'
            const notReadyTrainingElements = pastData.filter((element) => element.name === 'Not Ready - Training');
            // Filter elements with name: 'Not Ready - Project'
            const notReadyProjectElements = pastData.filter((element) => element.name === 'Not Ready - Project');
            // Filter elements with name: 'Not Ready - Outbound'
            const notReadyOutboundElements = pastData.filter((element) => element.name === 'Not Ready - Outbound');
            // Filter elements with name: 'Not Ready - Chat'
            const notReadyChatElements = pastData.filter((element) => element.name === 'Not Ready - Chat');
            // Filter elements with name: 'Ready'
            const readyElements = pastData.filter((element) => element.name === 'Ready');
            // Filter elements with name: 'Ringing'
            const ringingElements = pastData.filter((element) => element.name === 'Ringing');
            // Filter elements with name: 'After Call Work'
            const afterCallWorkElements = pastData.filter((element) => element.name === 'After Call Work');
            // Filter elements with name: 'Case Reply'
            const caseReplyElements = pastData.filter((element) => element.name === 'Case Reply');
            // Calculate total duration for 'Chat' elements
            let totalDurationInSecondsChat = calculateTotalDuration(chatElements);
            // Calculate total duration for 'On Call' elements
            let totalDurationInSecondsOnCall = calculateTotalDuration(onCallElements);
            // Calculate total duration for 'Not Ready - Meeting' elements
            let totalDurationInSecondsNotReadyMeeting = calculateTotalDuration(notReadyMeetingElements);
            // Calculate total duration for 'Not Ready - Break' elements
            let totalDurationInSecondsNotReadyBreak = calculateTotalDuration(notReadyBreakElements);
            // Calculate total duration for 'Not Ready - Away' elements
            let totalDurationInSecondsNotReadyAway = calculateTotalDuration(notReadyAwayElements);
            // Calculate total duration for 'Not Ready - Training' elements
            let totalDurationInSecondsNotReadyTraining = calculateTotalDuration(notReadyTrainingElements);
            // Calculate total duration for 'Not Ready - Project' elements
            let totalDurationInSecondsNotReadyProject = calculateTotalDuration(notReadyProjectElements);
            // Calculate total duration for 'Not Ready - Outbound' elements
            let totalDurationInSecondsNotReadyOutbound = calculateTotalDuration(notReadyOutboundElements);
            // Calculate total duration for 'Not Ready - Chat' elements
            let totalDurationInSecondsNotReadyChat = calculateTotalDuration(notReadyChatElements);
            // Calculate total duration for 'Ready' elements
            let totalDurationInSecondsReady = calculateTotalDuration(readyElements);
            // Calculate total duration for 'Ringing' elements
            let totalDurationInSecondsRinging = calculateTotalDuration(ringingElements);
            // Calculate total duration for 'After Call Work' elements
            let totalDurationInSecondsAfterCallWork = calculateTotalDuration(afterCallWorkElements);
            // Calculate the combined total active duration for all elements except 'Case Reply'
            let totalTimeNotCountedInSeconds =
                totalDurationInSecondsOnCall +
                totalDurationInSecondsChat +
                totalDurationInSecondsNotReadyMeeting +
                totalDurationInSecondsNotReadyBreak +
                totalDurationInSecondsNotReadyAway +
                totalDurationInSecondsNotReadyTraining +
                totalDurationInSecondsNotReadyProject +
                totalDurationInSecondsNotReadyOutbound +
                totalDurationInSecondsRinging +
                totalDurationInSecondsAfterCallWork;
            // Calculate the total time logged in by adding the duration of every element in the data array
            let totalTimeLoggedInInSeconds =
                totalDurationInSecondsOnCall +
                totalDurationInSecondsNotReadyMeeting +
                totalDurationInSecondsNotReadyBreak +
                totalDurationInSecondsNotReadyAway +
                totalDurationInSecondsNotReadyTraining +
                totalDurationInSecondsNotReadyProject +
                totalDurationInSecondsNotReadyOutbound +
                totalDurationInSecondsNotReadyChat +
                totalDurationInSecondsReady +
                totalDurationInSecondsRinging +
                totalDurationInSecondsAfterCallWork;
            // Calculate the remaining time for RPH
            const remainingRPHInSeconds = totalTimeLoggedInInSeconds - totalTimeNotCountedInSeconds;
            //Adjusted by %10
            const remainingRPHAdjustTen = Math.round(remainingRPHInSeconds - remainingRPHInSeconds*.1);
            const remainingRPHInHours = remainingRPHAdjustTen / 3600;
            // Calculate RPH
            const rph = caseReplyElements.length / remainingRPHInHours;

            // If the response is a valid number, add it to the lastShiftRPH object
            if(!isNaN(rph.toFixed(2))){
                lastShiftData.push({
                    "name": "prevRPH", 
                    "value": `Last Shift's RPH: ${rph.toFixed(2)} on ${lastShiftDate.toLocaleDateString()}`,
                    "date": prevStartTimestamp // allows sorting of items in object
                });
            }
            
        });
    }
}

// Helper functions need to be globally available
// Time stamp logic used in request url.
function getMidnightTimestamp(date) {
    date.setHours(0, 0, 0, 0); // Set the time to midnight (00:00:00.000)
    return Math.floor(date.getTime() / 1000); // Convert to seconds
}
// Function to calculate total duration in seconds for given elements
function calculateTotalDuration(elements) {
    return elements.reduce((totalSeconds, element) => {
        const durationParts = element.duration.split(':');
        const minutes = parseInt(durationParts[0]);
        const seconds = parseInt(durationParts[1]);
        return totalSeconds + minutes * 60 + seconds;
    }, 0);
}
// Function to format time in HH:mm:ss format
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${padWithZero(hours)}:${padWithZero(minutes)}:${padWithZero(remainingSeconds)}`;
}
// Function to pad single-digit numbers with leading zero
function padWithZero(number) {
    return number.toString().padStart(2, '0');
}
// Function to log fetched data to console
function logContent(content){
    // Loop through content object and log each property's value
    content.forEach(function(property) {
        console.log(property.value);
    });
}

function calculateRPH() {
	fetchNow().then(() => {
        if(!content[8]) {
            fetchPrevious(8).then(() => {
                // Sort last shift data by date
                lastShiftDataSorted = lastShiftData.sort(function(a,b){
                    return new Date(b.date) - new Date(a.date);
                });
                // Set last shift data in content object
                content[8] = lastShiftDataSorted[0];
            }).then(() => {
                // Clear the console
                console.clear();
                // Log fetched data
                logContent(content);
            });
        } else {
            // Clear the console
            console.clear();
            // Log fetched data
            logContent(content);  
        }
	});
}
calculateRPH();

const intervalInMinutes = 1;
setInterval(calculateRPH, intervalInMinutes * 60 * 1000);

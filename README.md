# Real-Time-RPH-Calculator
Calculates real time RPH for the current date. 

# What is RPH? 
The acronymn RPH stands for responses per hour. It is a KPI for technical suport agents that tracks how many responses (emails) they send to customers per hour. The total hours for RPH doesn't include 'active time. 
'Active' time is specifically time when you are on a live contact, training, meeting, etc. Essentially this is the time that won't be counted for RPH as it isn't expected that you are working on cases during this time. 

# Why is this script necessary? 
The built in tools for tracking RPH only shows the agent their RPH from the first of the month to the current date. There isn't an easy way to see how you are doing for this metric daily. 
If you value a consistent work flow, having accurate metrics that you can review in real time is invaluable. 

# How does it work? 
In toolbelt there is a graph that tracks your status throughout the day. It is called Agent Timeline. It also tracks when you send a response as a 'Case Reply'.  
<img width="207" alt="AgentTimeline" src="https://github.com/TylerKimbell/Real-Time-RPH-Calculator/assets/8732563/0a535805-1c9b-410c-8139-49a61ca7b05f">  
You can find the HTTP request that provides the information for the graph in the network tab of devtools if you search for 'timeline'. In the response of the request you can see the different statuses you are in and how long you were in them. 
Using that HTTP request, the script parses all of that information, and uses it to calculate your RPH. 
RPH calculation: Case Replies/Inactive Time. So if you work for 2 hours and you sent 4 emails 4/2 = 2. Your RPH is 2.
RPH calculation also includes a %10 buffer subtracted from the inactive time as there will be some time you are 'inactive', but otherwise busy. 
For my own needs I also have opted for the script to show other useful information like the Break Time, Case Replies, etc.  
<img width="1432" alt="RPHScript" src="https://github.com/TylerKimbell/Real-Time-RPH-Calculator/assets/8732563/a455314b-45ed-4db1-bb8f-6335d0c68c33">
The script refreshes every minute to stay up to date with new statuses/case replies. 

# Installation
1. Install a User Script manager extension on your browser. Example [tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. Install the script from this [link](https://greasyfork.org/en/scripts/487882-real-time-rph-calculator)
3. Edit the script in your script manager. In Tampermonkey you can click on the extension > Dashboard > click on the script to edit it. 
  -Replace {first-last} on line 7 with your first and last name. Example for me would be tyler-kimbell. This will allow the script to run on your specific toolbelt page. 
  -Replace {id} on line 21 with your toolbelt id.
    -To find your toolbelt id open the network tab of devtools on the page, search for "timeline", and look at the path url. It will be /users/{id}/timeline.json
    <img width="1437" alt="toolbeltId" src="https://github.com/TylerKimbell/Real-Time-RPH-Calculator/assets/8732563/8db97d21-2711-4a7a-b84a-8086ccf361a4">

# How to Use
Simply open the console in devtools and you should see the output from the script. 
Hotkeys to open Console:  
Windows – Ctrl + Shift + J.  
Mac – Cmd + Opt +J.

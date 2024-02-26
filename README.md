# Live RPH 
Calculates real time RPH for the current date. 

# What is RPH? 
The acronymn RPH stands for responses per hour. It is a KPI for technical suport agents that tracks how many responses (emails) they send to customers per hour. The total hours for RPH doesn't include 'active' time.  
'Active' time is specifically time when you are on a live contact, training, meeting, etc. Essentially this is the time that won't be counted for RPH as it isn't expected that you are working on cases during this time.  
Conversely 'inactive' time is when you should be working on cases and sending responses. In the script this is referred to as 'Time in Ready'.

# Why is this script necessary? 
The built in tools for tracking RPH only shows the agent their RPH from the first of the month to the current date. There isn't an easy way to see how you are doing for this metric in real time. 
This script outputs your RPH for the day, so you can see if you are ahead or behind for the day.

# How does it work? 
In toolbelt there is a graph (Agent Timeline) that tracks your status throughout the day. It also tracks when you send a response as a 'Case Reply'.    
  
<img width="207" alt="AgentTimeline" src="https://github.com/TylerKimbell/Real-Time-RPH-Calculator/assets/8732563/0a535805-1c9b-410c-8139-49a61ca7b05f">  
  
You can find the HTTP request that provides the information for the graph in the network tab of devtools if you search for 'timeline'. In the response of the request you can see the different statuses you have been in throughout the day and how long you were in them.  
Using that HTTP request, the script parses all of that information, and uses it to calculate RPH. It then outputs that info in the console.  
The script displays other useful information as well such as Break Time, Case Replies, etc.    
The script refreshes every minute to stay up to date with new statuses/case replies.  
  
<img width="1432" alt="RPHScript" src="https://github.com/TylerKimbell/Real-Time-RPH-Calculator/assets/8732563/a455314b-45ed-4db1-bb8f-6335d0c68c33">
  
## RPH calculation
Case Replies/Time in Ready  
Example: if you work uninterupted (in a ready status) for 2 hours and you sent 4 emails you divide the amount of emails by the time in ready. 4/2 = 2, RPH = 2.  
RPH calculation also includes a %10 buffer subtracted from the Time in Ready as there will be some time you are 'inactive', but otherwise busy. This is how the actual metric works so I included that in the script to be as accurate as possible.  

# Installation
1. Install [tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. Install the script from this [link](https://greasyfork.org/en/scripts/488376-live-rph)

# How to Use
Simply open the console in devtools on your toolbelt home page. 
Hotkeys to open Console:  
Windows – Ctrl + Shift + J.  
Mac – Cmd + Opt +J.

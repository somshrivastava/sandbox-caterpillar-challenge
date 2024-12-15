# Sandbox Caterpillar Challenge

## Program Description

### Purpose

We are given a unique URL at which the following data was posted:

- List of users
- 2D-array of pickup locations
- 2D-array of dropoff locations
- List of requests from riders to drivers

The goal of this program is to access this data the given unique URL, rebuild the groups, and calculate some statistics for each group

### Technologies Used

I chose TypeScript for this program because it is the language that I am most familiar with. TypeScript is very easy to use, especially when it comes to making GET and POST requests to API's, so it seemed like the perfect language for this task.

### Challenges Faced

The biggest challenge I faced was a simple misunderstanding of the problem statement itself. When writing the program, I thought that the average dropoff and pickup was calculated using only the coordinates of the riders and not the driver. After taking a look at the sample data and solution provided in the challenge guidelines, I realized that the driver needed to be included in the statistical calculations. Although a seemingly simple mistake, this debugging took up the most time and became the biggest reason for why my code was failing at first.

### Program Rundown

1. Fetch the data through a GET request to the unique URL
2. Filter the rider requests to only include accepted one's
3. Loop through the requests
   1. Get the driver coordinates
   2. Get the rider coordinates
   3. If no group exists with the driver's id, then create a new group
   4. If a group exists with the driver's id, then add the rider's information to the existing group
4. Loop through all the average dropoff and pickup totals and divide them by the number of riders in the group to get the average
5. Sort the groups by the difference in average dropoff and pickup
6. Make a POST request to the unique URL with the rebuilt groups

## Running the Program

```
npm install && npm run start
```

The program will return the response given back from the POST request sent to the unique URL

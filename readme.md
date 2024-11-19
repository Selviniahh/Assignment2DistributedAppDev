# Github Link: 
https://github.com/Selviniahh/Assignment2DistributedAppDev

# URL of the project 
```angular2html
http://localhost:3000
```

# Test Languages
```angular2html
http://localhost:3000/api/languages
```

### Output you should get: 
```angular2html
message	"success"
data	
0	
language	"English"
1	
language	"German"
2	
language	"Turkish"
```

# Test timesOfDay
```angular2html
http://localhost:3000/api/timesOfDay
```
### Output you should get
```angular2html
message	"success"
data	
0	
timeOfDay	"Evening"
1	
timeOfDay	"Afternoon"
2	
timeOfDay	"Morning"
```

# Test Greet
```
curl -X POST http://localhost:3000/api/greet -H "Content-Type: application/json" -d '{"timeOfDay": "Evening", "language": "English", "tone": "Formal"}'
```
### Output you should get:
```
{"greetingMessage":"Good evening"}
```

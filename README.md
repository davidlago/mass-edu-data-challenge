mass-edu-data-challenge
=======================

Repository for the Mass Edu data challenge: http://bit.ly/1tRePCQ

As a first step, we are aggregating the data from the different files provided under a common data structure (JSON hosted in a MongoDB database).

## Data import
The Node.js program tha parses the data files under the `data` directory is located inside `import`. You can edit the database it connects to and run it locally to populate your own MongoDB instance.

## API
On top of MongoDB, we are developing a RESTful API using Node.js, that we are making public at `http://api.massedu.info`. The different data is now keyed by the organization code, an eight-digit number that represents the district (first four) and school (last four). If the last four are zeroes the information pertains to a district, otherwise it belongs to a particular school.

### Interface
The API returns an array of JSON documents matching the search criteria. The fields that can contribute to a search are:
* `org_code`: Mandatory. This is the eight digit organization code mentioned before
* `realm`: Domain of the information. Examples are financial, mcas, attrition...
* `year`: Four digit year
The full API interface is:
```
http://api.massedu.info/{org_code}[?realm={realm}][&year={year}]
```

### Sample calls
Financial information about district `0007` for the year 2012:
```
GET http://api.massedu.info/00070000?realm=financial&year=2012
```
MCAS information for school `0013` in district `00007`:
```
http://api.massedu.info/00070013?realm=mcas
```
All available info for school `0013` in district `0007` for 2014:
```
http://api.massedu.info/00070013?year=2014
```

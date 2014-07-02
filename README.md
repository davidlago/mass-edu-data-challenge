mass-edu-data-challenge [![Build Status](https://travis-ci.org/davidlago/mass-edu-data-challenge.png)](https://travis-ci.org/davidlago/mass-edu-data-challenge)
=======================

Repository for the Mass Edu data challenge: http://bit.ly/1tRePCQ

As a first step, we are aggregating the data from the different files provided under a common data structure (JSON hosted in a MongoDB database).

## Data import
The Node.js program tha parses the data files under the `data` directory is located inside `import`. While having a running MongoDB instance, execute the following 

```shell
cd import
node --max-old-space-size=20480 app.js 
```

Where the `--max-old-space-size` variable is the memory alloation in megabytes. This process might not complete successfully with the default memory settings. We recommend trying this with the maximum memory your system can afford.

We also recommend setting the following index, which helps in particular the querying method for our API (other uses might require different indexes):

```
db.org_code_flat.ensureIndex({org_code: 1, subrealm: 1, year: 1})
```

This script creates a `massedu` database, and inside of it a `org_code_flat` collection, with all the entries of all the csv files as documents. The general format of a document in this collection is as follows:

```json
{
  "FIELD_1":   "VALUE_1",
  "FIELD_2":   "VALUE_2",
  ...
  "FIELD_N":   "VALUE_N",
  "org_code":  "8-digit organization code here",
  "org_name":  "Organization name here",
  "dist_code": "8-digit district code here",
  "dist_name": "District name here",
  "year":      "2003",
  "realm":    "First category level (equivalent to folder in data dir)",
  "subrealm":  "Second category level (equivalent to filename in folder)"
}
```
`FIELD_1...FIELD_N` vary depending on the file. See dictionary of terms for what each term means. The last 7 fields are common to all documents, and identify the organization and categories of this entry/document.


## API
On top of MongoDB, we have developed a RESTful API using Node.js, that we are making public at `http://massedu.info/api`. The different data is now keyed by the organization code, an eight-digit number that represents the district (first four) and school (last four). If the last four are zeroes the information pertains to a district, otherwise it belongs to a particular school.

### Interface
#### /schools
This endpoint returns schools and school information. When called without parameters, it returns a list of all available schools in the dataset. When called with an organization ID, it returns all the data about that particular school. If you want to narrow down the data returned about the school, three parameters can be used:

* `realm`: First category level (equivalent to folder in data dir). See dictionary.
* `subrealm`: Second category level (equivalent to filename in folder). See dictionary.
* `year`: Four digit year

##### Sample calls:

Get all the schools in the dataset:
```
http://massedu.info/api/schools
```

Get all the information about school `00970016`:
```
http://massedu.info/api/schools/00970016
````

Get only the 2014 data for school `00970016`:
````
http://massedu.info/api/schools/00970016?year=2014
````

Get only student information for 2014 for school `00970016`:
````
http://massedu.info/api/schools/00970016?year=2014&realm=students
````

Get class sizes by gender for school `00970016`:
````
http://massedu.info/api/schools/00970016?year=2012&subrealm=class_size_by_gender
````


#### /districts
This endpoint returns districts and district information. When called without parameters, it returns a list of all available districts in the dataset. When called with an organization ID, it returns all the data about that particular district. If you want to narrow down the data returned about the district, three parameters can be used:

* `realm`: First category level (equivalent to folder in data dir). See dictionary.
* `subrealm`: Second category level (equivalent to filename in folder). See dictionary.
* `year`: Four digit year

##### Sample calls:

Get all the districts in the dataset:
```
http://massedu.info/api/districts
```

Get all the information about district `02260000`:
```
http://massedu.info/api/districts/02260000
````

Get only the 2014 data for district `02260000`:
````
http://massedu.info/api/districts/02260000?year=2014
````

Get only teacher information for 2014 for district `02260000`:
````
http://massedu.info/api/districts/02260000?year=2014&realm=educators_teachers
````

Get only staffing age report for 2014 for district `02260000`:
````
http://massedu.info/api/districts/02260000?year=2014&subrealm=staffing_age_report
````

#### /fields
This endpoint returns all of the occurrences for a specific field (from the dictionary) across all of the organizations and years. It takes two optonal parameters to further narrow down the search:

* `orgtype`: Can be `school` or `district`, to return occurrences only in schools or districts, respectively. If not present, results can come from either type.
* `year`: Four digit year

This service returns an array of occurrences in this format (sorted first by year and then by organization code):

```json
{
  "FIELD_NAME": "FIELD_VALUE",
  "org_code":   "ORG_CODE",
  "year":       "YEAR"
}
```

##### Sample calls:

Get all the occurrences for field `ATTR_PCT_ALL` in the dataset:
```
http://massedu.info/api/fields/ATTR_PCT_ALL
```

Get all the occurrences for field `ATTR_PCT_ALL` for 2014 in the dataset:
```
http://massedu.info/api/fields/ATTR_PCT_ALL?year=2014
````

Get all the occurrences for field `ATTR_PCT_ALL` for 2014 in the dataset, only for schools:
```
http://massedu.info/api/fields/ATTR_PCT_ALL?year=2014&orgtype=school
````


### Dictionaries

There are a collection of static JSON files that can be used to assist in building an application around the data:


#### `realms.json`
List of available realms of data for the schools and/or districts. Available at `http://massedu.info/api/realms.json`. The field `org_type` indicates if it pertains to a `school`, a `district` or `both`. Sample element:

````json
{
    "realm": "assessment",
    "description": "Assessment",
    "subrealms": [
      {
        "name": "amao",
        "org_type": "district",
        "description": "AMAO"
      },
      {
        "name": "ap_participation",
        "org_type": "district",
        "description": "AP Participation"
      },
      {
        "name": "ap_performance",
        "org_type": "district",
        "description": "AP Performance"
      },
      {
        "name": "sat_performance_report",
        "org_type": "district",
        "description": "SAT Performance"
      }
    ]
}
```

#### `dictionary.json`
List of fields and their descriptions, as extracted from the dataset's dictionary. Available at `http://massedu.info/api/dictionary.json`. Sample element:

````json
{

    "FY_CODE": "School Years",
    "ORG_CODE": "Eight digit ESE School/District Code",
    "DISTRICT_CODE": "District Code",
    ...
}
```

#### `years.json`
List of available years in the dataset (array of strings). Available at `http://massedu.info/api/years.json`.


## Website
We have put together a website to showcase the use of this API at http://massedu.info.
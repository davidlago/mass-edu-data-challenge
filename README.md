mass-edu-data-challenge [![Build Status](https://travis-ci.org/davidlago/mass-edu-data-challenge.png)](https://travis-ci.org/davidlago/mass-edu-data-challenge)
=======================

Repository for the Mass Edu data challenge: http://bit.ly/1tRePCQ

As a first step, we are aggregating the data from the different files provided under a common data structure (JSON hosted in a MongoDB database).

## Data import
The Node.js program tha parses the data files under the `data` directory is located inside `import`. You can edit the database it connects to and run it locally to populate your own MongoDB instance.

## API
On top of MongoDB, we are developing a RESTful API using Node.js, that we are making public at `http://massedu.info/api`. The different data is now keyed by the organization code, an eight-digit number that represents the district (first four) and school (last four). If the last four are zeroes the information pertains to a district, otherwise it belongs to a particular school.

### Interface
#### /schools
This endpoint returns schools and school information. When called without parameters, it returns a list of all available schools in the dataset. When called with an organization ID, it returns all the data about that particular school. If you want to narrow down the data returned about the school, two parameters can be used:

* `realm`: Domain of the information. Examples are financial, mcas, attrition...
* `year`: Four digit year

##### Sample calls:

Get all the schools in the dataset:
```
http://massedu.info/api/schools
```

Get all the information about school `00070013`:
```
http://massedu.info/api/schools/00070013
````

Get only the 2014 data for school `00070013`:
````
http://massedu.info/api/school/00070013?year=2014
````

Get only student information for 2014 for school `00070013`:
````
http://massedu.info/api/schools/00070013?year=2014&realm=students
````


#### /districts
This endpoint returns districts and district information. When called without parameters, it returns a list of all available districts in the dataset. When called with an organization ID, it returns all the data about that particular district. If you want to narrow down the data returned about the district, two parameters can be used:

* `realm`: Domain of the information. Examples are financial, mcas, attrition...
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

### Dictionaries

There are a collection of static JSON files that can be used to assist in building an application around the data:

#### `schools.json`
List of schools, and the districts they belong to. Available at `http://massedu.info/api/schools.json`. Sample element:

````json
{
    "org_code":  "00010405",
    "org_name":  "Frolio Middle School",
    "dist_code": "00010000",
    "dist_name": "Abington"
}
```

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

#### `years.json`
List of available years in the dataset (array of strings). Available at `http://massedu.info/api/years.json`.

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

## Website
Using the API, we are starting to build a website at http://massedu.info.
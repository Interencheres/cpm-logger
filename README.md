# cpm-logger
Wrapper for [node-bunyan](https://github.com/trentm/node-bunyan).

## Usage

### Initialization
```javascript
const logger = require("cpm-logger")(configJSON);
```

### Configuration

#### JSON Configuration
cpm-logger takes in parameter the following JSON :

```JSON
{
     "name" : "mylogname",
     "files" : {
         "enable" : true,
         "path" : "/path/to/log",
         "name" : "indb",
         "level" : "loglevel"
     },
     "logstash": {
         "enable": false,
         "name" : "myname",
         "host": "localhost",
         "port": 5710,
         "level" : "loglevel"
     }
 }
```

#### Log level
  * [Bunyan levels](https://github.com/trentm/node-bunyan#log-method-api)

#### Logstash
Dialog with logstash use [bunyan-logstash](https://github.com/sheknows/bunyan-logstash).
For local test, use stack [ELK](https://github.com/comperiosearch/vagrant-elk-box) throught [vagrant](https://www.vagrantup.com/).

### Development

#### Test syntax

```bash
$ npm run tests:syntax -s
```

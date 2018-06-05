# cpm-logger
Wrapper for [node-bunyan](https://github.com/trentm/node-bunyan).

## Usage

### Initialization
```javascript
const logger = require("cpm-logger").init(configJSON);
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

#### Console (output)
If you want log on console, `NODE_ENV` (system env) should be set to `development`. Use bunyan cli in order to formatting output example :
```bash
node myapp.js | bunyan
```
Use option `-o` to change format. More information `bunyan --help`.

Log level is managed throught `ENV_LOG_LEVEL`.

#### Logstash
Dialog with logstash use [bunyan-logstash](https://github.com/sheknows/bunyan-logstash).
For local test, use stack [ELK](https://github.com/comperiosearch/vagrant-elk-box) throught [vagrant](https://www.vagrantup.com/).

### Development

#### Test syntax

```bash
$ npm run tests:syntax -s
```

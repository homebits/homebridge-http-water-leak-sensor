# homebridge-http-water-leak-sensor

This is a Homebridge plugin for water leak sensors that expose their readings over HTTP.

Water leak sensors enabled through this plugin appear as leak sensors in HomeKit.

### Installation

1. Install [Homebridge](https://homebridge.io/).
1. Install the plugin: `npm install -g homebridge-http-water-leak-sensor`.
1. Configure the sensors in `config.json`.

### Configuration

```json
{
    "platforms": [
        {
            "platform": "HttpWaterLeakSensor",
            "sensors": [
                {
                    "name": "Simple Leak Sensor",
                    "endpoint": {
                        "url": "https://api.example.com/sensors/simple"
                    },
                    "status": {}
                },
                {
                    "name": "Complex Leak Sensor",
                    "endpoint": {
                        "url": "https://api.example.com/sensors/complex",
                        "method": "GET",
                        "headers": {
                            "Authorization": "Bearer bearer-token"
                        }
                    },
                    "status": {
                        "key": "waterSensor.water.value",
                        "leakValue": "wet"
                    },
                    "updateInterval": 300
                }
            ]
        }
    ]
}
```

### Supported Sensors

This plugin has been tested with water leak sensors exposed through the SmartThings API. It should also work with other sensors (physical or virtual) that exposed their readings in a JSON object accessible through HTTP.
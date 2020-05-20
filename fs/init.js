load('api_config.js');
load('api_rpc.js');
load('api_adc.js');
load('api_timer.js');
load('api_mqtt.js');
load('api_timer.js');
load('api_bme280.js');
load('api_config.js');

let gotoDeepSleep = ffi('void goto_deep_sleep(int)');

// MQTT related configuration
let deviceId = Cfg.get("device.id");
let deepSleepLength = Cfg.get('deepsleep.length');
let customerName = Cfg.get("customer.name");
let customerLocation = Cfg.get("customer.location");
let customerPlace = Cfg.get("customer.place");
let mqttTopic = customerName+"/"+customerLocation;
let temperatureBody = "temperature,place="+customerPlace+",device_id="+deviceId+" value=";
let pressureBody = "pressure,place="+customerPlace+",device_id="+deviceId+" value=";
let humidityBody =  "humidity,place="+customerPlace+",device_id="+deviceId+" value=";
let batteryBody =  "battery,place="+customerPlace+",device_id="+deviceId+" value=";

let adcComplete = false;
let bme280Complete = false;
let adcTimerId = null;
let bme280TimerId = null;

ADC.enable(0);
let bme280 = BME280.createI2C(0x76);

function timerBme280() {
  let temperature = bme280.readTemp();
  let pressure = bme280.readPress();
  let humidity = bme280.readHumid();
  if(temperature === BME280.MGOS_BME280_ERROR) {
      return;
  }
  print("Temperature: ", temperature);
  
  if(pressure === BME280.MGOS_BME280_ERROR) {
    return;
  }
  print("Pressure: ", pressure/100);
  
  if(humidity === BME280.MGOS_BME280_ERROR) {
    return;
  }
  print("Humidity: ", humidity);
  
  MQTT.pub(mqttTopic, temperatureBody+JSON.stringify(temperature), 0, true);
  MQTT.pub(mqttTopic, pressureBody+JSON.stringify(pressure/100), 0, true);
  MQTT.pub(mqttTopic, humidityBody+JSON.stringify(humidity), 0, true);

  Timer.del(bme280TimerId);
  bme280Complete = true;
}

function timerAdc() {
  let batteryVoltage = ADC.read(0)*4.2/1024;

  print("Battery voltage: ", batteryVoltage);
  if(MQTT.pub(mqttTopic, batteryBody+JSON.stringify(batteryVoltage), 0, true)) {
    Timer.del(adcTimerId);
    adcComplete = true;
  }
}

let mqttTimerId = Timer.set(1000, Timer.REPEAT, function() {
    if(MQTT.isConnected()) {
        adcTimerId = Timer.set(1000, Timer.REPEAT, timerAdc, null);
        bme280TimerId = Timer.set(1000, Timer.REPEAT, timerBme280, null);
        Timer.del(mqttTimerId);
    }
}, null);

Timer.set(1000, Timer.REPEAT, function() {
  if(adcComplete && bme280Complete) {
    gotoDeepSleep(deepSleepLength);
  }
}, null);

# An esp8266 based application built on top of Mongoose-OS with BME280 support

## Overview
IoTSens is an application built with power saving in mind to make it possible to run for months using a single 18650 battery.
In order to achieve long battery life deep sleep function of ESP8266 is used. Device boots up, connects to WiFi and MQTT, reads sensor, send the data to MQTT and goes to deep sleep for a specified amount of time. ESP8266 communicates with BME280 using I2C bus. Communication with MQTT is accomplished with SSL using server certificate provided within fs/ directory.

## Schematic

## Build and flash
Building is handled by __mos__ application available [here](https://mongoose-os.com/downloads/mos-release/win/mos.exe). 
After downloading you should run mos.exe and then cd to the main IoTSense directory within the application. To build and flash the device just invoke ```mos build``` followed by ```mos flash```. Please ensure the correct COM port and board are selected on top of the __mos__ window.

## Power saving

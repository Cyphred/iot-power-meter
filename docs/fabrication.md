# Fabrication of the Device

To measure the power consumption per kilowatt-hour, two sensors are tapped into the line:
- A sensor for measuring the line's voltage
- A sensor for measuring the line's current

These sensors will be wired up to the general-purpose IO (GPIO) pins of the Orange Pi in order to read and record the data before transmitting it to the central server via Ethernet.

A 16x2 LCD Matrix will be installed to enable the quick viewing of the meter's current readings in terms of total KW/h consumed, and the current load.

A relay switch will be installed to enable the remote disconnection of the load connected to the meter.

The central server infrastructure will be hosted on the cloud, to ensure high availability and mitigation of data loss by utilizing database redundancies offered by Cloud service providers.

The central server backend will be running on a REST API connected to a Database. The use of the HTTPS protocol will be required to ensure that any attempts at intercepting the data coming into and coming out of the central server will be rendered ineffective due to the secure, encrypted nature of HTTPS.

A web-based user interface will be available for the service provider in order to perform actions such as generating billing, remote disconnection and monitoring.

A web-based user interface will also be available for the consumers in order to receive billing and real-time monitoring of their power consumption.

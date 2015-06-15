#ghost map

Generative and temporary street maps drawn in the browser. 

[demo](http://ojack.github.io/ghost-map/)

[![alt preview](https://raw.githubusercontent.com/ojack/ghost-map/master/images/screenshot1.png)](http://ojack.github.io/ghost-map/)
[![alt preview](https://raw.githubusercontent.com/ojack/ghost-map/master/images/screenshot4.png)](http://ojack.github.io/ghost-map/)

Inspired by the [Situationists International (1944)](https://en.wikipedia.org/wiki/D%C3%A9rive). 

### Technical details

Uses [Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim) for location search and [OpenStreetMap Overpass API](http://wiki.openstreetmap.org/wiki/Overpass_API) to load street data.

Street data is loaded from Open Street Map, and represented as a series of connected nodes. Mouse clicks and touches generate a particles that meander through the nodes at random. The main data and drawing logic is located in utils/StreetData.js




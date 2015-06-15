#ghost map

Generative and temporary streetmaps drawn onto HTML canvas from Open Street Map data.

[LIVE VERSION HERE](http://ojack.github.io/ghost-map/)

![alt preview](https://raw.githubusercontent.com/ojack/ghost-map/master/images/screenshot1.png)
![alt preview](https://raw.githubusercontent.com/ojack/ghost-map/master/images/screenshot2.png)

Street data is loaded from Open Street Map, and represented as a series of connected nodes. Mouse clicks and touches generate a particles that meander through the nodes at random. The main data and drawing logic is located in utils/StreetData.js


Uses [Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim) for location search and [OpenStreetMap Overpass API](http://wiki.openstreetmap.org/wiki/Overpass_API) to load street data.


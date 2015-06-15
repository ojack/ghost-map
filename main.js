var React = require('react');
var App = require('./components/App');
React.initializeTouchEvents(true);

React.render(
      		<App/>, 
      		document.getElementById('container')
      		);
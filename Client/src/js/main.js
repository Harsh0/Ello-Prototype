var React = require('react');
var ReactDom = require('react-dom');

var MainComponent = React.createClass({
render:function(){
  return (
    <div>
    <h1>
    Hello Ello
    </h1>
    </div>
  )
}
});
ReactDom.render(
  <MainComponent />,
  document.getElementById('app'));

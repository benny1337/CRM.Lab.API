/// <reference path="../lib/react.js" />
/// <reference path="../lib/react-dom.js" />

var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
          Hello, world! I am a CommentBox.
      </div>
    );
  }
});
ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);
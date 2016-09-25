/// <reference path="../lib/react.js" />
/// <reference path="../lib/common.2.5.js" />
/// <reference path="../lib/react-dom.js" />

var HappinessIndicator = React.createClass({
    getInitialState: function () {
        return {
            isLoading: true,
            indicator: null
        }
    },
    componentDidMount: function () {        
        $.getJSON('https://localhost:44300/api/ImageAnalyzer/' + common.getCurrentId(), null, function(data){
            this.setState({
                isLoading: false
            });
        });        
    },
    render: function () {
        return (
          <div className="indicator">
              <Spinner isloading={this.state.isLoading} />
                            
          </div>
        );
    }
});

var Spinner = React.createClass({
    render: function () {
        if (this.props.isloading) {
            return (
                <img className="spinner" src="../img/ripple.gif" />
            )
        } else {
            return (
                <span />
            )
        }
    }
})


ReactDOM.render(
  <HappinessIndicator />,
  document.getElementById('content')
);
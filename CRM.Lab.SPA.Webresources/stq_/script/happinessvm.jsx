/// <reference path="../lib/react.js" />
/// <reference path="../lib/common.2.5.js" />
/// <reference path="../lib/react-dom.js" />

var HappinessIndicator = React.createClass({
    fetchindicator: function(contactid) {        
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', 'https://crmlabapi.azurewebsites.net/api/ImageAnalyzer/' + contactid);
            req.onload = function () {
                if (req.status == 200) {
                    resolve(req.response);
                } else {                    
                    reject(req.statusText);
                }
            }
            req.onerror = function () {                
                reject("network error");
            }

            req.send();
        });
    },
    fetchaccesstoken: function(){
        return new Promise(function (resovle, reject) {
            setTimeout(function () {                
                resovle("asdf")
            }, 3000);
        });
    },
    getInitialState: function () {
        return {
            isLoading: true,
            indicator: null,            
            error: "",
        }
    },
    componentDidMount: function () {
        var self = this;        
        self.fetchaccesstoken().then(function (token) {
            self.fetchindicator(self.props.contactid).then(function (response) {
                self.setState({
                    indicator: response
                    });
            }).catch(function(message) {
                self.setState({
                    error: message
                });
            }).then(function () {
                self.setState({
                    isLoading: false
                });
            });
        }).catch(function (message) {
            self.setState({
                error: message,
                isLoading: false
            });
        });
    },
    render: function () {
        return (
          <div className="indicator">
              <Spinner isloading={this.state.isLoading} />        
              <ErrorDisplayer message={this.state.error} />      
              <Indicator data={this.state.indicator} />
          </div>
        );
    }
});

var ErrorDisplayer = React.createClass({
    render: function () {        
        if (!this.props.message)
            return(<span />)

        return (
            <div className="error">{this.props.message}</div>
        )
    }
});

var Indicator = React.createClass({
    render: function () {

        if (!this.props.data)
            return (
                <span />
                )
                
        return (
            <span>{!this.props.data.IsHappy ? "he is not happy": "he is happy"}</span>
            )
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

var id = "{63A0E5B9-88DF-E311-B8E5-6C3BE5A8B200}";
if (!common.Xrm.get().isLocalhost)
    id = common.getCurrentId();
ReactDOM.render(
  <HappinessIndicator contactid={id} />,
  document.getElementById('content')
);
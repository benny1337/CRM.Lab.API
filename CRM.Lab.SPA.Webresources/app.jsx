import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Happiness from './components/Happiness.jsx';

window.addEventListener('load', function onLoad() {        
    var id = "{63A0E5B9-88DF-E311-B8E5-6C3BE5A8B200}";
    if (!common.Xrm.get().isLocalhost)
        id = common.getCurrentId();
    ReactDOM.render(
        <Happiness contactid={id} />,
        document.getElementById('content')
    );
});
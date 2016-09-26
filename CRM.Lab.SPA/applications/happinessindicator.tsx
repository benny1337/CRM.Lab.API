import * as React from "react";
import * as ReactDOM from "react-dom";
import { Happiness } from "../components/Happiness";
declare var common: any;

ReactDOM.render(
    <Happiness contactid={getid()} />,
    document.getElementById("content")
);

function getid() {
    var id = "{63A0E5B9-88DF-E311-B8E5-6C3BE5A8B200}";
    if (!common.Xrm.get().isLocalhost)
        id = common.getCurrentId();
    return id;
}
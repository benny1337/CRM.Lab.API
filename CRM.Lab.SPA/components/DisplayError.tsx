/// <reference path="../interfaces/interfaces.d.ts" />
import * as React from "react";

export interface IDisplayError {
    error: IError
}

export class DisplayError extends React.Component<IDisplayError, {}> {

    constructor(props: IDisplayError) {
        super(props);
    }

    render() {
        if (this.props.error) {
            var style = this.props.error.Severity == 1 ? "fatal-error" : "error";
            return (
                <div className={style}>
                    {this.props.error.Message}
                </div>
            )
        } else
            return null;
    }
}
import * as React from "react";

export interface ISpinner {
    isLoading: boolean
}

export class Spinner extends React.Component<ISpinner, {}> {

    constructor(props: ISpinner) {
        super(props);
    }

    render() {
        if (this.props.isLoading)
            return (
                <div className="spinner">
                    <img src="../img/ripple.gif" />
                </div>
            )
        else
            return null;
    }
}
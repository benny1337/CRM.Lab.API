/// <reference path="../interfaces/interfaces.d.ts" />
import * as React from "react";

export interface IHappiess {
    Analysis: IImageAnalysis
}

export class Indicator extends React.Component<IHappiess, {}> {

    constructor(props: IHappiess) {
        super(props);
    }

    render() {
        if (this.props.Analysis == null)
            return null;

        var css = "jeppe shake";
        var jeppe = (<span />);

        if (this.props.Analysis.IsJeppe) {
            var jeppe = (<div><img src="../img/jeppe.jpg" className={css} /></div >);
        }

        return (
            <div>
                <span>{this.props.Analysis.IsHappy ? "The contact is happy" : "The contact is not happy"}</span>
                {jeppe}
            </div>
        )
    }
}
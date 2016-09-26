/// <reference path="../interfaces/interfaces.d.ts" />

import * as React from "react";
import { Spinner } from "./Spinner";
import { Indicator } from "./Indicator";
import { DisplayError } from "./DisplayError";

export interface IHappinessProps {
    contactid: string    
}
export interface IHappinessState {
    isLoading?: boolean,
    error?: IError,
    analysis?: IImageAnalysis
}

export class Happiness extends React.Component<IHappinessProps, IHappinessState> {    
    constructor(props: IHappinessProps) {
        super(props);
        this.state = {
            isLoading: true,
            analysis: null
        };
    }

    getToken() {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve("hej");
            }, 1000);            
        });        
    }

    public getImageAnalysis() {        
        var self = this;
        return new Promise(function (resolve, reject) {                      
            var req = new XMLHttpRequest();
            req.open('GET', "http://crmlabapi.azurewebsites.net/api/ImageAnalyzer/" + self.props.contactid);

            req.onload = function () {
                if (req.status == 200) {
                    try {                        
                        resolve(JSON.parse(req.response));
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(req.statusText);
                }
            };

            req.onerror = function () {
                reject("Network Error");
            };
                        
            req.send();
        });
    }

    componentDidMount() {
        var self = this;
        self.getToken().then(function (token) {            
            self.getImageAnalysis().then(function (analysis) {
                var data = analysis as IImageAnalysis;
                self.setState({ analysis: data });
            }).catch(function (error) {
                var e = {
                    Message: error,
                    Severity: 1
                } as IError;
                self.setState({
                    error: e
                });
            }).then(function () {
                self.setState({ isLoading: false });
            });;
        });
    }
    render() {        
        return (
            <div>
                <Spinner isLoading={this.state.isLoading} />
                <DisplayError error={this.state.error} />
                <Indicator Analysis={this.state.analysis} />
            </div>
        )
    }
}
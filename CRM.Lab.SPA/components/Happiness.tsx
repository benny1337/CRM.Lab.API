/// <reference path="../interfaces/interfaces.d.ts" />

import * as React from "react";
import { Spinner } from "./Spinner";
import { Indicator } from "./Indicator";
import { DisplayError } from "./DisplayError";
declare var common: any;
declare var window: any;

export interface IHappinessProps {
    contactid: string,      
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
            window.config = {
                instance: "https://login.microsoftonline.com/",
                tenant: "hallojsan.onmicrosoft.com",
                clientId: "9e122abb-790c-4fc5-8c20-bbab6c73b7e9",
                postLogoutRedirectUri: window.location.hostname,
                endpoints: {
                    orgUri: "https://hallojsan.onmicrosoft.com/CRM.Lab.API"
                },
                cacheLocation: 'localStorage' // enable this for IE, as sessionStorage does not work for localhost.
            };            
            common.adaljs.getToken(window.config, function (token: string) {
                setTimeout(function () {
                    resolve(token);
                }, 3000);
            }, function (error: string) {
                reject(error);
            });
      
        });        
    }

    public getImageAnalysis(token: string) {        
        var self = this;
        return new Promise(function (resolve, reject) {                      
            var req = new XMLHttpRequest();
            req.open('GET', "https://crmlabapi.azurewebsites.net/api/ImageAnalyzer/" + self.props.contactid);            
            req.setRequestHeader('Authorization', 'Bearer ' + token);
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
        self.getToken().then(function (token: string) {
            self.getImageAnalysis(token).then(function (analysis) {
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
            });
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
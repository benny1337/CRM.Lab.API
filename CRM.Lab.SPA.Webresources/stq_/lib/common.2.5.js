var webapiModule = (function () {
    var my = {};
    my.updaterecord = function (entityid, entityobject, odatasetname, callback) {
        var oDataEndpointUrl = common.general.getODataEndPoint();
        oDataEndpointUrl += "/" + odatasetname + "(" + entityid + ")";
        var service = common.general.getRequestObject();
        var jsonEntity = window.JSON.stringify(entityobject);
        if (service != null) {
            service.open("PUT", encodeURI(oDataEndpointUrl), true);
            service.setRequestHeader("Accept", "application/json");
            service.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            service.setRequestHeader("X-HTTP-Method", "MERGE");
            service.onreadystatechange = function () {
                if (this.readyState == 4) {
                    service.onreadystatechange = null;
                    if (this.status == 204 || this.status == 1223)
                        callback();
                    else
                        throw "the operation was not successful";
                }
            }
            service.send(jsonEntity);
        }
    }
    my.updaterecordsingleproperty = function (entityid, propertyname, value, odatasetname, callback) {
        var oDataEndpointUrl = common.general.getODataEndPoint();
        oDataEndpointUrl += "/" + odatasetname + "(" + entityid + ")/" + propertyname;
        var service = common.general.getRequestObject();
        var jsonEntity = window.JSON.stringify({
            "value": value
        });
        if (service != null) {
            service.open("PUT", encodeURI(oDataEndpointUrl), true);
            service.setRequestHeader("Accept", "application/json");
            service.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            service.setRequestHeader("X-HTTP-Method", "MERGE");
            service.onreadystatechange = function () {
                if (this.readyState == 4) {
                    service.onreadystatechange = null;
                    if (this.status == 204 || this.status == 1223)
                        callback();
                    else
                        throw "the operation was not successful";
                }
            }
            service.send(jsonEntity);
        }
    }
    my.createrecord = function (entityObject, odataSetName, callback) {
        var jsonEntity = window.JSON.stringify(entityObject);
        var ODATA_ENDPOINT = common.general.getODataEndPoint();
        var createRecordReq = common.general.getRequestObject();
        createRecordReq.open('POST', ODATA_ENDPOINT + "/" + odataSetName, true);
        createRecordReq.setRequestHeader("Accept", "application/json");
        createRecordReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        createRecordReq.onreadystatechange = function () {
            if (this.readyState == 4) {
                createRecordReq.onreadystatechange = null;
                if (this.status == 201) {
                    callback(JSON.parse(this.responseText).d);
                } else {
                    throw "the operation was not successful";
                }
            }
        }

        createRecordReq.send(jsonEntity);
    }
    my.deleteRecord = function (entityid, odatasetname, callback) {
        var oDataEndpointUrl = common.general.getODataEndPoint();
        oDataEndpointUrl += "/" + odatasetname + "(guid'" + entityid + "')";
        var service = common.general.getRequestObject();
        if (service != null) {
            service.open("POST", encodeURI(oDataEndpointUrl), true);
            service.setRequestHeader("Accept", "application/json");
            service.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            service.setRequestHeader("X-HTTP-Method", "DELETE");
            service.onreadystatechange = function () {
                if (this.readyState == 4) {
                    service.onreadystatechange = null;
                    if (this.status == 201 || this.status == 1223) {
                        callback();
                    }
                }
            }
            service.send();
        }
    }
    my.retrieverecord = function (entityid, odatasetname, query, callback) {
        var oDataEndpointUrl = common.general.getODataEndPoint();
        oDataEndpointUrl += "/" + odatasetname + "(guid'" + entityid + "')" + query;
        var service = common.general.getRequestObject()
        if (service != null) {
            service.open("GET", encodeURI(oDataEndpointUrl), true);
            service.setRequestHeader("Accept", "application/json");
            service.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            service.onreadystatechange = function () {
                if (this.readyState == 4) {
                    service.onreadystatechange == null;
                    if (this.status == 200) {
                        callback(JSON.parse(this.responseText));
                    }
                }
            }
            service.send(null);
        }
    }
    my.retrievemultiplerecords = function (odatasetname, query, callback, oncomplete) {
        if (odatasetname == null) {
            var oDataEndpointUrl = query;
        } else {
            var oDataEndpointUrl = common.general.getODataEndPoint();
            oDataEndpointUrl += "/" + odatasetname + query;
        }

        var service = common.general.getRequestObject();
        if (service != null) {
            service.open("GET", encodeURI(oDataEndpointUrl), true);
            service.setRequestHeader("Accept", "application/json");
            service.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            service.onreadystatechange = function () {
                if (this.readyState == 4) {
                    service.onreadystatechange = null;
                    if (this.status == 200) {
                        var returned = JSON.parse(this.responseText).value;
                        callback(returned);
                        if (returned.__next != null && oncomplete != null) {
                            common.odataAsync.retrievemultiplerecords(null, decodeURI(returned.__next), callback, oncomplete);
                        }
                        else { try { oncomplete(); } catch (e) { } }
                    }
                }
            }
            service.send(null);
        }
    }

    return my;
})();
var optionsetModule = (function () {
    var my = {};
    my.getOptionSetValues = function (entityLogicalName, retrieveAttributeName, successcallback) {

        common.loadScript("stq_/scripts/sdk.metadata.js", function () {
            // Calling Metadata service to get Optionset Label
            SDK.Metadata.RetrieveAttribute(entityLogicalName, retrieveAttributeName, null, false, function (result) {
                var optionsets = [];
                if (result != null && result.OptionSet != null && result.OptionSet.Options != null) {
                    var options = result.OptionSet.Options;
                    for (var i = 0; i < options.length; i++) {
                        var optionres = options[i];
                        var option = new Object();
                        option.text = optionres.Label.UserLocalizedLabel.Label;
                        option.value = optionres.Value;
                        optionsets.push(option);
                    }
                }
                successcallback(optionsets);
            }, function (error) {
                console.log(error.message);
            });
        });
    };

    my.setOptionSetValues = function (attribute, currentValue, oAvailableArray, optionalControlAttribute) {

        if (optionalControlAttribute == null)
            optionalControlAttribute = attribute;

        var oSubPicklist = common.Xrm.get().Page.getControl(optionalControlAttribute);
        if (!oSubPicklist.originalPicklistValues) {
            oSubPicklist.originalPicklistValues = common.Xrm.get().Page.getAttribute(attribute).getOptions();
        }
        else {
            oSubPicklist.Options = oSubPicklist.originalPicklistValues;
        }
        oSubPicklist.clearOptions();

        if (oAvailableArray.length > 0) {
            var index = 1;
            for (var i = 0; oSubPicklist.originalPicklistValues.length > i; i++) {
                for (var j = 0; oAvailableArray.length > j; j++) {
                    if (oSubPicklist.originalPicklistValues[i] != null && (oAvailableArray[j] == oSubPicklist.originalPicklistValues[i].value)) {
                        oSubPicklist.addOption(oSubPicklist.originalPicklistValues[i], index);
                        index++;
                        continue;
                    }
                }
            }
            oSubPicklist.setDisabled(false);
            if (currentValue != null) {
                common.Xrm.get().Page.getAttribute(attribute).setValue(currentValue);
            }
            else {
                common.Xrm.get().Page.getAttribute(attribute).setValue(null);
            }
        }
        else {
            oSubPicklist.setDisabled(true);
            common.Xrm.get().Page.getAttribute(attribute).setValue(null);
        }
    }

    return my;
})();
var fieldsModule = (function () {
    var my = {
        oldvalues: []
    };
    my.SetLookupValue = function (fieldName, id, name, entityType) {
        if (fieldName != null) {
            var lookupValue = new Array();
            lookupValue[0] = new Object();
            lookupValue[0].id = id;
            lookupValue[0].name = name;
            lookupValue[0].entityType = entityType;

            common.Xrm.get().Page.getAttribute(fieldName).setValue(lookupValue);
        }
    }
    my.forceSubmitAllDirtyAttributes = function (input) {
        var attributes = common.Xrm.get().Page.data.entity.attributes.get();
        var attributeList = "";
        for (var i in attributes) {
            var attribute = attributes[i];
            var res = attribute.getIsDirty();
            if (res == true) {
                common.Xrm.get().Page.getAttribute(attribute.getName()).setSubmitMode(input);
            }
        }
    }
    my.doesControlHaveAttribute = function (control) {
        var controlType = control.getControlType();
        return controlType != "iframe" && controlType != "webresource" && controlType != "subgrid";
    }
    my.disableAllFields = function () {
        common.Xrm.get().Page.ui.controls.forEach(function (control, index) {
            if (doesControlHaveAttribute(control)) {
                control.setDisabled(true);
            }
        });
    }
    my.alertTheDirtyOnes = function () {
        var attributes = common.Xrm.get().Page.data.entity.attributes.get();
        var attributeList = "";
        for (var i in attributes) {
            var attribute = attributes[i];
            var res = attribute.getIsDirty();
            if (res == true) {
                attributeList = attribute.getName() + ", " + attributeList;
            }
        }
        alert("Dessa e dirty: " + attributeList);
    }
    my.hideField = function (fieldname) {
        common.Xrm.get().Page.getControl(fieldname).setVisible(false);
    }
    my.showField = function (fieldname) {
        common.Xrm.get().Page.getControl(fieldname).setVisible(false);
    }
    my.addFieldValidationRule = function (field, rule) {
        my.oldvalues[field] = common.Xrm.get().Page.getAttribute(field).getValue();
        common.Xrm.get().Page.getAttribute(field).addOnChange(function (e) {
            if (e.getEventSource().getValue() && !rule(e.getEventSource().getValue())) {
                e.getEventSource().setValue(my.oldvalues[e.getEventSource().getName()]);
            } else {
                my.oldvalues[e.getEventSource().getName()] = e.getEventSource().getValue();
            }
        });
    }
    my.validationrules = {
        dateValidationrule: function (value) {
            var pattern = RegExp(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/);
            if (pattern.test(value))
                return true;
            else {
                alert("Not a valid date. Date should be in format dd/mm/yyyy");
                return false;
            }
        }
    };
    return my;
})();
var formModule = (function () {
    var my = {
        getXrmAttribute: function (name) {
            return common.Xrm.get().Page.getAttribute(name).getValue();
        },
        getXrmEntityId: function () {
            return common.Xrm.get().Page.data.entity.getId();
        },
    };
    my.IsFormValidForSaving = function () {
        var valid = true;
        common.Xrm.get().Page.data.entity.attributes.forEach(function (attribute, index) {
            if (attribute.getRequiredLevel() == "required") {
                if (attribute.getValue() == null) {
                    if (valid) {
                        var control = attribute.controls.get(0);
                        alert(control.getLabel() + " is missing a value");
                        control.setFocus();
                    }
                    valid = false;
                }
            }
        });
        return valid;
    }
    my.hideTab = function (tabName) {
        var tab = common.Xrm.get().Page.ui.tabs.get(tabName);
        if (tab != null) {
            tab.setVisible(false);
        }
    }
    my.showTab = function (tabName) {
        var tab = common.Xrm.get().Page.ui.tabs.get(tabName);
        if (tab != null) {
            tab.setVisible(true);
        }
    }
    my.sectionDisable = function (sectionname, disablestatus) {
        var ctrlName = common.Xrm.get().Page.ui.controls.get();
        for (var i in ctrlName) {
            var ctrl = ctrlName[i];
            var ctrlSection = ctrl.getParent().getName();
            if (ctrlSection == sectionname) {
                ctrl.setDisabled(disablestatus);
            }
        }
    }
    my.setNavigationVisible = function (relationshipname, setVisible) {
        common.Xrm.get().Page.ui.navigation.items.get(relationshipname).setVisible(setVisible);
    }
    my.showSection = function (tabName, sectionName) {
        var tab = common.Xrm.get().Page.ui.tabs.get(tabName);
        if (tab != null) {
            tab.sections.get(sectionName).setVisible(true);
        }
    }
    my.hideSection = function (tabName, sectionName) {
        var tab = common.Xrm.get().Page.ui.tabs.get(tabName);
        if (tab != null) {
            tab.sections.get(sectionName).setVisible(false);
        }
    }
    return my;
})();
var generalModule = (function () {
    var my = {}
    my.guidsAreEqual = function (guid1, guid2) {
        var isEqual = false;

        if (guid1 == null || guid2 == null) {
            isEqual = false;
        }
        else {
            isEqual = guid1.replace(/[{}]/g, "").toLowerCase() == guid2.replace(/[{}]/g, "").toLowerCase();
        }

        return isEqual;
    }
    my.getODataEndPoint = function () {
        return "/api/data/v8.1";
    }
    my.parseDateValues = function (crmDateString) {
        if (crmDateString != null) {
            var fieldValue = crmDateString;
            var dateValue = new Date(parseInt(fieldValue.replace("/Date(", "").replace(")/", "")));
        }
        return dateValue;
    }
    my.getRequestObject = function () {
        if (window.XMLHttpRequest) {
            return new window.XMLHttpRequest;
        }
        else {
            try {
                return new ActiveXObject("MSXML2.XMLHTTP.3.0");
            }
            catch (ex) {
                return null;
            }
        }
    }
    my.findInArrayOfObjects = function (property, searchString, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][property] == searchString) {
                return arr[i];
            }
        }
    }
    return my;
})();
var userModule = (function () {
    var my = {};
    my.UserHasAnyOfRoles = function (roleName) {
        if (common.Xrm.get().isLocalhost)
            return true;

        var oDataEndpointUrl = common.general.getODataEndPoint();

        // split rolename string on commas       
        if (roleName.indexOf(',') > 0) {
            var rolelist = roleName.split(',');
            var element = null, odatastring = '';
            // build up the odata query string
            for (var i = 0; i < rolelist.length; i++) {
                odatastring += "Name eq '" + rolelist[i] + "'";
                if (i < rolelist.length - 1) {
                    odatastring += ' or ';
                }
            }
        }
        else {
            // we just have one role to look for
            odatastring = "Name eq '" + roleName + "'";
        }

        oDataEndpointUrl += "/RoleSet?$filter=" + odatastring;

        var service = common.general.getRequestObject();

        if (service != null) {
            service.open("GET", encodeURI(oDataEndpointUrl), false);
            service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
            service.setRequestHeader("Accept", "application/json, text/javascript, */*");
            service.send(null);

            var requestResults = eval('(' + service.responseText + ')').d;

            if (requestResults != null) {
                for (var j = 0; j < requestResults.results.length; j++) {
                    var role = requestResults.results[j].RoleId;
                    var currentUserRoles = common.Xrm.get().Page.context.getUserRoles();
                    for (var i = 0; i < currentUserRoles.length; i++) {
                        var userRole = currentUserRoles[i];
                        if (common.general.guidsAreEqual(userRole, role)) {
                            return true;
                        }
                    }
                }
            } //if
        }
        return false;
    };

    return my;
})();
var emailModule = (function () {
    var my = {};
    my.createMailRegarding = function (regardingentity) {

        var email = new Object();
        if (regardingentity.LogicalName == "quote") {
            var quoteid = "";
            try {
                quoteid = common.Xrm.get().Page.getAttribute("quotenumber").getValue();
            } catch (e) { }

            email.Subject = common.Xrm.get().Page.data.entity.getPrimaryAttributeValue() + ": " + quoteid;
        } else {
            email.Subject = common.Xrm.get().Page.data.entity.getPrimaryAttributeValue();
        }
        ownerID = common.Xrm.get().Page.getAttribute("ownerid").getValue()[0].id;
        email.RegardingObjectId = regardingentity;
        createRecord(email, "EmailSet", EmailCallBack, function (error) { alert(error.message); });
    }
    function EmailCallBack(result) {
        email = result; // Set the email to result to use it later in email attachment for retrieving activity Id
        var activityPartyFrom = new Object();
        activityPartyFrom.PartyId = {
            Id: common.Xrm.get().Page.getAttribute("ownerid").getValue()[0].id,
            LogicalName: "systemuser"
        };
        activityPartyFrom.ActivityId = {
            Id: result.ActivityId,
            LogicalName: "email"
        };

        // Now set the participation type that describes the role of the party on the activity).
        activityPartyFrom.ParticipationTypeMask = { Value: 1 }; // 1 means Sender

        createRecord(activityPartyFrom, "ActivityPartySet", function () {
            common.Xrm.get().Utility.openEntityForm("email", result.ActivityId);
        }, function (error) { alert(error.message); });
    }
    return my;
})();
var metadataModule = (function () {
    var my = {};
    my.loadScript = function (callback) {
        common.loadScript("stq_/scripts/sdk.metadata.js", function () {
            callback();
        });
    };
    return my;
})();
var objectdefinitions = (function () {
    var my = {};
    my.Field = function (params) {
        var self = this;
        self.rule = params.rule;
        self.action = params.action;
    }

    my.Property = function (loadfunction, fields) {
        var value = null;

        var self = this;
        self.fields = fields;
        self.load = loadfunction;
        self.getValue = function () {
            if (value == null)
                self.load();

            return value;
        }
        self.setValue = function (val) {
            if (value == val)
                return;

            value = val;
            for (var i = 0; i < self.fields.length; i++) {
                var field = self.fields[i];
                field.action(field.rule());
            }
        }
    }

    return my;
})();

var common = (function () {
    var _xrm = null;
    var _islocalhost = false;

    var my = {
        solutionAdaptions: {},
        webapi: webapiModule,
        optionset: optionsetModule,
        fields: fieldsModule,
        form: formModule,
        general: generalModule,
        user: userModule,
        email: emailModule,
        metadata: metadataModule,
        objectDefinitions: objectdefinitions,
        Xrm: {
            runLocalhost: function () {
                Xrm = {
                    isLocalhost: true,
                    Page: {
                        getAttribute: function (name) {
                            return {
                                getValue: function () { return "value"; },
                                setValue: function (val) { },
                                addOnChange: function (e) { },
                                fireOnChange: function () { }
                            };
                        },
                        data: {
                            entity: {
                                getId: function () { return 1; },
                                getPrimaryAttributeValue: function () { return "Name"; }
                            }
                        },
                        context: {
                            getClientUrl: function () { return "http://" + window.location.hostname + ":" + window.location.port; }
                        }
                    }
                }
                _islocalhost = true;
                _xrm = Xrm;
            },
            get: function () {
                if (_xrm != null)
                    return _xrm;

                if (typeof (Xrm) != "undefined")
                    _xrm = Xrm;
                else if (window.opener) {
                    if (typeof (window.opener.Xrm) != "undefined")
                        _xrm = window.opener.Xrm;
                    else if (window.opener.common.Xrm.get() != "undefined")
                        _xrm = window.opener.common.Xrm.get();
                }
                else if (window.parent && typeof (window.parent.Xrm) != "undefined")
                    _xrm = window.parent.Xrm;

                if (!_xrm)
                    this.runLocalhost();

                return _xrm;
            },
            set: function (xrm) {
                _xrm = xrm;
            },
        },
        getField: function (fieldname) {
            return my.Xrm.get().Page.getAttribute(fieldname);
        },
        getWebapiFormattedIdFromLookup: function (lookupfield) {
            var value = common.getField(lookupfield).getValue();
            if (!value || value.length < 1)
                return null;

            var id = value[0].id.replace('{', '');
            return id.replace('}', '');
        },
        getControl: function (controlname) {
            return my.Xrm.get().Page.getControl(controlname);
        },
        getCurrentId: function () {
            if (common.Xrm.get().isLocalhost)
                return "1";
            var id = common.Xrm.get().Page.data.entity.getId();
            id = id.replace('{', '');
            id = id.replace('}', '');
            return id;
        }
    }

    my.initSolutionAdaptions = function (callback, url) {
        if (!url)
            var url = "stq_/scripts/solutionAdaptions.js";

        my.loadScript(url, callback);
    }

    my.loadScript = function (url, callback) {
        url = my.Xrm.get().Page.context.getClientUrl() + "//WebResources/" + url;
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        script.onreadystatechange = callback;
        script.onload = callback;

        head.appendChild(script);
    }

    return my;
})();


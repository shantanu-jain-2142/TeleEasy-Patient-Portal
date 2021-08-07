/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var apigClientFactory = {};
apigClientFactory.newClient = function (config) {
    var apigClient = { };
    if(config === undefined) {
        config = {
            accessKey: '',
            secretKey: '',
            sessionToken: '',
            region: '',
            apiKey: undefined,
            defaultContentType: 'application/json',
            defaultAcceptType: 'application/json'
        };
    }
    if(config.accessKey === undefined) {
        config.accessKey = '';
    }
    if(config.secretKey === undefined) {
        config.secretKey = '';
    }
    if(config.apiKey === undefined) {
        config.apiKey = '';
    }
    if(config.sessionToken === undefined) {
        config.sessionToken = '';
    }
    if(config.region === undefined) {
        config.region = 'us-east-1';
    }
    //If defaultContentType is not defined then default to application/json
    if(config.defaultContentType === undefined) {
        config.defaultContentType = 'application/json';
    }
    //If defaultAcceptType is not defined then default to application/json
    if(config.defaultAcceptType === undefined) {
        config.defaultAcceptType = 'application/json';
    }

    
    // extract endpoint and path from url
    var invokeUrl = 'https://e3f4z55tn8.execute-api.us-east-2.amazonaws.com/v1';
    var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
    var pathComponent = invokeUrl.substring(endpoint.length);

    var sigV4ClientConfig = {
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        sessionToken: config.sessionToken,
        serviceName: 'execute-api',
        region: config.region,
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var authType = 'NONE';
    if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
        authType = 'AWS_IAM';
    }

    var simpleHttpClientConfig = {
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);
    
    
    
    apigClient.appointmentsGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['token', 'patient_id'], ['body']);
        
        var appointmentsGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/appointments').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, ['token', ]),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['patient_id']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(appointmentsGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.appointmentsPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var appointmentsPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/appointments').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(appointmentsPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.appointmentsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var appointmentsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/appointments').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(appointmentsOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.doctorSearchDoctorGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['token', 'doctor_name', 'cost_low', 'region', 'cost_high', 'patient_id', 'speciality'], ['body']);
        
        var doctorSearchDoctorGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/doctor/search_doctor').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, ['token', ]),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['doctor_name', 'cost_low', 'region', 'cost_high', 'patient_id', 'speciality']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(doctorSearchDoctorGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.doctorSearchDoctorOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var doctorSearchDoctorOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/doctor/search_doctor').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(doctorSearchDoctorOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.doctorViewDoctorGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['view_slots', 'view_appointments', 'doctor_id'], ['body']);
        
        var doctorViewDoctorGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/doctor/view_doctor').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['view_slots', 'view_appointments', 'doctor_id']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(doctorViewDoctorGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.doctorViewDoctorOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var doctorViewDoctorOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/doctor/view_doctor').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(doctorViewDoctorOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.patientGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['token', 'patient_id'], ['body']);
        
        var patientGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/patient').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, ['token', ]),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['patient_id']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(patientGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.patientOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var patientOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/patient').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(patientOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.slotsGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['token', 'doctor_id'], ['body']);
        
        var slotsGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/slots').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, ['token', ]),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['doctor_id']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(slotsGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.slotsPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var slotsPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/slots').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(slotsPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.slotsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var slotsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/slots').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(slotsOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.subsPlanGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['patient_id'], ['body']);
        
        var subsPlanGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/subs_plan').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['patient_id']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(subsPlanGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.subsPlanPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var subsPlanPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/subs_plan').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(subsPlanPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.subsPlanOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var subsPlanOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/subs_plan').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(subsPlanOptionsRequest, authType, additionalParams, config.apiKey);
    };
    

    return apigClient;
};

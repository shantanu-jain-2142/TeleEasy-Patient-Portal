var apigClient = null; //apigClientFactory.newClient();

function fetchPatient(){
    if (sessionStorage.userID != null){
        patient_id = sessionStorage.userID;
        patient_id_text = document.getElementById('patient-id');
        patient_id_text.innerHTML = sessionStorage.userName;
    } else {
        patient_id = "as12";
    }

    apigClient.patientGet({
        token: sessionStorage.token,
        patient_id: patient_id,
    }, {}, {})
    .then(function(result){
        //This is where you would put a success callback
        patient_id_text = document.getElementById('patient-id');
        patient_id_text.innerHTML = result.data.body.first_name + " "+ result.data.body.last_name;

        sessionStorage.userName = first_name + ' ' + last_name;
        sessionStorage.userID = result.data.body.patient_id;
        
    }).catch( function(result){
        //This is where you would put an error callback
    });
}

function getCurrPlan(){
    apigClient.subsPlanGet({
        patient_id: sessionStorage.userID,
    })
    .then(function(result){
        var curr_plan = result.data.body.curr_plan;
        if(curr_plan.subs_plan_plan_id == 1){
            $('#current-mini').text('(Current Plan)');
        }else if(curr_plan.subs_plan_plan_id == 2){
            $('#current-pro').text('(Current Plan)');
        }else if(curr_plan.subs_plan_plan_id == 3){
            $('#current-premium').text('(Current Plan)');
        }
    });
}

function buySubs(subsID){
    apigClient.subsPlanPost({
        patient_id: sessionStorage.userID,
        requested_plan_id: subsID
    },{
        patient_id: sessionStorage.userID,
        requested_plan_id: subsID
    })
    .then(function(result){
        $('#current-mini').text('');
        $('#current-pro').text('');
        $('#current-premium').text('');
        getCurrPlan();
    });
}

$(document).ready(function () {

    apigClient = apigClientFactory.newClient();

    fetchPatient();
    getCurrPlan();
});
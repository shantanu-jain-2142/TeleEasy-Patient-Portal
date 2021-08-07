var apigClient = null; //apigClientFactory.newClient();

function fetchPatient(){
    if (sessionStorage.userID != null){
        patient_id = sessionStorage.userID;
        patient_id_text = document.getElementById('patient-id');
        patient_id_text.innerHTML = sessionStorage.userName;
    } else {
        patient_id = "as123";
    }

    console.log(patient_id);
    console.log(sessionStorage.token);
    apigClient.patientGet({
        token: sessionStorage.token,
        patient_id: patient_id,
    }, {}, {})
    .then(function(result){
        //This is where you would put a success callback
        patient_id_text = document.getElementById('patient-id');
        patient_id_text.innerHTML = result.data.body.first_name + " "+ result.data.body.last_name;

        var first_name = result.data.body.first_name;
        var last_name = result.data.body.last_name;
        var patient_id = result.data.body.patient_id;
        var mobile_num = result.data.body.mobile_no;
        var gender = result.data.body.gender;
        var dob = result.data.body.dob;
        var email = result.data.body.email;
        var address = result.data.body.address;
        var subscription_plan_id = result.data.body.curr_plan.subs_plan_plan_id;
        var subscription_plan_datetime = result.data.body.curr_plan.sub_plan_start_datetime;
        
        subscription_plan_datetime = new Date(Date.parse(subscription_plan_datetime+" UTC")).toLocaleString();

        var subscription_plan_name = '';
        if(subscription_plan_id==1)
            subscription_plan_name = 'Mini';
        else if(subscription_plan_id==2)
            subscription_plan_name = 'Pro';
        else if(subscription_plan_id==3)
            subscription_plan_name = 'Premium';

        sessionStorage.userName = first_name + ' ' + last_name;
        sessionStorage.userID = result.data.body.patient_id;

        $('#first-name').text(first_name);
        $('#last-name').text(last_name);
        $('#mobile-num').text(mobile_num);
        $('#gender').text(gender);
        $('#dob').text(dob);
        $('#email').text(email);
        $('#address').text(address);
        $('#subscription-plan-id').text(subscription_plan_name);
        $('#subscription-plan-date').text(subscription_plan_datetime);
        
    }).catch( function(result){
        //This is where you would put an error callback
    });
}

$(document).ready(function () {

    apigClient = apigClientFactory.newClient();

    fetchPatient();
});
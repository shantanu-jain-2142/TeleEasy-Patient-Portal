var apigClient = null; //apigClientFactory.newClient();

function loginDoctor(){
    var user_id = $('#user-id').val();
    var password = $('#password').val();

    var info = {
        "username": user_id,
        "password":password
    };

    apigClient.doctorLoginPost({}, info, {})
    .then(function(result){
        //This is where you would put a success callback
        console.log(result);

        sessionStorage.doctorID = user_id;
        sessionStorage.token = result.data.data.id_token;
        
        // console.log(result);
        window.location = '/doctor/';
        
    }).catch( function(result){
        //This is where you would put an error callback
        alert('Error!!!');
        console.log(result);
    });
}

function login(){
    loginDoctor();
}

$(document).ready(function () {
    apigClient = apigClientFactory.newClient();
});
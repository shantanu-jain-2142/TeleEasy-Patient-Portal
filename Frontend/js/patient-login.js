var apigClient = null; //apigClientFactory.newClient();

function loginPatient(){
    var user_id = $('#user-id').val();
    var password = $('#password').val();

    var info = {
        "username": user_id,
        "password":password
    };

    apigClient.userLoginPost({}, info, {})
    .then(function(result){
        //This is where you would put a success callback
        console.log(result);

        sessionStorage.userID = user_id;
        sessionStorage.token = result.data.data.id_token;

        window.location = '/patient/';
        
    }).catch( function(result){
        //This is where you would put an error callback
        alert('Error!!!');
        console.log(result);
    });
}

function login(){
    loginPatient();
}

$(document).ready(function () {
    apigClient = apigClientFactory.newClient();
});
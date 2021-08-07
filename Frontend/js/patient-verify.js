var apigClient = null; //apigClientFactory.newClient();

function verifyPatient(){
    var otp = $('#otp').val();
    var user_id = sessionStorage.userID;
    var password = sessionStorage.userPassword;

    var info = {
        "username": user_id,
        "password":password,
        "code":otp
    };

    apigClient.userConfirmSignupPost({}, info, {})
    .then(function(result){
        //This is where you would put a success callback
        // console.log(result);

        window.location = '/patient/login.html';
        
    }).catch( function(result){
        //This is where you would put an error callback
        alert('Error!!!');
        console.log(result);
    });
}

function verify(){
    verifyPatient();
}

$(document).ready(function () {
    apigClient = apigClientFactory.newClient();
});
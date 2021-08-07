var apigClient = null; //apigClientFactory.newClient();

function signupPatient(){
    var first_name = $('#first-name').val();
    var last_name = $('#last-name').val();
    var user_id = $('#user-id').val();
    var mobile_num = $('#mobile-num').val();
    var gender = $('#gender').val();
    var dob = $('#dob').val();
    var email = $('#email').val();
    var address = $('#address').val();
    var password = $('#password').val();

    var info = {
        "username": user_id,
        "password":password,
        "email":email,
        "given_name":first_name,
        "family_name":last_name,
        "address":address,
        "birth_date":dob,
        "gender":gender,
        "phone_no":mobile_num
    };

    apigClient.userSignupPost({}, info, {})
    .then(function(result){
        //This is where you would put a success callback

        if(result.data.error == true){
            alert(result.data.message+"\nPlease choose a new one...");
            console.log(result);
        } else {
            sessionStorage.userName = first_name + ' ' + last_name;
            sessionStorage.userID = user_id;
            sessionStorage.userPassword = password;
            window.location = '/patient/verify.html';
        }

        
    }).catch( function(result){
        //This is where you would put an error callback
        alert('Error!!!');
        console.log(result);
    });
}

function signup(){
    signupPatient();
}

$(document).ready(function () {
    apigClient = apigClientFactory.newClient();
});
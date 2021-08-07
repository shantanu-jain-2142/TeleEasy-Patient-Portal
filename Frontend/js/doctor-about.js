var apigClient = null; //apigClientFactory.newClient();

function fetchDoctor(){
    if (sessionStorage.doctorID != null){
        doctor_id = sessionStorage.doctorID;
        doctor_id_text = document.getElementById('doctor-id');
        doctor_id_text.innerHTML = sessionStorage.doctorName;
    } else {
        doctor_id = "doc_1";
    }

    apigClient.doctorViewDoctorGet({
        doctor_id: doctor_id,
        patient_id: "",
        view_slots: false,
        view_appointments: false,
    }, {}, {})
    .then(function(result){
        //This is where you would put a success callback
        sessionStorage.loginType = 'doctor';

        doctor_id_text = document.getElementById('doctor-id');
        doctor_id_text.innerHTML = result.data.doctor.first_name + " "+ result.data.doctor.last_name;

        var first_name = result.data.doctor.first_name;
        var last_name = result.data.doctor.last_name;
        var doctor_id = result.data.doctor.doctor_id;
        var mobile_num = result.data.doctor.mobile_no;
        var email = result.data.doctor.email;
        var address = result.data.doctor.address;
        var speciality = result.data.doctor.speciality;
        var units_per_appointment = result.data.doctor.units_per_appointment;
        var rating = result.data.doctor.rating;
        var no_of_ratings = result.data.doctor.no_of_ratings;
        var image_url = result.data.doctor.image_url;

        sessionStorage.userName = first_name + ' ' + last_name;
        sessionStorage.doctorID = result.data.doctor.doctor_id;

        $('#first-name').text(first_name);
        $('#last-name').text(last_name);
        $('#mobile-num').text(mobile_num);
        $('#email').text(email);
        $('#address').text(address);
        $('#speciality').text(speciality.join(', '));
        $('#units-per-appointment').text(units_per_appointment);
        if((rating != undefined) && (rating != null)){
            $('#rating').text(rating);
        }
        if((no_of_ratings != undefined) && (no_of_ratings != null)){
            $('#no-of-ratings').text(no_of_ratings);
        }
        if((image_url != undefined) && (image_url != null) && (image_url != '')){
            $('#doctor-image').attr("src", image_url);
        }
    }).catch( function(result){
        //This is where you would put an error callback
    });
}

$(document).ready(function () {

    apigClient = apigClientFactory.newClient();

    fetchDoctor();
});
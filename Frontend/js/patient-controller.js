var apigClient = null; //apigClientFactory.newClient();

function fetchPatient(){
    var patient_id = sessionStorage.userID;
    var token = sessionStorage.token;
    apigClient.patientGet({
        token: token,
        patient_id: patient_id,
    }, {}, {})
    .then(function(result){
        //This is where you would put a success callback
        patient_id = document.getElementById('patient-id');
        patient_id.innerHTML = result.data.body.first_name;
        sessionStorage.userName = result.data.body.first_name + ' ' + result.data.body.last_name;
        sessionStorage.userID = result.data.body.patient_id;
        
    }).catch( function(result){
        //This is where you would put an error callback
    });
}

function fetchAppointments(){
    var patient_id = sessionStorage.userID;
    var token = sessionStorage.token;
    apigClient.appointmentsGet({
        token: token,
        patient_id: patient_id,
    }, {}, {})
    .then(function(result){
        //This is where you would put a success callback
        appointments_list = result.data.results;

        appointments_list.sort((a,b) => {
            var start_datetime_a = new Date(Date.parse(a.start_datetime));
            var start_datetime_b = new Date(Date.parse(b.start_datetime));
            if (start_datetime_a < start_datetime_b)
                return 1;
            else if (start_datetime_a > start_datetime_b)
                return -1;
            return 0;
        });

        var html_result = appointments_list.map(function(appointment){
            var start_datetime = new Date(Date.parse(appointment.start_datetime));
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var curr_datetime = new Date();
            var upcoming = 'Upcoming';
            var videoCallButton = '';

            return apigClient.doctorViewDoctorGet({
                doctor_id: appointment.doctor_id,
                patient_id: "",
                view_slots: false,
                view_appointments: false,
            }, {}, {})
            .then(function(result){
                //This is where you would put a success callback
                var first_name = result.data.doctor.first_name;
                var last_name = result.data.doctor.last_name;
                var address = result.data.doctor.address;
                var speciality = result.data.doctor.speciality;
                var rating = result.data.doctor.rating;

                if(start_datetime<curr_datetime){
                    upcoming = 'Completed';
                } else {
                    videoCallButton = `
                    <button href="#" class="tm-camera-button tm-text-green float-right mb-0"
                        onclick="startCall('${document.getElementById('patient-id').innerHTML}', '${appointment.zoom_meeting_id}', '${appointment.zoom_meeting_password}', 'user-email');"
                    >
                        <span class="fa fa-video-camera" style=" font-size: xx-large; "></span>
                    </button>
                    `;
                }
                return `
                <div class=" tm-timeline-item">
                    <div class="tm-timeline-item-inner">
                        <div class="rounded-circle tm-date-timeline">
                            <b>
                            <h1>${monthNames[start_datetime.getMonth()]}</h1>
                            <h3>${start_datetime.getDate()}</h3>
                            </b>
                        </div>
                        <div class="tm-timeline-connector">
                            <p class="mb-0">&nbsp;</p>
                        </div>
                        <div class="tm-timeline-description-wrap">
                            <div class="tm-bg-dark tm-timeline-description">
                                ${videoCallButton}
                                <h3 class="tm-text-green tm-font-400">${start_datetime.getHours()}:${start_datetime.getMinutes()}</h3>
                                <b><span>Dr. ${first_name} ${last_name}</span></b><br>
                                <i><span class="fa fa-stethoscope"></span>&nbsp;${speciality.join(', ')} (${rating}/5)</i>
                                <p><span class="fa fa-map-marker"></span><span>&nbsp;</span> ${address}</p>
                                <p>${appointment.patient_context}</p>
                                <p class="tm-text-green float-right mb-0">${upcoming} . ${monthNames[start_datetime.getMonth()]} ${start_datetime.getDate()}, ${start_datetime.getFullYear()}</p>
                            </div>
                        </div>
                    </div>
    
                    <div class="tm-timeline-connector-vertical"></div>
                </div>
                `;

            });
        });
        if(html_result.length == 0){
            var start_datetime = new Date();
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $('#appointments-list')[0].innerHTML = `
            <div class=" tm-timeline-item">
                <div class="tm-timeline-item-inner">
                    <div class="rounded-circle tm-date-timeline">
                        <b>
                        <h1>${monthNames[start_datetime.getMonth()]}</h1>
                        <h3>${start_datetime.getDate()}</h3>
                        </b>
                    </div>
                    <div class="tm-timeline-connector">
                        <p class="mb-0">&nbsp;</p>
                    </div>
                    <div class="tm-timeline-description-wrap">
                        <div class="tm-bg-dark tm-timeline-description">
                            <button href="#" class="tm-camera-button tm-text-green float-right mb-0">
                                <span class="fa fa-stethoscope"></span>
                            </button>
                            <h3 class="tm-text-green tm-font-400">Hi there!</h3>
                            <span>How are you feeling today?</span>
                            <p><span class="fa fa-stethoscope"></span><span>&nbsp;</span> No Appointments :)</p>
                            <p>In case you are feeling down and need professional help, go ahead and schedule an appointment and we will take care of the rest...</p>
                            <p class="tm-text-green float-right mb-0">Stay Healthy!</p>
                        </div>
                    </div>
                </div>
            </div>`;
        }
        else{
            // console.log(html_result);
            $('#appointments-list')[0].innerHTML = '';
            html_result.map(function(appointment_promise){
                appointment_promise.then(function(appointment_html){
                    $('#appointments-list')[0].innerHTML = $('#appointments-list')[0].innerHTML + appointment_html;
                });
            });
        }
    }).catch( function(result){
        //This is where you would put an error callback
        var start_datetime = new Date();
        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $('#appointments-list')[0].innerHTML = `
        <div class=" tm-timeline-item">
            <div class="tm-timeline-item-inner">
                <div class="rounded-circle tm-date-timeline">
                    <b>
                    <h1>${monthNames[start_datetime.getMonth()]}</h1>
                    <h3>${start_datetime.getDate()}</h3>
                    </b>
                </div>
                <div class="tm-timeline-connector">
                    <p class="mb-0">&nbsp;</p>
                </div>
                <div class="tm-timeline-description-wrap">
                    <div class="tm-bg-dark tm-timeline-description">
                        <button href="#" class="tm-camera-button tm-text-green float-right mb-0">
                            <span class="fa fa-stethoscope"></span>
                        </button>
                        <h3 class="tm-text-green tm-font-400">Error!</h3>
                        <span>Couldn't fetch your appointments...</span>
                        <p><span class="fa fa-stethoscope"></span><span>&nbsp;</span> Try again later</p>
                        <p>In case you are feeling down and need professional help, go ahead and schedule an appointment and we will take care of the rest...</p>
                        <p class="tm-text-green float-right mb-0">Stay Healthy!</p>
                    </div>
                </div>
            </div>
        </div>`;
    });
}

function startCall(userName, meetingId, meetingPwd, userEmail) {
    sessionStorage.zoom_meeting_id = meetingId;
    sessionStorage.zoom_meeting_password = meetingPwd;
    // alert('Calling '+sessionStorage.userName);
    window.open("/teleconsult");
}

$(document).ready(function () {
    console.log('HERE');

    apigClient = apigClientFactory.newClient();

    fetchPatient();
    fetchAppointments(); 
});
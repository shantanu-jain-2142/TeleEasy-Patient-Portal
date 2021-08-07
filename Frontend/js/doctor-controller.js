var apigClient = null; //apigClientFactory.newClient();

function fetchDoctor(){
    doctor_id = sessionStorage.doctorID;
    apigClient.doctorViewDoctorGet({
        doctor_id: doctor_id,
        patient_id: "",
        view_slots: false,
        view_appointments: false,
    }, {}, {})
    .then(function(result){
        //This is where you would put a success callback
        sessionStorage.loginType = 'doctor';
        sessionStorage.doctorName = result.data.doctor.first_name + ' ' + result.data.doctor.last_name;
        doctor_id = document.getElementById('doctor-id');
        doctor_id.innerHTML = sessionStorage.doctorName;
        sessionStorage.doctorID = result.data.doctor.doctor_id;

        var image_url = result.data.doctor.image_url;
        if((image_url != undefined) && (image_url != null) && (image_url != '')){
            $('#doctor-image').attr("src", image_url);
        }
        
    }).catch( function(result){
        //This is where you would put an error callback
    });
}

function fetchAppointments(){
    doctor_id = sessionStorage.doctorID;
    apigClient.doctorViewDoctorGet({
        doctor_id: doctor_id,
        patient_id: "",
        view_slots: false,
        view_appointments: true,
    }, {}, {})
    .then(function(result){
        //This is where you would put a success callback
        appointments_list = result.data.appointments;
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
            var videoCallButton = ''
            if(start_datetime<curr_datetime){
                upcoming = 'Completed';
            } else {
                videoCallButton = `
                <button href="#" class="tm-camera-button tm-text-green float-right mb-0"
                    onclick="startCall('${sessionStorage.doctorID}', '${appointment.zoom_meeting_id}', '${appointment.zoom_meeting_password}', 'user-email');"
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
                            <span>Patient: ${appointment.patient_id}&nbsp;<span class="fa fa-external-link" onclick="openPatient('${appointment.patient_id}');" style="cursor:pointer;"></span></span>
                            <p><span class="fa fa-map-marker"></span><span>&nbsp;</span> ${result.data.doctor.address}</p>
                            <p>${appointment.patient_context}</p>
                            <p class="tm-text-green float-right mb-0">${upcoming} . ${monthNames[start_datetime.getMonth()]} ${start_datetime.getDate()}, ${start_datetime.getFullYear()}</p>
                        </div>
                    </div>
                </div>

                <div class="tm-timeline-connector-vertical"></div>
            </div>
            `
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
                            <h3 class="tm-text-green tm-font-400">Enjoy!</h3>
                            <span>Take a break...</span><br><br>
                            <p><span class="fa fa-stethoscope"></span><span>&nbsp;</span> You have no consultations :)</p>
                            <p class="tm-text-green float-right mb-0">Stay Healthy!</p>
                        </div>
                    </div>
                </div>
            </div>`;
        }
        else{
            $('#appointments-list')[0].innerHTML = html_result.join('\n');
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
                        <span>Couldn't fetch consultations...</span><br><br>
                        <p><span class="fa fa-stethoscope"></span><span>&nbsp;</span> Please try again later :)</p>
                        <p class="tm-text-green float-right mb-0">Stay Healthy!</p>
                    </div>
                </div>
            </div>
        </div>`;
    });
}

function openPatient(patientID){
    sessionStorage.userID = patientID;
    window.open('/patient/me.html',target='__blank__');
}

function startCall(userName, meetingId, meetingPwd, userEmail) {
    sessionStorage.zoom_meeting_id = meetingId;
    sessionStorage.zoom_meeting_password = meetingPwd;
    // alert('Calling '+sessionStorage.userName);
    window.open("/teleconsult");
}

$(document).ready(function () {

    apigClient = apigClientFactory.newClient();

    fetchDoctor();
    fetchAppointments(); 
});
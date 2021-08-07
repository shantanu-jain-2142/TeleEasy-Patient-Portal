var apigClient = null; //apigClientFactory.newClient();
var selectedSlots = [];
var selectedDoctorID = "";
var selectedDoctorName = "";
var selectedDoctorUnits = 0;

function fetchPatient(){
    var patient_id = sessionStorage.userID;
    var token = sessionStorage.token;
    if (sessionStorage.userID == null){
        apigClient.patientGet({
            token: sessionStorage.token,
            patient_id: patient_id,
        }, {}, {})
        .then(function(result){
            //This is where you would put a success callback
            patient_id_text = document.getElementById('patient-id');
            patient_id_text.innerHTML = result.data.body.first_name;
            sessionStorage.userName = result.data.body.first_name + ' ' + result.data.body.last_name;
            sessionStorage.userID = result.data.body.patient_id;
            
        }).catch( function(result){
            //This is where you would put an error callback
        });
    } else {
        patient_id = document.getElementById('patient-id');
        patient_id.innerHTML = sessionStorage.userName;
    }
}

function fetchDoctors(name, speciality, region){
    selectedSlots = [];
    selectedDoctorID = "";
    selectedDoctorName = "";
    selectedDoctorUnits = 0;
    if ((name==undefined) || (name==null)){
        name = '';
    }
    if ((speciality==undefined) || (speciality==null)){
        speciality = '';
    }
    if ((region==undefined) || (region==null)){
        region = '';
    }
    apigClient.doctorSearchDoctorGet({
        token: sessionStorage.token,
        patient_id: sessionStorage.userID,
        doctor_name: name,
        region: region,
        speciality: speciality,
        cost_low: 0,
        cost_high: 10
    }, {}, {})
    .then(function(result){
        //This is where you would put a success callback
        doctors_list = result.data;
        var html_result = doctors_list.map(function(doctor){
            var doc_image = doctor.image_url;
            if ((doc_image==undefined) || (doc_image==null))
                doc_image = '/img/doctor.png';
            var doc_rating = doctor.rating;
            if ((doc_rating==undefined) || (doc_rating==null))
                doc_rating = '?';
            var doc_num_rating = doctor.no_of_ratings;
            if ((doc_num_rating==undefined) || (doc_num_rating==null))
                doc_num_rating = '0';
            return `
            <div class=" tm-doctor-timeline-item">
                <div class="tm-timeline-item-inner">
                    <div class="rounded-circle tm-doctor-timeline">
                        <img src="${doc_image}" class="rounded-circle doctor-image">
                    </div>
                    <div class="tm-timeline-connector">
                        <p class="mb-0">&nbsp;</p>
                    </div>
                    <div class="tm-timeline-description-wrap">
                        <div class="tm-bg-dark tm-doctor-timeline-description">
                            <button href="#" class="tm-camera-button tm-text-green float-right mb-0"
                            onclick="fetchDoctorSlots('${doctor.doctor_id}','${doctor.first_name} ${doctor.last_name}',${doctor.units_per_appointment});"
                            >
                                &nbsp;<span class="fa fa-arrow-circle-o-right" style=" font-size: xx-large; "></span>
                            </button>
                            <h3 class="tm-text-green tm-font-400">Dr. ${doctor.first_name} ${doctor.last_name}</h3>
                            <p><span class="fa fa-map-marker"></span><span>&nbsp;</span> ${doctor.address}</p>
                            <span>Speciality - ${doctor.speciality.join(",")}</span>
                            <p>Units per appointment - ${doctor.units_per_appointment}</p>
                            <p class="tm-text-green float-right mb-0">${doc_rating}/5 (${doc_num_rating})</p>
                        </div>
                    </div>
                </div>
                <div class="tm-timeline-connector-vertical"></div>
            </div>
            `;
        });
        if(html_result.length == 0){
            $('#doctors-list')[0].innerHTML = `
            <div class=" tm-doctor-timeline-item">
                <div class="tm-timeline-item-inner">
                    <div class="tm-timeline-description-wrap">
                        <div class="tm-bg-dark tm-doctor-timeline-description">
                            <button href="#" class="tm-camera-button tm-text-green float-right mb-0">
                                <span class="fa fa-search"></span>
                            </button>
                            <h3 class="tm-text-green tm-font-400">No results found!</h3>
                            <p><span class="fa fa-eye"></span><span>&nbsp;looks like you were too specific...</span> </p>
                            <p>You could narrow down your search filters and try again. If you have any suggestions for us, please do leave a message...</p>
                            <p class="tm-text-green float-right mb-0">Stay Healthy!</p>
                        </div>
                    </div>
                </div>
            </div>`;
        }
        else{
            $('#doctors-list')[0].innerHTML = html_result.join('\n');
        }
    }).catch( function(result){
        //This is where you would put an error callback
        $('#doctors-list')[0].innerHTML = `
        <div class=" tm-doctor-timeline-item">
            <div class="tm-timeline-item-inner">
                <div class="tm-timeline-description-wrap">
                    <div class="tm-bg-dark tm-doctor-timeline-description">
                        <button href="#" class="tm-camera-button tm-text-green float-right mb-0">
                            <span class="fa fa-search"></span>
                        </button>
                        <h3 class="tm-text-green tm-font-400">Whoops!</h3>
                        <p><span class="fa fa-eye"></span><span>&nbsp;looks like we ran into an error...</span> </p>
                        <p>Please try again later</p>
                        <p class="tm-text-green float-right mb-0">Stay Healthy!</p>
                    </div>
                </div>
            </div>
        </div>`;
    });
}

function fetchDoctorSlots(doctor_id, doctor_name, doctor_units){
    selectedSlots = [];
    selectedDoctorID = doctor_id;
    selectedDoctorName = doctor_name;
    selectedDoctorUnits = doctor_units;
    apigClient.slotsGet({
        token: sessionStorage.token,
        doctor_id: doctor_id,
    }, {}, {})
    .then(function(result){
        //This is where you would put a success callback
        slots_list = result.data;
        var filtered_slots_list = slots_list.filter(function(slot) {
            var curr_date = new Date();
            var start_datetime = new Date(Date.parse(slot.start_datetime.S));
            return ((slot.valid.BOOL==true) && (start_datetime>=curr_date));
        });
        var html_result = filtered_slots_list.map(function(slot){
            var start_datetime = new Date(Date.parse(slot.start_datetime.S));
            var end_datetime = new Date(Date.parse(slot.end_datetime.S));
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `
            <div type="slot-box" class="tm-bg-other tm-doctor-slot-description" onClick="clickSlot(this);">
                <input type="hidden" name="slot-datetime" value="${slot.start_datetime.S}"/>
                <p><span class="fa fa-calendar"></span><span>&nbsp;</span> ${monthNames[start_datetime.getMonth()]} ${start_datetime.getDate()}, ${start_datetime.getFullYear()}</p>
                <p><span class="fa fa-clock-o"></span><span>&nbsp;</span> ${start_datetime.getHours()}:${start_datetime.getMinutes()} - ${end_datetime.getHours()}:${end_datetime.getMinutes()}</p>
                <p><span class="fa fa-hourglass-start"></span><span>&nbsp;</span> 15 mins</p>
            </div>
            `;
        });
        if(html_result.length == 0){
            $('#slots-list')[0].innerHTML = `
            <div class="tm-bg-other tm-doctor-slot-description">
                <p><span class="fa fa-stethoscope"></span><span>&nbsp;</span> No Slots Added!</p>
                <p><span class="fa fa-hourglass-start"></span><span>&nbsp;</span> doctor unavailable...</p>
            </div>`;
        }
        else{
            $('#slots-list')[0].innerHTML = html_result.join('\n');
        }
    }).catch( function(result){
        //This is where you would put an error callback
        $('#slots-list')[0].innerHTML = `
        <div class="tm-bg-other tm-doctor-slot-description">
            <p><span class="fa fa-stethoscope"></span><span>&nbsp;</span> Error!</p>
            <p><span class="fa fa-hourglass-start"></span><span>&nbsp;</span> please try again...</p>
        </div>`;
    });
}

function clickSlot(thisele) {
    console.log(thisele.querySelector('input').value);
    if (selectedSlots.indexOf(thisele.querySelector('input').value)==-1){
        selectedSlots.push(thisele.querySelector('input').value);
        thisele.style.backgroundColor = "#973131";
    }else{
        selectedSlots.splice(selectedSlots.indexOf(thisele.querySelector('input').value),1);
        thisele.style.backgroundColor = "#215353";
    }
    
}

$( "#search-doctor" ).click(function() {
    // alert('Searching: '+$('#doctor-name')[0].value+' '+$('#doctor-speciality')[0].value+' '+$('#doctor-region')[0].value);
    fetchDoctors($('#doctor-name')[0].value, $('#doctor-speciality')[0].value, $('#doctor-region')[0].value);
});

$( "#book-slots" ).click(function() {
    // alert('Searching: '+$('#doctor-name')[0].value+' '+$('#doctor-speciality')[0].value+' '+$('#doctor-region')[0].value);
    if(selectedDoctorID==""){
        alert('Select a Doctor!');
        return;
    }
    else if(selectedSlots.length==0){
        alert('Select Slots Please!');
        return;
    }
    var modal = $('#bookAptModal');
    modal.fadeIn();
    modal.find('#book-doctor-name').text('Dr. '+selectedDoctorName);
    var html_result = selectedSlots.map(function(slot){
        var start_datetime = new Date(Date.parse(slot));
        var end_datetime = new Date(start_datetime.getTime() + 15*60000);;
        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `
        <div type="slot-box" class="tm-bg-other tm-doctor-slot-description" onClick="clickSlot(this);">
            <p><span class="fa fa-calendar"></span><span>&nbsp;</span> ${monthNames[start_datetime.getMonth()]} ${start_datetime.getDate()}, ${start_datetime.getFullYear()}</p>
            <p><span class="fa fa-clock-o"></span><span>&nbsp;</span> ${start_datetime.getHours()}:${start_datetime.getMinutes()} - ${end_datetime.getHours()}:${end_datetime.getMinutes()}</p>
            <p><span class="fa fa-hourglass-start"></span><span>&nbsp;</span> 15 mins</p>
        </div>
        `;
    });
    modal.find('#book-slots-list').html(html_result);
    modal.find('#book-doctor-units').text(selectedSlots.length*selectedDoctorUnits);
});

function bookAppointment(){
    var patient_id = sessionStorage.userID;
    var doctor_id = selectedDoctorID;
    var patient_context = $('#bookAptModal').find('#patient-text').val();
    var start_datetime = selectedSlots[0];
    $('#bookAptModal').fadeOut();
    // alert(`Booking:\nPat-${patient_id},\nDoc-${doctor_id},\nSlot-${start_datetime},\nCxt-${patient_context}`);
    apigClient.appointmentsPost({}, {
        patient_id: patient_id,
        doctor_id: doctor_id,
        patient_context: patient_context,
        start_datetime: start_datetime,
    }, {})
    .then(function(result){
        //This is where you would put a success callback
        $('#bookAptModal').fadeOut();
        alert('Slot Booked Succesfully');
    }).catch( function(result){
        //This is where you would put an error callback
    });
}

$(document).ready(function () {
    console.log('HERE');

    apigClient = apigClientFactory.newClient();

    fetchPatient();
    fetchDoctors('','','');
});
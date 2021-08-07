var apigClient = null; //apigClientFactory.newClient();
var selectedDate = "";
var selectedTime = "";
var addedSlots = [];

function fetchDoctor(){
    apigClient.doctorViewDoctorGet({
        doctor_id: sessionStorage.doctorID,
        patient_id: "",
        view_slots: false,
        view_appointments: false,
    }, {}, {})
    .then(function(result){
        //This is where you would put a success callback
        sessionStorage.loginType = 'doctor';
        sessionStorage.doctorName = result.data.doctor.first_name + ' ' + result.data.doctor.last_name;
        doctor_id_text = document.getElementById('doctor-id');
        doctor_id_text.innerHTML = sessionStorage.doctorName;
        sessionStorage.doctorID = result.data.doctor.doctor_id;

        var image_url = result.data.doctor.image_url;
        if((image_url != undefined) && (image_url != null) && (image_url != '')){
            $('#doctor-image').attr("src", image_url);
        } 
    }).catch( function(result){
        //This is where you would put an error callback
    });
}

function fetchDoctorSlots(){
    doctor_id = sessionStorage.doctorID;
    apigClient.doctorViewDoctorGet({
        doctor_id: doctor_id,
        patient_id: "",
        view_slots: true,
        view_appointments: false,
    }, {}, {})
    .then(function(result){
        //This is where you would put a success callback
        slots_list = result.data.slots;
        var filtered_slots_list = slots_list.filter(function(slot) {
            var curr_date = new Date();
            var start_datetime = new Date(Date.parse(slot.start_datetime));
            return ((slot.valid==true) && (start_datetime>=curr_date));
        });
        var html_result = filtered_slots_list.map(function(slot){
            var start_datetime = new Date(Date.parse(slot.start_datetime));
            var end_datetime = new Date(Date.parse(slot.end_datetime));
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `
            <div type="slot-box" class="tm-bg-other tm-doctor-slot-description" onClick="clickSlot(this);">
                <input type="hidden" name="slot-datetime" value="${slot.start_datetime}"/>
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

$( "#add-slots" ).click(function() {
    // alert('Searching: '+$('#doctor-name')[0].value+' '+$('#doctor-speciality')[0].value+' '+$('#doctor-region')[0].value);
    if(selectedDate==""){
        alert('Select a Date to add slots on!');
        return;
    }
    else if($('#selected-slot-time').val()==""){
        alert('Select Slots Time!');
        return;
    }
    var start_datetime = new Date(Date.parse(selectedDate+', '+$('#selected-slot-time').val()));
    var end_datetime = new Date(start_datetime.getTime() + 15*60000);;
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var html_result = `
    <div type="slot-box" class="tm-bg-other tm-doctor-slot-description" onClick="clickSlot(this);">
        <p><span class="fa fa-calendar"></span><span>&nbsp;</span> ${monthNames[start_datetime.getMonth()]} ${start_datetime.getDate()}, ${start_datetime.getFullYear()}</p>
        <p><span class="fa fa-clock-o"></span><span>&nbsp;</span> ${start_datetime.getHours()}:${start_datetime.getMinutes()} - ${end_datetime.getHours()}:${end_datetime.getMinutes()}</p>
        <p><span class="fa fa-hourglass-start"></span><span>&nbsp;</span> 15 mins</p>
    </div>
    `;
    $('#slots-to-add-list').html($('#slots-to-add-list').html()+html_result);
    addedSlots.push({
        "doctor_id": sessionStorage.doctorID,
        "start_datetime": start_datetime.toLocaleString('en-US', { hour12: false }).split(':',2).join(':'),
        "end_datetime": end_datetime.toLocaleString('en-US', { hour12: false }).split(':',2).join(':'),
        "valid": true
    });
});

$( "#upload-slots" ).click(function() {
    apigClient.slotsPost({}, {
        slots: addedSlots,
    }, {})
    .then(function(result){
        //This is where you would put a success callback
        $('#slots-to-add-list').html('');
        fetchDoctorSlots();
        // alert('Slot Uploaded Succesfully');
    }).catch( function(result){
        //This is where you would put an error callback
        alert('Error!!!\nCould not add slots!')
    });
});

var Cal = function(divId) {
    //Store div id
    this.divId = divId;

    // Days of week, starting on Sunday
    this.DaysOfWeek = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];

    // Months, stating on January
    this.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

    // Set the current month, year
    var d = new Date();

    this.currMonth = d.getMonth();
    this.currYear = d.getFullYear();
    this.currDay = d.getDate();

};

// Goes to next month
Cal.prototype.nextMonth = function() {
    if ( this.currMonth == 11 ) {
        this.currMonth = 0;
        this.currYear = this.currYear + 1;
    }
    else {
        this.currMonth = this.currMonth + 1;
    }
    this.showcurr();
};

// Goes to previous month
Cal.prototype.previousMonth = function() {
    if ( this.currMonth == 0 ) {
        this.currMonth = 11;
        this.currYear = this.currYear - 1;
    }
    else {
        this.currMonth = this.currMonth - 1;
    }
    this.showcurr();
};

    // Show current month
Cal.prototype.showcurr = function() {
    this.showMonth(this.currYear, this.currMonth);
};

// Show month (year, month)
Cal.prototype.showMonth = function(y, m) {
    var d = new Date()
    // First day of the week in the selected month
    , firstDayOfMonth = new Date(y, m, 1).getDay()
    // Last day of the selected month
    , lastDateOfMonth =  new Date(y, m+1, 0).getDate()
    // Last day of the previous month
    , lastDayOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();


    var html = '<table>';

    // Write selected month and year
    html += '<thead><tr>';
    html += '<td colspan="7">' + this.Months[m] + ' ' + y + '</td>';
    html += '</tr></thead>';


    // Write the header of the days of the week
    html += '<tr class="days">';
    for(var i=0; i < this.DaysOfWeek.length;i++) {
        html += '<td>' + this.DaysOfWeek[i] + '</td>';
    }
    html += '</tr>';

    // Write the days
    var i=1;
    do {

        var dow = new Date(y, m, i).getDay();

        // If Sunday, start new row
        if ( dow == 0 ) {
            html += '<tr>';
        }
        // If not Sunday but first day of the month
        // it will write the last days from the previous month
        else if ( i == 1 ) {
            html += '<tr>';
            var k = lastDayOfLastMonth - firstDayOfMonth+1;
            for(var j=0; j < firstDayOfMonth; j++) {
                html += '<td class="not-current">' + k + '</td>';
                k++;
            }
        }

        // Write the current day in the loop
        var chk = new Date();
        var chkY = chk.getFullYear();
        var chkM = chk.getMonth();
        var clickedDate = (this.currMonth+1)+'/'+i+'/'+this.currYear;
        if (chkY == this.currYear && chkM == this.currMonth && i == this.currDay) {
            html += '<td onclick="setApptDate(\''+clickedDate+'\');" class="today">' + i + '</td>';
        } else {
            html += '<td onclick="setApptDate(\''+clickedDate+'\');" class="normal">' + i + '</td>';
        }
        // If Saturday, closes the row
        if ( dow == 6 ) {
            html += '</tr>';
        }
        // If not Saturday, but last day of the selected month
        // it will write the next few days from the next month
        else if ( i == lastDateOfMonth ) {
            var k=1;
            for(dow; dow < 6; dow++) {
                html += '<td class="not-current">' + k + '</td>';
                k++;
            }
        }

        i++;
    } while(i <= lastDateOfMonth);

    // Closes table
    html += '</table>';

    // Write HTML to the div
    document.getElementById(this.divId).innerHTML = html;
};

// Get element by id
function getId(id) {
    return document.getElementById(id);
}

function setApptDate(clickedDate){
    selectedDate = clickedDate;
    $('#selected-slot-date').text(clickedDate);
}



$(document).ready(function () {
    apigClient = apigClientFactory.newClient();

    // Start calendar
    var c = new Cal("divCal");			
    c.showcurr();

    // Bind next and previous button clicks
    getId('btnNext').onclick = function() {
        c.nextMonth();
    };
    getId('btnPrev').onclick = function() {
        c.previousMonth();
    };

    // start time picker
    var now = new Date();
    $('#selected-slot-time').val(now.getHours()+':'+now.getMinutes());
    $('.clockpicker').clockpicker({donetext:"Select Time"});

    fetchDoctor();
    fetchDoctorSlots();
});
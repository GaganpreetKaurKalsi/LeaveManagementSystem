
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCYh5aMD-qS00iHgEiAUh8n9HqLXS0Tpsk",
    authDomain: "leavemanagement-system.firebaseapp.com",
    projectId: "leavemanagement-system",
    storageBucket: "leavemanagement-system.appspot.com",
    messagingSenderId: "1026139198818",
    appId: "1:1026139198818:web:38a3e4895e47bc4db1083b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


var element = document.querySelector(".right");
document.querySelector(".left").style.height = getComputedStyle(element).height;
document.querySelector(".container-register").style.height = getComputedStyle(element).height;
console.log(getComputedStyle(element).height);



var user = 0
function admin(){
    user = 1;
    var element = document.getElementById("admin-fields");
    element.style.visibility = "visible";
    element.style.display = "block";

    var element = document.getElementById("student-fields");
    element.style.visibility = "collapse";
    element.style.display = "none";

    var element = document.getElementById("student-btn");
    element.style.visibility = "visible";
    element.style.display = "block";

    var element = document.getElementById("admin-btn");
    element.style.visibility = "collapse";
    element.style.display = "none";
}
function student(){
    user = 0;
    var element = document.getElementById("student-fields");
    element.style.visibility = "visible";
    element.style.display = "block";

    var element = document.getElementById("admin-fields");
    element.style.visibility = "collapse";
    element.style.display = "none";

    var element = document.getElementById("admin-btn");
    element.style.visibility = "visible";
    element.style.display = "block";

    var element = document.getElementById("student-btn");
    element.style.visibility = "collapse";
    element.style.display = "none";
}

function submitStudentData(event){
    event.preventDefault();
    var name = document.getElementById("name");
    var uid = document.getElementById("uid");
    var email = document.getElementById("email");
    var mobile = document.getElementById("mobile");
    var password = document.getElementById("pwd");
    var confirm_pwd = document.getElementById("confirm-pwd");

    if(password.value !== confirm_pwd.value){
        alert("Passwords did not match. Please try again!");
    }
    else{
        var uid_db;
        firebase.database().ref('StudentsData/'+uid.value).on('value', function(snapshot){
            uid_db = snapshot.val().uid; 
        });
        console.log(uid_db);
        if(uid_db === undefined){
            firebase.database().ref('StudentsData/'+uid.value).set({
                name : name.value,
                uid : uid.value,
                email : email.value,
                mobile : mobile.value,
                password : password.value
            });
            alert("Registered Successfully!");
            clearFields(name, email, mobile, password, confirm_pwd);
        }
        else{
            alert("Student registered already!");
            clearFields(name, email, mobile, password, confirm_pwd);
        }
    }
}

function clearFields(name, email, mobile, password, confirm_pwd){
    name.value = "";
    email.value = "";
    mobile.value = "";
    password.value = "";
    confirm_pwd = "";
}

var LoggedId;
var FullName;

function studentLogin(){
    var userId = document.getElementById("username");
    var pwd = document.getElementById("password");
    var uid;
    var password;

    firebase.database().ref('StudentsData/'+userId.value).on('value', function(snapshot){
        uid = snapshot.val().uid;
        password = snapshot.val().password; 
        FullName = snapshot.val().name;
    });
    setTimeout(function(){
        console.log(userId.value, pwd.value);
        console.log(uid, password);
        console.log(FullName)
        if(userId.value === uid && pwd.value === password){
            LoggedId = uid;
            localStorage.setItem(LoggedId, true);
            window.location.href = "/mainPage.html" + "?uid="+LoggedId;
        }
        else{
            alert("UserId or Password Incorrect");
        }
    }, 2000);
    
}

function adminLogin(){
    var userId = document.getElementById("adminId");
    var pwd = document.getElementById("pwd");
    var id ;
    var password;
    firebase.database().ref('Admin').on('value', function(snapshot){
        id = snapshot.val().userId;
        password = snapshot.val().pwd; 
    });
    setTimeout(function(){
        if(userId.value === id && pwd.value === password){
            localStorage.setItem(userId.value, true);
            window.location.href = "/mainPage.html"+ "?uid="+userId.value;
        }
        else{
            alert("UserId or Password Incorrect");
        }
    }, 2000);
    
}

function user(){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");
    LoggedId = queries[0].split("=")[1];

    if(LoggedId=="admin"){
        document.getElementById("LoggedUser").innerHTML = `<i class="fas fa-user"></i> `+ " Admin";
        adminApprove();
    }
    else{
        firebase.database().ref('StudentsData/'+LoggedId).on('value', function(snapshot){
                FullName = snapshot.val().name;
                document.getElementById("LoggedUser").innerHTML = `<i class="fas fa-user"></i> `+ FullName;
        });   
    }
}

function applyLeave(){
    var date = new Date();
    var key = date.getDate()+"-"+String((date.getMonth())+1)+"-"+date.getFullYear()+"_"+date.getHours()+"-"+date.getMinutes()+"-"+date.getSeconds();
    console.log(key);
    var type = document.getElementById("leaveType");
    var startDate = document.getElementById("start-date");
    var endDate = document.getElementById("end-date");
    var reason = document.getElementById("leave-reason");
    
    firebase.database().ref('Leaves/'+LoggedId+"/"+key).set({
        Leavetype : type.value,
        startDate : startDate.value,
        endDate : endDate.value,
        reason : reason.value,
        status : "pending" 
    });

    alert("Leave applied successfully");

    type.value = "";
    startDate.value = "";
    endDate.value = "";
    reason.value = "";
}

function getLeaves(){
    var formLeave = document.getElementById("form-leave");
    formLeave.style.visibility = "collapse";
    formLeave.style.display = "none";

    var leaveHistory = document.getElementById("leave-history");
    leaveHistory.style.visibility = "visible";
    leaveHistory.style.display = "block";

    var backBtn = document.getElementById("back-btn");
    backBtn.style.visibility = "visible";
    backBtn.style.display = "block";

    var data;
    var type, startDate, endDate, reason, status;
    firebase.database().ref('Leaves/'+LoggedId).on('value', function(snapshot){
        console.log(snapshot.val());
        var val = snapshot.val();
        console.log(val);
        if(val!=undefined && val!=null){
            console.log(val!=undefined && val!=null);
            data = Object.values(snapshot.val());
        }
        else{
            data = "undefined";
        }
    });
    
    document.getElementById("leave-history").innerHTML = "";
    document.getElementById("leave-history").innerHTML = `<h2 class="leave-head" id = "leave-head">Leave History</h2>`;
    setTimeout(function(){
        console.log("Ensuring that the code runs after data is retreived");
        console.log(data);
        if(data === "undefined"){
            document.getElementById("leave-head").insertAdjacentHTML("afterend", `<div class="no-leave">
                <p><i class="fas fa-info-circle"></i> No leaves applied</p>
            </div>`);
        }
        else{
            for(key in data){
                type = data[key].Leavetype;
                startDate = data[key].startDate;
                endDate = data[key].endDate;
                reason = data[key].reason;
                status = data[key].status;
                console.log(type, startDate, endDate, reason);
        
                var color;
                if(status === "rejected"){
                    color = "#DC2626";
                }
                else if(status === "pending"){
                    color = "#EA580C";
                }
                else{
                    color = "#16A34A";
                }
        
                document.getElementById("leave-head").insertAdjacentHTML("afterend", `<div class="leave-item">
                <span class="status" style = "color:${color}"><i class="far fa-check-circle tick"></i> ${status}</span>
                <h3 id = "leave-type">${type} Leave</h3>
                <small class="date" id = "date">${startDate} to ${endDate}</small>
                <p class="reason" id = "reason"><span>Reason - </span> ${reason}</p>
                </div>`);
            }
        }
        
    }
    , 1000);
    
    
}

function back(){
    var formLeave = document.getElementById("form-leave");
    formLeave.style.visibility = "visible";
    formLeave.style.display = "block";

    var leaveHistory = document.getElementById("leave-history");
    leaveHistory.style.visibility = "collapse";
    leaveHistory.style.display = "none";

    var backBtn = document.getElementById("back-btn");
    backBtn.style.visibility = "collapse";
    backBtn.style.display = "none";
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}



function adminApprove(){
    var student = document.getElementById("student");
    student.style.visibility = "collapse";
    student.style.display = "none";

    var adminleaves = document.getElementById("admin-leaves");
    adminleaves.style.visibility = "visible";
    adminleaves.style.display = "block";

    var data;
    firebase.database().ref('Leaves').on('value', function(snapshot){
        // console.log(snapshot.val());
        var val = snapshot.val();
        // console.log(val);
        if(val!=undefined && val!=null){
            // console.log(val!=undefined && val!=null);
            data = snapshot.val();
            console.log("Data from inside db funtion : "+data);
        }
        else{
            data = "undefined";
        }
    });

    var uid_name = new Object();
    console.log("Going to read name");
    console.log(data);
    // uid_name["19BCS6047"] = "Gaganpreet Kaur Kalsi"
    setTimeout(function(){
        console.log(data);
        for(id in data){
            console.log(id);
            firebase.database().ref('StudentsData/'+id).on('value', function(snapshot){
                var name = snapshot.val().name;
                var currentid = snapshot.val().uid;
                console.log("This : = "+currentid, name);
                uid_name[`${currentid}`] = name;
            });
        }
        // sleep(2000);
    },2000);
    setTimeout(function(){
        // console.log("Ensuring that the code runs after data is retreived");
        // console.log(data);
        if(data === "undefined"){
            document.getElementById("leave-head").insertAdjacentHTML("afterend", `<div class="no-leave">
                <p><i class="fas fa-info-circle"></i> No leaves applied</p>
            </div>`);
        }
        else{
            // console.log("Entered in else");
            var uid, name, type, startDate, endDate, reason, status, date_time;

            for(uid in data){
                // console.log("UID : "+uid);
                  console.log(uid_name[uid]);
                // sleep(10000);
                for(key in data[uid]){
                    date_time = key;
                    console.log(key);
                    type = data[uid][key].Leavetype;
                    startDate = data[uid][key].startDate;
                    endDate = data[uid][key].endDate;
                    reason = data[uid][key].reason;
                    status = data[uid][key].status;
                    // console.log(type, startDate, endDate, reason);
                    var color;
                    if(status === "pending"){
                        color = "#DC2626";
                    }
                    else{
                        color = "#16A34A";
                    }
                    if(status === "pending"){
                        document.getElementById("container-head").insertAdjacentHTML("afterend", `<div class="leave-item" id="${uid}${date_time}">
                        <h2 class="uid">${uid}</h2>
                        <h3 class="name">${uid_name[uid]}</h3>
                        <h4 id = "leave-type">${type} Leave</h4>
                        <small class="date" id = "date">${startDate} to ${endDate}</small>
                        <p class="reason" id = "reason"><span>Reason - </span> ${reason}</p>
                        <button class="btn button approve" id = "approve-btn" onclick="approve('${uid}', '${date_time}')">Approve</button>
                        <button class="btn button reject" id = "reject-btn" onclick="reject('${uid}', '${date_time}')">Reject</button>
                        </div>`);
                    }
                    
                    // console.log(name, uid, type, startDate, endDate, reason);
                }
                
            }
        }
    }, 3000);
}

function approve(uid, date_time){
    firebase.database().ref('Leaves/'+uid+'/'+date_time).update({
        status : "Approved"
    });

    document.getElementById(uid+date_time).style.borderColor = "#16A34A";
    document.getElementById(uid+date_time).querySelector("#approve-btn").disabled = true;
    document.getElementById(uid+date_time).querySelector("#reject-btn").disabled = true;
    document.getElementById(uid+date_time).querySelector("#approve-btn").style.backgroundColor = "rgba(136, 136, 136, 0.966)";
    document.getElementById(uid+date_time).querySelector("#reject-btn").style.backgroundColor = "rgba(136, 136, 136, 0.966)";
    document.getElementById(uid+date_time).querySelector("#approve-btn").style.cursor = "auto";
    document.getElementById(uid+date_time).querySelector("#reject-btn").style.cursor = "auto";
}

function reject(uid, date_time){
    firebase.database().ref('Leaves/'+uid+'/'+date_time).update({
        status : "Rejected"
    });
    document.getElementById(uid+date_time).style.borderColor = "#DC2626";
    document.getElementById(uid+date_time).querySelector("#approve-btn").disabled = true;
    document.getElementById(uid+date_time).querySelector("#reject-btn").disabled = true;
    document.getElementById(uid+date_time).querySelector("#approve-btn").style.backgroundColor = "rgba(136, 136, 136, 0.966)";
    document.getElementById(uid+date_time).querySelector("#reject-btn").style.backgroundColor = "rgba(136, 136, 136, 0.966)";
    document.getElementById(uid+date_time).querySelector("#approve-btn").style.cursor = "auto";
    document.getElementById(uid+date_time).querySelector("#reject-btn").style.cursor = "auto";
}

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

window.addEventListener('load',function(){
    document.addEventListener('click', (evt)=>{
        var e1 = document.getElementById("dropit");
        var e2 = document.getElementById("dropoptions");
        var e3 = document.getElementById("dropicon");
        console.log(evt.target);
        if(evt.target === e1 || evt.target === e3){
            dropdown();
        }
        else if(evt.target !== e1 && evt.target !== e2 && evt.target !== e3){
            var ele = document.getElementById("dropoptions");
            ele.style.visibility = "collapse";
            ele.style.display = "none";
            var ele = document.getElementById("dropoptions");
            ele.classList.add("hide");
        }
    });
});

var element = document.querySelector(".right");
document.querySelector(".left").style.height = getComputedStyle(element).height;
document.querySelector(".container-register").style.height = getComputedStyle(element).height;
console.log(getComputedStyle(element).height);



// Script running on registration.html
function submitStudentData(event){
    event.preventDefault();
    var name = document.getElementById("name");
    var uid = document.getElementById("uid");
    var dob = document.getElementById("dob");
    var email = document.getElementById("email");
    var mobile = document.getElementById("mobile");
    var password = document.getElementById("pwd");
    var confirm_pwd = document.getElementById("confirm-pwd");

    var img = document.getElementById("uploadimg").files[0];
    var uploadTask = firebase.storage().ref('Images/'+img.name).put(img);

    if(password.value !== confirm_pwd.value){
        alert("Passwords did not match. Please try again!");
    }
    else{
        var uid_db;
        firebase.database().ref('StudentsData/'+uid.value.toUpperCase()).on('value', function(snapshot){
            uid_db = snapshot.val().uid; 
        });

        setTimeout(function(){
            
            if(uid_db === undefined){
                
                uploadTask.on('state_changed', function(snapshot){
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                function(error){
                    alert('Error in saving the image. Please try again!');
                },
                function(){
                    uploadTask.snapshot.ref.getDownloadURL().then(function(url){
                        ImgUrl = url;
                        firebase.database().ref('StudentsData/'+uid.value.toUpperCase()).set({
                            name : name.value,
                            uid : uid.value.toUpperCase(),
                            dob : dob.value,
                            email : email.value,
                            mobile : mobile.value,
                            password : password.value,
                            img : ImgUrl
                        });
                        alert("Registered Successfully!");
                        clearFields(name, email, mobile, password, confirm_pwd, uid, dob, img);
                        document.getElementById("uploadimg").value = "";
                    }
                );
                });   
                
            }
            else{
                alert("Student registered already!");
                clearFields(name, email, mobile, password, confirm_pwd, uid, dob);
                document.getElementById("uploadimg").value = "";
            }
            
        },2000);
        
    }
}

function clearFields(name, email, mobile, password, confirm_pwd, uid, dob){
    name.value = "";
    email.value = "";
    mobile.value = "";
    password.value = "";
    confirm_pwd.value = "";
    uid.value = "";
    dob.value = ""; 
}




// Scripts running on index.html

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

var LoggedId;
var FullName;

function studentLogin(){
    var userId = document.getElementById("username");
    var pwd = document.getElementById("password");
    var uid;
    var password;

    firebase.database().ref('StudentsData/'+userId.value.toUpperCase()).on('value', function(snapshot){
        uid = snapshot.val().uid;
        password = snapshot.val().password; 
        FullName = snapshot.val().name;
    });
    setTimeout(function(){
        console.log(userId.value, pwd.value);
        console.log(uid, password);
        console.log(FullName)
        if(userId.value.toUpperCase() === uid && pwd.value === password){
            LoggedId = uid;
            const now = new Date()
            localStorage.setItem(LoggedId, now.getTime() + 6000000)
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
            const now = new Date()
            localStorage.setItem(userId.value, now.getTime() + 6000000)
            window.location.href = "/mainPage.html"+ "?uid="+userId.value;
        }
        else{
            alert("UserId or Password Incorrect");
        }
    }, 2000);
    
}

// function sleep(milliseconds) {
//     const date = Date.now();
//     let currentDate = null;
//     do {
//       currentDate = Date.now();
//     } while (currentDate - date < milliseconds);
// }

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
                    if(status === "Pending"){
                        color = "#DC2626";
                    }
                    else{
                        color = "#16A34A";
                    }
                    if(status === "Pending"){
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


function forgotPwdPopUp(){
    var ele1 = document.querySelector(".coverage");
    var ele2 = document.querySelector(".forgot-container");
    console.log(ele1, ele2);
    ele1.style.visibility = "visible";
    ele1.style.display = "block";
    ele2.style.visibility = "visible";
    ele2.style.display = "block";

    document.querySelector(".verify").querySelector("#UID").value = "";
    document.querySelector(".verify").querySelector("#DOB").value = "";
}

function closeForgotPwdPopUp(){
    var ele1 = document.querySelector(".coverage");
    var ele2 = document.querySelector(".forgot-container");
    console.log(ele1, ele2);
    ele1.style.visibility = "collapse";
    ele1.style.display = "none";
    ele2.style.visibility = "collapse";
    ele2.style.display = "none";
    collapse_forgotpwd();
}

var OTP;
var uid;

function sendOTP(){

    uid = document.getElementById("UID").value;
    var dob = document.getElementById("DOB").value;
    var dob_in_db;
    var email;
    var student = firebase.database().ref('StudentsData/'+uid)
    student.on('value', function(snapshot){
        dob_in_db = snapshot.val().dob;
        email = snapshot.val().email;
    });

    setTimeout(function(){
        if(student === null || student === undefined){
            alert("User not registered");
        }
        else{
    
            if(dob_in_db !== dob){
                alert("UID or DOB incorrect");
            }
            else{
                OTP = Math.random().toString(36).slice(2);
    
                Email.send({
                    Host: "smtp.gmail.com",
                    Username: "webdevelopermail06@gmail.com",
                    Password: "webdev06",
                    To: email,
                    From: "webdevelopermail06@gmail.com",
                    Subject: "Password reset request for LMS",
                    Body: `OTP for Password Recovery of your CUIMS is ${OTP} and is valid for next 15 mins.`,
                })
                    .then(function (message) {
                    alert("Verification mail sent successfully!")
                    });
                set_timer_15();
                var ele = document.querySelector(".verify");
                ele.style.visibility = "collapse";
                ele.style.display = "none";
    
                var ele2 = document.querySelector(".confirmOTP");
                ele2.style.visibility = "visible";
                ele2.style.display = "block";
                ele2.querySelector("#UserOTP").value = "";   
            }
        }    
    },4000); 
}

function confirmOTP(){
    
    if(document.getElementById("UserOTP").value === OTP){
        var ele = document.querySelector(".confirmOTP");
        ele.style.visibility = "collapse";
        ele.style.display = "none";

        ele = document.querySelector(".reset-pwd");
        ele.style.visibility = "visible";
        ele.style.display = "block";
        ele.querySelector("#newpwd").value = "";
        ele.querySelector("#confirmpwd").value = "";
    }
    else{
        alert("OTP not verified");
        document.querySelector("#UserOTP").value = "";
    };
}

function resetPwd(){
    var newpwd = document.getElementById("newpwd");
    var confirmpwd = document.getElementById("confirmpwd");
    if(newpwd.value !== confirmpwd.value){
        alert("Passwords do not match. Please try again!");
        newpwd.value = "";
        confirmpwd.value = "";
    }
    else{
        firebase.database().ref('StudentsData/'+uid).update({
            password : newpwd.value
        })
        alert("Password reset successful");
        window.location.href = "https://leave-management-sys.netlify.app/";
        collapse_forgotpwd();
        
    }
}

function collapse_forgotpwd(){
    var ele = document.querySelector(".confirmOTP");
    ele.style.visibility = "collapse";
    ele.style.display = "none";
    var ele = document.querySelector(".reset-pwd");
    ele.style.visibility = "collapse";
    ele.style.display = "none";
    ele = document.querySelector(".verify");
    ele.style.visibility = "visible";
    ele.style.display = "block";
}

function set_timer_15(){
    var min = 15;
    var sec = 00;

    var timeStr = min + ":0" + sec;

    document.getElementById("timer").innerText = "Remaining Time - " + timeStr;
    console.log(timeStr);
    setInterval(function tick(){
        if(sec>0){
            sec = sec - 1;
        }
        else if(sec == 0){
            sec = 59;
            min = min - 1;
        }
        if(!(sec<10) && !(min<10)){
            timeStr = min + ":" + sec;
        }
        if(sec<10){
            timeStr = min + ":0" +sec;
        }
        if(min<10){
            timeStr = "0" + min + ":" +sec;
        }
        document.getElementById("timer").innerText = "Remaining Time - " + timeStr;
    },1000)
}


var globalData;

// Script running on mainPage.html
function user(){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");
    LoggedId = queries[0].split("=")[1];
    var data = [];

    if(LoggedId=="admin"){
        document.getElementById("LoggedUser").innerHTML = `<i class="fas fa-user"></i> `+ " Admin";
        var ele = document.getElementById("id-tab");
        ele.style.visibility = "collapse";
        ele.style.display = "none";
        var ele = document.getElementById("profile-tab");
        ele.style.visibility = "collapse";
        ele.style.display = "none";
        var ele = document.getElementById("all-leaves-tab");
        ele.style.visibility = "visible";
        ele.style.display = "block";
        adminApprove();
    }
    else{
        firebase.database().ref('StudentsData/'+LoggedId).on('value', function(snapshot){
                FullName = snapshot.val().name;
                data.push(snapshot.val().name);
                data.push(snapshot.val().uid);
                data.push(snapshot.val().dob);
                data.push(snapshot.val().email);
                data.push(snapshot.val().mobile);
                data.push(snapshot.val().img);
                globalData = data;
                document.getElementById("LoggedUser").innerHTML = `<i class="fas fa-user"></i> `+ FullName;
        });   
    }
}

function getLeaves(){
    document.getElementById("student").querySelector(".heading").innerHTML = "Student Leave Apply";
    var formLeave = document.getElementById("form-leave");
    formLeave.style.visibility = "collapse";
    formLeave.style.display = "none";

    var leaveHistory = document.getElementById("leave-history");
    leaveHistory.style.visibility = "visible";
    leaveHistory.style.display = "block";

    var backBtn = document.getElementById("back-btn");
    backBtn.style.visibility = "visible";
    backBtn.style.display = "block";

    var ele = document.getElementById("profile-container");
    ele.style.visibility = "collapse";
    ele.style.display = "none";

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
                if(status === "Rejected"){
                    color = "#DC2626";
                }
                else if(status === "Pending"){
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
    document.getElementById("student").querySelector(".heading").innerHTML = "Student Leave Apply";
    var formLeave = document.getElementById("form-leave");
    formLeave.style.visibility = "visible";
    formLeave.style.display = "block";

    var leaveHistory = document.getElementById("leave-history");
    leaveHistory.style.visibility = "collapse";
    leaveHistory.style.display = "none";

    var backBtn = document.getElementById("back-btn");
    backBtn.style.visibility = "collapse";
    backBtn.style.display = "none";

    var ele = document.getElementById("profile-container");
    ele.style.visibility = "collapse";
    ele.style.display = "none";

    ele = document.getElementById("history-btn");
    ele.style.visibility = "visible";
    ele.style.display = "block";
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
        status : "Pending" 
    });

    alert("Leave applied successfully");

    type.value = "";
    startDate.value = "";
    endDate.value = "";
    reason.value = "";
}

function dropdown(){
    var ele = document.getElementById("dropoptions");
    ele.classList.toggle("hide");

    if( ele.classList[1] == "hide"){
        ele.style.visibility = "collapse";
        ele.style.display = "none";
        
    }
    else{
        ele.style.visibility = "visible";
        ele.style.display = "block";
    }
    if(globalData !== undefined && globalData !== null){
        document.getElementById("id_li").innerHTML = `<i class="fas fa-id-badge icon"></i> ${globalData[1]}`;
    }
    
}


function profile(){
    document.getElementById("student").querySelector(".heading").innerHTML = "My Profile";
    var ele = document.getElementById("leave-history");
    ele.style.visibility = "collapse";
    ele.style.display = "none";
    var ele = document.getElementById("form-leave");
    ele.style.visibility = "collapse";
    ele.style.display = "none";
    var ele = document.getElementById("profile-container");
    ele.style.visibility = "visible";
    ele.style.display = "grid";
    var ele = document.getElementById("back-btn");
    ele.innerHTML = `<i class="fas fa-arrow-left"></i> Leave Apply`;
    ele.style.visibility = "visible";
    ele.style.display = "block";
    ele = document.getElementById("history-btn");
    ele.style.visibility = "collapse";
    ele.style.display = "none";
    
    console.log(globalData);
    document.getElementById("uid-head").innerHTML = `UID : ${globalData[1]} <div class="profile-img" id="input-img"><img src="" alt="" srcset="" id= "img"></div>`;
    document.getElementById("input-name").innerText = globalData[0];
    document.getElementById("input-uid").innerText = globalData[1];
    document.getElementById("input-dob").innerText = globalData[2];
    document.getElementById("input-email").innerText = globalData[3];
    document.getElementById("input-contact").innerText = globalData[4];
    document.getElementById("input-img").querySelector("img").src = globalData[5];

    firebase.database().ref('Leaves/'+LoggedId).on('value', function(snapshot){
        var val = snapshot.val();
        if(val!=undefined && val!=null){
            data = Object.values(snapshot.val());
            console.log(data);
            var count_approved = 0;
            var count_rejected = 0;
            var count_pending = 0;
            for(i in data){
                console.log(data[i], data[i].status);
                if(data[i].status === "Approved"){
                    count_approved+=1;
                }
                else if(data[i].status === "Pending"){
                    count_pending+=1;
                }
                else{
                    count_rejected+=1;
                }
            }
            document.getElementById("total-leaves").innerText = data.length;
            document.getElementById("leaves-approved").innerText = count_approved;
            document.getElementById("leaves-pending").innerText = count_pending;
            document.getElementById("leaves-rejected").innerText = count_rejected;
        }
        else{
            data = "undefined";
            document.getElementById("total-leaves").innerText = 0;
            document.getElementById("leaves-approved").innerText = 0;
        }
    });
}

function logout(){
    if(globalData === undefined || globalData === null){
        localStorage.setItem('admin', new Date().getSeconds());
    }
    else{
        localStorage.setItem(globalData[1], new Date().getSeconds());
    }
    
    window.location.href = "https://leave-management-sys.netlify.app/";
}


var fetch_done = false
function showAllLeaves(){
    var ele = document.getElementById("all-leaves-container");
    ele.style.visibility = "visible";
    ele.style.display = "block";
    
    document.getElementById("leave-approval").innerText = "Leaves Database";
    
    ele = document.getElementById("leave-container");
    ele.style.visibility = "collapse";
    ele.style.display = "none";

    ele = document.getElementById("backtomain-btn");
    ele.style.visibility = "visible";
    ele.style.display = "block";

    if(!fetch_done){
        firebase.database().ref('Leaves').on('value', function(snapshot){
            var val = snapshot.val();
            var uids = Object.keys(val);
            
            if(val!=undefined && val!=null){
                var count = 0;
                var color = "#F4F4F5";
                var status_color;
                for(i in uids){
                    for(j in val[uids[i]]){
                        if(count%2==0){
                            color = "white";
                        }
                        else{
                            color = "#F4F4F5";
                        }
                        var data = [];
                        var leaves = val[uids[i]][j];
                        data.push(uids[i]); //UID
                        data.push(leaves.Leavetype);
                        data.push(leaves.startDate);
                        data.push(leaves.endDate);
                        data.push(leaves.reason);
                        data.push(leaves.status);
                        if(leaves.status === "Pending"){
                            status_color = "#F59E0B"; 
                        }
                        else if(leaves.status === "Approved"){
                            status_color = "#16A34A"; 
                        }
                        else{
                            status_color = "#DC2626"; 
                        }
                        document.getElementById("table-headings").insertAdjacentHTML("afterend",
                            `<tr>
                            <td class="data uid" style = "background-color : ${color}">${data[0]}</td>
                            <td class="data leave-type" style = "background-color : ${color}">${data[1]}</td>
                            <td class="data start-date" style = "background-color : ${color}">${data[2]}</td>
                            <td class="data end-date" style = "background-color : ${color}">${data[3]}</td>
                            <td class="data reason" style = "background-color : ${color}">${data[4]}</td>
                            <td class="data status-table" style = "background-color : ${color}; color : ${status_color}">${data[5]}</td>
                        </tr>`
                        );
                        count++;
                    }
    
                }
                fetch_done = true;
            }
            else{
                data = "undefined";
            }
        });
    }
}

function backtomain(){
    var ele = document.getElementById("all-leaves-container");
    ele.style.visibility = "collapse";
    ele.style.display = "none";

    ele = document.getElementById("leave-container");
    ele.style.visibility = "visible";
    ele.style.display = "block";

    document.getElementById("leave-approval").innerText = "Pending leaves for Approval";
    // adminApprove();
}
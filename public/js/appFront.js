
// function signinButtonValidator() {
//     // console.log('COnnected');
    
//     var email = document.getElementById("signinInputEmail");
//     var password = document.getElementById("signinInputPassword");

//     if (email.value.trim() == "" && password.value.trim() == "" ) {

//         email.style.border = 'solid 1px red'
//         document.getElementById('signinEmailLabel').style.visibility = 'visible'
//         password.style.border = 'solid 1px red'
//         document.getElementById('signinPasswordLabel').style.visibility = 'visible'
//         return false;
//     }
//     else if (email.value.trim() == "" ) {

//         document.getElementById('signinEmailLabel').style.visibility = 'visible'
//         document.getElementById('signinPasswordLabel').style.visibility = 'hidden'

//         email.style.border = 'solid 1px red'
//         password.style.border = 'solid 1px black'

//         return false;
//     }
//     else if(password.value.trim() == ""){

//         document.getElementById('signinEmailLabel').style.visibility = 'hidden'
//         document.getElementById('signinPasswordLabel').style.visibility = 'visible'

//         email.style.border = 'solid 1px black'
//         password.style.border = 'solid 1px red'
//         return false;
//     }
//     else if(password.value.trim().length < 8 || password.value.trim().length >20 ){

//         document.getElementById('signinEmailLabel').style.visibility = 'hidden'
//         document.getElementById('signinPasswordLabel').style.visibility = 'visible'

//         email.style.border = 'solid 1px black'
//         password.style.border = 'solid 1px red'
//         return false;
//     }
//     else {

//         const url = '/weather?address='+location

//         fetch(url).then((response)=>{ 
//             response.json().then((data)=>{
    
//                 if(data.error){
//                 // console.log(data.error);
//                 message1.textContent = outerMSG_1 = data.error
//                 message2.textContent = ''
    
//                 }else{
//                     // console.log(data.location);
//                     // console.log(data.forecast);
                    
//                     message1.textContent = outerMSG_1 = data.location
//                     message2.textContent = outerMSG_2 = data.forecast
    
//                 }
//             })
//         })



//         return true;
//     }

// }



// function signupButtonValidator() {
//     var userName = document.getElementById("signupInputUserName")
//     var email = document.getElementById("signupInputEmail");
//     var password = document.getElementById("signupInputPassword");
//     var confirmPassword = document.getElementById("signupInputConfirmPassword");

//     if(userName.value.trim == "" ){ 
//         userName.style.border = 'solid 1px red'
//         return false;
//     }
//     else if(email.value.trim == ""){
//         email.style.border = 'solid 1px red'
//         return false;
//     }
//     else if(password.value.trim() !== confirmPassword.value.trim()){
//         alert("password doesnt match in both fields")
//         return false;
//     }
//     else{
        
//         return true;
//     }


// }

console.log("working in client side");

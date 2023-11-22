const loginMessage = "لطفا مجددا لاگین نمایید";
function logoutUser(data,message) {
    if(data.info=="expireToken"){
        if(message){
            error_izitoast(message);
        }
        setTimeout(()=>{
            location.href="/"
        },1500)
    }
}
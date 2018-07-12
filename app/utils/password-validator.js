let passwordValidator = {
    pattern,
    repeat
};
function pattern(pwd){
    return true;
}

function repeat(pwd, repeatPwd, ing){
    if(!ing) return pwd === repeatPwd;
    let reg = new RegExp("^" + repeatPwd);
    return reg.test(pwd);
}
export {
    passwordValidator as default
}
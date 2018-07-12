let phoneValidator = {
    cell,
    landline
};
function cell(phone, ing){
    let pattern = /^1(3[0-9]|45|47|5[0-9]|7[^249]|8[0-9])[0-9]{8}$/;
    if(ing){
        pattern = /^1[0-9]{0,10}$/;
    }
    return pattern.test(phone);
}
function landline(landLine, ing) {
    let pattern = /^0[0-9]{2,3}-[0-9]{7,8}$/;
    if(ing){
        pattern = /^0([0-9]{2,3}-)?[0-9]{0,8}$/;
    }
    return pattern.test(landLine);
}
export default phoneValidator;

let numberValidator = {
    int
};
function int(value) {
    let reg = /^[1-9][0-9]*$/;
    return reg.test(value);
}
export default numberValidator;
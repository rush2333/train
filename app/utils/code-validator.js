let codeValidator = function (code, ing) {
    if(ing){
        return /^[0-9]{1,6}$/.test(code);
    }
    return /^([0-9]{4}|([0-9]{6}))$/.test(code);
};
export default codeValidator;
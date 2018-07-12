function imageValidator(file){
    let pattern = /^image\//;
    return pattern.test(file.type);
}
imageValidator.checkSize = function(file, max){
    //最小单位是k
    return (file.size/1000) <= max;
};
export default imageValidator;
function settleErrors(){
    let data = {};
    let len = arguments.length;
    let callback;
    let actualLength = len;//参数可用真实长度
    //如果最后一个参数是函数，则为callback
    if(typeof arguments[len-1] === 'function'){
        actualLength -= 1;
        callback = arguments[actualLength];
    }
    //无参调用方法直接报错
    if(actualLength === 0)throw new Error('无效调用，请带上必需参数');
    //settleParams()要求参数设置必须为2的公倍数
    if((actualLength % 2) !== 0) throw new Error('settleErrors方法要求参数个数为双数');
    for (let i = 0; i < len; i = i + 2){
        data[arguments[i]] = arguments[i + 1];
    }
    this.setState(prev => {
        return {
            errors: {
                ...prev.errors,
                ...data
            }
        }
    }, () =>{
        if(callback) callback();
    })
}
export default settleErrors;
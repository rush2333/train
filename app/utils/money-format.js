let moneyFormator = function(money){
    let pattern = /^[0-9]*$/;
    if(!pattern.test(money)) return 0;
    let actualMoney = parseInt(money)/100;
    return actualMoney.toLocaleString('zh-Hans-CN', {
        currency: 'USD'
    });
};
moneyFormator.deal = function(value){
    let reg = /^[0-9]+(\.)?[0-9]{0,2}$/;
    return reg.test(value);
};
export default moneyFormator;
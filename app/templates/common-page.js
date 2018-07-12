import React from 'react';
import ERRORS from '../config/errors';
import { phoneValidator } from '../utils/';
class CommonPage extends React.Component{
    constructor(props){
        super(props);
    }
    controlRangePicker(dates, dateStrings, fn){
        let time_begin = dateStrings[0];
        let time_end = dateStrings[1];
        this.settleParams('time_begin', time_begin);
        this.settleParams('time_end', time_end);
        if(fn && typeof fn === 'function'){
            fn.call(this, {
                time_begin,
                time_end,
                page: 1
            });
        }
    }
    controlKey(value){
        this.settleParams('key', value);
    }
    settlePhoneError(phone, ing=false){
        if(!phone){
            this.settleErrors('phone', '请输入手机号码或固定电话');
            return;
        }
        if(!phoneValidator.landline(phone,ing) && !phoneValidator.cell(phone, ing)){
            if(phone[0] === '0'){
                this.settleErrors('phone', ERRORS.landline.invalid);
            }else{
                this.settleErrors('phone', ERRORS.phone.invalid);
            }
        }else{
            this.settleErrors('phone', null);
        }
    }
    settleErrors(type, msg){
        this.setState(prev => {
            return {
                errors: {
                    ...prev.errors,
                    [type]: msg
                }
            }
        });
    }
    settleParams(type, value){
        this.setState(prev => {
            return {
                params: {
                    ...prev.params,
                    [type]: value
                }
            }
        })
    };
}
export default CommonPage;
import React from 'react';
import settleParams from '../../../helpers/settle-params';
class Utils extends React.Component{
    controlRangePicker(dates, callback){
        this.settleParams('time_begin', dates[0], 'time_end', dates[1], () => {
            // this.getTableList(true);
            if(callback)callback();
        });
    }
    controlKey(value){
        this.settleParams('key', value);
    }
    updateTable(page, callback){
        this.settleParams('page', page, () => {
            // this.getTableList(false);
            if(callback) callback();
        });
    }
}
Utils.prototype.settleParams = settleParams;
export default Utils;
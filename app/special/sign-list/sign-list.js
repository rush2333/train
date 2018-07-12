import React from 'react';
import SignListTemplate from '../../templates/sign-list/sign-list';
class SpecialSignList extends SignListTemplate{
    constructor(props){
        super(props);

    }
}
SpecialSignList.prototype.pageType = 'special';
export default SpecialSignList;
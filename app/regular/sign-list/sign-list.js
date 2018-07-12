import React from 'react';
import SignListTemplate from '../../templates/sign-list/sign-list';
class RegularSignList extends SignListTemplate{
    constructor(props){
        super(props);
    }
}
RegularSignList.prototype.pageType = 'regular';
export default RegularSignList;
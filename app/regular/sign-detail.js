import SignDetail from '../templates/sign-detail';
class RegularSignDetail extends SignDetail{
    constructor(props){
        super(props);
        this.pageConfig = {
            type: 'regular',
            title: '平时班'
        };
    }
}
export default RegularSignDetail;
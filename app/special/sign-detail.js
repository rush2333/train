import SignDetail from '../templates/sign-detail';
class SpecialSignDetail extends SignDetail{
    constructor(props){
        super(props);
        this.pageConfig = {
            type: 'special',
            title: '特训班'
        };
    }
    aaa(){
        console.log(111);
    }
}
export default SpecialSignDetail;
import RegularSpecialDetailTemplate from '../templates/regular-special-detail';
class SpecialCourseDetail extends RegularSpecialDetailTemplate{
    constructor(props){
        super(props);
        this.pageConfig = {
            type: 'special',
            value: '特训班'
        }
    }
    getCourseDetail(){
        this.props.loadData('COURSE-SPECIAL-DETAIL', {
            course_id: this.props.match.params.id
        }).then((res) => {
            this.setState({
                data: res.content
            });
        }, (res) => {

        });
    }
}
export default SpecialCourseDetail;
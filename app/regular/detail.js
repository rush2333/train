import RegularSpecialDetailTemplate from '../templates/regular-special-detail';
class RegularCourseDetail extends RegularSpecialDetailTemplate{
    constructor(props){
        super(props);
        this.pageConfig = {
            type: 'regular',
            value: '平时班'
        }
    }
    getCourseDetail(){
        this.props.loadData('COURSE-REGULAR-DETAIL', {
            course_id: this.props.match.params.id
        }).then((res) => {
            this.setState({
                data: res.content
            });
        }, (res) => {

        });
    }
}
export default RegularCourseDetail;
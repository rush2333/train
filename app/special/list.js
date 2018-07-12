import CourseList from '../templates/course-list';
class SpecialCourseList extends CourseList{
    constructor(props){
        super(props);
        this.pageConfig = {
            title: "特训班",
            type: 'special'
        }
    }

}
export default SpecialCourseList;
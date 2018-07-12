import CourseList from '../templates/course-list';
class RegularCourseList extends CourseList{
    constructor(props){
        super(props);
        this.pageConfig = {
            title: "平时班",
            type: 'regular'
        }
    }
}
export default RegularCourseList;
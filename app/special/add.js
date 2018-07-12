import SpecialCourseAddEdit from '../templates/special-add-edit';
import { notification } from 'antd';
class SpecialCourseAdd extends SpecialCourseAddEdit{
    constructor(props){
        super(props);
        this.pageConfig = {
            title: '新增特训课'
        }
    }
    ensureSetting(){
        let { cost, cycle, course_detail, area, regi_begin, regi_end, ...other } = this.state.params;
        this.props.loadData('COURSE-SPECIAL-ADD',{
            ...other,
            regi_begin: regi_begin.format('YYYY-MM-DD HH:mm'),
            regi_end: regi_end.format('YYYY-MM-DD HH:mm'),
            area: area.join('/'),
            course_detail: JSON.stringify(course_detail),
            cost: Math.floor(parseFloat(cost) * 100),
            cycle: cycle.join(',')
        }).then((res) => {
            this.goBack();
        }, (res) => {
            notification.error({
                message: '新增平时课失败',
                description: '新增平时课失败的原因可能是' + res.msg + '，您可以通过更改参数继续尝试或者联系网站管理员获得帮助！'
            })
        });
    }
}
export default SpecialCourseAdd;
import SpecialCourseAddEdit from '../templates/special-add-edit';
import moment from 'moment';
import { notification } from 'antd';
class SpecialCourseEdit extends SpecialCourseAddEdit{
    constructor(props){
        super(props);
        this.pageConfig = {
            title: '修改特训课'
        }
    }
    componentDidMount(){
        this.getCoachList();
        this.getCourseDetail();
    }
    getCourseDetail(){
        this.props.loadData('COURSE-SPECIAL-DETAIL', {
            course_id: this.props.match.params.id
        }).then((res) => {
            let {  cycle, area, cost,course_detail,regi_begin, regi_end, trainer,trainer_id,description, ...other } = res.content;
            this.setState({
                params: {
                    ...other,
                    cycle: cycle.split(','),
                    area: area.split('/'),
                    cost: parseInt(cost)/100,
                    course_detail,
                    regi_begin: moment(regi_begin),
                    regi_end: moment(regi_end),
                    description: description,
                    trainer_id: trainer_id.toString()
                },
                text: description
            });
        })
    }
    deleteTime(id){
        this.props.loadData('COURSE-REGULAR-DELETETIME', {
            detail_id: id
        });
    }
    ensureSetting(){
        this.setStatus(true);
        let { cost, cycle, course_detail, area, regi_begin, regi_end, ...other } = this.state.params;
        let postDetail = course_detail.filter(cd => {
            return !(cd.detail_id);
        });
        this.props.loadData('COURSE-SPECIAL-EDIT',{
            ...other,
            regi_begin: regi_begin.format('YYYY-MM-DD HH:mm'),
            regi_end: regi_end.format('YYYY-MM-DD HH:mm'),
            area: area.join('/'),
            course_detail: JSON.stringify(postDetail),
            cost: Math.floor(parseFloat(cost) * 100),
            cycle: cycle.join(',')
        }).then((res) => {
            this.goBack();
        }, (res) => {
            this.setStatus(false);
            notification.error({
                message: '新增平时课失败',
                description: '新增平时课失败的原因可能是' + res.msg + '，您可以通过更改参数继续尝试或者联系网站管理员获得帮助！'
            })
        });
    }
}
export default SpecialCourseEdit;
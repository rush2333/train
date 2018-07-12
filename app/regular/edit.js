import RegularCourseAddEditTemplate from '../templates/regular-add-edit';
import { notification } from 'antd';
class RegularCourseEdit extends RegularCourseAddEditTemplate{
    constructor(props){
        super(props);
        this.pageConfig = {
            title: "修改平时课"
        }
    }
    componentDidMount(){
        this.getCoachList();
        this.getCourseDetail();
    }
    getCourseDetail(){
        this.props.loadData('COURSE-REGULAR-DETAIL', {
            course_id: this.props.match.params.id
        }).then((res) => {
            let {  cycle, area, cost,course_detail, trainer,trainer_id,description, ...other } = res.content;
            this.setState({
                params: {
                    ...other,
                    cycle: cycle.split(','),
                    area: area.split('/'),
                    cost: parseInt(cost)/100,
                    course_detail,
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
        let { area , cost, cycle, course_detail } = this.state.params;
        let postDetail = course_detail.filter(cd => {
            return !(cd.detail_id);
        });
        this.props.loadData('COURSE-REGULAR-EDIT',{
            ...this.state.params,
            area: area.join('/'),
            course_detail: JSON.stringify(postDetail),
            cost: Math.floor(parseFloat(cost) * 100),
            cycle: cycle.join(',')
        }).then((res) => {
            this.goBack();
        }, (res) => {
            this.setStatus(false);
            notification.error({
                message: '修改平时课失败',
                description: '修改平时课失败的原因可能是' + res.msg + '，您可以通过更改参数继续尝试或者联系网站管理员获得帮助！'
            });
        });
    }
}
export default RegularCourseEdit;
import { notification } from 'antd';
import CoachTemplate from '../templates/coach-add-edit';
import SERVICES from '../services';
class CoachManageAdd extends CoachTemplate{
    constructor(){
        super();
        this.pageConfig = {
            title: '修改教练信息'
        }
    }
    componentDidMount(){
        this.getCoach();
    }
    getCoach(){
        this.props.loadData('MANAGE-COACH-DETAIL', {
            trainer_id: this.props.match.params.id
        }).then((res) => {
            let content = res.content;
            Object.keys(content).map(k => {
                this.settleParams(k, '' + content[k]);
            });
        }, (res) => {
            notification({
                message: '获取教练信息失败',
                description: "获取教练信息失败的原因可能是" + res.msg + '，您可以重新尝试或者联系网站管理员！'
            });
        });
    }
    ensureSetting(){
        let p = this.state.params;
        if(!this.state.renewImg){
            delete p.header_url;
        }
        this.props.loadData('MANAGE-COACH-EDIT', p).then((res) => {
            this.goBack();
        }, (res) => {
            SERVICES.notification('修改教练信息',res.msg);
        });
    }
}
export default CoachManageAdd;
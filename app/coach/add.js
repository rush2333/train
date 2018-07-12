import CoachTemplate from '../templates/coach-add-edit';
import SERVICES from '../services';
class CoachManageAdd extends CoachTemplate{
    constructor(){
        super();
        this.pageConfig = {
            title: '新增教练'
        }
    }
    ensureSetting(){
        this.props.loadData('MANAGE-COACH-ADD', this.state.params).then((res) => {
            this.goBack();
        }, (res) => {
            SERVICES.notification('新增教练',res.msg);
        });
    }
}
export default CoachManageAdd;
import { notification } from 'antd';
function Notification(type, msg) {
    notification.error({
        message: type,
        description: type + '的原因可能是' + msg + '，您可以通过更改参数继续尝试或者联系网站管理员获得帮助！'
    })
}
export default Notification;
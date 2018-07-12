const ERRORS = {
    phone: {
        required: '请输入手机号码',
        invalid: '请输入正确格式的手机号码',
        unregistered: '此手机号码尚未注册，请重新输入'
    },
    landline: {
        required: '请输入固定电话',
        invalid: '请输入正确格式的固定电话，区号与电话号码用"-"分隔'
    },
    password: {
        required: '请输入密码',
        oldRequired: "请输入当前账号密码",
        newRequired: "请输入新密码",
        repeat: '新密码与当前密码相同，请重新输入',
        wrong: '密码错误，请重新输入'
    },
    repeatPasswd: {
        required: '请再次输入新密码',
        invalid: '两次输入的密码不匹配，请重新输入'
    },
    code: {
        required: '请输入验证码',
        invalid: '请输入4位或6位长度的数字验证码',
        wrong: '验证码错误，请重新输入',
        outdated: '验证码过期，请重新获取'
    },
    courseName: {
        required: '请输入课程名称'
    },
    cost: {
        required: '请输入报名费用',
        number: '输入值无效，请输入数字(保留小数点后两位)'
    },
    studentName: {
        required: '请输入学员姓名'
    },
    coachName: {
        required: '请输入教练姓名'
    },
    courseCount: {
        required: '请输入课程节数',
        int: '请输入大于0的整数',
        max: '课程节数不能超过标准节数'
    },
    courseID: {
        required: '请选择报名课程'
    },
    address: {
        required: '请输入详细地址'
    }
};
export default ERRORS;
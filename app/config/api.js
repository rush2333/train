const apiConfig = {
    SERVICE: {
        CAPTCHA: 'Service/get_V_Code'
    },
    ADMIN: {
        LOGIN: 'Admin/index',
        MODIFY: 'Admin/update',
        LOGOUT: 'Admin/logout'
    },
    COURSE: {
        REGULAR:{
            LIST: 'CourseNormal/index',
            ADD: 'CourseNormal/save',
            EDIT: 'CourseNormal/update',
            DELETE: 'CourseNormal/delete',
            DELETETIME: 'CourseDetail/delete',
            DETAIL: 'CourseNormal/read',
            EXPORT: 'CourseNormal/export'
        },
        SPECIAL: {
            LIST: 'CourseSpecial/index',
            ADD: 'CourseSpecial/save',
            EDIT: 'CourseSpecial/update',
            DELETE: 'CourseSpecial/delete',
            DETAIL: 'CourseSpecial/read',
            EXPORT: 'CourseSpecial/export'
        },
        SINGLE: {
            LIST: 'CourseSingle/index',
            ADD: 'CourseSingle/save',
            EXPORT: 'CourseSingle/export'
        },
    },
    MANAGE: {
        COACH: {
            LIST: 'Trainer/index',
            GETLIST: 'Trainer/getList',//获取教练列表
            ADD: 'Trainer/save',
            EDIT: 'Trainer/update',
            HANDLE: 'Trainer/handel',
            DETAIL: 'Trainer/read',
            EXPORT: 'Trainer/export'
        },
        STUDENT: {
            LIST: 'StudentManagement/index',
            DETAIL: 'StudentManagement/read',
            COURSELIST: "CourseList/getListForPC",//新增线下学员时获取课程列表
            ADDSTUDENT: 'StudentManagement/save',
            CLASSDETAIL: 'StudentManagement/getStudentAttend',
            EXPORT: 'StudentManagement/export'
        },
        ATTENDANCE: {
            LIST: 'AttendManagement/index',
            DETAIL: 'AttendManagement/read',
            EXPORT: 'AttendManagement/export'
        }
    },
    SIGNUP: {
        REGULAR: {
            LIST: 'SignUpNormal/index',
            DETAIL: 'SignUpNormal/read',
            EXPORT: 'SignUpNormal/export'
        },
        SPECIAL: {
            LIST: 'SignUpSpecial/index',
            DETAIL: 'SignUpSpecial/read',
            EXPORT: 'SignUpSpecial/export'
        },
        COMMON: {
            DETAILLIST: 'CourseDetail/getList',
            DETAILEXPORT: 'CourseDetail/export',
            DETAIL: 'SignUp/read',
            EXPORT: 'SignUp/export'
        }
    }
};
//给接口添加前缀
const API = {};
function prefixApi(obj, prefix, parentKey) {
    parentKey = parentKey || '';
    prefix = prefix || '';
    Object.keys(obj).map(key => {
        let combineKey = parentKey + '-' + key;
        if(parentKey === ''){
            combineKey = key;
        }
        if(typeof obj[key] === 'string'){
            API[combineKey] = prefix + obj[key];
        }else{
            prefixApi(obj[key], prefix, combineKey);
        }
    });
}
prefixApi(apiConfig, '/api/');
export {
    API as default
};
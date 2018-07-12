let tree = [
    {
        group: "常规",
        nav: false,
        children: [
            {
                title: "登录",
                url: "/login",
                nav: false,
                compURL: "login.js"
            },
            {
                title: "修改密码",
                url: "/forget",
                nav: false,
                compURL: "forget.js"
            }
        ]
    },
    {
        group: "课程",
        url: "/course",
        icon: "book",
        children: [
            {
                title: "平时班",
                url: "/regular",
                defaultChild: "/list",
                children: [
                    {
                        title: "平时班",
                        url: "/list",
                        compURL: "regular/list.js"
                    },
                    {
                        title: "新增平时课程",
                        url: "/add",
                        nav: false,
                        compURL: "regular/add.js"
                    },
                    {
                        title: "修改平时课程",
                        url: "/edit/:id",
                        nav: false,
                        compURL: "regular/edit.js"
                    },
                    {
                        title: "平时班/课程信息",
                        url: "/detail/:id",
                        compURL: "regular/detail.js"
                    }
                ]
            },
            {
                title: "特训班",
                url: "/special",
                defaultChild: "/list",
                children: [
                    {
                        title: "特训班",
                        url: "/list",
                        compURL: "special/list.js"
                    },
                    {
                        title: "新增特训课程",
                        url: "/add",
                        nav: false,
                        compURL: "special/add.js"
                    },
                    {
                        title: "修改特训课程",
                        url: "/edit/:id",
                        nav: false,
                        compURL: "special/edit.js"
                    },
                    {
                        title: "特训班/课程信息",
                        url: "/detail/:id",
                        compURL: "special/detail.js"
                    }
                ]
            },
            {
                title: "单教",
                url: "/individual",
                defaultChild: "/list",
                children: [
                    {
                        title: "新增单教",
                        url: '/list/add',
                        compURL: "individual/add.js"
                    },
                    {
                        title: "单教",
                        url: "/list",
                        compURL: "individual/list.js"
                    }
                ]
            }
        ]
    },
    {
        group: "管理",
        url: "/manage",
        icon: "team",
        children: [
            {
                title: "教练管理",
                url: "/coach",
                defaultChild: "/list",
                children: [
                    {
                        title: "教练管理",
                        url: "/list",
                        compURL: "coach/list.js"
                    },
                    {
                        title: "教练管理",
                        url: "/add",
                        compURL: "coach/add.js"
                    },
                    {
                        title: "教练管理",
                        url: "/edit/:id",
                        compURL: "coach/edit.js"
                    }
                ]
            },
            {
                title: "学员管理",
                url: "/student",
                defaultChild: "/list",
                children: [
                    {
                        title: "学员管理",
                        url: "/list",
                        compURL: "student/list.js"
                    },
                    {
                        title: "学员管理",
                        url: "/list/add",
                        compURL: "student/list.js"
                    },
                    {
                        title: "学员管理/",
                        url: "/detail/:id",
                        compURL: "student/detail.js"
                    }, {
                        title: '学员管理/上课明细',
                        url: "/detail/:openid/:course_id",
                        compURL: "student/class-detail.js"
                    }
                ]
            },
            {
                title: "考勤管理",
                url: "/check",
                defaultChild: "/list",
                children: [
                    {
                        title: "考勤管理",
                        url: "/list",
                        compURL: "check/list.js"
                    },
                    {
                        title: "考勤管理/考勤详情",
                        url: "/detail/:id",
                        compURL: "check/detail.js"
                    }
                ]
            }
        ]
    },
    {
        group: "报名",
        url: "/sign",
        icon: "idcard",
        children: [
            {
                title: "平时班报名",
                url: "/regular",
                defaultChild: "/detail-list",
                children: [
                    {
                        title: "平时班报名",
                        url: "/detail-list",
                        compURL: "regular/sign-list/sign-list.js"
                    },
                    {
                        title: "平时班报名",
                        url: "/class-list",
                        compURL: "regular/sign-list/sign-list.js"
                    },
                    {
                        title: "平时班报名/报名明细",
                        url: "/detail/:id",
                        compURL: "regular/sign-list/sign-list.js"
                    }
                ]
            },
            {
                title: "特训班报名",
                url: "/special",
                defaultChild: "/detail-list",
                children: [
                    {
                        title: "特训班报名",
                        url: "/detail-list",
                        compURL: "special/sign-list/sign-list.js"
                    },
                    {
                        title: "特训班报名",
                        url: "/class-list",
                        compURL: "special/sign-list/sign-list.js"
                    },
                    {
                        title: "特训班报名/报名明细",
                        url: "/detail/:id",
                        compURL: "special/sign-list/sign-list.js"
                    }
                ]
            }
        ]
    },
    {
        group: "个人中心",
        url: "/user",
        icon: "user",
        children: [
            {
                title: "我的账号",
                url: "/account",
                defaultChild: "/detail",
                children: [
                    {
                        title: "我的账号",
                        url: "/detail",
                        compURL: "user/account.js"
                    }
                ]
            }
        ]
    }
];
let menuList = [];
let routes_without_nav = [];
let routes_with_nav = [];
tree.forEach((group) => {
    let url = group.url || '';
    group.children.forEach((section) => {
        if(section.children && section.children.length){
            section.children.forEach((child) => {
                child.pathname = url + section.url + child.url;
                if(child.nav === false){
                     routes_without_nav.push(child);
                }else{
                    routes_with_nav.push(child);
                }
            });
        }else{
            if(section.nav === false){
                section.pathname = url + section.url;
                routes_without_nav.push(section);
            }
        }
    });
    if(group.nav !== false){
        menuList.push(group);
    }
});
export {
    routes_without_nav,
    routes_with_nav,
    menuList
};

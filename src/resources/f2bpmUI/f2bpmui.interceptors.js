/** *****************************************************************************
 *
 * 前端登录鉴权
 * 邮箱: 1827528476
 * 日期: 2020-05-05
 * 版权：广州致博软件科技有限公司
 *
 ******************************************************************************/

// 身份凭证名
var AuthorTokenKey = 'f2bpmAuthor'
// 全局状态管理
FUI.$store = {
    state: {
        author: null,
        token: null,
        userId: null,
        tenantId: null
    },
    addAuthor: function (authorStr) { // 第一个参数为 state 用于变更状态 登录
        localStorage.setItem(AuthorTokenKey, authorStr)
        var authorObj = eval('(' + authorStr + ')')
        FUI.$store.state.author = authorObj
        FUI.$store.state.token = authorObj.token
        FUI.$store.state.userId = authorObj.userId
    },
    removeAuthor: function (type) { // 退出登录
        localStorage.removeItem(AuthorTokenKey)
        localStorage.removeItem('f2bpmCurrentMenus')
        localStorage.removeItem('f2bpmBreadcrumbMenus')
        localStorage.removeItem('f2bpmHomeData')
        localStorage.removeItem('activeMenuName')
        localStorage.removeItem('f2bpmConfigTypeListData')
        localStorage.removeItem("TeamContractNo");
        localStorage.removeItem("funnelData");
        if (type == 'all') {
            localStorage.removeItem('f2bpmSysConfig')
        }
        FUI.$store.state.author = null
        FUI.$store.state.token = null
        FUI.$store.state.userID = null
    },
    getters: {
        // 获取store值 this.$store.getters.getAuthor
        getAuthor: function () {
            var author = localStorage.getItem(AuthorTokenKey)
            if (author) {
                var json = eval('(' + author + ')')
                return json
            }
            return null
        },
        getAuthorStr: function () {
            var authorStr = localStorage.getItem(AuthorTokenKey)
            return authorStr
        },
        // 获取系统基础信息
        getSys: function () {
            var config = localStorage.getItem('f2bpmSysConfig')
            if (config) {
                var json = eval('(' + config + ')')
                return json
            }
            return null
        },
        verifyLogin: function () {
            var author = localStorage.getItem(AuthorTokenKey)
            var config = localStorage.getItem('f2bpmSysConfig')
            if (author != null && config != null) {
                return true
            }
            return false
        }
    }
}
// 请求拦截器
function interceptorsRequest() {
    var reqUrl = window.location.href
    if (reqUrl && reqUrl.indexOf('/login') == -1 && reqUrl && reqUrl.indexOf('/workflow/public/') == -1) {
        var author = FUI.$store.getters.getAuthor()
        if (!author) {
            window.location = __webpath + '/login/login'
        }
    }
}
interceptorsRequest()

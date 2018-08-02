const baseController = require('controllers/base.js');
const yapi = require('yapi.js');
const ddpushModel = require('./ddpushModel.js');
const projectModel = require('models/project.js');
const dingding = require('./dingding.js');
class DDPushController extends baseController {
    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(ddpushModel);
        this.projectModel = yapi.getInst(projectModel);
        this.dingding = yapi.getInst(dingding);
    }
    /**
   * 获取钉钉推送信息
   * @interface ddpush/get
   * @method get
   * @category statistics
   * @foldnumber 10
   * @returns {Object}
   */
    async getConfig(ctx) {
        try {
            let project_id = ctx.request.query.project_id;
            if (!project_id) {
                return (ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'));
            }
            let result = await this
                .Model
                .get(project_id);
            return (ctx.body = yapi.commons.resReturn(result));
        } catch (err) {
            ctx.body = yapi
                .commons
                .resReturn(null, 400, err.message);
        }
    }
    async saveConfig(ctx) {
        try {
            let params = ctx.request.body;
            params = yapi
                .commons
                .handleParams(params, {
                    project_id: 'number',
                    dingding_url: 'string'
                });
            if (!params.project_id) {
                return (ctx.body = yapi.commons.resReturn(null, 400, '项目id不能为空'));
            }
            if (!this.$tokenAuth) {
                let auth = await this.checkAuth(params.project_id, 'project', 'edit');
                if (!auth) {
                    return (ctx.body = yapi.commons.resReturn(null, 400, '没有权限'));
                }
            }
            //   当数据库唔数据
            let result = await this
                .Model
                .get(params.project_id);
            if (!result) {
                let data = Object.assign(params, {
                    add_time: yapi
                        .commons
                        .time(),
                    up_time: yapi
                        .commons
                        .time()
                });

                let res = await this
                    .Model
                    .save(data);
                ctx.body = yapi
                    .commons
                    .resReturn(res);
            } else {
                let data = Object.assign(params, {
                    up_time: yapi
                        .commons
                        .time()
                });
                let upRes = await this
                    .Model
                    .up(result._id, data);
                ctx.body = yapi
                    .commons
                    .resReturn(upRes);
            }
            return 1;
        } catch (err) {
            ctx.body = yapi
                .commons
                .resReturn(null, 400, err.message);
        }
    }
    async testDingding(ctx) {
        try {
            let dingding_url = ctx.request.body.dingding_url;
            const result = await this
                .dingding
                .requestText(dingding_url, "test")
            if (result.errcode != 0) {
                ctx.body = yapi
                    .commons
                    .resReturn(null, 400, result.errmsg);
            } else {
                ctx.body = yapi
                    .commons
                    .resReturn();
            }
            return 1;
            // console.log(result)
        } catch (err) {
            ctx.body = yapi
                .commons
                .resReturn(null, 400, err.message);
        }
    }
}

module.exports = DDPushController;

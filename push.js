const yapi = require('yapi.js');
const interfaceColModel = require('models/interfaceCol.js');
const interfaceCaseModel = require('models/interfaceCase.js');
const interfaceModel = require('models/interface.js');
const projectModel = require('models/project.js');
const dingdingServices = require("./dingding.js");
const ddpushModel = require("./ddpushModel");
const util = require('util');

class Push {
    constructor() {
        this.colModel = yapi.getInst(interfaceColModel);
        this.caseModel = yapi.getInst(interfaceCaseModel);
        this.interfaceModel = yapi.getInst(interfaceModel);
        this.projectModel = yapi.getInst(projectModel);
        this.ddpushModel = yapi.getInst(ddpushModel);
        this.dingdingServices = yapi.getInst(dingdingServices)
    }
    async delete(id, ctx) {
        // 先查出接口信息
        let interfaceInfo = await this.getInterfaceInfoById(id)
        if (!interfaceInfo) {
            return true
        }
        let user = ctx.state.user
        this
            .dingdingServices
            .requestText(interfaceInfo["push_url"], util.format("[%s]%s删除了接口%s", interfaceInfo["project_info"]["name"], user.username, interfaceInfo.title))
        return true
    }
    async create(id, ctx) {
        // 先查出接口信息
        let interfaceInfo = await this.getInterfaceInfoById(id)
        if (!interfaceInfo) {
            return true
        }
        let user = ctx.state.user
        this
            .dingdingServices
            .requestText(interfaceInfo["push_url"], util.format("[%s]%s创建了接口%s", interfaceInfo["project_info"]["name"], user.username, interfaceInfo.title))
        return true
    }

    async edit(id, ctx, old, newdata) {
        // return true
        const diff = require('./lib/diff');
        const jsondiffpatch = require('jsondiffpatch');
        const diffdata = diff(jsondiffpatch, {
            current: newdata.toObject(),
            old: old.toObject()
        })
        // return true const diffdata = []
        let interfaceInfo = await this.getInterfaceInfoById(id)
        if (!interfaceInfo) {
            return true
        }
        let user = ctx.state.user
        let str = util.format("[%s]%s修改了接口%s", interfaceInfo["project_info"]["name"], user.username, interfaceInfo.title)
        if (diffdata.length > 0) {
            str += "\n\n更新内容\n"
            for (let value of diffdata) {
                if (!value.content) {
                    continue
                }
                str += " - " + value.title + " : ";
                if (typeof value.content.new != "object") {
                    str += value.content.new
                } else {
                    str += "查看详情"
                }
                str += "\n";
                //
            }
        }
        str += util.format("\n[查看](%s)", this.getAPIURL(interfaceInfo.project_id, id, ctx))
        let message = {}
        message["markdown"] = {
            title: "接口变更",
            text: str
        }
        this
            .dingdingServices
            .requestDingDing(interfaceInfo["push_url"], "markdown", message)
    }

    async getUrlByProjectId(project_id) {
        let result = await this
            .ddpushModel
            .get(project_id)
        if (result) {
            return result.dingding_url
        }
        return ""
    }
    async getProejctInfo(proejct_id) {
        let result = await this
            .projectModel
            .get(proejct_id)
        return result
    }
    async getInterfaceInfoById(interface_id) {
        let interfaceInfo = await this
            .interfaceModel
            .get(interface_id)
        if (!interfaceInfo) {
            return
        }
        let url = await this.getUrlByProjectId(interfaceInfo.project_id)
        if (url == "") {
            return
        }
        interfaceInfo["push_url"] = url
        let project = await this.getProejctInfo(interfaceInfo.project_id)
        interfaceInfo["project_info"] = project
        return interfaceInfo
    }

    getAPIURL(project_id, interface_id, ctx) {
        let url = ctx.request.origin
        url += util.format("/project/%s/interface/api/%s", project_id, interface_id)
        return url

    }

}

module.exports = Push;
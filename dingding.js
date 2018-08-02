const request = require("request")

const yapi = require('yapi.js');

class dingding {
    requestDingDing(dingding_url, msgtype, msg) {
        var message = msg || Object.assign()
        message["msgtype"] = msgtype
        return new Promise((resolve, reject) => {
            request.post({
                url: dingding_url,
                json: message
            }, (e, r, body) => {
                console.log(body)
                if (e) {
                    yapi
                    .commons
                    .log('push dingding' +  JSON.stringify(message)+dingding_url);
                    return reject(new Error(r))
                }
                if (body.errcode != 0) {
                    yapi
                        .commons
                        .log('push dingding' +  JSON.stringify(message) + ' error:' + JSON.stringify(body));
                }
                // console.log(body)
                resolve(body)
                // console.log(body)
            })
        })
    }

    requestText(dingding_url, text, at) {
        var body = {}
        if (at != undefined && at != null) {
            body["at"] = at
        }
        body["text"] = {
            content: text
        }
        return this.requestDingDing(dingding_url, "text", body)
    }

}
module.exports = dingding;
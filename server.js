// const request = require('request');
const yapi = require('yapi.js');
const mongoose = require('mongoose');
const controller = require('./controller');
const push = require('./push.js');
const pushObject = yapi.getInst(push)

module.exports = function () {

  yapi
    .connect
    .then(function () {
      let Col = mongoose
        .connection
        .db
        .collection('ddpush');
      Col.createIndex({project_id: 1});
    })



  this.bindHook('interface_add', (id, ctx) => {
    pushObject.create(id, ctx)
  })

  this.bindHook('interface_del', (id, ctx) => {
    pushObject.delete(id, ctx)
  })

  this.bindHook('interface_update', (id, ctx,old,newdata) => {
    pushObject.edit(id, ctx,old,newdata)
  })

  // 加路由
  this.bindHook("add_router", function (addRouter) {
    console.log("test")
    addRouter({controller: controller, method: "get", path: 'ddpush/get', action: 'getConfig'})

    addRouter({controller: controller, method: "post", path: 'ddpush/up', action: 'saveConfig'})
    addRouter({controller: controller, method: "post", path: 'ddpush/test', action: 'testDingding'})
  })
}
import DdPushPage from './page/index';

// const qualifyURL = (url, encode) => {
//   url = url || '';
//   var ret = location.protocol + '//' + location.host + (url.substr(0, 1) === '/' ? '' : location.pathname.match(/.*\//)) + url;
//   if (encode) {
//     ret = encodeURIComponent(ret);
//   }
//   return ret;
// }

module.exports = function () {
    this.bindHook('sub_nav', function(app) {
        app.dd_push = {
          name: '钉钉推送',
          path: '/project/:id/ddpush',
          component: DdPushPage
        };
      });
};











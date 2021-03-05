// app.js
App({
  onLaunch: function onLaunch() {
    var _this = this;

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs); // 登录

    wx.login({
      success: function success(res) {// 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    }); // 获取用户信息

    wx.getSetting({
      success: function success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: function success(res) {
              // 可以将 res 发送给后台解码出 unionId
              _this.globalData.userInfo = res.userInfo;
            }
          });
        }
      }
    });
  },
  globalData: {
    userInfo: null
  }
});
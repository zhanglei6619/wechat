  //index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    inputproj:"",
    inputnum1: "",
    inputnum2: "",
    inputnum3: "",
    inputnum4: "",
    inputxj: "",
    id1: "俯卧撑",
    id2: "引体向上",
    id3: "深蹲",
    id4: "举腿",
    id5: "桥",
    id6: "有氧运动",
    showflag1:0,
    showflag2:0,
    showflag3:0,
    showflag4:0,
    showflagxj:0,
    showflagbt:0
   },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    this.setData({
      datenow: util.formatTime(new Date)
    })
  },
  
  inputno1: function (e) {
    this.setData({
      showflag1: 1,
      showflag2: 0,
      showflag3: 0,
      showflag4: 0,
      showflagxj: 1,
      showflagbt:0,
      inputnum1: "",
      inputnum2: "",
      inputnum3: "",
      inputnum4: "",
      inputxj: "",
    })
    this.onLoad()
  },

  inputno2: function(){
    this.setData({
      showflag2: 1,
      showflagxj: 1,
      showflagbt: 1
    })
  },
  inputno3: function () {
    this.setData({
      showflag3: 1
    })
  },
  inputno4: function () {
    this.setData({
      showflag4: 1
    })
  },

  clickButton: function (e) {
    this.setData({
      inputproj: e.target.id,
      inputnum1: "",
      inputnum2: "",
      inputnum3: "",
      inputnum4: "",
      inputxj: "",

    })
    this.setData({
      showflag1: 1,
      showflag2: 0,
      showflag3: 0,
      showflag4: 0,
      showflagxj:1
    })
  },


  formSubmit: function(e) {
    //提交必须要有PySESSID!
    //var that = this;
    //var userInfo = e.detail.userInfo;
    if (wx.getStorageSync('OpenID')) {
      console.log(wx.getStorageSync('OpenID'))
      wx.request({
        url: 'https://zl007.xyz/fitness/upload',
        data: {
          Project: e.detail.value.Project,
          Group1: e.detail.value.Group1,
          Group2: e.detail.value.Group2,
          Group3: e.detail.value.Group3,
          Group4: e.detail.value.Group4,
          Summary: e.detail.value.Summary,
          Openid: wx.getStorageSync('OpenID')
        },
        method: 'POST',
        header: {
          'content-type': "application/x-www-form-urlencoded" // 默认值
        },
        success: function (res) {
          wx.showToast({
            title: '成功保存！',
            icon: 'success',
            duration: 2000//持续的时间
          })
        },
        fail: function (e) {
          console.log("input try again!")
        }
      })
    }
    else {
      //首次登陆获取授权码，向后台申请用户唯一标识openid
      wx.login({
        success: function (res) {
          var code = res.code;
          if (code) {
            console.log('获取用户登录凭证：' + code)
            wx.request({
            url: 'https://zl007.xyz/fitness/login',
              data: { code: code },
              method: 'GET',  
              success: function (res) {
                //that.setData({ sessionid: res.sessionid }
                console.log(res.data)
                wx.setStorageSync('OpenID', res.data)
                wx.request({
                  url: 'https://zl007.xyz/fitness/upload',
                  data: {
                    Project: e.detail.value.Project,
                    Group1: e.detail.value.Group1,
                    Group2: e.detail.value.Group2,
                    Group3: e.detail.value.Group3,
                    Group4: e.detail.value.Group4,
                    Summary: e.detail.value.Summary,
                    Openid: wx.getStorageSync('OpenID')
                  },
                  method: 'POST',
                  header: {
                    'content-type': "application/x-www-form-urlencoded" // 默认值
                  },
                  success: function (res) {
                    wx.showToast({
                      title: '成功保存！',
                      icon: 'success',
                      duration: 2000//持续的时间
                    })
                  },
                  fail: function (e) {
                    console.log("input try again!")
                  }
                })
              },
              fail: function (e) {
                console.log("sessionid try again!")
              }
            })
            // ------------------------------------
          } else {
            console.log('获取用户登录态失败：' + res.errMsg);
          }
        }
      })
    }

    //提交后回到初始
    this.setData({
      inputproj: "",
      inputnum1: "",
      inputnum2: "",
      inputnum3: "",
      inputnum4: "",
      inputxj: "",
      showflag1: 1,
      showflag2: 0,
      showflag3: 0,
      showflag4: 0,
      showflagxj: 0,
      showflagbt: 0
    })

  },
  
})

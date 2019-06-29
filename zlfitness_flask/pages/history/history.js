//history.js
//获取应用实例
const app = getApp()

Page({
  data: {
     getdata: " "
  },
  onLoad: function (options) {
    if (!wx.getStorageSync('OpenID')){
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
                wx.setStorageSync('OpenID', res.data)
                console.log("login yes!")
              },
              fail: function (e) {
                console.log("login try again!")
              }
            })
            // ------------------------------------
          } else {
            console.log('获取用户登录态失败：' + res.errMsg);
          }
        }
      })   
  }
    var that = this
    //全局变量赋值。
    app.globalData.period = options["period"]
    wx.request({
      url: 'https://zl007.xyz/fitness/history?period=' + app.globalData.period + '&openid=' + wx.getStorageSync('OpenID'),
      method: 'GET',
      success: function (res) {
        that.setData({ getdata: res.data })
        
        console.log(res.data)
        console.log(app.globalData.period)
        //console.log("historty nice try!")
      },
      fail: function (e) {
        console.log("historty try again!")
      }
  })
  },

  bingLongTap: function (e) {
    console.log(e)
    var that = this
    wx.showModal({
      title: '删除记录',
      content: '是否删除该记录？',
      success: function (res) {
        if (res.confirm) {
          console.log('当前行ID：' + e.currentTarget.id)
          wx.request({
            url: 'https://zl007.xyz/fitness/del?note1=' + e.currentTarget.id + '&openid=' + wx.getStorageSync('OpenID'),
            method: 'GET',
            success: function (res) {
              wx.showToast({
                title: '成功删除！',
                icon: 'success',
                duration: 2000//持续的时间
              })
            },
            fail: function (e) {
              console.log("del try again!")
            }
          })
          //重新加载
          wx.request({
            url: 'https://zl007.xyz/fitness/history?period=' + app.globalData.period + '&openid=' + wx.getStorageSync('OpenID'),
            method: 'GET',
            success: function (res) {
              that.setData({ getdata: res.data })
              console.log(res.data)
              //console.log("historty nice try!")
            },
            fail: function (e) {
              console.log("historty try again!")
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //前端合成excel（合成excel遇到疑问）
  tableToExcel: function (options) {
    console.log('triggered!')
    var that = this
    wx.request({
      url: 'https://zl007.xyz/fitness/history?period=' + app.globalData.period + '&openid=' + wx.getStorageSync('OpenID'),
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        //列标题，逗号隔开，每一个逗号就是隔开一个单元格
        let str = `具体时间,项目,组数,总结,日期\n`;
        //增加\t为了不让表格显示科学计数法或者其他格式
        for (let i = 0; i < res.data.length; i++) {
          for (let item in res.data[i]) {
            str += `${res.data[i][item] + '\t'},`;
          }
          str += '\n';
        }
        console.log(str)
        //encodeURIComponent解决中文乱码
        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
        console.log(uri)
        //通过创建a标签实现（createElement不能识别）
        var link = document.createElement("a");
        link.href = uri;
        //
        wx.openDocument({
          filePath: link,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function (e) {
            console.log(e)
          }
        })
    },
  })
  },
  //最终采用后端合成，小程序下载并打开
  tableToExcel2: function (options) {
    wx.request({
      //生成excel（后端）
      url: 'https://zl007.xyz/fitness/genfile?period=' + app.globalData.period + '&openid=' + wx.getStorageSync('OpenID'),
      success: function (res) {
        console.log("res.data:" + res.data)
        wx.downloadFile({
          //下载excel
          url: 'https://zl007.xyz/' + wx.getStorageSync('OpenID') + app.globalData.period +'.xls',
          success: function (res) {
            console.log(res)
            console.log('获取文档成功')
            var filePath = res.tempFilePath
            console.log('本地位置：' + filePath)
            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                console.log('打开文档成功')
              },
              fail: function (err) {
                console.log(err)
              }
            })
           },
          fail: function (err) {
            console.log(err)
          }
        })
        
        console.log("genfile nice try!")
      },
      fail: function (e) {
        console.log("genfile try again!")
      }
    })

  },

onclear: function () {

}

})

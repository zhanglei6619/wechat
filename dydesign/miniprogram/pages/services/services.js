// miniprogram/pages/services/services.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  atype: function() {
    wx.previewImage({
      urls: ["https://dydesign-1251059125.cos.ap-chongqing.myqcloud.com/img/Adesign.jpg"],
    })
  },
  btype: function() {
    wx.previewImage({
      urls: ["https://dydesign-1251059125.cos.ap-chongqing.myqcloud.com/img/Bdesign.jpg"],
    })
  },
  ctype: function() {
    wx.previewImage({
      urls: ["https://dydesign-1251059125.cos.ap-chongqing.myqcloud.com/img/Cdesign.jpg"],
    })
  },
  dtype: function() {
    wx.previewImage({
      urls: ["https://dydesign-1251059125.cos.ap-chongqing.myqcloud.com/img/Ddesign.jpg"],
    })
  },
  etype: function() {
    wx.previewImage({
      urls: ["https://dydesign-1251059125.cos.ap-chongqing.myqcloud.com/img/Edesign.jpg"],
    })
  },

  calling: function() {
    wx.makePhoneCall({
      phoneNumber: '13062388898',
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
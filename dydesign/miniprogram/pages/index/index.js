//index.js
Page({
  sy: function() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  qj: function() {
    wx.navigateTo({
      url: '/pages/design/design',
    })
  },
  fw: function() {
    wx.navigateTo({
      url: '/pages/services/services',
    })
  },
  atype: function() {
    wx.previewImage({
      urls: ["https://dydesign-1251059125.cos.ap-chongqing.myqcloud.com/img/Atype.jpg"],
    })
  },
  btype: function() {
    wx.previewImage({
      urls: ["https://dydesign-1251059125.cos.ap-chongqing.myqcloud.com/img/Btype.jpg"],
    })
  },
  ctype: function() {
    wx.previewImage({
      urls: ["https://dydesign-1251059125.cos.ap-chongqing.myqcloud.com/img/Ctype.jpg"],
    })
  },
  dtype: function() {
    wx.previewImage({
      urls: ["https://dydesign-1251059125.cos.ap-chongqing.myqcloud.com/img/Dtype.jpg"],
    })
  },
  etype: function() {
    wx.previewImage({
      urls: ["https://dydesign-1251059125.cos.ap-chongqing.myqcloud.com/img/Etype.jpg"],
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
  }

})
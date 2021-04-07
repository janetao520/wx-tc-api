// pages/prepayment/prepayment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Orderlist:[],
    total:0,
    out_trade_no:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let id = options.id// 接受 navigateTo 传递过来的id
  wx.request({
      url: `http://localhost:3000/api/order?id=${id}`,// 根据订单编号查询商品
      header: {'Authorization':'Bearer' + ' ' + wx.getStorageSync('access_token')},
      method: 'GET',
      success: (result)=>{
        console.log(result);
        let Orderlist = result.data.order.Order_products // 订单商品
        let out_trade_no= result.data.order.out_trade_no
        let total = result.data.total// 订单总额
        this.setData({
          Orderlist,
          total,
          out_trade_no
        })
      },
    });
  },
 // 微信支付
  handlePay(){
    var reqTask = wx.request({
      url: 'http://localhost:3000/api/order/pay',
      data: {out_trade_no:this.data.out_trade_no},
      header: {'Authorization':'Bearer' + ' ' + wx.getStorageSync('access_token')},
      method: 'post',
      success: (res)=>{
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: (result)=>{
            if(result.errMsg=='requestPayment:ok'){
              console.log('支付成功');
              
            }else{
              console.log('支付失败');
              
            }
            
          },
        });
        
      },
    });
  }
})
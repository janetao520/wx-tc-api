Page({
  data: {
   flag:false,
   access_token:'',
   token_type:''
  },
  onLoad:function(options){
    wx.login({
      success: (result)=>{
        let code = result.code// 微信身份code
        console.log(code);
        
        wx.request({
          url:'http://localhost:3000/api/user/login',
          data:{ code:code},
          method:'post',
          success:(result)=>{
            console.log(result,222); 
            wx.setStorageSync("access_token",result.data.token)
            // wx.setStorageSync("token_type",result.data.token_type)
          }
        })
      },
    });
  },
  // 展开
  handleShow(){
    this.setData({
      flag:!this.data.flag
    })
  },
  // 开始扫码
  hanleSweep(){
    wx.scanCode({
      success: (res)=>{
        let code = res.result// 扫的条形码
        wx.request({
          url: 'http://localhost:3000/api/carts',
          data:{code:code},
          header: {'Authorization':'Bearer' + ' ' + wx.getStorageSync('access_token')},
          method: 'post',
          success: (result)=>{
            const success = result.data.success
            console.log(result,22);
            if(!success){
              wx.showToast({
                    title: '添加失败',
                    icon: "loading",
                })
            }
            wx.showToast({
              title: '添加成功',
              icon: "success",
          })
          },
        });
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
   // 我的优惠券跳转
   handleDiscounts(){
    wx.navigateTo({
      url: '../my_discounts/my_discounts',
    });
  },
  // 扫码购物蓝跳转
  handleScan(){
    wx.navigateTo({
      url: '../cart/cart',
    });
  },
  // 订单跳转
  handleOrder(){
    wx.navigateTo({
      url: '../order_list/order_list',
    });
  },
})


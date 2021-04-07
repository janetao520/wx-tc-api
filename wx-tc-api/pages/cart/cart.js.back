// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    number:0,
    total_price1:0,
    show:true,
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlist() 
  },
  // 获取购物车数据
  getlist(){
    wx.request({
      url: 'http://localhost:3000/api/carts',
      header: {'Authorization':'Bearer' + ' ' + wx.getStorageSync('access_token')},
      success: (result)=>{
        let list = result.data.data
        let number = result.data.number // 总数量
        let total_price = result.data.total_price// 总价格
        let total_price1 = total_price.toFixed(2)
        console.log(list);
        
        if(list.length === 0){
          this.setData({
            show:true
          })
        }
        this.setData({
          list,
          number,
          total_price1
        })
      },
    });
  },
  // 增加数量
  handelAdd(e){
    let id = e.currentTarget.dataset.id
    wx.request({
      url: 'http://localhost:3000/api/carts',
      data: {type:'add',cart_id:id},
      header: {'Authorization':'Bearer' + ' ' + wx.getStorageSync('access_token')},
      method: 'put',
      success: (result)=>{
        this.getlist()
      },
    });
  },
  // 减少数量
  handelEdd(e){
    let id = e.currentTarget.dataset.id
    let number = e.currentTarget.dataset.number
    if(number!==1){
      this.remon(id)
      return
    }
    wx.showModal({
      title: '您确认要删除吗',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (res) => {
        if (res.confirm) {
          this.remon(id)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    });
  },
  // 删除接口
  remon(id){
    wx.request({
      url: 'http://localhost:3000/api/carts',
      data: {type:'edd',cart_id:id},
      header: {'Authorization':'Bearer' + ' ' + wx.getStorageSync('access_token')},
      method: 'put',
      success: (result)=>{
        console.log(result);
        this.getlist()
      },
    });
  },
  // 编辑
  handelCompile(){
    this.setData({
      show:!this.data.show
    })
  },
  // 编辑-删除当前行
  removeRow(e){
    let id = e.currentTarget.dataset.id
    wx.request({
      url: 'http://localhost:3000/api/carts',
      data: {cart_id:id},
      header: {'Authorization':'Bearer' + ' ' + wx.getStorageSync('access_token')},
      method: 'put',
      success: (result)=>{
        console.log(result);
        this.getlist()
      },
    });
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
              this.getlist()
            },
          });
          
        },
      });
    },

   // 预支付
   handlePay(){
     
   wx.request({
     // 生成订单编号
      url: 'http://localhost:3000/api/order',
      header: {'Authorization':'Bearer' + ' ' + wx.getStorageSync('access_token')},
      method: 'post',
      success: (result)=>{
        console.log(result);
        let id = result.data.order
        wx.navigateTo({
          url: '../prepayment/prepayment?id='+id,// 跳转携带 订单编号
        });
      },
    });

   }
})
//pages/order_input/order_input.js
const app = getApp();
Page({

  /**
   * 页面初始数据
   */
    data:{
      show:false,
      carts: [],
      scanCodeMsg:"",
      goods:""
    },

    //查询方法
    //1:获取输入框的值
    barcode :function (e) {
      this.setData({
        scanCodeMsg: e.detail.value
      })
    },
    //2:点击按钮操作
    search :function() {
        //console.log(this.data.scanCodeMsg)
        let goodsnum = this.data.scanCodeMsg;
        this.check(goodsnum)
    },

    //3:向后台发送数据
  check: function(data){
    var that = this;
    console.log("方法被调用");
    wx.request({
    url: 'http://zm.superxia.com/apiwx/check.php',
    //  url: 'http://localhost/test/api/check.php',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {plucode: data},
      
      success: function (res) {
        //console.log("返回的数据如下")
        console.log(res.data);
        var stringResult = res.data.split('+');
        //console.log(stringResult);
        var goods = new Object();
        goods.goodscode = stringResult[0];
        goods.goodsName = stringResult[1];
        goods.goodsBarcode = stringResult[2];
        goods.goodsSpec = stringResult[3];
        goods.goodsUnit = stringResult[4];
        goods.goodsPfprice = stringResult[5];
        goods.scanCodeMsg = stringResult[2];
        goods.num = 1;
        that.setData({
          goods: goods,
          goodscode: stringResult[0],
          goodsName:stringResult[1],
          goodsBarcode: stringResult[2],
          goodsSpec: stringResult[3],
          goodsUnit: stringResult[4],
          goodsPfprice: stringResult[5],
          scanCodeMsg:stringResult[2],
          show:true
        });
        wx.showToast({
          title: '查找商品成功',
          icon: 'success',
          duration: 1000
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '查找商品失败',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  onTabItemTap: function (item) {
    // 写回经点击修改后的数组
    this.setData({
      carts: app.globalData.cartData
    });
},
onShow: function (item) {
  console.log(app.globalData.cartData);
  console.log(this.data.carts);
  if(app.globalData.cartData){
    this.setData({
      carts: app.globalData.cartData
    });
  } 
  console.log(this.data.carts);
},
  //将从海信ERP中获取到的商品信息添加至下单页面
  addshop:function(){
    var that = this;
    var scanCodeMsg = that.data.scanCodeMsg;
   let result = that.data.carts.some(item=>{
       if(item.scanCodeMsg==scanCodeMsg){
           return true
       }
   });
   if(result){ // 如果存在
     that.data.carts.forEach((item,index)=>{
         if(item.scanCodeMsg==scanCodeMsg){
             item.num++;
             return true;
         }
     });
   }else{
     that.data.goods.num=1;
     that.data.carts.push(that.data.goods);
   }
   app.globalData.cartData = that.data.carts
   console.log(that.data.carts)
   console.log(app.globalData.cartData)
     wx.showToast({
       title: '添加商品成功',
       icon: 'success',
       duration: 1000
     });

    //console.log( app.globalData.cartData);
    //获取到商品数据
    // wx.navigateTo({
    //   url: '../cart/cart',
   //  })
 
   },
});
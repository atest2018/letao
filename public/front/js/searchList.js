$(function() {
  
  var currentPage = 1;
  var pageSize = 2;
  
  // 根据搜索关键字, 发送请求, 进行页面渲染
  function render(callback) {
    // 准备请求数据, 渲染时, 显示加载中的效果
    // $('.lt_product').html('<div class="loading"></div>');
    
    var params = {};
    // 三个必传的参数
    params.proName = $('.search_input').val();
    params.page = currentPage;
    params.pageSize = pageSize;
    
    // 两个可传可不传的参数,
    // (1) 需要根据高亮的 a 来判断传哪个参数,
    // (2) 通过箭头判断, 升序还是降序
    // 价格: price    1升序，2降序
    // 库存: num      1升序，2降序
    
    var $current = $('.lt_sort a.current');
    if ( $current.length > 0 ) {
      // 有高亮的 a, 说明需要进行排序
      // 获取传给后台的键
      var sortName = $current.data("type");
      // 获取传给后台的值, 通过箭头方向判断
      var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
      
      // 添加到 params 中
      params[ sortName ] = sortValue;
    }
    
    setTimeout(function() {
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function( info ) {
          callback && callback(info);
        }
      });
    }, 500);
  }
  
  // 功能1: 获取地址栏传递过来的搜索关键字, 设置给 input
  var key = getSearch("key");
  // 设置给 input
  $('.search_input').val( key );
  // 一进入页面, 渲染一次
  render();
  
  
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        height:50,//可选,默认50.触发下拉刷新拖动距离,
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        callback : function () {
          currentPage = 1;
          render(function (info) {
            var htmlStr = template("productTpl", info);
            $('.lt_product').html( htmlStr );
  
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
  
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
  
          });
        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      },
  
      up : {
        height:50,//可选.默认50.触发上拉加载拖动距离
        auto:true,//可选,默认false.自动上拉加载一次
        contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
        contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
        callback : function () {
          currentPage++;
          render(function (info) {
            var htmlStr = template("productTpl", info);
            $('.lt_product').append( htmlStr );
  
            if ( info.data.length === 0 ) {
              // 没有更多数据了, 显示提示语句
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh( true );
            }
            else {
              // 还有数据, 正常结束上拉加载
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh( false );
            }
          });
        }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      }
    }
  });

  // 功能2: 点击搜索按钮, 实现搜索功能
  $('.search_btn').click(function() {

    // 需要将搜索关键字, 追加存储到本地存储中
    var key = $('.search_input').val();
    if ( key.trim() === "" ) {
      mui.toast("请输入搜索关键字");
      return;
    }
    
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading()

    // 获取数组, 需要将 jsonStr => arr
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse( history );

    // 1. 删除重复的项
    var index = arr.indexOf( key );
    if ( index != -1 ) {
      // 删除重复的项
      arr.splice(index, 1);
    }
    // 2. 长度限制在 10
    if ( arr.length >= 10 ) {
      // 删除最后一项
      arr.pop();
    }

    // 将关键字追加到 arr 最前面
    arr.unshift( key );
    // 转成 json, 存到本地存储中
    localStorage.setItem("search_list", JSON.stringify( arr ) );
  });



  // 功能3: 排序功能
  // 通过属性选择器给价格和库存添加点击事件
  // (1) 如果自己有 current 类, 切换箭头的方向即可
  // (2) 如果自己没有 current 类, 给自己加上 current 类, 并且移除兄弟元素的 current

  $('.lt_sort a[data-type]').on('tap', function() {

    if ( $(this).hasClass("current") ){
      // 有 current 类, 切换箭头即可
      $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
    }
    else {
      // 没有 current 类, 自己加上 current 类, 移除兄弟元素的 current
      $(this).addClass( "current" ).siblings().removeClass("current");
    }
  
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading()
  
  });
  
  
  
  
  
});
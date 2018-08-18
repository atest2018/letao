// //开启进度条
// NProgress.start();
//
// setTimeout(function() {
//  // 结束进度条
//  NProgress.done();
// }, 2000);


// 实现在第一个ajax发送的时候, 开启进度条
// 在所有的ajax请求都完成的时候, 结束进度条

// ajax 全局事件

// 1. ajaxComplete 当每个 ajax 请求完成的时候, 调用 (不管成功还是失败都调用)
// 2. ajaxError    当 ajax 请求失败的时候, 调用
// 3. ajaxSuccess  当 ajax 请求成功的时候, 调用
// 4. ajaxSend     在每个 ajax 请求发送前, 调用
// 5. ajaxStart    在第一个 ajax 发送时, 调用
// 6. ajaxStop     在所有的 ajax 请求完成时, 调用


// ajaxStart 在第一个 ajax 发送时, 调用
$(document).ajaxStart(function() {
    // 开启进度条
    NProgress.start();
});

// ajaxStop 在所有的ajax完成时, 调用
$(document).ajaxStop(function() {

    // 模拟网络延迟
    setTimeout(function() {
        // 关闭进度条
        NProgress.done();
    }, 500);

});



// 登录拦截功能, 登录页面不需要校验, 不用登录就能访问
// 前后分离了, 前端是不知道该用户是否登录了, 但是后台知道,
// 发送 ajax请求, 查询用户状态即可
// (1) 用户已登录, 啥都不用做, 让用户继续访问
// (2) 用户未登录, 拦截到登录页

if ( location.href.indexOf("login.html") === -1 ) {
    // 地址栏中没有 login.html, 说明不是登录页, 需要进行登录拦截
    $.ajax({
        type: "get",
        url: "/employee/checkRootLogin",
        dataType: "json",
        success: function( info ) {
            console.log( info )
            if ( info.success ) {
                // 已登录, 让用户继续访问
                console.log("用户已登录")
            }

            if ( info.error === 400 ) {
                // 未登录, 拦截到登录页
                location.href = "login.html";
            }
        }
    })
}


/**
 * 支付宝账号登录，步数同步+捐步
 * 
 */

function doWork(){
    console.show()
    closeAlipay()
    var accont_list = [
        "小号1",
        "小号2",
        "小号3",
        "小号4",
    
    ]
    // 因为所有的小号密码一样，所以没有使用数组
    var key = "密码"
    // 三星健康刷步数
    console.log("三星健康刷步数启动")
    var step = steps(6)
    console.log('开始切换账号进行运动同步')
    for (let accont = 0; accont < accont_list.length; accont++) {
        // 登录账号
        sleep(2000)
        console.log(
            "正在登录第"+ (accont+1) + "个账号\n"+
            "账号："+ accont_list[accont]
        )
        login(accont_list[accont], key)
        // 进入运动
        console.log("正在进入运动等待同步完成...")
        go_sports();
        // 进入蚂蚁森林
        console.log("正在进入蚂蚁森林等待浇水完成...")
        enterForest()
    }
    mainAccount()
    var len = checkRank(step)
    if(len == accont_list.length){
        console.log("今天的账号已全部同步完毕！")
    }else{
        console.log("今天还剩："+ accont_list.length - len + "个账号位同步成功！")
    }
    console.log("任务完成\n今天又是元气满满的一天！")
}

function mainAccount(){
    account = "大号账号"
    key = "大号密码"
    console.log("正在登陆大号~~\n账号：" + account)
    login(account, key)
    console.log("正在进入运动等待同步完成...")
    go_sports()
}


function clickCenter(obj) {
    let b = obj.bounds()
    return (click(b.centerX(), b.centerY()))
}

/**
 * 利用三星健康 + 三星健康管理实现支付宝刷步数
 * 环境搭建（Root手机）：
 * 1、下载刷步数三件套（https://lingsiki.lanzous.com/b0ejfe25a）。
 * 2、edxp激活应用变量模块，并且设置三星健康、支付宝和三星健康管理模拟机型为三星型号手机。
 * 3、进入三星健康设置-关于三星健康点击版本号十次开启开发者模式-然后进入数据权限开启支付宝和三星健康管理的所有权限。
 * 4、进入支付宝的支付宝运动-右上角三点进入设置，开启记录运动数据。
 * 5、保持三星健康在后台，打开三星健康管理增加步数，进入三星健康等一会儿即可同步步数，最后关闭重启支付宝，进入运动查看同步情况
 * 6、若失败可能是机型伪装的问题，也有可能是第一天刷步数可能延迟会有点大，第二天以后一般都是秒同步的
 * @param {步数=count * 12000} count 
 */

function steps(count) {
    launchApp('三星健康');
    sleep(1000);
    launchApp('三星健康步数管理');
    idContains("floatingActionButton").waitFor()
    sleep(1000)
    for (let index = 0; index < count; index++) {
        idContains("floatingActionButton").findOne().click()
        sleep(500)
        click(800, 1750)
        sleep(500)
    }
    launchApp('三星健康');
    text('主页').waitFor();
    var obj = idContains('goal').findOne()
    clickCenter(obj);
    sleep(5000)
    while (1){
        step = idContains('current_steps').findOne().text()
        if (step != '0'){
            console.log("当前刷步数为：" + step)
            return step;
        }
    }

}
/**
 * 
 * @param {账号} accont 
 * @param {密码} key 
 */
function login(accont, key) {
    // 进入支付宝密码登录界面
    app.startActivity(app.intent({
        action: "VIEW",
        data: "alipayqr://platformapi/startapp?appId=20000008",
    }));
    textMatches("换个账号登录").findOne(5000)
    click("换个账号登录")
    sleep(400)
    setText(0, accont);
    textMatches("下一步").findOne(5000)
    click("下一步")
    idContains("loginButton").waitFor()
    var obj = textMatches(/短信验证码登录|忘记密码?|换个方式登录/).findOne().text()
    if (obj == "短信验证码登录") {
        sleep(200)
        textMatches(/换个验证方式|换个方式登录/).findOne()
        click("换个验证方式")
        click("换个方式登录")
        text("密码登录").findOne()
        sleep(200)
        while (!click("密码登录")) { }
        sleep(400)
        setText(0, accont);
        sleep(200);
        setText(1, key);
        sleep(200)
        idContains("loginButton").findOne().click()
        console.log(accont, "登录成功")
    } else {
        sleep(400)
        setText(1, key);
        sleep(400)
        idContains("loginButton").findOne().click()
        console.log(accont, "登录成功")
    }
}
/**
 * 进入支付宝运动步数同步以及捐步
 */
function go_sports() {
    sleep(2000)
    app.startActivity({
        data: "alipayqr://platformapi/startapp?saId=20000869"
    })
    textContains("走路线").waitFor();
    swipe(device.width / 9 * 8, device.height / 3, device.width / 9 * 8, device.height / 3 * 2, 500)
    sleep(5000)
    var obj1 = text('去捐步').findOne(1000)
    if (obj1 != null){
        clickCenter(text('去捐步').findOne())
        sleep(3000)
        text('立即捐步').findOne()
        sleep(200)
        while (!click("立即捐步")) {}
        sleep(500)
        clickCenter(text("知道了").findOne(1000))
        console.log('捐步成功')
    }else{
        console.log('已经捐完步数了')
    }
}

function checkRank(step){
    sleep(2000)
    app.startActivity({
        data: "alipayqr://platformapi/startapp?saId=20000869"
    })
    textContains("走路线").waitFor();
    sleep(400)
    swipe(device.width / 9 * 8, device.height / 9 * 8, device.width / 9 * 8, device.height / 9, 500)
    while(text('查看更多').exists()){
        var obj = text('查看更多').findOne(1000)
        if(!text('切换').exists()){
            clickCenter(obj)
            sleep(1000)
            break;
        }
    }
    step = step + "步"
    sleep(2000)
    var list = textMatches("/"+step+"/").find()
    console.log("当前正常同步账号数为：" + list.length + "个")
    return list.length
}

/**
 * 进入蚂蚁森林
 */
function enterForest(){
    sleep(2000)
    app.startActivity({
        data: "alipayqr://platformapi/startapp?saId=60000002"
    })
    sleep(2000)
}

/**
 * 关闭支付宝
 */
function closeAlipay(){
    appName = app.getPackageName('支付宝')
    app.openAppSetting(appName)
    sleep(1000)
    var obj = text('结束运行').findOne(5000)
    clickCenter(obj)
    var btn = idContains('button1').findOne(1000)
    if (btn){
        btn.click()
    }
    console.log("支付宝关闭成功！\n开启任务")
}

function test(){
    console.show()
    // go_sports()
    // mainAccount()
    checkRank() 
}

// test()
doWork()


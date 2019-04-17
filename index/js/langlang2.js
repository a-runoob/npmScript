
    var RongCloud={
        data:{
            scrollViewH:0,//滚动条外壳高度
            unreadCount:0,
            msglist:[],
            hasMsg:true,
        },
        targetUser:{
            targetId:'1',
            name:'小红',
            portrait:'http://pic.qqtn.com/up/2015-8/2015081115292489580.jpg',
           
        },
        // user:{
        //     id:'3',
        //     name:'郎朗',
        //     portrait:'http://pic2.orsoon.com/2017/0226/20170226092757555.jpg',
        //     token:"CW8IEFsNUf5qgJt3cYwX1fZHOQSI/NnOKrwwliP/ChaFD2QNz7P0J37r2XCeUAZkb5LPs6uBKBQ="
        // },
        user:{
            targetId:'2',
            name:'小明',
            portrait:'http://img3.duitang.com/uploads/item/201511/23/20151123134647_dC5iA.thumb.700_0.jpeg',
            token:'qFmmFLn10DAjsEw3XvFVxhb5pc4/yDlAwe02uGw8PSXGoY16tlf9kFlaoBAXGb2VGxR5RQCdGH8Y0vj/nJwY6w=='
        },
        //连接服务器
        connectServer:function(){
            //app Key:   vnroth0kvbo8o
            //App Secret:   8v9zq15laaXdNX
            // 初始化SDK     AppKey：融云后台创建应用的唯一标识
            RongIMLib.RongIMClient.init('vnroth0kvbo8o');
            // 连接服务器 
            var token = RongCloud.user.token;
            RongIMClient.connect(token, {
                onSuccess: function(userId) {
                    console.log('Connect successfully. 用户' + userId);
                    //链接成功后   渲染所有聊天列表
                    RongCloud.getChatList();
                    //scroll的高度
                    RongCloud.data.scrollViewH = $('.scrollView').height();
                    //提前加载一些历史消息
                    RongCloud.getHistory()
                    //渲染未读消息
                    RongCloud.getUnreadMsg();
                    //清除未读消息
                    if(window.location.href.match(/chatRoom/gim)){
                        RongCloud.clearUnreadMsg();
                    }
                },
                onTokenIncorrect: function() {
                    console.log('token 无效');
                },
                onError: function(errorCode){
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
                            info = '不可接受的协议版本';
                            break;
                        case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
                            info = 'appkey不正确';
                            break;
                        case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
                            info = '服务器不可用';
                            break;
                    }
                    console.log(info);
                }
            });
        },
        //监听连接服务器状态
        listenConnectStatus:function(){
            // 连接状态监听器
            RongIMClient.setConnectionStatusListener({
                onChanged: function (status) {
                    // status 标识当前连接状态
                    switch (status) {
                        case RongIMLib.ConnectionStatus.CONNECTED:
                            console.log('链接成功');
                            break;
                        case RongIMLib.ConnectionStatus.CONNECTING:
                            console.log('正在链接');
                            break;
                        case RongIMLib.ConnectionStatus.DISCONNECTED:
                            console.log('断开连接');
                            //重新连接
                            RongCloud.reConnect();
                            break;
                        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                            console.log('其他设备登录');
                            break;
                        case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                            console.log('域名不正确');
                            break;
                        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                            console.log('网络不可用');
                            //重新连接
                            RongCloud.reConnect();
                    }
                }
            });
        },
        //重新连接
        reConnect:function(){
            var callback = {
                onSuccess: function(userId) {
                    console.log(userId + 'Reconnect successfully. ');
                },
                onTokenIncorrect: function() {
                    console.log('token无效');
                },
                onError: function(errorCode){
                    console.log(errorcode);
                }
            };
            var config = {
                // 默认 false, true 启用自动重连，启用则为必选参数
                auto: true,
                // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
                url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
                // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
                rate: [100, 1000, 3000, 6000, 10000]
            };
            RongIMClient.reconnect(callback, config);
        },
        //消息监听
        listenMessage:function(){
            RongIMClient.setOnReceiveMessageListener({
                // 接收到的消息
                onReceived: function (message) {
                    switch(message.messageType){        
                        case RongIMClient.MessageType.TextMessage:
                        var div='<div class="receiveMsg">'+
                            '<img src="'+RongCloud.targetUser.portrait+'" class="usericon"></img>'+
                            "<span class='messageinfo'>"+message.content.content+'</span></div>'
                        $('.innerest').append(div);
                        //滚动条 高度
                        RongCloud.scrollTrans(); 
                        console.log('接收到的消息:'+message.content.content);
                            break;
                        case RongIMClient.MessageType.ImageMessage:
                        //聊天图片  存到缓存
                        RongCloud.imgSize(message.content.content,(w,h)=>{
                            var imgs = JSON.parse(localStorage.getItem('imgs')||'[]');
                            var imgstime = JSON.parse(localStorage.getItem('imgstime')||'[]')
                            var obj={
                                src:message.content.content,
                                w:w,
                                h:h,
                                sentTime:message.sentTime
                            }
                            console.log(message.sentTime)
                            if(imgstime.indexOf(message.sentTime)==-1){
                                // console.log('sss')
                                imgstime.push(message.sentTime);
                                imgs.unshift(obj);
                                localStorage.setItem('imgs',JSON.stringify(imgs))
                                localStorage.setItem('imgstime',JSON.stringify(imgstime))
                            }
                            else{
                                console.log('ddd')
                                localStorage.setItem('imgs',JSON.stringify(imgs))
                                localStorage.setItem('imgstime',JSON.stringify(imgstime))    
                            }     
                        })
                        var div=
                        '<div class="receiveMsg">'+
                            '<img src="'+RongCloud.targetUser.portrait+'" class="usericon"></img>'+
                            '<img src="'+message.content.content+'" class="photo" onclick="RongCloud.preview(`'+message.sentTime+'`)"></img>'+
                        '</div>'
                        $('.innerest').append(div);
                        //滚动条 高度
                        RongCloud.scrollTrans();
                            // message.content.content => 图片缩略图 base64
                            // message.content.imageUri => 原图 URL
                            break;
                        case RongIMClient.MessageType.VoiceMessage:
                            // message.content.content => 格式为 AMR 的音频 base64
                            break;
                        case RongIMClient.MessageType.LocationMessage:
                            // message.content.latiude => 纬度
                            // message.content.longitude => 经度
                            // message.content.content => 位置图片 base64
                            break;
                        case RongIMClient.MessageType.RichContentMessage:
                            // message.content.content => 文本消息内容
                            // message.content.imageUri => 图片 base64
                            // message.content.url => 原图 URL
                            break;
                        case RongIMClient.MessageType.InformationNotificationMessage:
                            break;
                        case RongIMClient.MessageType.ContactNotificationMessage:
                            break;
                        case RongIMClient.MessageType.ProfileNotificationMessage:
                            break;
                        case RongIMClient.MessageType.CommandNotificationMessage:
                            break;
                        case RongIMClient.MessageType.CommandMessage:
                            break;
                        case RongIMClient.MessageType.UnknownMessage:
                            break;
                        default:
                    }
                    //接收消息后更新消息列表
                    RongCloud.getChatList();
                    RongCloud.getUnreadMsg();
                }
            });
        },
        //用户正在输入状态
        inputStatus:function(){
            var conversationType = RongIMLib.ConversationType.PRIVATE; // 只有单聊有正在输入状态
            var targetId = RongCloud.targetUser.targetId;
            var msgName = 'VoiceMessage'; //用户正在输入的消息类型 VoiceMessage等。
            RongIMClient.getInstance().sendTypingStatusMessage(conversationType, targetId, msgName, {
                onSuccess: function (message) {
                    console.log('正在输入....');
                },
                onError: function (errorCode, message) {
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN:
                            info = '未知错误';
                            break;
                    }
                    console.log('发送失败:' + info + errorCode);
                }
            });
        },
        //发送文本消息
        sendTextMsg:function(){
            var msg = new RongIMLib.TextMessage({ content: encodeURIComponent($('.message').val()), extra: '' ,user:RongCloud.user});
            var conversationType = RongIMLib.ConversationType.PRIVATE; // 单聊, 其他会话选择相应的消息类型即可
            var targetId = this.targetUser.targetId; // 目标 Id
            RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
                onSuccess:(message)=> {
                    // message 为发送的消息对象并且包含服务器返回的消息唯一 Id 和发送消息时间戳
                    var div='<div class="sendMsg"><img src="'+this.user.portrait+'" class="usericon"></img>'+"<span class='messageinfo'>"+$('.message').val()+'</span></div>';
                    $('.innerest').append(div); 
                    $('.message').val('');
        
                    //滚动条 高度
                    RongCloud.scrollTrans();
                },
                onError: function (errorCode, message) {
                    var info = '';
                    switch (errorCode) { 
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                    }
                    console.log('发送失败: ' + info + errorCode);
                }
            });
        },
        //发送图片  压缩
        //图片压缩 base64
        fileUp:function(me) {
            base64Image({
                width:750,                             /*【选填】宽度默认750，如果图片尺寸大于该宽度，图片将被设置为该宽度*/
                ratio:0.75,                            /*【选填】压缩率默认0.75 */
                file: me,                              /*【必填】对应的上传元素 */
                callback:  (base64Str)=> {        /*【必填】处理成功后的回调函数 */
                    var imageUri = ''; // 上传到自己服务器的 URL。
                    var base64Str =base64Str ;
                    var msg = new RongIMLib.ImageMessage({content: base64Str, imageUri: imageUri,user:RongCloud.user});
                    var conversationType = RongIMLib.ConversationType.PRIVATE; // 单聊, 其他会话选择相应的消息类型即可
                    var targetId =this.targetUser.targetId ; // 目标 Id
                    RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
                        onSuccess:  (message)=> {
                            var div=
                            '<div class="sendMsg">'+
                                '<img src="'+this.user.portrait+'" class="usericon"></img>'+
                                '<img src="'+message.content.content+'" onclick="RongCloud.preview(`'+message.sentTime+'`)" class="photo"></img>'+
                            '</div>';
                            //聊天图片  存到缓存
                            RongCloud.imgSize(message.content.content,(w,h)=>{
                                var imgs = JSON.parse(localStorage.getItem('imgs')||'[]');
                                var imgstime = JSON.parse(localStorage.getItem('imgstime')||'[]')
                                var obj={
                                    src:message.content.content,
                                    w:w,
                                    h:h,
                                    sentTime:message.sentTime
                                }
                                console.log(message.sentTime)
                                if(imgstime.indexOf(message.sentTime)==-1){
                                    console.log('sss')
                                    imgstime.push(message.sentTime);
                                    imgs.unshift(obj);
                                    localStorage.setItem('imgs',JSON.stringify(imgs))
                                    localStorage.setItem('imgstime',JSON.stringify(imgstime))
                                }
                                else{
                                    console.log('ddd')
                                    localStorage.setItem('imgs',JSON.stringify(imgs))
                                    localStorage.setItem('imgstime',JSON.stringify(imgstime))    
                                }     
                            })
                            $('.innerest').append(div);
                            //滚动条 高度
                            RongCloud.scrollTrans();
                            console.log('图片发送成功');
                        },
                        onError: function (errorCode, message) {
                            var info = '';
                            switch (errorCode) {
                                case RongIMLib.ErrorCode.TIMEOUT:
                                    info = '超时';
                                    break;
                                case RongIMLib.ErrorCode.UNKNOWN:
                                    info = '未知错误';
                                    break;
                                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                                    info = '在黑名单中，无法向对方发送消息';
                                    break;
                                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                                    info = '不在讨论组中';
                                    break;
                                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                                    info = '不在群组中';
                                    break;
                                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                                    info = '不在聊天室中';
                                    break;
                            }
                            console.log('发送失败:' + info + errorCode);
                        }
                    });
                },
            });
        },
        //初始化  表情
        InitEmoji:function(){
                //表情
                // 直接初始化
                RongIMLib.RongIMEmoji.init();
                // 通过配置初始化
                // 表情信息可参考 http://unicode.org/emoji/charts/full-emoji-list.html
                var config = {
                    size: 24, // 大小, 默认 24, 建议15 - 55
                    url: '//f2e.cn.ronghub.com/sdk/emoji-48.png', // 所有 emoji 的背景图片
                    lang: 'zh', // 选择的语言, 默认 zh
                    // 扩展表情
                    extension: {
                        dataSource: {
                            "u1F914":{  
                                "en":"thinking face", // 英文名称
                                "zh":"思考", // 中文名称
                                "tag":"🤔", // 原生emoji
                                "position":"0px 0px" // 所在背景图位置坐标
                            },
                        },
                        // 新增 emoji 的背景图 url
                        url: 'https://emojipedia-us.s3.amazonaws.com/thumbs/160/apple/96/thinking-face_1f914.png'
                    }
                };
                RongIMLib.RongIMEmoji.init(config);
                //获取Emoji列表
                var list=RongIMLib.RongIMEmoji.list;
                // console.log(list[0].emoji)
                for(item in list){
                    var li='<li class="li" data-emoji="'+list[item].emoji+'" onclick="$(`.input input`).val($(`.input input`).val()+$(this).attr(`data-emoji`));">'+
                                '<span class="item" >'+list[item].emoji+'</span>'+
                            '</li>';
                    if(item<=50){
                        $('.express1').append(li);
                    }
                    if(item>50&&item<=100){
                        $('.express2').append(li);
                    }
                    if(item>100){
                        $('.express3').append(li);
                    }  
                }
        },
        //消息滚动条 
        scrollTrans:function(){
            var distance=$('.innerest').height()-$('.inner').height()
            if($('.innerest').height()>=$('.inner').height()){
                $('.inner').scrollTop(distance);
            }
        },
        //菜单/表情  点击事件
        menuExpress:function(x,y){
            if(x.css('display')=='none' && y.css('display')=='none'){
                y.slideDown(250,()=>{
                    $('.scrollView').height(RongCloud.data.scrollViewH - y[0].offsetHeight);
                    RongCloud.scrollTrans();
                });
                return;
            }
            if(x.css('display')=='none' && y.css('display')=='flex'){
                y.slideUp(250,()=>{
                    $('.scrollView').height(RongCloud.data.scrollViewH + y[0].offsetHeight);
                    RongCloud.scrollTrans();
                });
                return;
            }
            if(x.css('display')=='flex' && y.css('display')=='none'){
                x.slideUp(300);
                y.slideDown(300);
                RongCloud.scrollTrans();
                return;
            }
        },
        //消息框点击  .inner
        innerClick:function(){
            if($('.expressionMenu').css('display')=='flex'){
                $('.expressionMenu').slideUp(300);
                $('.scrollView').height(RongCloud.data.scrollViewH)
                RongCloud.scrollTrans();
                return;
            }
            if($('.menu').css('display')=='flex'){
                $('.menu').slideUp(300);
                $('.scrollView').height(RongCloud.data.scrollViewH)
                RongCloud.scrollTrans();
                return;
            }   
        },
        //下拉获取聊天记录
        downGetHistory:function(){
            if($('.inner').scrollTop()==0){
                var div='<div class="loadimg">'+
                            '<img src="langlangimg/preloader.gif"></img>'+
                        '</div>'
                $('.inner').prepend(div);
                setTimeout(()=>{
                    RongCloud.getHistory();
                    $('.loadimg').remove();
                },400) 
                return;
            }
        },
        //聊天记录
        getHistory:function(){
            var conversationType = RongIMLib.ConversationType.PRIVATE; //单聊, 其他会话选择相应的消息类型即可
            var targetId = this.targetUser.targetId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id
            var timestrap = null; // 默认传 null，若从头开始获取历史消息，请赋值为 0, timestrap = 0;
            var count = 20; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取
            RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
                onSuccess: (list, hasMsg)=> {
                    var currentHeight;//滚动条当前距离顶部高度
                    var tatalItemHeight = 0;//全部item的高度
                    list.reverse().forEach((item,index)=>{
                        // console.log(RongCloud.user.id);
                        if(item.senderUserId==RongCloud.user.id){
                            var image_text=decodeURIComponent(item.content.content)
                            if(item.messageType=="TextMessage"){
                                var div='<div class="sendMsg msgItem">'+
                                            '<img src="'+RongCloud.user.portrait+'" class="usericon"></img>'+
                                        "<span class='messageinfo'>"+image_text+'</span></div>';
                                $('.innerest').prepend(div); 
                            }
                            if(item.messageType=="ImageMessage"){
                                var div=
                                '<div class="sendMsg msgItem">'+
                                    '<img src="'+RongCloud.user.portrait+'" class="usericon"></img>'+
                                    '<img src="'+image_text+'" class="photo" onclick="RongCloud.preview(`'+item.sentTime+'`)"></img>'+
                                '</div>';
                                $('.innerest').prepend(div); 
                                //聊天图片  存到缓存
                                RongCloud.imgSize(image_text,(w,h)=>{
                                    var imgs = JSON.parse(localStorage.getItem('imgs')||'[]');
                                    var imgstime = JSON.parse(localStorage.getItem('imgstime')||'[]')
                                    
                                    var obj={
                                        src:image_text,
                                        w:w,
                                        h:h,
                                        sentTime:item.sentTime
                                    }
                                    // console.log(item.sentTime)
                                    if(imgstime.indexOf(item.sentTime)==-1){
                                        console.log('sss')
                                        imgstime.push(item.sentTime);
                                        imgs.unshift(obj);
                                        localStorage.setItem('imgs',JSON.stringify(imgs))
                                        localStorage.setItem('imgstime',JSON.stringify(imgstime))
                                    }
                                    else{
                                        // console.log('ddd')
                                        localStorage.setItem('imgs',JSON.stringify(imgs))
                                        localStorage.setItem('imgstime',JSON.stringify(imgstime))    
                                    }     
                                })
                                
                            }
                           
                            //滚动条到最下
                            // RongCloud.scrollTrans();
                        }
                        if(item.senderUserId==RongCloud.targetUser.targetId){
                            var image_text=decodeURIComponent(item.content.content)
                            if(item.messageType=="TextMessage"){
                                var div=
                                '<div class="receiveMsg msgItem">'+
                                '<img src="'+RongCloud.targetUser.portrait+'" class="usericon"></img>'+
                                "<span class='messageinfo'>"+image_text+'</span></div>'
                                $('.innerest').prepend(div);
                            }
                            if(item.messageType=="ImageMessage"){
                                var div=
                                '<div class="receiveMsg msgItem">'+
                                    '<img src="'+RongCloud.targetUser.portrait+'" class="usericon"></img>'+
                                    '<img src="'+image_text+'" class="photo" onclick="RongCloud.preview(`'+item.sentTime+'`)"></img>'+
                                '</div>'
                                $('.innerest').prepend(div);
                                RongCloud.imgSize(image_text,(w,h)=>{
                                    var imgs = JSON.parse(localStorage.getItem('imgs')||'[]');
                                    var imgstime = JSON.parse(localStorage.getItem('imgstime')||'[]')
                                    var obj={
                                        src:image_text,
                                        w:w,
                                        h:h,
                                        sentTime:item.sentTime
                                    }
                                    // console.log(item.sentTime)
                                    if(imgstime.indexOf(item.sentTime)==-1){
                                        imgstime.push(item.sentTime);
                                        imgs.unshift(obj);
                                        localStorage.setItem('imgs',JSON.stringify(imgs))
                                        localStorage.setItem('imgstime',JSON.stringify(imgstime))
                                    }
                                    else{
                                        // console.log('ddd')
                                        localStorage.setItem('imgs',JSON.stringify(imgs))
                                        localStorage.setItem('imgstime',JSON.stringify(imgstime))    
                                    }  
                                })
                            }
                        }
                        tatalItemHeight +=parseInt($('.msgItem').eq(0).height())+ 20; 
                        if(index==6||index==13 || index==19){
                            var div='<div class="time">'+RongCloud.timestampToFullTime(item.sentTime)+'</div>'
                            $('.innerest').prepend(div); 
                            tatalItemHeight +=parseInt($('.time').eq(0).height()); 
                        }
                        //item总高度
                        $('.inner').scrollTop(tatalItemHeight);  
                    })
                    //  console.log(tatalItemHeight);
                },
                onError: function(error) {
                    console.log('GetHistoryMessages, errorcode:' + error);
                }
            });
        },
        //清除历史消息
        clearHistory:function(timestamp){
            var params = {
                conversationType: RongIMLib.ConversationType.PRIVATE, // 会话类型
                targetId: this.targetUser.targetId, // 目标 Id
                timestamp: timestamp // 清除时间点
            };
            RongIMLib.RongIMClient.getInstance().clearRemoteHistoryMessages(params, {
                onSuccess: function() {
                    console.log('清除成功')
                    // 清除成功
                },
                onError: function(error) {
                    // 请排查：单群聊消息云存储是否开通
                    console.log(error);
                }
            });
        },
        //获取  所有聊天列表
        getChatList:function(){
            RongIMClient.getInstance().getConversationList({
                onSuccess: (list)=> {
                    // console.log(list);
                    // list => 会话列表集合
                    list.forEach((item,index)=>{
                        // console.log(item);
                        if(item.latestMessage.messageType=='ImageMessage'){
                            chatContent='图片消息';
                        }
                        if(item.latestMessage.messageType=='TextMessage'){
                            chatContent=decodeURIComponent(item.latestMessage.content.content);
                        }
                        if(item.latestMessage.senderUserId==RongCloud.user.id){
                            item.latestMessage.content.user.portrait=RongCloud.targetUser.portrait
                            item.latestMessage.content.user.name = RongCloud.targetUser.name 
                        }
                        var dp=this.data.unreadCount == 0 ? 'none' : 'inline';
                        var div='<div class="listItem" onclick=" window.location.replace(`chatRoom.html`);">'+
                                    '<div class="portrait">'+
                                        '<img src="'+item.latestMessage.content.user.portrait+'">'+
                                        '<span class="unreadCount" style="display:'+dp+'">'+this.data.unreadCount+'</span>'+
                                    '</div>'+
                                    '<div class="content">'+
                                        '<p class="name nw1">'+item.latestMessage.content.user.name+'</p>'+
                                        '<p class="msg nw1">'+chatContent+'</p>'+
                                    '</div>'+
                                    '<div class="receiveTime">'+RongCloud.timestampToTime(item.latestMessage.sentTime)+'</div>'+
                                '</div>'
                        $('.chatList').html(div);
                    })
                },
                onError: function(error) {
                    // do something
                }
            }, null);
        },
        //消息撤回
        recallMsg:function(){
            // recallMessage 为需要撤回的消息对象
            RongIMClient.getInstance().sendRecallMessage(recallMessage, {
                onSuccess: function (message) {
                    console.log('撤回成功', message, start);
                },
                onError: function (errorCode,message) {
                    console.log('撤回失败', message, start);
                }
            });
        },
        //获取指定未读消息数量
        getUnreadMsg:function(){
            var conversationType = RongIMLib.ConversationType.PRIVATE;
            var targetId = this.targetUser.targetId;
            RongIMLib.RongIMClient.getInstance().getUnreadCount(conversationType, targetId, {
                onSuccess: function(count){
                    RongCloud.data.unreadCount=count;
                    // console.log('未读消息数量：'+count)
                },
                onError: function(){
                    // error => 获取指定会话未读数错误码
                }
            });
        },
        //清除未读消息
        clearUnreadMsg:function(){
            var conversationType = RongIMLib.ConversationType.PRIVATE;
            var targetId = this.targetUser.targetId;
            RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
                onSuccess: function(){
                    console.log('清除未读消息成功');
                },
                onError: function(error){
                }
            });
        },
        //时间戳转日期
        timestampToTime:function(timestamp) {
            var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = date.getDate() + ' ';
            var h = date.getHours() + ':';
            var m = date.getMinutes();  
            if(m/10 >=1){
                var m=m;
            }
            else{
                var m='0' + m;
            }
            var s = date.getSeconds();
            return h+m;
        },
        //时间戳转日期
        timestampToFullTime:function(timestamp) {
            var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '  ';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = date.getDate() + '  ';
            var h = date.getHours() + ':';
            var m = date.getMinutes();
            if(m/10 >=1){
                var m=m;
            }
            else{
                var m='0' + m;
            }
            var s = date.getSeconds();
            return Y+M+D+h+m;
        },
        //获取图片大小尺寸
        imgSize:function(url,callback){
            var img = new Image();
            img.src = url;
            if (img.complete) {
                callback(img.width, img.height);
            } else {
                img.onload = function () {
                callback(img.width, img.height);
                img.onload = null;
                };
            };
        },
        //图片预览 photoswipe 插件
        preview:function(sentTime){

            var pswpElement = document.querySelectorAll('.pswp')[0];
            var items = JSON.parse(localStorage.getItem('imgs'));
            var imgIndex=0;
            items.reverse().some((item,index)=>{
                if(item.sentTime==sentTime){
                    imgIndex = index;
                }
                return;
            })
            var options = {
                index: imgIndex ,// start at first slide
                shareEl:false,
                counterEl: true,
                fullscreenEl: false,
                arrowEl: true,  //左右滑动指示
            };
            var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        }
    }

















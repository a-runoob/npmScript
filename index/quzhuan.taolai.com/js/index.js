$(function(){var w_height;var count=0;$(document.body).css({"overflow-y":"hidden"});$("html,body").animate({scrollTop:"0px"});$(".top").hide();$(".top").animate({"opacity":0});$(".section_two h2").animate({"opacity":0});$(".two_left").animate({"opacity":0});$(".two_right").animate({"opacity":0});$(".make_money_btn").animate({"opacity":0});var taolai={"windh":function(){w_height=window.innerHeight;var window_height=window.innerHeight;$("header").height(window_height+"px");$(".nva").css({"height":window_height-70+"px"});$("article section").css({"height":window_height+"px"});$("footer").css({"height":window_height+"px"})},"animate":function(dom,cls){$(""+dom+"").addClass("animated "+cls+"")},"animate_two":function(dom,cls,time){$(""+dom+"").hide();setTimeout(function(){$(""+dom+"").show();$(""+dom+"").addClass("animated "+cls+"")},time)},"animate_three":function(dom,time1,time2){$(""+dom+"").hide();$(""+dom+"").animate({"opacity":"0"});setTimeout(function(){$(""+dom+"").show();$(""+dom+"").animate({"opacity":"1"},time1)},time1)},"jump":function(dom,ct){$(""+dom+"").click(function(){count=ct;$("html,body").stop().animate({scrollTop:w_height*count+"px"},800);taolai.jump_top()})},"jump_top":function(){if(count==3){$(".top").show();$(".top").animate({"opacity":1},600)}else{$(".top").animate({"opacity":0},600,function(){$(".top").hide()})}},"up":function(now_scroll){--count;console.log("向上滚动");console.log(count);if(count<=0){count=0}$("html,body").stop().animate({scrollTop:now_scroll*count+"px"},800,function(){flag=true})},"down":function(now_scroll){++count;console.log("向下滚动");console.log(count);if(count>=3){count=3}$("html,body").stop().animate({scrollTop:now_scroll*count+"px"},800,function(){flag=true;if(count==2){$(".section_two h2").animate({"opacity":1},1000);$(".two_left").animate({"opacity":1},500);$(".two_right").animate({"opacity":1},500);$(".make_money_btn").animate({"opacity":1},1000);taolai.animate(".section_two h2","fadeInDown");taolai.animate(".two_left","fadeInLeft");taolai.animate(".two_right","fadeInRight");taolai.animate(".make_money_btn","flip")}})}};taolai.windh();taolai.animate(".animete_one","slideInDown");taolai.animate(".animete_two","zoomIn");taolai.animate_two(".animete_three","lightSpeedIn",500);taolai.animate_two(".animete_four","rollIn",800);taolai.animate_three(".animete_fives",1400,1200);taolai.jump(".animete_fives",3);taolai.jump(".contact",3);taolai.jump(".top",0);$(window).resize(function(){taolai.windh()});var flag=true;$("body").bind("mousewheel",function(event,delta){var dir=delta>0?"Up":"Down";var now_scroll=w_height;if(dir=="Up"){if(flag){taolai.up(now_scroll);flag=false}}else{if(flag){taolai.down(now_scroll);flag=false}}taolai.jump_top();return false});$(document).keydown(function(event){switch(event.keyCode){case 38:taolai.up(w_height);break;case 40:taolai.down(w_height);break;default:break}})});
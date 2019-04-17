(function() {
	var d = document;
	var includeCss = function(url) {
		var link = d.createElement("link");
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = url;
		d.getElementsByTagName("head")[0].appendChild(link)
	};
	includeCss("css/Mdate.css");
	var dateopts = {
		beginYear: 2000,
		beginMonth: 1,
		beginDay: 1,
		endYear: new Date().getFullYear(),
		endMonth: new Date().getMonth() + 1,
		endDay: new Date().getDate(),
		format: "YMD"
	};
	var MdSelectId = "";
	var MdAcceptId = "";
	var dateContentBox = "";
	var datePlugs = "";
	var yearTag = "";
	var monthTag = "";
	var dayTag = "";
	var indexY = 1;
	var indexM = 1;
	var indexD = 1;
	var initM = null;
	var initD = null;
	var yearScroll = null;
	var monthScroll = null;
	var dayScroll = null;
	var Mdate = function(el, opts) {
		if(!opts) {
			opts = {}
		}
		this.id = el;
		this.selectorId = d.getElementById(this.id);
		this.acceptId = d.getElementById(opts.acceptId) || d.getElementById(this.id);
		this.beginYear = opts.beginYear || dateopts.beginYear;
		this.beginMonth = opts.beginMonth || dateopts.beginMonth;
		this.beginDay = opts.beginDay || dateopts.beginDay;
		this.endYear = opts.endYear || dateopts.endYear;
		this.endMonth = opts.endMonth || dateopts.endMonth;
		this.endDay = opts.endDay || dateopts.endDay;
		this.format = opts.format || dateopts.format;
		this.dateBoxShow()
	};
	Mdate.prototype = {
		constructor: Mdate,
		dateBoxShow: function() {
			var that = this;
			that.selectorId.onclick = function() {
				that.createDateBox();
				that.dateSure()
			}
		},
		createDateBox: function() {
			var that = this;
			MdatePlugin = d.getElementById("MdatePlugin");
			if(!MdatePlugin) {
				dateContentBox = d.createElement("div");
				dateContentBox.id = "MdatePlugin";
				d.body.appendChild(dateContentBox);
				MdatePlugin = d.getElementById("MdatePlugin")
			}
			MdatePlugin.setAttribute("class", "slideIn");
			that.createDateUi();
			var yearUl = d.getElementById("yearUl");
			var monthUl = d.getElementById("monthUl");
			var dayUl = d.getElementById("dayUl");
			yearUl.innerHTML = that.createDateYMD("year");
			that.initScroll();
			that.refreshScroll()
		},
		createDateUi: function() {
			var str = "" + '<section class="getDateBg"></section>' + '<section class="getDateBox" id="getDateBox">' + '<div class="choiceDateTitle">' + '<button id="dateCancel">取消</button>' + '<button id="dateSure" class="fr">确定</button>' + "</div>" + '<div class="dateContent">' + '<div class="checkeDate"></div>' + '<div id="yearwrapper">' + '<ul id="yearUl"></ul>' + "</div>" + '<div id="monthwrapper">' + '<ul id="monthUl"></ul>' + "</div>" + '<div id="daywrapper">' + '<ul id="dayUl"></ul>' + "</div>" + "</div>" + "</section>";
			MdatePlugin.innerHTML = str
		},
		createDateYMD: function(type) {
			var that = this;
			var str = "<li>&nbsp;</li>";
			var beginNum = null,
				endNum = null,
				unitName = "年",
				dataStyle = "data-year";
			if(type == "year") {
				beginNum = that.beginYear;
				endNum = that.endYear
			}
			if(type == "month") {
				unitName = "月";
				dataStyle = "data-month";
				beginNum = that.beginMonth;
				endNum = 12;
				if(yearTag != that.beginYear) {
					beginNum = 1
				}
				if(yearTag == dateopts.endYear) {
					endNum = that.endMonth
				}
			}
			if(type == "day") {
				unitName = "日";
				dataStyle = "data-day";
				beginNum = 1;
				endNum = new Date(yearTag, monthTag, 0).getDate();
				if(yearTag == that.beginYear && monthTag == that.beginMonth) {
					beginNum = that.beginDay
				}
				if(yearTag == that.endYear && monthTag == that.endMonth) {
					endNum = that.endDay
				}
			}
			for(var i = endNum; i >= beginNum; i--) {
				str += "<li " + dataStyle + "=" + i + ">" + that.dateForTen(i) + unitName + "</li>"
			}
			return str + "<li>&nbsp;</li>"
		},
		initScroll: function() {
			var that = this;
			yearScroll = new iScroll("yearwrapper", {
				snap: "li",
				vScrollbar: false,
				onScrollEnd: function() {
					indexY = Math.ceil(this.y / 40 * -1 + 1);
					yearTag = yearUl.getElementsByTagName("li")[indexY].getAttribute("data-year");
					monthUl.innerHTML = that.createDateYMD("month");
					monthScroll.refresh();
					try {
						monthTag = monthUl.getElementsByTagName("li")[indexM].getAttribute("data-month")
					} catch(err) {
						return true
					}
					dayUl.innerHTML = that.createDateYMD("day");
					dayScroll.refresh();
					try {
						dayTag = dayUl.getElementsByTagName("li")[indexD].getAttribute("data-day")
					} catch(err) {
						return true
					}
				}
			});
			monthScroll = new iScroll("monthwrapper", {
				snap: "li",
				vScrollbar: false,
				onScrollEnd: function() {
					indexM = Math.ceil(this.y / 40 * -1 + 1);
					if(indexM == 1 && yearTag != that.beginYear) {
						monthTag = 1
					} else {
						monthTag = monthUl.getElementsByTagName("li")[indexM].getAttribute("data-month")
					}
					dayUl.innerHTML = that.createDateYMD("day");
					dayScroll.refresh();
					try {
						dayTag = dayUl.getElementsByTagName("li")[indexD].getAttribute("data-day")
					} catch(err) {
						return true
					}
				}
			});
			dayScroll = new iScroll("daywrapper", {
				snap: "li",
				vScrollbar: false,
				onScrollEnd: function() {
					indexD = Math.ceil(this.y / 40 * -1 + 1);
					if(indexD == 1 && monthTag != that.beginMonth) {
						dayTag = 1
					} else {
						dayTag = dayUl.getElementsByTagName("li")[indexD].getAttribute("data-day")
					}
				}
			})
		},
		refreshScroll: function() {
			var that = this;
			var inputYear = that.acceptId.getAttribute("data-year");
			var inputMonth = that.acceptId.getAttribute("data-month");
			var inputDay = that.acceptId.getAttribute("data-day");
			inputYear = inputYear || that.beginYear;
			inputMonth = inputMonth || that.beginMonth;
			inputDay = inputDay || that.beginDay;
			initM = that.beginMonth;
			initD = that.beginDay;
			if(inputYear != that.beginYear && initM != 1) {
				initM = 1
			}
			if(inputMonth != that.beginMonth && initD != 1) {
				initD = 1
			}
			inputYear -= that.beginYear;
			inputMonth -= initM;
			inputDay -= initD;
			yearScroll.refresh();
			yearScroll.scrollTo(0, inputYear * 40, 300, true);
			monthScroll.scrollTo(0, inputMonth * 40, 300, true);
			dayScroll.scrollTo(0, inputDay * 40, 300, true)
		},
		dateSure: function() {
			var that = this;
			var sureBtn = d.getElementById("dateSure");
			var cancelBtn = d.getElementById("dateCancel");
			sureBtn.onclick = function() {
				if(that.format == "YMD") {
					that.acceptId.value = yearTag + "年" + monthTag + "月" + dayTag + "日"
				} else {
					that.acceptId.value = yearTag + that.format + that.dateForTen(monthTag) + that.format + that.dateForTen(dayTag)
				}
				that.acceptId.setAttribute("data-year", yearTag);
				that.acceptId.setAttribute("data-month", monthTag);
				that.acceptId.setAttribute("data-day", dayTag);
				that.dateCancel();
				//
//				console.log(that.acceptId.value);
				Mdate.prototype.selectConstellation(that.acceptId.value)
			};
			cancelBtn.onclick = function() {
				that.dateCancel()
			}
		},
		dateForTen: function(n) {
			if(n < 10) {
				return "0" + n
			} else {
				return n
			}
		},
		dateCancel: function() {
			MdatePlugin.setAttribute("class", "slideOut");
			setTimeout(function() {
				MdatePlugin.innerHTML = ""
			}, 400)
		},
		selectConstellation: function(v){
			console.log(v);
			var month = v.substring(5,7) - 0;
			var date = v.substring(8,10) - 0;
			if (month == 1 && date >=20 || month == 2 && date <=18) {value = "水瓶座";} 
			if (month == 1 && date > 31) {value = "Huh?";} 
			if (month == 2 && date >=19 || month == 3 && date <=20) {value = "双鱼座";} 
			if (month == 2 && date > 29) {value = "Say what?";} 
			if (month == 3 && date >=21 || month == 4 && date <=19) {value = "白羊座";} 
			if (month == 3 && date > 31) {value = "OK. Whatever.";} 
			if (month == 4 && date >=20 || month == 5 && date <=20) {value = "金牛座";} 
			if (month == 4 && date > 30) {value = "I'm soooo sorry!";} 
			if (month == 5 && date >=21 || month == 6 && date <=21) {value = "双子座";} 
			if (month == 5 && date > 31) {value = "Umm ... no.";} 
			if (month == 6 && date >=22 || month == 7 && date <=22) {value = "巨蟹座";} 
			if (month == 6 && date > 30) {value = "Sorry.";} 
			if (month == 7 && date >=23 || month == 8 && date <=22) {value = "狮子座";} 
			if (month == 7 && date > 31) {value = "Excuse me?";} 
			if (month == 8 && date >=23 || month == 9 && date <=22) {value = "室女座";} 
			if (month == 8 && date > 31) {value = "Yeah. Right.";} 
			if (month == 9 && date >=23 || month == 10 && date <=22) {value = "天秤座";} 
			if (month == 9 && date > 30) {value = "Try Again.";} 
			if (month == 10 && date >=23 || month == 11 && date <=21) {value = "天蝎座";} 
			if (month == 10 && date > 31) {value = "Forget it!";} 
			if (month == 11 && date >=22 || month == 12 && date <=21) {value = "人马座";} 
			if (month == 11 && date > 30) {value = "Invalid Date";} 
			if (month == 12 && date >=22 || month == 1 && date <=19) {value = "摩羯座";} 
			if (month == 12 && date > 31) {value = "No way!";}
			console.log(`你的星座是:${value}`);
			$("#constellation").html(value);
		}
	};
	if(typeof exports !== "undefined") {
		exports.Mdate = Mdate
	} else {
		window.Mdate = Mdate
	}
})();
(function (root, factory) {
    (typeof define === 'function' && define.amd) ? define([], factory(root))
    :(typeof exports === 'object') ? odule.exports = factory(root)
    :root.chsCalendar = factory(root)
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
	'use strict';
/*
    -순서
    1.윤년계산
    2.옵션값 대치
    3.옵션값 갱신
    4.실행
    5.기본값
    6.세팅
    7.달력을 감싸는 엘리먼트
    8.초기화면 그리기
    9.유틸메뉴
    10.월
    11.주
    12.일
    13.월,주,일 선택
    14.이전,다음 선택
    15.오늘 선택
    
    마지막 수정 : 18.9.16
*/
    /*윤년계산*/
    function leapYear(date){                
        var y = date.getFullYear(),
            m = date.getMonth()+1;
            return m == 4 || m == 6 || m == 9 ? 30
            : m == 2 ? (y % 4 == 0 && y % 100 != 0 ) || y % 400 == 0 ? 29 
            : 28 
            : 31
        };
    /*옵션값 대치*/
    var forEach = function (collection, callback, scope) {
		if (Object.prototype.toString.call(collection) === '[object Object]') {
			for (var prop in collection) {
				if (Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};
    /*옵션값 갱신*/
    function extend( defaults, options ) {
        var extended = {};
        forEach(defaults, function (value, prop) {
            extended[prop] = defaults[prop];
        });
        forEach(options, function (value, prop) {
            extended[prop] = options[prop];
        });
        return extended;
    };
    /*실행*/
    function chsCalendar(options){
        this.options = this.init(options);
        this.set();
    };
    /*기본값*/
    chsCalendar.prototype.init=function(options){
        var defaults = {
            el:null,                                    //달력을 그릴 엘리먼트선택
            setDate:new Date(),                         //시작날짜 선택
            select:['월간','주간','일간'],                 //월,주,일 버튼 텍스트 바꾸기
            week:['일','월','화','수','목','금','토'],      //일 텍스트 바꾸기
            toDay:'오늘',                                //오늘 버튼텍스트 바꾸기
            moveText:['이전','다음'],                     //이전,다음 버튼텍스트 바꾸기
            selectView:0                                //처음 보여줄 화면 정하기 (0:월,1:주,2:일)
        };
        defaults = extend( defaults, options || {} );
        return defaults;
    };
    /*세팅*/
    chsCalendar.prototype.set=function(){
        this.date = new Date(this.options.setDate);
        this.today = new Date(this.options.setDate);
        this.newEl = document.getElementById(this.options.el);
        this.renderWrap();
        this.render(this.options.selectView);
        this.selectCalendarView();
        this.selectMove();
        this.selectToday();
    }
    /*달력을 감싸는 엘리먼트*/
    chsCalendar.prototype.renderWrap=function(){
        var el = document.createElement('div');
        el.classList.add('calendarWrap')
        this.newEl.appendChild(el);
    };
    /*화면 그리기*/
    chsCalendar.prototype.render=function(selectView){
        this.newEl.childNodes[0].innerHTML = '';
        var idx = selectView;
        idx == 0 ? (
            this.calendarMonth()
        ): idx == 1 ?(
            this.calendarWeek()
        ): this.calendarDay();
    };
    /*유틸메뉴*/
    chsCalendar.prototype.calendarUtill=function(){
         var y = this.date.getFullYear(),
             m = this.date.getMonth()+1,
             utillbox='';
        utillbox+= '<section class="calendarHaed">'; 
        utillbox+='<h2>'+y+'.'+m+'</h2>'
        utillbox+='<div class="btnGroup_select"><button>'+this.options.select[0]+'</button><button>'+this.options.select[1]+'</button><button>'+this.options.select[2]+'</button></div>'
        utillbox+='<div class="btnGroup_move"><button class="bg_prev">'+this.options.moveText[0]+'</button><button class="bg_next">'+this.options.moveText[1]+'<buttonn></div>'
        utillbox+='<div class="btnGroup_toDay"><button>'+this.options.toDay+'</button></div>'
        utillbox+='</section>'
        return utillbox;
    };
    /*월*/
    chsCalendar.prototype.calendarMonth=function(){
        var tDate = this.today,
            sDate = new Date(this.date),
            y = sDate.getFullYear(),
            m = sDate.getMonth()+1,
            d = sDate.getDate(),
            setDate = sDate.setDate(1),
            table = '<table class="chsCalendar cMonth">';
            var thead = '<thead><tr>',
                week = this.options.week;
            for(var i=0;i<week.length;i++){
                thead += '<th>'+week[i]+'</th>'
            };
            thead += '</tr></thead>';
            var toTaldate = leapYear(sDate),
                tag = '<body>',
                numD = 1,
                stratDay = sDate.getDay();

            /*이전달 일수*/
            var prevD = new Date(sDate),
                prevDs = prevD.setMonth(prevD.getMonth()-1),
                prevDm = prevD.getMonth()+1,
                prevDy = prevD.getFullYear(),
                prevDdate = leapYear(prevD),
                prevS = prevDdate-stratDay;

            /*다음달 일수*/
            var nextD = new Date(sDate),
                nextDs = nextD.setMonth(nextD.getMonth()+1),
                nextDm = nextD.getMonth()+1,
                nextDy = nextD.getFullYear(),
                nextS = 1;

            for(var i=0;i<6;i++){
                tag+='<tr>';
                for(var k = 0;k<7;k++){
                    i == 0 && k<stratDay || numD > toTaldate ? (
                        i==0 ?
                        tag+='<td><a href="#" data-date="'+prevDy+'.'+prevDm+'.'+prevS+'" class="d_date">'+(prevS++)+'</a></td>'
                        : tag+='<td><a href="#"data-date="'+nextDy+'.'+nextDm+'.'+nextS+'" class="d_date">'+(nextS++)+'</a></td>'
                    ):(
                        numD == tDate.getDate() && m == tDate.getMonth()+1 && y == tDate.getFullYear() ?
                        tag+='<td class="toDay"><a href="#" data-date="'+y+'.'+m+'.'+numD+'">'+numD+'</a></td>'
                        : tag+='<td><a href="#" data-date="'+y+'.'+m+'.'+numD+'">'+numD+'</a></td>',
                        numD++
                    );
                };
                tag+='</tr>';
            };
            table+=thead
            table+=tag+'</tbody>'
            table+='</table>';
            this.newEl.childNodes[0].innerHTML = this.calendarUtill()+table;
    };
    /*주*/
    chsCalendar.prototype.calendarWeek=function(){
        var tDate = this.today,
            sDate = new Date(this.date),
            day = sDate.getDay(),
            table = '<table class="chsCalendar cWeek">',
            thaed = '<thead><tr>',
            tbody = '<tbody>';

            day > 0 && day < 7 ? sDate.setDate(sDate.getDate()-day)
            : sDate.setDate(sDate.getDate())
            
            for(var i=0;i<7;i++){
                if (i==0) {thaed+='<th></th>'}
                sDate.setDate(sDate.getDate()+i);
                var y = sDate.getFullYear(),
                    m = sDate.getMonth()+1,
                    d = sDate.getDate();
                y == tDate.getFullYear() && m == (tDate.getMonth()+1) && d == tDate.getDate() ?
                    thaed+='<th class="toDay"><a href="#" data-date="'+y+'.'+m+'.'+d+'">'+this.options.week[i]+' '+m+'.'+d+'</a></th>'
                : thaed+='<th><a href="#" data-date="'+y+'.'+m+'.'+d+'">'+this.options.week[i]+' '+m+'.'+d+'</a></th>';
                sDate.setDate(sDate.getDate()-i);
            };
            var c = 12;
            for(var i=0;i<24;i++){
                tbody+='<tr>';
                for(var k=0;k<8;k++){
                    if(k == 0){
                        c==12 && i==0 ? tbody+='<td>오전'+c+'시</td>'
                        : c > 12 ? (c=1,tbody+='<td>'+c+'시</td>')
                        : c == 12 && i == 12 ? tbody+='<td>오후'+c+'시</td>'
                        : tbody+='<td>'+c+'시</td>';
                        c+=1
                    }else{
                        sDate.setDate(sDate.getDate()+(k-1));
                        var y = sDate.getFullYear(),
                            m = sDate.getMonth()+1,
                            d = sDate.getDate();
                        y == tDate.getFullYear() && m == (tDate.getMonth()+1) && d == tDate.getDate() ?
                            tbody+='<td class="toDay"></td>'
                        : tbody+='<td></td>';
                        sDate.setDate(sDate.getDate()-(k-1));
                    }
                }
                tbody+='</tr>';
            }
            thaed+='</tr></thead>';
            table+=thaed;
            table+=tbody;
            this.newEl.childNodes[0].innerHTML = this.calendarUtill()+table;
    };
    /*일*/
    chsCalendar.prototype.calendarDay=function(){
        var tDate = this.today,
            sDate = new Date(this.date),
            y = sDate.getFullYear(),
            m = sDate.getMonth()+1,
            d = sDate.getDate(),
            day = sDate.getDay(),
            table = '<table class="chsCalendar cDay">',
            thaed = '<thead><tr>',
            tbody = '<tbody>';
        var c = 12;
        console.log(tDate+'.'+sDate);
        (!(tDate > sDate || tDate < sDate)) ?
        thaed+='<th></th><th class="toDay"><a href="#" data-date="'+y+'.'+m+'.'+d+'">'+this.options.week[day]+' '+d+'</a></th>'
        : thaed+='<th></th><th><a href="#" data-date="'+y+'.'+m+'.'+d+'">'+this.options.week[day]+' '+d+'</a></th>';
        for(var i = 0;i<24;i++){
            tbody+='<tr>';
            for(var k=0;k<2;k++){
                if(k == 0){
                    c==12 && i==0 ? tbody+='<td>오전'+c+'시</td>'
                    : c > 12 ? (c=1,tbody+='<td>'+c+'시</td>')
                    : c == 12 && i == 12 ? tbody+='<td>오후'+c+'시</td>'
                    : tbody+='<td>'+c+'시</td>';
                    c+=1
                }else{
                    (!(tDate > sDate || tDate < sDate)) ?
                    tbody+='<td class="toDay"></td>'
                    : tbody+='<td></td>';
                }
            }
            tbody+='</tr>';
        };
        thaed+='</tr></thead>';
        table+=thaed;
        table+=tbody;
        this.newEl.childNodes[0].innerHTML = this.calendarUtill()+table;
    };
    chsCalendar.prototype.btnEvent=function(){
        this.selectCalendarView();
        this.selectMove();
        this.selectToday();
    };
    /*월,주,일 선택*/
    chsCalendar.prototype.selectCalendarView=function(){  
        var _this = this,
            btn = this.newEl.querySelectorAll('.btnGroup_select button'),
            len = btn.length;
        function listener(index){
            return function(e){
                e.preventDefault();
                index == 0 ? _this.options.selectView = 0
                : index == 1 ? _this.options.selectView = 1
                : _this.options.selectView = 2;
                _this.render(_this.options.selectView);
                _this.btnEvent();
            };
        };
        for(var i=0;i<len;i++){
            btn[i].addEventListener('click',listener(i));
        };
    };
    /*이전,다음 선택*/
    chsCalendar.prototype.selectMove=function(){ 
         var _this = this,
            btn = this.newEl.querySelectorAll('.btnGroup_move button'),
            len = btn.length;
            function listener(index){
                return function(e){
                    e.preventDefault();
                    var idx = _this.options.selectView;
                    if(idx == 0){
                            index == 0 ? _this.date.setMonth(_this.date.getMonth()-1)
                            : _this.date.setMonth(_this.date.getMonth()+1);
                            _this.date.setDate(1);
                       }else if(idx == 1){
                           index == 0 ? _this.date.setDate(_this.date.getDate()-7)
                            : _this.date.setDate(_this.date.getDate()+7);
                            _this.date.setDate(_this.date.getDate());
                       }else{
                            index == 0 ? _this.date.setDate(_this.date.getDate()-1)
                            : _this.date.setDate(_this.date.getDate()+1);
                       };
                    _this.render(idx);
                    _this.btnEvent();
                };
            };
        for(var i=0;i<len;i++){
            btn[i].addEventListener('click',listener(i));
        };
    };
    /*오늘 버튼*/
    chsCalendar.prototype.selectToday=function(){
        var _this = this,
            btn = this.newEl.querySelector('.btnGroup_toDay button');
        btn.addEventListener('click',function(e){
            e.preventDefault();
            var idx = _this.options.selectView,
                initDate = new Date(_this.today);
                _this.date = initDate
            idx == 0 ? (
                _this.calendarMonth()
            ): idx == 1 ? (
                _this.calendarWeek()
            ): _this.calendarDay();
            _this.btnEvent();
        });
    };    
    
    
    
    
    
    var a = new chsCalendar({
        el:'calendar1'
    });
//    var b = new chsCalendar({
//        el:'calendar2',
//        setDate:'2017/2/22',
//        toDay:'Today',
//        week:['sun','mon','tue','wed','thu','fir','sat'],
//        moveText:['prev','next'],
//        selectView:1,
//        select:['month','week','day']
//    });
//    var c = new chsCalendar({
//        el:'calendar3',
//        select:['월','주','일'],
//        moveText:['<','>'],
//        setDate:'2015/1/2',
//        selectView:2
//    });
    
    
});
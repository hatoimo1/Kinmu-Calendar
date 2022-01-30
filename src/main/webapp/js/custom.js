var yyyymm;		// 表示年月
var timeTbl;	// タイムテーブル

/** 初期設定 */
function init() {

	// タイムテーブル設定(2018/11/01基準)
	timeTbl = [
		['休','②','②','②','②','休','①','①','①','①','休','③','③','③','③','休'],	// シフトA
		['③','③','③','休','休','②','②','②','②','休','①','①','①','①','休','③'],	// シフトB
		['①','①','休','③','③','③','③','休','休','②','②','②','②','休','①','①'],	// シフトC
		['②','休','①','①','①','①','休','③','③','③','③','休','休','②','②','②']	// シフトD
	]

    // クッキー設定
    var cookie = (document.cookie.split('='))[1];
    if (cookie == undefined) {
        document.cookie = 'data=0'
    } else {
        document.cookie = 'data=' + cookie;
        $('input[value="' + cookie + '"]').prop('checked', true);
    }

    // 表示年月（初期値）
    yyyymm = moment($('#calendar').fullCalendar('getDate')).format('YYYY-MM');

    // 今月ボタン押下時
    $('.fc-today-button').on('click', function(){
        $('#calendar').fullCalendar('removeEvents');
        yyyymm = moment($('#calendar').fullCalendar('getDate')).format('YYYY-MM');
        showShift();
    });

    // 前月ボタン押下時
    $('.fc-prev-button').on('click', function(){
        var result = yyyymm.split('-');
        var yyyy = parseInt(result[0]);
        var mm = parseInt(result[1]);

        if (mm - 1 == 0) {
        	mm = 12;
        	yyyy = yyyy - 1;
        } else {
        	mm = mm - 1;
        }

        if (mm < 10) {
        	mm = '0' + mm;
        }

        $('#calendar').fullCalendar('removeEvents');
        yyyymm = yyyy + '-' + mm;
        showShift();
    });

    // 次月ボタン押下時
    $('.fc-next-button').on('click', function(){
        var result = yyyymm.split('-');
        var yyyy = parseInt(result[0]);
        var mm = parseInt(result[1]);

        if (mm + 1 == 13) {
        	mm = 1;
        	yyyy = yyyy + 1;
        } else {
        	mm = mm + 1;
        }

        if (mm < 10) {
        	mm = '0' + mm;
        }

        $('#calendar').fullCalendar('removeEvents');
        yyyymm = yyyy + '-' + mm;
        showShift();
    });

    // シフトAラジオボタン押下
    $("#rdA").click( function() {
        $('#calendar').fullCalendar('removeEvents');
        document.cookie = 'data=0';
        showShift();
    });

    // シフトBラジオボタン押下
    $("#rdB").click( function() {
        $('#calendar').fullCalendar('removeEvents');
        document.cookie = 'data=1';
        showShift();
    });

    // シフトCラジオボタン押下
    $("#rdC").click( function() {
        $('#calendar').fullCalendar('removeEvents');
        document.cookie = 'data=2';
        showShift();
    });

    // シフトDラジオボタン押下
    $("#rdD").click( function() {
        $('#calendar').fullCalendar('removeEvents');
        document.cookie = 'data=3';
        showShift();
    });

    showShift();
}

/** シフト時間を追加 */
function addShift(title, date) {

    if (title == '休') {
        $('#calendar').fullCalendar('addEventSource', [{
            title: title,
            color: 'red',
            start: date
        }]);
    } else {
        $('#calendar').fullCalendar('addEventSource', [{
            title: title,
            start: date
        }]);
    }
}

/** シフト時間を表示 */
function showShift() {

	// 表示月の初日
    var result = yyyymm.split('-');
    var yyyy = parseInt(result[0]);
    var mm = parseInt(result[1]);
    var baseDate = new Date(yyyy, mm - 1, 1);

    // 基準日からの差分日数
    var date1 = toDate(yyyymm + "-01");
    var date2 = toDate("2018-11-01");
    var diffDay = parseInt(getDiffDays(date1, date2));

    // 月末日
    var lastDay = parseInt((new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0)).getDate());

    // 1か月のシフトを追加
    var shiftVal;
    var radioVal = parseInt($("input[name='selectShift']:checked").val());
    for (var d = 1; d <= lastDay; d++) {
        var date = yyyymm + "-" + ("00" + d).slice(-2);
        if (diffDay >= 0) {
            // 基準日以降の場合
            shiftVal = (diffDay + (d - 1)) % 16;
        } else {
            // 基準日以前の場合
            shiftVal = (((diffDay % 16) + 16) + (d - 1)) % 16;
        }
        var title = timeTbl[radioVal][shiftVal];
        addShift(title, date);
    }
}

/** str:変換する文字列(yyyy-mm-dd) */
function toDate (str) {
    return new Date(str.split('-')[0], str.split('-')[1] - 1, str.split('-')[2]);
}

/** 日付の差分を取得 */
/** date1:比較する日付１ date2:比較する日付２ */
function getDiffDays (date1, date2) {
    var timeDiff = date1.getTime() - date2.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

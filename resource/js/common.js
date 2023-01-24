(function($, window) {

    var body = $('body');
    
    // 사이드바 접기
    var sidebarToggle = {
        selector : {
            button: body.find('.nav-toggler')
        },

        init: function() {
            $( this.selector.button ).off('click').on('click', function(e) {
                if ( body.hasClass('sideMenuOn') ) {
                    body.addClass('sideMenuOff');
                    body.removeClass('sideMenuOn');
                } else {
                    body.addClass('sideMenuOn');
                    body.removeClass('sideMenuOff');
                }
            });
        }
    }

    // 검색 입력필드 확장
    var serchToggle = {
        selector : {
            input: body.find('.filter-input input')
        },

        init : function() {
            $( this.selector.input ).focus(function(){
                $('.filter-input').toggleClass('focus',true);
            });
            $( this.selector.input ).blur(function(){
                $('.filter-input').toggleClass('focus',false);
            });

        }
    }

    // 테이블 추가 ui
    var addColumnShow = {
        selector : {
            showButton: body.find('#addColumnBtn'),
            hideButton: body.find('#addColumnCloseBtn')
        },

        init : function() {
            $( this.selector.showButton ).off('click').on('click', function(e) {
                $('.add-column').show();
            });
            $( this.selector.hideButton ).off('click').on('click', function(e) {
                $('.add-column').hide();
            });
        }
    }
    
    // datepicker
    var datepicker = {
        selector : {
            conatiner: body.find('.datepicker'),
        },

        init : function() {
            $( this.selector.conatiner ).datepicker({
                dateFormat: 'yy/mm/dd',
                prevText: '이전 달',
                nextText: '다음 달',
                monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                dayNames: ['일', '월', '화', '수', '목', '금', '토'],
                dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
                dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
                // yearSuffix: '년',
                firstDay: 1,
                showButtonPanel: true,
                currentText: '오늘',
                changeYear : true,
                yearRange: 'c-6:c+5'
            });
        }
    }

    // 툴팁
    var tooltip = {
        selector : {
            conatiner: body.find($('[data-toggle="tooltip"]')),
        },

        init : function() {
            $( this.selector.conatiner ).tooltip();
        }
    }

    // sortable
    var sortable = {
        selector : {
            conatiner: body.find($('.sortabled')),
        },

        init : function() {
            $( this.selector.conatiner ).sortable();
        }
    }

    // slider
    var slider = {
        selector : {
            conatiner: body.find($('#storlekslider')),
        },

        init : function() {
            $( this.selector.conatiner ).slider({
                range: "max",
                min: 0,
                max: 100,
                step: 1,
                value: 75,
                slide: function( event, ui ) {
                //var value1 = $("#storlekslider").slider("value");  
                    $("#storlek_testet").val( ui.value + '%' );
                    $(ui.value).val($('#storlek_testet').val());
                    var value1 = $("#storlek_testet").val();
                    $("#storlekslider").find(".ui-slider-handle").text(value1 + '%');  
                }
            });
            
            $("#storlek_testet").keyup(function() {
                $("#storlekslider").slider("value" , $(this).val());
                var value1 = $("#storlek_testet").val();
                $("#storlekslider").find(".ui-slider-handle").text(value1 + '%');
            });

            $('.btn-range').click(function() {
                var direction = $(this).data("dir");
                var value =  $("#storlekslider").slider("value");
                if (direction == "plus") {
                    $("#storlekslider").slider("value", value + 10);
                } else {
                    $("#storlekslider").slider("value", value - 10);
                }
                var currentVal = $("#storlekslider").slider("value");
                $("#storlek_testet").val(currentVal + '%');
                $("#storlekslider").find(".ui-slider-handle").text(currentVal + '%');
            });
    
        }
    }

    $('.dropdown.group .dropdown-menu').on('click', function(event){
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    
    // 테이블 헤더 스크롤 고정
    var tableHeaderFixed = {
        selector : {
        },

        init : function() {
            $('.content-wrap').scroll(function (){
                if ( $('.content-wrap').scrollTop() > 0 ) {
                    $('.table-header').toggleClass('fixed', true);
                } else {
                    $('.table-header').toggleClass('fixed', false);
                }
            });
        }
    }

    // 테이블 컬럼 이동
    var dragTable = {
        selector : {
            conatiner: body.find($('#tablesorter')),
        },

        init : function() {
            $( this.selector.conatiner ).dragtable();
        }
    }


    sidebarToggle.init();
    serchToggle.init();
    addColumnShow.init();
    datepicker.init();
    tooltip.init();
    sortable.init();
    slider.init();
    dragTable.init();


})(window.jQuery, window);


function openModal(type, data_list, callback){
	$.ajax({
		url: "/backpg/ajax/modals/get_modal.ds",
		data:{'type':type,'data_list':data_list},
		type: 'POST',
		dataType: 'html',
		async: false,
		cache: false,
		success: function onData (html) {
			var $obj = $(html);
			$obj.modal('show');
			callback($obj);
		},
		error: function onError (data) {

		}
	});
}

function closeModal($obj){
    $obj.modal('hide');
}

function getParam(sname) {

    var params = location.search.substr(location.search.indexOf("?") + 1);

    var sval = "";

    params = params.split("&");

    for (var i = 0; i < params.length; i++) {

        temp = params[i].split("=");

        if ([temp[0]] == sname) { sval = temp[1]; }

    }

    return sval;

}


$.fn.setCursorPosition = function( pos )
{
    this.each( function( index, elem ) {
        if( elem.setSelectionRange ) {
            elem.setSelectionRange(pos, pos);
        } else if( elem.createTextRange ) {
            var range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    });

    return this;
};
function alertFocus(msg,obj){
    obj.focus();
    alert(msg);
}

function checkEmail(str)
{
    var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if(!reg_email.test(str)){
        return false;
    }
    else{
        return true;
    }
}



(function($){
    $.extend($.fn, {
        check_email : function(){
            var o = $(this);
            o.css('ime-mode', 'disabled');
            o.off('keypress.check_email').on('keypress.check_email',function(event){
                var code = event.which?event.which:event.keyCode;
                if(!code)
                    event.preventDefault();
                if(code > 47 && code < 58) //숫자범위
                    return true;
                if(code > 64 && code < 91) //소문자범위
                    return true;
                if(code > 96 && code < 123) //대문자
                    return true;
                if(event.ctrlKey == true && (code == 118 || code == 86 || code == 99 || code == 67)) //컨트롤v대소문자c
                    return true;
                if(code == 45 || code == 189) //-
                    return true;
                if((event.shiftKey == true && code == 50) || code == 64) //@
                    return true;
                if((event.shiftKey == true && code == 189) || code == 95) //_
                    return true;
                if(code == 13 || code == 8 || code == 9 || code == 27 || code == 46 || code == 35 || code == 36) //enter, back, esc, tab , del,  홈, 엔드
                    return true;
                if(code == 37 || code == 39 || code == 38 || code == 40) //방향키
                    return true;

                event.preventDefault();
            });
            o.off('keyup.check_email').on('keyup.check_email',function(event){
                var str = $(this).val();
                str = str.replace(/[^0-9^a-z^A-Z^.^@^_^-]/gi, '');
                $(this).val(str);
            });
        }
    });
})(jQuery);
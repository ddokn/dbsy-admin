var LOGIN = function(){
    var $login_container;

    var init = function(){
        $login_container = $("#login_container");
        setLoginEvent();
    };


    function setLoginEvent(){
        loginStep1(function(email){

            if(email !== "" && checkEmail(email)){
                $login_container.find('._step2_email').html(email);
                $login_container.find('._step1').addClass('d-none');
                $login_container.find('._step2').removeClass('d-none');

                loginStep2(function(password){
                    if(password !== ""){
                        loginFinal(email, password, function(code,msg){
                            if(code === 200){
                                location.href = '/';
                            }else{
                                alert(msg);
                            }
                        });
                    }else{
                        alert("비밀번호를 입력해주세요");
                    }
                });
            }else{
                alert("이메일 형식을 확인해주세요");
            }
        });
    }

    function loginStep1(callback){
        var $email = $login_container.find("._email");
        $email.check_email();
        $email.focus();
        var $step1_next_btn = $login_container.find('._step1_next_btn');
        var $step1_history_btn = $login_container.find('._step1_history_btn');


        $step1_next_btn.on("click.login_btn",function(){
            var email = $email.val();
            callback(email);
        });

        $email.on("keyup.login_input",function(key){
            if(key.keyCode === 13){
                var email = $email.val();
                callback(email);
            }
        });

        $step1_history_btn.on("click.login_history_btn",function(){
            var email = $(this).data('id');
            callback(email);
        });


    }

    function loginStep2(callback){
        var $password = $login_container.find("._password");
        $password.focus();
        var $step2_next_btn = $login_container.find('._step2_next_btn');
        $step2_next_btn.on("click.login_btn",function(){
            var password = $password.val();
            callback(password);
        });

        $password.on("keyup.password_input",function(key){
            if(key.keyCode === 13){
                var password = $password.val();
                callback(password);
            }
        });

    }

    function loginFinal(email, password, callback){
        $.ajax({
            url: "/backpg/ajax/login/login.ds",
            data:{'email':email,'password':password},
            type: 'POST',
            dataType: 'json',
            async: false,
            cache: false,
            success: function onData (data) {
                callback(data.code,data.msg);
            },
            error: function onError (data) {
                callback(data.code,data.msg);
            }
        });
    }




    return {
        'init' : function(){
            init();
        }
    };
}();
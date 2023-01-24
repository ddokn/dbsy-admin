var VOTER_GROUP = function(){
	var $content_wrap;
    var $sub_menu_container;
	var current_f = 0;
	var current_g = 0;
    var init = function(){
		$content_wrap = $("#content_wrap");
		setSubMenuEvent();
		loadFolderListHtml();
		setGroupTitleEvent();
    };

	/***
	 * 그룹명 수정 이벤트 관련
	 */
	function setGroupTitleEvent(){
		var $group_title_off = $content_wrap.find("._group_title_off");
		var $group_title_on = $content_wrap.find("._group_title_on");


		$group_title_off.off("group_title_off").on('click.group_title_off',function(){
			$group_title_off.addClass('d-none');
			$group_title_on.removeClass('d-none');


			var $title_input = $group_title_on.find("._title_input");
			var $color_input = $group_title_on.find("._title_input_color");
			var $color_rgb = $group_title_on.find("._title_input_rgb");
			var $input_obj = $group_title_on.find("input");
			//input박스로 커서 이동
			//$group_title_on.find("input").focus().setCursorPosition($input_obj.val().length);
			$group_title_on.find("input").focus();
			$('body').off('click').on('click', function(event){
				if(
					$(event.target).parents('._title_color_picker').length === 0 &&
					!$(event.target).hasClass('_group_title_off') &&
					!$(event.target).hasClass('_title_input')
				){
					$group_title_off.removeClass('d-none');
					$group_title_on.addClass('d-none');
					updateGroup(current_g,$title_input.val(), $color_input.val(),function(){
						$group_title_off.html($title_input.val());

						//$group_title_off.style('color',);
					});
				}
			});

			//컬러피커 클릭이벤트
			$group_title_on.find("._title_color_picker_item").off("click").on("click",function(){
				var color_type = $(this).data('color-type');
				var color_rgb = $(this).data('color-rgb');

				$color_input.val(color_type);
				$color_rgb.val(color_rgb);

				$group_title_off.css('color',"#"+color_rgb);
				$title_input.css('color',"#"+color_rgb);
			});

		});
	}


	/***
	 * 폴더 및 그룹 html 셋팅
	 */
	function loadFolderListHtml(){
		var $folder_wrap = $sub_menu_container.find("._folder_wrap");
		$.ajax({
			url: "/backpg/ajax/voter/group/get_folder_list.ds",
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function onData (data) {
				if(data.code === 200){
					var html = '';
					current_f = parseInt(getParam('f'));
					current_f = isNaN(current_f) ? 0 : current_f;
					current_g = parseInt(getParam('g'));
					current_g = isNaN(current_g) ? 0 : current_g;


					$.each(data.folder_list.list,function(k,folder_data){
						var folder_tag_name = 'folder_tag_'+folder_data.idx;
						var folder_name = folder_data.name;
						html += '<div class="_group_item group-item" data-idx="'+folder_data.idx+'">';
						html += '<a class="_folder _folder_'+folder_data.idx+'" data-toggle="collapse" href="#'+folder_tag_name+'" role="button" aria-expanded="false" aria-controls="'+folder_tag_name+'">'+folder_name+'</a>';
						html += '<div class="_sortabled collapse" id="'+folder_tag_name+'" >';

						if(folder_data.group_list.total > 0){
							$.each(folder_data.group_list.list,function(k,group_data){
								var selected_css = '';

								if(group_data.idx === current_g){
									selected_css = 'bg-select';
								}


								html += '<div class="_sortabled_item sortabled" data-idx="'+group_data.idx+'">';
								html += '<a class="item-link '+selected_css+'" href="/voter?f='+folder_data.idx+'&g='+group_data.idx+'">'+group_data.name+'</a>';
								html += '</div>';
							});
						}
						html += '<div class="_tmp_sort_item sortabled" style="height: 0"></div>';
						html += '</div>';
						html += '</div>';
					});

					$folder_wrap.html(html);
					$folder_wrap.find("#folder_tag_"+current_f).collapse('toggle');




					setSubMenuSortableEvent($folder_wrap);


				}
			},
			error: function onError (data) {

			}
		});
	}

	/***
	 * 드레그블 이벤트 설정
	 * @param $folder_wrap
	 */
	function setSubMenuSortableEvent($folder_wrap){
		//폴더 드레그블 이벤트 설정
		$folder_wrap.sortable({
			start: function(event, ui) {

			},
			stop: function(event, ui) {
				var sort_no = ui.item.index()+1;
				var folder_idx = ui.item.data('idx');



				updateFolderSortable(sort_no, folder_idx, function(){

				});
			}
		});
		//$("#folder_tag_14").collapse('toggle');

		//그룹 드레그블 이벤트 설정
		var $sorable_obj = $folder_wrap.find("._sortabled");
		$sorable_obj.sortable({
			items: $('._sortabled .sortabled'),
			start: function(event, ui) {
				//폴더밑에 그룹이 존재하지 않는경우 드랍용 요소 생성
				$folder_wrap.find("._sortabled").each(function(){
					if($(this).find('._sortabled_item').length === 0){
						$(this).find("._tmp_sort_item").css({'height':"10px","border": "2px dotted #ebebeb"});
					}
				});

				$sorable_obj.sortable('refresh');


			},
			stop: function(event, ui) {
				//$folder_wrap.find("._folder").off('hover.test');
				//생성된 드랍용 요소 제거
				$sorable_obj.find("._tmp_sort_item").css({'height':"0px","border": "0px"});
				var sort_no = ui.item.index()+1;
				var group_idx = ui.item.data('idx');
				var folder_idx = ui.item.parents('._group_item').data('idx');

				updateGroupSortable(sort_no, folder_idx, group_idx, function(){

					//loadFolderListHtml();
					ui.item.find("a").attr('href',"/voter?f="+folder_idx+"&g="+group_idx+"");
				});
			}
		});
	}


	/***
	 * 폴더 정렬순서 변경
	 * @param sort_no
	 * @param folder_idx
	 * @param callback
	 */
	function updateFolderSortable(sort_no,folder_idx,callback){
		$.ajax({
			url: "/backpg/ajax/voter/group/update_folder_sort.ds",
			data:{'sort_no':sort_no,'folder_idx':folder_idx},
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function onData (data) {
				callback(data.code,data.msg);
			},
			error: function onError (data) {
				callback(data.code,data.msg);
			}
		});
	}


	/***
	 * 그룹 정렬순서 변경
	 * @param sort_no
	 * @param folder_idx
	 * @param group_idx
	 * @param callback
	 */
	function updateGroupSortable(sort_no,folder_idx,group_idx,callback){
		$.ajax({
			url: "/backpg/ajax/voter/group/update_group_sort.ds",
			data:{'sort_no':sort_no,'folder_idx':folder_idx, 'group_idx':group_idx},
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function onData (data) {
				callback(data.code,data.msg);
			},
			error: function onError (data) {
				callback(data.code,data.msg);
			}
		});
	}

	/***
	 * 그룹데이터 업데이트
	 * @type {boolean}
	 */
	var is_update_group_event = false;
	function updateGroup(group_idx, name, color,callback){
		if(!is_update_group_event){
			is_update_group_event  = true;
			if(name !== "" && group_idx > 0){
				$.ajax({
					url: "/backpg/ajax/voter/group/update_group.ds",
					data:{'group_idx':group_idx,'name':name, 'color':color},
					type: 'POST',
					dataType: 'json',
					success: function onData (data) {
						is_update_group_event = false;
						callback(data.code,data.msg);
					},
					error: function onError (data) {
						is_update_group_event = false;
						callback(data.code,data.msg);
					}
				});
			}
		}


	}


	/***
	 * 2차메뉴 이벤트 설정
	 */
	function setSubMenuEvent(){
		$sub_menu_container = $("#sub_menu_container");

		//폴더추가 이벤트 모달 설정
		var $btn_add_folder = $sub_menu_container.find('._btn_open_folder_modal');
		$btn_add_folder.on("click.btn_open_group_modal",function(){
			openFolderModal(0);
		});

		//그룹추가 이벤트 모달 설정
		var $btn_add_group = $sub_menu_container.find('._btn_open_group_modal');
		$btn_add_group.on("click.btn_open_group_modal",function(){
			openGroupModal(0);
		});

	}


	/***
	 * 폴더모달 오픈
	 * @param folder_idx
	 */
	function openFolderModal(folder_idx){
		var data = {
			'folder_idx' : folder_idx
		};
		openModal('add_folder',data,function($obj){
			//모달 저장/수정 버튼 이벤트
			$obj.find('._btn_add_folder').on('click.btn_add_folder',function(){
				var folder_name = $obj.find('._folder_name').val();
				var folder_idx = $obj.find('._folder_idx').val();
				addFolder(folder_name, folder_idx, function(code, msg){
					if(code === 200){
						closeModal($obj);
						loadFolderListHtml();
					}else{
						alert(msg);
					}
				});
			});
		});
	}

	/***
	 * 폴더추가
	 * @param folder_name
	 * @param folder_idx
	 * @param callback
	 */
	function addFolder(folder_name, folder_idx, callback){
		$.ajax({
			url: "/backpg/ajax/voter/group/add_folder.ds",
			data:{'folder_name':folder_name,'folder_idx':folder_idx},
			type: 'POST',
			dataType: 'json',
			success: function onData (data) {
				callback(data.code,data.msg);
			},
			error: function onError (data) {
				callback(data.code,data.msg);
			}
		});
	}



	/***
	 * 그룹모달 오픈
	 * @param group_idx
	 */
	function openGroupModal(group_idx){
		var data = {
			'group_idx' : group_idx
		};
		openModal('add_group',data,function($obj){
			//모달 저장/수정 버튼 이벤트
			$obj.find('._btn_add_group').on('click.btn_add_group',function(){
				var group_name = $obj.find('._group_name').val();
				var group_idx = $obj.find('._group_idx').val();

				addGroup(group_name, group_idx,current_f, function(code, msg){
					if(code === 200){
						closeModal($obj);
						loadFolderListHtml();
					}else{
						alert(msg);
					}
				});
			});
		});
	}

	/***
	 * 그룹추가
	 * @param group_name
	 * @param group_idx
	 * @param folder_idx
	 * @param callback
	 */
	function addGroup(group_name, group_idx, folder_idx,  callback){
		$.ajax({
			url: "/backpg/ajax/voter/group/add_group.ds",
			data:{'group_name':group_name,'group_idx':group_idx,'folder_idx':folder_idx},
			type: 'POST',
			dataType: 'json',
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
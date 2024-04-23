
	//////////////////////////////////////이벤트 리스너//////////////////////////////////////

	function showResultMessage (message, divid) {
		const targetDiv = document.getElementById(divid);
		const divRect = targetDiv.getBoundingClientRect();
		
		const messageEl = document.createElement('div');
		messageEl.style.position = 'fixed';
		messageEl.style.top = `${divRect.top + window.scrollY + divRect.height / 2}px`;
		messageEl.style.left = `${divRect.left + window.scrollX + divRect.width / 2}px`;
		messageEl.style.transform = 'translate(-50%, -50%)';
		messageEl.style.textAlign = 'center';
		messageEl.style.fontSize = '40px';
		messageEl.style.padding = '0.4em';
		messageEl.style.width = '80%';
		messageEl.style.borderRadius = '0.2em';
		messageEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
		messageEl.style.color = '#fff';
		messageEl.style.zIndex = '9999';
		messageEl.innerText = message;
		
		document.body.appendChild(messageEl);
		
		setTimeout(() => {
			document.body.removeChild(messageEl);
		}, 1000);
	}



	window.onload = function () 
	{
		text3 = localStorage.getItem('LAST_deck_list_M');
		if (text3!=undefined && text3.length > 2) {
			const deckArr = [];
			const cards = text3.split('___');
	
			for (const card of cards) {
				const [name, count] = card.split('__');
	
				if (!name || !count) {
				console.warn(`Invalid card data: ${card}`);
				console.warn(cards)
				continue;
				}
	
				const searchCard = sendData_onlyread_NEW(name);
				if (!searchCard) {
				console.warn(`Card not found: ${name}`);
				continue;
				}
	
				deckArr.push({ ...searchCard, count: parseInt(count) });
			}
	
			new_deck = deckArr;
			card_type_list_update();
			draw_canvas();
		}
	}
	
	window.onbeforeunload = function() {
		localStorage.setItem('LAST_deck_list_M', make_deck_list_string(new_deck))
	}

	function show_view_setting(){
		if ($('#setting_menu').css('height') != '0px') 
		{
			$('#setting_menu').css('display', 'none');
			$('#setting_menu').css('height', '0%');
		}
		else
		{
			$('#setting_menu').css('height', '100%');
			$('#setting_menu').css('display', 'flex');
		}
	}


	$('#search_button').on('click', function(event) {
		// id가 "content"인 div 요소 찾기
		var shieldDiv = document.querySelector('div[name="shield"]');
		if (shieldDiv == null)
		{
			window.history.pushState(null, null, document.location.href);
			var contentDiv = document.getElementById("content_wrap");
			var shieldDiv = document.createElement("div");
			var contentDivRect = contentDiv.getBoundingClientRect();
			shieldDiv.setAttribute("name", "shield");
			shieldDiv.style.position = "absolute";
			shieldDiv.style.top = "0";
			shieldDiv.style.left = "0";
			shieldDiv.style.width = "100%";
			shieldDiv.style.height = "100%";
			shieldDiv.style.zIndex = 15;
			shieldDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
			contentDiv.parentNode.insertBefore(shieldDiv, contentDiv);
			shieldDiv.addEventListener("mousedown",function(){document.getElementById("search_button").click();})
			shieldDiv.addEventListener("touchstart",function(){document.getElementById("search_button").click();})
		}

		const changeButton = document.getElementById("change_button");
		const high_button_left = document.getElementById("high_button_left");
		const high_button = document.getElementById("high_button");

		if (document.documentElement.scrollTop > 100) 
		{
			changeButton.disabled = false;
			changeButton.style.backgroundColor = "#5c93d1";

			if (search_now_!=false)
			{
				end_search()
			}

			$('body').css('overflow-y', 'hidden'); // overflowY 속성을 'hidden'으로 변경
			$('html, body').animate({
			scrollTop: 0 // 스크롤을 맨 위로 이동
			}, 200); // 애니메이션 시간 500ms
			return false
		}
		
		if (changeButton) 
		{
			// 버튼을 비활성화하고 배경색을 회색으로 변경합니다.
			changeButton.disabled = true;
			changeButton.style.backgroundColor = "gray";
		}

		$('html, body').animate({
		scrollTop: $(document).height()
		}, 500);
	});


	document.addEventListener("contextmenu", function(e)
	{
			e.preventDefault();
	}, false);
		
	window.onpopstate = function(event) {
	
      $('body').css('overflow-y', 'hidden'); // overflowY 속성을 'hidden'으로 변경
      $('html, body').animate({
        scrollTop: 0 // 스크롤을 맨 위로 이동
      }, 200); // 애니메이션 시간 500ms
      return false
	};

	window.addEventListener('scroll', function() {
		if (document.documentElement.scrollTop <= 0) {
			document.body.style.overflowY = 'hidden';
			var shieldDiv = document.querySelector('div[name="shield"]');
			if (shieldDiv!=undefined){shieldDiv.parentNode.removeChild(shieldDiv);}
			changeButton = document.getElementById("change_button");
			changeButton.disabled = false;
			changeButton.style.backgroundColor = "#5c93d1";
		}
	});

   button=undefined

  function make_search_button(width_,height_,...args)
  {
    $('#search_window1 button').css('display', 'none');
    const searchWindow1 = document.querySelector("#search_window1");
    const searchWindow2 = document.querySelector("#search_window2");
	arr=[]
     for (let i = args.length - 1; i >= 0; i--) {
      const btn = document.createElement("button");
      btn.textContent = args[i];
      btn.className ='search_btn'
      btn.style.width=(searchWindow1.getBoundingClientRect().width*width_)+"px"
      if (args[i]=='(조건 없음)'){btn.style.width=(searchWindow1.getBoundingClientRect().width*0.91)+"px"}
      btn.style.height=(searchWindow1.getBoundingClientRect().height*height_)+"px"
      searchWindow1.insertBefore(btn, searchWindow1.firstChild);
	  arr.push(btn)
    }
	arr.reverse(); // 배열의 순서를 뒤집음
	return arr
  }

  function end_search(test)
  {
	if (test == undefined)
		{search_now_=false}
	var searchWindow1 = document.querySelector("#search_window1");
	if (now_mode=='deck')
	{
		searchWindow1 =document.querySelector("#search_window3")
	}
	const children = Array.from(searchWindow1.children); // 자식 요소들을 배열로 가져옴
	children.forEach(child => {
	if (child.style.display == "none") {
		child.style.display = "block"; // display가 none이 아닌 요소의 display를 block으로 변경
	} else {
		child.remove(); // display가 none인 요소는 삭제
	}
	});
	
  }

  function setSearchType(value_,type_,id_, color_,only_remove,function_)
  {
	setTimeout(function() {
		const searchTypeBtn = document.getElementById(id_); 
		if (only_remove==undefined)
		{
			search_data[type_] = value_;
			if(on_click_run_NEW()!=false){searchTypeBtn.style.color =color_}
			end_search();
		}
		else 
		{
			search_now_=value_
			end_search('only_remove');
		}
		if (function_!=undefined){function_()}
	},120)
}


function press_search_button(key)
{

	if (key=='reset')
		{
				if (search_now_!=false)
				{end_search()}
				search_now_=false
				on_click_run_NEW(key); 
				const searchWindow1 = document.querySelector("#search_window1");
				const children = Array.from(searchWindow1.children); // 자식 요소들을 배열로 가져옴
				children.forEach(child => {
				child.style.color='rgb(3, 211, 211)'
				});
				return false
		}

	if (key=='cancel')
		{
			if (search_now_!=false)
			{
				if (search_data.effect==''){document.getElementById('search_effect').style.color='rgb(3, 211, 211)'}
				end_search()
			}
			else 
			{
				document.body.style.overflowY = 'hidden';
				$('html, body').animate({
				scrollTop: 0
				}, 200);
			}
			return false
		}

	if (key=='test')
		{
			arr=make_search_button(0.3,0.3,"이하","동등","이상")
			arr[0].addEventListener('click', function() {
				setTimeout(function() {
				search_data[search_now_[0]]=[search_now_[1],'3'];
				if (on_click_run_NEW()!=false) {document.getElementById(search_now_[2]).style.color='red' }
				end_search()
				},120)
			});
			arr[1].addEventListener('click', function() {
				setTimeout(function() {
				search_data[search_now_[0]]=[search_now_[1],'2']
				if (on_click_run_NEW()!=false) {document.getElementById(search_now_[2]).style.color='red' }
				end_search()
				},120)
			});
			arr[2].addEventListener('click', function() {
				setTimeout(function() {
				search_data[search_now_[0]]=[search_now_[1],'1']
				if (on_click_run_NEW()!=false) {document.getElementById(search_now_[2]).style.color='red' }
				end_search()
				},120)
			});
		return true
		}

	if (key=='name')
		{
		var inputText = prompt('검색어를 입력하세요\n아무것도 입력하지 않고 "확인"하시면 (검색안함)으로 됩니다');
		old_color=document.getElementById("search_attribute").style.color
		if (inputText=="") {document.getElementById("search_name").style.color='rgb(3, 211, 211)'; on_click_run_NEW(key,""); return false}
		if (inputText==null) {return false}
		on_click_run_NEW(key,inputText.toUpperCase())!=false
		document.getElementById("search_name").style.color='red'; return true;
		if (on_click_run_NEW(key.inputText.toUpperCase())!=false){document.getElementById("search_name").style.color='red'; return TRUE;}
		if (on_click_run_NEW(key,inputText.toUpperCase())==false){document.getElementById("search_name").style.color='red'; return TRUE;}
		return true
		}

	if (key=='attribute')
		{
		var inputText = prompt('검색어를 입력하세요\n아무것도 입력하지 않고 "확인"하시면 (검색안함)으로 됩니다');
		old_color=document.getElementById("search_attribute").style.color
		if (inputText=="") {document.getElementById("search_attribute").style.color='rgb(3, 211, 211)'; on_click_run_NEW(key,""); return false}
		if (inputText==null) {return false}
		on_click_run_NEW(key,inputText.toUpperCase())!=false
		document.getElementById("search_attribute").style.color='red'; return TRUE;
		if (on_click_run_NEW(key,inputText)!=false){document.getElementById("search_attribute").style.color='red'}
		return true
		}

	if (key=='card_number')
		{
		var inputText = prompt('검색어를 입력하세요\n아무것도 입력하지 않고 "확인"하시면 (검색안함)으로 됩니다');
		old_color=document.getElementById("search_card_number").style.color
		if (inputText=="") {document.getElementById("search_card_number").style.color='rgb(3, 211, 211)'; on_click_run_NEW(key,""); return false}
		if (inputText==null) {return false}
		on_click_run_NEW(key,inputText.toUpperCase())!=false
		document.getElementById("search_card_number").style.color='red'; return true;
		if (on_click_run_NEW(key,inputText.toUpperCase())==false){document.getElementById("search_card_number").style.color=old_color}
		return true
		}

	if (key=='type')
		{
			arr=make_search_button(0.45,0.3,"(조건 없음)","디지타마","디지몬","테이머","옵션")
			search_now_='type'
			arr[0].addEventListener('click', function() {
				setSearchType('','type',"search_type",'rgb(3, 211, 211)')
			});
			arr[1].addEventListener('click', function() {
				setSearchType('디지타마','type',"search_type",'red')
			});
			arr[2].addEventListener('click', function() {
				setSearchType('디지몬','type',"search_type",'red')
			});
			arr[3].addEventListener('click', function() {
				setSearchType('테이머','type',"search_type",'red')
			});
			arr[4].addEventListener('click', function() {
				setSearchType('옵션','type',"search_type",'red')
			});
		return false
		}

	if (key=='pack')
		{
			arr=make_search_button(0.3,0.2,"스타터덱","EX","프로모션","부스터1~4","부스터5~9","부스터10~13","전체보기")
			search_now_='pack'
			arr[0].addEventListener('click', function() {
				setTimeout(function() {
					    CARD_LIST = ALL_CARD_LIST.flat().filter(item => {
							// item.card_number가 존재하고, "ST"로 시작하는 경우에만 필터링
							return item.card_number && item.card_number.startsWith("ST");
						});
						on_click_run_NEW();
						end_search();
				},120)
			});
			arr[1].addEventListener('click', function() {
				setTimeout(function() {
					CARD_LIST=[ALL_CARD_LIST.flat().filter(item => item.card_number.includes("EX")) ];
					on_click_run_NEW();end_search();
				},120)
			});
			arr[2].addEventListener('click', function() {
				setTimeout(function() {
					CARD_LIST=[ALL_CARD_LIST.flat().filter(item => item.card_number.includes("P-")) ];
					on_click_run_NEW();end_search();
				},120)
			});
			arr[3].addEventListener('click', function() {
				setTimeout(function() {
					CARD_LIST=[BT01_02_03,BT01_02_03_B,BT04];on_click_run_NEW();end_search();
				},120)
			});
			arr[4].addEventListener('click', function() {
				setTimeout(function() {
					CARD_LIST=[BT05,BT06,BT07,BT08,BT09];on_click_run_NEW();end_search();
				},120)
			});
			arr[5].addEventListener('click', function() {
				setTimeout(function() {
					CARD_LIST=[BT10,BT11,BT12,BT13];on_click_run_NEW();end_search();
				},120)
			});
			arr[6].addEventListener('click', function() {
				setTimeout(function() {
					CARD_LIST=ALL_CARD_LIST.flat();
					on_click_run_NEW();end_search();
				},120)
			});
		return false
		}

	if (key=='card_level')
		{
			arr=make_search_button(0.293,0.3,"(조건 없음)","커먼","언커먼","레어","슈퍼레어","시크릿","프로모션")
			search_now_='card_level'
			arr[0].addEventListener('click', function() {
				setSearchType('','card_level',"search_card_level",'rgb(3, 211, 211)')
			});
			arr[1].addEventListener('click', function() {
				setSearchType('C','card_level',"search_card_level",'red')
			});
			arr[2].addEventListener('click', function() {
				setSearchType('U','card_level',"search_card_level",'red')
			});
			arr[3].addEventListener('click', function() {
				setSearchType('R','card_level',"search_card_level",'red')
			});
			arr[4].addEventListener('click', function() {
				setSearchType('SR','card_level',"search_card_level",'red')
			});
			arr[5].addEventListener('click', function() {
				setSearchType('SEC','card_level',"search_card_level",'red')
			});
			arr[6].addEventListener('click', function() {
				setSearchType('P','card_level',"search_card_level",'red')
			});
		return false
		}

	if (key=='color')
		{
			arr=make_search_button(0.3,0.2,"(조건 없음)","레드","블루","옐로","그린","퍼플","블랙","화이트")
			search_now_='color'
			arr[0].addEventListener('click', function() {
				setSearchType('','color',"search_color",'rgb(3, 211, 211)')
			});
			arr[1].addEventListener('click', function() {
				setSearchType('적','color',"search_color",'red')
			});
			arr[2].addEventListener('click', function() {
				setSearchType('청','color',"search_color",'blue')
			});
			arr[3].addEventListener('click', function() {
				setSearchType('황','color',"search_color",'yellow')
			});
			arr[4].addEventListener('click', function() {
				setSearchType('녹','color',"search_color",'green')
			});
			arr[5].addEventListener('click', function() {
				setSearchType('자','color',"search_color",'purple')
			});
			arr[6].addEventListener('click', function() {
				setSearchType('흑','color',"search_color",'gray')
			});
			arr[7].addEventListener('click', function() {
				setSearchType('백','color',"search_color",'white')
			});
		return false
		}

	if (key=='level')
	{
		arr=make_search_button(0.3,0.2,"(조건 없음)","1","2","3","4","5","6","7")
		search_now_=['level','',"search_level"]

		arr[0].addEventListener('click', function() {
			setSearchType(['-','2'],'level',"search_level",'rgb(3, 211, 211)')
		});
		arr[1].addEventListener('click', function() {
			setSearchType(['level','1',"search_level"],'level',"search_level",'red','only_remove',function(){press_search_button('test')})
		});
		arr[2].addEventListener('click', function() {
			setSearchType(['level','2',"search_level"],'level',"search_level",'red','only_remove',function(){press_search_button('test')})
		});
		arr[3].addEventListener('click', function() {
			setSearchType(['level','3',"search_level"],'level',"search_level",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[4].addEventListener('click', function() {
			setSearchType(['level','4',"search_level"],'level',"search_level",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[5].addEventListener('click', function() {
			setSearchType(['level','5',"search_level"],'level',"search_level",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[6].addEventListener('click', function() {
			setSearchType(['level','6',"search_level"],'level',"search_level",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[7].addEventListener('click', function() {
			setSearchType(['level','7',"search_level"],'level',"search_level",'red','only_remoove',function(){press_search_button('test')})
		});
		return false
	}

	if (key=='cost')
	{
		arr=make_search_button(0.18,0.15,"(조건 없음)","0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19")
		search_now_=['cost','',"search_cost"]

		arr[0].addEventListener('click', function() {
			setSearchType(['-','2',"search_cost"],'cost',"search_cost",'rgb(3, 211, 211)')
		});
		arr[1].addEventListener('click', function() {
			setSearchType(['cost','0',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[2].addEventListener('click', function() {
			setSearchType(['cost','1',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[3].addEventListener('click', function() {
			setSearchType(['cost','2',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[4].addEventListener('click', function() {
			setSearchType(['cost','3',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[5].addEventListener('click', function() {
			setSearchType(['cost','4',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[6].addEventListener('click', function() {
			setSearchType(['cost','5',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[7].addEventListener('click', function() {
			setSearchType(['cost','6',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[8].addEventListener('click', function() {
			setSearchType(['cost','7',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[9].addEventListener('click', function() {
			setSearchType(['cost','8',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[10].addEventListener('click', function() {
			setSearchType(['cost','9',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[11].addEventListener('click', function() {
			setSearchType(['cost','10',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[12].addEventListener('click', function() {
			setSearchType(['cost','11',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[13].addEventListener('click', function() {
			setSearchType(['cost','12',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[14].addEventListener('click', function() {
			setSearchType(['cost','13',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[15].addEventListener('click', function() {
			setSearchType(['cost','14',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[16].addEventListener('click', function() {
			setSearchType(['cost','15',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[17].addEventListener('click', function() {
			setSearchType(['cost','16',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[18].addEventListener('click', function() {
			setSearchType(['cost','17',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[19].addEventListener('click', function() {
			setSearchType(['cost','18',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[20].addEventListener('click', function() {
			setSearchType(['cost','19',"search_cost"],'cost',"search_cost",'red','only_remoove',function(){press_search_button('test')})
		});
		return false
	}

	if (key=='dp')
	{
		arr=make_search_button(0.23,0.17,"(조건 없음)","1000","2000","3000","4000","5000","6000","7000","8000","9000","10000","11000","12000","13000","14000","15000","16000")
		search_now_=['dp','',"search_dp"]

		arr[0].addEventListener('click', function() {
			setSearchType(['-','2',"search_dp"],'dp',"search_dp",'rgb(3, 211, 211)')
		});
		arr[1].addEventListener('click', function() {
			setSearchType(['dp','1000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[2].addEventListener('click', function() {
			setSearchType(['dp','2000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[3].addEventListener('click', function() {
			setSearchType(['dp','3000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[4].addEventListener('click', function() {
			setSearchType(['dp','4000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[5].addEventListener('click', function() {
			setSearchType(['dp','5000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[6].addEventListener('click', function() {
			setSearchType(['dp','6000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[7].addEventListener('click', function() {
			setSearchType(['dp','7000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[8].addEventListener('click', function() {
			setSearchType(['dp','8000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[9].addEventListener('click', function() {
			setSearchType(['dp','9000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[10].addEventListener('click', function() {
			setSearchType(['dp','10000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[11].addEventListener('click', function() {
			setSearchType(['dp','11000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[12].addEventListener('click', function() {
			setSearchType(['dp','12000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[13].addEventListener('click', function() {
			setSearchType(['dp','13000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[14].addEventListener('click', function() {
			setSearchType(['dp','14000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[15].addEventListener('click', function() {
			setSearchType(['dp','15000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		arr[16].addEventListener('click', function() {
			setSearchType(['dp','16000',"search_dp"],'dp',"search_dp",'red','only_remoove',function(){press_search_button('test')})
		});
		return true
	}

	if (key=='evocostlv')
	{
		arr=make_search_button(0.23,0.17,"(조건 없음)","Lv.2~","Lv.3~","Lv.4~","Lv.5~","Lv.6~","Lv.7~")
		search_now_='evocostlv'

		arr[0].addEventListener('click', function() {
			setSearchType('','evolution_cost_Level',"search_evocostlv",'rgb(3, 211, 211)',undefined,function(){press_search_button('evocost')})
		});
		arr[1].addEventListener('click', function() {
			setSearchType('Lv2','evolution_cost_Level',"search_evocostlv",'red',undefined,function(){press_search_button('evocost')})
		});
		arr[2].addEventListener('click', function() {
			setSearchType('Lv3','evolution_cost_Level',"search_evocostlv",'red',undefined,function(){press_search_button('evocost')})
		});
		arr[3].addEventListener('click', function() {
			setSearchType('Lv4','evolution_cost_Level',"search_evocostlv",'red',undefined,function(){press_search_button('evocost')})
		});
		arr[4].addEventListener('click', function() {
			setSearchType('Lv5','evolution_cost_Level',"search_evocostlv",'red',undefined,function(){press_search_button('evocost')})
		});
		arr[5].addEventListener('click', function() {
			setSearchType('Lv6','evolution_cost_Level',"search_evocostlv",'red',undefined,function(){press_search_button('evocost')})
		});
		arr[6].addEventListener('click', function() {
			setSearchType('Lv7','evolution_cost_Level',"search_evocostlv",'red',undefined,function(){press_search_button('evocost')})
		});
		return true
	}

	if (key=='evocost')
	{
		arr=make_search_button(0.23,0.17,"(조건 없음)","0","1","2","3","4","5","6","7","8","9")
		search_now_='evocost'

		arr[0].addEventListener('click', function() {
			if (search_data.evolution_cost_Level==''){setSearchType('-','evolution_cost',"search_evocostlv",'rgb(3, 211, 211)'); on_click_run_NEW(); return false}
			setSearchType('-','evolution_cost',"search_evocostlv",'rgb(3, 211, 211)',undefined,function(){press_search_button('evo_test')})
		});
		arr[1].addEventListener('click', function() {
			setSearchType('0','evolution_cost',"search_evocostlv",'red',undefined,function(){press_search_button('evo_test')})
		});
		arr[2].addEventListener('click', function() {
			setSearchType('1','evolution_cost',"search_evocostlv",'red',undefined,function(){press_search_button('evo_test')})
		});
		arr[3].addEventListener('click', function() {
			setSearchType('2','evolution_cost',"search_evocostlv",'red',undefined,function(){press_search_button('evo_test')})
		});
		arr[4].addEventListener('click', function() {
			setSearchType('3','evolution_cost',"search_evocostlv",'red',undefined,function(){press_search_button('evo_test')})
		});
		arr[5].addEventListener('click', function() {
			setSearchType('4','evolution_cost',"search_evocostlv",'red',undefined,function(){press_search_button('evo_test')})
		});
		arr[6].addEventListener('click', function() {
			setSearchType('5','evolution_cost',"search_evocostlv",'red',undefined,function(){press_search_button('evo_test')})
		});
		arr[7].addEventListener('click', function() {
			setSearchType('6','evolution_cost',"search_evocostlv",'red',undefined,function(){press_search_button('evo_test')})
		});
		arr[8].addEventListener('click', function() {
			setSearchType('7','evolution_cost',"search_evocostlv",'red',undefined,function(){press_search_button('evo_test')})
		});
		arr[9].addEventListener('click', function() {
			setSearchType('8','evolution_cost',"search_evocostlv",'red',undefined,function(){press_search_button('evo_test')})
		});
		arr[10].addEventListener('click', function() {
			setSearchType('9','evolution_cost',"search_evocostlv",'red',undefined,function(){press_search_button('evo_test')})
		});
		return true
	}

	if (key=='evo_test')
		{
			arr=make_search_button(0.3,0.3,"이하","동등","이상")
			arr[0].addEventListener('click', function() {
				setTimeout(function() {
				search_data.evolution_cost_Test='3';
				on_click_run_NEW()
				document.getElementById('search_evocostlv').style.color='red'
				end_search()
				},120)
			});
			arr[1].addEventListener('click', function() {
				setTimeout(function() {
				search_data.evolution_cost_Test='2';
				on_click_run_NEW()
				document.getElementById('search_evocostlv').style.color='red'
				end_search()
				},120)
			});
			arr[2].addEventListener('click', function() {
				setTimeout(function() {
				search_data.evolution_cost_Test='1';
				on_click_run_NEW()
				document.getElementById('search_evocostlv').style.color='red'
				end_search()
				},120)
			});
		return true
		}

	if (key=='effect')
	{
		arr=make_search_button(0.45,0.3,"(조건 없음)","전체효과에서","자체효과만","진화원효과만","시큐리티효과만")
		search_now_=['effect']

		arr[0].addEventListener('click', function() {
			document.getElementById("search_effect").style.color='rgb(3, 211, 211)'; 
			search_data[key]=""; search_data['effect_test']=1; 
			on_click_run_NEW(); end_search();
		});
		
		arr[1].addEventListener('click', function() {
			setTimeout(function(){
			var inputText = prompt('효과 검색어를 입력하세요\n(전체검색은 띄어쓰기 1칸 입력하시면됩니다)');
			if (inputText=="") 
			{
				document.getElementById("search_effect").style.color='rgb(3, 211, 211)'; 
				search_data[key]=""; search_data['effect_test']=1; 
				on_click_run_NEW(); end_search();return false
			}
			else if (inputText==null) {end_search();  return false}
			else
			{
				on_click_run_NEW(key,(inputText==null)? "" : inputText.toUpperCase())
				if (on_click_run_NEW('effect_test',1) != false)
				{
					const searchTypeBtn = document.getElementById("search_effect"); 
					searchTypeBtn.style.color='red'
				}
				end_search()
			}
			},150)
		});
		arr[2].addEventListener('click', function() {
			setTimeout(function(){
			var inputText = prompt('효과 검색어를 입력하세요\n(전체검색은 띄어쓰기 1칸 입력하시면됩니다)');
			if (inputText=="") 
			{
				document.getElementById("search_effect").style.color='rgb(3, 211, 211)'; 
				search_data[key]=""; search_data['effect_test']=2; 
				on_click_run_NEW(); end_search(); return false
			}
			else if (inputText==null) {end_search();  return false}
			else
			{
				on_click_run_NEW(key,(inputText==null)? "" : inputText.toUpperCase())
				if (on_click_run_NEW('effect_test',2) != false)
				{
					const searchTypeBtn = document.getElementById("search_effect"); 
					searchTypeBtn.style.color='red'
				}
				end_search()
			}
			},150)
		});
		arr[3].addEventListener('click', function() {
			setTimeout(function(){
			var inputText = prompt('효과 검색어를 입력하세요\n(전체검색은 띄어쓰기 1칸 입력하시면됩니다)');
			if (inputText=="") 
			{
				document.getElementById("search_effect").style.color='rgb(3, 211, 211)'; 
				search_data[key]=""; search_data['effect_test']=3; 
				on_click_run_NEW(); end_search(); return false
			}
			else if (inputText==null) {end_search();  return false}
			else
			{
				on_click_run_NEW(key,(inputText==null)? "" : inputText.toUpperCase())
				if (on_click_run_NEW('effect_test',3) != false)
				{
					const searchTypeBtn = document.getElementById("search_effect"); 
					searchTypeBtn.style.color='red'
				}
				end_search()
			}
			},150)
		});
		arr[4].addEventListener('click', function() {
			setTimeout(function(){
			var inputText = prompt('효과 검색어를 입력하세요\n(전체검색은 띄어쓰기 1칸 입력하시면됩니다)');
			if (inputText=="") 
			{
				document.getElementById("search_effect").style.color='rgb(3, 211, 211)'; 
				search_data[key]=""; search_data['effect_test']=4; 
				on_click_run_NEW(); end_search(); return false
			}
			else if (inputText==null) {end_search();  return false}
			else
			{
				on_click_run_NEW(key,(inputText==null)? "" : inputText.toUpperCase())
				if (on_click_run_NEW('effect_test',4) != false)
				{
					const searchTypeBtn = document.getElementById("search_effect"); 
					searchTypeBtn.style.color='red'
				}
				end_search()
			}
			},150)
		});
		return true
	}
}


	function deck_load()
	{
		search_now_='deck_load'
		$('#search_window3 button').css('display', 'none');
		const searchWindow1 = document.querySelector("#search_window3");
		const searchWindow2 = document.querySelector("#search_window4");

		var btn = document.createElement("button");
		btn.className ='search_btn'
		btn.textContent='삭제하기'
		btn.style.width=(searchWindow1.getBoundingClientRect().width*0.45)+"px"
		btn.style.height=(searchWindow1.getBoundingClientRect().height*0.3)+"px"
		searchWindow1.insertBefore(btn, searchWindow1.firstChild);
		btn.addEventListener('click', (event) => {
			setTimeout(function(){
				Delete_Deck()
			},150)
		})

		var btn = document.createElement("button");
		btn.className ='search_btn'
		btn.textContent='이름 변경'
		btn.style.width=(searchWindow1.getBoundingClientRect().width*0.45)+"px"
		btn.style.height=(searchWindow1.getBoundingClientRect().height*0.3)+"px"
		searchWindow1.insertBefore(btn, searchWindow1.firstChild);
		btn.addEventListener('click', (event) => {
			setTimeout(function(){
				Rename_Deck()
			},150)
		})

		var btn = document.createElement("button");
		btn.className ='search_btn'
		btn.textContent='불러오기'
		btn.style.width=(searchWindow1.getBoundingClientRect().width*0.45)+"px"
		btn.style.height=(searchWindow1.getBoundingClientRect().height*0.3)+"px"
		searchWindow1.insertBefore(btn, searchWindow1.firstChild);
		btn.addEventListener('click', (event) => {
			setTimeout(function(){
				select = document.getElementById("input-select2");
				if (select.options.length==0 || load_deck_from_cookie(select.options[select.selectedIndex].text)==false)
				{showResultMessage('덱이 잘못되었습니다','body')}
			},150)
		})

		var btn = document.createElement("button");
		btn.className ='search_btn'
		btn.textContent='저장하기'
		btn.style.width=(searchWindow1.getBoundingClientRect().width*0.45)+"px"
		btn.style.height=(searchWindow1.getBoundingClientRect().height*0.3)+"px"
		searchWindow1.insertBefore(btn, searchWindow1.firstChild);
		btn.addEventListener('click', (event) => {
			setTimeout(function(){
				deck_save()
			},150)
		})

		var btn = document.createElement("select");
		btn.className ='search_select'
		btn.id='input-select2'
		btn.style.width=(searchWindow1.getBoundingClientRect().width*0.8)+"px"
		btn.style.height=(searchWindow1.getBoundingClientRect().height*0.25)+"px"
		searchWindow1.insertBefore(btn, searchWindow1.firstChild);
		btn.addEventListener('change', (event) => {
		})
		update_cookie_deck_list()
	}
	
	function deck_save() {
    a = prompt("카드 리스트를 저장합니다. 덱 이름을 정해주세요.", "덱 이름")
    Cookie_deck_lst=listCookies()
   
    if (a != null && a.length != 0 ) { 
        regex = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|0-9|\-|\_|\s]+$/;
        if (regex.test(a) && a.length<19)  {
          } 
          else
          {
            showResultMessage('덱 이름에는 한글 영어 숫자 "-" "_"  만 사용할 수 있습니다.\n또한 길이는 18자 이하만 가능합니다'); return false
          }
        for (i of Cookie_deck_lst) {
            if (a == i) { showResultMessage('중복된 덱이름이 존재합니다.'); return false }
        }
		setCookie(a, make_deck_list_string(new_deck), 365)
		showResultMessage('저장 성공','body')
        update_cookie_deck_list()
    } else {
    }
}

var scrollPosition
var scrollPosition2

function change_deck_or_search()
{

	if ($('#setting_menu').css('height') != '0px') 
		{
			$('#setting_menu').css('display', 'none');
			$('#setting_menu').css('height', '0%');
		}

	var content = document.querySelector('#content');
	var content2 = document.querySelector('#content2');
	var content_blur = document.querySelector('#content_blur');
	var title_ = document.querySelector('#high_button_left');
	var search_button = document.querySelector('#search_button');
	var search_window = document.querySelector('#search_window');
	var search_window1 = document.querySelector('#search_window1');
	var search_window2 = document.querySelector('#search_window2');
	var search_window3 = document.querySelector('#search_window3');
	var search_window4 = document.querySelector('#search_window4');
	if (now_mode=='search')
	{
		scrollPosition = content.scrollTop;
		now_mode='deck'
		LAST_CARD_LIST=CARD_LIST
		CARD_LIST=new_deck
		search_window.style.height='30%'
		title_.innerText='🛠 덱 편집 모드'
		search_button.innerText = '덱 설정';
		search_window1.style.display='none'
		search_window2.style.display='none'
		search_window3.style.display='flex'
		search_window4.style.display='flex'
		high_button_left.style.backgroundColor = "#FF7F50";
		high_button.style.backgroundColor = "#FF7F50";

		$('#content_blur').animate({
		left: '0' // 왼쪽에서 오른쪽으로 이동
		}, 200); // 1초 동안 애니메이션 적용

		setTimeout(function(){
		content.style.display = 'none';
		content2.style.display = 'flex';
		draw_canvas();
		content2.scrollTop = scrollPosition2;
			content_blur.animate({
  			opacity: '0' // 투명도를 1에서 0으로 감소시킴
			}, 200); // 1초 동안 애니메이션 적용
		},200)
		setTimeout(function(){
			content_blur.style.backgroundColor='#bbd4e6'
			content_blur.style.width='0%'
			content_blur.style.opacity='1'
		},405)
	}
	else
	{
		
		scrollPosition2 = content2.scrollTop;
		now_mode='search'
		CARD_LIST=LAST_CARD_LIST
		search_window.style.height='50%'
		high_button_left.innerText='🛠 서치 모드'
		search_button.innerText = '검색';
		search_window1.style.display='flex'
		search_window2.style.display='flex'
		search_window3.style.display='none'
		search_window4.style.display='none'
		high_button_left.style.backgroundColor = "#33494d";
		high_button.style.backgroundColor = "#33494d";

		$('#content_blur').animate({
		width:'100%' // 왼쪽에서 오른쪽으로 이동
		}, 200); // 1초 동안 애니메이션 적용

		setTimeout(function(){
		content.style.display = 'flex';
		content2.style.display = 'none';
		image_change(from_server_data)
		content.scrollTop = scrollPosition;
			content_blur.animate({
			opacity: '0' // 투명도를 1에서 0으로 감소시킴
			}, 200); // 1초 동안 애니메이션 적용
		},200)
		setTimeout(function(){
			content_blur.style.backgroundColor='#e6b8b8'
			content_blur.style.left='100%'
			content_blur.style.opacity='1'
			while (content2.firstChild) {
			content2.removeChild(content2.firstChild);
			}
		},405)
	}
}



	var startX; // 터치 시작 지점의 x좌표
      var threshold = 100; // 드래그 인식 거리
      
      document.addEventListener('touchstart', function(e) {
		if (e.touches.length > 1) 
		{
			return;
		}
        startX = e.touches[0].clientX;
      });
      
      // 터치 이동 이벤트
      document.addEventListener('touchmove', function(e) {
		if (e.touches.length > 1) 
		{
			return;
		}
        var currentX = e.touches[0].clientX;
        var distance = startX - currentX;
         // pinch-to-zoom 제스처 감지
        // 드래그 거리가 인식 거리보다 크면 함수 실행
        if (Math.abs(distance) > threshold) 
		{
          if (distance > 0) {
            // 왼쪽으로 드래그한 경우 실행할 함수
			if (now_mode=="search"){change_deck_or_search()}
          } else {
            // 오른쪽으로 드래그한 경우 실행할 함수
			if (now_mode=="deck"){change_deck_or_search()}
          }
        }
      });

	//////////////////////////////////////이벤트 리스너//////////////////////////////////////


	



















	//////////////////////////////////////카드 관련 코드 모음//////////////////////////////////////



	  	function load_deck_from_cookie(deck_name)
		{
			const text3 = getCookie(deck_name);
			if (text3==undefined){return true}
			console.log(deck_name)
			if (text3.length > 2) {
			const deckArr = [];
			const cards = text3.split('___');

			for (const card of cards) {
				const [name, count] = card.split('__');

				if (!name || !count) {
				//console.warn(`Invalid card data: ${card}`);
				continue;
				}
				flatArr = ALL_CARD_LIST.reduce((acc, val) => acc.concat(val), []);
				flatArr.forEach((item) => 
				{
					if (item.card_number == name) 
					{
						item.count = Number(count);
						deckArr.push(item)
					}
				});
			}
			new_deck = deckArr;
			card_type_list_update();
			image_change(from_server_data)
			draw_canvas()
			}
		}


		function deck_reset()
		{
			let answer = confirm("덱을 리셋하시겠습니까?");
			if (answer) {
			new_deck.forEach(card => {
				card.count = 0;
			});
			new_deck=[]
			draw_canvas()
			image_change(from_server_data)
			card_type_list_update();
			a=document.querySelector("#search_button")
			a.click()
			setTimeout(function(){change_deck_or_search()},200)
			
			} 
		}


		function pad(str) {
			str = str.toString();
			return str.length < 2 ? pad(" " + str, 2) : str;
		}

		function card_type_list_update() 
		{
			const digimons_lv = [0, 0, 0, 0, 0];
			let digitama_card_ = 0;
			let digimon_card_ = 0;
			let option_card_ = 0;
			let tamer_card_ = 0;
			let all_card_ = 0;
			
			for (const i of new_deck) {
				if (i.type === "디지몬") {
				digimons_lv[i.level - 3] += i.count;
				digimon_card_+=i.count
				} else if (i.type === "디지타마") {
				digitama_card_ += i.count;
				} else if (i.type === "옵션") {
				option_card_ += i.count;
				} else if (i.type === "테이머") {
				tamer_card_ += i.count;
				}
				all_card_ += parseInt(i.count);
			}
			
			 card_type_list1 = `성장기 ${pad(digimons_lv[0])} / 성숙기 ${pad(digimons_lv[1])} / 완전체 ${digimons_lv[2]} / 궁극체 ${pad(digimons_lv[3])}`;
			 card_type_list2 = `유년기 ${pad(digitama_card_)} / 옵션 ${pad(option_card_)} / 테이머 ${pad(tamer_card_)} / 초궁극체 ${pad(digimons_lv[4])}`;
			 card_type_list3 = all_card_;
			
		// 여기서 반환하거나 전역 변수에 저장 등으로 활용
			document.getElementById('high_button').textContent = "(" + pad(digitama_card_) + " / " +
			pad(digimon_card_) + " / " +
			pad(tamer_card_) + " / " +
			pad(option_card_) + ") / " + all_card_
			let text = card_type_list1 + ' / ' + card_type_list2;
			let arr = text.split(' / ');
			arr.splice(4, 0, arr.pop());
			arr.unshift(arr.splice(5, 1)[0]);
			text = arr.join('<br>');
			document.getElementById('Deck_Info').innerHTML = text.replace(/\n/g, "<br>");
		}

	// 데이터베이스에서 불러와서 이미지 바꾸는 함수
	function image_change(from_server_data_) {
		
		imgdiv_arr=[]
		while (contentDiv.firstChild) {
		contentDiv.removeChild(contentDiv.firstChild);
		}
		for (i of from_server_data_)
		{
		const div1 = document.createElement('div')
		div1.style.width = `${contentWidth / view_card_width * 1}px`;
		div1.style.height = `${contentWidth / view_card_width * 1.4}px`;
		
		const img = document.createElement('img');
		img.loading="lazy"
		img.src = i.image_link;
		img.style.width = '93%';
		img.style.height = '93%';
		if (i.count == undefined || i.count==0)
		{img.style.filter = "brightness(80%)";}
		div1.appendChild(img);
		contentDiv.appendChild(div1);
		div1.id='card_div'
		imgdiv_arr.push(div1)
			
		img.addEventListener('mousedown', function (event) 
		{
			const imgLink = this.src;
			val=change_deck(imgLink, 1);
			
			const parentDiv = this.parentNode;
			const countNumElements = parentDiv.querySelectorAll('.new-div');
			countNumElements.forEach((element) => {
			element.parentNode.removeChild(element);
			});
			if (val!=undefined && val!=0)
			{
				draw_text(parentDiv,val)
				this.style.filter = "brightness(100%)";
			}
			else if (val==0)
			{
				this.style.filter = "brightness(80%)";
			}
			const element = this;
			element.classList.add('active');
			setTimeout(function(){element.classList.remove('active');},120)
		})
		
		}
		for (i=0; i<imgdiv_arr.length;i++)
		{
			val=from_server_data_[i].count
			if (val!=undefined && val!=0)
			{
				draw_text(imgdiv_arr[i],val)
			}
		}
		
		contentDiv.scrollTop=0
	}

	//checkJsonDataMatch 도움용 함수
	function findMatchedElement(arr, level, operator, cost) {
		if (cost!="-") {cost=Number(cost)}
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].length<4 ){break;}
		const [lv, ct] = arr[i].split('~');
		const lvNum = Number(lv.slice(3));
		const ctNum = Number(ct);
		switch (Number(operator)) {
			case 3:
			if (cost=="-" || ctNum <= cost) {
				if(level=="" || level==lvNum)
				{return true;}
			}
			break;
			case 1:
			if (cost=="-" || ctNum >= cost) {
				if(level=="" || level==lvNum)
				{return true;}
			}
			break;
			case 2:
			if (cost=="-" || ctNum == cost) {
				if(level=="" || level==lvNum)
				{return true;}
			}
			break;
			default:
			break;
		}
		}

		return false;
		}
	//checkJsonDataMatch 제이슨 데이터 가 조건에 맞나 확인함
	function checkJsonDataMatch(a, b) {
		if (!a || !b) {
			return false;
		}
		if (b.name.includes(a.name) && b.color.includes(a.color) && b.attribute.includes(a.attribute) &&
			b.card_number.includes(a.card_number) && b.type.includes(a.type)) {
			if (a.level[0] != "-") {
				if (a.level[1] == 2 && a.level[0] != parseInt(b.level)) {
					return false;
				} else if (a.level[1] == 1 && (parseInt(a.level[0])) > parseInt(b.level)) {
					return false;
				} else if (a.level[1] == 3 && (parseInt(a.level[0])) < (parseInt(b.level))) {
					return false;
				}
			}
			if (a.card_level!='' && a.card_level!=b.card_level){return false}
			if (a.cost[0] != "-") {
				// a와 b의 appearanceCost 배열 값을 비교합니다.
				if (a.cost[1] == 2 && a.cost[0] != parseInt(b.cost)) {
					return false;
				} else if (a.cost[1] == 1 && (parseInt(a.cost[0])) > parseInt(b.cost)) {
					return false;
				} else if (a.cost[1] == 3 && (parseInt(a.cost[0])) < (parseInt(b.cost))) {
					return false;
				}
			}
			if (a.dp[0] != "-") {
				//if (a.dp[1] == 3){alert(a.dp[0]+"      "+(parseInt(b.dp)+1)+"     "+(a.dp[0] < (parseInt(b.dp)+1)))}
				// a와 b의 DP 배열 값을 비교합니다.
				if (a.dp[1] == 2 && a.dp[0] != parseInt(b.dp)) {
					return false;
				} else if (a.dp[1] == 1 && (parseInt(a.dp[0])) > parseInt(b.dp)) {
					return false;
				} else if (a.dp[1] == 3 && (parseInt(a.dp[0])) < (parseInt(b.dp))) {
					return false;
				}
			}
			const a_effect = a.effect;
			const b_effect = b.effect;
			const a_effect_test = a.effect_test
			let result = false;
			//alert(b_effect)
			if (a_effect_test == 1) {
			// b_effect의 모든 텍스트에서 a_effect 텍스트가 포함되어 있는지 확인
			result = b_effect.some((effectText) => effectText.includes(a_effect));
			} else if (a_effect_test == 2) {
			// b_effect의 첫번째 원소 텍스트에서 a_effect 텍스트가 포함되어 있는지 확인
			result = b_effect[0].includes(a_effect);
			} else if (a_effect_test == 4) {
			// b_effect의 두번째 원소 텍스트에서 a_effect 텍스트가 포함되어 있는지 확인
			result = b_effect[1].includes(a_effect);
			} else if (a_effect_test == 3) {
			// b_effect의 세번째 원소 텍스트에서 a_effect 텍스트가 포함되어 있는지 확인
			result = b_effect[2].includes(a_effect);
			}
			if (result==false) {return false}
			const levelInput = a.evolution_cost_Level
			const sizeInput = a.evolution_cost_Test
			const costInput = a.evolution_cost
			//findMatchedElement()
			if (levelInput=="" && costInput=="-"){}
			else {if (findMatchedElement(b.evolution_cost ,Number(levelInput.slice(2)),  sizeInput,  costInput)==false) {return false}}

			


			// 모든 비교 조건이 참이면 true를 반환합니다.
			return true;
		}
	}
	


	function sendData_NEW(post_message2)
  {
      const arr = (CARD_LIST.flat()).filter((card) => checkJsonDataMatch(post_message2, card));
		for (i=0; i<arr.length;i++)
		{
			check_=false
			if (arr[i].name.includes("(P)"))
			{
				find_origin_card=arr[i].name.split("(P)")[0]
				find_origin_card_number=arr[i].card_number.split("P")[0]
				for (ii=0; ii<arr.length;ii++)
				{
					if (arr[ii].name==find_origin_card && arr[ii].card_number==find_origin_card_number)
					{	
						check_=ii+1
						break
					}
				}
			}
			if (check_!=false)
			{
				check_=check_-1
				backup_=arr[i]
				arr.splice(i, 1);
    			arr.splice(check_+1, 0, backup_);
			}
		}
      from_server_data_a = arr;

      if (arr.length === 0) {
        showResultMessage("결과 없음", 'body'); return false
      } else {
        if (from_server_data_a.length == 0) {showResultMessage("결과 없음", 'body'); return false }
		//showResultMessage(from_server_data_a.length+"개 발견",'body')
        image_change(from_server_data_a);
        from_server_data = from_server_data_a;
      }
	}
	
	function sendDatafrom_edit_deck(new_page_num) {
		var start_index = (new_page_num - 1) * 21;
		var end_index = start_index + 21;
		var extracted_array = edit_deck.slice(start_index, end_index);
		if (extracted_array.length != 0) { image_change(extracted_array); return true }
		else {
			showResultMessage("결과 없음", 'body');
		}
	}

	function changeEffectText() {
		var selectEl = document.getElementById("effect_test"); // select 요소의 id를 가져옵니다.
		var selectedOption = selectEl.options[selectEl.selectedIndex].text; // 선택된 option의 text를 가져옵니다.

		var effectTextEl = document.getElementById("effect_text"); // effect_text div의 id를 가져옵니다.
		var effectText = effectTextEl.textContent.trim(); // effect_text의 text를 가져옵니다.

		var newText = "";
		if (selectedOption === "전체") { // 선택된 option이 빈 문자열인 경우
			newText = "효과";
		} else { // 선택된 option이 빈 문자열이 아닌 경우
			var effectOnly = selectedOption.replace("효과만", "").trim(); // 선택된 option에서 "효과만"을 제거합니다.
			newText = "효과(" + effectOnly+")";
		}

		effectTextEl.textContent = newText; // effect_text div의 text를 업데이트합니다.
	}


	function on_click_run_NEW(key,value) { // 검색 시작
      
      if (key!=undefined && key !='reset') 
      {
        search_data[key]=value
      }
      else if (key=='reset')
      {
        search_data={
          name: "",
          type: "",
          color: "",
          level: ['-','2'],
          attribute: "",
          dp: ['-','2'],
          cost: ['-','2'],
          evolution_cost: "-",
          evolution_cost_Level: "",
          evolution_cost_Test: '2',
          effect: "",
          effect_test: '1',
          card_number: "",
          card_level: ""
        };
      }

		return (sendData_NEW(search_data))
	}
	//on_click_run_NEW()

	function sort_data(arr) {
		const types = ['디지타마', '디지몬', '테이머', '옵션'];
		return arr.sort((a, b) => {
			// type을 우선 비교합니다
			const typeA = types.indexOf(a.type);
			const typeB = types.indexOf(b.type);
			if (typeA < typeB) {
				return -1;
			} else if (typeA > typeB) {
				return 1;
			}
			// type이 같으면 level을 비교합니다
			if (a.level < b.level) {
				return -1;
			} else if (a.level > b.level) {
				return 1;
			}
			// level도 같으면 LOCAL_NUMBER를 비교합니다
			if (a.LOCAL_NUMBER < b.LOCAL_NUMBER) {
				return -1;
			} else if (a.LOCAL_NUMBER > b.LOCAL_NUMBER) {
				return 1;
			}
			// 모든 조건이 같으면 원래 순서를 유지합니다
			return 0;
		});
	}
	
	function change_deck(img_link, value, arg3) {
		max_card_number=4
        if (img_link=="https://i.imgur.com/276Me2d.png") {max_card_number=50}

		new_deck_ = []
		if (arg3 === undefined) { arg3 = true; }
		if (arg3 == false) { new_deck_ = view_deck }
		else { new_deck_ = new_deck }
		search_target=(now_mode=='deck')? new_deck : from_server_data
		result_val=0
		if (value > 0) {
			for (j = 0; j < value; j++) {
				from_server_data_ = search_target
				for (i of from_server_data_) {
					target = i.image_link
					if (target == img_link) {
						if (new_deck_.length == 0) {
							new_deck_.push(i);
							if (arg3 == true) { new_deck_[0]['count'] = 1; result_val=1;}
							card_type_list_update(); break;
						}
						else {
							check_ = false
							for (ii = 0; ii < new_deck_.length; ii++) {
								if (new_deck_[ii].image_link == img_link) {
									if (new_deck_[ii]['count']<max_card_number)
									{
										new_deck_[ii]['count'] = new_deck_[ii]['count'] + 1; result_val=new_deck_[ii]['count'];card_type_list_update(); check_ = true; break;
									}
									else
									{
										new_deck_[ii]['count'] = 0; result_val=0; card_type_list_update(); check_ = true; break;
									}
								}
							}
							if (check_ == false) {
								new_deck_.push(i);
								new_deck_[new_deck_.length - 1]['count'] = 1; result_val=1; card_type_list_update(); break;
							}
						}
					}
				}
			}
		}
		new_deck_ = sort_data(new_deck_);
		for (i=0; i<new_deck_.length;i++)
		{
			check_=false
			if (new_deck_[i].name.includes("(P)"))
			{
				find_origin_card=new_deck_[i].name.split("(P)")[0]
				console.log(find_origin_card)
				for (ii=0; ii<new_deck_.length;ii++)
				{
					if (new_deck_[ii].name==find_origin_card)
					{	
						check_=ii
						break
					}
				}
			}
			if (check_!=false)
			{
				backup_=new_deck_[i]
				new_deck_.splice(i, 1);
    			new_deck_.splice(check_+1, 0, backup_);
			}
		}
		return result_val
	}
	
	//////////////////////////////////////카드 관련 코드 모음//////////////////////////////////////
























	//////////////////////////////////////드로우 관련 코드 모음//////////////////////////////////////

	function draw_text(parentDiv,val,shadow)
	{	
		const countNumElements = parentDiv.querySelectorAll('.new-div');
		countNumElements.forEach((element) => {
		element.parentNode.removeChild(element);
		});

		let img = parentDiv.querySelector('img');

		parentDiv.style.position='relative'
		if (shadow!=undefined){parentDiv.style.position='absolute'}
		var shadowBox2= document.createElement('div');
		parentDiv.appendChild(shadowBox2)
		shadowBox2.className='new-div'
		shadowBox2.style.position = 'absolute';
		shadowBox2.style.left = img.offsetLeft+'px'
		shadowBox2.style.top =img.offsetTop+'px'
		if (shadow==undefined)
		{
			shadowBox2.style.transform = 'translate(280%, 350%)';
		}
		else
		{
			shadowBox2.style.transform = 'translate(280%, 328%)';
		}
		fsize=(img.offsetWidth /4.5)
		shadowBox2.style.fontSize=fsize+"px"
		shadowBox2.style.textAlign='center'
		shadowBox2.style.verticalAlign='bottom'
		if (val >= 10) {
			shadowBox2.textContent = val;
		} else {
			shadowBox2.textContent = "x" + val;
		}
		shadowBox2.style.background = 'rgb(0,0,0,0)';
		shadowBox2.style.zIndex = 15;

		
		if (shadow!=undefined){


			let img = parentDiv.querySelector('img');
			img.style.boxShadow='';
			img.style.margin
			img.style.marginLeft = '';
			img.style.marginRight = '';
			img.style.boxShadow = '';
			img.style.margin = ''; 

			// 검정색 div박스를 생성합니다.
			var shadowBox = document.createElement('div');
			parentDiv.appendChild(shadowBox)
			shadowBox.style.position = 'absolute';
			shadowBox.style.left = img.offsetLeft+'px'
			shadowBox.style.top =img.offsetTop+'px'
			shadowBox.style.width = img.offsetWidth  + 'px';
			shadowBox.style.height = img.offsetHeight + 'px';
			shadowBox.style.transform = 'translate(5%, 3%)';
			shadowBox.style.background = 'black';
			shadowBox.style.borderRadius='10px 10px 10px 10px'
			shadowBox.style.opacity = '0.5';
			shadowBox.style.zIndex = 2;
		}
	}

	function draw_canvas()
	{
		
		var contentDiv = document.querySelector('#content2');
		while (contentDiv.firstChild) {
		contentDiv.removeChild(contentDiv.firstChild);
		}
		imgdiv_arr=[]

		for (let i = 0; i < new_deck.length; i++) 
		{
			if (new_deck[i].count === 0) 
			{
				new_deck.splice(i, 1);
				i--;
			}
		}

		for (i of new_deck)
		{
			const div1 = document.createElement('div')
			div1.style.width = `${contentWidth / view_card_width * 1}px`;
			div1.style.height = `${contentWidth / view_card_width * 1.4}px`;
			
			const img = document.createElement('img');
			img.src = i.image_link;
			img.style.width = '93%';
			img.style.height = '93%';
			div1.appendChild(img);
			contentDiv.appendChild(div1);
			div1.id='card_div2'
			imgdiv_arr.push(div1)
			img.addEventListener('mousedown', function (event) 
			{
				const imgLink = this.src;
				val=change_deck(imgLink, 1);
				
				const parentDiv = this.parentNode;
				const countNumElements = parentDiv.querySelectorAll('.new-div');
				countNumElements.forEach((element) => {
				element.parentNode.removeChild(element);
				});
				if (val!=undefined && val!=0)
				{
					draw_text(parentDiv,val)
				}
				const element = this;
				element.classList.add('active');
				setTimeout(function(){element.classList.remove('active');},120)
			})

		}
		for (i=0; i<imgdiv_arr.length;i++)
		{	
			val=new_deck[i].count
			if (val!=undefined && val!=0)
			{
				draw_text(imgdiv_arr[i],val)
			}
		}
	}
	
	function card_position(width, height, canvasWidth, canvasHeight, number_, card_num) {
		const col = parseInt(canvasHeight / height);
		const row = parseInt(canvasWidth / width);
		let movemore_=0
		if (col!=1)
		{
			movemore_ = ((canvasWidth - (width * row)) / 2);
		}
		else
		{
			movemore_ = ((canvasWidth - (width * card_num)) / 2);
		}
		return [(((number_ % row)) * width) + movemore_, ((parseInt(number_ / row))) * height];
	}

	function calculateCardSize(canvasWidth, canvasHeight, cardCount) {
		const cardRatio = 1.4; // 카드의 가로 세로 비율 (고정)
		for (i = 1; i < 100; i++) {
			card_y = Math.floor((canvasHeight) / i)
			card_x = Math.floor(card_y / cardRatio)
			if (canvasWidth >= (card_x * (Math.ceil(cardCount / i)))) {
				now_card_row = (Math.ceil(cardCount / (i - 1)))
				if ((i > 1) && (canvasWidth >= (card_x * now_card_row))) {
					card_x +=  Math.floor((canvasWidth - (card_x * now_card_row)) / now_card_row)
					card_y = card_x * 1.4
				}
				return [card_x.toFixed(3), card_y.toFixed(3)]
			}
		}
	}

	function print_image()
	{
		var contentDiv = document.querySelector('#content2');

		original_x=contentDiv.style.width
		original_y=contentDiv.style.height
		xy=calculateCardSize(785-50,1100-50,new_deck.length)
		contentDiv.style.width='785px'
		contentDiv.style.height='1100px'
		contentDiv.style.backgroundImage='linear-gradient(to bottom, #575757, #1f1f1f)'
		var childDivs =(contentDiv.children);

		countNumElements = contentDiv.querySelectorAll('.new-div');
		countNumElements.forEach((element) => {
		element.parentNode.removeChild(element);
		});

		for (var i = 0; i < childDivs.length; i++) 
		{
			position_info=card_position(xy[0], xy[1], (785-50),(1100-50), i, childDivs.length)
			var childDiv = childDivs[i];

			childDiv.style.position='absolute'
			childDiv.style.left=(position_info[0]+25+'px')
			childDiv.style.top=(position_info[1]+25+'px')
			childDiv.style.width = xy[0] + 'px';
			childDiv.style.height = xy[1] + 'px';
		}

		for (i=0; i<childDivs.length;i++)
		{
			val=new_deck[i].count
			if (val!=undefined && val!=0)
			{
				draw_text(childDivs[i],val,'shadow')
			}
			/*img_=childDivs[i].querySelector('img')
			img_.style.width = '95%';
			img_.style.height = '95%';*/
		}
		const newDiv = document.createElement('div'); // 새로운 div 요소 생성
		newDiv.textContent = 'url.kr/jyctas'; // 텍스트 추가
		newDiv.style.position = 'absolute'; // 절대 위치 지정
		newDiv.style.top = 0; // 상단에 위치
		newDiv.style.left = '10px'; // 좌측에 위치
		newDiv.style.color = 'white'; // 텍스트 색상
		newDiv.style.fontWeight = 'bold'; // 폰트 굵기
		newDiv.style.fontSize = '20px'
		newDiv.style.textShadow = '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'; // 외곽선
		newDiv.style.zIndex=9999;

		contentDiv.insertBefore(newDiv, contentDiv.firstChild); // 새로운 div 요소를 contentDiv의 첫 번째 자식 요소로 추가

		html2canvas(contentDiv, { scale:1, useCORS: true }).then(canvas => {
		canvas.toBlob(blob => {
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'capture.png';
			a.click();
			URL.revokeObjectURL(url);
		});
		});
		
		
		contentDiv.removeChild(newDiv)
		contentDiv.style.width=original_x
		contentDiv.style.height=original_y
		contentDiv.style.backgroundImage='linear-gradient(to bottom, #d67e7e, #994b4b)'

		draw_canvas()
		var search_button = document.querySelector('#search_button');
		search_button.click()
	}


	//////////////////////////////////////드로우 관련 코드 모음//////////////////////////////////////
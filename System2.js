

	//////////////////////////////////////변수 초기화//////////////////////////////////////
	from_server_data = [];
	new_deck = [];
	view_deck = [];//뷰 모드 보기 용
	edit_deck = [];
	image_view_mode = false
	edit_deck_mode = false
	edit_page_num = 1;
	page_num = 1;
	Last_Message = "";
	Last_Message_JSON = {}
	card_type_list1 = ""
	card_type_list2 = ""
	card_type_list3 = 0
	image_view_type_=[]
	image_view_type_[0] = '기본 보기'
	image_view_type_[2] = false
	image_view_type_[3] = false
	image_view_type_[4] = 0.93
	image_view_type_[5] = true
	Cookie_deck_lst = listCookies()
	   image_view_type_[5] = false
	CARD_LIST=[ST01_02_03,ST04_05_06,ST07_08_09,ST10,ST12,ST13,ST14,ST15,ST16,ST17,  BT01_02_03,BT01_02_03_B,PER1,BT04,BT05,BT06,BT07,BT08,BT09,BT10,BT11,BT12,BT13,EX01,EX02,EX03,EX04]
	ALL_CARD_LIST=[ST01_02_03,ST04_05_06,ST07_08_09,ST10,ST12,ST13,ST14,ST15,ST16,ST17,  BT01_02_03,BT01_02_03_B,PER1,BT04,BT05,BT06,BT07,BT08,BT09,BT10,BT11,BT12,BT13,EX01,EX02,EX03,EX04].flat()
	const Out_of_LOCAL_NUMBER=999
	info_mode=false
	Check_request=false
	console.log(BT09)
	//////////////////////////////////////변수 초기화//////////////////////////////////////














	//////////////////////////////////////캔버스 초기화//////////////////////////////////////
	var canvas = document.getElementById("myCanvas");
	const ctx = canvas.getContext("2d");
	context = ctx;
	let isResizing = false; // 사이즈 변환 중 여부를 나타내는 변수
	let startX, startY; // 시작 위치를 저장하는 변수
	let startWidth, startHeight; // 시작 크기를 저장하는 변수
	
	function fill_background() {
		var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
		gradient.addColorStop(0, "#0B78B3");
		gradient.addColorStop(1, "#0E2E44");
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

	} fill_background();
	let lastX;
	let lastY;

	//////////////////////////////////////캔버스 초기화//////////////////////////////////////












	//////////////////////////////////////이벤트 리스너 모음//////////////////////////////////////
	window.onload = function () 
	{
		text=localStorage.getItem('Page_View_Setting');
		if (text!=undefined && text.length > 2) {
		const options = [
			{ id: 'one-cards-option', char: 'b', index: 0 },
			{ id: 'Padding-option', char: 'b', index: 1 },
			{ id: 'no-number-option', char: 'b', index: 2 },
			{ id: 'no-bottom1-option', char: 'b', index: 3 },
			{ id: 'no-bottom2-option', char: 'b', index: 4 },
			{ id: 'no-translate-option', char: 'b', index: 5 },
		];

		options.forEach(({ id, char, index }) => {
			const option = document.getElementById(id);
			option.checked = text.charAt(index) === char;
		});
		}		canvas_setting_change();

		const text3 = localStorage.getItem('LAST_deck_list');
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

		Set_Series();
		on_click_run_NEW();
	}

	window.onbeforeunload = function() {
		localStorage.setItem('LAST_deck_list', make_deck_list_string(new_deck))
		//setCookie('LAST_deck_list', make_deck_list_string(new_deck), 365)
	}

	function showResultMessage(message, divName) {
		// div 엘리먼트 찾기
		const targetDiv = document.getElementsByName(divName)[0];
		// div 크기와 위치 구하기
		const divRect = targetDiv.getBoundingClientRect();
		// 결과 메시지 엘리먼트 생성
		const messageEl = document.createElement('div');
		messageEl.style.position = 'absolute';
		messageEl.style.color = 'green';
		messageEl.style.backgroundColor = 'black';
		messageEl.style.top = `${divRect.top + window.scrollY + divRect.height / 2}px`;
		messageEl.style.left = `${divRect.left + window.scrollX + divRect.width / 2}px`;
		messageEl.style.transform = 'translate(-50%, -50%)';
		messageEl.style.textAlign = 'center';
		resultDiv = messageEl
		resultDiv.style.position = "fixed";
		resultDiv.style.background = "black";
		resultDiv.style.color = "green";
		resultDiv.style.fontSize = "60px";
		resultDiv.style.padding = "30px";
		resultDiv.style.borderRadius = "20px";
		resultDiv.innerText = message;
		// 결과 메시지를 body에 추가
		document.body.appendChild(messageEl);
		// 2초 후 결과 메시지 삭제
		setTimeout(() => {
			document.body.removeChild(messageEl);
		}, 800);
	}
	//다이얼로그 message

	canvas.addEventListener("mousedown", function (event) {
		if (event.button != 0) {return false}
		let rect = canvas.getBoundingClientRect();
		let x = event.clientX - rect.left;
		let y = event.clientY - rect.top;
		isResizing = true;
		lastX = event.clientX;
		lastY = event.clientY;
	});
	canvas.addEventListener("mousemove", function (event) {
		if (isResizing) {
			let deltaX = event.clientX - lastX;
			let deltaY = event.clientY - lastY;
			canvas.width += deltaX;
			canvas.height += deltaY;
			lastX = event.clientX;
			lastY = event.clientY;
		}
	});
	canvas.addEventListener("mouseup", function () {
		isResizing = false;
		fill_background()
		draw_canvas();
	});


		const allInputElements = [
	...document.querySelectorAll('#wrapper input'),
	...document.querySelectorAll('#wrapper2 input')
	];

	const allSelectElements = [
	...document.querySelectorAll('#wrapper select'),
	...document.querySelectorAll('#wrapper2 select')
	];

	allInputElements.forEach(input => {
	input.addEventListener('change', on_click_run_NEW);
	input.addEventListener('input', on_click_run_NEW);
	});

	allSelectElements.forEach(select => {
	select.addEventListener('change', on_click_run_NEW);
	});

	let resize_check = false;


	const clickableImages = document.querySelectorAll('.images_');
	const body = document.body;

	clickableImages.forEach(image => {
	image.addEventListener('mousedown', function (event) {
		if (event.button !== 0) {
		return false;
		}

		const span = this.parentNode.querySelector('span');
		const imgLink = this.src;
		const currentValue = parseInt(span.textContent);
        max_card_number=4
        if (imgLink=="https://i.imgur.com/276Me2d.png") {max_card_number=50}

		if (currentValue < max_card_number) {
		if ($("#view_mode_button").text() !== "뷰 모드 종료") {
			image_view_mode = false;
		}

		const newValue = currentValue + 1;
		change_deck(imgLink, 1);
		span.textContent = newValue.toString();
		} else {
		if (currentValue > (max_card_number-1)) {
			const newValue = 0;
			change_deck(imgLink, -1 * currentValue);
			span.textContent = newValue.toString();
		}
		}
	});

	image.addEventListener('mouseenter', function () {
		if (new_deck.length === 0 || $("#view_mode_button").text() === "뷰 모드 종료") {
		image_view_mode = true;
		view_deck = [];
		change_deck(this.src, 1, false);
		}

		image_src_ = this.src;
	});

	image.addEventListener('mouseleave', function () {
		if ($("#view_mode_button").text() !== "뷰 모드 종료" && image_view_mode && !info_mode) {
		image_view_mode = false;
		draw_canvas();
		}
	});
	});
	
	
	const spans = document.querySelectorAll('.favorite_styled');
	for (let i = 0; i < spans.length; i++) {
		spans[i].addEventListener('click', function () {
			img_link = this.parentNode.querySelector('img').src;
			const currentValue = parseInt(this.textContent);
            max_card_number=4

            if (img_link=="https://i.imgur.com/276Me2d.png") {max_card_number=50}

			let newValue = currentValue;

			if (currentValue < max_card_number) { newValue = max_card_number; change_deck(img_link, (max_card_number - currentValue)); }
			else { if (currentValue > 3) 
					{
						newValue = 0; change_deck(img_link, (-1 * currentValue)); 
					} 
				}
			this.textContent = newValue.toString();
		});
	}
	document.addEventListener("contextmenu", function(event)
	{
		const mapping = {
			'name__': '이름',
			'color__': '색상',
			'lavel__': 'LV',
			'type__': '타입',
			'attribute__': '속성',
			'dp__': 'DP',
			'DP__': 'DP',
			'cost__': '등장코스트',
			'evolution_cost__': '진화코스트',
			'effect__': '효과',
			'card_number__': '카드번호',
			'card_level__': '카드 등급'
		};
		const jsonDataDiv = document.getElementById('main_box3');
		json_={}
		if (event.target.tagName === "IMG") {
			event.preventDefault();
			src_=event.target.src
			
			for (let i of ALL_CARD_LIST) {
					if (i.image_link==src_)
					{
						jsonData =i; 	let jsonDataString = '';
						jsonDataString+="이름 : "+jsonData.name+"\n타입 : "+ jsonData.type+"\n"
						// JSON 데이터의 각 키와 값을 문자열로 추가
						for (let key in jsonData) {
							if (key == 'name' || key == 'type' || key == 'LOCAL_NUMBER' || key == 'image_link' || key=='count' ||
							key =='card_number' || key == 'card_level') {
								continue;
							}
							if (key == 'effect') {
								jsonDataString +="카드 번호  : "+jsonData.card_number+"\n카드 등급  : "+jsonData.card_level+"\n"
								jsonDataString += `\n효과 : \n ${(jsonData[key][0]).replace('"','')}\n`;
								jsonDataString += `\n진화원효과 : \n ${(jsonData[key][2]).replace('"','')}\n`;
								if (jsonData['type']=="디지타마"){continue;}
								jsonDataString += `\n시큐리티효과 : \n ${(jsonData[key][1]).replace('"','')}`;
								continue;
							}
							if (key == 'evolution_cost') {
								if ((jsonData['type']=="테이머") || (jsonData['type']=="옵션" || (jsonData['type']=="디지타마"))){continue;}
								if (jsonData[key][0]=="-"){continue;}
								jsonDataString += (`진화코스트 : ${jsonData[key][0]}`).replace("~", "에서");
								if (jsonData[key][1]!="-")
								{jsonDataString += (` 또는 ${jsonData[key][1]}`).replace("~", "에서");}
								jsonDataString+='\n'
								continue;
							}
							if (key == 'attribute') {
								if (jsonData['type']=="테이머" || jsonData['type']=="옵션"){continue;}
							}
							if (key == 'cost') {
								if (jsonData['type']=="디지타마"){continue;}
							}
							if (key == 'dp') {
								if (jsonData['type']=="테이머" || jsonData['type']=="옵션"){continue;}
							}
							jsonDataString += `${key}__ : ${jsonData[key]}\n`;
						}
						jsonDataString=jsonDataString.replace(/name__/g, '이름')
													.replace(/level__/g, 'LV   ')
													.replace(/card_LV/g,'카드 등급')
													.replace(/color__/g, '색상')
													.replace(/type__/g, '타입')
													.replace('  ', ' ')
													.replace('\n \n', '\n')
													.replace('\n \n', '\n')
													.replace('\n \n', '\n')
													.replace(/attribute__/g, '속성')
													.replace(/dp__/g, 'DP  ')
													.replace(/DP__/g, 'DP  ')
													.replace(/evolution_cost__/g, '진화코스트')
													.replace(/cost__/g, '등장코스트')
													.replace(/effect__/g, '효과')
													.replace(' - ','-')
													.replace(/시큐리티효과 :\s+(?:\n|\s)+카드번호/, '시큐리티효과:\n\n카드번호')
													/*.replace(/색상 : 적/g, '색상 : 레드')
													.replace(/색상 : 청/g, '색상 : 블루')
													.replace(/색상 : 녹/g, '색상 : 그린')
													.replace(/색상 : 자/g, '색상 : 퍼플')
													.replace(/색상 : 흑/g, '색상 : 블랙')
													.replace(/색상 : 백/g, '색상 : 화이트')
													.replace(/색상 : 황/g, '색상 : 옐로')*/
						jsonDataDiv.value = jsonDataString;
						//jsonDataDiv.innerText=''
						info_mode=true
						popup('main_box3')
						image_view_mode = true
						view_deck = []
						change_deck(event.target.src, (1), false)
						image_src_=event.target.src
						return true
					}
				}
		}

	});
	//////////////////////////////////////이벤트 리스너 모음//////////////////////////////////////
	

	//////////////////////////////////////카드 관련 코드 모음//////////////////////////////////////

	function Set_Series(tt=0) {
		const cardPackSelect = document.getElementById("card_pack");
		const type_ = cardPackSelect.value;
		console.log(type_)
		switch (type_) {
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '10':
			case '12':
			case '13':
			case '14':
			case '15':
			case '16':
			case '17':
				// inputNumber에서 50을 빼서 새로운 값을 만듭니다.
				console.log(type_)
				CARD_LIST = [ALL_CARD_LIST.filter(item => item.card_number.includes("ST" + type_))];
				break;

			case '50':
			CARD_LIST = [BT01_02_03];
			break;

			case '51':
			CARD_LIST = [BT01_02_03_B];
			break;

			case '53':
			case '54':
			case '55':
			case '56':
			case '57':
			case '58':
			case '59':
			case '60':
			case '61':
			case '62':
			case '63':
				let adjustedInputNumber = parseInt(type_) - 50;
				CARD_LIST = [ALL_CARD_LIST.filter(item => item.card_number.includes("BT" + adjustedInputNumber))];
				break;

			case '0':
			CARD_LIST = [ALL_CARD_LIST.filter(item => item.card_number.includes("P-") || item.card_number.includes("EX"))];
			break;

			case '990':
			CARD_LIST = [ALL_CARD_LIST.filter(item => item.card_number.includes("P-"))];
			break;

			case '991':
			CARD_LIST = [ALL_CARD_LIST.filter(item => item.card_number.includes("EX1"))];
			break;

			case '992':
			CARD_LIST = [ALL_CARD_LIST.filter(item => item.card_number.includes("EX2"))];
			break;

			case "out":
			CARD_LIST = [ST01_02_03, BT01_02_03, BT01_02_03_B,PER1];
			break;

			default:
			CARD_LIST = ALL_CARD_LIST;
			break;
		}

		on_click_run_NEW();
		}



		function pad(str) {
			str = str.toString();
			return str.length < 2 ? pad(" " + str, 2) : str;
		}

		function card_type_list_update() 
		{
			const digimons_lv = [0, 0, 0, 0, 0];
			let digitama_card_ = 0;
			let option_card_ = 0;
			let tamer_card_ = 0;
			let all_card_ = 0;
			
			for (const i of new_deck) {
				if (i.type === "디지몬") {
				digimons_lv[i.level - 3] += i.count;
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
		}

	function check_use_card_in_deck(imgsrc) {
		for (i = 0; i < new_deck.length; i++) {
			if ((new_deck[i].image_link) == imgsrc) {
				return (new_deck[i].count)
			}
		}
		return 0
	}
	function page_move(int_) {
		if (edit_deck_mode == false) {
			if (int_ == 1) {
				result_ = set_Page(from_server_data, (page_num + 1))
			}
			else if (int_ == -1) {
				result_ = set_Page(from_server_data, (page_num - 1))
			}
		}
		else {
			if (int_ == 1) {
				result_ = sendDatafrom_edit_deck((edit_page_num + 1))
				if (result_ == true) { edit_page_num += 1 }
			}
			else if (int_ == -1) {
				if (edit_page_num == 1) {showResultMessage("결과 없음", 'table_box'); return true}
				result_ = sendDatafrom_edit_deck((edit_page_num -= 1))
				//edit_page_num-=1
			}
		}
	}
	// 데이터베이스에서 불러와서 이미지 바꾸는 함수
	function image_change(from_server_data_) {
		const imageLinksArray = from_server_data_.map(i => i.image_link);
		const imgArr = $("._table tr").map(function () {
			return $(this).find("td img").toArray();
		}).toArray();
		
		for (let i = 0; i < imgArr.length; i++) {
			const imgElem = $(imgArr[i]);
			const friends = imgElem.parent().children();
			const imgSrc = imageLinksArray[i + ((1 - 1) * 21)];

			if (!imgSrc) {
			imgElem.hide();
			friends.css('visibility', 'hidden');
			continue;
			}

			imgElem.attr('src', imgSrc);
			imgElem.show();
			friends.css('visibility', 'visible');
			const how_many_use = check_use_card_in_deck(imgSrc);
			imgElem.parent().find('span').text(how_many_use);
		}
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
	
	function set_Page(from_server_data_a, new_page_num) {
		const start__ = (new_page_num - 1) * 21;
		const end__ = start__ + 21;
		const newArr = from_server_data_a.slice(start__, end__);
		if (newArr.length == 0) { showResultMessage("결과 없음", 'table_box'); return false }
		page_num = new_page_num;
		image_change(newArr);
	}


	function sendData_NEW(post_message2, new_page_num, deck_edit_mode) {
		const arr = (deck_edit_mode || CARD_LIST.flat())
			.filter((card) => checkJsonDataMatch(post_message2, card));
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
			showResultMessage("결과 없음", 'table_box');
		} else {
			set_Page(arr, new_page_num);
			page_num = new_page_num;
			from_server_data = from_server_data_a;
		}
	}
	
	function sendDatafrom_edit_deck(new_page_num) {
		var start_index = (new_page_num - 1) * 21;
		var end_index = start_index + 21;
		var extracted_array = edit_deck.slice(start_index, end_index);
		if (extracted_array.length != 0) { image_change(extracted_array); return true }
		else {
			showResultMessage("결과 없음", 'table_box');
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

	function on_click_run_NEW() { // 검색 시작
		const iff_NEW = {
			name: $("#name").val().toUpperCase(),
			type: $("#type_").val() === "-" ? "" : $("#type_").val(),
			color: $("#color").val() === "-" ? "" : $("#color").val(),
			level: [$("#level").val(),$("#level_test").val()],
			attribute: $("#attribute").val() === "" ? "" : $("#attribute").val(),
			dp: [$("#dp").val(),$("#dp_test").val()],
			cost: [$("#appearanceCost").val(),$("#appearanceCost_test").val()],
			evolution_cost: $("#evoCost").val() === "-" ? "-" : $("#evoCost").val(),
			evolution_cost_Level: $("#evoLevel").val() === "-" ? "" : $("#evoLevel").val(),
			evolution_cost_Test: $("#evoCost_test").val() === "-" ? "" : $("#evoCost_test").val(),
			effect: $("#effect").val().toUpperCase() === "" ? "" : $("#effect").val().toUpperCase(),
			effect_test: $("#effect_test").val(),
			card_number: $("#cardNumber").val().toUpperCase() === "" ? "" : $("#cardNumber").val().toUpperCase(),
			card_level: $("#card_level").val() === "-" ? "" : $("#card_level").val()
		};

		page_num = 1;
		Last_Message_JSON = iff_NEW;

		if ($('[name="click_decksetting_btn"]').text() === "덱 편집종료") {
			sendData_NEW(iff_NEW, page_num, new_deck);
		} else {
			sendData_NEW(iff_NEW, page_num);
		}
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
		new_deck_ = []
		if (arg3 === undefined) { arg3 = true; }
		if (arg3 == false) { new_deck_ = view_deck }
		else { new_deck_ = new_deck }
		
		if (value > 0) {
			for (j = 0; j < value; j++) {
				if (edit_deck_mode == true) { from_server_data_ = edit_deck; }
				else { from_server_data_ = from_server_data }
				for (i of from_server_data_) {
					target = i.image_link
					if (target == img_link) {
						if (new_deck_.length == 0) {
							new_deck_.push(i);
							if (arg3 == true) { new_deck_[0]['count'] = 1; }
							card_type_list_update(); break;
						}
						else {
							check_ = false
							for (ii = 0; ii < new_deck_.length; ii++) {
								if (new_deck_[ii].image_link == img_link) {
									new_deck_[ii]['count'] = new_deck_[ii]['count'] + 1; card_type_list_update(); check_ = true; break;
								}
							}
							if (check_ == false) {
								new_deck_.push(i);
								new_deck_[new_deck_.length - 1]['count'] = 1; card_type_list_update(); break;
							}
						}
					}
				}
			}
		}
		else if (value < 0) {
			for (j = 0; j < (value * -1); j++) {
				for (i = 0; i < new_deck_.length; i++) {
					if (new_deck_[i].image_link == img_link) {
						if (new_deck_[i]['count'] == 1) {
							new_deck_.splice(i, 1); card_type_list_update(); break;
						}
						else {
							new_deck_[i]['count'] = new_deck_[i]['count'] - 1; card_type_list_update(); break;
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
				find_origin_card_number=new_deck_[i].card_number.split("P")[0]
				for (ii=0; ii<new_deck_.length;ii++)
				{
					if (new_deck_[ii].name==find_origin_card && new_deck_[ii].card_number==find_origin_card_number)
					{	
						check_=ii+1
						break
					}
				}
			}
			if (check_!=false)
			{
				check_=check_-1
					backup_=new_deck_[i]
					new_deck_.splice(i, 1);
					new_deck_.splice(check_+1, 0, backup_);
			}
		}
		draw_canvas();
	}
	
	//////////////////////////////////////카드 관련 코드 모음//////////////////////////////////////







	















	

	///////////////////////draw_canvas 관련함수///////////////////



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
	
	function non_text_convert(arr) {
		arr2 = []
		for (i of arr) {
			for (ii = 0; ii < i.count; ii++) {
				arr2.push(JSON.parse(JSON.stringify(i)))
				arr2[arr2.length - 1].count = 1
			}
		}
		return arr2
	}
	

	function getNewDeck() {
		if (image_view_mode) {	return view_deck;	}
		if (image_view_type_[0] === '낱장 보기') {return non_text_convert(new_deck);	}
		return new_deck;
	}

	function draw_canvas() {
		 _new_deck_ = getNewDeck();
		let loadedCount = 0; // 로딩된 이미지 수

		if (_new_deck_.length==0){draw_canvas2(_new_deck_); return false}
		// 이미지 로딩이 완료될 때마다 호출되는 함수
		const imageLoaded = () => {
			loadedCount++;
			// 모든 이미지가 로딩된 경우
			if (loadedCount >= _new_deck_.length) { draw_canvas2(_new_deck_);	}
		};

		// 모든 이미지를 로드하기 위한 반복문
		for (const card of _new_deck_) {
			const image = new Image();
			image.onload = imageLoaded; // 이미지 로드 완료 이벤트 핸들러 지정
			image.onerror = () => console.error(`Failed to load image: ${image.src}`);
			image.src = card.image_link; // 이미지 주소 설정
		}
	}

	function getColor(color) {
		switch (color) {
			case "적":
				return "rgba(230,0,43,1)";
			case "청":
				return "rgba(1,152,227,1)";
			case "백":
				return "white";
			case "황":
				return "rgba(250,223,0,1)";
			case "흑":
				return "rgba(32,24,20,1)";
			case "자":
				return "rgba(102,89,167,1)";
			case "녹":
				return "rgba(0,152,104,1)";
			default:
				return "black";
		}
	}
	function drawTextInBox(ctx, text, boxX, boxY, boxWidth, boxHeight, imageSize, fontHeight, boxColor, fontColor) 
	{
		ctx.fillStyle = boxColor;
		ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
		ctx.fillStyle = fontColor || (boxColor === 'white' || boxColor === 'rgba(250,223,0,1)') ? 'black' : '#ffffff';
		use_stroke=false
		if (boxColor=="rgba(0,0,0,0.5)") {use_stroke=true; ctx.lineWidth = 5; ctx.strokeStyle = "rgba(0,0,0,1)";}
		ctx.font = 'bold ' + fontHeight * 0.35 + 'px Arial';

		const lineHeight = fontHeight * 0.41;
		let x = boxX + 10;
		let y = boxY + fontHeight * 0.4;
		const lines = text.split('\n');

		for (let i = 0; i < lines.length; i++) 
		{
			const words = lines[i].split(' ');
			let line = '';

			for (let j = 0; j < words.length; j++) {
				const testLine = line + words[j] + ' ';
				const metrics = ctx.measureText(testLine);
				const testWidth = metrics.width;

				if (testWidth > boxWidth - 20 && j > 0) 
				{
					if (use_stroke==true) {ctx.strokeText(line,x,y)}
					ctx.fillText(line, x, y);
					line = words[j] + ' ';
					y += lineHeight;
				} else {line = testLine;}

				if (line.indexOf('\n') !== -1) 
				{
					const linesAfterBreak = line.split('\n');

					for (let k = 0; k < linesAfterBreak.length; k++) 
					{
						if (use_stroke==true) {ctx.strokeText(line,x,y)}
						ctx.fillText(linesAfterBreak[k], x, y);
						y += lineHeight;
					}
					line = '';
				}
			}
			if (use_stroke==true) {ctx.strokeText(line,x,y)}
			ctx.fillText(line, x, y);
			y += lineHeight;
		}
	}
	function calculateBoxParams(image_Xstart, image_Ystart, imageSize, x, y, height, width, fontScale) {
		return {
			boxX: image_Xstart + (imageSize.width * x),
			boxY: image_Ystart + (imageSize.height * y),
			boxHeight: imageSize.height * height,
			boxWidth: imageSize.width * width,
			fontHeight: (imageSize.height) * 0.065 * fontScale // 상자의 높이에 맞게 계산합니다
		}
	}
	function draw_canvas2(_new_deck_) 
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		fill_background();
		var xx = canvas.width
		var yy = canvas.height-45
		var size_info = calculateCardSize(xx, yy, _new_deck_.length)

		var	padding__=(image_view_mode) ? 1 : image_view_type_[4]
		var width__=(size_info[0] - 5) *padding__
		var height__=(size_info[1] - 5) *padding__
		var	padding__shadow=width__*0.03

		const imageSize = {
			width: width__,
			height: height__,
		}
		for (ii = 0; ii < _new_deck_.length; ii++)
		{
			position_info = card_position(size_info[0], size_info[1], xx, yy, ii, _new_deck_.length);

			let image = new Image();
			image.src = _new_deck_[ii].image_link
			image_Xstart = position_info[0] + ((size_info[0]-width__)/2)
			image_Ystart = position_info[1] + ((size_info[1]-height__)/2)
			if (padding__!=1)
			{
				context.fillStyle = "rgba(0, 0, 0, 0.5)";
				context.fillRect((image_Xstart)+padding__shadow, (image_Ystart)+padding__shadow, imageSize.width, imageSize.height);
			}

			ctx.drawImage(image, image_Xstart, image_Ystart, imageSize.width, imageSize.height);
			aa=_new_deck_[ii].card_number
			if (false && image_view_type_[5]==true && _new_deck_[ii].LOCAL_NUMBER>Out_of_LOCAL_NUMBER) //image_view_type_[5] == 번역여부
			{
				block_color=getColor(_new_deck_[ii].color)
				context.fillStyle = block_color;

				switch (_new_deck_[ii].type) {
				case "디지타마":
					context.fillRect((image_Xstart)+(imageSize.width*0.26), (image_Ystart)+(imageSize.height*0.752), imageSize.width*0.52, imageSize.height*0.055);
					context.fillStyle = _new_deck_[ii].color === "황" || _new_deck_[ii].color === "백" ? "black" : "white";

					var fontHeight = (imageSize.height) * 0.055 * 0.8; // 상자의 높이에 맞게 계산합니다
					context.font = "bold " + fontHeight + "px sans-serif"; // 글꼴 크기 설정
					var textWidth = context.measureText(_new_deck_[ii].name).width;
					var textX = (image_Xstart + (imageSize.width * 0.265*1.003)) ; // x 좌표
					var textY = image_Ystart + (imageSize.height * 0.752*1.003) + fontHeight; // y 좌표

					context.fillText(_new_deck_[ii].name, textX+(((imageSize.width*0.55)-textWidth)/2), textY);
					
					box1=calculateBoxParams(image_Xstart, image_Ystart, imageSize, 0.22, 0.839, 0.125, 0.685, 0.8*1.1);
					drawTextInBox(context, _new_deck_[ii].effect[2], box1.boxX, box1.boxY, box1.boxWidth, box1.boxHeight, imageSize, box1.fontHeight, block_color);
					break;

				case "디지몬":
					H_value= (_new_deck_[ii].level>=6 && (_new_deck_[ii].effect[2].length<6)) ? 0.893 : 0.784
					context.fillRect((image_Xstart)+(imageSize.width*0.26), (image_Ystart)+(imageSize.height*H_value), imageSize.width*0.52, imageSize.height*0.055);
					context.fillStyle= (_new_deck_[ii].color=="황" || _new_deck_[ii].color=="백" )? "black" : "white"
					
					var fontHeight = (imageSize.height) * 0.055 * 0.8; // 상자의 높이에 맞게 계산합니다
					context.font = "bold " + fontHeight + "px sans-serif"; // 글꼴 크기 설정
					var textWidth = context.measureText(_new_deck_[ii].name).width;
					var textX = (image_Xstart + (imageSize.width * 0.265*1.003)) ; // x 좌표
					var textY = image_Ystart + (imageSize.height * H_value*1.003) + fontHeight; // y 좌표

					context.fillText(_new_deck_[ii].name, textX+(((imageSize.width*0.55)-textWidth)/2), textY);

					if (_new_deck_[ii].level<6) 
					{
						if (_new_deck_[ii].effect[0].length > 5)
						{
							box1=calculateBoxParams(image_Xstart, image_Ystart, imageSize, 0.075, 0.59, 0.17, 0.85, 0.9);
							drawTextInBox(context, _new_deck_[ii].effect[0], box1.boxX, box1.boxY, box1.boxWidth, box1.boxHeight, imageSize, box1.fontHeight, "rgba(0,0,0,0.5)");
						}

						box1=calculateBoxParams(image_Xstart, image_Ystart, imageSize, 0.25, 0.87, 0.125, 0.685, 0.8*1.1);
						drawTextInBox(context, _new_deck_[ii].effect[2], box1.boxX, box1.boxY, box1.boxWidth, box1.boxHeight, imageSize, box1.fontHeight, block_color);
					}
					else 
					{
						correction_value = (_new_deck_[ii].effect[2].length>6) ? 0.6 : 0.7    // 만약 진화원이 있으면 보정해야함
						if (_new_deck_[ii].effect[0].length > 5)
						{
							box1=calculateBoxParams(image_Xstart, image_Ystart, imageSize, 0.075, correction_value, 0.17, 0.85, 0.9);
							drawTextInBox(context, _new_deck_[ii].effect[0], box1.boxX, box1.boxY, box1.boxWidth, box1.boxHeight, imageSize, box1.fontHeight, "rgba(0,0,0,0.5)");
						}
							
						if (_new_deck_[ii].effect[2].length>6)
						{
							box1=calculateBoxParams(image_Xstart, image_Ystart, imageSize, 0.25, 0.87, 0.125, 0.685, 0.8*1.1);
							drawTextInBox(context, _new_deck_[ii].effect[2], box1.boxX, box1.boxY, box1.boxWidth, box1.boxHeight, imageSize, box1.fontHeight, block_color);
						}
					}
					break;

				case "테이머":
					context.fillRect((image_Xstart)+(imageSize.width*0.225), (image_Ystart)+(imageSize.height*0.750), imageSize.width*0.55, imageSize.height*0.065);
					context.fillStyle= (_new_deck_[ii].color=="황" || _new_deck_[ii].color=="백" )? "black" : "white"

					var fontHeight = (imageSize.height) * 0.065 * 0.8; // 상자의 높이에 맞게 계산합니다
					context.font = "bold " + fontHeight + "px sans-serif"; // 글꼴 크기 설정
					var textWidth = context.measureText(_new_deck_[ii].name).width;
					var textX = (image_Xstart + (imageSize.width * 0.225*1.003)) ; // x 좌표
					var textY = image_Ystart + (imageSize.height * 0.750*1.003) + fontHeight; // y 좌표

					context.fillText(_new_deck_[ii].name, textX+(((imageSize.width*0.55)-textWidth)/2), textY);
					
					box1=calculateBoxParams(image_Xstart, image_Ystart, imageSize, 0.0755, 0.548, 0.18, 0.85, 0.8);
					drawTextInBox(context, _new_deck_[ii].effect[0], box1.boxX, box1.boxY, box1.boxWidth, box1.boxHeight, imageSize, box1.fontHeight, "rgba(0,0,0,0.5)");
					
					box1=calculateBoxParams(image_Xstart, image_Ystart, imageSize, 0.22, 0.839, 0.125, 0.7, 0.8*1.1);
					drawTextInBox(context, _new_deck_[ii].effect[1], box1.boxX, box1.boxY, box1.boxWidth, box1.boxHeight, imageSize, box1.fontHeight, block_color);

					break;

				case "옵션":
					context.fillRect((image_Xstart)+(imageSize.width*0.075), (image_Ystart)+(imageSize.height*0.752), imageSize.width*0.85, imageSize.height*0.065);
					context.fillStyle= (_new_deck_[ii].color=="황" || _new_deck_[ii].color=="백" )? "black" : "white"

					var fontHeight = (imageSize.height) * 0.065 * 0.8; // 상자의 높이에 맞게 계산합니다
					context.font = "bold " + fontHeight + "px sans-serif"; // 글꼴 크기 설정	
					var textWidth = context.measureText(_new_deck_[ii].name).width;
					var textX = (image_Xstart + (imageSize.width * 0.225*1.003)) ; // x 좌표
					var textY = image_Ystart + (imageSize.height * 0.752*1.003) + fontHeight; // y 좌표

					context.fillText(_new_deck_[ii].name, textX+(((imageSize.width*0.55)-textWidth)/2), textY);

					context.fillStyle= (_new_deck_[ii].color=="황" || _new_deck_[ii].color=="백" )? "black" : "white"

					let text__=_new_deck_[ii].card_number+" "+_new_deck_[ii].card_level
					context.font = "bold " + (fontHeight * 0.35) + "px sans-serif"; // 글꼴 크기 설정
					var textWidth_ = context.measureText(text__).width;
					var textX_ = (image_Xstart)+(imageSize.width*0.075) + (imageSize.width*0.85) - textWidth_
					var textY_ = (image_Ystart)+(imageSize.height*0.752);

					context.textBaseline = "top";
					context.fillText(text__, textX_, textY_);     // 카드번호
					context.textBaseline = "alphabetic";
					
					box1=calculateBoxParams(image_Xstart, image_Ystart, imageSize, 0.075, 0.548, 0.18, 0.85, 1);
					drawTextInBox(context, _new_deck_[ii].effect[0], box1.boxX, box1.boxY, box1.boxWidth, box1.boxHeight, imageSize, box1.fontHeight, "rgb(230,230,230,0.9)","black");
					
					box1=calculateBoxParams(image_Xstart, image_Ystart, imageSize, 0.22, 0.839, 0.125, 0.7, 0.8*1.1);
					drawTextInBox(context, _new_deck_[ii].effect[1], box1.boxX, box1.boxY, box1.boxWidth, box1.boxHeight, imageSize, box1.fontHeight, block_color);

					break;
				default:
					// 위의 모든 case에 해당하지 않을 때 실행할 코드
					break;
				}
			}

			if (image_view_type_[0] == '기본 보기' && (image_view_type_[1]!='no_number') && image_view_mode==false)   // 카드 갯수만큼 숫자 표시
			{
				const boxHeight = imageSize.height * 0.22;
				ctx.font = boxHeight + "px bold sans-serif";
				text__="x"+(_new_deck_[ii].count)
				const textWidth1 = ctx.measureText(text__).width;
				ctx.strokeStyle = "black";
				ctx.fillStyle = "white";
				ctx.lineWidth = 7; // 선의 굵기 설정
				ctx.lineJoin="round"
				ctx.lineCap="round"
				textHeight = parseInt(ctx.font);
				ctx.strokeText(text__, position_info[0] + imageSize.width - textWidth1 - (textWidth1*0.2), position_info[1] + (imageSize.height / 1))
				ctx.fillText(text__, position_info[0] + imageSize.width - textWidth1 - (textWidth1*0.2), position_info[1] + (imageSize.height / 1))
			}
		}
		
		var boxHeight = canvas.height-yy;
		context.fillStyle = "rgba(0, 0, 0, 0.2)";
		context.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);
		context.fillStyle = "#fff";
		context.font = boxHeight * 0.8 + "px Arial";

		if ((new_deck.length > 0) && $("button[name='view_mode_button']").text() != '뷰 모드 종료') {
			if (image_view_mode == false)
			{
				textWidth=0
				if (image_view_type_[3] !== 'no_bottom2') 
				{
					var text = "" + card_type_list3 + "Cards";
					textWidth = context.measureText(text).width;
					if (textWidth + 10 < canvas.width) 
					{
						context.fillText(text, canvas.width - textWidth - 10, canvas.height - boxHeight / 2 + boxHeight * 0.3);
					}
				}
				if (image_view_type_[2] != 'no_bottom1') 
				{
					context.font = boxHeight * 0.4 + "px Arial";
					var textWidth1 = context.measureText(card_type_list1).width;
					var textWidth2 = context.measureText(card_type_list2).width;
					context.font = boxHeight * 0.4 + "px Arial";
					if (textWidth1 + (textWidth * 1.25) < canvas.width) 
					{
						context.fillText(card_type_list1, canvas.width - textWidth1 - (textWidth * 1.25), canvas.height - boxHeight / 2 + boxHeight * 0);
						context.fillText(card_type_list2, canvas.width - textWidth2 - textWidth * 1.25, canvas.height - boxHeight / 2 + boxHeight * 0.4);
					}
				}
			}
		}
		else if((image_view_mode == true) || new_deck.length==0)
		{
			var text ="뷰 모드(V)";
			var textWidth = context.measureText(text).width;
			if ((textWidth + (10)) < canvas.width) {
				context.fillText(text, canvas.width - textWidth - 10, canvas.height - boxHeight / 2 + boxHeight * 0.3);
			}
		}

		// 텍스트 스타일 설정
		var boxHeight = (canvas.height - yy) * 0.9;
		var fontSize = boxHeight / 2;
		ctx.font = 'bold ' + fontSize + 'px Arial';

		// 상자에 넣을 텍스트와 너비 계산
		var text = 'url.kr/jyctas';
		var textWidth = ctx.measureText(text).width * 0.9;

		// 상자의 x 좌표 계산
		var x = canvas.width - textWidth - fontSize;

		// 상자에 텍스트 써넣기
		var y = 0 + boxHeight / 2;
		ctx.fillStyle = "rgba(255,255,255, 1)";
		ctx.lineWidth = 3;
		ctx.strokeStyle = "rgba(0,0,0, 1)";
		ctx.strokeText(text, 8, y);
		ctx.fillText(text, 8, y);
		
	}
	
	
	///////////////////////draw_canvas 관련함수///////////////////
	

	




	
	///////////////////////버튼 관련함수///////////////////

	function popup(type_) 
	{

		// 필요한 변수들을 초기화
		const newDiv = document.getElementById("window3");
		const newDiv2 = document.getElementById("window4");
		const win2 = document.querySelector("[name='win1']");
		let target = document.getElementById(type_);

		// 이미 선택한 요소가 포함되어 있으면 화면에 표시하지 않고 반환
		if (newDiv.contains(target)) {
			win2.appendChild(target);
			newDiv.style.display = 'none';
			newDiv2.style.display = 'none';
			return false;
		}

		// newDiv에 있는 하위노드들 중 button이 아닌 노드들은 win2로 옮김
		const childNodes = Array.from(newDiv.childNodes);
		childNodes.forEach(node => {
			if (node.nodeName !== 'BUTTON') {
				win2.appendChild(node);
			}
		});

		// newDiv에 있는 하위노드들 중 button이 아닌 노드들을 삭제
		const divs = newDiv.querySelectorAll('div');
		const filteredDivs = Array.from(divs).filter(div => div.nodeName !== 'BUTTON');
		filteredDivs.forEach(div => div.remove());

		// 덱 리스트와 텍스트 영역 초기화
		update_cookie_deck_list();
		const textarea_ = document.getElementById('input-select');
		textarea_.value = "";
		textarea_.value = make_deck_list_string(new_deck, "name");

		// 선택한 요소를 newDiv에 추가하여 화면에 표시
		const main_box_ = document.getElementById(type_);
		newDiv.appendChild(main_box_);
		newDiv.style.display = 'block';
		newDiv2.style.display = 'block';
	}


	function deck_reset() {
		if (confirm("덱 안의 카드들이 전부 삭제됩니다?")==false){return false}
		new_deck = []
		card_type_list_update()
		draw_canvas();
		const spans = document.querySelectorAll("span.favorite_styled");
		spans.forEach((span) => {
			span.textContent = "0";
		});
	}
	
	function search_Reset() {
		$("#name").val("")
		$("#type_").val('-').prop("selected", true);
		$("#color").val('-').prop("selected", true);
		$("#level").val('-').prop("selected", true);
		$("#level_test").val(2).prop("selected", true);
		$("#attribute").val("")
		$("#dp").val('-').prop("selected", true);
		$("#dp_test").val(2).prop("selected", true);
		$("#appearanceCost").val('-').prop("selected", true);
		$("#appearanceCost_test").val(2).prop("selected", true);
		$("#evoLevel").val('-').prop("selected", true);
		$("#evoCost").val('-').prop("selected", true);
		$("#evoCost_test").val(2).prop("selected", true);
		$("#effect").val("")
		document.getElementById("effect_text").textContent="효과"; 
		$("#effect_test").val(1).prop("selected", true);
		$("#cardNumber").val("")
		$("#card_level").val('-').prop("selected", true);
		$("#card_pack").val('-').prop("selected", true);
		Set_Series()
	}
	
	function view_mode() {
		button__ = $("#view_mode_button")
		if (button__.text() == '뷰 모드(V)') {
			button__.text('뷰 모드 종료')
			button__.css("background-color", "red");
		}
		else {
			image_view_mode = false;
			button__.text('뷰 모드(V)')
			button__.css("background-color", "#80333341");
			draw_canvas()
		}
	}

	function deck_resetting() {
		button__ = $('[name="click_decksetting_btn"]')
		if ((button__.text())=='덱 편집하기') {
			if (new_deck.length == 0) { showResultMessage('덱에 카드가 한장도 없습니다', 'table_box'); return false }
			edit_page_num = 1
			edit_deck_mode = true
			edit_deck = JSON.parse(JSON.stringify(new_deck));
			console.log(new_deck)
			button__.text('덱 편집종료')
			button__.css("background-color", "red");
			on_click_run_NEW()
		}
		else {
			edit_deck_mode = false
			edit_deck = []
			image_change(from_server_data)
			button__.text('덱 편집하기')
			button__.css("background-color", "#33806f41");
			on_click_run_NEW()
		}
	}

	
	
	function new_popup_create()
	{
	// name 속성이 "table_box"인 테이블 요소 가져오기
	tableBox = document.getElementsByName("table_box")[0];
	tableBox4 = document.getElementsByName("click_image_btn44")[0];
	tableRect4 = tableBox4.getBoundingClientRect(); // 테이블 엘리먼트의 위치 정보 가져오기
	// 테이블 가로 길이의 절반 크기를 가진 div 엘리먼트 생성
	halfWidth = tableBox.offsetWidth / 2;
	newDiv = document.createElement("div");
	newDiv.id = "window3"; // 스타일을 적용하기 위한 id 속성 설정

	// 새 div 요소를 body 요소의 마지막 자식으로 추가
	document.body.appendChild(newDiv);
	tableRect = tableBox.getBoundingClientRect();
	tableDiv = document.createElement("div");
	tableDiv.style.width = tableRect.width + "px";
	tableDiv.style.height = tableRect4.bottom + "px";
	tableDiv.id='window4'
	tableDiv.style.position = "absolute"; // position 속성 추가
	tableDiv.style.left = tableRect.left + "px"; // left 속성을 이용해 위치 조절
	tableDiv.style.top = tableRect.top + "px"; // top 속성을 이용해 위치 조절
	document.body.appendChild(tableDiv);

	// 새 div 엘리먼트 위치 설정
	tableRect = tableBox.getBoundingClientRect(); // 테이블 엘리먼트의 위치 정보 가져오기

	newDiv.style.left = tableRect.left + halfWidth+ "px";
	newDiv.style.top = (tableRect.top) + "px";
	newDiv.style.width = halfWidth + "px";
	newDiv.style.height = ((tableRect4.bottom)) + "px";
	newDiv.style.display = "none";

	function close_popup() {
		
		newDiv = document.getElementById("window3")
		newDiv2 = document.getElementById("window4")
		const win2 = document.querySelector("[name='win1']");

		const childNodes = Array.from(newDiv.childNodes);
		childNodes.forEach(node => {
		if (node.nodeName !== 'BUTTON') {
			win2.appendChild(node);
		}
		});

		// newDiv에 있는 하위노드들 중 button이 아닌 노드들 삭제
		const divs = newDiv.querySelectorAll('div');
		const filteredDivs = Array.from(divs).filter(div => div.nodeName !== 'BUTTON');
		filteredDivs.forEach(div => div.remove());

		newDiv.style.display='none'
		newDiv2.style.display='none';
		
		info_mode=false
		image_view_mode = false;
		draw_canvas()
	}

	tableDiv.addEventListener("mousedown", close_popup);

	}
	new_popup_create()





	toggleButton = document.getElementById("toggleButton");

	toggleButton.addEventListener("click", () => {
		document.body.classList.toggle("show-sidebar");
		if (Check_request==false) {load_request_()} //load_request_()
		Check_request=true
	});
	toggleButton = document.getElementById("toggleButton2");

	toggleButton.addEventListener("click", () => {
		Check_request=true
		document.body.classList.toggle("show-sidebar");
	});

	
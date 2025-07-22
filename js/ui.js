let _scrollTop = 0,
	saveScrollTop = 0,
	_wrapper,
	_header,
	_content,
	_docker,
  popIdx = 999,
  stickyEl,
  showSticky = true,
  gallerySwiper;


$(window).on('load', function() {
})

$(window).on('resize', function(e){
});

$(window).ready(function(){
    // 전역변수 재선언
	_wrapper = $('.wrapper');
	_header = $('.header-wrap');
	_content = $('.content-wrap');
	_scrollTop = _content.scrollTop();
  stickyEl =  $('.sticky-my-info');
  if(stickyEl.hasClass('none')) showSticky = false;

	// function 실행
  setVH();
  setDialog();
  btnToastActive();
  setFold();
  setCopyText();
  setGalleryMore();
  setAudioControl();
  setGallerySwiper();
  
  _content.on('scroll', function(e){
    // 전역변수 재선언
    _scrollTop = _content.scrollTop();
    
    // AOS 리프레시 (스크롤 시 위치 재계산)
    if(typeof AOS !== 'undefined') {
        AOS.refresh();
    }

  });
});

$(window).on('resize', function(e){
  setVH();
});

// AOS 초기화를 DOM 로드 완료 후 실행
$(window).on('load', function() {
  setVH();

  AOS.init({
      offset: 100,
      delay: 0,
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: false,
      anchorPlacement: 'top-bottom',
      // 스크롤 컨테이너 지정
      container: '.content-wrap'
  });
  
  // AOS 리프레시 (스크롤 위치 재계산)
  setTimeout(function() {
      AOS.refresh();
  }, 100);
  
  // 추가 안전장치: 수동으로 AOS 요소들 체크
  setTimeout(function() {
      checkAOSElements();
  }, 500);

});

// AOS 요소들이 제대로 작동하는지 확인하는 함수
function checkAOSElements() {
    $('[data-aos]').each(function() {
        var $element = $(this);
        var offset = $element.offset();
        var scrollTop = $('.content-wrap').scrollTop();
        var windowHeight = $('.content-wrap').height();
        
        // 요소가 뷰포트에 들어왔는지 확인
        if (offset && offset.top <= scrollTop + windowHeight - 100) {
            $element.addClass('aos-animate');
        }
    });
}

// vh 재설정 
function setVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// layerpopup on,off
function setDialog(){
	$('button[data-pop-tg]').on('click', function(){
		let popEl = $('#' + $(this).data('pop-tg'));

		dialogOpen(popEl, $(this));
	});

	$('[data-pop-close]').add('.pop-header .btn-close').add('.popup-bg').on('click', function(){
		dialogClose($(this))
	});
}

// 팝업 열림 처리
function dialogOpen(el, tg){
	el.addClass('active');
  $('body').addClass('pop-open');
  ++popIdx;
  el.css('z-index', popIdx);

  $('.popup-wrap').removeClass('lastest');

  $('.popup-wrap.active').each(function(el){
    if(popIdx === parseInt($(this).css('z-index'))){
      $(this).addClass('lastest')
    }
  });

  gallerySwiper.slideTo(tg.closest('li').index(), 0);
  console.log('?')
}

// 팝업 닫힘 처리
function dialogClose(tg){
  tg.parents('.popup-wrap').removeClass('active lastest').removeAttr('style');

  --popIdx;

  $('.popup-wrap.active').each(function(el){
    if(popIdx === parseInt(tg.css('z-index'))){
      tg.addClass('lastest')
    }
  });

  if(showSticky === false) stickyEl.addClass('none');
  $('body').removeClass('show-sticky sticky-fixed');

  if($('.popup-wrap.active').length === 0){
    $('body').removeClass('pop-open');
  }

  gallerySwiper.slideTo(0)
}

/*  toast message
	@@param toastMsg - 토스트 메세지 내용
*/
let toastRemove, toastAnimate;
function setToastOnOff(toastMsg){	
	if($('.toast-message').length !== 0) {
		$('.toast-message').remove();
		clearTimeout(toastRemove);
		clearTimeout(toastAnimate);
	}

	$('.wrapper').append('<div class="toast-message animate">'+ toastMsg +'</div>');
	if($('.toast-message').width() > $('.wrapper').width() - 80) $('.toast-message').addClass('overflow');

	toastAnimate = setTimeout(function (){
		$('.toast-message').removeClass('animate');
	}, 230);
	
	// 3초 후 삭제
	toastRemove = setTimeout(function (){
		$('.toast-message').addClass('remove-animate');
		
		setTimeout(function (){
			$('.toast-message').remove();
		}, 230);
	}, 3000);
}

// data-toast 속성 가지는 버튼 클릭 시 토스트 팝업 실행
function btnToastActive(){
	$('button[data-toast]').on('click', function(){
		let toastMsg = $(this).data('toast');
		setToastOnOff(toastMsg);
	});
}

// folding 열기/닫기
function setFold(){
  $('.btn-fold').off('click').on('click', function(){
    var tgFold = $(this).parents('.fold-box');
		var foldList = tgFold.siblings('.fold-box');
		
		if(!tgFold.hasClass('active')){
			foldList.removeClass('active');
			foldList.find('.fold-cont').stop().slideUp(230);
		}

		foldSlide(tgFold);
	});

	function foldSlide(tgFold){
		if(tgFold.hasClass('active')){
			tgFold.removeClass('active');
			tgFold.find('.fold-cont').stop().slideUp(230);
			$(this).find('.hidden').text('열기');
		}else{
			tgFold.addClass('active');
			tgFold.find('.fold-cont').stop().slideDown(230);
			$(this).find('.hidden').text('닫기');
		}
	}
}

// 복사 버튼 클릭 시 텍스트 복사
function setCopyText(){
	$('.btn-copy').on('click', function(){
		// 가장 가까운 data-copy-box 찾기
		var copyBox = $(this).closest('[data-copy-box]');
		
		if(copyBox.length > 0){
			// data-copy-box 내부의 data-copy-tg 요소 찾기
			var copyTarget = copyBox.find('[data-copy-tg]');
			
			if(copyTarget.length > 0){
				var textToCopy = copyTarget.text().trim();
				
				// 클립보드에 복사
				if(navigator.clipboard && window.isSecureContext){
					// 모던 브라우저용 Clipboard API
					navigator.clipboard.writeText(textToCopy).then(function(){
						setToastOnOff('복사되었습니다.');
					}).catch(function(err){
						console.error('복사 실패:', err);
						fallbackCopyTextToClipboard(textToCopy);
					});
				} else {
					// 구형 브라우저용 fallback
					fallbackCopyTextToClipboard(textToCopy);
				}
			}
		}
	});
	
	// 구형 브라우저용 복사 함수
	function fallbackCopyTextToClipboard(text) {
		var textArea = document.createElement('textarea');
		textArea.value = text;
		textArea.style.position = 'fixed';
		textArea.style.left = '-999999px';
		textArea.style.top = '-999999px';
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		
		try {
			var successful = document.execCommand('copy');
			if(successful){
				setToastOnOff('복사되었습니다.');
			} else {
				setToastOnOff('복사에 실패했습니다.');
			}
		} catch (err) {
			console.error('복사 실패:', err);
			setToastOnOff('복사에 실패했습니다.');
		}
		
		document.body.removeChild(textArea);
	}
}

function setMap(){
  // 카카오맵 API 로딩 확인 후 초기화
  function initKakaoMap() {
    try {
      var mapContainer = document.getElementById('map'); // 지도를 표시할 div 
      var mapOption = { 
        center: new kakao.maps.LatLng(37.4496, 127.1269), // 가천컨벤션센터 좌표
        level: 3 // 지도의 확대 레벨
      };

      // 지도를 생성합니다    
      var map = new kakao.maps.Map(mapContainer, mapOption); 

      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(37.4496, 127.1269)
      });

      // 마커를 지도에 표시합니다
      marker.setMap(map);

      // 인포윈도우 추가
      var iwContent = '<div style="padding:10px;min-width:200px;text-align:center;">' +
                      '<h3 style="margin:0 0 5px 0;font-size:16px;">가천컨벤션센터</h3>' +
                      '<p style="margin:0;font-size:14px;">경기도 성남시 수정구 성남대로 1342</p>' +
                      '<p style="margin:5px 0 0 0;font-size:12px;color:#666;">5층</p>' +
                      '</div>',
          iwPosition = new kakao.maps.LatLng(37.4496, 127.1269);

      var infowindow = new kakao.maps.InfoWindow({
        position: iwPosition,
        content: iwContent
      });

      // 지도 로드 완료 후 인포윈도우 표시
      kakao.maps.event.addListener(map, 'tilesloaded', function() {
        infowindow.open(map, marker);
      });
    } catch (error) {
      console.error('카카오맵 초기화 오류:', error);
    }
  }
}

// 갤러리 더보기 기능
function setGalleryMore(){
  $('.btn-more').on('click', function(){
    const galleryTg = $('.gallery-list');
    const btnTg = $(this);
    
    if(galleryTg.hasClass('active')){
      galleryTg.removeClass('active');
      btnTg.text('더보기');
    }else{
      galleryTg.addClass('active');
      btnTg.text('접기');
    }
  });
}

function setAudioControl(){
  $('.btn-silent').on('click', function(){
    const audio = document.querySelector('audio');
    const isMuted = audio.muted;

    if(isMuted){
      audio.play();
      audio.muted = false;
      $('.btn-silent').removeClass('mute');
    }else{
      audio.muted = true;
      $('.btn-silent').addClass('mute');
    }
  });
}

function setGallerySwiper(){
  gallerySwiper = new Swiper('.gallery-swiper .swiper', {
    init: false,
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false, // zoom과 충돌 방지
    centeredSlides: true,
    watchOverflow: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    },
  });

  gallerySwiper.init();
}
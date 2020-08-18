$(document).ready(function() {

    $(window).resize(function() {
        slResize();
    })
    $(".nav_toggle").change(function() {
        slResize();
    });
    $('.sidebar-toggle').on('click', function(){
        setTimeout(function(){
            slResize();
        }, 300);
    });
    function slResize(){
        var slider = $('.slide');
        var slideW = $('.slide_wrap').width();
        slider.css({ width: slideW});
    };

    var slideW = $('.slide_wrap').width();
    var slider = $('.slide'); // 슬라이드
    var slideCount = $('.slide').length; //슬라이드 개수
    var slideWidth = $('.slide').width(); // 슬라이드 1개 너비
    var sliderTotalWidth = slideCount * slideWidth; // 슬라이드 총 너비
    var indicator = $('.indicator'); //indicator
    var slide_num = 0;
    var timer;
    var slide_array = new Array(); //슬라이드 초기 상태 저장 (배열생성)
    var slide_total = slider.length;
    slider.each(function(e) {
        slide_array[e] = $(this);
    });
    slider.css({ width: slideW});
    $('.slide_show').css({ width: sliderTotalWidth }); // 슬라이드 총 너비 css

    // console.log(slideWidth+ "/" +slideW)
    // 슬라이드가 늘어날때마다 인디케이터 생성
    // for (var i = 0; i < slideCount; i++) {
    //     indicator.append('<a href="#">' + (i + 1) + '</a>');
    // };
    indicator.children("a").eq(0).addClass('active')

    // 슬라이드 오른쪽
    function moveRight(slide_num) {
        if (slideCount > 1) {
            $('.slide_show').children().eq(0).after(slide_array[slide_num]);
            var slider = $('.slide_show').children();
            $('.slide_show').stop().animate({
                "margin-left": -slideWidth
            }, 500, 'swing', function() {
                var first = slider[0];
                $('.slide_show').append(first);
                $('.slide_show').css("margin-left", 0);
            });
            btn_trans();
        }
    };

    function moveLeft(slide_num) {
        if (slideCount > 1) {
            $('.slide_show').append(slide_array[slide_num]);
            var slider = $('.slide_show').children();
            var last = slider[slideCount - 1];
            $('.slide_show').prepend(last);
            $('.slide_show').css("margin-left", -slideWidth);
            $('.slide_show').stop().animate({
                "margin-left": 0
            }, 500, 'swing');
            btn_trans();
            
        };
    };

    function btn_trans() {
        indicator.children("a").eq(slide_num).addClass('active').siblings("a").removeClass('active');

    }

    indicator.children("a").on('click', function(e) {
        e.preventDefault();
        var check_num = $(this).index();
        
        if (check_num == slide_num) {} else if (check_num > slide_num) {
            slide_num = check_num;
            moveRight(check_num);
        } else if (check_num < slide_num) {
            slide_num = check_num;
            moveLeft(check_num);
        }
    });

    //터치 이벤트 추가
    var ts;
    $('.slide_show li').on('touchstart', function (e){
       ts = e.originalEvent.touches[0].clientX;
    });

    $('.slide_show li').on('touchend', function (e){
        var te = e.originalEvent.changedTouches[0].clientX;
        if(ts > te+5){
            if(slide_num == slide_total-1){
                slide_num = 0;
            }else{
                slide_num++;
            }
            moveRight(slide_num);

        }else if(ts < te-5){
            if(slide_num == 0){
                slide_num = slide_total-1;
            }else{
                slide_num--;
            }
            moveLeft(slide_num);
        }
    });

})

  // Login Plugins

  $('.hadif-menu .switcher').click(function(){
    $('.hadif-menu .active').removeClass('active');
    $(this).addClass('active');
    $('.login-overlay').addClass('show-overlay');
  });
  $('.hadif-menu ul li a').click(function(){
    $('.hadif-menu .active').removeClass('active');
    $(this).parents('li').addClass('active');
  });
  $('.login-move').click(function() {
    $('.steps.first-step').hide();
    $('.steps.second-step').fadeIn('slow');
  });
  $('.policy a').click(function() {
    $('.steps.second-step').hide();
    $('.steps.register-step').fadeIn('slow');
  });
  $('.forgotten-pass').click(function() {
    $('.steps.second-step').hide();
    $('.steps.lost-step').fadeIn('slow');
  });
  $('.backto-login').click(function() {
    $('.steps.register-step, .steps.lost-step').hide();
    $('.steps.second-step').fadeIn('slow');
  });

  // Changing X Icon
  $('.like-options').click(function(){
    $('.like-options, .feelings-holder ul').hide();
    $('.liker img').attr('src',"assets/img/ic_feeling_heart_eyes.png");
    $.each($('.feelings-holder ul li.each-flying'), function() {
      $(this).removeClass('each-flying');
    });
  });

  // Opening remote
  $('.open-remote').click(function(){
    $('.remote-holder').addClass('show-overlay');
  });

  // Searching remote
  $(".search-input").keyup(function() {
    $(".clear-search").css("opacity","1");
  });
  $(".search-input").click(function() {
    $(".search-title").hide();
  });
  $(".clear-search").click(function() {
    $(".search-input").val('');
  });
  $(".search-input").blur(function() {
      $(this).val('');
      $(".clear-search").css("opacity","0");
      $(".search-title").show();
  });

  // Open VOD search
  $('.open-vodsearch').click(function(){
    $('.search-vod').fadeIn('fast').addClass('show-overlay');
  });

  // Opening lists
  $('.each-playlist').click(function() {
   $('.openlist-holder').addClass('show-overlay');
  });
  $('.backto-lists').click(function() {
   $('.openlist-holder').removeClass('show-overlay');
  });

  // Adding new list
  $('.trigger-edit').click(function() {
   $('<div class="each-playlist"><a href="#"><img src="assets/img/thumb2.png" class="img-responsive"><p class="editable-text">في الصفحة التي</p></a></div>').insertBefore('.playlist-image');
   var addedList = $('.each-playlist').find('.editable-text');
   var text = addedList.text();
   var input = $('<input id="attribute" type="text" value="' + text + '" />')
   addedList.html('').append(input);
   input.select();

   input.blur(function() {
     var text = $('#attribute').val();
     $('#attribute').parent().text(text);
     $('#attribute').remove();
     if ($('.editable-text').text() == '') {
      $('.editable-text').text('New Playlist');
     };
     $('.editable-text').removeClass('editable-text');
     });
   });
  // Show feelings animations on click
  $('.liker').click(function() {
  var clicks = $(this).data('clicks');
  if (clicks) {
     $('.liker img').attr('src',"assets/img/ic_cansel.png");
    $('.feelings-holder ul, .like-options').css('display','block'); // Show ul list on click

    $.each($('.feelings-holder ul li'), function(i, el){
      $(el).hide();
         setTimeout(function(){
           $(el).show().addClass('each-flying')
        },400 + ( i * 500 ));
    }); // Show feelings on click

    jwplayer("jwplayer").pause(true); // Pauses JW Player on click.

    $('.jwcontrolbar').hide(); // On click/pause to hide controls on JW Player
  } else {
    $('.liker img').attr('src',"assets/img/ic_feeling_heart_eyes.png");
    $('.feelings-holder ul, .like-options').hide();
    $.each($('.feelings-holder ul li.each-flying'), function() {
      $(this).removeClass('each-flying');
    });
  }
  $(this).data("clicks", !clicks);
  }); 

  // Opening feelings
   $(function() {
    $('.vod-feelings').click(function(event) {
        $(this).toggleClass('close-feeling');
        $('.choose-feeling ul').fadeToggle("slow");
        $('.pick-playlist').toggle('hide');
     });
    });
  // Selecting only one feeling
  $(function() {
  var allRadios = document.getElementsByName('feeling-option');
  var booRadio;
  var x = 0;
  for(x = 0; x < allRadios.length; x++){

          allRadios[x].onclick = function(){

              if(booRadio == this){
                  this.checked = false;
          booRadio = null;
              }else{
              booRadio = this;
          }
          };

   };
  });

  // Profile Page layouts
  $('.backto-profile').click(function() {
    $(this).closest('.show-overlay').removeClass('show-overlay');
  });
  $('.personal-edit').click(function(){
    $('.profile-edit-step').addClass('show-overlay');
  });
  $('.img-title a').click(function(){
    $('.change-avatar-holder').addClass('show-overlay');
  });
  $('.backto-edit').click(function(){
    $(this).closest('.show-overlay').removeClass('show-overlay');
    $('.profile-edit-step').addClass('show-overlay');
  });
  $('.open-password').click(function(){
    $('.password-holder').addClass('show-overlay');
  });
  $('.open-cards').click(function(){
    $('.creditcard-holder').addClass('show-overlay');
  });
  $('.open-invoices').click(function(){
    $('.billing-holder').addClass('show-overlay');
  });

  /* Responsive Profile Page layouts */
  $('.backto-profile.mobile-response').click(function() {
    $(this).closest('.holders-flying').removeClass('holders-flying');
    $('.main-left-panels').show();
    if ($('.profile-edit-step').css('display') == 'block' ) {
      $('.profile-edit-step').hide();
    }
  });
  $('.personal-edit.mobile-response').click(function(){
    $('.profile-edit-step').addClass('holders-flying');
    $('.profile-edit-step').show();
    $('.main-left-panels').hide();
  });
  $('.img-title a.mobile-response').click(function(){
    $('.change-avatar-holder').addClass('holders-flying');
    $('.profile-edit-step').hide();
  });
  $('.backto-edit.mobile-response').click(function(){
    $(this).closest('.holders-flying').removeClass('holders-flying');
    $('.profile-edit-step').show();
  });
  $('.open-password.mobile-response').click(function(){
    $('.password-holder').addClass('holders-flying');
    $('.main-left-panels').hide();
  });
  $('.open-cards.mobile-response').click(function(){
    $('.creditcard-holder').addClass('holders-flying');
    $('.main-left-panels').hide();
  });
  $('.open-invoices.mobile-response').click(function(){
    $('.billing-holder').addClass('holders-flying');
    $('.main-left-panels').hide();
  });
  // Open labels
  $(".dropdown-menu li label").click(function(){
    $(this).parents(".each-reminder").find('.user-option').html($(this).text());
    $(this).parents(".each-reminder").find('.user-option').val($(this).data('value'));
  });
  // Scrollbar textarea
  $('.textarea-scrollbar').scrollbar();

  // Not closing area
  $(document).on('click', '.vod-filter.dropdown-menu', function (e) {
    e.stopPropagation();
  });
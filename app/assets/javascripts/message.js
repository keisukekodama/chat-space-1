$(function() {
  var buildHTML = function(message) {
    var html = 
    `<div class="chat__contents" data-message-id="${message.id}">
        <div class="chat__contents__top">
          <div class="chat__contents__name">
            ${message.user_name}
          </div>
          <div class="chat__contents__time">
            ${message.created_at}
          </div>
        </div>
        <div class="chat__contents__message">`
          if (message.content) {
            html += `<p class="chat__contents__message--lower">
                      ${message.content}
                    </p>`
          }
          if (message.image) {
            html += `<img src="${message.image}" class="chat__content__message--image" >`
          }
          html += `</div></div>`
          return html;
  };
    
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "post",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat__content').append(html);
      $('.chat__content').animate({ scrollTop: $('.chat__content')[0].scrollHeight});
      $('form')[0].reset();
      $('.chat__form__submit').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
  });
  var reloadMessages = function() {
    last_message_id = $('.chat__contents:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.chat__content').append(insertHTML);
        $('.chat__content').animate({ scrollTop: $('.chat__content')[0].scrollHeight});
       }
      })
      .fail(function() {
        alert('error');
      });
   };
   if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
   }
});
// $.ajaxSetup({
//     headers: {
//         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//     }
// });

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(!regex.test(email)) {
       return false;
    }else{
       return true;
    }
}

$(document).ready(function(){
   $(".brand").height($(".logo-img").height());
   $('.aside-menu').height($(window).height() - $(".logo-img").height() - 25);

   $('.menu-nav li a').each(function () {
      var pageUrl = window.location.href;  
      if (pageUrl.startsWith($(this).attr("href"))) {
          $(this).parent().addClass('menu-item-active');
      }
  });
});
mynotify = (type, message) => {
   $.notify({
       message: message
   }, {
       type: type,
       delay: 2000,
       newest_on_top: true,
       animate: {
           enter: 'animate__animated animate__' + 'bounceIn',
           exit: 'animate__animated animate__' + 'fadeOut'
       },
       placement: {
           from: 'top',
           align: 'right'
       }
   });
}

handleTableResponse = (data, table , type) => {
   if(data == "ok"){
       setTimeout( function () {
           $(table).DataTable().ajax.reload();
       }, 1000 );
       mynotify('success', type + ' Success');
   }
   else
       mynotify('danger', data);
}

handleResponse = (data, text) => {
   if(data == "ok"){
       mynotify('success', text + ' Success');
   }
   else
       mynotify('danger', data);
}
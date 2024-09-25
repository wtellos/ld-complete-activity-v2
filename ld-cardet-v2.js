jQuery(document).ready(function($){

    //On click activity
    $( "body" ).on( "click", ".return-rise-button",function(event){
        event.preventDefault();
        UIkit.modal('#modal-generic-topics').hide();
        $('.cardet-content-here').html('');
    })
    
    //On click activity
    $( "body" ).on( "click", ".cardet-topics-list > li", function(){
        console.log('clicked');
        $topic_type = $(this).attr('data-topic-type');
        $topic_id = $(this).attr('data-topic-id');
        $topic_link = $(this).attr('data-topic-link');
        $lesson_id = $(this).attr('data-lesson-id');
        
        //Open link in new tab and complete activity.
        if ($topic_type == 'PDF' || $topic_type == 'Word'  || $topic_type == 'PowerPoint'  || $topic_type == 'Link' || $topic_type == 'Video' ) {
            window.open($topic_link, '_blank').focus();
            
            complete_activity($topic_id, $lesson_id);
        }
        
        else if ($topic_type == 'quiz') {
            UIkit.modal('#'+ $topic_link ).show();
        }
        //Open modal for other activities
        else {
            $('.return-rise-button').removeClass("now-active");
            UIkit.modal('#modal-generic-topics').show();
            $('.cardet-content-here').html('<iframe class="iframe-' + $topic_type +'" src="' + $topic_link +'" style="width:100%;height:100%;"></iframe>');
            //storyline completion
            if ($topic_type == 'Storyline') {
                //Storyline completion
                $('.cardet-modal-spinner').css('opacity','1');
                storyline_load_completion($topic_id, $lesson_id);
            }
            //Storyline end
            
            //rise completion
            if ($topic_type == 'SCORM') {
                //rise completion
                $('.cardet-modal-spinner').css('opacity','1');
                rise_load_completion($topic_id, $lesson_id);
            }

            if ($topic_type == 'SCORM') {
                //rise completion
                $('.cardet-modal-spinner').css('opacity','1');
                rise_load_completion_2($topic_id, $lesson_id);
            }            
            //rise end
        }
    })
    
    //Complete activity function
    function complete_activity($topic_id, $lesson_id) {
        $('.cardet-modal-spinner').css('opacity','1');
        $('.topics_shortcode').css('opacity','0');
        $.ajax(
                {
                    type: "get",
                    data: {
                        action: 'completeLD',
                        topic_id: $topic_id,
                        lesson_id: $lesson_id
                    },
                    dataType: "html",
                    url: my_ajax_object.ajax_url,
                    complete: function (msg) {
                        //UIkit.modal('#modal-generic-topics').hide();
                        //console.log(msg.responseText);
                        $('.topics_shortcode').html(msg.responseText);
                        //$('.cardet-content-here').html('');
                        $('.cardet-modal-spinner').css('opacity','0');
                        $('.topics_shortcode').css('opacity','1');
                        $('.return-rise-button').addClass("now-active");
                    }
                });
    }
    
    //Storyline completion
    function storyline_load_completion($topic_id, $lesson_id) {
          $(".iframe-Storyline").on("load", function(){
                $('.cardet-modal-spinner').css('opacity','0');
                $(".iframe-Storyline").css('opacity','1');
                //storyline Load
                $(this).contents().on("click","div[data-acc-text*='EXIT'], div[data-acc-text*='exit'], div[data-acc-text*='complete'], div[data-acc-text*='COMPLETE']", function(event){
                event.preventDefault();
                $(".iframe-Storyline").css('opacity','0');
                complete_activity($topic_id, $lesson_id);
                UIkit.modal('#modal-generic-topics').hide();
                $('.cardet-content-here').html('');
                })
            }) 
    }
    
    //RISE completion FIREFOX
    // function rise_load_completion($topic_id, $lesson_id) {
    //     $(".iframe-SCORM").on("load", function(){
    //     $('.cardet-modal-spinner').css('opacity','0');
    //     $(".iframe-SCORM").css('opacity','1');
    //     console.log('load');
    //     $loltracker = ".nav-sidebar-header__progress-text";
    //     $(this).contents().on("DOMSubtreeModified",$loltracker, function(){
	//         var a = $(this).html();
	// 	    if (a.includes('100')) {
    //             $loltracker = "dad";
	// 			 //$(".iframe-Rise").css('opacity','0');
	// 			 complete_activity($topic_id, $lesson_id);
	// 	    }
    //     });
    // })
    // }
    
    // //RISE completion CHROME 1
    // function rise_load_completion_2() {
    //     var $iframe = $('.iframe-SCORM');
    //     if ($iframe.length && $iframe.contents().find('.nav-sidebar-header__progress-text').length > 0) {
    //       var content = $iframe.contents().find('.nav-sidebar-header__progress-text').html();
    //       if (content.includes('100')) {
    //         //$loltracker = "dad";
    //         //$(".iframe-SCORM").css('opacity','0');
    //         complete_activity($topic_id, $lesson_id);
    //       }
    //     }
    //   }
      
    //   setInterval(rise_load_completion_2, 5); // Check every 500ms    

    //RISE completion CHROME 2
    function rise_load_completion_2() {
        var $iframe = $('.iframe-SCORM');
            if ($iframe.contents().find('.nav-sidebar-header__progress-text').length > 0) {
                var content = $iframe.contents().find('.nav-sidebar-header__progress-text').html();
                if (content.includes('100')) {
                    // $loltracker = "dad";
                    // $(".iframe-SCORM").css('opacity','0');
                    complete_activity($topic_id, $lesson_id);
                    clearInterval(checkInterval);
                }
            }
    
    }
    var checkInterval = setInterval(rise_load_completion_2, 100);

    

      
    //Refresh topics when modal quiz is closed
    // Variable with element that fire event
    var $slideItem = $('.quiz-modals');

    $slideItem.on('hide', function(){
        $('.topics_shortcode').css('opacity','0');
        $('.cardet-modal-spinner').css('opacity','1');
        $.ajax(
                {
                    type: "get",
                    data: {
                        action: 'ajaxtopics',
                        lesson_id: $lesson_id
                    },
                    dataType: "html",
                    url: my_ajax_object.ajax_url,
                    complete: function (msg) {
                        //UIkit.modal('#modal-generic-topics').hide();
                        //console.log(msg.responseText);
                        $('.topics_shortcode').html(msg.responseText);
                        //$('.cardet-content-here').html('');
                        $('.cardet-modal-spinner').css('opacity','0');
                        $('.topics_shortcode').css('opacity','1');

                    }
                });
    });
    
});



 

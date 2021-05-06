// to enable the Airmouse keys in body
Yup(document).ready(function(){

    //air mouse to show arrows
    Yup(document).on('mousemove','body',function(e){
        if(view != ""){  
            airMouse =true;   
            Main.showArrows();
        }   
    });

    // add hightlight on Cards on mouse over
    Yup(document).on('mouseover','.menuBar,.grey-btn, .card-details, .search-keys, .suggestionItem, .btn-search ,#signUpBtn,.keyboardKeys,.signShowPassowrd ,.toptab, .country-normal, .detailsContent', function(event){
        var id = Yup(this).attr("id");
        if(id) { 
            Yup('#'+id).addClass('mouseFocus');
        }
    });
    
    // player
    Yup(document).on('mouseover','.playerMouse',function(e){
         var id = Yup(this).attr("id");
        if(id) { 
            Yup('#'+id).addClass('mouseFocus');
        }
        Player.progressIconHandle(e,'over',id);
    }); 
    Yup(document).on('mouseout','.playerMouse',function(e){
        var id = Yup(this).attr("id");
        Player.progressIconHandle(e,'out',id);
    });

    Yup(document).on('click','.playerMouse, .player-bg, #playerHTML5', function(e){
        var id = Yup(this).attr("id");
        Player.progressIconHandle(e,'click',id);
    });

    Yup(document).on('mousemove','.playerMouse',function(e){
        var id = Yup(this).attr("id");
        if(id) { 
            Yup('#'+id).addClass('mouseFocus');
        }
        Player.progressIconHandle(e,'over',id);
    });

    //remove hightLight on mouse removal
    Yup(document).on('mouseout',function(event){
        var id = Yup('.mouseFocus').attr("id");  
        if(id) { 
            Yup('#'+id).removeClass('mouseFocus');
        }
         //remove hightLight on popup buttons
        var id = Yup('.popupMouse').attr("id");  
        if(id) { 
            Yup('#'+id).removeClass('popupMouse');
        }
    });

    // add hightlight on popup buttons
    Yup(document).on('mouseover','.popup-button', function(event){
        var id = Yup(this).attr("id");
        if(id) { 
            Yup('#'+id).addClass('popupMouse');
        }
    }); 

     //airmouse for nav keys
    Yup(document).on("mouseover",'#downArrow,#upArrow,#leftArrow,#rightArrow,#backArrow',function(){
        Yup(this).css("opacity",'1');
    });
    Yup(document).on("mouseout",'#downArrow,#upArrow,#leftArrow,#rightArrow,#backArrow',function(){
        Yup(this).css("opacity",'0.5');
    });   
    Yup("#leftArrow").click(function(e){
        e = tvKeyCode.ArrowLeft;
        Main.eventGenerate(e); 
    });
    Yup("#upArrow").click(function(e){
        e = tvKeyCode.ArrowUp;
        Main.eventGenerate(e);
    });
    Yup("#downArrow").click(function(e){ 
        e = tvKeyCode.ArrowDown;
        Main.eventGenerate(e);
    });
    Yup("#rightArrow").click(function(e){ 
        e = tvKeyCode.ArrowRight;
        Main.eventGenerate(e);
    });
    Yup("#backArrow").click(function(e){ 
        e = tvKeyCode.Return;
        Main.eventGenerate(e);
    });

    //airmouse  for content and list page Enter
    Yup(document).on('click',' #signUpBtn , .menuBar,.btn-search ,.slick-active img ,.card-details, .library-button ', function (e) {       
        var id = Yup(this).attr("id");  
        keyHandlar.contentEnterHandlar(id,''); 
    });
    Yup(document).on('click','.slick-active img ', function (e) {       
        var id = Yup(this).attr("id");  
        var source = Yup(this).attr("source");  
        keyHandlar.contentEnterHandlar(id,source); 
    });

    //airmouse for Search keys Enter   
    Yup(document).on('click','.search-keys , .suggestionItem ', function (e) {             
        var id = Yup(this).attr("id");       
        keyHandlar.searchEnterHandlar(id);  
    }); 
    
    //airmouse for details page
    Yup(document).on('click','.tabsTitle ', function (e) {             
        var id = Yup(this).attr("id");  
        if(Yup(".activeTab").attr("id")!= id){
            Yup(".imageFocus").removeClass("imageFocus");
            Yup("#"+id).addClass("imageFocus")  
            e = tvKeyCode.Enter;
            Main.eventGenerate(e);   
        }       
    });  

    //airmouse for popup
    Yup(document).on('click','.popup-button ', function (e) {             
        var id = Yup(this).attr("id"); 
        keyHandlar.popupEnterHandlar(id);              
    });  

    //airmouse on signin Page
    Yup(document).on('click','.keyboardKeys,.signShowPassowrd', function (e) {        
        var id = Yup(this).attr("id"); 
        Yup(".imageFocus").removeClass("imageFocus");
        Yup("#"+id).addClass("imageFocus")  
        e = tvKeyCode.Enter;
        Main.eventGenerate(e);  
    });

    //airMouse Enter on countryCOde slection
    Yup(document).on('click','.country-normal', function(e){
        var id = Yup(this).attr("id"); 
        keyHandlar.countryCodeEnterHandular(id);
    });

     //airMouse Enter on my settings
     Yup(document).on('click','.toptab', function(e){
        var id = Yup(this).attr("id"); 
        keyHandlar.accountKeyEnter(id);
    });

    //airMouse Enter on detailsPage
    Yup(document).on('click','.detailsContent', function(e){
        var id = Yup(this).attr("id"); 
        keyHandlar.detailsPageEnterHandlar(id);
    });

    //airmouse Click on resend button
    Yup(document).on('click','#resendBtn', function(e){
        var id = Yup(this).attr("id"); 
       if(presentPagedetails.resendButton == true){
        Main.resendOTP();
       }       
    });

    //click on okay on Unique page
    Yup(document).on('click','.unique-page-btn', function(e){
        Main.eventGenerate(tvKeyCode.Enter);      
    });


    //whell scroll handular
    document.getElementById("mainContent").addEventListener("wheel", function(event){       
            event.preventDefault();
            var e = 0;
            if (event.wheelDelta > 0 ) {
                e = tvKeyCode.ArrowUp;
            }
            else {
                e = tvKeyCode.ArrowDown;
            }
            Main.eventGenerate(e);
    });

// network connection
    window.addEventListener('online', function (e) {
        checknetworkType = true;
        if((staticPaths.indexOf(presentPagedetails.targetPath))<0 && (presentPagedetails.view!='player')){
            Main.apiCall(presentPagedetails.targetPath);
        }
        else if(presentPagedetails.view=='player' && presentPagedetails.steamResponse.analyticsInfo.contentType !="live"){
            // still popup exist
            if(Main.popupData.popuptype == 'netWorkError'){
                Yup("#popUpFDFS").html('');	
                Main.popupData = {};
                Player.playStream(presentPagedetails.steamResponse.streams[0].url);
                media.seekTo(Player.currentPlayingSeekTime);
            }  

        }
    });
    window.addEventListener('offline', function (e) {
        checknetworkType = false;
    });

  });

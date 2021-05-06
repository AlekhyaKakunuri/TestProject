var keyHandlar = {};
var leftRightCardCounts = [
	{ 'cardType': "sheet_poster", 'small': 4, 'large': 4 ,'smallleft': 280, 'largeleft': 413},
	{ 'cardType': "roller_poster", 'small': 7, 'large': 7 ,'smallleft': 185, 'largeleft': 281},   
    { 'cardType': "search-card", 'small': 4, 'large': 4 ,'smallleft': 280, 'largeleft': 413},
    { 'cardType': "overlay_poster", 'small': 4, 'large': 4 ,'smallleft': 285, 'largeleft': 437},
    { 'cardType': "player-card", 'small': 4, 'large': 4 ,'smallleft': 230, 'largeleft': 340},
];
var gridViewCardCount = [
	{ 'cardType': "sheet_poster", 'small': 4, 'large': 4 },
	{ 'cardType': "roller_poster", 'small': 6, 'large': 6 },   
    { 'cardType': "search-card", 'small': 4, 'large': 4 },  
    { 'cardType': "overlay_poster", 'small': 4, 'large': 4 },
    { 'cardType': "player-card", 'small': 4, 'large': 4 },  
];

//content and list page ENTER key handular
keyHandlar.contentEnterHandlar = function(id,source){  
    commingFromMenus = false; 
    // clickedMenu = {};
    if(utilities.validateString(source) == false ){
        source = Yup('#'+id).attr("source");
    }   
    if (source == "signUpBtn") {
        view = "signin";
        Main.processNext();
    }    
    else if(source == 'banners'){
        var targetPath = Yup(".slick-active img").attr("targetPath");
        Main.apiCall(targetPath);
    }
    else if(source == 'menus' || source == 'search'){  
        keyHandlar.menuKeyEnterHandular(id);         
    } 
    else if(source == 'uniqueButtons'){
        view =  Yup('#'+id).attr("targetpath");
        if(view=='signup'){
            tempObjectData.landingFromSettings = true;            
        }
        Main.processNext();
    }  
    else{
        var targetPath =  Yup('#'+id).attr("targetpath");
        Main.apiCall(targetPath);
    }      
    
}

//content and list page Return key handular
keyHandlar.contentReturnHandlar = function(){    
    if(presentPagedetails.targetPath != firstMenu)  {
        Main.previousPage();
    }       
    else {

    }
}

//content page key handular
keyHandlar.contentKeyHandlar = function(event){
    var keycode = (window.event) ? event.keyCode : event.which;
    var source = Yup('.imageFocus').attr("source");
    var id = Yup('.imageFocus').attr("id");    
    switch (keycode) {
		case tvKeyCode.ArrowLeft: {
            if (source == "banners") {
				try {
					Yup("#BannersHome").slick("slickPrev");
				} catch (e) { }
            } 
            else if (source == 'signUpBtn'){                
                Yup(".imageFocus").removeClass("imageFocus");  
                Yup(".btn-search").addClass("imageFocus");   
            }          
            else if (source == "menus" || source == 'search') {
               keyHandlar.menuKeyHandular(id,event);
            }
            else if (source == "sections") {
                var splitData = id.split('-');
                if(parseInt(splitData[2]) != 0 ){
                    Yup(".imageFocus").removeClass("imageFocus");                  
                    Yup("#sectionItem-"+splitData[1] +'-'+(parseInt(splitData[2]) - 1) ).addClass("imageFocus");
                    keyHandlar.addSectionKeyIndex(parseInt(splitData[1]),parseInt(splitData[2])-1);
                    keyHandlar.liveScrollLeft(parseInt(splitData[1]),parseInt(splitData[2]) );
                }
            }
            else if(source == 'uniqueButtons'){
                var splitData = id.split('-'); 
                if(parseInt(splitData[1]) != 0 ){
                    Yup(".imageFocus").removeClass("imageFocus"); 
                    Yup("#signin-0").addClass("imageFocus");   
                }
            }
            break;
		}
		case tvKeyCode.ArrowRight: {
            if (source == "banners") {
				try {
					Yup("#BannersHome").slick("slickNext");
				} catch (e) { }
            }           
            else if (source == "menus" || source == 'search') {
                keyHandlar.menuKeyHandular(id,event);              
            }
            else if (source == "sections") {
                var splitData = id.split('-');
                if(parseInt(splitData[2]) <  presentPagedetails.sections[parseInt(splitData[1])].sectionControls.dataLength -1 ){
                    Yup(".imageFocus").removeClass("imageFocus");                  
                    Yup("#sectionItem-"+splitData[1] +'-'+(parseInt(splitData[2]) + 1) ).addClass("imageFocus");
                    keyHandlar.addSectionKeyIndex(parseInt(splitData[1]),parseInt(splitData[2])+1);
                    keyHandlar.liveScrollRight(parseInt(splitData[1]),parseInt(splitData[2]));
                }
            }
            else if(source == 'uniqueButtons'){
                var splitData = id.split('-'); 
                if(parseInt(splitData[1]) != 1 ){
                    Yup(".imageFocus").removeClass("imageFocus"); 
                    Yup("#signin-1").addClass("imageFocus");   
                }
            }
            break;
		}
		case tvKeyCode.ArrowUp: {	
            if (source == "banners") {              
                keyHandlar.menuKeyHandular(id,event);                         
            }        
            else if (source == "sections") {
                var splitData = id.split('-'); 
                if(parseInt(splitData[1]) == 0){
                    // if(presentPagedetails.menusList && presentPagedetails.menusList.length > 0){  
                    //     Yup(".imageFocus").removeClass("imageFocus"); 
                    //     if(presentPagedetails.menuIndex){                       
                    //         Yup("#menu-" + presentPagedetails.menuIndex ).addClass("imageFocus");
                    //     }else{
                    //         Yup("#menu-0" ).addClass("imageFocus");
                    //         keyHandlar.addMenuKeyIndex(0);
                    //     }
                    //     if(presentPagedetails.searchBar ==true ) {
                    //         Yup(".search-bar" ).show();                          
                    //     } 
                    // }else  
                    if(presentPagedetails.banners && presentPagedetails.banners.length > 0){  
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup(".middleBanner").addClass("imageFocus");    
                    }
                    else if(presentPagedetails.menusList && presentPagedetails.menusList.length > 0){                       
                        keyHandlar.menuKeyHandular(id,event); 
                    }
                    // else  if(presentPagedetails.searchBar ==true){
                    //     Yup(".imageFocus").removeClass("imageFocus");
                    //     Yup(".btn-search").addClass("imageFocus");   
                    // }

                    if(presentPagedetails.banners && presentPagedetails.banners.length > 0 ){
                        try{
                            Yup("#BannersHome" ).show();
                            Yup("#BannersHome").slick('refresh');
                        }catch(e){ }                       
                    }
                    // if(presentPagedetails.menusList  && presentPagedetails.menusList.length > 0 ) {
                    //     Yup(".menus-list" ).show();                          
                    // } 
                    // if(presentPagedetails.searchBar ==true ) {
                    //     Yup(".search-bar" ).show();                          
                    // }
                    if( presentPagedetails.isCustomHeaderAdded)  {
                        Yup(".title-header" ).show(); 
                    }   
                }
                else{
                    Yup(".imageFocus").removeClass("imageFocus");
                    if(presentPagedetails.sectionIndex &&  presentPagedetails.sectionIndex[parseInt(splitData[1])-1]){                           
                        Yup("#sectionItem-"+(parseInt(splitData[1])-1)+"-"+presentPagedetails.sectionIndex[parseInt(splitData[1])-1] ).addClass("imageFocus");
                        Yup("#section-"+ (parseInt(splitData[1])-1)).show();
                    }else{
                        Yup("#sectionItem-"+(parseInt(splitData[1])-1)+"-0" ).addClass("imageFocus");
                        Yup("#section-"+ (parseInt(splitData[1])-1)).show();
                    }

                    if(parseInt(splitData[1]) == 1 && presentPagedetails.banners.length == 0){
                        if( presentPagedetails.isCustomHeaderAdded)  {
                            Yup(".title-header" ).show(); 
                        }
                    }
                }                
            }
            break;
		}
		case tvKeyCode.ArrowDown: {
            if (source == "banners") {
                // if(presentPagedetails.menusList && presentPagedetails.menusList.length > 0){  
                //     Yup(".imageFocus").removeClass("imageFocus"); 
                //     if(presentPagedetails.menuIndex){                       
                //         Yup("#menu-" + presentPagedetails.menuIndex ).addClass("imageFocus");
                //     }else{
                //         Yup("#menu-0" ).addClass("imageFocus");
                //         keyHandlar.addMenuKeyIndex(0);
                //     }
                //     if(presentPagedetails.searchBar == true && presentPagedetails.sections ) {
                //         Yup(".search-bar" ).hide();                          
                //     }  
                // }else 
                if(presentPagedetails.sections && presentPagedetails.sections.length > 0 ){
                   
                    if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[0]){
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#sectionItem-0-"+presentPagedetails.sectionIndex[0] ).addClass("imageFocus");                        
                    }else{                       
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#sectionItem-0-0" ).addClass("imageFocus");
                    }
                    Yup("#section-0" ).show();
                    // if(presentPagedetails.searchBar ==true ) {
                    //      Yup(".search-bar" ).hide();                          
                    // } 
                     if(presentPagedetails.banners ){
                         Yup("#BannersHome" ).hide();
                     }
                    //  if(presentPagedetails.menusList ) {
                    //      Yup(".menus-list" ).hide();                          
                    //  } 
                     if( presentPagedetails.isCustomHeaderAdded)  {
                        Yup(".title-header" ).hide(); 
                     }
                 }
            }
            else if (source == 'signUpBtn' || source == 'search' || source == "menus"){  
                keyHandlar.menuKeyHandular(id,event);
            }           
            else if (source == "sections") {
                var splitData = id.split('-'); 
                if(parseInt(splitData[1]) < presentPagedetails.sections.length - 1 ){
                    Yup(".imageFocus").removeClass("imageFocus");
                    if(presentPagedetails.sectionIndex &&  presentPagedetails.sectionIndex[parseInt(splitData[1])+1]){                           
                        Yup("#sectionItem-"+(parseInt(splitData[1])+1)+"-"+presentPagedetails.sectionIndex[parseInt(splitData[1])+1] ).addClass("imageFocus");
                    }else{
                        Yup("#sectionItem-"+(parseInt(splitData[1])+1)+"-0" ).addClass("imageFocus");
                    }
                   if( parseInt(splitData[1]) == 0 ){  
                        // if(presentPagedetails.menusList ) {
                        //     Yup(".menus-list" ).hide();                          
                        // }                      
                        if(presentPagedetails.banners ){
                            Yup("#BannersHome" ).hide();
                        }
                    //     if(presentPagedetails.searchBar ==true ) {
                    //         Yup(".search-bar" ).hide();                          
                    //    } 
                       if( presentPagedetails.isCustomHeaderAdded)  {
                        Yup(".title-header" ).hide(); 
                        }
                       Yup("#section-0").hide();
                   }
                   else if( parseInt(splitData[1]) > 0 && parseInt(splitData[1]) != presentPagedetails.sections.length - 2 ){
                        Yup("#section-"+ (parseInt(splitData[1]))).hide();
                   }
                   //pagination
                   if(parseInt(splitData[1]) == presentPagedetails.sections.length -3 && presentPagedetails.paginationSections &&  presentPagedetails.paginationSections.length > 0){
                       Main.getPaginationsections();
                   }
                   
                } 
               
            }
            break;
		}
        case 8:
		case tvKeyCode.Return: {
            if(presentPagedetails.targetPath == firstMenu){
                Main.popupData ={
                    popuptype : 'noData',
                    message : 'Are you sure want to exit '+appConfig.appName,
                    buttonCount : 2,
                    yesText : 'No',
                    yesTarget : 'close',
                    noText : 'Yes',
                    noTarget : 'exit',
                    onBack : 'close'
                }
                Yup("#popUpFDFS").html(Util.showPopup());	
                Yup("#popup-btn-1").addClass('popupFocus');	
            }else{
                keyHandlar.contentReturnHandlar();
            }
           
            break;
        }
        case tvKeyCode.Enter: {
            keyHandlar.contentEnterHandlar(id,source);
            break;
        } 
        default :{
            break;
        }
    }
}

//list page key handular
keyHandlar.listKeyHandlar = function(event){
    var keycode = (window.event) ? event.keyCode : event.which;
    var source = Yup('.imageFocus').attr("source");
    var id = Yup('.imageFocus').attr("id");  
    var noOfCardForARow = 0;
    var h_length;
    if(presentPagedetails.sections.length >0){
        h_length = presentPagedetails.sections[0].sectionControls.dataLength;
        if(h_length > 0){
            noOfCardForARow = keyHandlar.noOfCardForARowInGrid(presentPagedetails.sections[0].sectionData.data[0].cardType)
        }  
    }
    switch (keycode) {
        case tvKeyCode.ArrowLeft: {
            if (source == 'signUpBtn' || source == 'search' || source == "menus"){  
                keyHandlar.menuKeyHandular(id,event);
            }      
            else if(h_length > 0){
                var splitData = id.split('-');
                v_index = parseInt(splitData[1]);
                h_index = parseInt(splitData[2]);  
                if(h_index != 0 ) {
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#sectionItem-"+v_index+"-"+(h_index-1) ).addClass("imageFocus");
                }             
            }    
            break;
        }
        case tvKeyCode.ArrowRight: {
            if (source == 'signUpBtn' || source == 'search' || source == "menus"){  
                keyHandlar.menuKeyHandular(id,event);
            } else if(h_length > 0){
                var splitData = id.split('-');
                v_index = parseInt(splitData[1]);
                h_index = parseInt(splitData[2]);     
                if(h_index < (noOfCardForARow-1) ) {                  
                    if( ( ( (v_index+1) * noOfCardForARow ) - (noOfCardForARow - (h_index+1) ) )   < h_length ){ 
                        Yup(".imageFocus").removeClass("imageFocus");                      
                        Yup("#sectionItem-"+v_index+"-"+(h_index+1) ).addClass("imageFocus");
                    }                    
                }            
            } 
           
            break;
        }
        case tvKeyCode.ArrowUp: {
            if(h_length > 0 && source != 'search' && source != "menus"){
                var splitData = id.split('-');
                v_index = parseInt(splitData[1]);
                h_index = parseInt(splitData[2]);  
                if(v_index != 0 ) {
                    if(v_index != 0){
                        Yup("#viewAllrow-"+(v_index-1) ).show(); 
                    }
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#sectionItem-"+(v_index-1)+"-"+h_index ).addClass("imageFocus");                   
                }else if(presentPagedetails.isMenuPathforGrid == true){
                    keyHandlar.menuKeyHandular(id,event);
                }             
            } else if( (source == 'uniqueButtons' || h_length == 0) && presentPagedetails.isMenuPathforGrid == true ){
                keyHandlar.menuKeyHandular(id,event);
            } 
            break;
        }
        case tvKeyCode.ArrowDown: {
            if(h_length > 0 && source != 'search' && source != "menus" ){
                var splitData = id.split('-');
                v_index = parseInt(splitData[1]);
                h_index = parseInt(splitData[2]);
                if(v_index < Math.floor((h_length-1)/noOfCardForARow) ) {

                    if(v_index  != 0 && v_index != Math.floor((h_length-1)/noOfCardForARow) ){
                        Yup("#viewAllrow-"+(v_index-1) ).hide(); 
                    } 
                    if(  ( ( (v_index+2) * noOfCardForARow ) - (noOfCardForARow - (h_index+1) ) <= h_length  )   )   {
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#sectionItem-"+(v_index+1)+"-"+h_index ).addClass("imageFocus");  
                    } else{
                        Yup(".imageFocus").removeClass("imageFocus");
                        var lastindexvalue =  h_length -( (v_index+1) * noOfCardForARow );  
                        Yup("#sectionItem-"+(v_index+1)+"-"+(lastindexvalue-1) ).addClass("imageFocus");                 
                    }
                    //pagiantion
                    if(v_index == (Math.floor((h_length-1)/noOfCardForARow ) -1 )  ){
                        if(presentPagedetails.sections[0].sectionData.hasMoreData == true)
                         Main.viewAllPagination();
                    }
                }
            }  else if( (source == 'uniqueButtons' || h_length == 0) && presentPagedetails.isMenuPathforGrid == true ){
                keyHandlar.menuKeyHandular(id,event);
            }   else if (source == 'signUpBtn' || source == 'search' || source == "menus"){  
               if(h_length > 0){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#sectionItem-0-0").addClass("imageFocus");
               }else{
                    var splitData = id.split('-');             
                    newId = parseInt(splitData[1]);
                    keyHandlar.addMenuKeyIndex(newId);
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#signin-1" ).addClass("imageFocus");
               }
            } 
            break;
        } 
        case 8:
        case tvKeyCode.Return: {
            keyHandlar.contentReturnHandlar();
            break;
        }
        case tvKeyCode.Enter: {
            keyHandlar.contentEnterHandlar(id,source);
            break;
        } 
        default :{
            break;
        } 
    }
}

//search page key handular
keyHandlar.searchKeyHandlar =function(event){
    var keycode = (window.event) ? event.keyCode : event.which;
    var source = Yup('.imageFocus').attr("source");
    var id = Yup('.imageFocus').attr("id");  
    switch (keycode) {
        case tvKeyCode.ArrowLeft: {
            if(source == 'letters'){
                var splitData = id.split('-'); 
                if(parseInt(splitData[1]) != 0){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#Alpha-"+(parseInt(splitData[1])-1) ).addClass("imageFocus");
                    keyHandlar.addSectionKeyIndex(1,parseInt(splitData[1])-1);
                } 
            }
            else if(source == 'numbers'){
                var splitData = id.split('-'); 
                if(parseInt(splitData[1]) != 26){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#Alpha-"+(parseInt(splitData[1])-1) ).addClass("imageFocus");
                    keyHandlar.addSectionKeyIndex(1,parseInt(splitData[1])-1);
                } 
            }else if(source == 'settings'){
                var splitData = id.split('-'); 
                if(parseInt(splitData[1])!=51) {                   
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#Alpha-"+(parseInt(splitData[1])-1) ).addClass("imageFocus");                  
                }
            }
            else if(source == 'suggestion'){
                  var splitData = id.split('-'); 
                  if( parseInt(splitData[1]) != 0 ){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#suggest-"+(parseInt(splitData[1])-1) ).addClass("imageFocus"); 
                    keyHandlar.addSectionKeyIndex(0,parseInt(splitData[1])-1);
                    if( parseInt(splitData[1])> 3 ){
                        Yup("#suggest-"+(parseInt(splitData[1])-4) ).show(); 
                      }
                  }
            }
            else if(source == 'searchTab'){
                var splitData = id.split('-'); 
                if( parseInt(splitData[1]) != 0 ){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#searchTab-"+(parseInt(splitData[1])-1) ).addClass("imageFocus"); 
                    keyHandlar.addSectionKeyIndex(2,parseInt(splitData[1])-1);
                    if( parseInt(splitData[1])> 4 ){
                      Yup("#searchTab-"+(parseInt(splitData[1])-5) ).hide(); 
                    }
                }
            }
            else if(source == 'sections'){
                var noOfCardForARow = 0;
                var h_length = presentPagedetails.searchResults.length;
                if(h_length > 0){
                    noOfCardForARow = keyHandlar.noOfCardForARowInGrid('search-card');
                    var splitData = id.split('-');
                    v_index = parseInt(splitData[1]);
                    h_index = parseInt(splitData[2]);  
                    if(h_index != 0 ) {
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#sectionItem-"+v_index+"-"+(h_index-1) ).addClass("imageFocus");
                    }
                }
            }
            break;
        }
        case tvKeyCode.ArrowRight: {
            if(source == 'letters'){
                var splitData = id.split('-'); 
                if(parseInt(splitData[1]) != 25){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#Alpha-"+(parseInt(splitData[1])+1) ).addClass("imageFocus");
                    keyHandlar.addSectionKeyIndex(1,parseInt(splitData[1])+1);
                } 
            }
            else if(source == 'numbers'){
                var splitData = id.split('-'); 
                if(parseInt(splitData[1]) != 35){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#Alpha-"+(parseInt(splitData[1])+1) ).addClass("imageFocus");
                    keyHandlar.addSectionKeyIndex(1,parseInt(splitData[1])+1);
                } 
            }
            else if(source == 'settings'){
                var splitData = id.split('-'); 
                if(parseInt(splitData[1])!=54) {                   
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#Alpha-"+(parseInt(splitData[1])+1) ).addClass("imageFocus");
                }
            } 
            else if(source == 'suggestion'){
                var splitData = id.split('-'); 
                if( parseInt(splitData[1]) < presentPagedetails.searchSuggestion.length -1  ){
                  Yup(".imageFocus").removeClass("imageFocus");
                  Yup("#suggest-"+(parseInt(splitData[1])+1) ).addClass("imageFocus"); 
                  keyHandlar.addSectionKeyIndex(0,parseInt(splitData[1])+1);
                  if( parseInt(splitData[1])> 2 ){
                    Yup("#suggest-"+(parseInt(splitData[1])-3) ).hide(); 
                  }
                }
            }else if(source == 'searchTab'){
                var splitData = id.split('-'); 
                if( parseInt(splitData[1]) < presentPagedetails.searchResults.length -1){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#searchTab-"+(parseInt(splitData[1])+1) ).addClass("imageFocus"); 
                    keyHandlar.addSectionKeyIndex(2,parseInt(splitData[1])+1);
                    if( parseInt(splitData[1])> 3 ){
                      Yup("#searchTab-"+(parseInt(splitData[1])-3) ).hide(); 
                    }
                }
            }
            else if(source == 'sections'){
                var noOfCardForARow = 0;
                var actveTab = Yup('.activeTab').attr("id").split('-'); 
                var TabIndx=parseInt(actveTab[1]);
                var h_length = presentPagedetails.searchResults[TabIndx].data.length;
                if(h_length > 0){
                    noOfCardForARow = keyHandlar.noOfCardForARowInGrid('search-card');
                    var splitData = id.split('-');
                    v_index = parseInt(splitData[1]);
                    h_index = parseInt(splitData[2]);     
                    if(h_index < (noOfCardForARow-1) ) {                  
                        if( ( ( (v_index+1) * noOfCardForARow ) - (noOfCardForARow - (h_index+1) ) )   < h_length ){ 
                            Yup(".imageFocus").removeClass("imageFocus");                      
                            Yup("#sectionItem-"+v_index+"-"+(h_index+1) ).addClass("imageFocus");
                        }                    
                    }  
                }
            }
            break;
        }
        case tvKeyCode.ArrowUp: {
            if(source == 'letters' || source == 'numbers' ){  
                if(presentPagedetails.searchSuggestion && presentPagedetails.searchSuggestion.length>0 ){
                    Yup(".imageFocus").removeClass("imageFocus");
                    if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[0]){
                        Yup("#suggest-"+presentPagedetails.sectionIndex[0]).addClass("imageFocus");
                    }else{
                        Yup("#suggest-0").addClass("imageFocus");
                    }
                   
                }                     
            }else if(source == 'settings'){
                Yup(".imageFocus").removeClass("imageFocus");
                if(Yup("#Alpha-51").attr("keyValue") == '123'){
                    if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[1]){
                        Yup("#Alpha-"+ ((presentPagedetails.sectionIndex[1])) ).addClass("imageFocus"); 
                    }else{
                        Yup("#Alpha-26" ).addClass("imageFocus"); 
                    }                  
                }else{
                    if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[1]){
                        Yup("#Alpha-"+ presentPagedetails.sectionIndex[1] ).addClass("imageFocus"); 
                    }else{
                        Yup("#Alpha-0").addClass("imageFocus");
                    }                    
                }               
            }else if(source == 'searchTab'){
                Yup(".imageFocus").removeClass("imageFocus");
                Yup("#Alpha-52").addClass("imageFocus");
            }else if(source == 'sections'){
                var noOfCardForARow = 0;
                var actveTab = Yup('.activeTab').attr("id").split('-'); 
                var TabIndx=parseInt(actveTab[1]);
                var h_length = presentPagedetails.searchResults[TabIndx].data.length;
                if(h_length > 0){
                    noOfCardForARow = keyHandlar.noOfCardForARowInGrid('search-card');
                    var splitData = id.split('-');
                    v_index = parseInt(splitData[1]);
                    h_index = parseInt(splitData[2]);     
                    if(v_index != 0 ) {
                        if(v_index != 0){
                            Yup("#viewAllrow-"+(v_index-1) ).show(); 
                        }
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#sectionItem-"+(v_index-1)+"-"+h_index ).addClass("imageFocus");                   
                    } else{ // if it first row
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup(".activeTab").addClass("imageFocus");   
                    }              
                }    
            }
            break;
        }
        case tvKeyCode.ArrowDown: {
            if(source == 'letters' || source == 'numbers'){
                Yup(".imageFocus").removeClass("imageFocus");
                Yup("#Alpha-52").addClass("imageFocus");          
            }
            else if(source == 'suggestion'){
                Yup(".imageFocus").removeClass("imageFocus");
                if(Yup("#Alpha-51").attr("keyValue") == '123'){
                    if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[1]){
                        Yup("#Alpha-"+ ((presentPagedetails.sectionIndex[1])) ).addClass("imageFocus");
                    }else{
                        Yup("#Alpha-26" ).addClass("imageFocus"); 
                    }                  
                }else{
                    if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[1]){
                        Yup("#Alpha-"+ presentPagedetails.sectionIndex[1] ).addClass("imageFocus"); 
                    }else{
                        Yup("#Alpha-0").addClass("imageFocus");
                    }                    
                }  
            }
            else if(source == 'settings'){
                if(presentPagedetails.searchResults && presentPagedetails.searchResults.length > 0){                  
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup(".activeTab").addClass("imageFocus");
                }
            }
            else if(source == 'searchTab'){
                Yup(".imageFocus").removeClass("imageFocus");
                Yup("#sectionItem-0-0").addClass("imageFocus");
            }
            else if(source == 'sections'){
                var noOfCardForARow = 0;
                var actveTab = Yup('.activeTab').attr("id").split('-'); 
                var TabIndx=parseInt(actveTab[1]);
                var h_length = presentPagedetails.searchResults[TabIndx].data.length;
                if(h_length > 0){
                    noOfCardForARow = keyHandlar.noOfCardForARowInGrid('search-card');
                    var splitData = id.split('-');
                    v_index = parseInt(splitData[1]);
                    h_index = parseInt(splitData[2]);
                    if(v_index < Math.floor((h_length-1)/noOfCardForARow) ) {  
                        Yup("#viewAllrow-"+(v_index) ).hide();                        
                        if(  ( ( (v_index+2) * noOfCardForARow ) - (noOfCardForARow - (h_index+1) ) <= h_length  )   )   {
                            Yup(".imageFocus").removeClass("imageFocus");
                            Yup("#sectionItem-"+(v_index+1)+"-"+h_index ).addClass("imageFocus");  
                        } else{
                            Yup(".imageFocus").removeClass("imageFocus");
                            var lastindexvalue =  h_length -( (v_index+1) * noOfCardForARow );  
                            Yup("#sectionItem-"+(v_index+1)+"-"+(lastindexvalue-1) ).addClass("imageFocus");                 
                        }                       
                    }
                    //pagination
                    if(( ((v_index+2) * noOfCardForARow ) > h_length ) && presentPagedetails.searchPaginationPage.searchPaginationHit==true){
                        var searchText= Yup("#searchData").text();
                        presentPagedetails.searchPaginationPage.page=presentPagedetails.searchPaginationPage.page+1;
                        Main.getSearchResults(searchText);
                    }
                }    
            }
            break;
        }
        case 8:
        case tvKeyCode.Return: {
            keyHandlar.contentReturnHandlar();
            break;
        }
        case tvKeyCode.Enter: {         
            keyHandlar.searchEnterHandlar(id); 
        } 
        default :{
            break;
        } 
    }
}

//search enter key handular
keyHandlar.searchEnterHandlar = function(id){
    var source = Yup('#'+id).attr("source");
    if(source == 'settings'){
        var splitData = id.split('-'); 
        if(parseInt(splitData[1])==51){  //char to number change
            var selectedKeyMap = Yup("#Alpha-51").attr("keyValue");
            presentPagedetails.sectionIndex[1]=0;
            Yup(".imageFocus").removeClass("imageFocus");
            Yup('#'+id).addClass("imageFocus");
            if(selectedKeyMap == 'ABC')	{
                Yup("#characterMap").hide();
                Yup("#NumbersMap").show();
                Yup("#Alpha-51").attr("keyValue","123");
                Yup("#Alpha-51").text("123");                      
            } else{
                Yup("#characterMap").show();
                Yup("#NumbersMap").hide();
                Yup("#Alpha-51").attr("keyValue","ABC");
                Yup("#Alpha-51").text("ABC");                     
            }                   
        }else if(parseInt(splitData[1])==54) {  //clear
            Yup(".imageFocus").removeClass("imageFocus");
            Yup('#'+id).addClass("imageFocus");
            Yup("#searchData").text("Search Live TV,Catch-Up and more...");
            Yup("#searchData").removeClass('active');
            Yup('.searchSuggestions').html('');
            Yup('#resultsCount').html('');
            Yup('#searchResults').html('');
            presentPagedetails.searchSuggestion = {};
            presentPagedetails.searchResults = [];
            Yup('.searchSuggestions').animate({height : 15 },200);           
        }else if(parseInt(splitData[1])==53) {  //backspace
           var searchText= Yup("#searchData").text();       
           Yup(".imageFocus").removeClass("imageFocus");
           Yup('#'+id).addClass("imageFocus");
           presentPagedetails.searchPaginationPage={
			'page':0,
			'searchPaginationHit':true
		}
           if(searchText.length > 0 && searchText != "Search Live TV,Catch-Up and more..."){
            searchText = searchText.substr(0,searchText.length -1 ); 
            Yup("#searchData").text(searchText); 
            if(searchText.length == 0){
                Yup("#searchData").text("Search Live TV,Catch-Up and more...");
                Yup("#searchData").removeClass('active');  
                Yup('#resultsCount').html('');
                Yup('#searchResults').html(''); 
                presentPagedetails.searchResults = [];               
                if( presentPagedetails.searchSuggestion && presentPagedetails.searchSuggestion.length == 0){
                    Yup('.searchSuggestions').html('');
                    Yup('.searchSuggestions').animate({height : 15 },200);
                }              
            }else {
                Main.getSearchSuggestion(searchText,false);
                Main.getSearchResults(searchText); 
            }
           }
        }else if(parseInt(splitData[1])==52) {  //space
            var searchText= Yup("#searchData").text();
            Yup(".imageFocus").removeClass("imageFocus");
            Yup('#'+id).addClass("imageFocus");
            presentPagedetails.searchPaginationPage={
                'page':0,
                'searchPaginationHit':true
            }
            if(searchText == "Search Live TV,Catch-Up and more..."){
                searchText = ''; 
                Yup("#searchData").addClass('active');                     
                Yup("#searchData").text( searchText+' ');
            }else if(searchText.length<40){
                Yup("#searchData").text( searchText+' ');
                Main.getSearchSuggestion(searchText+' ',false); 
                Main.getSearchResults(searchText);
            }
        }
    }
    else if(source == 'letters' || source == 'numbers'){
        var searchText= Yup("#searchData").text();
        var value = Yup('#'+id).attr("keyValue");
        Yup(".imageFocus").removeClass("imageFocus");
        Yup('#'+id).addClass("imageFocus");
        presentPagedetails.searchPaginationPage={
			'page':0,
			'searchPaginationHit':true
		}
        if(searchText == "Search Live TV,Catch-Up and more..."){
            searchText = '';
            Yup("#searchData").addClass('active');                    
            Yup("#searchData").text( searchText+value);
            Main.getSearchSuggestion(searchText+value,false); 
            Main.getSearchResults(searchText+value);
        }else if(searchText.length<40){
            Yup("#searchData").text( searchText+value); 
            Main.getSearchSuggestion(searchText+value,false);  
            Main.getSearchResults(searchText+value);                                
        }
    } 
    else if (source == 'suggestion'){
        Yup("#searchData").text( searchText);
        Yup(".imageFocus").removeClass("imageFocus");
        var value = Yup('#'+id).text();
        presentPagedetails.searchPaginationPage={
			'page':0,
			'searchPaginationHit':true
		}
        Yup("#searchData").text(value);
        Main.getSearchSuggestion(value,true);
        Main.getSearchResults(value);
    }else if(source == 'sections'){
        keyHandlar.contentEnterHandlar(id,source);
    }
    else if(source == 'searchTab'){
        var splitData = id.split('-');
        Yup(".activeTab").removeClass("activeTab");
        Yup("#searchTab-"+splitData[1]).addClass("activeTab");
        Yup(".sectionsGrid_Items").html(Util.getSearchResultsByTab(presentPagedetails.searchResults,splitData[1]));
    }
}

//search add focus on click on suggestions
keyHandlar.addFocusOnClickSearchSuggestions = function(){
    if(presentPagedetails.searchSuggestion && presentPagedetails.searchSuggestion.length > 0){
        Yup("#suggest-0").addClass("imageFocus");
        keyHandlar.addSectionKeyIndex(0,0);
    }else{
        if(Yup("#Alpha-51").attr("keyValue") == '123'){
            if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[1]){
                Yup("#Alpha-"+ ((presentPagedetails.sectionIndex[1])) ).addClass("imageFocus");
            }else{
                Yup("#Alpha-26" ).addClass("imageFocus"); 
            }                  
        }else{
            if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[1]){
                Yup("#Alpha-"+ presentPagedetails.sectionIndex[1] ).addClass("imageFocus"); 
            }else{
                Yup("#Alpha-0").addClass("imageFocus");
            }                    
        }  
    }
}
    
//details page key handular
keyHandlar.detailsPageKeyHandlar =function(event){
    var keycode = (window.event) ? event.keyCode : event.which;
    var source = Yup('.imageFocus').attr("source");
    var id = Yup('.imageFocus').attr("id");
    switch (keycode) {
        case tvKeyCode.ArrowLeft: {
            if (source == "sections") {
                var splitData = id.split('-');
                if(parseInt(splitData[2]) != 0 ){
                    Yup(".imageFocus").removeClass("imageFocus");                  
                    Yup("#sectionItem-"+splitData[1] +'-'+(parseInt(splitData[2]) - 1) ).addClass("imageFocus");
                    keyHandlar.addSectionKeyIndex(parseInt(splitData[1]),parseInt(splitData[2])-1);
                    keyHandlar.liveScrollLeft(parseInt(splitData[1]),parseInt(splitData[2]) );
                }
            }
            else if(source=='tabs'){
                var splitData = id.split('-'); 
                if(splitData[1] > 0){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#tabs-"+(parseInt(splitData[1])-1)).addClass("imageFocus");
                    if( parseInt(splitData[1])> 3 ){
                        Yup("#tabs-"+(parseInt(splitData[1])-4) ).show(); 
                      }
                }
            }           
            else if(source == 'favorites'){
                if(presentPagedetails.isComingTvguide==true){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#watchLive").addClass('imageFocus');
                }
                else{
                    if(presentPagedetails.avilablePagebuttonsLength && presentPagedetails.avilablePagebuttonsLength >=1){
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#button-"+(presentPagedetails.avilablePagebuttonsLength-1)).addClass('imageFocus');
                    }
                }  
            }
            else if(source == 'watchLive'){
                if(presentPagedetails.avilablePagebuttonsLength && presentPagedetails.avilablePagebuttonsLength >=1){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#button-"+(presentPagedetails.avilablePagebuttonsLength-1)).addClass('imageFocus');
                }
            }
            else if(source == 'button'){
                var splitData = id.split('-');
                if(parseInt(splitData[1]) != 0 ){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#button-"+(parseInt(splitData[1]) - 1)).addClass('imageFocus');
                }
            }
            break;
        }
        case tvKeyCode.ArrowRight: {
            if (source == "sections") {
            var splitData = id.split('-');
                if(parseInt(splitData[2]) <  presentPagedetails.sections[parseInt(splitData[1])].sectionControls.dataLength -1 ){
                    Yup(".imageFocus").removeClass("imageFocus");                  
                    Yup("#sectionItem-"+splitData[1] +'-'+(parseInt(splitData[2]) + 1) ).addClass("imageFocus");
                    keyHandlar.addSectionKeyIndex(parseInt(splitData[1]),parseInt(splitData[2])+1);
                    keyHandlar.liveScrollRight(parseInt(splitData[1]),parseInt(splitData[2]));
                }
            }
            else if(source=='tabs'){
                var splitData = id.split('-'); 
                if(splitData[1] < presentPagedetails.sections.length-1){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#tabs-"+(parseInt(splitData[1])+1)).addClass("imageFocus");
                    if( parseInt(splitData[1])> 2 ){
                        Yup("#tabs-"+(parseInt(splitData[1])-3) ).hide(); 
                      }
                }
            }
            else if(source == 'button'){
                var splitData = id.split('-');
                if(parseInt(splitData[1]) <(presentPagedetails.avilablePagebuttonsLength)){
                    if(parseInt(splitData[1]) <(presentPagedetails.avilablePagebuttonsLength-1)){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#button-"+(parseInt(splitData[1]) + 1)).addClass('imageFocus');
                    }else{
                        if(presentPagedetails.isComingTvguide==true){
                            Yup(".imageFocus").removeClass("imageFocus");
                            Yup("#watchLive").addClass('imageFocus');
                        }
                        else if(presentPagedetails.favButtonAdded == true){
                            Yup(".imageFocus").removeClass("imageFocus");
                            Yup("#favorites").addClass('imageFocus');
                        }
                    }
                }
            }
            else if(source == 'watchLive'){
                if(presentPagedetails.favButtonAdded == true){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#favorites").addClass('imageFocus');
                }
            }
            break;
        }
        case tvKeyCode.ArrowUp: {
            if (source == "sections" && view=='movieDetails') {
                if(presentPagedetails.avilablePagebuttonsLength >=1){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#button-0").addClass('imageFocus');
                }else if(presentPagedetails.favButtonAdded == true){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#favorites").addClass('imageFocus');
                }
                else if(Yup('#readMore').val()!=undefined){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup(".description").addClass('imageFocus');
                } 
                Yup(".detailsContainer").animate( {'margin-top' : '0px' },300 );
            }else if(source == "sections" && (view=='tvshowDetails' || view=='channelDetails')){
                Yup(".imageFocus").removeClass("imageFocus");
                // Add Focus to active tab when showtabs true.
                if (presentPagedetails.tabsInfo.showTabs == true) {
                    Yup(".activeTab").addClass('imageFocus');
                    Yup(".detailsContainer").animate( {'margin-top' : '0px' },300 );
                } else { // else add focus to sections/buttons/description.
                var splitData = id.split('-'); 
                if(parseInt(splitData[1]) == 0){
                    Yup(".detailsContainer").animate( {'margin-top' : '0px' },300 );
                    if(presentPagedetails.avilablePagebuttonsLength >=1){
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#button-0").addClass('imageFocus');
                    }
                    else if(presentPagedetails.isComingTvguide==true){
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#watchLive").addClass('imageFocus');
                    }
                    else if(presentPagedetails.favButtonAdded == true){
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#favorites").addClass('imageFocus');
                    }
                    else if(Yup('#readMore').val()!=undefined){
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup(".description").addClass('imageFocus');
                    }    
                }else{                   
                    Yup("#section-"+ (parseInt(splitData[1])-1)).show();
                    Yup("#section-"+ (parseInt(splitData[1])+1)).hide();
                    Yup(".imageFocus").removeClass("imageFocus");  
                    if(presentPagedetails.sectionIndex &&  presentPagedetails.sectionIndex[parseInt(splitData[1])-1]){                           
                        Yup("#sectionItem-"+(parseInt(splitData[1])-1)+"-"+presentPagedetails.sectionIndex[parseInt(splitData[1])-1] ).addClass("imageFocus");
                    }else{
                        Yup("#sectionItem-"+(parseInt(splitData[1])-1)+"-0" ).addClass("imageFocus");
                    }  
                }

            }
            }else if(source =='button' || source=='favorites' || source=='watchLive'){
                if(Yup('#readMore').val()!=undefined){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup(".description").addClass('imageFocus');
                }
            }
            else if(source == 'tabs'){
                if(presentPagedetails.avilablePagebuttonsLength >=1){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#button-0").addClass('imageFocus');
                }
                else if(presentPagedetails.isComingTvguide==true){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#watchLive").addClass('imageFocus');
                }
                else if(presentPagedetails.favButtonAdded == true){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#favorites").addClass('imageFocus');
                }
                else if(Yup('#readMore').val()!=undefined){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup(".description").addClass('imageFocus');
                }
            }          
            break;
        }
        case tvKeyCode.ArrowDown: {
            if(source == "description"){
                Yup(".imageFocus").removeClass("imageFocus");
                if(view== 'movieDetails') {Yup("#button-0").addClass('imageFocus')}
                else {
                    if(presentPagedetails.favButtonAdded == true){
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#favorites").addClass('imageFocus');
                    }else{
                        Yup(".activeTab").addClass('imageFocus')
                    }
                };
            }
            else if(source =='button' || source=='favorites' || source=='watchLive'){
                if(view== 'movieDetails'){
                    Yup(".imageFocus").removeClass("imageFocus");
                    if (currentWindow_Width == 1280) Yup(".detailsContainer").animate({ 'margin-top': '-150px' }, 300);
                    else Yup(".detailsContainer").animate({ 'margin-top': '-230px' }, 300); 
                    if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[0]){
                    Yup("#sectionItem-0-"+presentPagedetails.sectionIndex[0] ).addClass("imageFocus"); 
                    }else{
                    Yup("#sectionItem-0-0" ).addClass("imageFocus");
                    }
                }else{
                    // Add Focus to active tab when showtabs true.
                    if(presentPagedetails.tabsInfo.showTabs==true){
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup(".activeTab").addClass('imageFocus')
                    }else{ // else add focus to sections card.
                        if (currentWindow_Width == 1280) Yup(".detailsContainer").animate({ 'margin-top': '-40px' }, 300);
                        else Yup(".detailsContainer").animate({ 'margin-top': '-70px' }, 300); 
                        if (presentPagedetails.sections && presentPagedetails.sections.length > 0) {
                            Yup(".imageFocus").removeClass("imageFocus");
                            if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[0]){
                                Yup("#sectionItem-0-"+presentPagedetails.sectionIndex[0] ).addClass("imageFocus"); 
                            }else{
                                Yup("#sectionItem-0-0" ).addClass("imageFocus");
                            }
                        }
                    }
                }
            }
            else if(source=='tabs'){
                var splitData = Yup('.activeTab').attr("id").split('-'); 
                if (currentWindow_Width == 1280) Yup(".detailsContainer").animate({ 'margin-top': '-40px' }, 300);
                else Yup(".detailsContainer").animate({ 'margin-top': '-70px' }, 300);
                if (presentPagedetails.sections && presentPagedetails.sections.length > 0) {
                    Yup(".imageFocus").removeClass("imageFocus");
                    if(presentPagedetails.sectionIndex &&  presentPagedetails.sectionIndex[parseInt(splitData[1])]){                           
                        Yup("#sectionItem-"+(parseInt(splitData[1]))+"-"+presentPagedetails.sectionIndex[parseInt(splitData[1])]).addClass("imageFocus");
                    }else{
                        Yup("#sectionItem-"+(parseInt(splitData[1]))+"-0" ).addClass("imageFocus");
                    }
                }
            }
            //adding focus to down sections cards.
            else if(source=='sections' && presentPagedetails.tabsInfo.showTabs==false){
                var splitData = id.split('-'); 
                if(parseInt(splitData[1]) < presentPagedetails.sections.length - 1 ){
                    Yup("#section-"+ (parseInt(splitData[1])+1)).show();
                    Yup(".imageFocus").removeClass("imageFocus");
                    if(presentPagedetails.sectionIndex &&  presentPagedetails.sectionIndex[parseInt(splitData[1])+1]){                           
                        Yup("#sectionItem-"+(parseInt(splitData[1])+1)+"-"+presentPagedetails.sectionIndex[parseInt(splitData[1])+1] ).addClass("imageFocus");
                    }else{
                        Yup("#sectionItem-"+(parseInt(splitData[1])+1)+"-0" ).addClass("imageFocus");
                    }
                   if( parseInt(splitData[1]) > 0 && parseInt(splitData[1]) != presentPagedetails.sections.length - 1 ){
                        Yup("#section-"+ (parseInt(splitData[1]-1))).hide();
                   }
                    //pagination
                    if(parseInt(splitData[1]) == presentPagedetails.sections.length -3 && presentPagedetails.paginationSections &&  presentPagedetails.paginationSections.length > 0){
                        Main.getPaginationsections();
                    }                    
                } 
            }
            break;
        }
        case 8:
        case tvKeyCode.Return: {
            keyHandlar.contentReturnHandlar();
            break;
        }
        case tvKeyCode.Enter: {
            keyHandlar.detailsPageEnterHandlar(id);
            break;
        } 
        default :{
            break;
        } 
    }
}

//detailsPage Enter Key Handular
keyHandlar.detailsPageEnterHandlar =function(id){
    var source = Yup('#'+id).attr("source");
    if(source=='tabs'){
        var pagination = Yup('.imageFocus').attr("pagination");
        if(pagination=='false'){
            var splitData = id.split('-'); 
            Yup(".activeSection").removeClass("activeSection");
            Yup(".activeTab").removeClass("activeTab");
            Yup("#tabs-"+(parseInt(splitData[1]))).addClass("activeTab");
            Yup("#section-"+parseInt(splitData[1])).addClass('activeSection');
        }else{
          // Pagination sesaons
        }
    }else if(source =='button'){
        if(Yup("#" + id).attr("elementsubtype")=='watchnow'){
            keyHandlar.contentEnterHandlar(id,source);
        }        
        else{
            if(Main.userProfile.userStatus){  //user loginin
                if(Yup("#" + id).attr("elementsubtype")=='subscribe' || Yup("#" + id).attr("elementsubtype")=='rent'){ // if it is subscribe button
                    // utilities.detailsPagePopupDetails("Please go to '" +systemConfigs.configs.packagePageUrl + "'  to buy  packages",'Subscribe','info');
                    view = "noPackageView";
                    Main.processNext();
                }else{
                    keyHandlar.contentEnterHandlar(id,source);
                }          
            }else {  // not loggoed in 
                view='signin';
                Main.processNext();
            }  
        }
    }
    else if(source == 'favorites'){
        if(Main.userProfile.userStatus){
            if(presentPagedetails.pageButtons.isFavourite == true){
                //remove from fav
                presentPagedetails.pageButtons.isFavourite = false;
                Yup('.fav-icon').removeClass("removeWatch");
                Yup('.fav-icon').addClass("addTowatch");
                Main.addToFav(presentPagedetails.targetPath,2);
            }else{
                //add to fav
                presentPagedetails.pageButtons.isFavourite = true;
                Yup('.fav-icon').removeClass("addTowatch");
                Yup('.fav-icon').addClass("removeWatch");
                Main.addToFav(presentPagedetails.targetPath,1);
            }
        }else{
            Main.popupData ={
                popuptype : 'info',
                message : 'Please Login to Add Favorites',
                buttonCount : 1,
                yesText : 'Sign In',
                yesTarget : 'gotosignin',
                onBack : 'close'
            }
            Yup("#popUpFDFS").html(Util.showPopup());
            Yup("#popup-btn-1").addClass('popupFocus');	
            
        }
    }
    else if(source == "description"){
        utilities.detailsPagePopupDetails(presentPagedetails.description,presentPagedetails.pageContent[0].title,'description');
    }
    else if(source=='watchLive'){
        // Calculate Live Program
        keyHandlar.getCurrentTimeProgram();
    }
    else{
        keyHandlar.contentEnterHandlar(id,source);
    }
}

// Get The CurrentTime Program
keyHandlar.getCurrentTimeProgram=function(){
    if (presentPagedetails.sections && presentPagedetails.sections.length > 0) {
        for (var i = 0; presentPagedetails.sections.length; i++) {
            if (presentPagedetails.sections[i].sectionInfo.name == 'Today') {
                if (presentPagedetails.sections[i].sectionData.data.length > 0) {
                    for (var j = 0; j < presentPagedetails.sections[i].sectionData.data.length; j++) {
                        var epocTime = +new Date().getTime();
                        var data = presentPagedetails.sections[i].sectionData.data;
                        if (epocTime >= +(data[j].target.pageAttributes.startTime) && epocTime <= +(data[j].target.pageAttributes.endTime)) {
                            Main.apiCall(data[j].target.path);
                            break;
                        }
                    }
                }
            }
        }
    } else {
        Main.apiCall('');
    }
}

//history of the focus on menu
keyHandlar.addMenuKeyIndex =function(h_index){
    presentPagedetails.menuIndex = parseInt(h_index);
}

//history of the focus in sections
keyHandlar.addSectionKeyIndex =function(v_index,h_index){
    presentPagedetails.sectionIndex[v_index] = parseInt(h_index);
}

//To get no of cards to show in diff resoluton Based on card type.
function noOfCardForARow(cardType) {
	if (cardType) {
		for (var item = 0; item < leftRightCardCounts.length; item++) {
			if (leftRightCardCounts[item].cardType == cardType) {
				return (currentWindow_Width == 1280) ? leftRightCardCounts[item].small : leftRightCardCounts[item].large;
			}
		}
	} else {
		return 4;
	}
	return 4;
}

//To get no of cards to show in diff resoluton Based on card type.
keyHandlar.noOfCardForARowInGrid =function(cardType) {
	if (cardType) {
		for (var item = 0; item < gridViewCardCount.length; item++) {
			if (gridViewCardCount[item].cardType == cardType) {
				return (currentWindow_Width == 1280) ? gridViewCardCount[item].small : gridViewCardCount[item].large;
			}
		}
	} else {
		return 4;
	}
	return 4;
}

//to control the left scroll in sections
keyHandlar.liveScrollLeft =function(v_index, h_index) {
    var cardType = Yup("#sectionItem-" + v_index + '-' + (h_index)).attr('cardtype');
    var noOfCardsForRow = noOfCardForARow(cardType);
    var h_length = presentPagedetails.sections[parseInt(v_index)].sectionControls.dataLength;
    try {
		if (h_index - 1 >= 0) {
			if (noOfCardsForRow == 8) {
				if ((h_index > h_length - 3 && h_length >= 6) || h_index < 5) {
														
				} else {				
                    keyHandlar.liveScrollRightWrapper(v_index, 'left',cardType);										
				}
			}
			else if (noOfCardsForRow == 7) {
				if ((h_index > h_length - 3 && h_length >= 5) || h_index < 4) {
									
				} else {					
                    keyHandlar.liveScrollRightWrapper(v_index, 'left',cardType);							
				}
			} else {
				if (h_index == h_length - 1 && h_length > 4) {								
				}
				else if ((h_index == 3 && h_length < 5) || h_index <= 2) {									
				}
				else {
                    keyHandlar.liveScrollRightWrapper(v_index, 'left',cardType);							
				}
			}
		}
	} catch (e) { }
}

//to control the right scroll in sections
keyHandlar.liveScrollRight =function(v_index, h_index) {
    var cardType = Yup("#sectionItem-" + v_index + '-' + (h_index)).attr('cardtype');
    var noOfCardsForRow = noOfCardForARow(cardType);
    var h_length = presentPagedetails.sections[parseInt(v_index)].sectionControls.dataLength;
    try {
		if (h_index + 1 < h_length) {
			if (noOfCardsForRow == 8) {
				if (h_index < 4 || h_index > h_length - 4) {
				}
				else {						
                    keyHandlar.liveScrollRightWrapper(v_index, 'right',cardType);
				}
			}
			else if (noOfCardsForRow == 7) {
				if (h_index < 3 || h_index > h_length - 4) {								
				}
				else {
                    keyHandlar.liveScrollRightWrapper(v_index, 'right',cardType);								
				}
			} else {
				if (h_index == 0 || h_index == 1 || h_index == h_length - 2) {
				}
				else if (h_index != h_length - 1) {
                    keyHandlar.liveScrollRightWrapper(v_index, 'right',cardType);		
				}
			}
		}
	}
	catch (e) { }
}

//left padding how much to move
keyHandlar.liveScrollRightWrapper =function(v_index,pos,cardType){
    var leftpaddng = 413;    
    for (var item = 0; item < leftRightCardCounts.length; item++) {
        if (leftRightCardCounts[item].cardType == cardType) {
            leftpaddng = (currentWindow_Width == 1280) ? leftRightCardCounts[item].smallleft : leftRightCardCounts[item].largeleft;
            break;
        }
    }
    var existingleftValue=Yup('#section-horizontal-'+v_index).css("left")
    existingleftValue = existingleftValue.replace('px','');
    existingleftValue = (pos == 'right') ?  (parseInt(existingleftValue)-leftpaddng) :  ( parseInt(existingleftValue)+leftpaddng );       
    Yup('#section-horizontal-'+v_index).css("left",existingleftValue+'px');
}

// Auth keyHandler
keyHandlar.AuthKeyhandler = function (e) {
    var keycode = (window.event) ? e.keyCode : e.which;
	var source = Yup('.imageFocus').attr("source");
    var index = parseInt(Yup('.imageFocus').attr("index"));  
	switch (keycode) {		
        case  tvKeyCode.ArrowLeft: {
            if(source == 'keyPadNumaric'){
                if(index != 1){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#numeric-'+(index-1)).addClass("imageFocus");
                }
            }else if(source == 'keyPadGenric'){
                if(index != 0){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-'+(index-1)).addClass("imageFocus");
                }
            }else if(source == 'keyPadEmail'){
                if(index != 0){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-'+(index-1)).addClass("imageFocus");
                }
            }else if(source == 'actionKey'){ 
                if(view == 'signin'){                   
                    if(index <= 15 ){
                        Yup('.imageFocus').removeClass("imageFocus");                   
                        Yup('#numeric-'+(index-1)).addClass("imageFocus");
                    }             
                } else if (view == 'forgetPassword'){
                    if(index == 15 ) index =13;
                    else index =index-1;
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#numeric-'+(index)).addClass("imageFocus");
                }  
                else if(view == 'signupOtpVerification') {
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#numeric-'+(index-1)).addClass("imageFocus");
                }
                else if(view == 'signup'){
                    if(index == 15 ) index =13;
                    else index =index-1;
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#numeric-'+(index)).addClass("imageFocus");
                }
            }else if(source == 'actionKeyGen'){                  
                Yup('.imageFocus').removeClass("imageFocus");                   
                Yup('#defaultKeys-'+(index-1)).addClass("imageFocus");
            }else if(source == 'signupBtn'){
                if(view == 'otpVerification' || view == 'signupOtpVerification') {
                    Yup('.imageFocus').removeClass("imageFocus"); 
                    if( Yup('.input-active').attr('keyType')=='numeric'){
                        Yup('#numeric-13').addClass("imageFocus");
                    }else{
                        Yup('#defaultKeys-44').addClass("imageFocus");
                    }
                } else {
                    Yup('.imageFocus').removeClass("imageFocus"); 
                    if( Yup('.input-active').attr('keyType')=='numeric'){
                        Yup('#numeric-13').addClass("imageFocus");
                    }else{
                        Yup('#defaultKeys-44').addClass("imageFocus");
                    }
                }             
               
            }else if(source == 'actionKeyEmail'){
                if(view == 'signin'){                    
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-'+(index-1)).addClass("imageFocus"); 
                }
            } 
            break;
        }
        case tvKeyCode.ArrowRight: {
            if(source == 'keyPadNumaric'){
                if(index < 12){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#numeric-'+(index+1)).addClass("imageFocus");
                }
            }else if(source == 'keyPadGenric'){
                if(index < 42 ){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-'+(index+1)).addClass("imageFocus");
                }
            }else if(source == 'keyPadEmail'){
                if(index < 49 ){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-'+(index+1)).addClass("imageFocus");
                }
            }
            else if(source == 'actionKey'){
                if(view == 'signin'){
                    if(index < 15 ){
                        Yup('.imageFocus').removeClass("imageFocus");                   
                        Yup('#numeric-'+(index+1)).addClass("imageFocus");
                    }
                }
                else if(view == 'signupOtpVerification' ) {
                   if(index <= 12){
                        Yup('.imageFocus').removeClass("imageFocus");                   
                        Yup('#numeric-'+(index+1)).addClass("imageFocus");
                   }
                }
            } else if(source == 'actionKeyGen'){
                if(index == 43 ){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-44').addClass("imageFocus");
                }else if(index == 44 || index == 45){
                    if(view == 'signin'){
                        if(systemConfigs.configs.showSignup == "true"){
                            Yup('.imageFocus').removeClass("imageFocus"); 
                            Yup('#signupBtn').addClass("imageFocus"); 
                        }
                    }
                    else if(view == 'signup'){
                        Yup('.imageFocus').removeClass("imageFocus"); 
                        Yup('#signupBtn').addClass("imageFocus"); 
                    }
                    else if(view == 'otpVerification') {
                        if(presentPagedetails.resendButton == true){
                            Yup('.imageFocus').removeClass("imageFocus"); 
                            Yup('#resendBtn').addClass("imageFocus"); 
                        }
                    }  
                    else if(view == 'changePassword') {
                        Yup('.imageFocus').removeClass("imageFocus");
                        Yup('#defaultKeys-45').addClass("imageFocus");
                    }
                }
            } else if(source == 'actionKeyEmail'){
               if(view == 'signin'){
                    if(index <= 49){
                        Yup('.imageFocus').removeClass("imageFocus");                   
                        Yup('#emailKeys-'+(index+1)).addClass("imageFocus");
                    }
                }
            }   
            break;
        }
        case tvKeyCode.ArrowUp: {
            if(source == 'keyPadNumaric'){
                if(index > 3){
                    if(index == 11) {index =9}
                    else (index= index-3)
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#numeric-'+(index)).addClass("imageFocus");
                }
            }else if(source == 'keyPadGenric'){   
                if(index < 40 ){
                   if(index-10 >= 0){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-'+(index-10)).addClass("imageFocus");
                   }
                }else if(index == 40){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-31').addClass("imageFocus");
                }else if(index ==41){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-34').addClass("imageFocus");
                }else if(index == 42){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-37').addClass("imageFocus");
                }
            }else if(source == 'actionKey'){
                if(view == 'signin'){
                    if(index >= 12 && index <= 15){
                        Yup('.imageFocus').removeClass("imageFocus");                   
                        Yup('#numeric-'+(index-2)).addClass("imageFocus");
                    } 
                } else if(view == 'signupOtpVerification' ){
                    if(index == 12 || index == 13){
                        Yup('.imageFocus').removeClass("imageFocus");                   
                        Yup('#numeric-'+(index-2)).addClass("imageFocus");
                    }
                    else if(index == 14 ){
                        Yup('.imageFocus').removeClass("imageFocus");                   
                        Yup('#numeric-12').addClass("imageFocus");
                    } 
                }            
            }else if(source == 'actionKeyGen'){
                if (index == 43 || index == 44){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-41').addClass("imageFocus");
                }else{
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-44').addClass("imageFocus");
                }
            }else if(source == 'keyPadEmail'){
                if(index == 47 || index == 46) {
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-42').addClass("imageFocus");
                } else if(index == 45 ) {
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-41').addClass("imageFocus");
                } else if(index == 44 || index == 43 ) {
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-40').addClass("imageFocus");
                } else if(index == 42){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-39').addClass("imageFocus");
                } else if(index == 41){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-34').addClass("imageFocus");
                } else if(index == 40){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-30').addClass("imageFocus");
                } else if(index < 40 && index-10 >= 0){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-'+(index-10)).addClass("imageFocus");
                }        
            }else if(source == 'actionKeyEmail') {
                if(index == 49){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-46').addClass("imageFocus");
                }else if(index == 48 ){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-43').addClass("imageFocus");
                }                
                else if(view == 'signin'){
                   if(index == 50){
                        Yup('.imageFocus').removeClass("imageFocus");                   
                        Yup('#emailKeys-49').addClass("imageFocus");
                   }
                }
            }
            break;
        }
        case tvKeyCode.ArrowDown: {
            if(source == 'keyPadNumaric'){
                if(index < 10){
                    if(index == 9) { index = 11; }
                    else if(index == 7 || index == 8 ) { index = 10; }
                    else { index = index+3; }
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#numeric-'+(index)).addClass("imageFocus");
                }else{
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#numeric-13').addClass("imageFocus");
                }
            }else if(source == 'keyPadGenric'){                
                if(index < 30 ){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-'+(index+10)).addClass("imageFocus");
                }else if(index == 30 || index == 31){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-40').addClass("imageFocus");
                }else if(index == 30 || index == 31){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-40').addClass("imageFocus");
                }else if(index >=32 && index <=36){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-41').addClass("imageFocus");
                }else if(index >=37 && index <=39){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#defaultKeys-42').addClass("imageFocus");
                }else{
                    Yup('.imageFocus').removeClass("imageFocus"); 
                    Yup('#defaultKeys-44').addClass("imageFocus");
                }
            }else if(source == 'actionKey'){
                if(view == 'signin'){
                    if(index==12 || index==13){
                        Yup('.imageFocus').removeClass("imageFocus");
                        Yup('#numeric-'+(index+2) ).addClass("imageFocus");
                    }
                }  else if(view == 'signupOtpVerification') {
                    if(index==12 || index==13){
                        if(presentPagedetails.resendButton == true){
                            Yup('.imageFocus').removeClass("imageFocus");
                            Yup('#numeric-14' ).addClass("imageFocus");
                        }
                    }
                }    
            }else if(source == 'actionKeyGen'){
                if (index == 43 || index == 44){
                    Yup('.imageFocus').removeClass("imageFocus"); 
                    Yup('#defaultKeys-45').addClass("imageFocus");
                }               
            }else if(source == 'keyPadEmail'){
                if(index < 30 ){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-'+(index+10)).addClass("imageFocus");
                } 
                else if(index >=30 && index <=32){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-40').addClass("imageFocus");
                } 
                else if(index >=33 && index <=36){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-41').addClass("imageFocus");
                } 
                else if(index >=37 && index <=39){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-42').addClass("imageFocus");
                }else if(index == 40 ){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-43').addClass("imageFocus");
                } else if(index == 41 ){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-45').addClass("imageFocus");
                } else if(index == 42 ){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-46').addClass("imageFocus");
                } else if(index >=43 && index <=47){
                    Yup('.imageFocus').removeClass("imageFocus");                   
                    Yup('#emailKeys-49').addClass("imageFocus");
                }   
            } else if(source == 'actionKeyEmail'){
                if(index == 48 || index == 49){
                    if(view == 'signin'){ //adding focus to signin with mobile                        
                        Yup('.imageFocus').removeClass("imageFocus");                   
                        Yup('#emailKeys-50').addClass("imageFocus");                       
                    }
                }       
            }
            break;
        }
        case tvKeyCode.Enter: {
            keyHandlar.keyboardEnterHandular();
            break;
        }
		case 8:
		case tvKeyCode.Return: {
            if(view =='otpVerification'){
                Main.stopTimer();
            } 
            if( view == 'signupOtpVerification' ){ 
                if(tempObjectData.context == 'login'){
                    if(tempObjectData.actionCode == 2 || tempObjectData.actionCode == 4){
                        tempObjectData.context = '';
					    Main.apiCall(firstMenu);
                    }else{
                        Main.popupData = {
                            popuptype: 'info',                   
                            message: 'Are You sure you want to leave this page ?',
                            buttonCount: 2,
                            yesText: 'Stay',
                            yesTarget: 'close',
                            noText: 'Leave',
                            noTarget: 'leaveFromOTP',
                            onBack: 'close',
                        }
                        Yup("#popUpFDFS").html(Util.showPopup());	
                        Yup("#popup-btn-1").addClass('popupFocus');
                    }
                }else if(tempObjectData.context == 'verify_mobile') {
                    Main.previousPage();
                }else{ 
                    Main.popupData = {
                    popuptype: 'info',                   
                    message: 'Do you want to discard the signup process?',
                    buttonCount: 2,
                    yesText: 'Stay',
                    yesTarget: 'close',
                    noText: 'Leave',
                    noTarget: 'leaveFromSignup',
                    onBack: 'close',
                }
                Yup("#popUpFDFS").html(Util.showPopup());	
				Yup("#popup-btn-1").addClass('popupFocus');	}
            }else{
                Main.previousPage();
            }           
		}
		default: {
			break;
		}
	}
}

//auth key Enter
keyHandlar.keyboardEnterHandular=function(){
    var source = Yup('.imageFocus').attr("source");
    var index = parseInt(Yup('.imageFocus').attr("index")); 
    if(source == 'keyPadNumaric'){               
        if(index <=10){
            if(view == 'signin' || view == 'forgetPassword' || view == 'signup'){
                if (Yup(".input-active").val().length < 10) {
                    Yup(".input-active").val(Yup(".input-active").val() + Yup("#numeric-" + index).text());
                }
            }else if(view == 'otpVerification' || view == 'signupOtpVerification'){
                if (Yup(".input-active").val().length < parseInt(systemConfigs.configs.maxOTPLength)) {
                    Yup(".input-active").val(Yup(".input-active").val() + Yup("#numeric-" + index).text());
                }
            }            
        }
        else if(index == 11){ //  Delete
            Yup('.input-active').val(Yup('.input-active').val().substring(0, Yup('.input-active').val().length - 1));  
        }                
    }
    else if(source == 'actionKey'){
        if(index == 12){ //clicked on cancle
            tempObjectData.landingFromSettings = false;
            Main.previousPage();          
        }else if(index == 13){ 	//adding focus to Password
            if(view == 'signin' || view == 'forgetPassword' || view == 'signup'){
                var configMobileRegex = systemConfigs.configs.allowedMobileNumberRegex;
                var validMobileRegex = systemConfigs.configs.validMobileRegex
                var regex ; 
                if(configMobileRegex != undefined){
                    regex =  new RegExp(configMobileRegex);
                } else if(validMobileRegex !=undefined){
                    regex =  new RegExp(validMobileRegex);
                } else {
                    regex = new RegExp("^[0-9]{9}")
                }                                 
                if (regex.test(Yup('.input-active').val())) {
                    Yup("#signInErrLabel-0").text("");	
                    Yup(".input-active").removeClass("errorClass");
                    if(view == 'signin'){
                        Yup('.input-active').removeClass('input-active');
                        Yup('#signInInput-1').addClass('input-active');
                        Yup("#keyLayout").html(Util.genericKeys('signin')); 
                    }else if(view == 'forgetPassword'){
                        tempObjectData.mobileNo= Yup("#signInInput-0").val();                      
                        tempObjectData.context="update_password"
                        Main.sendOTP();
                    }else if(view == 'signup'){
                        Yup('.input-active').removeClass('input-active');
                        Yup('#signInInput-1').addClass('input-active');
                        Yup("#keyLayout").html(Util.genericKeys('signuppassword')); 
                    }                                   
                }
                else {
                    Yup("#signInErrLabel-0").text("Please enter a Valid Mobile number.");
                    Yup(".input-active").addClass("errorClass");
                }   
            }
            else if(view =='otpVerification'){
                var formIndex = parseInt(Yup('.input-active').attr("index"));
                if(formIndex == 0){  // otp form
                   if( (Yup('.input-active').val()).length  <= parseInt(systemConfigs.configs.maxOTPLength) && (Yup('.input-active').val()).length > 3){ //if otp is correct
                        Yup("#signInErrLabel-0").text("");	
                        Yup(".input-active").removeClass("errorClass");    
                        Yup('.input-active').removeClass('input-active');
                        Yup('#signInInput-1').addClass('input-active');
                        Yup("#keyLayout").html(Util.genericKeys('newPassword')); 
                   }
                   else{
                    Yup("#signInErrLabel-0").text("Please enter Valid OTP.");
                    Yup(".input-active").addClass("errorClass");
                   }
                }                
            }
            else if(view == 'signupOtpVerification'){
                if( (Yup('.input-active').val()).length  <= parseInt(systemConfigs.configs.maxOTPLength) && (Yup('.input-active').val()).length > 3){ //if otp is correct
                    Yup("#signInErrLabel-0").text("");	
                    Yup(".input-active").removeClass("errorClass"); 
                    Yup('#signInInput-1').addClass('input-active');
                   //complete rigistation API call
                   if(tempObjectData.context == 'signup') {
                       Main.completeRegistation(Yup('.input-active').val());
                    }
                   else if(tempObjectData.context == 'verify_mobile'){
                       Main.verifyMobile(Yup('.input-active').val());
                    }
                   else { // Non-verified User Sign In After Otp Enter
                    //    tempObjectData.password=(Yup('.input-active').val())
                    //    Main.requestSignIn(false)
                    if(tempObjectData.actionCode == 2 || tempObjectData.actionCode == 4 || tempObjectData.actionCode == -6){
                        Main.verifyOtp(Yup('.input-active').val());
                    }
                    else{
                        tempObjectData.password=(Yup('.input-active').val())
                        Main.requestSignIn(false);
                    }
                    } 
               }
               else{
                Yup("#signInErrLabel-0").text("Please enter Valid OTP.");
                Yup(".input-active").addClass("errorClass");
               }
            }
                            
        }else if(index == 14 ){ 
            if(view == 'signupOtpVerification'){ // click on resend
                Main.resendOTP();
            }
            else{ //click on change countrycode 
                tempObjectData.mobileNo= Yup("#signInInput-0").val();                               
                tempObjectData.context="contry_code"           
                view = 'countryCode';
                Main.processNext();
            }
          
        }
        else if(index == 15 ){ //click on signin in email             
            presentPagedetails.isChecked = false;
            Yup("#mainContent").html('');
            Yup("#mainContent").html(Util.signInHtml('email'));
        }
    }
    else if(source == 'keyPadGenric'){
      if(index == 42){ // clicked on clear
        Yup('.input-active').val(Yup('.input-active').val().substring(0, Yup('.input-active').val().length - 1));  //  Delete
      }
      else if (index == 41){ // cliked on space
        if (Yup(".input-active").val().length < appConfig.passwordMaxLength) {
            Yup('.input-active').val((Yup('.input-active').val().concat(' ')));  // Space 
        }
      }else if(index == 40){ //cliked on special char
        if (Yup("#defaultKeys-40").text() == "!#$") {
            for (var i = 0; i < specialCharArray.length; i++) {
                Yup("#defaultKeys-" + i).html(specialCharArray[i]);                       
            }
            Yup("#defaultKeys-" + 40).html("abc");
        }
        else {
            for (var i = 0; i < characterArray.length; i++) {
                Yup("#defaultKeys-" + i).html(characterArray[i]);                       
            }
            Yup("#defaultKeys-40").html("!#$");
        }                                
      } else if (index == 30) {   // Upto characters
        for (var i = 10; i < 40; i++) {
            if (/^[A-Z]/.test(Yup("#defaultKeys-" + i).text()) && i != 30)
                Yup("#defaultKeys-" + i).text(Yup("#defaultKeys-" + i).text().toLowerCase());
            else if (i != 30)
                Yup("#defaultKeys-" + i).text(Yup("#defaultKeys-" + i).text().toUpperCase());
        }
     }else{
        if (Yup(".input-active").val().length < appConfig.passwordMaxLength) {
            Yup(".input-active").val(Yup(".input-active").val() + Yup("#defaultKeys-" + index).text());
        }
     }
    }
    else if(source == 'actionKeyGen'){
        if(index == 43){  // clicked on previous
            if(view == 'signin'){
                Yup('.input-active').removeClass('input-active');
                Yup('#signInInput-0').addClass('input-active');
                if( presentPagedetails.formType == 'mobile'){
                    Yup("#keyLayout").html(Util.numberKeys('signin'));
                }else{
                    Yup("#keyLayout").html(Util.emailKeys('signin'));
                }
            }
            else if(view == 'otpVerification'){
                var formIndex = parseInt(Yup('.input-active').attr("index")); 
                if(formIndex == 2){ 
                    Yup('.input-active').removeClass('input-active');
                    Yup('#signInInput-1').addClass('input-active');
                    Yup("#keyLayout").html(Util.genericKeys('newPassword')); 
                }
                else if(formIndex == 1){
                    Yup('.input-active').removeClass('input-active');
                    Yup('#signInInput-0').addClass('input-active');
                    Yup("#keyLayout").html(Util.numberKeys('otp'));
                }
            }
            else if(view == 'changePassword'){
                var formIndex = parseInt(Yup('.input-active').attr("index")); 
                if(formIndex == 2){ 
                    Yup('.input-active').removeClass('input-active');
                    Yup('#signInInput-1').addClass('input-active');
                    Yup("#keyLayout").html(Util.genericKeys('newPassword')); 
                }
                else if(formIndex == 1){
                    Yup('.input-active').removeClass('input-active');
                    Yup('#signInInput-0').addClass('input-active');
                    Yup("#keyLayout").html(Util.genericKeys('changePassOld'));
                }else if(formIndex == 0){
                    Main.previousPage();
                }
            } 
            else if(view == 'signup'){
                var formIndex = parseInt(Yup('.input-active').attr("index")); 
                if(formIndex == 2){ 
                    Yup('.input-active').removeClass('input-active');
                    Yup('#signInInput-1').addClass('input-active');
                    Yup("#keyLayout").html(Util.genericKeys('signuppassword')); 
                }
                else if(formIndex == 1){
                    Yup('.input-active').removeClass('input-active');
                    Yup('#signInInput-0').addClass('input-active');
                    Yup("#keyLayout").html(Util.numberKeys('signup'));
                }
            }
        }else if(index == 44){ // clicked on signin /next  
            if(view == 'signin'){                  
                if(/^\S*$/.test(Yup('.input-active').val())){
                    if (Yup('.input-active').val().length >= 4 && Yup('.input-active').val().length <= appConfig.passwordMaxLength) {
                        var validateEmailMobile = utilities.validMobileEmail(Yup("#signInInput-0").val()); 
                        Yup(".input-active").removeClass("errorClass");
                        Yup("#signInErrLabel-1").text('');
                        tempObjectData.mobileNo= Yup("#signInInput-0").val();                      
                        tempObjectData.password = Yup("#signInInput-1").val();   
                        tempObjectData.isMobile =   validateEmailMobile.isMobile;                  
                        Main.requestSignIn(false);
                    }
                    else {
                        Yup("#signInErrLabel-1").text('Password length must be at least 4 and less than ' + (appConfig.passwordMaxLength) +' characters'   );
                        Yup(".input-active").addClass("errorClass");
                    }
                }else{
                    Yup("#signInErrLabel-1").text("Password should not have spaces");
                    Yup(".input-active").addClass("errorClass");
                }
            }else if(view == 'otpVerification'){
                var formIndex = parseInt(Yup('.input-active').attr("index"));
                if(formIndex == 1){  //new password
                    if(/^\S*$/.test(Yup('.input-active').val())){
                        if (Yup('.input-active').val().length >= appConfig.passwordMinLength && Yup('.input-active').val().length <= appConfig.passwordMaxLength) {
                            Yup(".input-active").removeClass("errorClass");                            
                            Yup("#signInErrLabel-1").text('');
                            Yup('.input-active').removeClass('input-active');
                            Yup('#signInInput-2').addClass('input-active');
                            Yup("#keyLayout").html(Util.genericKeys('reenterPassword')); 
                        }
                        else {
                            Yup("#signInErrLabel-1").text('Password length must be at least '+ (appConfig.passwordMinLength ) + ' and less than ' + (appConfig.passwordMaxLength ) +' characters'  );
                            Yup(".input-active").addClass("errorClass");
                        }
                    }else{
                        Yup("#signInErrLabel-1").text("Password should not have spaces");
                        Yup(".input-active").addClass("errorClass");
                    }
                }
                else  if(formIndex == 2){  // reenter new password                    
                    if(Yup('.input-active').val() == Yup("#signInInput-1").val()){
                            Yup(".input-active").removeClass("errorClass");
                            Yup("#signInErrLabel-2").text('');                            
                            tempObjectData.password = Yup("#signInInput-1").val();  
                            Main.verifyOtpForgetPassword(Yup("#signInInput-0").val())                      
                    }else{
                        Yup("#signInErrLabel-2").text("Password Mismatch");
                        Yup(".input-active").addClass("errorClass");                       
                    }
                }
            }
            else if (view == 'changePassword'){
                var formIndex = parseInt(Yup('.input-active').attr("index"));
                if(formIndex == 0){  //old password
                    if(/^\S*$/.test(Yup('.input-active').val())){
                        if (Yup('.input-active').val().length >= appConfig.passwordMinLength && Yup('.input-active').val().length <= appConfig.passwordMaxLength) {
                            Yup(".input-active").removeClass("errorClass");                            
                            Yup("#signInErrLabel-0").text('');
                            Yup('.input-active').removeClass('input-active');
                            Yup('#signInInput-1').addClass('input-active');
                            Yup("#keyLayout").html(Util.genericKeys('newPassword')); 
                        }
                        else {
                            Yup("#signInErrLabel-0").text('Password length must be at least '+ (appConfig.passwordMinLength ) + ' and less than ' + (appConfig.passwordMaxLength ) +' characters'  );
                            Yup(".input-active").addClass("errorClass");
                        }
                    }else{
                        Yup("#signInErrLabel-0").text("Password should not have spaces");
                        Yup(".input-active").addClass("errorClass");
                    }
                } 
                else  if(formIndex == 1){  // enter new password                    
                    if(/^\S*$/.test(Yup('.input-active').val())){
                        if (Yup('.input-active').val().length >= appConfig.passwordMinLength && Yup('.input-active').val().length <= appConfig.passwordMaxLength) {
                            Yup(".input-active").removeClass("errorClass");                            
                            Yup("#signInErrLabel-1").text('');
                            Yup('.input-active').removeClass('input-active');
                            Yup('#signInInput-2').addClass('input-active');
                            Yup("#keyLayout").html(Util.genericKeys('updatePassword')); 
                        }
                        else {
                            Yup("#signInErrLabel-1").text('Password length must be at least '+ (appConfig.passwordMinLength ) + ' and less than ' + (appConfig.passwordMaxLength )+' characters'   );
                            Yup(".input-active").addClass("errorClass");
                        }
                    }else{
                        Yup("#signInErrLabel-1").text("Password should not have spaces");
                        Yup(".input-active").addClass("errorClass");
                    }
                } 
                else  if(formIndex == 2){  // reenter new password                    
                    if(Yup('.input-active').val() == Yup("#signInInput-1").val()){
                            Yup(".input-active").removeClass("errorClass");
                            Yup("#signInErrLabel-2").text('');
                            Main.updatePassword(Yup("#signInInput-0").val(),Yup("#signInInput-1").val());                    
                    }else{
                        Yup("#signInErrLabel-2").text("Password Mismatch");
                        Yup(".input-active").addClass("errorClass");                       
                    }
                }
            }
            else if(view == 'signup'){
                var formIndex = parseInt(Yup('.input-active').attr("index"));
                if(formIndex == 1 ){
                    if(/^\S*$/.test(Yup('.input-active').val())){
                        if (Yup('.input-active').val().length >= appConfig.passwordMinLength && Yup('.input-active').val().length <= appConfig.passwordMaxLength) {
                            Yup(".input-active").removeClass("errorClass");                            
                            Yup("#signInErrLabel-1").text('');
                            Yup('.input-active').removeClass('input-active');
                            Yup('#signInInput-2').addClass('input-active');
                            Yup("#keyLayout").html(Util.genericKeys('confirmPassword')); 
                        }
                        else {
                            Yup("#signInErrLabel-1").text('Password length must be at least '+ (appConfig.passwordMinLength ) + ' and less than ' + (appConfig.passwordMaxLength )+' characters'   );
                            Yup(".input-active").addClass("errorClass");
                        }
                    }else{
                        Yup("#signInErrLabel-1").text("Password should not have spaces");
                        Yup(".input-active").addClass("errorClass");
                    }
                }
                else  if(formIndex == 2){  // reenter new password                    
                    if(Yup('.input-active').val() == Yup("#signInInput-1").val()){
                            Yup(".input-active").removeClass("errorClass");
                            Yup("#signInErrLabel-2").text('');
                            tempObjectData.mobileNo= Yup("#signInInput-0").val();                      
                            tempObjectData.password = Yup("#signInInput-1").val(); 
                           //get otp for signup request   
                            Main.requestSignUpV2();                 
                    }else{
                        Yup("#signInErrLabel-2").text("Password Mismatch");
                        Yup(".input-active").addClass("errorClass");                       
                    }
                }
            }
            
        }else if(index == 45){ //show password
           var isChecked =  Yup("#defaultKeys-45").attr('isChecked');
           if(isChecked == 'no'){
            Yup("#defaultKeys-45").addClass('checked');
            Yup("#defaultKeys-45").attr('isChecked','yes');
            presentPagedetails.isChecked = true;
            document.getElementById('signInInput-1').setAttribute('type','text');   
            if(view == 'otpVerification' || view == 'changePassword' || view == 'signup' )   {
                document.getElementById('signInInput-2').setAttribute('type','text'); 
            } 
            if(view == 'changePassword'){               
                document.getElementById('signInInput-0').setAttribute('type','text');               
            }          
           }else{
            Yup("#defaultKeys-45").removeClass('checked');
            Yup("#defaultKeys-45").attr('isChecked','no');
            presentPagedetails.isChecked = false;
            document.getElementById('signInInput-1').setAttribute('type','password'); 
            if(view == 'otpVerification'  || view == 'changePassword' || view == 'signup' )   {
                document.getElementById('signInInput-2').setAttribute('type','password'); 
            } 
            if(view == 'changePassword'){               
                document.getElementById('signInInput-0').setAttribute('type','password');               
            }                  
           }
        }
    }
    else if(source == 'signupBtn'){
        if(view == 'otpVerification' || view =='signupOtpVerification'){
            Main.resendOTP();
        }
        else if(view == 'signin'){            
            view = 'signup';
            Main.processNext();
        }
        else if(view == 'signup'){
            if( tempObjectData.landingFromSettings == true){
                tempObjectData.landingFromSettings = false;
                view = 'signin';
                Main.processNext();
            }else{
                Main.previousPage();
            }
           
        }
    }
    else if(source == 'keyPadEmail'){
        if(index <=42 || index == 44 || index == 45 || index == 46){ //general keys
            if(index == 30 ){ //upperCase
                for (var i = 10; i < 40; i++) {
                    if (/^[A-Z]/.test(Yup("#emailKeys-" + i).text()) && i != 30)
                        Yup("#emailKeys-" + i).text(Yup("#emailKeys-" + i).text().toLowerCase());
                    else if (i != 30)
                        Yup("#emailKeys-" + i).text(Yup("#emailKeys-" + i).text().toUpperCase());
                }
            }else{
                if((Yup(".input-active").val()).length<63){
                    Yup(".input-active").val(Yup(".input-active").val() + Yup("#emailKeys-" + index).text());  
                    var foo =document.getElementById("signInInput-0");
                    foo.scrollLeft = foo.scrollWidth;                   
                }
            }
        }else if(index == 43){ // special charecters
            if (Yup("#emailKeys-43").text() == "!#$") {
                for (var i = 0; i < specialCharArray.length; i++) {
                    Yup("#emailKeys-" + i).html(specialCharArray[i]);                       
                }
                Yup("#emailKeys-" + 43).html("abc");
            } else {
                for (var i = 0; i < characterArray.length; i++) {
                    Yup("#emailKeys-" + i).html(characterArray[i]);                       
                }
                Yup("#emailKeys-43").html("!#$");
            }    
        }else if(index == 47){ //backSpace
            Yup('.input-active').val(Yup('.input-active').val().substring(0, Yup('.input-active').val().length - 1));  //  Delete
        }
    }
    else if(source == "actionKeyEmail"){       
        if(view == 'signin'){
            if(index == 48){ //clicked on cancle
                tempObjectData.landingFromSettings = false;
                Main.previousPage();
            }
            else if(index ==49){ //clicked on Signin next adding focus to password field 
                var validateEmailMobile = utilities.validMobileEmail(Yup(".input-active").val());
                if (validateEmailMobile.isEmail ==true ) {   //valid Email
                    Yup("#signInErrLabel-0").text("");	
                    Yup(".input-active").removeClass("errorClass");
                    Yup('.input-active').removeClass('input-active');
                    Yup('#signInInput-1').addClass('input-active');
                    Yup("#keyLayout").html(Util.genericKeys('signin')); 
                }else{                   
                    Yup("#signInErrLabel-0").text("Please enter a Valid Email ID.");                   
                    Yup(".input-active").addClass("errorClass");
                }              
            }else if(index ==50) { //clicked on signin with mobile
                presentPagedetails.isChecked = false;
                Yup("#mainContent").html('');
                Yup("#mainContent").html(Util.signInHtml('mobile'));
            }
        }
       
    }
}

//Popup key handular
keyHandlar.popupKeyHandlar = function(event){
    var keycode = (window.event) ? event.keyCode : event.which;    
    var id = Yup('.popupFocus').attr("id"); 
    switch (keycode) {
        case tvKeyCode.ArrowLeft: {
            var splitData = id.split('-');
            if(parseInt(splitData[2]) == 2 && Main.popupData.buttonCount == 2 ){
                Yup("#popup-btn-2").removeClass('popupFocus');	
                Yup("#popup-btn-1").addClass('popupFocus');
            }
            break;
        }
        case tvKeyCode.ArrowRight: {
            var splitData = id.split('-');
            if(parseInt(splitData[2]) == 1 && Main.popupData.buttonCount == 2){
                Yup("#popup-btn-1").removeClass('popupFocus');	
                Yup("#popup-btn-2").addClass('popupFocus');
            }
            break;
        }       
        case 8:
        case tvKeyCode.Return: {
            if(Main.popupData){
                if(Main.popupData.onBack == 'close'){
                    Yup("#popUpFDFS").html('');
                    Main.popupData = {};	
                }
                else if(target=='navigateBack'){
                    Yup("#popUpFDFS").html('');
                    Main.popupData = {};
                    Main.previousPage();
                }
                else if(target == 'goto_signin_from_password_reset'){
                    Yup("#popUpFDFS").html('');
                    Main.popupData = {};
                    backData.pop();
                    Main.previousPage();
                }   else if(target == 'exit'){
                    Yup("#popUpFDFS").html('');
                    Main.popupData = {};
                    toast.application.exit();
                }
                else if(target=='navigateBackFromPlayer'){
                    Yup("#popUpFDFS").html('');
                    Main.popupData = {};
                    try {
                        media.stop();
                        media.unsetListener();
                    }
                    catch (e) { }
                    Main.previousPage();
                }                
            }
            break;
        }
        case tvKeyCode.Enter: {
            keyHandlar.popupEnterHandlar(id);
            break;
         } 
        default :{
            break;
        } 
    }
}

//Popup Enter Key Handular
keyHandlar.popupEnterHandlar =function(id){
    var btnType = Yup('#'+id).attr("btnType"); 
    var target = (btnType == 'yes') ? Main.popupData.yesTarget : Main.popupData.noTarget;
    if(target == 'close'){
        Yup("#popUpFDFS").html('');
        Main.popupData = {};
    }
    else if(target == 'exit'){
        Yup("#popUpFDFS").html('');
        Main.popupData = {};
        toast.application.exit();
    }  
    else if(target == 'leaveFromSignup'){
        Main.stopTimer(); 
        Yup("#popUpFDFS").html('');
        Main.popupData = {};
        Main.previousPage();
    }
    else if(target == 'leaveFromOTP'){
        Main.stopTimer(); 
        Yup("#popUpFDFS").html('');
        Main.popupData = {};
        tempObjectData.context = '';
        Main.previousPage();
    }
    else if(target == 'forceLogin'){
        Yup("#popUpFDFS").html('');
        Main.popupData = {};
        Main.requestSignIn(true);
    }
    else if(target == 'sessionLogout'){
        Yup("#popUpFDFS").html('');
        Main.popupData = {};
        Main.BOXID='';
        Main.sessionID='';
        backData = [];
        presentPagedetails = {};
        popupData ={};
        clickedMenu = {};
        commingFromMenus = false;
        isUserSignedOutinThisSession=true;
        utilities.setLocalStorage('sessionID','');
        utilities.setLocalStorage('boxNo','');
        Main.getSessionAPI({type:'config'} , Main.getConfig);
    }
    else if(target == 'signOut'){
        Yup("#popUpFDFS").html('');
        Main.popupData = {};
        Main.signout();
    } 
    else if(target == 'goto_signin_from_password_reset'){
        Yup("#popUpFDFS").html('');
        Main.popupData = {};
        backData.pop();
        Main.previousPage();
    }else if(target=='resume'){
        if (presentPagedetails.view == 'player') {
            analytics.plugin.handlePlayEndedByUser();
            try {
                media.pause();
                media.stop();
                media.unsetListener();
            }
            catch (e) { }
        }
        Yup("#popUpFDFS").html('');
        view = 'player';
        Main.addBackData( Main.popupData.responseArray.targetPath, Main.popupData.result);
        presentPagedetails = Main.popupData.responseArray;
        presentPagedetails.isResume = true;    
        Main.popupData = {};
        Player.callingPlayer();
    }
    else if(target=='startOver'){
        if (presentPagedetails.view == 'player') {
            analytics.plugin.handlePlayEndedByUser();
            try {
                media.pause();
                media.stop();
                media.unsetListener();
            }
            catch (e) { }
        }
        Yup("#popUpFDFS").html('');
        view = 'player';
        Main.addBackData( Main.popupData.responseArray.targetPath, Main.popupData.result);
        presentPagedetails = Main.popupData.responseArray;
        presentPagedetails.isResume = false;   
        Main.popupData = {};
        Player.callingPlayer();
    }
    else if(target=='navigateBack'){
        Yup("#popUpFDFS").html('');
        Main.popupData = {};
        Main.previousPage();
    }
    else if(target=='navigateBackFromPlayer'){
        Yup("#popUpFDFS").html('');
        Main.popupData = {};
        try {
            media.stop();
            media.unsetListener();
        }
        catch (e) { }
        Main.previousPage();
    }else if(target ==  'gotosignin'){
        Yup("#popUpFDFS").html('');
        Main.popupData = {};
        view='signin';
        Main.processNext();
    }
    else if(target == 'gotoMobileVerification'){
        Yup("#popUpFDFS").html('');
        Main.popupData = {};    
        Main.verifyOtpGenral();   
    }
    else if(target=='tryAgainConfig'){
        Yup("#popUpFDFS").html('');
        Main.popupData = {};
        Main.getConfig();
    }else if(target=='tryAgainSession'){
        Yup("#popUpFDFS").html('');
        Main.popupData = {};
        Main.getSessionAPI(Main.popupData.callbackData,Main.popupData.callback);
    }
}

//countryCode keyHandular
keyHandlar.countryCodeKyeHandular =function(event){
    var keycode = (window.event) ? event.keyCode : event.which;    
    var id = Yup('.imageFocus').attr("id"); 
    var index = parseInt(Yup('.imageFocus').attr("index"));
    switch (keycode) {
        case tvKeyCode.ArrowDown: {
            if((index+1) < countryList.length){
                if ((index)> 4) {
                    Yup('#country-' + (index - 5)).hide();
                }
                Yup('.imageFocus').removeClass("imageFocus");                   
                Yup('#country-'+(index+1)).addClass("imageFocus");
            }           
            break;
        }
        case tvKeyCode.ArrowUp: {
            if(index != 0){
                if( index > 5 ){
                    Yup("#country-"+(index-6) ).show(); 
                }
                Yup('.imageFocus').removeClass("imageFocus");                   
                Yup('#country-'+(index-1)).addClass("imageFocus");
            }
            break;
        }
        case tvKeyCode.Enter: {
            keyHandlar.countryCodeEnterHandular(id);
            break;
        }
        case 8:
		case tvKeyCode.Return: {
            Main.previousPage();
            break;
        }
        default: {
			break;
        }
    }        
}

keyHandlar.countryCodeEnterHandular =function(id){
    var index = parseInt(Yup('#'+id).attr("index"));
    if(index >=0){
        Main.countryCode = countryList[index].isdCode;
        Main.countryFlag = countryList[index].iconUrl;
        Main.mobileCode = countryList[index].isdCode;
        utilities.setLocalStorage('countryCode',Main.countryCode);  
        Main.previousPage();
    }
   
}

keyHandlar.accountKeydown = function (e) {
    var keycode = (window.event) ? e.keyCode : e.which;
    var source = Yup('.imageFocus').attr("source");
    var id = Yup('.imageFocus').attr("id");   
	switch (keycode) {
		case tvKeyCode.ArrowLeft: {
            var splitData = id.split('-');
            if(source == "menus" || source == "search"){ 
                keyHandlar.menuKeyHandular(id,e);              
            } 
            else{
                var previousTabId = Yup(".toptab.active").attr('id'); 
                var splitDataLocal = previousTabId.split('-')
                if(splitDataLocal[1] == "1"){  //languages
                    if(id != 'lang-update' && id!='lang-cancel'){             
                        if((parseInt(splitData[2]))%4 == 0 ){
                            Yup(".imageFocus").removeClass("imageFocus");
                            Yup("#account-1-0").addClass("imageFocus");
                        }else{
                            Yup(".imageFocus").removeClass("imageFocus");
                            Yup("#accountContent-"+splitData[1] +'-'+(parseInt(splitData[2]) - 1) ).addClass("imageFocus");
                        }
                    }else if(id == 'lang-update'){
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#lang-cancel").addClass("imageFocus");
                    }else if(id== 'lang-cancel'){
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#account-1-0").addClass("imageFocus");
                    }                
                }
                else if (splitDataLocal[1] == "0") { // accountDetails
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#account-0-0").addClass("imageFocus");
                } 
            }            
           
            
			break;
		}
		case tvKeyCode.ArrowRight: {
            var splitData = id.split('-');
            if (source == "headTab") {
                var idlocal = Yup(".toptab.active").attr("id");
                var splitDataLocal = idlocal.split('-');
                if(parseInt(splitDataLocal[1]) == 0 ){ // account details
                    if (!!presentPagedetails.settingsActivepackages && presentPagedetails.settingsActivepackages.length > 0) {
                       if(presentPagedetails.sectionIndex &&  presentPagedetails.sectionIndex[0]){
                            Yup(".imageFocus").removeClass("imageFocus");
                            Yup("#accountContent-0-"+ presentPagedetails.sectionIndex[0] ).addClass("imageFocus"); 
                       }else{
                            Yup(".imageFocus").removeClass("imageFocus");
                            Yup("#accountContent-0-0").addClass("imageFocus"); 
                       }
                                         
                    }
                }else if(parseInt(splitDataLocal[1]) == 1){ //lang selection                   
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#accountContent-1-0").addClass("imageFocus");                   
                } 
            }                  
            else if(source == "langSelection"){    
                if(id != 'lang-update' && id!='lang-cancel'){            
                    var count = systemConfigs.contentLanguages.length - 1 ;
                    if(parseInt(splitData[2]) < count ){
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#accountContent-"+splitData[1] +'-'+(parseInt(splitData[2]) + 1) ).addClass("imageFocus");
                    }
                }else if(id=='lang-cancel'){
                    Yup(".imageFocus").removeClass("imageFocus");
					Yup("#lang-update").addClass("imageFocus");
                }
            }
            if(source == "menus" || source == "search"){ 
                keyHandlar.menuKeyHandular(id,e);              
            } 
			break;
		}
		case tvKeyCode.ArrowUp: {
            var activeTabId = Yup('.toptab.active').attr('id');
			if (source == "headTab") {			
                var splitData = id.split('-');
                if(parseInt(splitData[1]) >0)	{		
                    Yup('.imageFocus').removeClass("imageFocus");
                    Yup('#account-'+(parseInt(splitData[1])-1)+'-0').addClass("imageFocus");		
                }else{ //if it is firt menu                   
                    keyHandlar.menuKeyHandular(id,e);                     
                }
            }          
            else if (source == "accountContent") {
                var splitData = id.split('-');
                if(activeTabId == 'account-0-0'){  // active pacakges tab
                    if (parseInt(splitData[2]) >0 ) {
                        Yup('.imageFocus').removeClass("imageFocus");
                        Yup('#accountContent-0-' + (parseInt(splitData[2]) - 1)).addClass("imageFocus");
                        keyHandlar.addSectionKeyIndex(0,parseInt(splitData[2]) - 1);
                        if( parseInt(splitData[2])>= 2 ){
                            Yup("#accountContent-0-"+(parseInt(splitData[2])-2) ).show(); 
                        }
                    }
                }
				
            }
            else if (source == "accountSignin") {                
                //adding focus to menus 
                keyHandlar.menuKeyHandular(id,e);
            }
            else if(source == "langSelection"){
                var count = systemConfigs.contentLanguages.length -1 ;
                if(id != 'lang-update' && id!='lang-cancel'){
                    var splitData = id.split('-'); 
                    if(parseInt(splitData[2])- 4 >= 0 ){
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#accountContent-"+splitData[1] +'-'+(parseInt(splitData[2]) - 4) ).addClass("imageFocus");
                    }                                       
                }else{
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#accountContent-1"+'-'+count).addClass("imageFocus");
                }
            }
			break;
		}
		case tvKeyCode.Enter: {
			keyHandlar.accountKeyEnter(id);
			break;
		}
		case tvKeyCode.ArrowDown: {
            var activeTabId = Yup('.toptab.active').attr('id');
            if(source == "menus" || source == "search"){               
                keyHandlar.menuKeyHandular(id,e);        
            }
			else if (source == "headTab") {	
                var splitData = id.split('-');
                if(parseInt(splitData[1]) <2)	{		
                    Yup('.imageFocus').removeClass("imageFocus");
                    Yup('#account-'+(parseInt(splitData[1])+1)+'-0').addClass("imageFocus");		
                }		
            }
            else if (source == "accountContent") {
                var count = parseInt(Yup(".imageFocus").attr("count"));
                var splitData = id.split('-');

                if(activeTabId == 'account-0-0'){  // active pacakges tab
                    if (parseInt(splitData[2]) < (presentPagedetails.settingsActivepackages.length -1) ) {
                        Yup('.imageFocus').removeClass("imageFocus");
                        Yup('#accountContent-0-' + (parseInt(splitData[2]) + 1)).addClass("imageFocus");
                        keyHandlar.addSectionKeyIndex(0,parseInt(splitData[2]) + 1);
                        if( parseInt(splitData[2])>= 2 ){
                            Yup("#accountContent-0-"+(parseInt(splitData[2])-2) ).hide(); 
                        }
                    }
                }

            }
            else if(source == "langSelection"){
                if(id != 'lang-update' && id!='lang-cancel'){
                    var splitData = id.split('-');
                    var count = systemConfigs.contentLanguages.length -1 ;
                    if(parseInt(splitData[2])+ 4 <= count ){
                        Yup(".imageFocus").removeClass("imageFocus");
                        Yup("#accountContent-"+splitData[1] +'-'+(parseInt(splitData[2]) + 4) ).addClass("imageFocus");
                    }else {
                        lastRowCount = count % 4;
                        if(parseInt(splitData[2]) >= count - lastRowCount ){
                            Yup(".imageFocus").removeClass("imageFocus");
                            Yup("#lang-update").addClass("imageFocus");
                        } else{
                            Yup(".imageFocus").removeClass("imageFocus");
                            Yup("#accountContent-"+splitData[1] +'-'+count).addClass("imageFocus");
                        }  
                    }
                }
                
            }
			break;
		}
		case 8:
		case tvKeyCode.Return: {
            if(intiLangSel==false){
                tempScroll = 0;
                window.scrollTo(0, 0);
                Main.previousPage();
            }
		}
		default: {
			break;
		}
	}
}

keyHandlar.accountKeyEnter=function(id){
    var source = Yup('#'+id).attr("source");
    var splitData = id.split('-');
	if (source == "headTab") {
        var previousTabId = Yup(".toptab.active").attr('id'); 
        if(previousTabId  != id){
            Yup(".toptab.active").removeClass("active");
            Yup(".imageFocus").removeClass('imageFocus');
            Yup("#account-"+splitData[1] +'-'+splitData[2]).addClass("imageFocus");
            Yup("#account-"+splitData[1] +'-'+splitData[2] ).addClass("active");
            switch (splitData[1]) {
                case "0": {  //account details
                    presentPagedetails.sectionIndex={};
                    Yup('.account-page').html('');
                    Yup(".account-page").html(Util.profileInfo());
                    break;
                }
                case "1":{  // languages
                    Yup('.account-page').html('');
                    Yup('.account-page').html(Util.languagesListHTML());
                    break;
                }
                case "2":{ //signout
                    utilities.signOutPopupDetails();
                    break;
                }             
            }
        }
		
    }
    else if(source=='accountSignin')  {
        view = "signin";       
        Main.processNext();
    }
    else if (source == "accountContent") {
        var elementType = Yup('#'+id).attr('type');
        if(elementType == 'changePassword'){
            view = "changePassword";
            Main.processNext();
        }       
    }   
    else if (source== "langSelection" ){
        if(id=='lang-update'){
            Yup(".imageFocus").removeClass('imageFocus');
            Yup("#"+id).addClass('imageFocus');
            var objectData = document.getElementsByClassName("langItem selected");
            var finalData= [];
            if(objectData){
                for(var i=0;i<objectData.length;i++){
                    finalData.push(objectData[i].attributes["value"].value);
                }
            }
            if(finalData.length > 0 ){
                finalData =finalData.join(','); 
                Main.updateLanguagePreference(finalData);              
            }else{              
                utilities.genricPopup('Select atleast one Language','info');              
            }
            

        }else if(id == 'lang-cancel'){ // clearing all selection
            var objectData = document.getElementsByClassName("langItem selected");
            
            if(objectData){
                var localObjData = [];
                for(var i=0;i<objectData.length;i++){    
                    localObjData.push(objectData[i].id);                    
                }
                for(var i=0;i<localObjData.length;i++){ 
                    Yup("#"+ localObjData[i]).attr("isSelected","false"); 
                    Yup("#"+ localObjData[i]).removeClass("selected");
                }
            }
        }
        else{
            Yup(".imageFocus").removeClass('imageFocus');
            Yup("#"+id).addClass('imageFocus');
            var isSelected =  Yup("#"+id).attr("isSelected");
            if(isSelected == 'true'){
                Yup("#"+id).attr("isSelected","false");
                Yup("#"+id).removeClass("selected");
            }else{
                Yup("#"+id).attr("isSelected","true");
                Yup("#"+id).addClass("selected");
            }
        }
    }else if(source == "menus" || source == "search"){
        keyHandlar.menuKeyEnterHandular(id);
    }
}

// Player KeyHandler
keyHandlar.playKeydown =function(event){
    var keycode = (window.event) ? event.keyCode : event.which;    
    var id = Yup('.imageFocus').attr("id");
    var source = Yup('.imageFocus').attr("source");
    switch (keycode) {
        case tvKeyCode.MediaPlayPause: {
            Player.playOrPause();
            break;
        }
        case tvKeyCode.ArrowLeft: {
            if(presentPagedetails.constrolsShow == false){
                Player.showPlayerDetails();
                return;
            }
            if(presentPagedetails.constrolsShow == true){
                Player.showPlayerDetails();               
            }
            if (source == "sections") {
                var splitData = id.split('-');
                if(parseInt(splitData[2]) != 0 ){
                    Yup(".imageFocus").removeClass("imageFocus");                  
                    Yup("#sectionItem-"+splitData[1] +'-'+(parseInt(splitData[2]) - 1) ).addClass("imageFocus");
                    keyHandlar.addSectionKeyIndex(parseInt(splitData[1]),parseInt(splitData[2])-1);
                    keyHandlar.liveScrollLeft(parseInt(splitData[1]),parseInt(splitData[2]) );
                }
            }
            else if(source == 'seekbar'){
                Player.seekTo('prev','');
            }
            // else if(source == 'playPauseIcon'){
            //     Yup(".imageFocus").removeClass("imageFocus");
            //     Yup("#playstartbtn").addClass('imageFocus');
            // }
            // else if(source == 'favourites'){
            //     Yup(".imageFocus").removeClass("imageFocus");
            //     Yup("#favText").hide();
            //     Yup("#playstartbtn").addClass('imageFocus');
            // }
            else if(source == 'playnextbtn'){
                Yup(".imageFocus").removeClass("imageFocus");
                Yup("#playstartbtn").addClass('imageFocus');
            }
            break;
        }
        case tvKeyCode.ArrowRight: {
            if(presentPagedetails.constrolsShow == false){
                Player.showPlayerDetails();
                return;
            }
            if(presentPagedetails.constrolsShow == true){
                Player.showPlayerDetails();               
            }
            if (source == "sections") {
                var splitData = id.split('-');
                if(parseInt(splitData[2]) <  presentPagedetails.sections[parseInt(splitData[1])].sectionControls.dataLength -1 ){
                    Yup(".imageFocus").removeClass("imageFocus");                  
                    Yup("#sectionItem-"+splitData[1] +'-'+(parseInt(splitData[2]) + 1) ).addClass("imageFocus");
                    keyHandlar.addSectionKeyIndex(parseInt(splitData[1]),parseInt(splitData[2])+1);
                    keyHandlar.liveScrollRight(parseInt(splitData[1]),parseInt(splitData[2]));
                }
            }
            else if(source == 'seekbar'){
                Player.seekTo('next','');
            }
            // else if(source == 'playPauseIcon'){
            //     if(presentPagedetails.favButtonAdded == true){
            //         Yup(".imageFocus").removeClass("imageFocus");
            //         Yup("#favIcon").addClass('imageFocus');
            //         Yup("#favText").show();
            //     }
            // }
            else if(source == 'playstartbtn'){
                // Yup(".imageFocus").removeClass("imageFocus");
                // Yup("#playPauseIcon").addClass('imageFocus');
                if(presentPagedetails.attributes.contentType=='tvshowepisode' && presentPagedetails.nextVideoDetails.length>0){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#playnextbtn").addClass('imageFocus');
                }
            }
            break;
        } case tvKeyCode.ArrowUp: {
            if(presentPagedetails.constrolsShow == false){
                Player.showPlayerDetails();
                return;
            }else{
                Player.showPlayerDetails();
            }
            if(source =='seekbar' || source =='vodTitle'){
                Yup(".imageFocus").removeClass("imageFocus");
                if (presentPagedetails.sections && presentPagedetails.sections.length > 0) {
                    Yup(".imageFocus").removeClass("imageFocus"); 
                    Player.showSuggsnControls();                      
                    if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[0]){
                        Yup("#sectionItem-0-"+presentPagedetails.sectionIndex[0] ).addClass("imageFocus"); 
                    }else{
                        Yup("#section-"+ (presentPagedetails.sections.length-1)).show();
                        Yup("#sectionItem-"+(presentPagedetails.sections.length-1)+"-0" ).addClass("imageFocus");
                    }
                } 
             }
            else if(source=='playPauseIcon' || source == 'favourites' || source == 'playstartbtn' || source == 'playnextbtn'){
                Yup(".imageFocus").removeClass("imageFocus");
                Yup("#seekbar").addClass("imageFocus");
            }
            else if(source=='sections'){
                var splitData = id.split('-'); 
                if(parseInt(splitData[1]) != 0){
                    Yup("#section-"+ (parseInt(splitData[1])-1)).show();
                    Yup(".imageFocus").removeClass("imageFocus");  
                    if(presentPagedetails.sectionIndex &&  presentPagedetails.sectionIndex[parseInt(splitData[1])-1]){                           
                        Yup("#sectionItem-"+(parseInt(splitData[1])-1)+"-"+presentPagedetails.sectionIndex[parseInt(splitData[1])-1] ).addClass("imageFocus");
                    }else{
                        Yup("#sectionItem-"+(parseInt(splitData[1])-1)+"-0" ).addClass("imageFocus");
                    }
                    Yup("#section-"+ (parseInt(splitData[1]))).hide();
                    //pagination
                    // if(parseInt(splitData[1]) == presentPagedetails.sections.length -3 && presentPagedetails.paginationSections &&  presentPagedetails.paginationSections.length > 0){
                    //     Main.getPaginationsections();
                    // }                    
                } 
            }
            break;
        }
        case tvKeyCode.Enter: {
            keyHandlar.playEnterKeydown(id);
            break;
        }
        case tvKeyCode.MediaPlay: {
            if (presentPagedetails.steamResponse.analyticsInfo.contentType !="live"){
            Player.play();
            analytics.plugin.handleResume();
            }
            break;
        }
        case tvKeyCode.MediaStop: {  
            Main.playerHideLoading();
            analytics.plugin.handlePlayEndedByUser();
            media.pause();
            media.stop();
            media.unsetListener();
            Main.previousPage();          
            break;
        }
        case tvKeyCode.MediaPause: {
            if (presentPagedetails.steamResponse.analyticsInfo.contentType !="live"){
            Player.pause();
            analytics.plugin.handlePause();
            }
            break;
        }
        case tvKeyCode.MediaFastForward: {
            if(presentPagedetails.constrolsShow == false){
                Player.showPlayerDetails();
                return;
            }
            Player.seekTo('next','mediaFast');
            break;
        }
        case tvKeyCode.MediaRewind:
        case tvKeyCode.MediaBackward: {
            if(presentPagedetails.constrolsShow == false){
                Player.showPlayerDetails();
                return;
            }
            Player.seekTo('prev','mediaSlow');
            break;
        }
        case tvKeyCode.ArrowDown: {
            if(presentPagedetails.constrolsShow == false){
                Player.showPlayerDetails();
                return;
            }else{
                Player.showPlayerDetails();
            }
            if(source =='seekbar'){
                // Add Focus to Start Over Button
                Yup(".imageFocus").removeClass("imageFocus");
                Yup("#playstartbtn").addClass('imageFocus');
                // Yup("#playPauseIcon").show();
                // Yup("#playPauseIcon").addClass("imageFocus");
            }
            // if(source =='vodTitle'){
            //     Yup(".imageFocus").removeClass("imageFocus");
            //     // Yup(".playSugestions").addClass("visible");                        
            //     if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[0]){
            //         Yup("#sectionItem-0-"+presentPagedetails.sectionIndex[0] ).addClass("imageFocus"); 
            //     }else{
            //         Yup("#sectionItem-0-0" ).addClass("imageFocus");
            //     }
            // }
            // else if(source=='playPauseIcon' || source == 'favourites' || source == 'playstartbtn'){
            //     if (presentPagedetails.sections && presentPagedetails.sections.length > 0) {
            //         Yup(".imageFocus").removeClass("imageFocus");
            //         Yup("#seekbar").hide();
            //         Yup(".playSugestions").addClass("visible");                        
            //         if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[0]){
            //             Yup("#sectionItem-0-"+presentPagedetails.sectionIndex[0] ).addClass("imageFocus"); 
            //         }else{
            //             Yup("#sectionItem-0-0" ).addClass("imageFocus");
            //         }
            //     }
            // }
            else if(source=='sections'){
                var splitData = id.split('-'); 
                if(parseInt(splitData[1]) == (presentPagedetails.sections.length-1)){
                //   Yup(".visible").removeClass("visible");
                  Yup(".imageFocus").removeClass("imageFocus");
                //   if (presentPagedetails.steamResponse.analyticsInfo.contentType != "live") {
                //     Yup("#seekbar").show();
                //     Yup("#playPauseIcon").show();
                //     Yup("#playPauseIcon").addClass("imageFocus");
                //   }else {
                //     Yup(".vod-title").addClass("imageFocus");
                //    } 
                Player.showControls();
                if (presentPagedetails.steamResponse.analyticsInfo.contentType !="live") {
                    Yup("#seekbar").addClass("imageFocus");   
                } 
                }else{    
                    Yup("#section-"+ (parseInt(splitData[1])+1)).show();
                    Yup("#section-"+ (parseInt(splitData[1])-1)).hide();
                    Yup(".imageFocus").removeClass("imageFocus");  
                    if(presentPagedetails.sectionIndex &&  presentPagedetails.sectionIndex[parseInt(splitData[1])+1]){                           
                        Yup("#sectionItem-"+(parseInt(splitData[1])+1)+"-"+presentPagedetails.sectionIndex[parseInt(splitData[1])+1] ).addClass("imageFocus");
                    }else{
                        Yup("#sectionItem-"+(parseInt(splitData[1])+1)+"-0" ).addClass("imageFocus");
                    }
                }
            }
            break;
        }
        case 8:
        case tvKeyCode.Return: {
            if(presentPagedetails.constrolsShow == true){
                Player.hidePlayerDetails();
                return;
            }else{
                Main.playerHideLoading();
                analytics.plugin.handlePlayEndedByUser();
                try {
                    media.pause();
                    media.stop();
                    media.unsetListener();
                }
                catch (e) { }
                Main.previousPage();
            }           
            break;
        }
        default: {
            break;
        }
    }
}

keyHandlar.playEnterKeydown = function (id) {
    if (presentPagedetails.constrolsShow == true) {
        Player.showPlayerDetails();
        //content enter and seek ener later.
        var source = Yup('#'+id).attr("source");
        if(source=='playPauseIcon'){
            Player.playOrPause();
        }
        else if(source == 'playstartbtn'){ // playing from start
            Main.playerShowLoading();
			Player.playerState = 'buffering';
			Player.HandleBufferingEvent();
			media.seekTo(0);
        }
        else if(source == 'playnextbtn'){ // playing Next Video
            Main.apiCall(presentPagedetails.nextVideoDetails[0].target.path);
        }
        else if(source == 'favourites'){ // fav clicking
            if(presentPagedetails.pageButtons.isFavourite == true){
                //remove from fav
                presentPagedetails.pageButtons.isFavourite = false;
                Yup('#favIcon').removeClass("addedFav");
                Yup('#favIcon').addClass("remFav");
                Yup("#favText").text("Add to Favorites");
                Main.addToFav(presentPagedetails.targetPath,2);
            }else{
                //add to fav
                presentPagedetails.pageButtons.isFavourite = true;
                Yup('#favIcon').removeClass("remFav");
                Yup('#favIcon').addClass("addedFav");
                Yup("#favText").text("Remove from Favorites");
                Main.addToFav(presentPagedetails.targetPath,1);
            }
        }
        else if(source == 'sections'){
            var targetPath =  Yup('#'+id).attr("targetpath");
            Main.apiCall(targetPath);
        }
        else if(source == 'seekbar'){
            Player.playOrPause();
        }
    }else{
        Player.playOrPause();
        Player.showPlayerDetails();
    }
}

keyHandlar.uniqueKeydown =function(event){
    var keycode = (window.event) ? event.keyCode : event.which;  
    var id = Yup('.imageFocus').attr("id");
    var splitData = id.split('-');
    switch (keycode) {   
        case tvKeyCode.ArrowUp: {
            break;
        } 
        case tvKeyCode.ArrowDown: {
            break;
        } 
        case tvKeyCode.ArrowLeft: {
            if(view == 'introPageView'){
                if(parseInt(splitData[1]) > 0){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#button-"+(parseInt(splitData[1]) - 1)).addClass('imageFocus');
                }
            }
            break;
        }
        case tvKeyCode.ArrowRight: {
            if(view == 'introPageView'){
                if(parseInt(splitData[1]) <(presentPagedetails.introPageBtnsLength-1)){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#button-"+(parseInt(splitData[1]) + 1)).addClass('imageFocus');
                }
            }
            break;
        }
        case 8:
        case tvKeyCode.Return:{
            if(view == 'introPageView'){
                Main.popupData ={
                    popuptype : 'noData',
                    message : 'Are you sure want to exit '+appConfig.appName,
                    buttonCount : 2,
                    yesText : 'No',
                    yesTarget : 'close',
                    noText : 'Yes',
                    noTarget : 'exit',
                    onBack : 'close'
                }
                Yup("#popUpFDFS").html(Util.showPopup());	
                Yup("#popup-btn-1").addClass('popupFocus');	
            }else if(view == 'signout'){
                view = '';                
                isUserSignedOutinThisSession=false;
                Main.getLocation();
            }
            break;
        } 
        case tvKeyCode.Enter: {
            if(view == 'signout'){
                view = '';
                isUserSignedOutinThisSession=false;
                Main.getLocation();
            }else if(view == 'signinSuccess' || view=='noPackageView'){
                Main.previousPage();
            }
            else if(view == 'introPageView'){
                var targetpath = Yup('.imageFocus').attr("targetpath");
                if(targetpath == 'signin') {
                    view = "signin";
                    Main.processNext();
                }else if(targetpath == 'otp'){
                    view = "otpVerification";
                    Main.processNext();
                }  
                //Main.apiCall(firstMenu);
            }
            break;
        }
        default: {
            break;
        }
    }       
   
}

keyHandlar.menuKeyHandular =function(id,event){
    var keycode = (window.event) ? event.keyCode : event.which;  
    var source = Yup('#'+id).attr("source");
    switch (keycode) {   
        case tvKeyCode.ArrowUp: {
            Yup(".imageFocus").removeClass("imageFocus"); 
            if(presentPagedetails.menuIndex){                       
                Yup("#menu-" + presentPagedetails.menuIndex ).addClass("imageFocus");
            }else{
                Yup("#menu-0" ).addClass("imageFocus");
                keyHandlar.addMenuKeyIndex(0);
            }
            break;
        } 
        case tvKeyCode.ArrowDown: { 
            var splitData = id.split('-');
            if(view == 'accountDetails'){
                newId = parseInt(splitData[1]);
                keyHandlar.addMenuKeyIndex(newId);
                Yup(".imageFocus").removeClass("imageFocus");
                Yup("#account-0-0").addClass("imageFocus");       
            } 
            else if(presentPagedetails.banners.length > 0){  
                newId = parseInt(splitData[1]);
                keyHandlar.addMenuKeyIndex(newId);
                Yup(".imageFocus").removeClass("imageFocus");
                Yup(".middleBanner").addClass("imageFocus");    
            }
            else if(presentPagedetails.sections.length >0){
                newId = parseInt(splitData[1]);
                keyHandlar.addMenuKeyIndex(newId);
                Yup(".imageFocus").removeClass("imageFocus");
                if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[0]){
                    Yup("#sectionItem-0-"+presentPagedetails.sectionIndex[0] ).addClass("imageFocus");                    
                }else{
                    Yup("#sectionItem-0-0" ).addClass("imageFocus");
                }
            }         
            break;
        } 
        case tvKeyCode.ArrowLeft: {
            var splitData = id.split('-');
            if(parseInt(splitData[1]) != 0 && source != "search" ){
                for (var i = 0; i < presentPagedetails.menusList.length; i++) {
                    if((Yup('.menus-list').position().left) == (Yup('#menu-'+i).position().left)){
                        if(Yup("#menu-"+(i-1)).css('display')=='none'){
                        Yup("#menu-"+(i-1)).show();
                        break;
                        }
                    }
                }
                Yup(".imageFocus").removeClass("imageFocus");
                var newId = parseInt(splitData[1]) - 1;
                Yup("#menu-"+newId ).addClass("imageFocus");
                keyHandlar.addMenuKeyIndex(newId);
            }else if(parseInt(splitData[1]) == 0 && source != "search") {
                Yup(".imageFocus").removeClass("imageFocus");
                Yup(".btn-search").addClass("imageFocus");
            }
            break;
        }
        case tvKeyCode.ArrowRight: {
            var splitData = id.split('-');
            if(source == "search"){
                if(presentPagedetails.menusList && presentPagedetails.menusList.length >0 ){
                    Yup(".imageFocus").removeClass("imageFocus");
                    Yup("#menu-0").addClass("imageFocus");
                }               
            }else if(parseInt(splitData[1]) <= (presentPagedetails.menusList.length-1) ){
                var newId = parseInt(splitData[1]) + 1;
                if(Yup('#menu-'+newId).position().left > Yup(".menuArea").width()){
                    for (var i = 0; i < presentPagedetails.menusList.length; i++) {
                        if((Yup('.menus-list').position().left) == (Yup('#menu-'+i).position().left)){
                            Yup("#menu-"+i).hide();
                            break;
                        }
                    }
                }
                Yup(".imageFocus").removeClass("imageFocus");
                Yup("#menu-"+newId ).addClass("imageFocus");
                keyHandlar.addMenuKeyIndex(newId);
            }
            break;
        }        
        case tvKeyCode.Enter: {   
            keyHandlar.menuKeyEnterHandular(id);       
        }
        default: {
            break;
        }
    }       
}

keyHandlar.menuKeyEnterHandular = function(id){
    var source = Yup('#'+id).attr("source");
    if(source == "search"){
        view = "search";
        Main.processNext();
    }else{
        var targetPath =  Yup('#'+id).attr("targetpath");
        Yup(".menus-list-item").removeClass("active");
        Yup('#'+id).addClass("active");
        if(targetPath != 'settings'){
            var clickedMenuIndex =  Yup('#'+id).attr("index");
            commingFromMenus = true;
            presentPagedetails.pageReload =true;
            clickedMenu = presentPagedetails.menusList[clickedMenuIndex];
            clickedMenu['index']=clickedMenuIndex;
            Main.apiCall(targetPath);
        }else if(targetPath == 'settings'){
            view = "accountDetails";
            Main.processNext();
        }
    }
    
}

keyHandlar.menuActiveHandular = function(){
    if(presentPagedetails.menusList && presentPagedetails.menusList.length){
        var objectData = document.getElementsByClassName("menus-list-item");
        for(var i=0;i<objectData.length;i++){
           if(Yup('#'+objectData[i].id).attr("targetPath") == presentPagedetails.targetPath){
                Yup(".menus-list-item").removeClass("active");          
                Yup('#'+objectData[i].id).addClass("active");
                break;
           }
        }
    }
}

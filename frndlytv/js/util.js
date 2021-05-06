var Util = {};
var characterArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
    '.', '<span class="caplock-icon-pos"></span>', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '_', '-'
];
var specialCharArray = ['!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '_', unescape("&#8377"), '{', '|',
    '}', '<span class="caplock-icon-pos"></span>', '~', unescape("\u20AC"), '^', 'æ', 'Ø', 'ø', '₤', 'Ȫ', 'Ȱ'
];
var Alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var numberKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var timesList = ['00:00 AM', '00:30 AM','01:00 AM' ,'01:30 AM' ,'02:00 AM' ,'02:30 AM' ,'03:00 AM' ,'03:30 AM' ,'04:00 AM' ,'04:30 AM' ,'05:00 AM' ,'05:30 AM' ,'06:00 AM' ,'06:30 AM' ,'07:00 AM' ,'07:30 AM' ,'08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM','05:30 PM','06:00 PM' ,'06:30 PM' ,'07:00 PM' ,'07:30 PM' ,'08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM']
Util.splashHtml = function () { return '<div style="overflow:hidden;height:100%;width:100%;background:url(images/splash.png); background-size:cover;background-position:center center;position:absolute"></div>'; }

Util.showPopup = function () {
    if (Main.popupData) {
        var Text = '';
        Text += '<div class="popupDiv">'
        Text += '<div class="overlay-screen '+Main.popupData.popuptype +'">'
        Text += '<div class="popup-Title">'
        if(!!Main.popupData.headerTitle){
            Text += '<h4 class="popup-Header">' + Main.popupData.headerTitle + '</h4>' 
        }        
        Text += '<h4 class="popup-subhead">' + Main.popupData.message + '</h4>'
        Text += '</div>'
        Text += '<div class="popup-btn-wrap ">'
        if (Main.popupData.buttonCount == 1) {
            Text += '<button id="popup-btn-1" class="btn-default popup-button" btnType="yes" source="popupbtn"> ' + Main.popupData.yesText + ' </button>'
        }
        else {
            Text += '<button id="popup-btn-1" class="btn-default popup-button mr70" btnType="yes" source="popupbtn"> ' + Main.popupData.yesText + ' </button>'
            Text += '<button id="popup-btn-2" class="btn-default popup-button " btnType="no" source="popupbtn"> ' + Main.popupData.noText + ' </button>'
        }
        Text += '</div>'
        Text += '</div>'
        Text += '</div>'

        return Text;
    }
}

Util.getImages = function (url) {
    if (url == "") {
        return "";
    }
    else if (url.indexOf(",") == -1) {
        return url;
    } else {
        var urlSplitList = url.split(',');
        for (var i = 0; i < systemConfigs.resourceProfiles.length; i++) {
            if (urlSplitList[0] == systemConfigs.resourceProfiles[i].code) {
                return systemConfigs.resourceProfiles[i].urlPrefix + urlSplitList[1];
            }
        }
    }
}

Util.getMenuImages = function (url) {
    return Util.getImages('menu,' + url + '.png');
}

Util.getContentHTML = function (data) {
    var Text = '';
    if(commingFromMenus == true){
        commingFromMenus = false;
        presentPagedetails.isCustomHeaderAdded = true;
    }
    if (data.pageType == 'list') { 
        presentPagedetails.isMenuPathforGrid = false;
        for(var i=0; i<systemConfigs.menus.length ; i++ ){
			if(systemConfigs.menus[i].targetPath == data.targetPath){
                presentPagedetails.isMenuPathforGrid = true;              
                break;			
			}
        }      
        Text += Util.getTopBar(data.menusList);
        Text += '<div class="menus-content">'  
        Text += Util.getGridSections(data)
        Text += '</div>'  
    }
    else if (data.pageType == 'details') { 
        presentPagedetails.menusList = [];      
        if (data.pageSubType == 'tvshowDetails') {
            Text += Util.getTVDetailsPage(data);
        } 
        else if(data.pageSubType=='channelDetails'){
            Text += Util.getChannelDetailsPage(data);
        }
        else { // defalus to movie
            Text += Util.getMovieDetailsPage(data);
        }
    }
    else {  // defaults to content 
     
        for(var i=0; i<systemConfigs.menus.length ; i++ ){
			if(systemConfigs.menus[i].targetPath == data.targetPath || data.pageSubType == 'networkDetails'){
                Text += Util.getTopBar(data.menusList);
                break;			
			}
		}
        Text += '<div class="menus-content">'
        if (data.pageSubType && data.pageSubType == 'networkDetails') {
            Text += Util.getNetworkDetails();
        }
        if (presentPagedetails.isCustomHeaderAdded == true && clickedMenu && data.pageType == 'content') {  //to display title-header like List pages when cliked on menes
            presentPagedetails.clickedMenu = clickedMenu;
            // Text += Util.pageHeader(clickedMenu.displayText);
        }
        if (data.banners && data.banners.length > 0) {
            Text += Util.getBanners(data.banners)
        }
        // if (data.menusList && data.menusList.length > 0) {
        //     Text += Util.getMenus(data.menusList)
        // }
        if (data.sections && data.sections.length > 0) {
            Text += Util.getSections(data.sections)
        }
        Text +='</div>'
    }
    return Text;
}

Util.getChannelDetailsPage = function (data) {
    var Text = '';
    var tvshowContent = data.pageContent[0];
    Text += '<div class="tvShowDetails '+presentPagedetails.tabsInfo.showTabs+'">'
    if(appConfig.channelshowDetalsFullImageView==true){
        Text += Util.getDetailsPageContent(tvshowContent);
    }else{
        Text += Util.getDetailsPageContentWithHalfImage(tvshowContent);
    }
    if(presentPagedetails.tabsInfo.showTabs==true){ // showing tabwise sections
    if (data.sections) {
        //tabs
        Text += '<div class="suggestions"><ul>'
        for (var j = 0; j < data.sections.length; j++) {
            var focusClass = (j == 0) ? 'activeTab' : ''
            Text += '<li class="tabsTitle ' + focusClass + '" id="tabs-' + j + '" source="tabs" pagination="false" >' + data.sections[j].sectionInfo.name + '<span></span></li>'
        }
        for (var j = 0; j < data.paginationSectionsData.length; j++) {
            Text += '<li class="tabsTitle ' + focusClass + '" id="tabs-' + j + '" source="tabs" pagination="true" >' + data.sections[j].sectionInfo.name + '<span></span></li>'
        }
        Text += '</ul>'
        Text += '</div>'
        //tab data in sections
        if (data.sections.length > 0) {
            for (var i = 0; i < data.sections.length; i++) {
                Text += Util.getdetailsPageSectionData(data.sections, i);
            }
        }
    }
    } else {
        if (data.sections) {
            Text += Util.getSections(data.sections);
        }
    }
    Text += '</div>'
    return Text;
}

Util.getTVDetailsPage = function (data) {
    var Text = '';
    var tvshowContent = data.pageContent[0];
    if (data.sections) {
        for (var i = 0; i < data.sections.length; i++) {
            if (data.sections[i].sectionInfo.code == 'content_actors') {
                presentPagedetails.castCrewSection = data.sections[i];
                data.sections.splice(i, 1);
                break;
            }
        }
    }
    Text += '<div class="tvShowDetails '+presentPagedetails.tabsInfo.showTabs+'">'
    if(appConfig.tvshowDetalsFullImageView==true){
        Text += Util.getDetailsPageContent(tvshowContent);
    }else{
        Text += Util.getDetailsPageContentWithHalfImage(tvshowContent);
    }
    if(presentPagedetails.tabsInfo.showTabs==true){ // showing tabwise sections
    if (data.sections) {
        //tabs
        Text += '<div class="suggestions"><ul>'
        for (var j = 0; j < data.sections.length; j++) {
            var focusClass = (j == 0) ? 'activeTab' : ''
            Text += '<li class="tabsTitle ' + focusClass + '" id="tabs-' + j + '" source="tabs" pagination="false" >' + data.sections[j].sectionInfo.name + '<span></span></li>'
        }
        for (var j = 0; j < data.paginationSectionsData.length; j++) {
            Text += '<li class="tabsTitle ' + focusClass + '" id="tabs-' + j + '" source="tabs" pagination="true" >' + data.sections[j].sectionInfo.name + '<span></span></li>'
        }
        Text += '</ul>'
        Text += '</div>'
        //tab data in sections
        if (data.sections.length > 0) {
            for (var i = 0; i < data.sections.length; i++) {
                Text += Util.getdetailsPageSectionData(data.sections, i);
            }
        }
     }
    }else{
        if (data.sections) {
            Text += Util.getSections(data.sections);
        }
    }
    Text += '</div>'
    return Text;
}

Util.getdetailsPageSectionData = function (data, i) {
    var Text = '';
    Text += '<div class="section_row"  id="section-' + i + '" style="transition: -webkit-transform 150ms linear;" >';
    if (data[i].sectionData.data.length) {
        Text += '<div class="section-horizontal" id="section-horizontal-' + i + '">';
        var viewAllId = '';
        for (var j = 0; j < data[i].sectionData.data.length; j++) {
            Text += Util.getCard(data[i].sectionData.data[j], 'sectionItem-' + i + '-' + j);
            viewAllId = 'sectionItem-' + i + '-' + (j + 1);
        }
        if (data[i].sectionControls.showViewAll == true) {
            Text += Util.getViewAllCard(data[i], viewAllId);
        }
        Text += '</div>'
    } else {
        // no data in tabs sections
    }
    Text += '</div>'
    return Text;
}

Util.getMovieDetailsPage = function (data) {
    var tvshowContent = data.pageContent[0];
    var Text = '';
    Text += '<div class="movieDetails">'
    if (data.sections) {
        for (var i = 0; i < data.sections.length; i++) {
            if (data.sections[i].sectionInfo.code == 'movie_actors') {
                presentPagedetails.castCrewSection = data.sections[i];
                data.sections.splice(i, 1);
                break;
            }
        }
    }
    Text += Util.getDetailsPageContent(tvshowContent);
    if (data.sections && data.sections.length != 0 ) {
        for(var i=0;i<data.sections.length;i++){
            data.sections[i].sectionInfo.name=systemConfigs.configs.movieDetailsRecommendationText;
        }
        Text += Util.getSections(data.sections);
    }
    Text += '</div>'
    return Text;
}

Util.getDetailsPageContent = function (tvshowContent) {
    var isCast = '';
    if (presentPagedetails.castCrewSection) (isCast = 'isCast');
    var Text = '';
    Text += '<div class="detailsContainer ' + isCast + '"><img class="main" src="' + Util.getImages(tvshowContent.backgroundImage) + '" /><span class="overlay"></span>';
    Text += '<div class="detainlsInfo"><div class="detainlsInfoInner">';
    Text += '<h1>' + tvshowContent.title + '</h1>';
    Text += Util.AddingDetailsPageContent(tvshowContent);
    Text += '</div>'
    // if (presentPagedetails.castCrewSection) {
    //     Text += '<div class="castCrew"><h5>' + presentPagedetails.castCrewSection.sectionInfo.name + '</h5><ul>'
    //     var castLength = (presentPagedetails.castCrewSection.sectionData.data.length > 4) ? 4 : presentPagedetails.castCrewSection.sectionData.data.length
    //     for (var k = 0; k < castLength; k++) {
    //         Text += '<li><span class="mainTitle ellipsis">' + presentPagedetails.castCrewSection.sectionData.data[k].display.title
    //             + '</span><span class="subTitle ellipsis">' + presentPagedetails.castCrewSection.sectionData.data[k].display.subtitle1 + '</span></li>'
    //     }
    //     Text += '</ul></div>'
    // }
    Text += '</div></div>';
    Text += '<div class="detailsPage_bottom_gradient"></div>';
    return Text;
}

Util.getDetailsPageContentWithHalfImage = function (tvshowContent) {
    var Text = '';
    Text += '<div class="detailsContainerNew"><div class="detailsleftImg"><img class="main" src="' + Util.getImages(tvshowContent.backgroundImage) + '" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/logo_test.png" /></div>';
    Text += '<div class="detainlsInfo">';
    Text += '<h1>' + tvshowContent.title + '</h1>';
    Text += Util.AddingDetailsPageContent(tvshowContent);
    Text += '</div></div>';
    Text += '<div class="detailsPage_bottom_gradient">';
    return Text;
}

Util.AddingDetailsPageContent=function(tvshowContent){
    var Text = '';
    var ContentInfo={
        rentalInfo:'',
        expiryInfo:[]
    }
    for (var i = 0; i < tvshowContent.dataRows.length; i++) {
        if(tvshowContent.dataRows[i].rowDataType == 'content'){
            Text += '<ul class="markers">'
            for (var j = 0; j < tvshowContent.dataRows[i].elements.length; j++) {                
                    var elements = tvshowContent.dataRows[i].elements[j];
                    if (elements.elementType != 'image' && elements.elementType != 'hyperlink' && (elements.elementSubtype!='rentalinfo' && elements.elementSubtype !='title' && elements.elementSubtype !='expiryInfo')){
                        if(elements.elementType == 'description' && elements.data.length >180){
                            presentPagedetails.description= elements.data;
                            elements.data=elements.data.substr(0, 180);
                            elements.data +='....<b id="readMore">Read More</b>';
                        }
                        Text += '<li class="detailsContent ' + elements.elementType + '" id="' + elements.elementType + '-' + i + '-' + j + '" source="' + elements.elementType + '"targetpath="'+elements.target+'" >' + elements.data + '</li>';
                    }else if(elements.elementType == 'text' && elements.elementSubtype=='rentalinfo'){
                        ContentInfo.rentalInfo=elements.data;
                    } 
                    else if(elements.elementType == 'text' && elements.elementSubtype=='expiryInfo'){
                        ContentInfo.expiryInfo=elements.data.split('@ ');
                    }           
            }
            Text += '</ul>'
        }        
    }
    if (presentPagedetails.castCrewSection) {
        var Actors=[];
        Text+= '<ul class="markers">';
        for (var k = 0; k < presentPagedetails.castCrewSection.sectionData.data.length; k++) {
            if(presentPagedetails.castCrewSection.sectionData.data[k].display.subtitle1=='Director'){
                Text += '<li class="detailsContent castcrew text'+ '" id="castcrew'+'-' + k + '" source="text">Director : '+presentPagedetails.castCrewSection.sectionData.data[k].display.title+'</li>';
            }
            else{
                Actors.push(presentPagedetails.castCrewSection.sectionData.data[k].display.title);
            }
        }
        Text += '</ul>'
        Text+= '<ul class="markers">';
        Text += '<li class="detailsContent castcrew text'+ '" id="castcrew" source="text">Cast : '+Actors.join(',')+'</li></ul>';
    }
    var favButtonAdded =false; watchLive=false;
    for (var i = 0; i < tvshowContent.dataRows.length; i++) {
        if(tvshowContent.dataRows[i].rowDataType == 'button'){
            Text += '<ul class="markers">'
            for (var j = 0; j < tvshowContent.dataRows[i].elements.length; j++) {
                var elements = tvshowContent.dataRows[i].elements[j];
                if(elements.elementSubtype=='subscribe'){
                    Text += '<li class="detailsContent rentalInfo subscribeInfo" id="rentalInfo" source="subscribeText" targetpath=""><img class="infoIcon" src="images/info_icon.png">Please subscribe to watch this content'
                }else{
                    Text += '<li class="detailsContent ' + elements.elementType + '" elementSubtype="'+elements.elementSubtype+'" id="' + elements.elementType + '-' + j + '" source="' + elements.elementType + '"targetpath="'+elements.target+'" >' + elements.data;
                }
                if(elements.elementSubtype=='resume'){
                Text += '<div class="progress">'
                Text += '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="4" aria-valuemin="0" aria-valuemax="70" style="width:' + parseInt(presentPagedetails.attributes.watchedPosition * 100) + '%">'
                Text += '</div></div>'
                }
                Text += '</li>';
            }
            for (var k = 0; k < tvshowContent.dataRows[i].elements.length; k++) {
                if(tvshowContent.dataRows[i].elements[k].elementSubtype=='subscribe'){
                    tvshowContent.dataRows[i].elements.splice(k, 1);
                }
            }
            presentPagedetails.avilablePagebuttonsLength = tvshowContent.dataRows[i].elements.length; 
            if(presentPagedetails.isComingTvguide==true){
                watchLive=true
                Text += '<li class="detailsContent button" id="watchLive" source="watchLive" targetpath="" >Watch Live</li>';
            }       
             //fav button
            if(presentPagedetails.pageButtons && presentPagedetails.pageButtons.showFavouriteButton && presentPagedetails.pageButtons.showFavouriteButton == true  ){
                if(presentPagedetails.pageButtons.isFavourite == true){
                    Text += '<li class="detailsContent fav" id="favorites" source="favorites" targetpath="favorites" > <div class="fav-icon removeWatch"></div></li>';
                }else{
                    Text += '<li class="detailsContent fav" id="favorites" source="favorites" targetpath="favorites" > <div class="fav-icon addTowatch"></div></li>';
                }
                favButtonAdded = true;
                presentPagedetails.favButtonAdded = true;
            }
            if(ContentInfo.expiryInfo.length>0){
                Text+= '<li class="detailsContent expiryInfo" id="expiryInfo" source="expiryInfo" targetpath=""><span style="color:red">'+ContentInfo.expiryInfo[0]+'</span><span>'+ContentInfo.expiryInfo[1]+'</li>'
            }
            Text += '</ul>'
        } 
    }
    if(favButtonAdded == false && presentPagedetails.pageButtons && presentPagedetails.pageButtons.showFavouriteButton && presentPagedetails.pageButtons.showFavouriteButton == true ){
        Text += '<ul class="markers" style="padding-bottom: 10px;">'
        if(watchLive==false && presentPagedetails.isComingTvguide==true){
            Text += '<li class="detailsContent button" id="watchLive" source="watchLive" targetpath="" >Watch Live</li>';
        } 
        if(presentPagedetails.pageButtons.isFavourite == true){
            Text += '<li class="detailsContent fav" id="favorites" source="favorites" targetpath="favorites" > <img class="fav-icon" src="https://d2ivesio5kogrp.cloudfront.net/static/kandidtv/images/remove-watch-list.svg" ></li>';
        }else{
            Text += '<li class="detailsContent fav" id="favorites" source="favorites" targetpath="favorites" > <img class="fav-icon" src="images/addToWatch.png" ></li>';
        }
        if(ContentInfo.expiryInfo.length>0){
            Text+= '<li class="detailsContent expiryInfo" id="expiryInfo" source="expiryInfo" targetpath=""><span style="color:red">'+ContentInfo.expiryInfo[0]+'</span><span>'+ContentInfo.expiryInfo[1]+'</li>'
        }
        presentPagedetails.favButtonAdded = true;
        Text += '</ul>'
    }
    if(ContentInfo.rentalInfo.length>0){
        Text+= '<ul class="markers"><li class="detailsContent rentalInfo" id="rentalInfo" source="rentalInfo" targetpath=""><img class="infoIcon" src="images/info_icon.png">'+ContentInfo.rentalInfo+'</li></ul>'
    }
    return Text;
}

// Util.getSeachBar = function () {
//     var Text = '<div class="search-bar">'
//     Text += '<div class="row">'
//     Text += '<div class="col6">'
//     Text += '<button type="submit" class="btn-search" id="searchBar" source="search" >'
//     Text += '<img class="img-default" src="images/Search_Static_ENG.png"> <img class="img-focused" src="images/search_icon_focused_ENG.png">'
//     Text += '</button>'
//     Text += '</div>';
//     Text += '<div class="col6">'
//     Text += '<div class="logo">'
//     Text += '<img src="' + appConfig.staticColudPath + 'images/logo_test.png" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/logo_test.png"/>'
//     Text += '</div>'
//     Text += '<div class="signInBtn">'
//     if (!Main.userProfile.userId)
//         Text += '<button id="signUpBtn" class="btn-default" source="signUpBtn"> Sign In </button>'
//     else
//         Text += '<button id="signUpBtn" class="btn-default" source="signUpBtn" style="display:none">Sign In</button>'
//     Text += '</div>'
//     Text += '</div>';
//     Text += '</div></div>';
//     return Text;
// }

Util.getTopBar = function (data) {
    var Text = '<div class="search-bar">'
   
    Text += '<div class="searchArea">'
    Text += '<div class="btn-search" source="search" targetPath ="search" id="searchMenu"><div class="searchImg"><img class="img-default"  src="images/Search_Static.png" ><img class="img-focus"  src="images/Search_Focus.png" ></div></div>'
    Text += '</div>';
    Text += '<div class="menuArea">'
    Text += Util.getMenus(data);
    Text += '</div>';
    Text += '<div class="logoArea">'
    Text += '<div class="logo">'
    Text += '<img src="' + appConfig.staticColudPath + 'images/logo_test.png" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/logo_test.png"/>'
    Text += '</div>'  
    Text += '</div></div>';
    return Text;
}

Util.getBanners = function (data) {
    var Text = '<div id="BannersHome" class="BannerData" style="position: relative;left:20px;top:0em;transition: -webkit-transform 150ms linear;">'
    for (var i = 0; i < data.length; i++) {
        if (data[i].isInternal == true) {
            Text += '<div><img source="banners" targetTitle="' + data[i].title + '" targetPath="' + data[i].target.path + '" code = "' + data[i].code + '" movieID = "' + data[i].id + '" index="' + i + '" count="' + data.length + '" id= "bannerImage-' + i + '" class="bannerImage middleBanner" data-u="image" src="'
                + Util.getImages(data[i].imageUrl)
                + '" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/banner-empty.png" / ></div>';
        }
    }
    Text += '</div>'
    return Text;
}

Util.getMenus = function (data) {
    var Text = '';
    Text += '<div class="menus-list" id="menus">'   
    for (var i = 0; i < data.length; i++) {       
        Text += '<div class="menus-list-item" source="menus" targetPath ="'+ data[i].targetPath + '" index="' + i + '" id="menu-' + i+ '">'
        Text += '<div class="menuBar"><div class="outline-border"></div><div class="menuImg">'+data[i].displayText+'</div></div>'
        Text += '</div>'
    }
    //settings
    Text += '<div class="menus-list-item" source="menus" targetPath ="settings" index=">'+ i + '" id="menu-' + data.length+ '">'
    Text += '<div class="menuBar"><div class="outline-border"></div><div class="menuImg">Settings</div></div>'
    Text += '</div>'

    Text += '</div>'
    return Text;
}

Util.getSections = function (data) {
    var Text = '<div class="sectionsHome">'
    for (var i = 0; i < data.length; i++) {
        if (data[i].sectionControls.dataLength > 0) {
            Text += '<div class="section_row"  id="section-' + i + '" style="transition: -webkit-transform 150ms linear;">';
            Text += '<h3 class="section-heading">' + data[i].sectionInfo.name + '</h3>';
            Text += '<div class="section-horizontal"  id="section-horizontal-' + i + '"> ';
            var viewAllId = ''
            for (var j = 0; j < data[i].sectionData.data.length; j++) {
                Text += Util.getCard(data[i].sectionData.data[j], 'sectionItem-' + i + '-' + j);
                viewAllId = 'sectionItem-' + i + '-' + (j + 1);
            }
            if (data[i].sectionControls.showViewAll == true) {
                Text += Util.getViewAllCard(data[i], viewAllId);
            }
            Text += '</div></div>'
        }
    }
    Text += '</div>';
    return Text;
}

Util.getPaginationSections = function (data) {
    var Text = '';
    var dataLengthExistingSections = presentPagedetails.sections.length;
    for (var i = 0; i < data.length; i++) {
        if (data[i].sectionControls.dataLength > 0) {
            Text += '<div class="section_row"  id="section-' + (i + dataLengthExistingSections) + '" style="transition: -webkit-transform 150ms linear;">';
            Text += '<h3 class="section-heading">' + data[i].sectionInfo.name + '</h3>';
            Text += '<div class="section-horizontal" id="section-horizontal-' + (i + dataLengthExistingSections) + '">';
            var viewAllId = ''
            for (var j = 0; j < data[i].sectionData.data.length; j++) {
                Text += Util.getCard(data[i].sectionData.data[j], 'sectionItem-' + (i + dataLengthExistingSections) + '-' + j);
                viewAllId = 'sectionItem-' + (i + dataLengthExistingSections) + '-' + (j + 1);
            }
            if (data[i].sectionControls.showViewAll == true) {
                Text += Util.getViewAllCard(data[i], viewAllId);
            }
            Text += '</div></div>'
        }
    }
    return Text;
}

Util.getViewAllCard = function (data, id) {
    var Text = '<div class="section-card">'
    if (data.sectionData.data[0].cardType == 'sheet_poster') {
        Text += '<div class="sheet_poster card-details view_all" source="sections" cardType="sheet_poster"  targetPath = "' + data.sectionControls.viewAllTargetPath + '"   id="' + id + '" >'
        Text += '<div class="outline-border"></div>'
        Text += '<div class="shows-image">'
        Text += '</div>'
        Text += '<div class="shows-content">'
        Text += '<div class="show-name">'
        Text += '<span >View All </span><span class="view-all-arrow" style="font-size:35px;">&#8594;</span>'
        Text += '</div></div>'
        Text += '</div>'
    }
    else if (data.sectionData.data[0].cardType == 'roller_poster') {
        Text += '<div class="roller_poster card-details view_all " source="sections" cardType="roller_poster"  targetPath = "' + data.sectionControls.viewAllTargetPath + '"   id="' + id + '" >'
        Text += '<div class="outline-border"></div>'
        Text += '<div class="shows-image">'
        // Text += '<img src="images/view_all_roller.png" style="height: 100%;" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/view_all_roller.png"  />'
        Text += '<div class="shows-content">'
        Text += '<div class="show-name ellipsis">'
        Text += '<span >View All </span><span  class="view-all-arrow" style="font-size:30px;">&#8594;</span>'
        Text += '</div></div>'
        Text += '</div>'
        Text += '</div>'
    }   
    else if (data.sectionData.data[0].cardType == 'overlay_poster') {
        Text += '<div class="overlay_poster card-details view_all" source="sections" cardType="overlay_poster"  targetPath = "' + data.sectionControls.viewAllTargetPath + '"   id="' + id + '" >'
        Text += '<div class="outline-border"></div>'
        Text += '<div class="shows-image">'
        Text += '<img src="images/view_all.png" style="height: 100%;" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/view_all.png"  />'
        Text += '<div class="shows-content">'
        // Text += '<div class="show-name ellipsis">'
        // Text += '<span >View All </span><span  class="view-all-arrow" style="font-size:35px;">&#8594;</span>'
        // Text += '</div>'
        Text += '</div></div>'
        Text += '</div>'
    }
    Text += '</div>';
    return Text;

}

Util.addPaginationViewAll = function (data) {

    var present_length = presentPagedetails.sections[0].sectionControls.dataLength;
    var noOfCardForARow = keyHandlar.noOfCardForARowInGrid(presentPagedetails.sections[0].sectionData.data[0].cardType);
    var lastRow = Math.floor((present_length - 1) / noOfCardForARow);
    var lastindexdiff = ((lastRow + 1) * noOfCardForARow) - present_length;

    if (lastindexdiff != 0) {
        var TextInsideRow = "";
        var Text = "";
        for (var i = 0; i < lastindexdiff; i++) {
            TextInsideRow += Util.getCard(data.data[i], 'sectionItem-' + lastRow + '-' + ((noOfCardForARow - lastindexdiff) + i));
            presentPagedetails.sections[0].sectionData.data.push(data.data[i]);
        }
        Yup("#viewAllrow-" + lastRow).append(TextInsideRow);
    }
    data.data = data.data.slice(lastindexdiff, data.data.length);
    present_length = presentPagedetails.sections[0].sectionData.data.length;
    var Text = "";
    for (var i = 0; i < data.data.length; i++) {
        var v_index = Math.floor((i + present_length) / noOfCardForARow);
        var h_index = i % noOfCardForARow;
        if (h_index == 0) { Text += "<div id='viewAllrow-" + v_index + "' class='row viewall_row'>"; }
        Text += Util.getCard(data.data[i], 'sectionItem-' + v_index + '-' + h_index);
        if (h_index == noOfCardForARow - 1) { Text += "</div>" }
        presentPagedetails.sections[0].sectionData.data.push(data.data[i]);
    }
    Yup(".sectionsGrid_Items").append(Text);


    Main.HideLoading();

    presentPagedetails.sections[0].sectionData.hasMoreData = data.hasMoreData;
    presentPagedetails.sections[0].sectionData.lastIndex = data.lastIndex;
    presentPagedetails.sections[0].sectionControls.dataLength = presentPagedetails.sections[0].sectionData.data.length;
}

Util.noDataFound = function () {
  
    if(presentPagedetails.targetPath == 'my_library' || presentPagedetails.targetPath == 'mylibrary' ){
        if(Main.userProfile.userStatus == true){
            var Text = '';
            Text += '<div class="uniquePage" id="myLibrary">'
            Text += '<div class="container">'           
            Text += '<h1 class="main-heading textCenter"> No Content Found </h1>' 
            Text += '<h3 class="sub-heading textCenter"> Content from your subscriptions and purchases will appear here</h3>'              
            Text += '</div>'
            Text += '</div>'
            return Text;
        }else{            
            var Text = '';
            Text += '<div class="uniquePage" id="myLibrary">'
            Text += '<div class="container">'           
            Text += '<h1 class="main-heading textCenter"> Please Sign In to view <span> \'My Library\'</span> </h1>'  
            Text += '<div class="btn-wrap">'
            // Text += '<button type="button" id="signin-0" source="uniqueButtons" targetPath="signup" class="grey-btn library-button mr50 "> Sign up </button>'
            Text += '<button type="button" id="signin-1" source="uniqueButtons" targetPath="signin" class="grey-btn library-button"> Sign In </button>'
            Text += '</div>'  
            Text += '</div>'
            Text += '</div>'
            return Text;
        }
    }

    else if(presentPagedetails.targetPath == systemConfigs.configs.favouriteMenuTargetPath || presentPagedetails.targetPath == 'favourites'  ){
        if(Main.userProfile.userStatus == true){
            var Text = '';
            Text += '<div class="uniquePage" id="myLibrary">'
            Text += '<div class="container">'
            Text += '<img src="images/no_favourites.png"/>'           
            Text += '<h1 class="main-heading textCenter">Looks like you don’t have any favourites yet!</h1>' 
            Text += '<h3 class="sub-heading textCenter">Your favourite content will be listed here.</h3>'              
            Text += '</div>'
            Text += '</div>'
            return Text;
        }else{            
            var Text = '';
            Text += '<div class="uniquePage" id="myLibrary">'
            Text += '<div class="container">'           
            Text += '<h1 class="main-heading textCenter"> Please Sign In to view <span> \'Favourites\'</span> </h1>'  
            Text += '<div class="btn-wrap">'
            // Text += '<button type="button" id="signin-0" source="uniqueButtons" targetPath="signup" class="grey-btn library-button mr50 "> Sign up </button>'
            Text += '<button type="button" id="signin-1" source="uniqueButtons" targetPath="signin" class="grey-btn library-button"> Sign In </button>'
            Text += '</div>'  
            Text += '</div>'
            Text += '</div>'
            return Text;
        }
    }
    else { 
        return '<h3 class="nodataFound"> No Data Found </h3>';   
    }
}

// cards designs
Util.getCard = function (data, id) {
    var Text = '<div class="section-card">'
    if (data.cardType == 'sheet_poster') {
        if(data.metadata && data.metadata.contentType && (data.metadata.contentType.value == 'video' || data.metadata.contentType.value == 'movie') && presentPagedetails.targetPath!=systemConfigs.configs.favouriteMenuTargetPath ){  //if it is video card
            Text += '<div class="sheet_poster card-details" source="sections" cardType="sheet_poster" contentType="video" targetPath = "' + data.target.path + '"   id="' + id + '" >'
            Text += '<div class="outline-border"></div>'
            Text += '<div class="shows-image">'
            if(data.display.markers && data.display.markers.length > 0){
                for(var x=0;x<data.display.markers.length;x++){
                    if(data.display.markers[x].markerType == 'duration'){  //Program duration
                        Text+='<span class="brMarker br2"  style="background-color:#' + data.display.markers[x].bgColor.replace("FF", '') + ';color:#' + data.display.markers[x].textColor.replace("FF", '') + '" >'+data.display.markers[x].value+'</span>'
                    }
                    if(data.display.markers[x].markerType == 'seek'){
                        var percent = parseInt(data.display.markers[x].value * 100);
                        Text += '<div class="progress">'
                        Text += '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="4" aria-valuemin="0" aria-valuemax="70" style="width:' + percent + '%">'
                        Text += '</div></div>'
                    }
                }
            }
            Text += '<img src="' + Util.getImages(data.display.imageUrl) + '" style="height: 100%;" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/empty_state_sheet.png"  />'
            Text += '</div>'
            Text += '<div class="shows-content overlay">'
            Text += '<div class="show-name ellipsis">'
            if (window.innerWidth>1280 && data.display.title.length >= 28)
                Text += '<span class="namescroll">' + data.display.title + '</span>'
            else if(window.innerWidth<=1280 && data.display.title.length >= 18 )
                Text += '<span class="namescroll">' + data.display.title + '</span>'
            else
                Text += '<span>' + data.display.title + '</span>'            
            Text += '</div><span class="subTitle ellipsis">' + data.display.subtitle1 + '</span></div>'
            Text += '</div>'
        }else{  //default
            Text += '<div class="sheet_poster card-details" source="sections" cardType="sheet_poster"  targetPath = "' + data.target.path + '"   id="' + id + '" >'
            Text += '<div class="outline-border"></div>'
            Text += '<div class="shows-image">'
            if(data.display.markers && data.display.markers.length > 0){
                for(var x=0;x<data.display.markers.length;x++){
                    if(data.display.markers[x].markerType == 'badge'){  //Program type 
                        Text+='<span class="brMarker br2"  style="background-color:#' + data.display.markers[x].bgColor.replace("FF", '') + ';color:#' + data.display.markers[x].textColor.replace("FF", '') + '" >'+data.display.markers[x].value+'</span>'
                    }
                    if(data.display.markers[x].markerType == 'seek'){
                        var percent = parseInt(data.display.markers[x].value * 100);
                        Text += '<div class="progress">'
                        Text += '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="4" aria-valuemin="0" aria-valuemax="70" style="width:' + percent + '%">'
                        Text += '</div></div>'
                    }
                }
            }
            Text += '<img src="' + Util.getImages(data.display.imageUrl) + '" style="height: 100%;" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/empty_state_sheet.png"  />'
            Text += '</div>'
            Text += '<div class="shows-content overlay">'
            Text += '<div class="logo">'
            Text += '<img src="' + Util.getImages(data.display.parentIcon) + '" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/empty_state_sheet.png"/>'
            Text += '</div>'
            Text += '<div class="show-name ellipsis">'
            if (window.innerWidth>1280 && data.display.title.length >= 28)
                Text += '<span class="namescroll">' + data.display.title + '</span>'
            else if(window.innerWidth<=1280 && data.display.title.length >= 18 )
                Text += '<span class="namescroll">' + data.display.title + '</span>'
            else
                Text += '<span>' + data.display.title + '</span>' 
            Text += '</div><span class="subTitle ellipsis">' + data.display.subtitle1 + '</span></div>'
            Text += '</div>'
        }
      
    } 
    else if (data.cardType == 'overlay_poster') {
        if(data.metadata && data.metadata.contentType && (data.metadata.contentType.value == 'video' || data.metadata.contentType.value == 'movie') && presentPagedetails.targetPath!=systemConfigs.configs.favouriteMenuTargetPath ){  //if it is video card
            Text += '<div class="overlay_poster card-details" source="sections" cardType="overlay_poster" contentType="video" targetPath = "' + data.target.path + '"   id="' + id + '" template="'+data.template+'" >'
            Text += '<div class="outline-border"></div>'
            Text += '<div class="shows-image">'
            if(data.display.markers && data.display.markers.length > 0){
                for(var x=0;x<data.display.markers.length;x++){
                    if(data.display.markers[x].markerType == 'duration'){  //Program duration
                        Text+='<span class="brMarker br2"  style="background-color:#' + data.display.markers[x].bgColor.replace("FF", '') + ';color:#' + data.display.markers[x].textColor.replace("FF", '') + '" >'+data.display.markers[x].value+'</span>'
                    }
                    if(data.display.markers[x].markerType == 'seek'){
                        var percent = parseInt(data.display.markers[x].value * 100);
                        Text += '<div class="progress">'
                        Text += '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="4" aria-valuemin="0" aria-valuemax="70" style="width:' + percent + '%">'
                        Text += '</div></div>'
                    }
                }
            }
            Text += '<img src="' + Util.getImages(data.display.imageUrl) + '" style="height: 100%;" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/empty_state_sheet.png"  />'
            Text += '</div>'
            if (data.display.title.trim().length != 0) {
            Text += '<div class="shows-content">'
            Text += '<div class="show-name ellipsis">'
            if (window.innerWidth>1280 && data.display.title.length >= 28)
                Text += '<span class="namescroll">' + data.display.title + '</span>'
            else if(window.innerWidth<=1280 && data.display.title.length >= 18 )
                Text += '<span class="namescroll">' + data.display.title + '</span>'
            else
                Text += '<span>' + data.display.title + '</span>'            
            // Text += '</div><span class="subTitle ellipsis">' + data.display.subtitle1 + '</span></div>'
            Text += '</div></div>'
            }
            Text += '</div>'
        }else{  //default
            Text += '<div class="overlay_poster card-details" source="sections" cardType="overlay_poster"  targetPath = "' + data.target.path + '"   id="' + id + '" template="'+data.template+'" >'
            Text += '<div class="outline-border"></div>'
            Text += '<div class="shows-image">'
            if(data.display.markers && data.display.markers.length > 0){
                for(var x=0;x<data.display.markers.length;x++){
                    if(data.display.markers[x].markerType == 'badge'){  //Program type 
                        Text+='<span class="brMarker br2"  style="background-color:#' + data.display.markers[x].bgColor.replace("FF", '') + ';color:#' + data.display.markers[x].textColor.replace("FF", '') + '" >'+data.display.markers[x].value+'</span>'
                    }
                    if(data.display.markers[x].markerType == 'seek'){
                        var percent = parseInt(data.display.markers[x].value * 100);
                        Text += '<div class="progress">'
                        Text += '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="4" aria-valuemin="0" aria-valuemax="70" style="width:' + percent + '%">'
                        Text += '</div></div>'
                    }
                }
            }
            Text += '<img src="' + Util.getImages(data.display.imageUrl) + '" style="height: 100%;" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/empty_state_sheet.png"  />'
            Text += '</div>'
            if (data.display.title.trim().length != 0) {
            Text += '<div class="shows-content">'
            Text += '<div class="show-name ellipsis">'
            if (window.innerWidth>1280 && data.display.title.length >= 28)
                Text += '<span class="namescroll">' + data.display.title + '</span>'
            else if(window.innerWidth<=1280 && data.display.title.length >= 18 )
                Text += '<span class="namescroll">' + data.display.title + '</span>'
            else
                Text += '<span>' + data.display.title + '</span>' 
            // Text += '</div><span class="subTitle ellipsis">' + data.display.subtitle1 + '</span></div>'
            Text += '</div></div>'
            }
            Text += '</div>'
        }
      
    }
    else if (data.cardType == 'roller_poster') {
        Text += '<div class="roller_poster card-details" source="sections" cardType="roller_poster"  targetPath = "' + data.target.path + '"   id="' + id + '" >'
        Text += '<div class="outline-border"></div>'
        Text += '<div class="shows-image">'
        var expiryInfo=[];
        if(data.display.markers && data.display.markers.length > 0){
            for(var x=0;x<data.display.markers.length;x++){
                if(data.display.markers[x].markerType == 'expiryInfo'){  //Program type in search
                    expiryInfo=data.display.markers[x].value.split('@');
                    Text+='<span class="brMarker" style="color:red">'+expiryInfo[0]+'</span>'
                    Text+='<span class="brMarker" style="color:#fff;bottom: 30px;">'+expiryInfo[1]+'</span>'
                    break;
                }
            }
        }
        Text += '<img src="' + Util.getImages(data.display.imageUrl) + '" style="height: 100%;" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/empty_state_roller.png"  />'
        Text += '</div>'
        Text +='<div class="overlay';
        Text +=(expiryInfo.length >0) ? (' expiryInfo') :'';
        Text += '"></div><div class="shows-content">'
        Text += '<div class="show-name ellipsis">'
        if (window.innerWidth>1280 && data.display.title.length >= 19)
            Text += '<span class="namescroll">' + data.display.title + '</span>'
        else if(window.innerWidth<=1280 && data.display.title.length >= 12 )
            Text += '<span class="namescroll">' + data.display.title + '</span>'
        else
            Text += '<span>' + data.display.title + '</span>'
        Text += '</div><span class="subTitle ellipsis"> ' + data.display.subtitle1 + '</span></div>'
        Text += '</div>'
    }    
    else if (data.cardType == 'player-card') {
        Text += '<div class="player-card card-details" source="sections" cardType="player-card"  targetPath = "' + data.target.path + '"   id="' + id + '" >'
        Text += '<div class="outline-border"></div>'
        Text += '<div class="shows-image">'
        if(data.display.markers && data.display.markers.length > 0){
            for(var x=0;x<data.display.markers.length;x++){
                if(data.display.markers[x].markerType == 'badge'){  //Program type 
                    Text+='<span class="brMarker br2"  style="background-color:#' + data.display.markers[x].bgColor.replace("FF", '') + ';color:#' + data.display.markers[x].textColor.replace("FF", '') + '" >'+data.display.markers[x].value+'</span>'
                }
                if(data.display.markers[x].markerType == 'seek'){
                    var percent = parseInt(data.display.markers[x].value * 100);
                    Text += '<div class="progress">'
                    Text += '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="4" aria-valuemin="0" aria-valuemax="70" style="width:' + percent + '%">'
                    Text += '</div></div>'
                }
            }
        }
        Text += '<img src="' + Util.getImages(data.display.imageUrl) + '" style="height: 100%;" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/empty_state_sheet.png"  />'
        Text += '</div>'
        if (data.display.title.trim().length != 0) {
        Text += '<div class="shows-content'
        if (presentPagedetails.steamResponse.analyticsInfo.contentType =="live") {
        Text += ' live overlay">'
        Text += '<div class="logo">'
        Text += '<img src="' + Util.getImages(data.display.parentIcon) + '" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/empty_state_sheet.png"/>'
        Text += '</div>'
        }
        Text += '"><div class="show-name ellipsis">'
        if (window.innerWidth>1280 && data.display.title.length >= 28)
            Text += '<span class="namescroll">' + data.display.title + '</span>'
        else if(window.innerWidth<=1280 && data.display.title.length >= 18 )
            Text += '<span class="namescroll">' + data.display.title + '</span>'
        else
            Text += '<span>' + data.display.title + '</span>' 
        Text += '</div>'
        if (presentPagedetails.steamResponse.analyticsInfo.contentType =="live") {
            Text += '<span class="subTitle ellipsis">' + data.display.subtitle1 + '</span>'
        }
        Text += '</div>'    
        }
        Text += '</div>'
    } 
    else {  // defaults to search-card
        Text += '<div class="search-card card-details" source="sections" cardType="search-card"  targetPath = "' + data.target.path + '"   id="' + id + '" >'
        Text += '<div class="outline-border"></div>'
        Text += '<div class="shows-image">'
        if(data.display.markers && data.display.markers.length > 0){
            for(var x=0;x<data.display.markers.length;x++){
                if(data.display.markers[x].markerType == 'badge'){  //Program type in search
                    Text+='<span class="brMarker br2"  style="background-color:#' + data.display.markers[x].bgColor.replace("FF", '') + ';color:#' + data.display.markers[x].textColor.replace("FF", '') + '" >'+data.display.markers[x].value+'</span>'
                    break;
                }
            }
        }
        Text += '<img src="' + Util.getImages(data.display.imageUrl) + '" style="height: 100%;" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/empty_state_sheet.png"  />'
        Text += '</div>'
        if (data.display.title.trim().length != 0) {
        Text += '<div class="shows-content">'
        Text += '<div class="show-name ellipsis">'
        if (window.innerWidth>1280 && data.display.title.length >= 28)
            Text += '<span class="namescroll">' + data.display.title + '</span>'
        else if(window.innerWidth<=1280 && data.display.title.length >= 18 )
            Text += '<span class="namescroll">' + data.display.title + '</span>'
        else
            Text += '<span>' + data.display.title + '</span>' 
        // Text += '</div><span class="subTitle ellipsis">' + data.display.subtitle1 + '</span></div>'
        Text += '</div></div>'
        }
        Text += '</div>'
    }
    Text += '</div>';
    return Text;
}

//net work details
Util.getNetworkDetails = function () {
    var Text = '';
    if (presentPagedetails.pageContent && presentPagedetails.pageContent.length > 0) {
        Text = '<div  class="partner-details">'
        Text += '<div id="partnersTitle">'
        Text += '<div class="partner_header">'
        Text += '<div class="leftPanel col-md-6">'
        Text += '<h3>' + presentPagedetails.pageContent[0].title + '</h3></div>'
        Text += '<div class="rightPanel col-md-6">'
        Text += '</div></div></div></div>'
    }
    return Text;
}

//view all page
Util.getGridSections = function (data) {
    if (data.sections && data.sections[0] && data.sections[0].sectionData.data.length > 0) {
        var Text = '<div class="sectionsGrid">'
        if( presentPagedetails.isMenuPathforGrid == false){
         Text += Util.pageHeader(data.sections[0].sectionInfo.name)
        }
        Text += '<div class="container sectionsGrid_Items">';
        var cardsForRow = keyHandlar.noOfCardForARowInGrid(data.sections[0].sectionData.data[0].cardType)
        for (var i = 0; i < data.sections[0].sectionData.data.length; i++) {
            var v_index = Math.floor(i / cardsForRow);
            var h_index = i % cardsForRow;
            if (h_index == 0) { Text += "<div id='viewAllrow-" + v_index + "' class='row viewall_row'>"; }
            Text += Util.getCard(data.sections[0].sectionData.data[i], 'sectionItem-' + v_index + '-' + h_index);
            if (h_index == cardsForRow - 1) { Text += "</div>" }
        }
        Text += '</div>'
        Text += '</div>';
        return Text;
    } else {
        //NO DATA FOUND IN LIST PAGE
        var Text = '<div class="sectionsGrid">';
        if( presentPagedetails.isMenuPathforGrid == false){
            Text += Util.pageHeader(presentPagedetails.listTitle);
        }
        Text += Util.noDataFound();
        Text += '</div>';
        return Text;
    }
}

// header in View all pages
Util.pageHeader = function (text) {
    if (utilities.validateString(text) == false) text = 'HOME';
    return '<div class="title-header" ><div class="container"><h1>' + text + '</h1></div></div>';
}

Util.searchHTML = function () {
    var Text = '';
    Text += '<div class="search-page">'
    Text += '<div class="title-header"><div class="container"><img src="images/logo_test.png"/></div></div>';
    Text += '<div class="container">'
    Text += '<div class="search-wrap">'
    Text += '<div class="form-group">'
    Text += '<label id = "searchData" class="form-control" >Search Live TV,Catch-Up and more...</label>'
    Text += '<img class="search-icon" src="images/search_icon.png"/>'
    Text += '</div>'
    Text += '<div class="searchSuggestions">'
    Text += '</div>'
    Text += '<div class="search-keyboard">'
    Text += '<div class="search-key-container" id="characterMap" >'
    for (var i = 0; i < Alpha.length; i++) {
        Text += '<div  class=" search-keys search-50" id="Alpha-' + i + '" keyValue="' + Alpha[i] + '" source="letters">' + Alpha[i] + '</div>'
    }
    Text += '</div>'
    Text += '<div class="search-key-container" id="NumbersMap" > '
    for (var i = 0; i < numberKeys.length; i++) {
        Text += '<div  class=" search-keys search-50" id="Alpha-' + (26 + i) + '" keyValue="' + numberKeys[i] + '" source="numbers">' + numberKeys[i] + '</div>'
    }
    Text += '</div>'
    Text += '<div class="search-key-container">'
    Text += '<div  class=" search-keys search-118" id="Alpha-51" keyValue="ABC" source="settings"  >ABC</div>'
    Text += '<div class=" search-keys search-310" id="Alpha-52" keyValue="space" source="settings"><span class="search-spacebar"></span></div>'
    Text += '<div class=" search-keys search-118" id="Alpha-53" keyValue="backspace" source="settings" ><span class="search-backicon"></div>'
    Text += '<div  class=" search-keys search-118" id="Alpha-54" keyValue="clear" source="settings">Clear</div>'
    Text += '</div>'
    Text += '</div>'
    Text += '</div>'
    Text += '</div>'
    Text += '<div id="resultsCount" class="container"></div>';
    Text += '<div id="searchResults" class="container"></div>';
    Text += '</div>'
    return Text;
}

Util.getSearchSuggestionsHTML = function (data) {
    var Text = '<div class="suggestionList">';
    for (var i = 0; i < data.length; i++) {
        Text += '<div class="suggestionItem" source="suggestion" id="suggest-' + i + '">' + data[i] + '</div>';
    }
    Text += '<div>';
    return Text;
}

Util.getResultsHTML = function (msg) {
    return '<h3 class="resultsCount"> ' + msg + '</h3>';
}

Util.getSearchResultsHTML = function (data) {
    var Text = '<div class="sectionsGrid">';
    Text += '<div class="searchBtn-Tabs">'
    Text += Util.getSearchPageTabs(data,0);
    Text += '</div>' 
    Text += '<div class="sectionsGrid_Items">';
    Text += Util.getSearchResultsByTab(data,0);
    Text += '</div>';
    Text += '</div>'
    return Text;
}

Util.getSearchPageTabs = function (data,activeTabIndx) {
    var Text ='';
    for (var i = 0; i < data.length; i++) {
    Text += '<button type="button" id="searchTab-'+i+'" source="searchTab" class="grey-btn';
    Text += (i==activeTabIndx) ? ' activeTab">' : '">';
    Text +=data[i].displayName+' - '+data[i].count+'</button>'
    }
    return Text;    
}

Util.getSearchResultsByTab = function (data,indx) {
    var Text ='';
    var i = (presentPagedetails.searchPaginationPage.lastdataLength>0) ? (presentPagedetails.searchPaginationPage.lastdataLength):0;
    var cardsForRow = keyHandlar.noOfCardForARowInGrid('search-card');
    for (i; i < data[indx].data.length; i++) {
        data[indx].data[i].cardType = 'search-card';
        var v_index = Math.floor(i / cardsForRow);
        var h_index = i % cardsForRow;
        if (h_index == 0) { Text += "<div id='viewAllrow-" + v_index + "' class='row viewall_row'>"; }
        Text += Util.getCard(data[indx].data[i], 'sectionItem-' + v_index + '-' + h_index);
        if (h_index == cardsForRow - 1) { Text += "</div>" }
    }
    return Text;
}

Util.addPaginationToSearchPage = function (data) {
    var splitData = Yup('.activeTab').attr("id").split('-');
    presentPagedetails.searchPaginationPage.lastdataLength=presentPagedetails.searchResults[parseInt(splitData[1])].data.length;
    for (var i = 0; i < presentPagedetails.searchResults.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if(presentPagedetails.searchResults[i].sourceType==data[j].sourceType){
                presentPagedetails.searchResults[i].count=presentPagedetails.searchResults[i].count+data[j].count;
                for (var k = 0; k < data[j].data.length; k++) {
                    presentPagedetails.searchResults[i].data.push(data[j].data[k]);
                }
            }
        }
    } 
    var noOfCardForARow = keyHandlar.noOfCardForARowInGrid('search-card');
    var lastRow = Math.floor((presentPagedetails.searchPaginationPage.lastdataLength - 1) / noOfCardForARow);
    var lastindexdiff = ((lastRow + 1) * noOfCardForARow) - presentPagedetails.searchPaginationPage.lastdataLength;
    if (lastindexdiff != 0) {
        var TextInsideRow = "";
        for (var i = 0; i < lastindexdiff; i++) {
            TextInsideRow += Util.getCard(presentPagedetails.searchResults[parseInt(splitData[1])].data[i], 'sectionItem-' + lastRow + '-' + ((noOfCardForARow - lastindexdiff) + i));
        }
        Yup("#viewAllrow-" + lastRow).append(TextInsideRow);
        presentPagedetails.searchPaginationPage.lastdataLength=presentPagedetails.searchPaginationPage.lastdataLength+lastindexdiff;
    }
    // Adding Html to Pagination results on page
    Yup('.searchBtn-Tabs').html(Util.getSearchPageTabs(presentPagedetails.searchResults,parseInt(splitData[1])));
    Yup(".sectionsGrid_Items").append(Util.getSearchResultsByTab(presentPagedetails.searchResults,parseInt(splitData[1])));
}

Util.signInHtml = function (formType) {
    var Text = '';
    Text += '<div  class="signInform" id="signInContent"><div class="container">'
    Text += '<div class="" id="headSignIn">'
    Text += '<div class=""><h2 class="signHead" id="signinTitle">Sign in to your account</h2></div>'
    Text += '<div class="headerLogo"> <img src="' + appConfig.staticColudPath + 'images/logo_test.png" class="img-responsive" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/logo_test.png"/></div>'  
    Text += '</div>'
    Text += '<div class="row content-layout">'
    Text += '<div class="col6" id="keyLayout">';
    if(formType == 'email'){ //email
        Text += Util.emailKeys('signin'); 
        presentPagedetails.formType = 'email';
    }else{
        Text += Util.numberKeys('signin'); 
        presentPagedetails.formType = 'mobile';
    }
    Text +='</div>'  
    Text += '<div class="col6" id="formLayout">';
    if(formType == 'email'){
        Text += Util.signForms('email');         
    }else{ //email
        Text += Util.signForms('mobile'); 
    } 
    Text += '</div>'
    Text += '</div>'
    Text += '</div>'
    Text += '</div>'
    return Text;
}

Util.emailKeys =function(type){
    var Text = '';
    Text += '<div class="keyboardCont emailkeys">';  
   
    Text += '<span id="arrowNumPointer" class="arrow-right-email"></span>'; 
    Text += '<p id="headingText">Enter your  email</p>';
    Text += '<div class="keyboardBlock">'
    for (var i = 0; i < characterArray.length; i++) { 
        var focusAdd = (i == 0) ? 'imageFocus' : ''       
        Text += '<div id="emailKeys-' + i + '" index="' + i + '" class="keyboardKeys genkeys '+focusAdd+'" source="keyPadEmail" >'+ characterArray[i] + '</div>'
    }
    Text += '<div  id="emailKeys-40" index="40" class="keyboardKeys email-keys"  source="keyPadEmail">@hotmail.com</div>'
    Text += '<div  id="emailKeys-41" index="41" class="keyboardKeys email-keys"  source="keyPadEmail">@gmail.com</div>'
    Text += '<div  id="emailKeys-42" index="42" class="keyboardKeys email-keys"  source="keyPadEmail">@yahoo.com</div>'
    Text += '<div  id="emailKeys-43" index="43" class="keyboardKeys sp-keys"  source="keyPadEmail">!#$</div>'
    Text += '<div  id="emailKeys-44" index="44" class="keyboardKeys at-keys"  source="keyPadEmail">@</div>'
    Text += '<div  id="emailKeys-45" index="45" class="keyboardKeys dot-keys"  source="keyPadEmail">.</div>'
    Text += '<div  id="emailKeys-46" index="46" class="keyboardKeys com-keys"  source="keyPadEmail">.com</div>'   
    Text += '<div  id="emailKeys-47" index="47" class="keyboardKeys backBtn"  source="keyPadEmail"><span></span></div>'
    Text += '</div>';   
    if(type == 'signin'){
        Text += '<div id="emailKeys-48" index="48" class="keyboardKeys actionKey" source="actionKeyEmail" >Cancel</div>';
        Text += '<div id="emailKeys-49" index="49" class="keyboardKeys actionKey" source="actionKeyEmail" >Next</div>';
    }   
    Text += '</div>';
    //Text += '<div class="keyboardFooter">';
    // if(type == 'signin'){  //signin with mobile button
    //     Text += '<div id="emailKeys-50" index="50" class="keyboardKeys actionKey" source="actionKeyEmail"  >Sign in with mobile</div>';       
    // } 
    //Text += '</div>';
    return Text;  
}

Util.numberKeys =function(type){
    var Text = '';
    Text += '<div class="keyboardCont">'
    Text += '<span id="arrowNumPointer" class="arrow-right-email"></span>';
    if(type == 'otp' || type == 'signupotp'){
        Text += '<p id="headingText">Enter your OTP</p>';
    }else{
        Text += '<p id="headingText">Enter your mobile number</p>';
    } 
    Text += '<div class="keyboardBlock">'
    for (var i = 1; i < 10; i++) {
        var focusAdd = (i == 1) ? 'imageFocus' : ''
        Text += '<div id="numeric-' + i + '" index="' + i + '" class="keyboardKeys ' + focusAdd + ' " source="keyPadNumaric">' + i + '</div>';
    }
    Text += '<div id="numeric-10" index="10" class="keyboardKeys keyboardKeys2" source="keyPadNumaric">0</div>'
    Text += '<div id="numeric-11" index="11" class="keyboardKeys backButton" source="keyPadNumaric"><span></span></div>';
    Text += '</div>';
    Text += '<div id="numeric-12" index="12" class="keyboardKeys actionKey" source="actionKey" >Cancel</div>';
    if(type == 'forget'){
        Text += '<div id="numeric-13" index="13" class="keyboardKeys actionKey" source="actionKey" >Get OTP</div>';
    }else if(type == 'signin' || type == 'otp' || type=='signup'){
        Text += '<div id="numeric-13" index="13" class="keyboardKeys actionKey" type="'+type+'" source="actionKey" >Next</div>';
    }else if( type == 'signupotp'){
        Text += '<div id="numeric-13" index="13" class="keyboardKeys actionKey" type="'+type+'" source="actionKey" >Verify</div>';
    }
    Text += '</div>';
    Text += '<div class="keyboardFooter">';    
    if(type == 'forget' || type == 'signin' || type == 'signup'){
        Text += '<div id="numeric-14" index="14" class="keyboardKeys actionKey" source="actionKey"  >Change Country code</div>';        
    }  
    if(type == 'signin'){
       Text += '<div id="numeric-15" index="15" class="keyboardKeys actionKey" source="actionKey"  >Sign in with Email</div>';
    }    
    if(type == 'signin' && appConfig.forgetpassword == true){
        Text += '<div id="numeric-16" index="16" class="keyboardKeys actionKey" source="actionKey"  >Forgot Password</div>';       
    }
    if(type=='signupotp'){
        Text += '<div id="numeric-14" index="14" class="keyboardKeys actionKey resendButton" source="actionKey" btntype="resendBtn"  ><span class="timer-resend"></span></div>'; 
    }
    Text += '</div>';
    return Text;
}

Util.genericKeys = function (type) {
    var Text = '';
    Text += '<div class="keyboardCont">'
    if(type == 'reenterPassword' || type == 'updatePassword' || type== 'confirmPassword' ){
        Text += '<span  id="arrowGenPointer" class="arrow-right-password new"></span>'
    }else if(type == 'changePassOld'){
        Text += '<span  id="arrowGenPointer" class="arrow-right-password first"></span>'
    }
    else{
        Text += '<span  id="arrowGenPointer" class="arrow-right-password"></span>'
    }    
    if(type == 'signin' ||type == 'signuppassword'){
        Text += '<p id="headingText">Enter Password</p>'
    }else if(type == 'newPassword'){
        Text += '<p id="headingText">Enter New Password</p>'
    }else if(type == 'reenterPassword' || type == 'updatePassword' ){
        Text += '<p id="headingText">Re-enter New Password</p>'
    }else if(type == 'changePassOld'){
        Text += '<p id="headingText">Enter Old password</p>'
    }else if(type== 'confirmPassword'){
        Text += '<p id="headingText">Confirm password</p>'
    }
    Text += '<div class="keyboardBlock">'
    for (var i = 0; i < characterArray.length; i++) { 
        var focusAdd = (i == 0) ? 'imageFocus' : ''       
        Text += '<div id="defaultKeys-' + i + '" index="' + i + '" class="keyboardKeys genkeys  '+focusAdd+'" source="keyPadGenric" >'+ characterArray[i] + '</div>'
    }
    Text += '<div  id="defaultKeys-40" index="40" class="keyboardKeys sp-keys"  source="keyPadGenric">!#$</div>'
    Text += '<div  id="defaultKeys-41" index="41" class="keyboardKeys spaceBar" source="keyPadGenric"><span class="spacebar"></span></div>'
    Text += '<div  id="defaultKeys-42" index="42" class="keyboardKeys backBtn"  source="keyPadGenric"><span></span></div>'
    Text += '</div>'
    if(type == 'changePassOld'){
        Text += '<div  id="defaultKeys-43" index="43"  class="keyboardKeys actionKey" source="actionKeyGen">Cancel</div>'
    }
    else{
        Text += '<div  id="defaultKeys-43" index="43"  class="keyboardKeys actionKey" source="actionKeyGen">Previous</div>'
    }
   
    if(type == 'signin'){
        Text += '<div  id="defaultKeys-44" index="44" class="keyboardKeys actionKey"  source="actionKeyGen">Sign In</div>'
    }else if(type == 'newPassword' || type == 'changePassOld' || type== 'signuppassword' ){
        Text += '<div  id="defaultKeys-44" index="44" class="keyboardKeys actionKey"  source="actionKeyGen">Next</div>'
    }else if(type == 'reenterPassword'){
        Text += '<div  id="defaultKeys-44" index="44" class="keyboardKeys actionKey"  source="actionKeyGen">Reset</div>'
    } else if(type == 'updatePassword'){
        Text += '<div  id="defaultKeys-44" index="44" class="keyboardKeys actionKey"  source="actionKeyGen">Update</div>'
    } 
    else if(type == 'confirmPassword'){
        Text += '<div  id="defaultKeys-44" index="44" class="keyboardKeys actionKey"  source="actionKeyGen">Sign Up</div>'
    }    
    Text += '</div>';
    Text += '<div class="row chkblock">'
    Text += '<div id="checkBox" class="checkBox">'
    Text += '<label class="control control--checkbox" >Show Password'  ;
    if( presentPagedetails.isChecked == false ){
        Text += '<div class="control__indicator signShowPassowrd" id="defaultKeys-45" isChecked="no" source="actionKeyGen"  index="45"><span></span></div></label>';
    }else{
        Text += '<div class="control__indicator signShowPassowrd checked " id="defaultKeys-45" isChecked="yes" source="actionKeyGen"  index="45"><span></span></div></label>';
    }
    Text += '</div>'
    Text += '</div>'
    return Text;
}

Util.signForms = function (type) {
    var Text = '';
    Text +='<div>'
    //mobilenumber
    if(type=='mobile'){
        Text +='<div class="mobileNum">'
        Text += '<div class="row country-mobile"><label class="authlabel">Mobile Number</label><div class="countryCode" class="col2"> '+Util.countryCodeForm() +'</div>'; 
        Text +='<div class="mobile_number_from"><input type="text" keyType="numeric" index="0" class="inputForm input-active" formType="mobileNum" placeholder="Mobile Number" disabled name="mobileNumber" id="signInInput-0"></div>'
        Text += '<div class="error-block"><label id="signInErrLabel-0" class="errorInput" ></label></div></div></div>';
    }else{
        Text +='<div class="mobileNum">'      
        Text +='<div class="row country-mobile"> <label class="authlabel">Email</label> <input class="inputForm input-active"" formType="emailType" disabled    placeholder="Email" index="0" keyType="emailkeys" type="text" name="email" id="signInInput-0" ></div>'
        Text += '<div class="error-block"><label id="signInErrLabel-0" class="errorInput" ></label></div></div></div>';   
    }
    //password
    Text += '<div class="password ">'
    Text +='<div class="row country-mobile"> <label class="authlabel">Password</label> <input class="inputForm" formType="password" placeholder="Password" index="1" disabled keyType="defaultKeys" type="password" name="Password" id="signInInput-1" ></div>'
    Text += '<div class="error-block"><label id="signInErrLabel-1" class="errorInput" ></label></div></div>'
    Text += '</div>'
    return Text;
}

Util.forgetPasswordFrom =function(){
    var Text = '';
    Text +='<div>'
    Text +='<div class="mobileNum">'
    Text += '<div class="row country-mobile"><label class="authlabel">Mobile Number</label><div class="countryCode" class="col2"> '+Util.countryCodeForm() +'</div>'; 
    Text +='<div class="mobile_number_from"><input type="text" keyType="numeric" index="0" class="inputForm input-active"  placeholder="Mobile Number" disabled name="mobileNumber" id="signInInput-0"></div>'
    Text += '<div class="error-block"><label id="signInErrLabel-0" class="errorInput" ></label></div></div></div>'    
    return Text;
}

Util.countryCodeForm =function(){
    var Text = '<div class="inside_countryCode"><img id="signInFlag" src="'+ Main.countryFlag + '" alt="" />'
    Text += '<span class="signInCountryCode" id="signInCountryCode" >'+'+'+Main.mobileCode+'</span></div>';
    return Text;
}

Util.countryCodeSelectionHtml= function () {
    var Text = '';
    Text += '<div class="countrySelection">'
    Text += '<div class="row">'
    Text += '<div class="col12">'
    Text += '<div class="textCenter">'
    Text += '<h2 class="sign-head">Select Your Country Code</h2>'
    Text += '</div>'
    Text += '</div>'
    Text += '</div>'

    Text += '<div class="row">'
    Text += '<div class="country-code-page">'
     for (var i = 0; i < countryList.length; i++) {
        var imageFoucs = (i == 0) ? 'imageFocus' : '';
        Text += '<div index="' + i + '" id="country-' + i + '" class="row country-normal '+ imageFoucs + '">';
        Text += '<div class="country-sections" > <img src="' + countryList[i].iconUrl  + '" class="countryCodeFlag" alt=""/></div>'
        Text += '<div class="country-sections text-pad-top"> ' + countryList[i].name;       
        Text += '<span class="countryCodeValue"> + ' + countryList[i].isdCode + ' </span> '
        Text += '</div> ' 
        Text += '</div>'
     }
    Text += '</div>'
    Text += '</div>'
    Text += '</div>'
    return Text;
}

Util.forgetPasswordHTML =function(){
    var Text = '';
    Text += '<div class="forgetPasswordForm" id="signInContent"><div class="container">'
    Text += '<div class="row" id="headSignIn">'
    Text += '<div class="col2 headerLogo"> <img src="' + appConfig.staticColudPath + 'images/logo_test.png" class="img-responsive" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/logo_test.png"/></div>'
    Text += '<div class="col8"><h2 class="signHead textCenter" id="signinTitle" >Reset Password</h2></div>'  
    Text += '<div class="col2"></div>'
    Text += '<div class="row signsubHead textCenter"> <span class="" id="signinSubTitle"> An One Time Password(OTP) will be sent to your registered Mobile Number</span> </div>'
    Text += '</div>'    
    Text += '<div class="row">'
    Text += '<div class="col6" id="keyLayout">'
    Text += Util.numberKeys('forget'); 
    Text +='</div>'  
    Text += '<div class="col6" id="formLayout">'
    Text += Util.forgetPasswordFrom();   
    Text +='</div>'
    Text +='</div>'    
    Text +='</div>'
    Text += '</div>'
    return Text;
}

Util.otpVerificationHTML =function(){
    var Text = '';
    Text += '<div class="otpVerifyFrom" id="signInContent"><div class="container">'
    Text += '<div class="row" id="headSignIn">'
    Text += '<div class="col2 headerLogo"> <img src="' + appConfig.staticColudPath + 'images/logo_test.png" class="img-responsive" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/logo_test.png"/></div>'
    Text += '<div class="col8"><h2 class="signHead textCenter" id="signinTitle" >Reset Password</h2></div>'  
    Text += '<div class="col2"></div>'
    Text += '<div class="row signsubHead textCenter"> <span class="" id="signinSubTitle">One Time Password(OTP) has been sent to your Mobile '+tempObjectData.mobileNo+'. Please enter the same here to reset Password</span> </div>'
    Text += '</div>'    
    Text += '<div class="row">'
    Text += '<div class="col6" id="keyLayout">'
    Text += Util.numberKeys('otp'); 
    Text +='</div>'  
    Text += '<div class="col6" id="formLayout">'
    Text += Util.resetPasswordFrom();   
    Text +='</div>'
    Text +='</div>'    
    Text +='</div>'
    Text += '</div>'
    return Text;
}

Util.resetPasswordFrom =function(){
    var Text = '';
   
    Text += '<div class="otp">'
    Text +='<div class="row country-mobile"> <label class="authlabel">Enter OTP</label> <input class="inputForm input-active" placeholder="Enter OTP" index="0" disabled keyType="numeric" type="text" name="text" id="signInInput-0" ></div>'
    Text += '<div class="error-block"><label id="signInErrLabel-0" class="errorInput" ></label></div></div>'
    
    Text += '<div class="newPassword">'
    Text +='<div class="row country-mobile"> <label class="authlabel">Enter your new password</label> <input class="inputForm" placeholder="Enter New password" index="1" disabled keyType="defaultKeys" type="password" name="newPassword" id="signInInput-1" ></div>'
    Text += '<div class="error-block"><label id="signInErrLabel-1" class="errorInput" ></label></div></div>'
   
    Text += '<div class="reEnterNewPassword">'
    Text +='<div class="row country-mobile"> <label class="authlabel">Re-enter your new password</label> <input class="inputForm" placeholder="Re-enter New Password" index="2" disabled keyType="defaultKeys" type="password" name="reenterPassword" id="signInInput-2" ></div>'
    Text += '<div class="error-block"><label id="signInErrLabel-2" class="errorInput" ></label></div></div>'

    Text += '<div class="textCenter mt45">'   
    Text += '<div id="resendBtn" class="btn-default resendButton" type="resendButton" source="signupBtn"> Resend <span class="timer-resend"> </span> </div>'
    Text += '</div>'
     
    return Text;
}

Util.getAccountDetailsHTML = function () {
    var Text = '';
    //Text += Util.getTopBar(presentPagedetails.menusList);
    Text += '<div class="settings">' 
    if (Main.userProfile.userId == '') {
        Text += "<div id='accountContent'>"
        Text += "<div class='no-sidebar'>"
        Text += "<div class='account-page'>"
        Text += '<div class="container">'
        var deviceName = '';
        if (device.manufacturer == "unknown") {
            deviceName = appConfig.deviceName;
        }
        else {
            deviceName = device.manufacturer + ' (' + device.model + ') ' + device.platform;
        }
        Text += '<div  class="device-details"><table>'
        Text += '<tr> <td>Device Name</td><td>' + deviceName + '</td></tr>'
        Text += '<tr> <td>Device Version</td><td>' + device.version + '</td></tr>'
        Text += '<tr> <td>Box ID</td><td>' + Main.BOXID + '</td></tr>'
        Text += '</table></div>'

        Text += '<div class="display-table auto-center">'
        Text += '<div class="deviceInfo display-table-cell">'
        Text += '<h2 class="main-heading textCenter">Have an account?</h2>'
        Text += '<button id="account-0-0" class="toptab accountSignin grey-btn" h_index="0" v_index="0" source="accountSignin">Sign in</button>'
        Text += '</div>'       
        Text += '</div></div></div></div>';
    } else {      
        Text += "<div id='accountContent'>"
        Text += '<div class="sidebar">'
        Text += '<div class="sidebar-body" id="accountSideBar"> '
        Text += '<ul>'
        Text += '<li class="toptab active"  source="headTab" h_index="0" v_index="0" id="account-0-0" type="profileTab"><span >Account</span></li>'
        // Text += '<li class="toptab"  id="account-1-0" source="headTab" h_index="0" v_index="1"  type="profileTab"><span >Languages</span></li>'
        Text += '<div class="signout-bar">'
        Text += '<button class="toptab signout-btn grey-btn" id="account-1-0" source="headTab" h_index="0" v_index="2"  type="profileTab" >Sign out</button>'
        Text += '</div>'
        Text += '</div>'
        Text += '</div>'
        Text += '<div class="account-page">'      
        Text += Util.profileInfo();           
        Text += '</div>'
        Text += '</div>'
    }
    Text += '</div>'
    return Text;
}

// ProfileInfo
Util.profileInfo = function () {
    var count = 1;
    var Text = '';
    Text += '<div class="fieldset" id="MyAccountContent">'
    Text += '<p class="AccountTitle">Account Info</p>'
    Text += '<form>'
    Text += '<div class="form-group container">'
    // Text += '<div class="row pb40">'
    // Text += '<div class="col3"><label>Device Name</label></div>'
    // var deviceName = '';
    // if (device.manufacturer == "unknown") {
    //     deviceName = appConfig.deviceName;
    // }
    // else {
    //     deviceName = device.manufacturer + ' (' + device.model + ') ' + device.platform;
    // }
    // Text += '<div class="col9"><span>' + deviceName + '</span></div>'
    // Text += '</div>'
    // Text += '<div class="row pb40">'
    // Text += '<div class="col3"><label>Device Version</label></div>'
    // Text += '<div class="col9"><span>' + device.version + '</span></div>'
    // Text += '</div>'
    // Text += '<div class="row pb40">'
    // Text += '<div class="col3"><label>Box ID</label></div>'
    // Text += '<div class="col9"><span>' + Main.BOXID + '</span></div>'
    // Text += '</div>'
    // Text += '<div class="row pb40">'
    // Text += '<div class="col3"><label>Name</label></div>'
    // Text += '<div class="col9"><span>' + Main.userProfile.name + '</span></div>'
    // Text += '</div>'
    if (Main.userProfile.email || Main.userProfile.attributes.email_id) {
        Text += '<div class="form-group" id="" index="" count="' + count + '" source="accountContent">'
        Text += '<div class="row">'
        Text += '<div class="col4"><label>Email</label></div>'
        Text += '<div class="col8">'
        var emailId=( Main.userProfile.email) ? (Main.userProfile.email) :(Main.userProfile.attributes.email_id)
        Text += '<span>' + emailId + '</span>'
        Text += '</div></div></div>'
    }
    if (Main.userProfile.mobile) {
        Text += '<div class="form-group" id="" index="" count="' + count + '" source="accountContent">'
        Text += '<div class="row">'
        Text += '<div class="col4"><label>Mobile No</label></div>'
        Text += '<div class="col8">'
        Text += '<span id="accountMobile">' + Main.userProfile.mobile + '</span>'
        Text += '</div></div></div>'
    }
    Text += '</form>';
    Text += '</div>'  
    Text += '</div>'  
    Text += '<div id="user-active-packages">'
    Text += Util.getActivePackages();
    Text += '</div>'
    return Text;
}

// trancaction packages
Util.getBilling = function () {
    var Text = '';
    Text += '<div class="table-responsive">'
    if (presentPagedetails.transactionDetails.length > 0) {
        Text += '<table class="table active-packages">'
        Text += '<thead>'
        Text += '<tr>'
        Text += '<th>Package Name</th>'
        Text += '<th>Gateway</th>'
        Text += '<th>Currency</th>'
        Text += '<th>Amount</th>'
        Text += '<th>Order Id</th>'
        Text += '<th>Purchase Date</th>'
        Text += '<th>Status</th>'
        Text += '<th>Next Renew Date</th>'
        Text += '</tr>'
        Text += '</thead>'
        Text += '<tbody>'
        for (var i = 0; i < presentPagedetails.transactionDetails.length; i++) {
            Text += '<tr class="toptab" count=' + presentPagedetails.transactionDetails.length + '  index=' + i + ' id="accountContent-' + i + '" source="accountContent" type="activePkg">'
            Text += '<td><span class="pack_name_cell">' + presentPagedetails.transactionDetails[i].packageName + '</span></td>'
            Text += '<td>' + presentPagedetails.transactionDetails[i].gateway + '</td>'
            Text += '<td>' + presentPagedetails.transactionDetails[i].currency + '</td>'
            Text += '<td>' + presentPagedetails.transactionDetails[i].amount + '</td>'
            Text += '<td>' + presentPagedetails.transactionDetails[i].orderId + '</td>'
            Text += '<td>' + utilities.getRealDate(presentPagedetails.transactionDetails[i].purchaseTime) + '</td>'
            Text += '<td>' + presentPagedetails.transactionDetails[i].status + '</td>'
            Text += '<td>' + utilities.getRealDate(presentPagedetails.transactionDetails[i].expiryTime) + '</td>'
            Text += '</tr>'
        }
        Text += '</tbody>'
        Text += '</table>'
    }
    else {
        Text += "<div style='font-size: 36px;text-align: center;margin-top: 250px;'>No Transaction History</div>";
    }
    Text += '</div>'
    return Text;
}

// active packages
Util.getActivePackages = function () {
    var Text = '';
    if (!!presentPagedetails.settingsActivepackages && presentPagedetails.settingsActivepackages.length > 0) {
        Text += '<div class="fieldset" id="ActivePackageContent">'
        Text += '<p class="AccountTitle">Active Plans</p>'
        Text += '<form>'
        Text += '<div class="form-group container">'  
        Text += '<div class="form-group-inner">'   
        for (var i = 0; i < presentPagedetails.settingsActivepackages.length; i++) {
            Text += '<div class="form-group" count=' + presentPagedetails.settingsActivepackages.length + ' packName = ' + presentPagedetails.settingsActivepackages[i].name + ' subSource = "selectCurretnPack" index=' + i + ' id="accountContent-0-' + i + '" packid = ' + presentPagedetails.settingsActivepackages[i].id + ' packGateWay = ' + presentPagedetails.settingsActivepackages[i].gateway + ' source="accountContent" type="activePkgs">'
            Text += '<div class="row">'
            Text += '<div class="col4"><label>'+presentPagedetails.settingsActivepackages[i].name+'</label> </div>'
            Text += '<div class="col8">'
            Text += '<pre>' + presentPagedetails.settingsActivepackages[i].saleAmount +' / ' +presentPagedetails.settingsActivepackages[i].packageType + ' </pre>'
            Text += '<pre>' + presentPagedetails.settingsActivepackages[i].message+'</pre>'
            Text += '</div></div></div>'
        } 
        Text += '</div>' 
        Text += '</form>' 
        Text += '</div>' 
    }
    return Text;
}

//Faq HTML
Util.faqHTML = function () {
    return '<div id="faq_html" > <div class="container"><div class="row remove-margin "><div class="lang_eng col12 remove-padding ott-text-padding"><div class="row remove-margin ott-about-us"> <left-side-menu></left-side-menu><div class="col12 remove-padding ott-text-padding ott-about-section"><div class="col12 remove-padding"><div class="signle_head"><h1 class="about-h1"></h1></div><h1 class="about-h1">1. What is SRIFlix ?</h1><p>SRIFlix is an online OTT entertainment hub which has Live TV, Catch-up TV, TV SHOWS, Movies , drama and much more video content through a powerful engine built for delivering the video content through Smart Phones / TABs / PCs / Laptops etc.</p><h1 class="about-h1">2. How can I use the service?</h1><p>You can log on to <a href="https://www.sriflix.lk/" target="_blank">www.sriflix.lk</a> or download the app from android play store and iOS App store</p><h1 class="about-h1">3. How do I register on SRIFlix website?</h1><p>You can register by providing your Mobitel number. And for the moment it is available for Mobitel Customers only.</p><h1 class="about-h1">4. Is registration for SRIFlix chargeable?</h1><p> There are no charges for the registrations. However, subscription charges exist as per the selected SRIFlix package.</p><h1 class="about-h1">5. What are the charges or available packs?</h1><table class="table table-bordered"><thead><tr><th>Pack Name</th><th>Daily Pack (LKR)</th><th>Monthly Pack (LKR)</th></tr></thead><tbody><tr><td>All Local Channel pack</td><td>3.50 Per day</td><td>100 Per month</td></tr><tr><td>Each Premium Channels (including sports)</td><td>3.50 Per day</td><td>100 Per month</td></tr><tr><td>Video All Access Pack</td><td>5.00 Per day</td><td>150 Per month</td></tr><tr><td>Partner Packs</td><td>3.50 Per day</td><td>100 Per month</td></tr></tbody></table><p>*30 days FREE trial is applicable for all packages. Government TAX will be added on above charges.</p><h1 class="about-h1">6. What are devices that I can use SRIFlix?</h1><p>Mobile phones/ Tabs /PC / Laptop</p><h1 class="about-h1">7. Does SRIFlix auto-renew my subscription, after expiration of subscribed duration? If yes, how will I get billed?</h1><p>Based on the pack you have subscribed renewal will happen. If it’s a daily pack, you will be charged daily basis and monthly pack will be charged once in 30 days from the date of subscription.</p><h1 class="about-h1">8. How can I Cancel / Unsubscribe SRIFlix?</h1><p class="mb10">You can log on to your account and follow the below steps.</p><ul><li>Settings > My Subscriptions > Cancel subscription.</li><li>You can contact our customer by dialing 1717 from any network or visit your nearest Mobitel branch and cancel the subscription.</li></ul></div></div></div></div></div></div>'
}

//contact Us HTML
Util.contactUsHTML = function () {
    return '<div id="contact_us_html" > <div class="container"><div class="row remove-margin "><div class="col12 remove-padding ott-about-section"> <h3>Visit us</h3><div class="contact_block"><p>At our nearest outlet: <a href="https://www.mobitel.lk/store-find" target="_blank">Find Mobitel Store near you</a></p></div><h3>Email us</h3><div class="contact_block"><p>For Inquiries & Concerns: <a href="mailto:info@mobitel.lk" target="_blank">info@mobitel.lk</a></p></div><h3>Mail us</h3><div class="contact_block"><p>Regarding inquiries or concerns to Manager</p><p>Mobitel (Pvt) Ltd.</p><p>108,</p><p>W.A.D Ramanayake Mawatha,</p><p>Colombo 02,</p><p>Sri Lanka</p></div><h3>Call us</h3><div class="contact_block"><p>24 Hour Customer Service Hotline +94 (0) 712755777 or dial 1717 from any network in Sri Lanka</p><p>For Sinhala : Press1</p><p>For Tamil : Press2</p><p>For English : Press3</p><p>24 Hour Roaming Service Hotline +94 (0) 714555555</p><p>General Line - +94 (0) 112330550</p><p>(9.00 am to 5.00 pm) Weekdays</p></div><h3>Fax</h3><div class="contact_block"><p>for Customer Inquiries or Concerns - +94 (0)112330396</p></div></div><div class="col12 remove-padding ott-text-padding ott-social-section"><h1 class="about-h1">Follow us</h1><div class="col4"><div class="social-box textCenter"><div class="social-icon"> <img src="http://d3gt70lx5ulpl2.cloudfront.net/static/teleup/images/fb_square.svg" alt="" /></div> <span class="social-link">https://www.facebook.com/Mobitel</span></div></div><div class="col4"><div class="social-box textCenter"><div class="social-icon"> <img src="http://d3gt70lx5ulpl2.cloudfront.net/static/teleup/images/twitter_square.svg" alt="" /></div> <span class="social-link">https://twitter.com/MobitelSriLanka</span></div></div></div></div></div></div>'
}

Util.languagesListHTML =function () {
    var Text = '';
    Text += '<div id="lang_html" class="langHTML">'
    Text += '<div class="langPreData"> <div class="langTitle" >Choose Content Languages</div>'
    Text += '<div class="langSubTitle" >You can get easy access to content you want</div> </div>'   
    Text += '<div class="langList">'    
    for(var i=0;i<systemConfigs.contentLanguages.length;i++){
        if(Main.userProfile.languages){            
           var splitData = Main.userProfile.languages.split(',');          
           var isFound =false;
           for(var j=0;j<splitData.length;j++){
               if(splitData[j] ==systemConfigs.contentLanguages[i].code){
                isFound = true;
                break;
               }
           }
           if(isFound == true){
            Text +=  '<div class="toptab langItem selected" isSelected="true" id="accountContent-1-'+i+'" value="'+systemConfigs.contentLanguages[i].code+'" source="langSelection">';
           }else{
            Text +=  '<div class="toptab langItem" isSelected="false" id="accountContent-1-'+i+'" value="'+systemConfigs.contentLanguages[i].code+'" source="langSelection" >';
           }
        }else{
            Text +=  '<div class="toptab langItem selected" isSelected="true" id="accountContent-1-'+i+'" value="'+systemConfigs.contentLanguages[i].code+'" source="langSelection" >'
        }
        Text += '<div class="langName">'+ systemConfigs.contentLanguages[i].name+'</div>'
        Text += '<div class="langSelection"> <img class="selectedone" src="images/select_icon_active.png" > <img class="unselectedOne" src="images/select_icon_static.png" > </div>'
        Text +=  '</div>'        
    }
    Text += '</div>'
    Text += '<div class="row"><div class="update-button"><button type="button" source="langSelection" id="lang-cancel" class="grey-btn toptab">Clear All</button> <button type="button" source="langSelection" id="lang-update" class="grey-btn toptab">Save</button> </div></div>'
    Text += '</div>'
    return Text;
}

// signOut Okay Page
Util.signout = function () {
    var Text = '';
    Text += '<div class="uniquePage" id="signoutSuccess" >'
    Text += '<div class="container">'
    Text += '<img class="success-image" src="images/success_icon.png" >'
    Text += '<h1 class="main-heading textCenter">You are successfully signed out</h1>'
    Text += '<button type="button" id="signout-0" source="signout" class="unique-page-btn grey-btn imageFocus">Okay,got it</button>'
    Text += '</div>'
    Text += '</div>'
    return Text;
}

// Player Body
Util.playerBody = function () {
    var Text = '';
    Text += '<div class="player-bg">';
    Text += '<div class="player_bottom_gradient"></div>';
    Text += '<div class="playerControls" target="playerControls">';
    Text += '<img id="playerBackImg" src="' + Util.getImages(presentPagedetails.pageContent[0].backgroundImage) + '"  onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/logo_test.png"/> ';
    Text += '<div class="browseSuggns" id="browseSuggns" source="browseSuggns"><p class="browseText upArrow strong player_top_gradient" id="browseText"><img class="upArrowImg" src="images/upArrow.png"> Browse Suggestions</p><p class="browseText downArrow strong" id="browseText"><img class="downArrowImg" src="images/downArrow.png"> Press Down to Hide Suggestions</p></div>'
    Text += '<div class="play-but playerMouse" id="play-but" source="playBtn"></div>'
    if (presentPagedetails.steamResponse.analyticsInfo.contentType !="live") {
        Text += '<div class="seekbar playerMouse" id="seekbar" source="seekbar">'
        Text += '<div class="seekbar-run" id="seekbar-run"></div>'
        Text += '<div class="seek-picker-time seek-picker-runtime" id="seek-picker-runtime"></div>'
        Text += '<div class="seek-picker" id="seek-picker"></div>'
        Text += '<span class="seek-picker-time seek-picker-start" id="seek-picker-start">00:00:00</span>'
        Text += '<span class="seek-picker-time seek-picker-end" id="seek-picker-end">00:00:00</span>'
        Text += '</div>'
    }
    Text += '<div class="vod-title playerMouse" id="vod-title" source="vodTitle">'
    Text += '<h4 class="vodname">' + presentPagedetails.pageContent[0].title + '</h4>'
    for (var i = 0; i < presentPagedetails.pageContent[0].dataRows.length; i++) {
        if(presentPagedetails.pageContent[0].dataRows[i].rowDataType == 'content'){
            for (var j = 0; j < presentPagedetails.pageContent[0].dataRows[i].elements.length; j++) {
                    var elements = presentPagedetails.pageContent[0].dataRows[i].elements[j];
                    if(elements.elementType == 'text' && elements.elementSubtype=='subtitle'){
                        Text += '<p class="vodInfo">' + elements.data + '</p>';
                        break;
                    }          
            }
        }        
    }
    Text += '</div>'

    Text += '<div class="playerButtons" id="playerButtons">'
    // Text += '<div class="playPauseIcon pauseIcon playerMouse" id="playPauseIcon" source="playPauseIcon"></div>'
      //fav button
    //   if(presentPagedetails.pageButtons && presentPagedetails.pageButtons.showFavouriteButton && presentPagedetails.pageButtons.showFavouriteButton == true  ){
    //     Text += '<div class="playPauseIcon favIcon playerMouse '
    //     if(presentPagedetails.pageButtons.isFavourite == true){
    //         Text +='addedFav" id="favIcon" source="favourites"></div><div id="favText">Remove from Favorites</div>'
    //     }else{
    //         Text +='remFav" id="favIcon" source="favourites"></div><div id="favText">Add to Favorites</div>'
    //     }
    //     presentPagedetails.favButtonAdded = true;
    // }
    Text += '<button type="button" id="playstartbtn" source="playstartbtn" class="playPauseIcon playstartbtn playerMouse strong">Start Over</button>';
    if(presentPagedetails.attributes.contentType=='tvshowepisode'){
    Text += '<button type="button" id="playnextbtn" source="playnextbtn" class="playPauseIcon playnextbtn playerMouse strong">Next Episode</button>';
    }
    Text += '</div></div>'

    Text += '<div class="playSugestions" target="playSugestions">';
    if (presentPagedetails.sections && presentPagedetails.sections.length > 0) {
        for (i=0; i < presentPagedetails.sections.length; i++) {
            if (presentPagedetails.sections[i].sectionInfo.dataType == 'actor') {
                presentPagedetails.sections.splice(i, 1);
                break;
            }
        }
        for (i=0; i < presentPagedetails.sections.length; i++) {
            Yup("#section-"+ i).hide();
            if (presentPagedetails.sections[i].sectionControls.dataLength > 0) {
                for (var j = 0; j < presentPagedetails.sections[i].sectionData.data.length; j++) {
                    presentPagedetails.sections[i].sectionData.data[j].cardType = 'player-card';
                }
            }
        }
        Text += Util.getSections(presentPagedetails.sections);
    }
    Text += '</div></div>'
    return Text;
}

Util.changePasswordHTML =function () {
    var Text = '';
    Text += '<div class="otpVerifyFrom" id="signInContent"><div class="container">'
    Text += '<div class="row" id="headSignIn">'
    Text += '<div class="col2 headerLogo"> <img src="' + appConfig.staticColudPath + 'images/logo_test.png" class="img-responsive" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/logo_test.png"/></div>'
    Text += '<div class="col8"><h2 class="signHead textCenter" id="signinTitle" >Change Password</h2></div>'  
    Text += '<div class="col2"></div>'   
    Text += '</div>'    
    Text += '<div class="row">'
    Text += '<div class="col6" id="keyLayout">'
    Text += Util.genericKeys('changePassOld'); 
    Text +='</div>'  
    Text += '<div class="col6" id="formLayout">'
    Text += Util.chnagePasswordFrom();   
    Text +='</div>'
    Text +='</div>'    
    Text +='</div>'
    Text += '</div>'
    return Text;
}

Util.chnagePasswordFrom =function(){
    var Text = '';   
    Text += '<div class="old">'
    Text +='<div class="row country-mobile"> <label class="authlabel">Enter your Old password</label> <input class="inputForm input-active" placeholder="Enter Old password" index="0" disabled keyType="defaultKeys" type="password" name="oldPassword" id="signInInput-0" ></div>'
    Text += '<div class="error-block"><label id="signInErrLabel-0" class="errorInput" ></label></div></div>'
    
    Text += '<div class="newPassword">'
    Text +='<div class="row country-mobile"> <label class="authlabel">Enter your new password</label> <input class="inputForm" placeholder="Enter New password" index="1" disabled keyType="defaultKeys" type="password" name="newPassword" id="signInInput-1" ></div>'
    Text += '<div class="error-block"><label id="signInErrLabel-1" class="errorInput" ></label></div></div>'
   
    Text += '<div class="reEnterNewPassword">'
    Text +='<div class="row country-mobile"> <label class="authlabel">Re-enter your new password</label> <input class="inputForm" placeholder="Re-enter New Password" index="2" disabled keyType="defaultKeys" type="password" name="reenterPassword" id="signInInput-2" ></div>'
    Text += '<div class="error-block"><label id="signInErrLabel-2" class="errorInput" ></label></div></div>'
    
    return Text;
}

Util.signUpHtml =function(){  
    var Text = '';
    Text += '<div  class="signUpform" id="signInContent"><div class="container">'
    Text += '<div class="row" id="headSignIn">'
    Text += '<div class="col2 headerLogo"> <img src="' + appConfig.staticColudPath + 'images/logo_test.png" class="img-responsive" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/logo_test.png"/></div>'
    Text += '<div class="col8"><h2 class="signHead textCenter" id="signinTitle">Create your '+appConfig.appName+ ' account</h2></div>'
    Text += '<div class="col2"></div>'
    if(systemConfigs.configs && systemConfigs.configs.signupFreeTrailDescription && appConfig.showSubscribeText){
        Text += '<div class="row signsubHead textCenter"> <span class="" id="signinSubTitle"> '+systemConfigs.configs.signupFreeTrailDescription +'</span> </div>'    
    }
    
    Text += '</div>'
    Text += '<div class="row">'
    Text += '<div class="col6" id="keyLayout">'
    Text += Util.numberKeys('signup'); 
    Text +='</div>'  
    Text += '<div class="col6" id="formLayout">'
    Text += Util.signupForms();   
    Text += '<div class="row mt45">'
    Text += '<div class="col12"><div class="signUpLabelpar"><label class="signUpLabel authlabel">Have an account ?</label></div>'
    Text += '<div id="signupBtn" class="keyboardKeys btn-default " source="signupBtn">Sign in</div>'
    Text += '</div></div>'
  
    Text += '</div>'
    Text += '</div>'
    Text += '</div>'
    Text += '</div>'
    return Text;
}

Util.signupForms = function () {
    var Text = '';
    Text +='<div>'
    Text +='<div class="mobileNum">'
    Text += '<div class="row country-mobile"><label class="authlabel">Mobile Number</label><div class="countryCode" class="col2"> '+Util.countryCodeForm() +'</div>'; 
    Text +='<div class="mobile_number_from"><input type="text" keyType="numeric" index="0" class="inputForm input-active" formType="mobileNum" placeholder="Mobile Number" disabled name="mobileNumber" id="signInInput-0"></div>'
    Text += '<div class="error-block"><label id="signInErrLabel-0" class="errorInput" ></label></div></div></div>'
    Text += '<div class="password">'
    Text +='<div class="row country-mobile"> <label class="authlabel">Password</label> <input class="inputForm" formType="password" placeholder="Password" index="1" disabled keyType="defaultKeys" type="password" name="Password" id="signInInput-1" ></div>'
    Text += '<div class="error-block"><label id="signInErrLabel-1" class="errorInput" ></label></div></div>'  
    Text += '<div class="reEnterPassword">'
    Text +='<div class="row country-mobile"> <label class="authlabel">Confirm Password</label> <input class="inputForm" formType="password" placeholder="Password" index="2" disabled keyType="defaultKeys" type="password" name="confirmPassword" id="signInInput-2" ></div>'
    Text += '<div class="error-block"><label id="signInErrLabel-2" class="errorInput" ></label></div></div>'
    Text += '</div>'
    return Text;
}

Util.signupOTPVerificationHTML =function (){
    var Text = '';
    Text += '<div  class="sigupOtpVerifyFrom" id="signInContent"><div class="container">'
    Text += '<div class="" id="headSignIn">'
    Text += '<div class=""><h2 class="signHead" id="signinTitle">Enter One Time Passcode</h2></div>'
    Text += '<div class="headerLogo"> <img src="' + appConfig.staticColudPath + 'images/logo_test.png" class="img-responsive" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/logo_test.png"/></div>'  
    Text += '</div>'
    Text += '<div class="content-layout">' 
    Text += '<div class="row">'
    Text += '<div class="col6" id="keyLayout">'
    Text += Util.numberKeys('signupotp'); 
    Text +='</div>'  
    Text += '<div class="col6" id="formLayout">'
    Text += Util.signupOTP();   
    Text +='</div>'
    Text +='</div>'    
    Text +='</div>'
    Text += '</div>'
    return Text;
}

Util.signupOTP =function () {
    var Text = '';
    Text +='<div>'    
    Text += '<div class="password">'
    Text +='<div class="row country-mobile"> <label class="authlabel">Enter OTP</label> <input class="inputForm input-active" formType="otp" placeholder="OTP" index="0" disabled keyType="numeric" type="text" name="otp" id="signInInput-0" ></div>'
    Text += '<div class="error-block"><label id="signInErrLabel-0" class="errorInput" ></label></div></div>'
    Text +='<div class="otp_bottom_text">'
    Text +='One Time Passcode (OTP) has been sent to your mobile  ******'+tempObjectData.mobileNo.substring(tempObjectData.mobileNo.length-4,tempObjectData.mobileNo.length)
    Text +='</div>'
    return Text;
}

// Signup Success Page
Util.signUpSuccess = function (msg) {
    var Text = '';
    Text += '<div class="uniquePage" id="signupSuccess">'
    Text += '<div class="container">'
    Text += '<img class="success-image" src="images/success_icon.png" >'
    Text += '<h1 class="main-heading textCenter"> '+msg+ '</h1>'
    if(systemConfigs.configs && systemConfigs.configs.signupFreeTrailDescription && appConfig.showSubscribeText){
        Text += '<h3 class="sub-heading textCenter"> '+systemConfigs.configs.signupFreeTrailDescription + '</h3>'
    }    
    Text += '<button type="button" id="signout-0" source="signout" class="unique-page-btn grey-btn imageFocus"> Continue Browsing </button>'
    Text += '</div>'
    Text += '</div>'
    return Text;
}

Util.noPackagesPage= function () {
    var Text = '';
    Text += '<div class="uniquePage" id="noPackage" style="overflow:hidden;height:100%;width:100%;background: url(images/noSubPage.png);background-size:cover;background-position:center center;position:absolute;padding: 0;margin: 0;">'
    Text += '<div class="logo">'
    Text += '<img src="' + appConfig.staticColudPath + 'images/logo_test.png" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/logo_test.png"/>'
    Text += '</div>'
    Text += '<div class="container">'
    Text += '<h1 class="main-heading textCenter">Watch with '+appConfig.appName+'</h1>'
    Text += '<h3 class="sub-heading textCenter">Your account '
    Text += ( Main.userProfile.email) ? (Main.userProfile.email) : (Main.userProfile.mobile)
    Text += ' is not Subscribed to '+appConfig.appName+'</h3>'
    Text += '<h3 class="sub-heading sub-heading1 textCenter">To watch this content, subscribe on '
    Text += (systemConfigs.configs.packagePageUrl) ? (systemConfigs.configs.packagePageUrl) : 'www.frndlytv.com'
    Text += ' from web browser.</h3>'
    Text += '<button type="button" id="browseBtn-0" source="noSubView" class="unique-page-btn grey-btn imageFocus">Back to Browse</button>'
    Text += '</div>'
    Text += '</div>'
    return Text;
}

Util.introPageView=function(result){
    var Text = '';
    Text += '<div class="uniquePage" id="introPage" >'
    Text += '<div class="backimage">'
    Text += '<img class="" src="' + systemConfigs.configs.landingPageImageUrl + '" onerror="this.src = Yup(this).attr(\'altSrc\')"  style="width:100%" altSrc="images/intro_page.png"/>'
    Text += '</div>';
    Text += '<div class="container">'
    if(result.status == true && result.response.data.length>0){
        for(var k=0;k<result.response.data.length;k++){
            if(result.response.data[k].paneType == 'content'){
                for (var i = 0; i < result.response.data[k].content.dataRows.length; i++) {
                    for (var j = 0; j < result.response.data[k].content.dataRows[i].elements.length; j++) {                
                        var elements = result.response.data[k].content.dataRows[i].elements[j];
                        if (elements.elementType == 'image'){
                            Text += '<img class="" src="' + elements.data + '" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/introPageIcon.png"/>'
                        } 
                        else if(elements.elementType == 'text' && (elements.elementSubtype == '' || elements.elementSubtype == 'subtitle')){
                            Text += '<h1 class="'
                            if(elements.elementSubtype==''){ Text += 'main-heading '}
                            else {Text += 'subtitle '}
                            Text += 'strong row" id="' + elements.elementType + '-' + i + '" source="' + elements.elementType + '"targetpath="'+elements.target+'" >' + elements.data +'</h1>';
                        }           
                    }
                }
            }
        }
        presentPagedetails.introPageBtnsLength=0;
        for(var k=0;k<result.response.data.length;k++){
            if(result.response.data[k].paneType == 'content'){
                Text += '<div class="Buttons_IntroPage">'
                for (var i = 0; i < result.response.data[k].content.dataRows.length; i++) {
                    for (var j = 0; j < result.response.data[k].content.dataRows[i].elements.length; j++) {                
                        var elements = result.response.data[k].content.dataRows[i].elements[j]; 
                        if(elements.elementType == 'text' && elements.elementSubtype != '' && elements.elementSubtype != 'subtitle'){
                            Text += '<h1 class="strong subtitle subtitle1" id="' + elements.elementType + '-' + i + '" source="' + elements.elementType + '"targetpath="'+elements.target+'" >' + elements.data +'</h1>';
                        }
                        else if(elements.elementType == 'button' && elements.target=='signin'){
                            Text += '<div class="Buttons">'
                            Text += '<button type="button" '+'id="' + elements.elementType + '-' + presentPagedetails.introPageBtnsLength + '" source="button" targetpath="'+elements.target+'" class="unique-page-btn grey-btn'
                            if(presentPagedetails.introPageBtnsLength==0){Text +=' imageFocus'}
                            Text += '">' + elements.data +'</button>';
                            Text += '</div>'
                            ++presentPagedetails.introPageBtnsLength;
                        }            
                    }
                }
            }
        }
    }else{
        Text += '<img src="images/introPageIcon.png"/>'         
        Text += '<h1 class="main-heading strong row">TV at your fingertips anytime anywhere</h1>'
        Text += '<h3 class="subtitle strong row">Stream your favorite Indian channels and watch Live TV, Catchup TV, TV shows, Movies and more.</h3>'         
        Text += '<button type="button" id="button_0" index="0" source="button" targetpath="signin" class="unique-page-btn grey-btn imageFocus">Sign in with Email / Mobile</button>'
    }
    Text += '</div></div>'
    return Text;
}

Util.tvGuideDatesHtml = function (data){ 
    var Text = '';
    Text += Util.getTopBar(data.menusList);
    Text += '<div class="menus-content">'  
    Text += '<div class="tvGuideDates">';
        Text += '<div class="tvGuideClassInner">'
            for(var i=0;i<data.tvGuideChannelsData.tabs.length;i++){
                Text += '<div class="tabItem '+((data.tvGuideChannelsData.tabs[i].isSelected == true)? 'active imageFocus':'') +' " source="tvguideTabs" totalLength="'+data.tvGuideChannelsData.tabs.length+'" id="tabItem-'+i+'" startTime="'+data.tvGuideChannelsData.tabs[i].startTime+'" endTime="'+data.tvGuideChannelsData.tabs[i].endTime+'"  >';
                Text +=  data.tvGuideChannelsData.tabs[i].title == 'Today' ? '<div class="tabTitle"> Today </div>' : '<div class="tabTitle">'+data.tvGuideChannelsData.tabs[i].title+','+data.tvGuideChannelsData.tabs[i].subtitle+'</div>'
                Text +='</div>';
            }
        Text +='</div>'
        Text += '<div class="tvGuideTimeInner">'
        for(var i=0;i<timesList.length;i++){
            Text += '<div class="timeItem" source="tvguideTimes" id="timeItem-'+i+'">';
            Text += '<div class="timeTitle"> '+timesList[i]+' <span class="time_devider"></span></div>';
            Text += '</div>';
        }
        Text +='</div>'  
        
        var presentDate = new Date().getTime();       
        if(parseInt(presentPagedetails.selectedDate.startTime) <= presentDate  && parseInt(presentPagedetails.selectedDate.endTime) >= presentDate  ){
            presentPagedetails.selectedDate.isToday = true;
            Text += '<div class="liveTag">'
            Text +=  '<span class="livename"> LIVE </span>'
            Text +=  '<span class="liveline"></span>'
            Text +='</div>'
        }
        
        Text += '<div class="tvGuideChannels">'       
        Text +='</div>'
    Text +='</div>'; 
    Text +='</div>';         

    return Text;
}


Util.tvguide = function(tvguideSectionsData){
    var currentTime = new Date().getTime();
    var i = 0;
    var arrayLength = tvguideSectionsData.length;
    if( presentPagedetails.paginationHitHappening != 0 && presentPagedetails.paginationHitHappening !=undefined){
        arrayLength = presentPagedetails.paginationSectionsData.length;
        i = presentPagedetails.paginationHitHappening;
       
    }
    for(i; i < arrayLength ; i++ ){

        var Text = '';
        Text +='<div class="channelRow" id="channelRow-'+i+'">'
        Text +=  '<div class="channelIcon">'   
        Text += '<img id="channelIconImg" source="tvguideChannel" src="' + Util.getTvChannelIconImage(presentPagedetails.paginationSectionsData[i].channelId)+ '"  onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/logo_test.png"/> ';  
        Text +=  '</div>'
        Text +=  '<div class="channelPrograms" source="tvguideProgram"   id="channelPrograms-'+i+'" >'
        for(var j=0; j < presentPagedetails.paginationSectionsData[i].programs.length; j++){            
            var programduration = presentPagedetails.paginationSectionsData[i].programs[j].target.pageAttributes.endTime - presentPagedetails.paginationSectionsData[i].programs[j].target.pageAttributes.startTime ; 
            var width = (programduration / 5625) + 'px' ;
            Text +=  '<div class="channelProgramsList">'            
            Text +=  '<div class="channelProgramsItem" source="tvguideProgram" template="'+presentPagedetails.paginationSectionsData[i].programs[j].template+'" targetPath="'+presentPagedetails.paginationSectionsData[i].programs[j].target.path+'" id="channelProgramsItem-'+i+'-'+j+'" programduration="'+programduration+'" style="width:'+width+'" startTime="'+presentPagedetails.paginationSectionsData[i].programs[j].target.pageAttributes.startTime+'" endTime="'+presentPagedetails.paginationSectionsData[i].programs[j].target.pageAttributes.endTime+'" target="'+presentPagedetails.paginationSectionsData[i].programs[j].target.path+'" >'+presentPagedetails.paginationSectionsData[i].programs[j].display.title+'</div>'
            Text +=  '</div>'
        }
        Text +=  '</div>'
        Text +=  '</div>'
        Yup(".tvGuideChannels").append(Text);
    }

    if( presentPagedetails.paginationHitHappening != 0 && presentPagedetails.paginationHitHappening !=undefined){
        presentPagedetails.paginationHitHappening = undefined;
        var existingleftValue= Yup('.tvGuideTimeInner').css("left");      
        Yup('.channelPrograms').css("left",existingleftValue);
    }
}

Util.getTvChannelIconImage = function(channelId){
    for(var i=0;i < presentPagedetails.tvGuideChannelsData.data.length;i++){
        if(channelId == presentPagedetails.tvGuideChannelsData.data[i].id){
            return Util.getImages( presentPagedetails.tvGuideChannelsData.data[i].display.imageUrl);           
        }
    }
}

Util.showTemplate = function () {
    var Text = '';
    Text += '<div class="contentTemplate" id="contentTemp">'
    Text += '<div class="templateOverlay">'
    Text += '<div class="templateInfo">' ;
    if( presentPagedetails.templateData.image && presentPagedetails.templateData.image.displayCondition=='true'){
        Text +='<img class="main" src="' + presentPagedetails.templateData.image.data + '" onerror="this.src = Yup(this).attr(\'altSrc\')"  altSrc="images/logo_test.png" />';
    }
    Text += '<div class="templateTitle">'
    if(presentPagedetails.templateData.title && presentPagedetails.templateData.title.displayCondition=='true'){
        Text += "<h1>"+presentPagedetails.templateData.title.data+"</h1>";
    }
    if(presentPagedetails.templateData.subtitle1 && presentPagedetails.templateData.subtitle1.displayCondition=='true'){
        Text += "<h5>"+presentPagedetails.templateData.subtitle1.data+"</h5>";
    }
    Text += '</div>'
    Text += '</div>'
    if(presentPagedetails.templateData.description && presentPagedetails.templateData.description.displayCondition=='true'){
        Text += '<div class="templateDes">'+presentPagedetails.templateData.description.data+'</div>'
    }
    Text += '<div class="templateButns">'
    var btnFocus=false;
    presentPagedetails.templateData.btnsCount=0;
    for(var i=0;i < presentPagedetails.templateData.tembutns.length;i++){
        if(presentPagedetails.templateData.tembutns[i] && presentPagedetails.templateData.tembutns[i].displayCondition=='true'){
        Text += '<button id="tempbtn-'+presentPagedetails.templateData.btnsCount+'" class="btn-default ';
        if(!btnFocus){Text += 'btnFocus';btnFocus=true;}
        Text += '" btnType="'+presentPagedetails.templateData.tembutns[i].name+'" source="tempBtns" targetpath="'+presentPagedetails.templateData.tembutns[i].target+'" >'+presentPagedetails.templateData.tembutns[i].data+'</button>';
        ++presentPagedetails.templateData.btnsCount;
        }
    }
    Text += '</div>'
    Text += '</div>'
    Text += '</div>'
    return Text;
}






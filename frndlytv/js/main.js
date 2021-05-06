
var locationApiRetryCount = 1;
var popupData ={};
var firstMenu = '';
var backData = [];
var presentPagedetails = {};
var view = '';
var currentWindow_Width = Yup(window).width();
var countryList;
var clickedMenu = {};
var commingFromMenus = true;
var tempScroll = 0;
var resetTimer ;
var playreadyurl;
var isUserSignedOutinThisSession = false;
var analyticsData;
var locationData;
var staticPaths=['search','signin','signup','countryCode','forgetPassword','otpVerification','signupOtpVerification','changePassword','accountDetails','signinSuccess'];
var intiLangSel=false;
var liveSubscribe;
var searchSubscribe;
var templateData={};
var templateList;
var templateCodeInfo={};
Main.eventGenerate = function (keyCode) {
	var e = Yup.Event('keyup');
	e.which = keyCode;
	e.keyCode = keyCode;
	airMouse = true;
	Main.processTrigger(e);
}

Main.showSplash = function () {
	view = "splash";
	Yup("#mainContent").css("display", "block");
	Yup("#mainContent").html(Util.splashHtml());
}

Main.hideSplash = function () {
	Yup("#mainContent").hide();
}

Main.showArrows = function () {
	Yup("#leftArrow").fadeIn();
	Yup("#rightArrow").fadeIn();
	Yup("#upArrow").fadeIn();
	Yup("#downArrow").fadeIn();
	Yup("#backArrow").fadeIn();
}

Main.hideArrows = function () {
	Yup("#leftArrow").fadeOut();
	Yup("#rightArrow").fadeOut();
	Yup("#upArrow").fadeOut();
	Yup("#downArrow").fadeOut();
	Yup("#backArrow").fadeOut();
}

Main.ShowLoading = function () {	
	document.getElementById("loading").style.display = "block";
	isLoading =true;
}

Main.HideLoading = function () {
	document.getElementById("loading").style.display = "none";
	isLoading =false;
}

Main.playerShowLoading = function () {
	document.getElementById("playerLoading").style.display = "block";
}

Main.playerHideLoading = function () {
	document.getElementById("playerLoading").style.display = "none";
}

Main.getBOXID = function () {
	if(utilities.validateString(Main.BOXID) == true){
		return Main.BOXID;
	}else if(utilities.validateString(utilities.getFromLocalStorage('boxId')) == true ) {
		Main.BOXID = utilities.getFromLocalStorage('boxId');
		return Main.BOXID;
	}else if (device.uuid) {
		Main.BOXID = device.uuid;
		utilities.setLocalStorage('boxId',device.uuid);
		return Main.BOXID;
	}else{
		try {
			var xhr = new XMLHttpRequest();
			var url = "http://www.yupptv.com/samsung/smarttvservice.aspx?tvmthod=gettoken&tvapi=12202011&tvdevid=16&tvpkid=1580&tvboxno=";
			xhr.open('GET', url, false);
			xhr.send();
			var tempxml = xhr.responseText;
			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(tempxml, "text/xml");
			var boxNo = xmlDoc.getElementsByTagName('boxno')[0].childNodes[0].nodeValue;
			Main.BOXID = boxNo;
			utilities.setLocalStorage('boxId',boxNo);
			return Main.BOXID;			
		} catch (e) {
			var boxNo = Math.random().toString(36).slice(2);
			Main.BOXID = boxNo;
			utilities.setLocalStorage('boxId',boxNo);
			return Main.BOXID;		
		}
	}	
}

Main.getSessionID = function () {
	if(utilities.validateString(Main.sessionID) == true){
		return Main.sessionID;
	}else if(utilities.validateString(utilities.getFromLocalStorage('sessionID')) == true ) {
		Main.sessionID=utilities.getFromLocalStorage('sessionID');
		return Main.sessionID;
	}else{
		return '';	
	}	
}

Main.getSessionAPI =function(callbackData,callback){
	Main.ShowLoading();
	Yup.ajax({
		url: Main.mainApi + "/service/api/v1/get/token",
		type: "GET",
		data: {
			"tenant_code": Main.tenantCode,
			"box_id": Main.getBOXID(),
			"product": Main.productCode,
			"device_id": appConfig.APPID,
			"display_lang_code": "ENG",
			"device_sub_type": '',
			'timezone':locationData.ipInfo.timezone
		},
		success: function (data) {
			result = JSON.parse(data);
			if (result.status) {				
				Main.sessionID = result.response.sessionId;
				utilities.setLocalStorage('sessionID',Main.sessionID);			
				Main.countryCode = result.response.countryCode;
				utilities.setLocalStorage('countryCode',Main.countryCode);					
				if (typeof callback === "function"){
					if(callbackData.type == 'config' )
						callback();
					else if(callbackData.type == 'signin')
						callback(callbackData.force_login);
					else if(callbackData.type == 'apiCall')
						callback(callbackData.tragetPath);						
					else
						callback();
				}
			} else {
				Main.HideLoading();
				Main.popupData ={
					popuptype : 'unknown',
					message : "Something Went Wrong, Please Try again Later.",       
					buttonCount : 1,
					yesText : 'Try Again',
					yesTarget : 'tryAgainSession',
					onBack : 'exit',
					callbackData:callbackData,
					callback:callback
				}
				Yup("#popUpFDFS").html(Util.showPopup());	
				Yup("#popup-btn-1").addClass('popupFocus');
			}
		},
		error: function (errObj) {
			Main.HideLoading();
				Main.popupData ={
					popuptype : 'unknown',
					message : "Something Went Wrong, Please Try again Later.",       
					buttonCount : 1,
					yesText : 'Try Again',
					yesTarget : 'tryAgainSession',
					onBack : 'exit',
					callbackData:callbackData,
					callback:callback
				}
				Yup("#popUpFDFS").html(Util.showPopup());	
				Yup("#popup-btn-1").addClass('popupFocus');
		},
		timeout: 60000
	});
}

Main.getLocation = function () {
	Main.hideSplash();
	Main.ShowLoading();
	Yup.ajax({
		url: Main.locationApi + "/service/location/api/v1/locationinfo?tenant_code=" + Main.tenantCode + "&product=" + Main.productCode + "&client=tv",
		type: "GET",
		data: {},
		success: function (data) {
			result = JSON.parse(data);
			if (result) {
				locationData=result;
				Main.country = result.ipInfo.country;
				localStorage.setItem("country", Main.country);
				Main.countryCode = result.ipInfo.countryCode;
				countryList =utilities.countryCodesList().response;				
				for (var i = 0; i < countryList.length; i++) {
					if (Main.countryCode.trim() == countryList[i].code.trim()) {
						Main.countryFlag = countryList[i].iconUrl;
						Main.mobileCode = countryList[i].isdCode;
					}
				}
				localStorage.setItem("countryCode", Main.countryCode);				
				Main.getConfig();
			} else {
				if (--locationApiRetryCount < 0) {
					locationApiRetryCount = 1;	
					Main.HideLoading();
					Main.popupData ={
						popuptype : 'unknown',
						message : "Something Went Wrong, Please Try again Later.",       
						buttonCount : 1,
						yesText : 'Okay',
						yesTarget : 'exit',
						onBack : 'exit'
					}
					Yup("#popUpFDFS").html(Util.showPopup());	
					Yup("#popup-btn-1").addClass('popupFocus');
				} else {
					setTimeout(Main.getLocation(), 1000);
				}
			}
		},
		error: function (errObj) {
			if (--locationApiRetryCount < 0) {
				locationApiRetryCount = 1;	
				Main.popupData ={
					popuptype : 'unknown',
					message : "Something Went Wrong, Please Try again Later.",       
					buttonCount : 1,
					yesText : 'Okay',
					yesTarget : 'exit',
					onBack : 'exit'
				}
				Yup("#popUpFDFS").html(Util.showPopup());	
				Yup("#popup-btn-1").addClass('popupFocus');		
				Main.HideLoading();
			} else {
				setTimeout(Main.getLocation(), 1000);
			}
		},
		timeout: 60000
	});
}

Main.getUserInfo = function (comingFromSettings) {	
	Yup.ajax({
		url: Main.mainApi + "/service/api/auth/user/info",
		type: "GET",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID()
		},
		success: function (data) {
			result = JSON.parse(data);
			try {			
				Main.HideLoading();
				if (result.status == true) {					
					utilities.settingUserData(result);
					if(comingFromSettings==false){
						try {
							window.removeEventListener('appcontrol');
							window.addEventListener('appcontrol', deepLink);
							if(isUserSignedOutinThisSession == true){
								isUserSignedOutinThisSession =false;
								Main.apiCall(firstMenu);
							}else{
								deepLink();
							}	
						}catch(e){						
							Main.apiCall(firstMenu);						
						}	
					}else{
						Main.getActivePackages();
					}							
				}else if(view=='splash'){
					view = "introPageView";
					presentPagedetails.view=view;
					Main.apiCall('welcome');
				}else{
					view = "signin";
					Main.processNext();
				}
			} catch (e) {
				
			}
		},
		error: function (errObj, textStatus) {			
			Main.HideLoading();
		},

		timeout: 60000
	});	
}

Main.getConfig = function () {
	Main.ShowLoading();
	if(Main.getSessionID() == ''){
		Main.getSessionAPI({type:'config'} , Main.getConfig);
	}else{
		Yup.ajax({
			url: Main.mainApi + "/service/api/v1/system/config",
			type: "GET",
			headers: {
				"tenant-code": Main.tenantCode,
				"box-id": Main.getBOXID(),
				"session-id": Main.getSessionID(),
			},
			success: function (data) {
				result = JSON.parse(data);
				if (result.status == true) {			
					systemConfigs = result.response;
					console.log(systemConfigs);
					firstMenu = systemConfigs.menus[0].targetPath;
					Main.getUserInfo(false);
					Main.countryCodeList();					
					Main.getAnalayticsData();
					Main.getTemplates();	
				} else if (result.status == false) {				
					if(result.error.code == 401 ){
						Main.getSessionAPI({type:'config'} , Main.getConfig);	
					}else{
						Main.HideLoading();
						Main.popupData ={
							popuptype : 'unknown',
							message : "Something Went Wrong, Please Try again Later.",       
							buttonCount : 1,
							yesText : 'Try Again',
							yesTarget : 'tryAgainConfig',
							onBack : 'exit'
						}
						Yup("#popUpFDFS").html(Util.showPopup());	
						Yup("#popup-btn-1").addClass('popupFocus');
					}		
				}
			},
			error: function (errObj) {			
				Main.HideLoading();
				Main.popupData ={
					popuptype : 'unknown',
					message : "Something Went Wrong, Please Try again Later.",       
					buttonCount : 1,
					yesText : 'Try Again',
					yesTarget : 'tryAgainConfig',
					onBack : 'exit'
				}
				Yup("#popUpFDFS").html(Util.showPopup());	
				Yup("#popup-btn-1").addClass('popupFocus');
			},
			timeout: 60000
		});
	}	
}


function deepLink() {
	Main.ShowLoading();
	var requestedAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();
	var appControlData;
	var actionData;

	if (requestedAppControl) {	
		appControlData = requestedAppControl.appControl.data;

		for (var i = 0; i < appControlData.length; i++) {
			if (appControlData[i].key == 'PAYLOAD') {
				actionData = JSON.parse(appControlData[i].value[0]).values;	
				break;			
			}		
		}
		if (actionData) {				
			var clickOn = JSON.parse(actionData).path;
			if(clickOn){			
				Main.HideLoading();
				Main.apiCall(clickOn);	
			}else{				
				Main.HideLoading();
				Main.apiCall(firstMenu);
			}			
		}
		else{		
			Main.HideLoading();
			Main.apiCall(firstMenu);
		}


	} else {		
		Main.HideLoading();
		Main.apiCall(firstMenu);
	}
}


Main.countryCodeList = function () {
	Yup.ajax({
		url: Main.mainApi + "/service/api/v1/get/country",
		type: "GET",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID()
		},
		success: function (data) {
			var result = JSON.parse(data);
			if(result.status == true){
				if(result.response.length >0){
					countryList = result.response;
					for (var i = 0; i < countryList.length; i++) {
						if (Main.countryCode.trim() == countryList[i].code.trim()) {
							Main.countryFlag = countryList[i].iconUrl;
							Main.mobileCode = countryList[i].isdCode;
						}
					}
				}
			}else if(result.status == false){
				if(result.error.code == 401 ){
					Main.getSessionAPI({type:'config'} , Main.getConfig);	
				}
			}
		},
		error: function (errObj) {			
		},
		timeout: 60000
	});
}

Main.getAnalayticsData = function () {
	Yup.ajax({
		url: analyticsUrl + appConfig.typeOfAnalytics,
		type: "GET",
		data: {},

		success: function (data) {
			analyticsData = JSON.parse(data);
			analytics.load();//for ananlytics	
		},
		error: function (errObj) {
		},
		timeout: 60000
	});
}

Main.apiCall = function (targetPath) {
	Yup('.mouseFocus').removeClass('mouseFocus');
	//tempObjectData = {};
	if(Main.getSessionID() == ''){
		Main.getSessionAPI({type:'apiCall','tragetPath': targetPath},Main.apiCall);
	}
	else{
		if (utilities.validateString(targetPath) == true ) {
			Main.ShowLoading();
			var headerJ = {
				"tenant-code": Main.tenantCode,
				"box-id": Main.getBOXID(),
				"session-id": Main.getSessionID()
			};
			var count =(targetPath.indexOf('section/') > -1) ?24 : 12;				
			try {
				Yup.ajax({
					url: Main.mainApi + "/service/api/v1/page/content?path=" + targetPath + "&count="+count,
					type: 'GET',
					headers: headerJ,			
		
					success: function (data) {
					try {
						var result = JSON.parse(data);
						if (result.status == true) {
							if(targetPath!='welcome'){
								Main.apicallResponse(result,targetPath);
							}
							else{
								Main.HideLoading();
								Yup("#mainContent").html('');
								Yup("#mainContent").append(Util.introPageView(result));
								Yup("#mainContent").show();
							}						
						} else {
							Main.HideLoading();	
							if(targetPath!='welcome'){													
								if (result.error && (result.error.code == 401 || result.error.code == 500)) {
									if(presentPagedetails.view=='player'){
										analytics.plugin.handlePlayEndedByUser();
										try {
											media.pause();
											media.stop();
											media.unsetListener();
										}
										catch (e) { }
									}
									Main.SessionID = '';						
									utilities.setLocalStorage('sessionID','');
									if (Main.userProfile.userStatus == true ) {
										utilities.resetUserData();
										Main.popupData = {
											popuptype: 'sessionLogout',
											headerTitle: result.error.message,
											message: result.error.details.description,
											buttonCount: 1,
											yesText: 'Okay',
											yesTarget: 'sessionLogout',
											onBack: 'sessionLogout',
										}
										Yup("#popUpFDFS").html(Util.showPopup());	
										Yup("#popup-btn-1").addClass('popupFocus');									
									}else{ //automatic session retrive when session expires				
										Main.getSessionAPI({type:'apiCall','tragetPath': targetPath},Main.apiCall);
									}						
								}else if(result.error && result.error.message && result.error.code == 404){	
									utilities.genricPopup(result.error.message,'noData');			
								}
								else if(result.error && result.error.message ){	
									utilities.genricPopup(result.error.message,'info');					
								}else{
									utilities.genricPopup('Something Went Wrong','unknown');	
								}
							}
							else{
								Yup("#mainContent").html('');
								Yup("#mainContent").append(Util.introPageView(result));
								Yup("#mainContent").show();
							}
						}
					}
					catch (e) {
						Main.HideLoading();
						utilities.genricPopup('Something Went Wrong','unknown'); }
					},
					error: function (errObj) {
						Main.HideLoading();					
						utilities.responseErrorCheck(errObj);	
					},
					timeout: 60000
				});
			} catch (error) {
				Main.HideLoading();
				utilities.genricPopup('Something Went Wrong','unknown');
			}
			
		}else{
			utilities.genricPopup('Content you are looking for is not found','noData');				
		}
	}	
}

Main.apicallResponse= function(result,targetPath){	
	Main.playerHideLoading();
	var responseArray = {};
	//target Path
	responseArray.targetPath = targetPath;
	//search
	responseArray.searchBar =false;
	if(targetPath == firstMenu){
		responseArray.searchBar = true;
		responseArray.pageSubType = 'home';
	}
	//pageType
	if(result.response.info){		
			if(result.response.info.pageType == 'details'){
				if(result.response.info.attributes && result.response.info.attributes.contentType && result.response.info.attributes.contentType == 'network'){
					responseArray.pageType= 'content';
					responseArray.pageSubType= 'networkDetails';				
					responseArray.view = 'content';
				}
				else if(result.response.info.attributes && result.response.info.attributes.contentType && result.response.info.attributes.contentType == 'movie'){
					responseArray.pageType= 'details';
					responseArray.pageSubType= 'movieDetails';				
					responseArray.view = 'movieDetails';
				}
				else if(result.response.info.attributes && result.response.info.attributes.contentType && result.response.info.attributes.contentType == 'tvshowdetails'){
					responseArray.pageType= 'details';
					responseArray.pageSubType= 'tvshowDetails';				
					responseArray.view = 'tvshowDetails';
				}
				else if(result.response.info.attributes && result.response.info.attributes.contentType && (result.response.info.attributes.contentType == 'channel' || result.response.info.attributes.contentType == 'epgseriesdetails')){
					responseArray.pageType= 'details';
					responseArray.pageSubType= 'channelDetails';				
					responseArray.view = 'channelDetails';
				}
				else{
					responseArray.pageType= 'content';
					responseArray.view = 'content';
				}
			}else if(result.response.info.pageType == 'list'){			
				responseArray.pageType= 'list';
				responseArray.view = 'list';			
			}else if(result.response.info.pageType == 'player'){			
				responseArray.pageType= 'player';
				responseArray.view = 'player';	
				if(result.response.streamStatus){
					if(result.response.streamStatus.hasAccess == false){
						//backData.pop();
						if(result.response.streamStatus.errorCode == -1000){						
							view = "signin";
							Main.processNext();
							return;
						}
						else if(result.response.streamStatus.errorCode == -4 || result.response.streamStatus.errorCode == -3 || result.response.streamStatus.errorCode == 402){						
							Main.HideLoading();
							if (result.response.streamStatus.errorCode == 402) {
								utilities.detailsPagePopupDetails("Please go to '" + systemConfigs.configs.packagePageUrl + "'  to buy  packages", 'Subscribe', 'info');
							} else {
								utilities.genricPopup(result.response.streamStatus.message, (result.response.streamStatus.errorCode == -3) ? 'noStream' : 'noData');
							}
							return;
						}
						else if(result.response.streamStatus.errorCode == -14){
							//verify mobitle number after signin
							Main.HideLoading();
							Main.popupData ={
								popuptype : 'info',
								message : result.response.streamStatus.message,
								buttonCount : 1,
								yesText : 'Verify',
								yesTarget : 'gotoMobileVerification',
								onBack : 'close'
							}
							Yup("#popUpFDFS").html(Util.showPopup());
							Yup("#popup-btn-1").addClass('popupFocus');	
							return;
						}else{
							//unknown error
						}						
					}else{
						responseArray.hasStreamAccess = true;
						responseArray.streamStatus = result.response.streamStatus;					
					}
				}		
			}else{
				responseArray.pageType= 'content';
				responseArray.view = 'content';
			}
	}
	//banners
	if(result.response.banners){
		var responseBanners = [];	
		for(var i=0;i<result.response.banners.length;i++){
			if(result.response.banners[i].target.path != 'packages' || result.response.banners[i].target.path != 'pricing' || result.response.banners[i].target.path != 'package'){
				responseBanners.push(result.response.banners[i])
			}
		}
		responseArray.banners = responseBanners;
	}
	//page buttons
	responseArray.pageButtons = result.response.pageButtons;
	responseArray.tabsInfo = result.response.tabsInfo;
	// page Info Attributes 
	responseArray.attributes = result.response.info.attributes;
	//menus	
	var menusList = [];	
	for(var i=0; i<systemConfigs.menus.length ; i++ ){
		console.log(systemConfigs.menus[i].code);
		if(systemConfigs.menus[i].code != '' && systemConfigs.menus[i].code != 'packages' && systemConfigs.menus[i].code != 'package' && systemConfigs.menus[i].code != 'pricing' && systemConfigs.menus[i].code != 'tvguide' && systemConfigs.menus[i].code != 'schedule' && systemConfigs.menus[i].code != 'search' && systemConfigs.menus[i].code != 'settings' ){
			menusList.push(systemConfigs.menus[i]);							
		}
	}	
	responseArray.menusList = menusList;
	if(clickedMenu && clickedMenu.targetPath && responseArray.targetPath == firstMenu){
		responseArray.backFocus = clickedMenu;
	}		
	

	//sections
	if(result.response.data){
		var responseSections = [];
		var paginationSections = [];
		var paginationSectionsData = [];
		var responseContent = [];
		for(var i=0;i<result.response.data.length;i++){
			if(result.response.data[i].paneType == 'section'){
				if(result.response.data[i].section.sectionInfo.code == 'continue_watching' ) {responseArray.isContinueWatchingavailable=true;}
				if(result.response.data[i].section.sectionData.data.length > 0 ) {
					if(result.response.data[i].section.sectionData.data.length > 6 && result.response.data[i].section.sectionControls.showViewAll == true && responseArray.pageType!= 'player'  ){
						result.response.data[i].section.sectionControls.showViewAll =true;
						result.response.data[i].section.sectionControls.dataLength = result.response.data[i].section.sectionData.data.length + 1 ;
					}else {
						result.response.data[i].section.sectionControls.showViewAll =false;
						result.response.data[i].section.sectionControls.dataLength = result.response.data[i].section.sectionData.data.length ;
					}
					responseSections.push(result.response.data[i].section);
				}
				else if(result.response.data[i].section.sectionData.hasMoreData == true ) {				
					paginationSections.push(result.response.data[i].section.sectionInfo.code);
					paginationSectionsData.push(result.response.data[i].section);
				}
			}
			if(result.response.data[i].paneType == 'content'){
				responseContent.push(result.response.data[i].content);
			}
			if(result.response.data[i].paneType == 'specialcontent'){
				if(result.response.data[i].specialContent.code=='tvguide'){
					responseArray.pageType= 'tvguide';
					responseArray.view = 'tvguide';			
				}
			}
		}
		if(responseArray.pageType=='list' && !!result.response.data[0].section){
			responseArray.listTitle=result.response.data[0].section.sectionInfo.name;
		}

		// Reverse the sections on player page
		if(responseArray.view == 'player'){
			responseArray.sections=responseSections.reverse();
		}else{
			for (i=0; i < responseSections.length; i++) {
				if (responseSections[i].sectionInfo.dataType == 'banner') {
					responseSections.splice(i, 1);
				}
			}
			responseArray.sections = responseSections;
		}
		responseArray.pageContent = responseContent;
		responseArray.paginationSections = paginationSections;
		responseArray.paginationSectionsData =paginationSectionsData;
	}


	//back data add
	if(presentPagedetails.targetPath != undefined && responseArray.view != 'player'){					
		Main.addBackData(targetPath,result);						
	}

	//responseArray
	responseArray.menuIndex= 0;
	responseArray.sectionIndex = {};

	console.log(responseArray);
	//html display

	if(responseArray.view == 'player'){		
		Main.getStream(result, responseArray);				
		return;
	}
	else if(responseArray.view == 'tvguide'){
		view = responseArray.view;
		presentPagedetails = responseArray;
		Main.getTvguideChannelsList();
	}
	else{
		if(presentPagedetails.view == 'player') analytics.plugin.handlePlayEndedByUser();
		view = responseArray.view;
		presentPagedetails = responseArray;
		Yup("#mainContent").html(Util.getContentHTML(presentPagedetails));
	}


	Yup("#mainContent").show();	
	keyHandlar.menuActiveHandular();  // add active class to present page menu

	//removeing player if exits
	try {
		media.pause();
		media.stop();
		media.unsetListener();
	}
	catch (e) { }


	//live bar unbscribe in tvguide
	if(!!liveSubscribe){
		clearInterval(liveSubscribe);
	}
	
	//add first focus
	if(presentPagedetails.pageType == 'list'){		
		if(presentPagedetails.sections && presentPagedetails.sections.length > 0 && presentPagedetails.sections[0].sectionData.data.length > 0 ){
			Yup("#sectionItem-0-0").addClass("imageFocus");
		}else {
			Yup(".menus-list-item.active").addClass("imageFocus");
		}
	}	
	else if (presentPagedetails.pageType == 'details'){
		if(presentPagedetails.avilablePagebuttonsLength >=1){
			Yup("#button-0").addClass('imageFocus');
		}else if(presentPagedetails.pageButtons && presentPagedetails.pageButtons.showFavouriteButton && presentPagedetails.pageButtons.showFavouriteButton == true){
			Yup("#favorites").addClass('imageFocus');
		}
		else if(presentPagedetails.sections && presentPagedetails.sections.length > 0){
			Yup("#sectionItem-0-0").addClass("imageFocus");
		}
		if(presentPagedetails.sections && presentPagedetails.sections.length > 0 && presentPagedetails.pageSubType != 'movieDetails'){
			Yup("#section-0").addClass('activeSection');
		}
	}	
	else if (presentPagedetails.pageType == 'tvguide'){
		
	}
	else {
		presentPagedetails.refreshContinueWatching=false;	// contnue watching section update		
		if(presentPagedetails.menusList && presentPagedetails.menusList.length > 0){
			if(parseInt(clickedMenu['index'])){                       
			Yup("#menu-" + clickedMenu['index'] ).addClass("imageFocus");
			}else{
			Yup("#menu-0" ).addClass("imageFocus");
			}
			if(presentPagedetails.banners && presentPagedetails.banners.length > 0){
				Main.initiateSlick(false);
			}
		}else if(presentPagedetails.banners && presentPagedetails.banners.length > 0){
			if(presentPagedetails.backFocus){
				Main.initiateSlick(false);	
				Yup("#menu-"+presentPagedetails.backFocus['index']).addClass("imageFocus");		
			}else{
				Main.initiateSlick(true);
			}			
		}
		else if(presentPagedetails.sections && presentPagedetails.sections.length > 0 && presentPagedetails.sections[0].sectionData.data.length > 0 ){
			Yup("#sectionItem-0-0").addClass("imageFocus");
		}else{
			//NO DATA FOUND IN CONTENT PAGE
			Yup("#mainContent").append(Util.noDataFound());
		}
	}
	Main.HideLoading();	
}

// slick init 
Main.initiateSlick =function(addFocus){
	try {	
		Yup('#BannersHome').slick({
			centerMode: true,
			slidesToScroll: 1,
			arrows: false,
			slidesToShow: 1,
			variableWidth: true,
			autoplay: true,
			autoplaySpeed: 6000,
			dots: true,
		});	
		if(addFocus == true){
			Yup(".middleBanner").addClass("imageFocus");
		}		
	} catch (e) {}
}

// to get the response of pagination sections and append the sections to page
Main.getPaginationsections = function(){
	Main.ShowLoading();	
	var params = '';
	if(presentPagedetails.paginationSections.length > 10){
		var presentSections = presentPagedetails.paginationSections.slice(0,10)
		params = presentSections.join(',');
		presentPagedetails.paginationSections = presentPagedetails.paginationSections.slice(10,presentPagedetails.paginationSections.length);
	}else{
		params = presentPagedetails.paginationSections.join(',');
		presentPagedetails.paginationSections = [];
	}
			
	var headerJ = {
		"tenant-code": Main.tenantCode,
		"box-id": Main.getBOXID(),
		"session-id": Main.getSessionID()
	};
	try {
		Yup.ajax({
			url: Main.mainApi + "/service/api/v1/section/data?path=" + presentPagedetails.targetPath + "&code=" + params + "&offset=-1&count=12",
			type: 'GET',
			headers: headerJ,			
	
			success: function (data) {
				var result = JSON.parse(data);
					
				if (result.status == true) {
					var pageSections = []				
					for(var i=0; i< result.response.length; i++){	
						var tempSections = {};
						for(var j=0;j < presentPagedetails.paginationSectionsData.length;j++ ){
							if(result.response[i].section == presentPagedetails.paginationSectionsData[j].sectionInfo.code){
								if(result.response[i].data.length > 0){
									tempSections = presentPagedetails.paginationSectionsData[j];
									tempSections.sectionData.data = result.response[i].data;								
								}
								break;
							}
						}					
						if(tempSections.sectionData){
							if(tempSections.sectionData.data.length > 6 && tempSections.sectionControls.showViewAll == true && presentPagedetails.pageType!= 'player' ){
								tempSections.sectionControls.showViewAll = true;
								tempSections.sectionControls.dataLength = tempSections.sectionData.data.length + 1;
							}else{
								tempSections.sectionControls.showViewAll = false;							
								tempSections.sectionControls.dataLength = tempSections.sectionData.data.length;
							}
							pageSections.push(tempSections);
						}
					}
					if(pageSections){					
						Yup(".sectionsHome").append(Util.getPaginationSections(pageSections));
						for(var  i= 0; i< pageSections.length; i++){
							presentPagedetails.sections.push(pageSections[i]);	
						}
						Main.HideLoading();						
					}else{
						Main.HideLoading();
					}
					if(!presentPagedetails.paginationSections)	{
						presentPagedetails.paginationSectionsData = [];
					}	
						
				}else{
					Main.HideLoading();
				} 
			},
			error: function (errObj) {	
				Main.HideLoading();			
				utilities.responseErrorCheck(errObj);	
			},
			timeout: 60000
		});
	} catch (error) {
		Main.HideLoading();
		utilities.genricPopup('Something Went Wrong','unknown');
	}	

}

//get apgiantion data in view all pages
Main.viewAllPagination =function(){
	Main.ShowLoading();	
	var headerJ = {
		"tenant-code": Main.tenantCode,
		"box-id": Main.getBOXID(),
		"session-id": Main.getSessionID()
	};
	var url=Main.mainApi + "/service/api/v1/section/data?path=" + presentPagedetails.targetPath + "&code=" + presentPagedetails.sections[0].sectionData.section + "&offset="+presentPagedetails.sections[0].sectionData.lastIndex+"&count=48";
	if(presentPagedetails.targetPath==systemConfigs.configs.favouriteMenuTargetPath) {
    url=Main.mainApi + "/service/api/auth/user/favourites/list?offset="+presentPagedetails.sections[0].sectionData.lastIndex+"&count=48"
	}	
	Yup.ajax({
		url: url,
		type: 'GET',
		headers: headerJ,			

		success: function (data) {
			var result = JSON.parse(data);				
			if (result.status == true) {
				var pageSections = result.response[0];			
				if(pageSections.data.length > 0){
					Util.addPaginationViewAll(pageSections);						
				}else{
					Main.HideLoading();
					presentPagedetails.sections[0].sectionData.hasMoreData =false;
				}					
			}else{
				Main.HideLoading();
				presentPagedetails.sections[0].sectionData.hasMoreData =false;
			} 
		},
		error: function (errObj) {	
			Main.HideLoading();					
			presentPagedetails.sections[0].sectionData.hasMoreData =false;
		},
		timeout: 60000
	});
}

//get search suggestions
Main.getSearchSuggestion =function(query,addFocus){
	if(query.trim().length == 0){
		return;
	}
	var headerJ = {
		"tenant-code": Main.tenantCode,
		"box-id": Main.getBOXID(),
		"session-id": Main.getSessionID()
	};	
	Yup.ajax({
		url: Main.mainApi + "/service/api/v1/search/suggestions?query=" + query ,
		type: 'GET',
		headers: headerJ,
		success: function (data) {
			var result = JSON.parse(data);	
			if(result.status == true && result.response.length>0){				
				Yup('.searchSuggestions').html(Util.getSearchSuggestionsHTML(result.response));	
				if(window.width > 1280){
					Yup('.searchSuggestions').animate({height : 55 },200);
				}				
				else{
					Yup('.searchSuggestions').animate({height : 45 },200);
				}
				presentPagedetails.sectionIndex[0] = 0;
				presentPagedetails.searchSuggestion = result.response;	
				if(addFocus == true)	{ keyHandlar.addFocusOnClickSearchSuggestions() }		
			}
			else{
				Yup('.searchSuggestions').html('');
				Yup('.searchSuggestions').animate({height : 45 },200);
				presentPagedetails.searchSuggestion = {};
				if(addFocus == true)	{ keyHandlar.addFocusOnClickSearchSuggestions() }			
			}
		},
		error: function (errObj) {	
			Yup('.searchSuggestions').html('');
			Yup('.searchSuggestions').animate({height : 45 },200);
			presentPagedetails.searchSuggestion = {};
			if(addFocus == true)	{ keyHandlar.addFocusOnClickSearchSuggestions() }	
		},
		timeout: 60000
	});
}

//get search Results
Main.getSearchResults = function(query) {
	if(query.trim().length == 0){
		Yup('#searchResults').html('');
		presentPagedetails.searchResults = [];
		return;		
	}
	if(presentPagedetails.searchPaginationPage.page==0){
		(presentPagedetails.searchResults = []);
	}
	var headerJ = {
		"tenant-code": Main.tenantCode,
		"box-id": Main.getBOXID(),
		"session-id": Main.getSessionID()
	};	
	Yup.ajax({
		url: Main.mainApi + "/service/api/v1/get/search/query?query=" + query +'&page='+presentPagedetails.searchPaginationPage.page+'&pageSize=30',
		type: 'GET',
		headers: headerJ,
		success: function (data) {
			var result = JSON.parse(data);	
			if(result.status == true && result.response.length>0){
				Yup('#resultsCount').html('');
				// Search pagination Data Append	
				if(presentPagedetails.searchPaginationPage.page!=0){
					Util.addPaginationToSearchPage(result.response);
				}else{
					Yup('#searchResults').html(Util.getSearchResultsHTML(result.response));
					for (var k = 0; k < result.response.length; k++) {
						presentPagedetails.searchResults.push(result.response[k]);
					}
				}
			}else{
				if(presentPagedetails.searchPaginationPage.page==0){
					Yup('#resultsCount').html(Util.getResultsHTML(result.error.message));
					Yup('#searchResults').html('');

				}else{
					presentPagedetails.searchPaginationPage={
						'page':0,
						'searchPaginationHit':false
					};
				}				
			}			
		},
		error: function (errObj) {	
			if(presentPagedetails.searchPaginationPage.page==0){
				Yup('#resultsCount').html(Util.getResultsHTML('No Results Found'));
				Yup('#searchResults').html('')
			} else{
				presentPagedetails.searchPaginationPage={
					'page':0,
					'searchPaginationHit':false
				}
			}
		},				
		timeout: 60000
	});
}

// key handular trigger method
Main.processTrigger = function (event) {
	if (!!airMouse) {Main.showArrows();	}
	else{ Main.hideArrows();	}

	if(Main.popupData && Main.popupData.popuptype){
		keyHandlar.popupKeyHandlar(event);
	}else if(presentPagedetails.templateData && presentPagedetails.templateData.templateCode){
		keyHandlar.templateKeyHandlar(event);
	}
	else{
		if(view == 'content'){
			keyHandlar.contentKeyHandlar(event);
		}
		else if(view == 'list'){
			keyHandlar.listKeyHandlar(event);
		}
		else if(view == 'search'){
			keyHandlar.searchKeyHandlar(event);
		}
		else if(view == 'tvshowDetails' || view == 'movieDetails' || view=='channelDetails'){
			keyHandlar.detailsPageKeyHandlar(event);
		}
		else if(view =="player"){
			keyHandlar.playKeydown(event);
		}
		else if(view =='signin' || view == 'forgetPassword' || view == 'otpVerification' || view == 'changePassword' || view == 'signup' || view == 'signupOtpVerification'){
			keyHandlar.AuthKeyhandler(event);
		}
		else if(view =='accountDetails'){
			keyHandlar.accountKeydown(event);
		}
		else if (view == 'signinSuccess' || view == 'signout' || view=='introPageView' || view=='noPackageView'){
			keyHandlar.uniqueKeydown(event);
		}
		else if(view =='countryCode'){
			keyHandlar.countryCodeKyeHandular(event);
		}	
		else if(view =='tvguide'){
			keyHandlar.tvguideKeyHandular(event);
		}		
		else{
			keyHandlar.contentKeyHandlar(event);
		}
	}	
};

// static page html display
Main.processNext = function () {
	Main.ShowLoading();
	Yup('.mouseFocus').removeClass('mouseFocus');
	if(presentPagedetails.banners){
		try{
			Yup('#BannersHome').slick('unslick');
		}catch(e){
		}
	}

	Main.addBackData((view!='accountDetails' ? view :'settings'),{});
		
	//removeing player if exits
	try {
		media.stop();
		media.unsetListener();
	}
	catch (e) { }


	if( view == 'search'){
		presentPagedetails = {};
		presentPagedetails.view = view;
		presentPagedetails.targetPath = 'search';
		presentPagedetails.searchSuggestion = {};
		presentPagedetails.sectionIndex = {};
		presentPagedetails.searchResults = [];
		presentPagedetails.searchPaginationPage={
			'page':0,
			'searchPaginationHit':true,
			'lastdataLength':0
		}	
		Yup("#mainContent").html('');
		Yup("#mainContent").html(Util.searchHTML());
		var selectedKeyMap = Yup("#Alpha-51").attr("keyValue");
		if(selectedKeyMap == 'ABC')	{
			Yup("#characterMap").show();
			Yup("#NumbersMap").hide();		
			Yup("#Alpha-0").addClass("imageFocus");
		} else{
			Yup("#characterMap").hide();
			Yup("#NumbersMap").show();		
			Yup("#Alpha-26").addClass("imageFocus");
		}
		Main.HideLoading();
	}
	else if(view == 'signin'){
		presentPagedetails = {};
		presentPagedetails.view = view;
		presentPagedetails.targetPath = 'signin';
		presentPagedetails.isChecked = false;
		Yup("#mainContent").html('');
		Yup("#mainContent").html(Util.signInHtml("email"));
		Main.HideLoading();	
		if(1==1){ Main.proccessAuthData(); }				
	}
	else if(view == 'signup'){
		presentPagedetails = {};
		presentPagedetails.view = view;
		presentPagedetails.targetPath = 'signup';
		presentPagedetails.isChecked = false;
		tempObjectData.password = undefined;
		Yup("#mainContent").html('');
		Yup("#mainContent").html(Util.signUpHtml());
		Main.HideLoading();	
	}
	else if(view == 'countryCode'){
		presentPagedetails = {};
		presentPagedetails.view = view;
		presentPagedetails.targetPath = 'countryCode';
		Yup("#mainCOntent").html('');
		Yup("#mainContent").html(Util.countryCodeSelectionHtml());	
		Main.HideLoading();	
	}
	else if(view == 'forgetPassword'){
		presentPagedetails = {};
		presentPagedetails.view = view;
		presentPagedetails.targetPath = 'forgetPassword';
		Yup("#mainContent").html('');
		Yup("#mainContent").html(Util.forgetPasswordHTML());
		Main.HideLoading();
		if(1==1){ Main.proccessAuthData(); }
	}
	else if(view == 'otpVerification'){
		presentPagedetails = {};
		presentPagedetails.view = view;
		presentPagedetails.targetPath = 'otpVerification';
		presentPagedetails.isChecked = false;
		Yup("#mainContent").html('');
		Yup("#mainContent").html(Util.otpVerificationHTML());
		Main.HideLoading();
		if(1==1){ Main.proccessAuthData(); }		
	}
	else if(view == 'signupOtpVerification'){
		presentPagedetails = {};
		presentPagedetails.view = view;
		presentPagedetails.targetPath = 'signupOtpVerification';
		Yup("#mainContent").html('');
		Yup("#mainContent").html(Util.signupOTPVerificationHTML());		
		Main.HideLoading();
		if(1==1){ Main.proccessAuthData(); }
	}
	else if( view == 'changePassword'){
		presentPagedetails = {};
		presentPagedetails.view = view;
		presentPagedetails.targetPath = 'changePassword';
		presentPagedetails.isChecked = false;
		Yup("#mainContent").html('');
		Yup("#mainContent").html(Util.changePasswordHTML());
		Main.HideLoading();
	}
	else if(view == 'accountDetails'){
		var tempMenusList = presentPagedetails.menusList;
		presentPagedetails = {};
		presentPagedetails.view = view;
		presentPagedetails.targetPath = 'settings';
		presentPagedetails.sectionIndex = {};
		presentPagedetails.menusList =  tempMenusList;
		tempObjectData.landingFromSettings = false;
		if (Main.userProfile.userStatus) {
			Main.getUserInfo(true);	
		}
		Yup(".menus-content").html('');	
		Yup(".menus-content").html(Util.getAccountDetailsHTML());	
		if(1==1) {
			keyHandlar.menuActiveHandular(); 
			Yup(".imageFocus").removeClass("imageFocus");
			Yup(".menus-list-item.active").addClass("imageFocus");
		}
		Main.HideLoading();	
	}else if (view == 'signinSuccess'){
		presentPagedetails = {};
		presentPagedetails.view = view;
		presentPagedetails.targetPath = 'signinSuccess';
		//remove history of signin and signup pages
		utilities.removeAuthHistory();
		Yup("#mainContent").html('');
		Yup("#mainContent").html(Util.signUpSuccess(tempObjectData.signUpMsg));	
		Main.HideLoading();	
	}
	else if(view=='noPackageView'){
		presentPagedetails = {};
		presentPagedetails.view = view;
		presentPagedetails.targetPath = 'noPackageView';
		Yup("#mainContent").html('');
		Yup("#mainContent").append(Util.noPackagesPage());
		Main.HideLoading();	
	}
	Yup("#mainContent").show();
}

// getting previous page a from back data and rendering. 
Main.previousPage =function(){
	Main.playerHideLoading();
	if(backData.length > 0){	
		Main.ShowLoading();	
		presentPagedetails = backData[backData.length-1];
		(tempObjectData.context == 'login' && (tempObjectData.context = '',tempObjectData.password=''));	
		if(checknetworkType == false){
			presentPagedetails.pageReload=false;
			presentPagedetails.refreshContinueWatching=false;
			utilities.responseErrorCheck({responseText:''});
		}
		// (presentPagedetails.targetPath == 'section/continue_watching') && (presentPagedetails.pageReload=true); // viewall continue watching refresh
		if(presentPagedetails.pageReload && presentPagedetails.pageReload == true && presentPagedetails.targetPath!='search'){
			backData.pop();
			if(presentPagedetails.targetPath == 'settings' ){
				view = presentPagedetails.view;
				Main.processNext();
			}else{
				if(presentPagedetails.isCustomHeaderAdded == true)	{
					commingFromMenus = true;
					clickedMenu = presentPagedetails.clickedMenu;;
				}
				Main.apiCall(presentPagedetails.targetPath);
			}		
		}else{
			presentPagedetails.pageReload == false;	
			Yup("#mainContent").html('');
			Yup("#mainContent").html(presentPagedetails.htmlData);

			// contnue watching section update
			if( presentPagedetails.refreshContinueWatching == true){
				presentPagedetails.refreshContinueWatching=false;
				if(Main.userProfile.userStatus == true && presentPagedetails.isContinueWatchingavailable==true){
					Main.updateContinueWatchingData();
				}				
			}

			if(presentPagedetails.banners){			
				Main.initiateSlick(false);
			}		
			 
			Main.HideLoading();	
			backData.pop();
			view = presentPagedetails.view;
			if(view == 'signin' || view == 'forgetPassword' || view =='signup' ){  //After code selection refecting on signin pages
				Yup(".countryCode").html('');
				Yup(".countryCode").html(Util.countryCodeForm());
			}

			if(view == 'tvguide'){
				keyHandlar.positonliveTag();                
				keyHandlar.initLiveSubscribe();
			}

			Main.proccessAuthData();
		}
		
	}
	else {
		Main.apiCall(firstMenu);
	}
}

// storing the back DATA
Main.addBackData = function(targetPath,result){
	if(presentPagedetails.banners){
		try{
			Yup('#BannersHome').slick('unslick');
		}catch(e){
		}
	}							
	presentPagedetails.htmlData=(Yup('#mainContent').html() ).toString();	

	if(targetPath == firstMenu){
		backData = [];
	}
	else if(presentPagedetails && presentPagedetails.pageType == 'details' ){
		if(result && result.response && result.response.info && result.response.info.attributes && result.response.info.attributes.contentType && result.response.info.pageType== 'details' && result.response.info.attributes.contentType == 'movie' &&  presentPagedetails.pageSubType == 'movieDetails' ){
			//previous pageType and Sub PageType is same as next or current resposne page type
		}else if(result && result.response && result.response.info && result.response.info.attributes && result.response.info.attributes.contentType && result.response.info.attributes.contentType == 'tvshowDetails' &&  presentPagedetails.pageSubType == 'tvshowDetails' ){
			//previous pageType and Sub PageType is same as next or current resposne page type
		}
		else if(result && result.response && result.response.info && result.response.info.attributes && result.response.info.attributes.contentType && result.response.info.attributes.contentType == 'channel' &&  presentPagedetails.pageSubType == 'channelDetails' ){
			//previous pageType and Sub PageType is same as next or current resposne page type
		}
		 else{
			if(presentPagedetails.targetPath != targetPath ){
				backData.push(presentPagedetails);
			}
		}
	}
	else if(presentPagedetails && presentPagedetails.pageType == 'content'){
		if(presentPagedetails.targetPath != targetPath ){
		var contentCount=0;
		if(backData.length>3){
			for(var i=backData.length-1;i>=backData.length-4;i--){
				if(backData[i].pageType == 'content'){
					for(var j=0; j<systemConfigs.menus.length ; j++ ){
						if(systemConfigs.menus[j].targetPath == backData[i].targetPath){
							contentCount++;
						}
					}
				}
			}
		}
		if(contentCount<=3){
			backData.push(presentPagedetails);
		}
		}
	}
	else if(presentPagedetails && presentPagedetails.pageType == 'player'){
	}
	else{
		 if(presentPagedetails.targetPath != targetPath ){
			backData.push(presentPagedetails);
		 }
	}	
	
}

// signIn Api
Main.requestSignIn = function (forceLogin) {
	Main.ShowLoading();
	var api_toCall;
	var num = '';
	if(!!tempObjectData.isMobile){num=Main.mobileCode;}	
	num= num + tempObjectData.mobileNo
	var data = {
		"login_id": num,
		"login_key": tempObjectData.password,
		"login_mode": (tempObjectData.context == 'login') ? 2 : 1,
		"manufacturer": device.manufacturer
	};
	if(forceLogin == true){
		data["force_login"]=true;
	}
	if (systemConfigs.configs.encryptAuthApi == "true") {
		data['login_mode']= ''+ data['login_mode'] ;
		if(forceLogin == true){
			data["force_login"]='true';
		}
		api_toCall = "/service/api/v1/send";
		data = JSON.stringify({
			'data': utilities.encryptData(data),
			'metadata': utilities.encryptData(JSON.stringify({ "request": "signin" })),
		})
	} else {
		data['login_mode']= parseInt(data['login_mode']);
		api_toCall =(tempObjectData.context == 'login') ? "/service/api/auth/signin" : "/service/api/auth/v1/signin";
	}
	Yup.ajax({
		url: Main.mainApi + api_toCall,
		type: "POST",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
		    "session-id": Main.getSessionID()
		},
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			if (systemConfigs.configs.encryptAuthApi == "true") {
				var info = JSON.parse(data);
				var result = utilities.decryptData(info.data);
				result = JSON.parse(result);
			} else {
				var result = JSON.parse(data);
			}
			if (result.status == true) {
				utilities.settingUserData(result);
				if(result.response.actionCode == 2 || result.response.actionCode == 4){
					tempObjectData.actionCode=result.response.actionCode;		
					tempObjectData.context = 'login';
					Main.sendOTP();	
				}else{
					//(tempObjectData.context=='login') && (backData.pop());
					tempObjectData = {};
					Main.apiCall(firstMenu);	
				}			
			} else if (result.status == false) {
				Main.HideLoading();
				if (result.error.code == '-6') { // non-mobile verified user trying to Login					
					// Main.popupData ={
					// 	popuptype : 'info',
					// 	message : result.error.message,
					// 	buttonCount : 1,
					// 	yesText : 'Okay',
					// 	yesTarget : 'close',
					// 	onBack : 'close'
					// }
					// Yup("#popUpFDFS").html(Util.showPopup());
					// Yup("#popup-btn-1").addClass('popupFocus');
					tempObjectData.actionCode=(!!result.error.actionCode) ? result.error.actionCode : result.error.code;		
					tempObjectData.context = 'login';
					Main.sendOTP();	
				} 
				else if(result.error.code == '-17'){  //session alerady registerd
					Main.SessionID = '';
					utilities.setLocalStorage("sessionId", '');
					Main.getSessionAPI({type:'signin','force_login': forceLogin},Main.requestSignIn);					
				}
				else if(result.error.code == '101'){ // Max sessions reached
					Main.popupData ={
						popuptype : 'sessionLimit',
						headerTitle :result.error.message ,
						message : result.error.details.description,
						buttonCount : 2,
						yesText : 'Proceed',
						yesTarget : 'forceLogin',
						onBack : 'close',
						noTarget:'close',
						noText:'Close'
					}
					Yup("#popUpFDFS").html(Util.showPopup());	
					Yup("#popup-btn-1").addClass('popupFocus');
				}
				else if (result.error.code == 401 || result.error.code == 500) {  // if session expires
					Main.SessionID = '';						
					utilities.setLocalStorage('sessionID','');		
					Main.getSessionAPI({type:'signin','force_login': forceLogin},Main.requestSignIn);	
				}
				else {	
					utilities.genricPopup(result.error.message,'info');				
				}
			}
		},
		error: function (e) {
			Main.HideLoading();		
			utilities.responseErrorCheck(errObj);
		
		},
		timeout: 60000
	});
}

Main.sendOTP = function () {
	Main.ShowLoading();
	var data, apiUrl;
	var data = {"context": tempObjectData.context};
	if(!!tempObjectData.isMobile){data["mobile"]= Main.mobileCode +tempObjectData.mobileNo}
	else{data["email"]=tempObjectData.mobileNo}	
	apiUrl='/service/api/auth/get/otp'; // get otp API for forgetpassword	
	Yup.ajax({
		url: Main.mainApi + apiUrl,
		type: "POST",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
		    "session-id": Main.getSessionID()
		},
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			Main.HideLoading();
			result = JSON.parse(data);
			if (result.status == true) {
				tempObjectData.referenceId = result.response.referenceId;
				if(view == 'forgetPassword'){
					view = 'otpVerification';
					Main.processNext();
				}
				else if(view == 'signup' || view == 'signin'){
					view = 'signupOtpVerification';
					Main.processNext();
				}				
			} else if (result.status == false) {
				if(result.error && result.error.message ){
					utilities.genricPopup(result.error.message,'info');						
				}else{
					utilities.genricPopup('Something Went Wrong','unknown');
				}
			}
		},
		error: function (e) {
			Main.HideLoading();		
			utilities.responseErrorCheck(errObj);	
		},
		timeout: 60000
	});
}

// settings page
Main.getActivePackages = function () {
	Main.ShowLoading();
	Yup.ajax({
		url: Main.mainApi + "/service/api/auth/user/activepackages",
		type: "GET",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},
		success: function (data) {
			result = JSON.parse(data);
			presentPagedetails.settingsActivepackages = result.response;					
			Yup('#user-active-packages').html('');
			Yup('#user-active-packages').html(Util.getActivePackages());		
			Main.HideLoading();
		},
		error: function (errObj) {
			presentPagedetails.settingsActivepackages = [];
			Main.HideLoading();
		},
		timeout: 60000
	});
}

Main.getTranctionDetails = function () {
	Main.ShowLoading();
	Yup.ajax({
		url: Main.mainApi + "/service/api/auth/transaction/history",
		type: "GET",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},
		data: {
			"page": 0
		},
		success: function (data) {
			result = JSON.parse(data);
			presentPagedetails.transactionDetails = result.response;
			Main.HideLoading();
		},
		error: function (errObj) {
			presentPagedetails.transactionDetails = [];
			Main.HideLoading();
		},
		timeout: 60000
	});
}

Main.signout = function () {
	Main.ShowLoading();
	Yup.ajax({
		url: Main.mainApi + "/service/api/auth/signout",
		type: "POST",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
		    "session-id": Main.getSessionID()
		},
		success: function (data) {
			signOutProccess();
			Main.HideLoading();
		},
		error: function (errObj) {
			signOutProccess();
			Main.HideLoading();
		},
		timeout: 60000
	});
}

function signOutProccess() {
	Main.BOXID='';
	Main.sessionID='';
	backData = [];
	presentPagedetails = {};
	popupData ={};
	utilities.setLocalStorage('sessionID','');
	utilities.setLocalStorage('boxNo','');
	utilities.resetUserData();
	view = "signout";
	isUserSignedOutinThisSession = true;
	clickedMenu = {};
	commingFromMenus = false;
	Yup('#mainContent').html(Util.signout());
}

Main.verifyOtpForgetPassword =function(recivedOtp){
	Main.ShowLoading();
	var data = {
		"otp": parseInt(recivedOtp),
		"password": tempObjectData.password,
		"mobile": Main.mobileCode +tempObjectData.mobileNo
	};	
	Yup.ajax({
		url: Main.mainApi + "/service/api/auth/update/password",
		type: "POST",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",		
		success: function (data) {
			result = JSON.parse(data);		
			Main.HideLoading();
			if (result.status == true) {
				Main.popupData ={
					popuptype : 'info',
					message : result.response.message,
					buttonCount : 1,
					yesText : 'Sign In',
					yesTarget : 'goto_signin_from_password_reset',
					onBack : 'goto_signin_from_password_reset'
				}
				Yup("#popUpFDFS").html(Util.showPopup());	
				Yup("#popup-btn-1").addClass('popupFocus');				
			} else if (result.status == false) {
				if(result.error && result.error.message ){
					utilities.genricPopup(result.error.message,'info');
				}else{					
					utilities.genricPopup('Something Went Wrong','unknown');	
				}
			}
		},
		error: function (errObj) {			
			Main.HideLoading();		
			utilities.responseErrorCheck(errObj);
		},
		timeout: 60000
	});
}

// get Stream
Main.getStream = function(res,responseArray){
	var route = res.response.info.path
	var api_toCall, type, encryptObj;
	if (systemConfigs.configs.encryptStreamApi == "true") {
		api_toCall = "/service/api/v1/send";
		type = "POST";
		encryptObj = {
			"data": utilities.encryptData(JSON.stringify({ "path": route })),
			"metadata": utilities.encryptData(JSON.stringify({ "request": "page/stream" })),
		}
	} else {
		api_toCall = "/service/api/v1/page/stream?path=" + route;
		type = "GET";
	}
	Yup.ajax({
		url: Main.mainApi + api_toCall,
		type: type,
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},
		data: encryptObj,
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			Main.ShowLoading();
			if (systemConfigs.configs.encryptStreamApi == "true") {
				var info = JSON.parse(data);
				var result = utilities.decryptData(info.data);
				result = JSON.parse(result);
			} else {
				var result = JSON.parse(data);
			}
			if(result.status == true){
				responseArray.steamResponse = result.response;		
				responseArray.navigationFrom=presentPagedetails.view;
				if(responseArray.steamResponse.streamStatus.seekPositionInMillis > 0){ // For startOver and Resume
					// Main.popupData ={
					// 	popuptype : 'startOver',
					// 	headerTitle:"Would you like to Resume at",
					// 	message : utilities.toHHMMSS(responseArray.steamResponse.streamStatus.seekPositionInMillis),
					// 	buttonCount : 2,  
					// 	yesText:'Resume',
					// 	yesTarget:'resume',       
					// 	noTarget:'startOver',
					// 	noText:'Start Over',
					// 	onBack : 'close',
					// 	responseArray : responseArray,
					// 	result : res,
					// }
					// Yup("#popUpFDFS").html(Util.showPopup());	
					// Yup("#popup-btn-1").addClass('popupFocus');
					responseArray.isResume = true;
				}else{
					responseArray.isResume = false;
				}
				if (presentPagedetails.view == 'player') {
					analytics.plugin.handlePlayEndedByUser();
					try {
						media.pause();
						media.stop();
						media.unsetListener();
					}
					catch (e) { }
				}			
				Main.addBackData(responseArray.targetPath,res);
				view = 'player';
				presentPagedetails = responseArray;
				presentPagedetails.nextVideoDetails=[];
				if(res.response.info.attributes.contentType=='tvshowepisode')(Main.getNextVideo(res.response.info.path));
				else (Player.callingPlayer());
			}else{
				
			}
			
			Main.HideLoading();			
		},
		error: function (errObj) {
			Main.HideLoading();		
			utilities.responseErrorCheck(errObj);

		},
		timeout: 60000
	});
};


Main.proccessAuthData =function(){
	if(view == 'signin'){
		//mobile value integration
		if( utilities.validateString(tempObjectData.mobileNo))
			Yup("#signInInput-0").val(tempObjectData.mobileNo);
		// if( utilities.validateString(tempObjectData.password))
		// 	Yup("#signInInput-1").val(tempObjectData.password);
	}
	else if(view == 'signup'){
		if( utilities.validateString(tempObjectData.mobileNo))
			Yup("#signInInput-0").val(tempObjectData.mobileNo);
	}
	else if( view == 'forgetPassword'){
		if( utilities.validateString(tempObjectData.mobileNo))
			Yup("#signInInput-0").val(tempObjectData.mobileNo);
		tempObjectData.referenceId = undefined;
	}
	else if(view == 'otpVerification' || view == 'signupOtpVerification'){	
		//presentPagedetails.enableOtpResendBtnIn = (systemConfigs.configs.enableOtpResendBtnIn && systemConfigs.configs.enableOtpResendBtnIn.length>0) ? parseInt(systemConfigs.configs.enableOtpResendBtnIn) : 120;
		presentPagedetails.enableOtpResendBtnIn = 120;
		Main.startTimer();
	}	
}

Main.startTimer =function() {	
	var enableOtpResendBtnIn = presentPagedetails.enableOtpResendBtnIn;
	resetTimer = setInterval(function(){			
		if(enableOtpResendBtnIn !=0){
			var minutes = Math.floor( (enableOtpResendBtnIn ) / 60 ) 
			var seconds =  Math.floor(  (enableOtpResendBtnIn ) % 60 )
			if(seconds < 10 ) seconds = '0'+seconds;
			enableOtpResendBtnIn = enableOtpResendBtnIn -1;	
			Yup(".resendButton").addClass('disabled');
			presentPagedetails.resendButton =false;
			Yup(".timer-resend").text(' Resend Code in  '+minutes+' : '+seconds+' sec')				
		}else{				
			Main.stopTimer();
		}
	}, 1000);	
}

Main.stopTimer =function() {
	Yup(".resendButton").removeClass('disabled');	
	Yup(".timer-resend").text('Resend Code');
	presentPagedetails.resendButton =true;	
	clearInterval(resetTimer); 
}

Main.resendOTP =function(){
	Main.ShowLoading();
	var data;
	if(tempObjectData.context == "verify_mobile"){
		data = JSON.stringify({
			"reference_id": tempObjectData.referenceId,		
		});
	}else{
		data = JSON.stringify({
			"reference_id": tempObjectData.referenceId,
		});
		if(!!tempObjectData.isMobile){data["mobile"]= Main.mobileCode +tempObjectData.mobileNo}
		else{data["email"]=tempObjectData.mobileNo}	
	}
	Yup.ajax({
		url: Main.mainApi + "/service/api/auth/resend/otp",
		type: "POST",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},
		data: data,
		contentType: "application/json; charset=utf-8",

		success: function (data) {
			result = JSON.parse(data);
			if (result.status == true) {			
				Main.startTimer();
				var id = Yup('.imageFocus').attr("btntype"); 
				if(id == 'resendBtn'){	
								
					Main.eventGenerate(tvKeyCode.ArrowLeft); 
				}
				utilities.genricPopup(result.response.message,'info');
			} else if (result.status == false) {
				utilities.genricPopup(result.error.message,'info');
			}
			Main.HideLoading();
		},
		error: function (e) {	
			Main.HideLoading();		
			utilities.responseErrorCheck(errObj);
		},
		timeout: 60000
	});
}

Main.updatePassword = function (oldOne, newOne) {
	Main.ShowLoading();
	data = JSON.stringify({
		"oldPassword": oldOne,
		"newPassword": newOne
	});
	Yup.ajax({
		url: Main.mainApi + "/service/api/auth/change/password",
		type: "POST",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},
		data: data,
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			var result = JSON.parse(data);
			if (result.status == true) {
				Main.popupData ={
					popuptype : 'info',
					message : result.response.message,
					buttonCount : 1,
					yesText : 'Okay',
					yesTarget : 'navigateBack',
					onBack : 'navigateBack'
				}
				Yup("#popUpFDFS").html(Util.showPopup());
				Yup("#popup-btn-1").addClass('popupFocus');	
			} else if (result.status == false) {
				utilities.genricPopup(result.error.message,'info');
			}
			Main.HideLoading();
		},
		error: function (errObj) {	
			Main.HideLoading();		
			utilities.responseErrorCheck(errObj);
		},
		timeout: 60000
	});
}

Main.requestSignUpV2 = function () {
	var api_toCall;
	var num = Main.mobileCode +tempObjectData.mobileNo;	
	var data = JSON.stringify({
		"password": tempObjectData.password,
		"mobile": num,
	});
	var paramData;
	if (systemConfigs.configs.encryptAuthApi == "true") {
		api_toCall = "/service/api/v1/send";
		d = Main.encryptData(data);
		m = Main.encryptData(JSON.stringify({ "request": "signup" }));
		paramData = JSON.stringify({
			'data': d,
			'metadata': m,
		})
	} else {
		api_toCall = "/service/api/auth/v2/signup";
		paramData = data;
	}
	Main.ShowLoading();
	Yup.ajax({
		url: Main.mainApi + api_toCall,
		type: "POST",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},
		data: paramData,
		contentType: "application/json; charset=utf-8",
		success: function (responsedata) {
			if (systemConfigs.configs.encryptAuthApi == "true") {
				var info = JSON.parse(responsedata);
				var result = Main.decryptData(info.data);
				result = JSON.parse(result);
			} else {
				var result = JSON.parse(responsedata);
			}
			if (result.status == false) {
				if (result.error.code == -40) {	//otp required to create Account									
					tempObjectData.context = 'signup';
					tempObjectData.registationRefaranceID = result.error.details.referenceId;	
					Main.sendOTP();	
					Main.HideLoading();
				} else {	//some other error occured.
					utilities.genricPopup(result.error.message,'info');
					Main.HideLoading();
				}
			} else {  //account create with out OTP verification
				Main.userProfile.cardStatus = result.response.cardStatus;
				Main.userProfile.email = result.response.email;
				Main.userProfile.emailStatus = result.response.isEmailVerified;
				Main.userProfile.mobile = result.response.phoneNumber;
				Main.userProfile.mobileStatus = result.response.isPhoneNumberVerified;
				Main.userProfile.name = result.response.name;
				Main.userProfile.userId = result.response.userId;
				Main.userProfile.userStatus =true;	
				Main.userProfile.languages = result.response.languages;
				tempObjectData = {};		
				Main.HideLoading();	
				tempObjectData.signUpMsg = result.response.message;
				view = 'signinSuccess';
				Main.processNext();
			}
		},
		error: function (errObj) {
			Main.HideLoading();		
			utilities.responseErrorCheck(errObj);
		},
		timeout: 60000
	});
}

Main.completeRegistation = function (OTP) {

	var num = Main.mobileCode +tempObjectData.mobileNo;	
	var data = JSON.stringify({
		"reference_id": parseInt(tempObjectData.registationRefaranceID),
		"mobile": num,
		"otp": parseInt(OTP),
	});

	Yup.ajax({
		url: Main.mainApi + "/service/api/auth/v2/signup/complete",
		type: "POST",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},
		data: data,
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			result = JSON.parse(data);
			if (result.status == true) {
				Main.userProfile.cardStatus = result.response.cardStatus;
				Main.userProfile.email = result.response.email;
				Main.userProfile.emailStatus = result.response.isEmailVerified;
				Main.userProfile.mobile = result.response.phoneNumber;
				Main.userProfile.mobileStatus = result.response.isPhoneNumberVerified;
				Main.userProfile.name = result.response.name;
				Main.userProfile.userId = result.response.userId;
				Main.userProfile.userStatus =true;
				Main.userProfile.languages = result.response.languages;
				Main.HideLoading();
				tempObjectData = {};
				tempObjectData.signUpMsg = result.response.message;
				view = 'signinSuccess';
				Main.processNext();
			} else if (result.status == false) {
				if (result.error.code == "-203") {
					utilities.genricPopup(result.error.message,'info');
					Main.HideLoading();
				} else {
					utilities.genricPopup(result.error.message,'info');
					Main.HideLoading();
				}
			}
		},
		error: function (e) {
			Main.HideLoading();		
			utilities.responseErrorCheck(errObj);
		},
		timeout: 60000
	});
}

Main.updateLanguagePreference =function(lang){
	Main.ShowLoading();
	data = JSON.stringify({
		"selected_lang_codes": lang		
	});
	Yup.ajax({
		url: Main.mainApi + "/service/api/auth/update/session/preference",
		type: "POST",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},
		data: data,
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			var result = JSON.parse(data);
			if (result.status == true) {
				Main.userProfile.languages =lang;	
				utilities.refreshAllbackData();			
				if(intiLangSel==true) {
					intiLangSel=false;
					Main.apiCall(firstMenu)
				}else{
					utilities.genricPopup(result.response.message,'info');
				}
			} else if (result.status == false) {
				utilities.genricPopup(result.error.message,'info');
			}
			Main.HideLoading();
		},
		error: function (errObj) {	
			Main.HideLoading();		
			utilities.responseErrorCheck(errObj);
		},
		timeout: 60000
	});
}

Main.updateContinueWatchingData = function(){
	Main.ShowLoading();		
	var headerJ = {
		"tenant-code": Main.tenantCode,
		"box-id": Main.getBOXID(),
		"session-id": Main.getSessionID()
	};	
	Yup.ajax({
		url: Main.mainApi + "/service/api/v1/section/data?path=" + presentPagedetails.targetPath + '&code=continue_watching&offset=-1&count=12',
		type: 'GET',
		headers: headerJ,			
		success: function (data) {
			var result = JSON.parse(data);
			if (result.status == true) {
				if (result.response[0].data.length > 0) {
					var matchFound = false;
					for (var i = 0; i < presentPagedetails.sections.length; i++) {
						if (presentPagedetails.sections[i].sectionInfo.code == 'continue_watching') {

							//previous focus element
							var focusedElement = Yup('.imageFocus').attr("id");
							var splitData = focusedElement.split('-');
							var splitData = splitData[1];

							presentPagedetails.sections[i].sectionData.data = [];
							presentPagedetails.sections[i].sectionData.data = result.response[0].data;
							presentPagedetails.sections[i].sectionControls.dataLength = result.response[0].data.length;
							Yup("#section-"+i+" .section-horizontal").html("");
							Yup('#section-horizontal-'+i).css("left","75px");
							var Text = '';
							var viewAllId = '';
							for (var j = 0; j < presentPagedetails.sections[i].sectionData.data.length; j++) {
								Text += Util.getCard(presentPagedetails.sections[i].sectionData.data[j], 'sectionItem-' + i + '-' + j);
								viewAllId = 'sectionItem-' + i + '-' + (j + 1);
							}
							if (presentPagedetails.sections[i].sectionControls.showViewAll == true) {
								presentPagedetails.sections[i].sectionControls.dataLength=(presentPagedetails.sections[i].sectionControls.dataLength+1);
								Text += Util.getViewAllCard(presentPagedetails.sections[i], viewAllId);
							}
							
							Yup("#section-"+i+" .section-horizontal").append(Text);
							if(presentPagedetails.sectionIndex && presentPagedetails.sectionIndex[i]){
								presentPagedetails.sectionIndex[i] =0;
							}
							if(splitData == i ){
								Yup("#sectionItem-"+i+"-0").addClass('imageFocus');
							}
							matchFound = true;
							break;
						}					
					}
					//if continue watching session data avilbale , but previously no continue watching session avilable.
					if(matchFound == false){
						presentPagedetails.pageReload = true;
					}
				}
			} else {
				Main.HideLoading();
			} 
		},
		error: function (errObj) {				
			Main.HideLoading();
		},
		timeout: 60000
	});
}

//fav add and remove
Main.addToFav=function(path,action){
	Yup.ajax({
		url: Main.mainApi + "/service/api/auth/user/favourite/item?path="+path+"&action="+action,
		type: "GET",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},		
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			
		},
		error: function (errObj) {	
		
		},
		timeout: 60000
	});
}

Main.verifyOtpGenral=function(){
	Main.ShowLoading();	
	var data = JSON.stringify({
		"target_type": "mobile",
		"context": "verify_mobile"
	  })
	Yup.ajax({
		url: Main.mainApi + "/service/api/auth/user/get/otp",
		type: "POST",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},
		data:data,		
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			result = JSON.parse(data);
			Main.HideLoading();	
			if(result.status == true){
				tempObjectData.referenceId = result.response.referenceId;
				tempObjectData.context = "verify_mobile";
				view = 'signupOtpVerification';
				Main.processNext();
			}else{
				if(result.error && result.error.message ){
					utilities.genricPopup(result.error.message,'info');						
				}else{
					utilities.genricPopup('Something Went Wrong','unknown');
				}
			}
		},
		error: function (errObj) {	
			Main.HideLoading();		
			utilities.responseErrorCheck(errObj);
		},
		timeout: 60000
	});
}

Main.verifyOtp=function(otp){
	Main.ShowLoading();	
	var data = {"context": (tempObjectData.context == 'login') ? 'signin' : tempObjectData.context,"otp":parseInt(otp)};
	if(!!tempObjectData.isMobile){data["mobile"]= Main.mobileCode +tempObjectData.mobileNo}
	else{data["email"]=tempObjectData.mobileNo}
	Yup.ajax({
		url: Main.mainApi + "/service/api/auth/verify/otp",
		type: "POST",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},
		data:data,		
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			result = JSON.parse(data);
			Main.HideLoading();	
			if(result.status == true){
				utilities.settingUserData(result);
				tempObjectData = {};
				Main.apiCall(firstMenu);
			}else{
				if(result.error && result.error.message ){
					utilities.genricPopup(result.error.message,'info');						
				}else{
					utilities.genricPopup('Something Went Wrong','unknown');
				}
			}
		},
		error: function (errObj) {	
			Main.HideLoading();		
			utilities.responseErrorCheck(errObj);
		},
		timeout: 60000
	});
}

Main.verifyMobile=function(otp){
	Main.ShowLoading();
	var data = JSON.stringify({
		"mobile": Main.userProfile.mobile,
		"otp": parseInt(otp)
	  })
	Yup.ajax({
		url: Main.mainApi + "/service/api/auth/verify/mobile",
		type: "POST",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},
		data:data,		
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			Main.HideLoading();
			result = JSON.parse(data);	
			if(result.status == true){
				tempObjectData={};
				Main.popupData ={
					popuptype : 'info',
					message : result.response.message,       
					buttonCount : 1,
					yesText : 'Okay',
					yesTarget : 'navigateBack',
					onBack : 'navigateBack'
				}
				Yup("#popUpFDFS").html(Util.showPopup());	
				Yup("#popup-btn-1").addClass('popupFocus');
			}else{
				if(result.error && result.error.message ){
					utilities.genricPopup(result.error.message,'info');						
				}else{
					utilities.genricPopup('Something Went Wrong','unknown');
				}
			}
		},
		error: function (errObj) {	
			Main.HideLoading();		
			utilities.responseErrorCheck(errObj);
		},
		timeout: 60000
	});
}

//get TV guide channels
Main.getTvguideChannelsList=function(){
	Yup.ajax({
		url: Main.mainApi + "/service/api/v1/tvguide/channels",
		type: "GET",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},		
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			result = JSON.parse(data);
			presentPagedetails.paginationSections = [];
			if(result.status==true){
				presentPagedetails.tvGuideChannelsData = result.response;
				if(result.response.data.length > 0){
					for(var i=0; i < result.response.data.length;i++){
						presentPagedetails.paginationSections.push(result.response.data[i].id);	
					}
					for(var i=0;i< presentPagedetails.tvGuideChannelsData.tabs.length;i++){
						if(presentPagedetails.tvGuideChannelsData.tabs[i].isSelected == true) {
							presentPagedetails.selectedDate = presentPagedetails.tvGuideChannelsData.tabs[i];
							break;
						}
					} 
					Yup("#mainContent").html(Util.tvGuideDatesHtml(presentPagedetails));
					keyHandlar.menuActiveHandular();	
					Main.getTvguideData(presentPagedetails.paginationSections.slice(0,6));
					presentPagedetails.paginationSections = presentPagedetails.paginationSections.slice(6,presentPagedetails.paginationSections.length);
				}
				else{
					//NO DATA FOUND IN CONTENT PAGE
					Yup("#mainContent").append(Util.noDataFound());
				}
			}
			else{
				utilities.genricPopup(result.error.message,'info');
			}
			Main.HideLoading();
		},
		error: function (errObj) {
			Main.HideLoading();		
			utilities.responseErrorCheck(errObj);	
		},
		timeout: 60000
	});
}

//get Next Videos
Main.getNextVideo=function(targetPath){
	Yup.ajax({
		url: Main.mainApi + "/service/api/v1/next/videos?path="+targetPath+"&count=1",
		type: "GET",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},		
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			result = JSON.parse(data);
			if(result.status==true){
				//presentPagedetails.nextVideoDetails=result.response.data;
			}
			Main.HideLoading();
			Player.callingPlayer();
		},
		error: function (errObj) {	
			Main.HideLoading();	
			Player.callingPlayer();	
		},
		timeout: 60000
	});
}

//tv Guide channels Data
Main.getTvguideData= function(channelsIds){	
	Main.ShowLoading();
	var initRequest = (presentPagedetails.paginationSectionsData.length == 0) ? true : false;
	Yup.ajax({
		url: Main.mainApi + "/service/api/v1/static/tvguide?channel_ids="+channelsIds.join()+"&start_time="+presentPagedetails.selectedDate.startTime+"&end_time="+presentPagedetails.selectedDate.endTime,
		type: "GET",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},		
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			result = JSON.parse(data);
			if(result.status==true){
				if(result.response.data.length > 0){
			
					for(var i=0; i < result.response.data.length;i++){
						if(result.response.data[i].programs.length > 0){
							result.response.data[i].programs[0].target.pageAttributes.startTime = presentPagedetails.selectedDate.startTime;
							result.response.data[i].programs[result.response.data[i].programs.length-1].target.pageAttributes.endTime = presentPagedetails.selectedDate.endTime;
						}
						presentPagedetails.paginationSectionsData.push(result.response.data[i]);	
					}
				}
				Util.tvguide(result.response.data);		
				if(1==1) {
					Main.HideLoading();	
					if(presentPagedetails.selectedDate.isToday == true && initRequest == true){
						keyHandlar.navigateLiveBar(); 
					}else if (presentPagedetails.selectedDate.isToday != true){
						keyHandlar.hideLiveTag();
						if(!!liveSubscribe){
							clearInterval(liveSubscribe);
						}
					
					}					
				}
			}
			else{	
				Main.HideLoading();			
			}
		
		},
		error: function (errObj) {
			Main.HideLoading();	
		},
		timeout: 60000
	});
}

//get Template Data
Main.getTemplateData=function(templateCode,targetPath){
	Main.ShowLoading();
	Yup.ajax({
		url: Main.mainApi + "/service/api/v1/template/data?template_code="+templateCode+"&path="+targetPath,
		type: "GET",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},		
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			result = JSON.parse(data);
			Main.HideLoading();
			if(result.status==true){
				presentPagedetails.templateData={
					templateCode:result.response.templateCode,
					tembutns:[]
				};
				for(var i=0;i < templateCodeInfo.rows.length;i++){
					for(var j=0;j < templateCodeInfo.rows[i].templateElements.length;j++){
						if(templateCodeInfo.rows[i].templateElements[j].elementType == "image"){
							presentPagedetails.templateData[templateCodeInfo.rows[i].templateElements[j].elementCode] = { "displayCondition" : result.response.data[templateCodeInfo.rows[i].templateElements[j].displayCondition.replace("key:","")] ,"data" : Util.getImages(result.response.data[templateCodeInfo.rows[i].templateElements[j].elementCode]) }
						}
						else if(templateCodeInfo.rows[i].templateElements[j].elementType == "description"){
							presentPagedetails.templateData[templateCodeInfo.rows[i].templateElements[j].elementCode] = { "displayCondition" : result.response.data[templateCodeInfo.rows[i].templateElements[j].displayCondition.replace("key:","")] ,"data" : result.response.data[templateCodeInfo.rows[i].templateElements[j].elementCode] }
						}
						else if(templateCodeInfo.rows[i].templateElements[j].elementType == "text" && templateCodeInfo.rows[i].templateElements[j].elementSubtype == "title"){
							presentPagedetails.templateData[templateCodeInfo.rows[i].templateElements[j].elementSubtype] = { "displayCondition" : result.response.data[templateCodeInfo.rows[i].templateElements[j].displayCondition.replace("key:","")] ,"data" : result.response.data[templateCodeInfo.rows[i].templateElements[j].elementCode] }
						}
						//for subtitle, 1 , 2 , 3 ,4 we are considering 
						else if(templateCodeInfo.rows[i].templateElements[j].elementType == "text" && templateCodeInfo.rows[i].templateElements[j].elementSubtype != "title"){
							presentPagedetails.templateData[templateCodeInfo.rows[i].templateElements[j].elementCode] = { "displayCondition" : result.response.data[templateCodeInfo.rows[i].templateElements[j].displayCondition.replace("key:","")] ,"data" : result.response.data[templateCodeInfo.rows[i].templateElements[j].elementCode] }
						}
						// mapping all types aof buttons like watchlive ,watchnow, browseepisodes, resume, startorver, watchlatestepisode,....
						else if(templateCodeInfo.rows[i].templateElements[j].elementType == "button" && templateCodeInfo.rows[i].templateElements[j].elementSubtype != "form-field" && (templateCodeInfo.rows[i].templateElements[j].elementCode != 'startover_live' && templateCodeInfo.rows[i].templateElements[j].elementCode != 'startover_past')){
							presentPagedetails.templateData.tembutns.push({ "displayCondition" : result.response.data[templateCodeInfo.rows[i].templateElements[j].displayCondition.replace("key:","")] ,"data" : result.response.data[templateCodeInfo.rows[i].templateElements[j].elementCode] ,"target" : result.response.data[templateCodeInfo.rows[i].templateElements[j].target.replace("key:","")],"seekedValue" : result.response.data.watchedPosition,'name':templateCodeInfo.rows[i].templateElements[j].elementSubtype});
						}
						//  startover_live' , startover_past' buttons
						else if(templateCodeInfo.rows[i].templateElements[j].elementType == "button" && templateCodeInfo.rows[i].templateElements[j].elementSubtype != "form-field" && (templateCodeInfo.rows[i].templateElements[j].elementCode == 'startover_live' || templateCodeInfo.rows[i].templateElements[j].elementCode == 'startover_past')){
							presentPagedetails.templateData.tembutns.push({ "displayCondition" : result.response.data[templateCodeInfo.rows[i].templateElements[j].displayCondition.replace("key:","")] ,"data" : templateCodeInfo.rows[i].templateElements[j].data,"target" : result.response.data[templateCodeInfo.rows[i].templateElements[j].target.replace("key:","")],'name':templateCodeInfo.rows[i].templateElements[j].elementCode});
						}
						//  commenting record ,delete,Extend Expiration Dates Butns Now
						// else if(templateCodeInfo.rows[i].templateElements[j].elementType == "button" && templateCodeInfo.rows[i].templateElements[j].elementSubtype == "form-field"){
						// 	presentPagedetails.templateData.tembutns.push({ "displayCondition" : result.response.data[templateCodeInfo.rows[i].templateElements[j].displayCondition.replace("key:","")] ,"data" : templateCodeInfo.rows[i].templateElements[j].data,"target" : templateCodeInfo.rows[i].templateElements[j].target,'name':templateCodeInfo.rows[i].templateElements[j].elementCode});
						// }
					}
				}			
				Yup("#mainContent").append(Util.showTemplate());
				Yup('.templateOverlay').animate({height : 600 },200);
			}	
		},
		error: function (errObj) {	
			Main.HideLoading();		
		},
		timeout: 60000
	});
}

//get Template List
Main.getTemplates=function(){
	Main.ShowLoading();
	Yup.ajax({
		url: Main.mainApi + "/service/api/v1/templates",
		type: "GET",
		headers: {
			"tenant-code": Main.tenantCode,
			"box-id": Main.getBOXID(),
			"session-id": Main.getSessionID(),
		},		
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			result = JSON.parse(data);
			if(result.status==true){
				templateList=result.response;
			}
			Main.HideLoading();
		},
		error: function (errObj) {	
			Main.HideLoading();		
		},
		timeout: 60000
	});
}




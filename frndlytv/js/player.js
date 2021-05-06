var Player = {};
var media = -1;
var mediaContainer = -1;
var mediaPlugin = -1;
var fullResolution = ['0%', '0%', '100%', '100%'];
var showsuggestionsTimer;
var showrunTime;
var seekPositionTime;
var isItSeekIn=false;
var seekingTime=0;
var isNetworkError = false;
var eventIdBuffer = '';
var set =0;

Player.callingPlayer = function(){
	Yup("#mainContent").html(Util.playerBody());
	Yup("#mainContent").show();	
	Yup("#play-but").hide();
	(presentPagedetails.nextVideoDetails.length>0) && (Yup('#playnextbtn').css("display",'block'));
	Main.HideLoading();
	(!!presentPagedetails.steamResponse.streams[0].keys.licenseKey) && (playreadyurl=presentPagedetails.steamResponse.streams[0].keys.licenseKey);
	Player.playStream(presentPagedetails.steamResponse.streams[0].url);
	if(presentPagedetails.isResume==true) media.seekTo(presentPagedetails.steamResponse.streamStatus.seekPositionInMillis);
}

Player.playStream = function (url) {
	try {
		media.stop();
		media.unsetListener();
	}
	catch (e) { }
	Main.playerShowLoading();
	analytics.setMetaData(url);
	Player.intialPlaying=true;
	Player.playerState='idle';
	isNetworkError = false;
	analytics.plugin.thumbnailVideoClick();
	analytics.plugin.handlePlayerLoad();
	media = toast.Media.getInstance();
	var drmOptions = '', mediaPlugin = '';
	if (url.indexOf('mpd') != -1) {
		drmOptions = window.getMediaOption();
		mediaPlugin = new toast.MediaPluginPlayReady(drmOptions);
		if (device.platform == "orsay")
			url.append("|COMPONENT=HAS|DRM_TYPE=WMDRM");
	}
	set = 0;
	media.resetPlugin();
	media.attachPlugin(mediaPlugin);
	media.open(url);
	Player.construct();
	utilities.refreshContinueWatching();
}

Player.construct = function () {
	mediaContainer = media.getContainerElement();
	mediaContainer.id = "playerHTML5";
	mediaContainer.style.position = 'fixed';
	mediaContainer.style.left = fullResolution[0];
	mediaContainer.style.top = fullResolution[1];
	mediaContainer.style.width = fullResolution[2];
	mediaContainer.style.height = fullResolution[3];
	document.getElementById("mainContent").appendChild(mediaContainer);
	Player.showPlayerDetails();
	media.syncVideoRect(); //for supporting 2013's sectv-orsay
	media.setListener({
		onevent: function (evt) {
			switch (evt.type) {
				case 'STATE':
					if (evt.data.state == 'IDLE') {
						Yup("#playerBackImg").hide();
						Main.playerHideLoading();
						Player.playerState = "idle";						
					}
					else if(evt.data.state == 'PAUSED'){
						Yup("#playerBackImg").hide();
						Main.playerHideLoading();
						Player.playerState = "paused";
						if(!!Player.bufferEvent){
							Player.bufferEvent=false;
							analytics.plugin.handleBufferEnd();
						}
					}
					else if (evt.data.state == 'PLAYING') {
						Yup("#playerBackImg").hide();
						Main.playerHideLoading();
						Yup("#play-but").hide();
						Yup('#playPauseIcon').addClass("pauseIcon");
						Yup('#playPauseIcon').removeClass("playIcon");
						Player.playerState = "playing";
						isNetworkError = false;
						if(!!Player.bufferEvent){
							Player.bufferEvent=false;
							analytics.plugin.handleBufferEnd();
						}
						var totalTrackInfo = webapis.avplay.getTotalTrackInfo();
						var currentStreamiNFO = webapis.avplay.getCurrentStreamInfo();
						var abilableBitrates = webapis.avplay.getStreamingProperty ("AVAILABLE_BITRATE") ;	
						
						// if(set == 0){
						// 	Player.setBitrate(467000,800000) ;
						// 	set = 1;
						// }
					

						if(!!Player.intialPlaying && presentPagedetails.isResume!=undefined) (Player.intialPlaying=false,analytics.plugin.handleSeek({ STPosition: 0, ETPosition: presentPagedetails.steamResponse.streamStatus.seekPositionInMillis}));
					}
					if ( (evt.data.oldState != 'STALLED' &&  evt.data.oldState !='PAUSED')  && (evt.data.state == 'STALLED' || evt.data.state == 'IDLE' )) {
						Yup("#playerBackImg").hide();
						Player.playerState = "buffering";
						Player.HandleBufferingEvent(); 
					}
					else if ( (evt.data.oldState == 'STALLED' || evt.data.oldState =='IDLE') && evt.data.state != 'STALLED') {
						Yup("#playerBackImg").hide();
						Main.playerHideLoading();
						if(evt.data.state == 'PAUSED' ) { Player.playerState = "paused" }
						else if(evt.data.state == 'PLAYING' ) { Player.playerState = "playing" }						
						if(!!Player.bufferEvent){
							Player.bufferEvent=false;
							analytics.plugin.handleBufferEnd();
						}
					}
					break;
				case 'DURATION':
					Main.playerHideLoading();
					if (presentPagedetails.steamResponse.analyticsInfo.contentType !="live") {
						document.getElementById('seek-picker-end').innerHTML = utilities.getTimeHMS(evt.data.duration);
						Player.duration = evt.data.duration;
					} 
					if(!!Player.bufferEvent){
						Player.bufferEvent=false;
						analytics.plugin.handleBufferEnd();
					}
						analytics.plugin.handlePlayStarted();
					    break;
				case 'POSITION':
					Main.playerHideLoading();
					if (presentPagedetails.steamResponse.analyticsInfo.contentType !="live"){
						if(isItSeekIn==false) {
							Player.seekPosition(evt.data.position);
							 Player.currentPlayingSeekTime=evt.data.position;
						}else{
							Player.seekStartTime(evt.data.position);
						}
					}
					if(Player.playerState == 'buffering' && Yup("#play-but").css("display")=="none"){
						Player.playerState = "playing";
						if(!!Player.bufferEvent){
							Player.bufferEvent=false;
							analytics.plugin.handleBufferEnd();
						}
					}
					Yup("#playerBackImg").hide();
					break;
				case 'BUFFERINGPROGRESS':
					Main.playerShowLoading();
					Player.playerState = 'buffering';
					Player.HandleBufferingEvent();
					media._containerElem.hidden = false;
					break;
				case 'ENDED':
					Main.playerHideLoading();
					Player.playerState = "complete";
					analytics.plugin.handlePlayCompleted();
					Main.previousPage();
					break;
			}
		},
		onerror: function (err) {
			Main.playerShowLoading();
			setTimeout( function() {
				Main.playerHideLoading();
				if(checknetworkType==false){
					if(presentPagedetails.steamResponse.analyticsInfo.contentType !="live"){ // content plating is a video content
						Player.pause(); // player pause
						Main.popupData ={
							popuptype : 'netWorkError',
							message : "Trouble connecting to Internet, Please Try again Later.",       
							buttonCount : 1,
							yesText : 'Okay',
							yesTarget : 'close',
							onBack : 'close'
						}
						isNetworkError = true;
						Yup("#popUpFDFS").html(Util.showPopup());	
						Yup("#popup-btn-1").addClass('popupFocus');
					}else{  // content playing is LIVe
						Main.popupData ={
							popuptype : 'netWorkError',
							message : "Trouble connecting to Internet, Please Try again Later.",       
							buttonCount : 1,
							yesText : 'Okay',
							yesTarget : 'navigateBackFromPlayer',
							onBack : 'navigateBackFromPlayer'
						}
						isNetworkError = false;
						Yup("#popUpFDFS").html(Util.showPopup());	
						Yup("#popup-btn-1").addClass('popupFocus');
					}
				
				}else{ // media error
					Main.popupData ={
						popuptype : 'playerError',
						message : "MediaError is occured - "+err.data.code,       
						buttonCount : 1,
						yesText : 'Okay',
						yesTarget : 'navigateBackFromPlayer',
						onBack : 'navigateBackFromPlayer'
					}
					Yup("#popUpFDFS").html(Util.showPopup());	
					Yup("#popup-btn-1").addClass('popupFocus');
					analytics.plugin.handleError({ errorMsg:"MediaError is occured - "+err.data.code });
				}		
			},3000);
		}
	});
	Main.HideLoading();
	media.play();	
}

// For analytics getting player current position
Player.getPlayerPosition=function() {
	return media.getCurrentPosition();
}

// player play/pause keyhandler functionality
Player.playOrPause = function () {

	if(isNetworkError == true){
		if(checknetworkType == true){ //no network error
			isNetworkError = false;
			Player.playStream(presentPagedetails.steamResponse.streams[0].url);
			media.seekTo(Player.currentPlayingSeekTime);			
			return;
		}else{ //still network issue
			Player.pause(); // player pause
			Main.popupData ={
				popuptype : 'netWorkError',
				message : "Trouble connecting to Internet, Please Try again Later.",       
				buttonCount : 1,
				yesText : 'Okay',
				yesTarget : 'close',
				onBack : 'close'
			}
			isNetworkError = true;
			Yup("#popUpFDFS").html(Util.showPopup());	
			Yup("#popup-btn-1").addClass('popupFocus');
			return;
		}
	}
	Main.playerHideLoading();
	if (Yup("#play-but").css("display")=="none") {
		Player.pause();
		analytics.plugin.handlePause();
		//You don't have to call setScreenSaver Method. It is configurated by toast.avplay.
	}
	else if (Yup("#play-but").css("display")=="block") {
		Player.play();
		analytics.plugin.handleResume();
		//You don't have to call setScreenSaver Method. It is configurated by toast.avplay.
	}
}

// player pause functionality
Player.pause = function(){
	media.pause();
	Player.playerState = "paused";	
	Yup("#play-but").show();
	Yup('#playPauseIcon').addClass("playIcon");
	Yup('#playPauseIcon').removeClass("pauseIcon");
}

// player play functionality
Player.play = function(){
	media.play();
	Player.playerState = "playing";
	Yup('#playPauseIcon').addClass("pauseIcon");
	Yup('#playPauseIcon').removeClass("playIcon");
	Yup("#play-but").hide();
}

// hideing player controllers
Player.hidePlayerDetails = function(){
	Yup("#vod-title").hide();
	Yup("#seekbar").hide();
	Yup(".playSugestions").hide();
	Yup('#playerButtons').hide();
	Yup("#seek-picker-runtime").hide();
	Yup("#favText").hide();
	Yup(".upArrow").hide();
	Yup(".downArrow").hide();
	Yup(".player_bottom_gradient").hide();
	clearTimeout(showsuggestionsTimer);
	presentPagedetails.constrolsShow = false;
}

// enable player controllers
Player.showPlayerDetails = function(){
	if(presentPagedetails.constrolsShow == false || !presentPagedetails.constrolsShow ) {
		//adding focus to seekbar
		Yup(".imageFocus").removeClass("imageFocus");	
		Yup(".visible").removeClass("visible"); 
		if (presentPagedetails.steamResponse.analyticsInfo.contentType !="live") {
			// Yup("#seekbar").show();
			// Yup('#playerButtons').show();
			// if(Player.playerState == "paused"){
			// 	Yup("#playPauseIcon").addClass("imageFocus");
			// }else{
			// 	Yup("#seekbar").addClass("imageFocus");
			// }
			Yup("#seekbar").addClass("imageFocus");
		}else{
			Yup(".vod-title").addClass("imageFocus");
		}	
		
		for(var i=0;i<presentPagedetails.sections.length;i++){
			Yup("#section-"+i).show();
		}
		Player.showControls();
	}	
	// Yup(".playSugestions").show();
	presentPagedetails.constrolsShow = true;
	clearTimeout(showsuggestionsTimer);
	showsuggestionsTimer = setTimeout( Player.hidePlayerDetails,10000 );
}

// player showControls
Player.showControls = function(){
	Yup(".upArrow").show();
	Yup(".downArrow").hide();
	Yup(".playSugestions").hide();
	Yup("#vod-title").show();
	if (presentPagedetails.steamResponse.analyticsInfo.contentType !="live") {
		Yup("#seekbar").show();
		Yup('#playerButtons').show();
		Yup(".player_bottom_gradient").show();
	}
}

// player showSuggsnControls
Player.showSuggsnControls = function(){
	Yup(".upArrow").hide();
	Yup(".downArrow").show(); 
	Yup(".playSugestions").show();
	Yup("#vod-title").hide();
	Yup("#seekbar").hide();
	Yup('#playerButtons').hide();
	Yup(".player_bottom_gradient").hide();
}

// playing seeking bar controlling  
Player.seekTo = function(nav,action) {
	if(Yup('#playerLoading').css('display')=='none'){
	isItSeekIn=true;
		var seekTime;
		if (!!action) {
			seekTime = 40000;
		} else {
			seekTime = 20000;
		}
		var curPos = media.getCurrentPosition();
		var finalValue ;
		if (nav == 'prev') {			
			seekingTime=seekingTime-seekTime;
			finalValue=curPos+seekingTime;
			if(finalValue < 0){
				finalValue = 0;	
				seekingTime=seekingTime+seekTime;			
			}
		}
		else if (nav == 'next') {
			seekingTime=seekingTime+seekTime;
			finalValue=curPos+seekingTime;
			if(finalValue > Player.duration){
				finalValue = Player.duration -5;		
				seekingTime=seekingTime-seekTime;	
			}		
		}	

		document.getElementById('seekbar-run').style.width = (finalValue * 99 / Player.duration) + '%';
		Yup('#seek-picker').css("left", ((finalValue * 99 / Player.duration)-1) + '%');
		document.getElementById('seek-picker-runtime').innerHTML = utilities.getTimeHMS(finalValue);
		Yup('#seek-picker-runtime').css("left", ((finalValue * 99 / Player.duration) - 1) + '%');
		Yup("#seek-picker-runtime").show();

		clearTimeout(seekPositionTime);
		seekPositionTime = setTimeout(function () {
			Main.playerShowLoading();
			Player.playerState = 'buffering';
			Player.HandleBufferingEvent();
			analytics.plugin.handleSeek({ STPosition: curPos, ETPosition: finalValue});
			media.seekTo(finalValue);
			seekingTime=0;
			isItSeekIn=false;
			Yup("#seek-picker-runtime").hide();
		}, 1000);
	}
}

// when playing have to set the seek controllers value automatically
Player.seekPosition = function(seekTime){
	document.getElementById('seekbar-run').style.width = (seekTime * 99 / Player.duration) + '%';
	Yup('#seek-picker').css("left", ((seekTime * 99 / Player.duration)-1) + '%');
	Player.seekStartTime(seekTime);
	if(!Player.airMouseHover || Player.airMouseHover== false){
		document.getElementById('seek-picker-runtime').innerHTML = utilities.getTimeHMS(seekTime);
		Yup('#seek-picker-runtime').css("left", ((seekTime * 99 / Player.duration) - 1) + '%');
		Yup("#seek-picker-runtime").hide();
	}
}

// player seek start time display purpose
Player.seekStartTime=function(seekTime){
	document.getElementById('seek-picker-start').innerHTML = utilities.getTimeHMS(seekTime);
}

// With airmouse using controllers handler 
Player.progressIconHandle=function(event, action,id) {
	var source = Yup('#'+id).attr("source");
	switch (action) {
		case 'over':
		Player.airMouseHover=true;
		Player.showPlayerDetails();
		if(source == 'favourites'){
			Yup("#favText").show();
		}
		if(source=='seekbar'){
			Yup("#seek-picker-runtime").show();
			Player.seekOver(event);
		}
			break;
		case 'out':
		  Player.airMouseHover=false;
		  Yup("#favText").hide();
			break;
		case 'click':
			if(source=='playBtn'){
				Player.playOrPause();
			}else{
				if (presentPagedetails.constrolsShow == false) {
					Player.showPlayerDetails();
					return;
				}
				if(source=='seekbar'){
					Player.seekOver(event);
				}
				else{
					keyHandlar.playEnterKeydown(id);
				}
			}
			break;
		case 'down':
			break;
		default:
			break;
	}
}

// When Hover on seekbar with airmouse
Player.seekOver=function(event) {
	var x = event.clientX - Yup('#seekbar').position().left;
	var totalWidth = Yup("#seekbar").width();
	var seekPercent = ((x) / totalWidth);
	var pos = seekPercent * Player.duration;
	if (x > 0 && x <= totalWidth) {
		Yup("#seek-picker-runtime").css("left", (x));
		Yup("#seek-picker-runtime").html(utilities.getTimeHMS(pos));
		if(event.type=='click'){
			Main.playerShowLoading();
			Player.playerState = 'buffering';
			Player.HandleBufferingEvent();
			media.seekTo(pos);
		}
	}
	else
		Yup("#seek-picker-runtime").hide();
}


Player.HandleBufferingEvent =function(){
	if(eventIdBuffer == ''){
		eventIdBuffer = setTimeout(function() {
			if(Player.playerState=='buffering'){
				Player.bufferEvent=true;
				eventIdBuffer = '';
				analytics.plugin.handleBufferStart();
			}else{
				eventIdBuffer = '';
			}
		},1000);
	}
}


Player.setBitrate = function(from, to, start, skip) {
	var bitrates = '|BITRATES=' + from + '~' + to;
	var currentTime;
	if (start !== '' && start !== undefined) {
			bitrates += '|STARTBITRATE=' + start;
	}
	if (to !== '' && to !== undefined) {
			bitrates += '|SKIPBITRATE=' + skip;
	}
	try {
			if (Player.playerState === 'playing' || Player.playerState === 'paused') {
					currentTime = webapis.avplay.getCurrentTime();
					webapis.avplay.stop();
					webapis.avplay.setStreamingProperty('ADAPTIVE_INFO', bitrates);
					webapis.avplay.prepareAsync(
							function onSuccess() {
									webapis.avplay.play();
									webapis.avplay.seekTo(currentTime);
							},
							function onError() {
									throw new Error('Something went wrong while starting player with new bitrate');
							}
					);
			} else {
					webapis.avplay.setStreamingProperty('ADAPTIVE_INFO', bitrates);
			}
	} catch (error) {
			console.log('Failed setting bitrates: ' + error.message);
	}
}

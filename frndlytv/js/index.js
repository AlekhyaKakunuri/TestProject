
//for test
//var getJsonPath =  "https://paas-init.revlet.net/clients/frndlytv/init/test/frndlytv-beta.json"; // beta 1
//var getJsonPath =  "http://paas-init.revlet.net/clients/frndlytv/init/test/frndlytv-beta2.json";  //beta 2
//var analyticsUrl="http://119.81.201.168:8081/sdk/validation?analytics_id=";

//var getJsonPath =  "https://paas-init.revlet.net/clients/frndlytv/init/uat/frndlytv-uat.json"; 
var getJsonPath = "https://paas-init.revlet.net/clients/frndlytv/init/live/frndlytv.json";
var analyticsUrl="https://location.api.yuppcdn.net/sdk/validation?analytics_id=";

//for Live
var typeOfAnalytics = "d36bad5f857d14e3d4d4ca4b7055e179";

//local
var jsFilePaths = 'AasthaFlies.json';

//live
// var jsFilePaths ='http://ottapps.revlet.net/apps/wassa/Samsung/wassFile.txt' ;


var Yup = jQuery.noConflict();
var appConfig = {
	staticColudPath: 'http://d3gt70lx5ulpl2.cloudfront.net/static/tv/samsung/firstShows/',
	passwordMinLength: 4,
	passwordMaxLength: 16,
	APPID: 17,  //17-Samsung 16-LG
	deviceType: 'tizen',   //tizen //webos 	
	deviceName: 'SAMSUNG',  //SAMSUNG //LG
	typeOfAnalytics: typeOfAnalytics,
	GAId: "",
	appName: "Frndly TV",
	showSubscribeText : true,
	enableMyLibrary : false,	
	GAEnable: false,
	forgetpassword : false,
	tvshowDetalsFullImageView:true,
	channelshowDetalsFullImageView:true,
	ssha : 'cea850304404-b7eb-b894-e8f7-819f73fe',
	ivKey : '34d3cfd60af41d63',
};
var checknetworkType = true;
var connectionType='';
var systemConfigs = {};
var tempObjectData = {};
var airMouse = false;
var isLoading = false;
var tvKeyCode = {};
var scount = 0,mainCount = 0;
var Main = {
	locationApi: "",
	mainApi: "",
	searchApi: "",
	tenantCode: "",
	productCode: "",
	BOXID: '',
	SessionID: '',
	countryCode: '',
	country: '',
	countryFlag: '',
	mobileCode: '',	
	userProfile: {
		cardStatus: 0,
		email: '',
		mobile: "",
		mobileStatus: 0,
		mobileUpdatable: '',
		name: "",
		userId: '',
		nextPage: '',
		zipCode: '',
		emailStatus: '',
		userStatus : false,
		languages : ''
	},
	preferences: {},
	devices: [],
	packages:[]
}


var app = {
	initialize: function () {	
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	},
	onDeviceReady: function () {		
        this.receivedEvent('deviceready');  
		Main.showSplash();			
		Main.getBOXID();
		Yup.ajax({
			url: getJsonPath,
			type: "GET",
			data: {},
			success: function (data) {
				result = data;
				if (result) {
					Main.locationApi = result.location;
					Main.mainApi = result.api;
					Main.searchApi = result.search;
					Main.tenantCode = result.tenantCode;
					Main.productCode = result.product;
					Main.getLocation();
				} else {
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
				}
			},
			error: function (errObj) {
			Main.HideLoading();		
			Main.popupData ={
				popuptype : 'netWorkError',
				message : "Trouble connecting to Internet, Please Try again Later.",       
				buttonCount : 1,
				yesText : 'Okay',
				yesTarget : 'exit',
				onBack : 'exit'
			}
			Yup("#popUpFDFS").html(Util.showPopup());	
			Yup("#popup-btn-1").addClass('popupFocus');
			},
			timeout: 30000
		});		
	},
	receivedEvent: function (id) {
		toast.inputdevice.getSupportedKeys(function (keys) {
			for (var i = 0, len = keys.length; i < len; i++) {
				tvKeyCode[keys[i].name] = keys[i].code;
				if (['MediaPlay', 'MediaPause', 'MediaFastForward', 'MediaRewind', 'MediaStop'].indexOf(keys[i].name) >= 0) {
					toast.inputdevice.registerKey(keys[i].name, function () { });
				}
			}
		});
		window.addEventListener('keydown', function (e) {
			airMouse =false;							
			if(isLoading == false ){
				var id = Yup('.mouseFocus').attr("id");  
				if(id) {	Yup('#'+id).removeClass('mouseFocus'); }
				Main.processTrigger(e);
			}				
		});		
	}
};

app.appPreLoad = function () {	
	Yup.ajax({
		type: "GET",
		url: jsFilePaths + "?v=" + new Date().getTime()
	})
    .done(function (msg) {
        try {
            vers = JSON.parse(msg);
            if (vers.mainFiles) {
                for (var i = 0; i < vers.mainFiles.length; i++) {
                    if (vers.mainFiles[i].FileName.indexOf('css') != -1) {
                        var link = document.createElement('link');
                        link.setAttribute('rel', 'stylesheet');
                        link.setAttribute('type', 'text/css');
                        link.setAttribute('href', "" + vers.mainFiles[i].FileName + "?v=" + vers.mainFiles[i].VersionNo + "");
                        document.getElementsByTagName('head')[0].appendChild(link);

                        if (link.addEventListener) {
                            link.addEventListener('load', function () {
                                mainCount++; if (mainCount == vers.mainFiles.length) app.checkMainFilesStatus();
                            }, false);
                        } else if (link.onreadystatechange) {
                            link.onreadystatechange = function () {
                                var state = link.readyState;
                                if (state === 'loaded' || state === 'complete') {
                                    link.onreadystatechange = null;
                                    mainCount++; if (mainCount == vers.mainFiles.length) app.checkMainFilesStatus();
                                }
                            };
                        } else {
                            link.onload = function () {
                                mainCount++; if (mainCount == vers.mainFiles.length) app.checkMainFilesStatus();
                            };
                        }
                    }
                    else {
                        var fileref = document.createElement('script');
                        if (typeof fileref != "undefined") {
                            fileref.src = "" + vers.mainFiles[i].FileName + "?v=" + vers.mainFiles[i].VersionNo + "";
                            document.getElementsByTagName("head")[0].appendChild(fileref);
                            if (fileref.onreadystatechange) {
                                fileref.onreadystatechange = function () {
                                    if (this.readyState == 'complete') mainCount++; if (mainCount == vers.mainFiles.length) app.checkMainFilesStatus();
                                }
                            }
                            else {
                                fileref.onload = function () {
                                    mainCount++; if (mainCount == vers.mainFiles.length) app.checkMainFilesStatus();
                                }
                            }
                        }
                    }
                }
			}							
        }
        catch (e) {
			app.errorLoad();			
		}

    }).error(function (err) {
		app.errorLoad();		
    })
    .fail(function (err) {
		app.errorLoad();			
    });
}

app.checkMainFilesStatus = function () {
	function checkMainFiles() {
		try {
			app.loadMeta();
		}
		catch (e) {
			clearInterval(loadTimeInterval);
			loadTimeInterval = '';
			loadTimeInterval = setTimeout(checkMainFiles, 100);
		}
	}
	var loadTimeInterval = setTimeout(checkMainFiles, 100);
}

app.loadMeta = function () {
	try {
		if (vers.files) {
			for (var i = 0; i < vers.files.length; i++) {
				if (vers.files[i].FileName.indexOf('css') != -1) {
					var link = document.createElement('link');
					link.setAttribute('rel', 'stylesheet');
					link.setAttribute('type', 'text/css');
					link.setAttribute('href', "" + vers.files[i].FileName + "?v=" + vers.files[i].VersionNo + "");
					document.getElementsByTagName('head')[0].appendChild(link);

					if (link.addEventListener) {
						link.addEventListener('load', function () {
							scount++; if (scount == vers.files.length) app.initialize();
						}, false);
					} else if (link.onreadystatechange) {
						link.onreadystatechange = function () {
							var state = link.readyState;
							if (state === 'loaded' || state === 'complete') {
								link.onreadystatechange = null;
								scount++; if (scount == vers.files.length) app.initialize();
							}
						};
					} else {
						link.onload = function () {
							scount++; if (scount == vers.files.length) app.initialize();
						};
					}
				}
				else {
					var fileref = document.createElement('script');
					if (typeof fileref != "undefined") {
						fileref.src = "" + vers.files[i].FileName + "?v=" + vers.files[i].VersionNo + "";
						document.getElementsByTagName("head")[0].appendChild(fileref);
						if (fileref.onreadystatechange) {
							fileref.onreadystatechange = function () {
								if (this.readyState == 'complete') scount++; if (scount == vers.files.length) app.initialize();
							}
						}
						else {
							fileref.onload = function () {
								scount++; if (scount == vers.files.length) app.initialize();
							}
						}
					}
				}
			}
		}
	}
	catch (e) {
		document.getElementById("customMessage").style.display = "block";
		document.getElementById("customMessage").innerHTML = "<p class='loadNot'><img style='width: 70px;vertical-align: -25px;padding-right: 14px;' src='https://d20w296omhlpzq.cloudfront.net/devices/common/shape-9@3x.png'/>Unable to load necessary modules, Please check your internet connection and relaunch the application.</p>";
		
	}
}

app.errorLoad =function(){
	document.getElementById("customMessage").style.display = "block";
	document.getElementById("customMessage").innerHTML = "<p class='loadNot'><img style='width: 70px;vertical-align: -25px;padding-right: 14px;' src='https://d20w296omhlpzq.cloudfront.net/devices/common/shape-9@3x.png'/>Unable to load necessary modules, Please check your internet connection and relaunch the application.</p>";

	window.addEventListener('keydown', function (e) {						
		app.reloadApp(e);
	});
}

app.reloadApp  = function (event){
	var keycode = (window.event) ? event.keyCode : event.which;
	if( keycode == 13){
		document.getElementById("customMessage").style.display = "none";
		location.reload();
	}else if(keycode == 8 || keycode == 27){
		window.close();
	}			
}

//app starts here
app.appPreLoad();

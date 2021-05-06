(function (window) {
    var platform = cordova.require('cordova/platform'); 
    switch(platform.id) {
        case 'sectv-orsay':
            var SEF = cordova.require('cordova/plugin/SEF');
            var sefNetwork = SEF.get('Network');
            window.getMACAddr = function () {
                return sefNetwork.Execute('GetMAC');
            };

            // Multi-App
            window.onPause = function (event) {
                console.log('Event type = ' + event.type);  // deliver to 'onPause'
            };
            window.onResume = function(event) {
                console.log('Event type = ' + event.type); // deliver to 'onResume'
                console.log('Parameter = ' + event.data);  // deliver to same form as window.location.search
            };
            break;
        case 'sectv-tizen':
            window.getMACAddr = function () {
                return webapis.network.getMac();
            };

            // Multi-App
            
            document.addEventListener('visibilitychange', function() {
            	if(view == "player"){
                   if(document.visibilityState == "hidden"){
                       analytics.plugin.handlePlayEndedByUser();
                       media.pause();
			        }
			        else{
			                try{        //v2
			                        analytics.setMetaData(presentPagedetails.steamResponse.streams[0].url);
			                        analytics.plugin.thumbnailVideoClick();
			                        analytics.plugin.handlePlayerLoad();
			                }
			                catch(e){
			                        
			                }
			                
			            media.play();
			        }
                }  
            });
            
            
            
            
	            
            break;
                case 'tv-webos':
        	
        	var hidden, visibilityChange; 
        	 
        	if (typeof document.hidden !== "undefined") {
        	    hidden = "hidden";
        	    visibilityChange = "visibilitychange";
        	} else if (typeof document.webkitHidden !== "undefined") {
        	    hidden = "webkitHidden";
        	    visibilityChange = "webkitvisibilitychange";
        	}
        	
        	document.addEventListener(visibilityChange, function() { 
        	   if(view == "player"){
        		   if (document[hidden]) {
                    analytics.plugin.handlePlayEndedByUser();
                    media.pause();
       	    }
       	    else {
       	    	try{     
                       analytics.setMetaData(presentPagedetails.steamResponse.streams[0].url);
                       analytics.plugin.thumbnailVideoClick();
                       analytics.plugin.handlePlayerLoad();
               }
               catch(e){ }
                media.play();
       	    }
        	   }
        	});
        	
            break;
    }
})(this);

/**
 * The closure which is supposed to work as a Node Package Module or on ANY Browser, whether it is 
 * on mobile or on Desktop. This closure produces the instance of the Plugin accordingly. 
 * 
 * @author kaushikr@yupptv.com udated by shivakumarn@yupptv.com
 * @version 0.2.3
 * @returns VideoAnalyticsPlugin's instance.
 */
(function (rootObject, pluginFactory) {
    'use strict';
    if (typeof exports === 'object') {
        module.exports = pluginFactory();
    } else if (typeof define === 'function' && define.amd) {
        define(pluginFactory);
    } else {
        rootObject.VideoAnalyticsPlugin = pluginFactory(rootObject);
    }
})

/**
 * The factory function which creates and returns the instance of VideoAnalyticsPlugin to be used
 * with the web media players of the HTML5 media players.
 */
(this, function (window) {
    /**
     * Utility method to check whether the given value is a string and non empty.
     */
    var isNonEmptyValue = function (value) {
        return typeof value != undefined && value != null && value != "";
    };

    /**
     * A simple implementation of the a QUEUE using a Java Script Array.
     * The methods are offer and poll in sync (name wise) with Linked Blocking Queue of Java.
     */
    var Queue = function () {
        var _queue = [];

        return {
            /**
             * @param element to be pushed to the Queue.
             */
            offer: function (element) { _queue.push(element); },

            /**
             * @returns element next in the Queue.
             */
            poll: function () {
                var element = _queue.shift();
                if (element) {
                    return element;
                }
            }
        };
    };

    /**
     * The factory for the events.
     */
    var EventFactory = function () {
        /**
         * @param eventData the Json map holding the details for the map.
         * @param responseKey the response key to be tracked.
         * @return the event instance.
         */
        this.create = function (eventData) { return new Event(eventData); };
    };

    /**
     * The Event Data object, has two parts, parameterMap which holds the event details.
     * The other part is the response key tracker not used for now but will be used.
     */
    var Event = function (pParameterMap) {
        this.parameterMap = pParameterMap;
    };

    /**
     * A simple Event Queue implementation for Java Script.
     * This class is responsible for managing the event queue, polling and sending them to the server.
     */
    var EventQueueManager = function () {
        var eventQueue = new Queue(); // The Queue Data structure.
        var $ = {}; // The handle to the JQuery instance for making AJAX.
        var _this = this; // Self reference.
      //  this.eventCounter = 1;
        // Determine where to retrieve the JQuery Handle from.
        if (typeof exports === 'object') {
            var domino = require('domino');
            $ = require('jquery')(domino.createWindow());
            var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
            $.support.cors = true; // cross domain
            $.ajaxSettings.xhr = function () { return new XMLHttpRequest(); };
        } else if (window) {
            $ = window.$;
        }

        /**
         * The simple function which does the HTTP GET/POST to send data to 
         * the Event Collector.
         */
        var httpService = function () {
            var eventData = eventQueue.poll();
            if (eventData && eventData.parameterMap) {
                var eventJson = JSON.stringify(eventData.parameterMap)
                if (eventData && isNonEmptyValue(eventJson) && "{}" !== eventJson) {
                    _this.doAjax(eventJson);
                }
            }
        };

        /**
         * The ajax utility function.
         */
        this.doAjax = function (eventData) {
          
            Yup.ajax({
                 type: 'POST',
                        url: 'http://' + analyticsData.collector_api,
                data: { data: eventData ,analytics_id: appConfig.typeOfAnalytics}
            })
            .done(function (response) {
               
            })
             .fail(function() {
                    console.log("error");
                  })
            .always(function() {
                    console.log( "complete" );
                  });
                 
        };

        // Schedule the services at 1/2 a second intervals.
        var httpWorker = (window) ? window.setInterval(httpService, 0) : setInterval(httpService, 0);
        var eventFactory = new EventFactory();

        /**
         * Shuts down the timers clearing them.
         */
        this.shutdown = function () {
            if (window) { window.clearInterval(httpWorker); } else { clearInterval(httpWorker); }
        };

        /**
         * The event handler, which pushes the events to the Event-Queue.
         * 
         * @param eventMap the event details.
         * @reponseKey the response tracker.
         */
        this.handleEvent = function (eventMap) {
            eventQueue.offer(eventFactory.create(eventMap));
        };
    };

    /**
     * Enumeration representing the types of events supported by the plugin.
     */
    var EventContextKeys = function () {
        this.EVENT_TYPE = "et";
        this.EVENT_OCCURENCE_TIME = "eot";
        this.ERROR_REASON_CODE = "erc";
        this.THUMB_VIDEO_CLICK = 1;
        this.PLAYER_LOAD = 2;
        this.AD_STARTED = 3;
        this.AD_SKIPPED = 4;
        this.AD_ENDED_BY_USER = 5;
        this.AD_COMPLETED = 6;
        this.VIDEO_STARTED = 7;
        this.VIDEO_ENDED_BY_USER = 8;
        this.VIDEO_COMPLETED = 9;
        this.VIDEO_SEEK = 10;
        this.BUFFER_START = 11;
        this.BUFFER_END = 12;
        this.VIDEO_PAUSE = 13;
        this.VIDEO_RESUME = 14;
        this.HEART_BEAT = 15;
        this.ERROR_MSGS = 16;
        this.BITRATE_CHANGE = 17;

    };


    /**
     * The Video analytics plugin's main class.
     */
    var VideoAnalyticsPlugin = function () {
        var yupptv = {};
        yupptv.eventDefaultValue = -1;
        yupptv.eventMetaData = {
            STPosition: yupptv.eventDefaultValue,
            ETPosition: yupptv.eventDefaultValue,
            errorMsg: yupptv.eventDefaultValue,
            adType: yupptv.eventDefaultValue,
        };
        yupptv.sessionKey={};
        yupptv.playerData = {};
        yupptv.contentData = {};
        yupptv.userData = {};
        yupptv.demographics = {};
        yupptv.clientData = {};
        yupptv.videoData = {};
        yupptv.httpHeartBeatWorker = {};       
        yupptv.eventCounter = 1;
        yupptv.eventContextKeys = new EventContextKeys();
        yupptv.isVideoPlaying = false;
        yupptv.isPaused = false;        
        yupptv.isAdPlaying = false;
        yupptv.isBuffering = false;     
        yupptv.isSessionEnded = false;    
        yupptv.playSessionKey = yupptv.totalVideoLength = yupptv.playerPosition = yupptv.playerState =  yupptv.eventDefaultValue;

        var setValue = function (value) {
            return isNonEmptyValue(value) ? value : yupptv.eventDefaultValue;
        }

        /* The heart beat service, to make sure the client is live while watching the event. */
        var heartBeatService = function (et) {
            if (view == "player") {
                resetEventMetaData();
                var eventDataMap = collateEventData(et);
                yupptv.eventQueueManager.doAjax(JSON.stringify(eventDataMap));
            } else {
                resetEventMetaData();
                handleEvent(yupptv.eventContextKeys.VIDEO_ENDED_BY_USER);
                stopHeartbeat();
                yupptv.isSessionEnded = true;
            }

        };

        /* This function starts the heart-beat for the client. */
        var startHeartbeat = function () {
            analyticsData.hb_rate= +analyticsData.hb_rate;
            var event_type = yupptv.eventContextKeys.HEART_BEAT;
            yupptv.httpHeartBeatWorker = (window) ? window.setInterval(function () { heartBeatService(event_type); }, (1000 * analyticsData.hb_rate)) :
                setInterval(function () { heartBeatService(event_type); }, (1000 * analyticsData.hb_rate));
        };

        /**
         * This function stops the heart-beat for the client.
         */
        var stopHeartbeat = function () {
            (window) ? window.clearInterval(yupptv.httpHeartBeatWorker) : clearInterval(yupptv.httpHeartBeatWorker);
            //clearInterval(timer);
            yupptv.eventCounter = 1;
            yupptv.isVideoPlaying = false;
            yupptv.isPaused = false;
            yupptv.isAdPlaying = false;
            yupptv.isBuffering = false;
            yupptv.totalVideoLength = yupptv.eventDefaultValue;
        };

          /**
         * Loads and initializes the Plugin.
         */
        this.load = function (data) {
            yupptv.eventQueueManager = new EventQueueManager();
            yupptv.sessionKey.key =data.authKey;
            yupptv.sessionKey.trueIp = data.trueIp;
            return this;
        };

        /*
         *  functon to collect total analytics data to push   
         */
        var collateEventData = function (eventContextKey) {
            var eventDataMap = {};

            if (eventContextKey === yupptv.eventContextKeys.THUMB_VIDEO_CLICK) {

                // Player Demograhics Data.         
                eventDataMap.con = yupptv.demographics.countryName;    // Country
                eventDataMap.st = yupptv.demographics.state;   // State
                eventDataMap.c = yupptv.demographics.city;     // City          

                // collate user and device information                 
   
                eventDataMap.dt = yupptv.userData.deviceType;     // DeviceType     
                eventDataMap.dc = yupptv.userData.deviceClient;     // DeviceClient
                eventDataMap.di = yupptv.userData.deviceId;     // DeviceId
                eventDataMap.dos = yupptv.userData.deviceOS;    // DeviceOS
                eventDataMap.ptri = yupptv.userData.partnerId;    // PartnerId
                eventDataMap.ptrn = yupptv.userData.partnerName;    // PartnerName         
               
                // Collate player information.
                eventDataMap.pln = yupptv.playerData.playerName;    // PlayerName
                eventDataMap.plv = yupptv.playerData.playerVersion;    // PlayerVersion

                // Collate program information.     
                eventDataMap.pn = yupptv.contentData.programName;     // ProgramName
                eventDataMap.cdn = yupptv.contentData.CDNetwork;     // ContentDeliveryNetwork      
                eventDataMap.nf = yupptv.contentData.navigationFrom;    // NavigationFrom
                eventDataMap.l = yupptv.contentData.lang;     // Language
                eventDataMap.is = yupptv.contentData.isSubscribed;     // IsSubscribed
                eventDataMap.a1 = (yupptv.contentData.attribute1 != undefined) ? yupptv.contentData.attribute1 : yupptv.eventDefaultValue;     //      
                eventDataMap.a2 = (yupptv.contentData.attribute2 != undefined) ? yupptv.contentData.attribute2 : yupptv.eventDefaultValue;      //      
                eventDataMap.a3 = (yupptv.contentData.attribute3 != undefined) ? yupptv.contentData.attribute3 : yupptv.eventDefaultValue;

                // Collate client information.
                eventDataMap.appv = yupptv.clientData.appVersion;    // AppVersion
                eventDataMap.cnt = yupptv.clientData.connectionType;     // ConnectionType
                eventDataMap.ip = yupptv.clientData.clientIP;     // ClientIP           
                eventDataMap.np = yupptv.clientData.NWProvider;    // NetworkProvider-Carrier           

                // collate video information
                eventDataMap.ap = yupptv.videoData.autoplay;     // Autoplay
                eventDataMap.vl = yupptv.videoData.videoList;     // VideoList              
                eventDataMap.su = yupptv.videoData.streamURL;     // StreamURL     
                eventDataMap.sn = yupptv.videoData.seasonNumber;     // seasonNumber     
                eventDataMap.en = yupptv.videoData.episodeNumber;     // episodeNumber     
                eventDataMap.sc = yupptv.videoData.subCategory;     // subCategory                                   

            }
                eventDataMap.bi = yupptv.userData.boxId;   // BoxId  
                eventDataMap.ui = yupptv.userData.userId;          // UserId   
                eventDataMap.meta_map = yupptv.eventDefaultValue; //metaMap
                eventDataMap.meta_id = yupptv.contentData.meta_id;
                eventDataMap.vodn = yupptv.contentData.vodProgramNumber;

                eventDataMap.epgst = yupptv.contentData.EPGStartTimeToset;
                eventDataMap.ispromo = yupptv.contentData.IsPromotionalType;
                eventDataMap.dm = yupptv.contentData.DeviceModelType;
                eventDataMap.db = yupptv.contentData.DeviceBrandType;
                eventDataMap.dosv = yupptv.contentData.Device_OS_VersionType;
                eventDataMap.epget = yupptv.contentData.EPG_EndTimeType;

                eventDataMap.sk = yupptv.sessionKey.key;     // SessionKey    
                eventDataMap.psk = yupptv.playSessionKey;     // playSessionKey                           

                eventDataMap.vi = yupptv.demographics.vendorId;    // VendorId       
                eventDataMap.pi = yupptv.contentData.programId;    // ProgramId
                eventDataMap.ct = yupptv.videoData.contentType;   // ContentType
                eventDataMap.pdn = yupptv.videoData.productName;     // ProductName  
                eventDataMap.analytics_id = appConfig.typeOfAnalytics;      


            if (eventContextKey == yupptv.eventContextKeys.THUMB_VIDEO_CLICK || eventContextKey == yupptv.eventContextKeys.PLAYER_LOAD) {    //eventContextKey == eventContextKeys.VIDEO_STARTED
                eventDataMap.pp = yupptv.eventDefaultValue;     // PlayerPosition 
                eventDataMap.ps = 'idle';//yupptv.eventDefaultValue;     // PlayerState
            }
            else {
                yupptv.playerState =setValue(Player.playerState);
                yupptv.playerPosition =Math.floor(setValue(Player.getPlayerPosition()));
                eventDataMap.pp=yupptv.playerPosition;
                eventDataMap.ps = yupptv.playerState;
            }

            eventDataMap.sp = Math.floor(setValue(yupptv.eventMetaData.STPosition));     // StartTime-Position    
            eventDataMap.ep = Math.floor(setValue(yupptv.eventMetaData.ETPosition));     // EndTime-Position    
            eventDataMap.br = '1100';//yupptv.bitRate;     // BitRate            
            eventDataMap.tvl = Math.floor(yupptv.totalVideoLength);     // totalVideoLength  
            eventDataMap.em = yupptv.eventMetaData.errorMsg;     // EventMessage 
            eventDataMap.at = yupptv.eventMetaData.adType;     // AdType        
            eventDataMap.et = eventContextKey;
            eventDataMap.av = 'v2';     // AnalyticsVersion  
            eventDataMap.ts = new Date().getTime();     // TimeStamp    in milli seconds    
            eventDataMap.ec = yupptv.eventCounter;
            yupptv.eventCounter = yupptv.eventCounter + 1;
           
            return eventDataMap;

        };

        this.setDemographics = function (data) {
            yupptv.demographics.vendorId = setValue(data.vendorId);
            yupptv.demographics.countryName = setValue(data.countryName);
            yupptv.demographics.state = setValue(data.state);
            yupptv.demographics.city =setValue(data.city);
        };

         /**
         * Set some meta data about the player used to play the streams.
         */
        this.setPlayerMetaData = function (data) {
            yupptv.playerData.playerName = setValue(data.playerName);
            yupptv.playerData.playerVersion = setValue(data.playerVersion);
        };

         /*
          sets the meta information about sessions and network 
        */
       this.setClientMetaData = function (data) {
        yupptv.clientData.appVersion = setValue(data.appVersion);
        yupptv.clientData.connectionType = setValue(data.connectionType);
        yupptv.clientData.clientIP = setValue(data.clientIP);
        yupptv.clientData.NWProvider = setValue(data.NWProvider);
    }

        /**
         * Set meta data about the content which is being played.
         */
        this.setContentMetaData = function (data) {

            yupptv.contentData.programId = setValue(data.programId);
            yupptv.contentData.programName = setValue(data.programName);
            yupptv.contentData.CDNetwork = setValue(data.CDNetwork);
            yupptv.contentData.navigationFrom = setValue(data.navigationFrom);
            yupptv.contentData.lang = setValue(data.lang);
            yupptv.contentData.isSubscribed = setValue(data.isSubscribed);
            yupptv.contentData.meta_id = setValue(data.meta_id);
            yupptv.contentData.vodProgramNumber = setValue(data.vodNumber);
            yupptv.contentData.EPGStartTimeToset = setValue(data.EPGStartTime);
            yupptv.contentData.IsPromotionalType = setValue(data.IsPromotional);
            yupptv.contentData.DeviceModelType = setValue(data.DeviceModel);
            yupptv.contentData.DeviceBrandType = setValue(data.DeviceBrand);
            yupptv.contentData.Device_OS_VersionType = setValue(data.Device_OS_Version);
            yupptv.contentData.EPG_EndTimeType = setValue(data.EPG_EndTime);
        };

        /**
         * Sets the meta information about the user who has logged in.
         */
        this.setUserMetaData = function (data) {
            yupptv.userData.userId = setValue(data.userId);
            yupptv.userData.boxId = setValue(data.boxId);
            yupptv.userData.deviceType = setValue(data.deviceType);
            yupptv.userData.deviceClient = setValue(data.deviceClient);
            yupptv.userData.deviceId = setValue(data.deviceId);
            yupptv.userData.deviceOS = setValue(data.deviceOS);
            yupptv.userData.partnerId = setValue(data.partnerId);
            yupptv.userData.partnerName = setValue(data.partnerName);
        };

        /*
         set meta data for video information
        */
        this.setVideoMetaData = function (data) {
            yupptv.videoData.autoplay = data.autoplay;
            yupptv.videoData.productName = setValue(data.productName);
            yupptv.videoData.streamURL = setValue(data.streamURL);
            yupptv.videoData.contentType = setValue(data.contentType);
        }
        // reset eventmeta data      
        var resetEventMetaData = function () {
            for (var key in yupptv.eventMetaData) {
                yupptv.eventMetaData[key] = yupptv.eventDefaultValue;
            }
        }

           /* The generic handle event method. */
           var handleEvent = function (eventContextKey) {
            var eventDataMap = collateEventData(eventContextKey);
            yupptv.eventQueueManager.handleEvent(eventDataMap);
        };


        //  player events by shiva nomula 200671
        //************* starts here ********************//
        /*
           triggers when thumbnail video clicks
        */
        this.thumbnailVideoClick = function (){      
            yupptv.playSessionKey = new Date().getTime();  
            yupptv.isSessionEnded = false;    
            resetEventMetaData();
            stopHeartbeat();
            handleEvent(yupptv.eventContextKeys.THUMB_VIDEO_CLICK);
            startHeartbeat();
        }

        /*  triggers when player loads. */
        this.handlePlayerLoad = function () {
            handleEvent(yupptv.eventContextKeys.PLAYER_LOAD);
        }

        /*  triggers when ad started. */
        this.handleAdStarted = function (playerEvent) {
            if(!yupptv.isAdPlaying){
                yupptv.eventMetaData.adType = playerEvent.adType;
                handleEvent(yupptv.eventContextKeys.AD_STARTED);
                yupptv.isAdPlaying = true;
            }            
        }

        /*         triggers when ad skipped. */
        this.handleAdSkipped = function (playerEvent) {
            if(yupptv.isAdPlaying){
                yupptv.eventMetaData.adType = playerEvent.adType;
                handleEvent(yupptv.eventContextKeys.AD_SKIPPED);
                resetEventMetaData();
                yupptv.isAdPlaying = false;
            }            
        }

        /* triggers when ad ended by user.*/
        this.handleAdEndedByUser = function (playerEvent) {
            if(yupptv.isAdPlaying){
                yupptv.eventMetaData.adType = playerEvent.adType;
                handleEvent(yupptv.eventContextKeys.AD_ENDED_BY_USER);
                resetEventMetaData();
                yupptv.isAdPlaying = false;
            }            
        }

        /* triggers when ad skipped.*/
        this.handleAdCompleted = function (playerEvent) {
            if(yupptv.isAdPlaying){
                yupptv.eventMetaData.adType = playerEvent.adType;
                handleEvent(yupptv.eventContextKeys.AD_COMPLETED);
                resetEventMetaData();   
            }            
        }

        /*  triggers when play starts */
        this.handlePlayStarted = function () {
            if(!yupptv.isVideoPlaying){            
               resetEventMetaData();
               if (yupptv.totalVideoLength == yupptv.eventDefaultValue || isNaN(yupptv.totalVideoLength)) {
                   yupptv.totalVideoLength =setValue(+Player.duration);
               }
               handleEvent(yupptv.eventContextKeys.VIDEO_STARTED);
               yupptv.isVideoPlaying = true;
            }            
            
        };

        /* triggers when play ends by user       */
        this.handlePlayEndedByUser = function () {
            if(yupptv.isVideoPlaying || yupptv.isAdPlaying || yupptv.isBuffering || yupptv.isPaused ){
                resetEventMetaData();
                handleEvent(yupptv.eventContextKeys.VIDEO_ENDED_BY_USER);
                 stopHeartbeat();
                yupptv.isSessionEnded = true;
            }            
        };

        /* *  triggers when play ends (completed) */
        this.handlePlayCompleted = function () {
            if((yupptv.isVideoPlaying || yupptv.isAdPlaying || yupptv.isBuffering || yupptv.isPaused) && !yupptv.isSessionEnded){
                resetEventMetaData();
                handleEvent(yupptv.eventContextKeys.VIDEO_COMPLETED);
                stopHeartbeat();
                yupptv.isSessionEnded = true;
            }
        };

        /*  triggers when seek  */
        this.handleSeek = function (playerEvent) {
            if(view == 'player'){
                yupptv.eventMetaData.STPosition = playerEvent.STPosition;
                yupptv.eventMetaData.ETPosition = playerEvent.ETPosition;
                handleEvent(yupptv.eventContextKeys.VIDEO_SEEK);
            }
            
        };

        /*  triggers when video buffer starts */
        this.handleBufferStart = function () {
            if(!yupptv.isBuffering){
                resetEventMetaData();
                handleEvent(yupptv.eventContextKeys.BUFFER_START);
                yupptv.isBuffering = true;
            }   
        };

        /**   triggers when video buffer starts */
        this.handleBufferEnd = function () {
            if(yupptv.isBuffering){
                resetEventMetaData();
                handleEvent(yupptv.eventContextKeys.BUFFER_END);
                yupptv.isBuffering = false;
            }
        };

        /* function to handle pause event */
        this.handlePause = function () {
            if(!yupptv.isPaused){
                resetEventMetaData();
                handleEvent(yupptv.eventContextKeys.VIDEO_PAUSE);
                yupptv.isPaused = true;
            }            
        };

        /* function to handle resume event */
        this.handleResume = function () {
            if(yupptv.isPaused){
                resetEventMetaData();
                handleEvent(yupptv.eventContextKeys.VIDEO_RESUME);
                yupptv.isPaused = false;
            }
        };

        /* function to playing status */
        this.handleIsPlaying = function () {
            if (typeof yupptv.httpHeartBeatWorker != undefined && yupptv.httpHeartBeatWorker != "") {
                return true;
            }
            else {
                return false;
            }
        };

        /* function for handling error event */
        this.handleError = function (playerEvent) {
            if(!yupptv.isSessionEnded){
                yupptv.eventMetaData.errorMsg = playerEvent.errorMsg;
                handleEvent(yupptv.eventContextKeys.ERROR_MSGS);
                 handleEvent(yupptv.eventContextKeys.VIDEO_COMPLETED);
                stopHeartbeat();
                yupptv.isSessionEnded = true;
            }
        };

        /* function to handle bitrate change envent */
        this.handleBitRateChange = function (playerEvent) {
            yupptv.bitRate = playerEvent.bitRate;
            handleEvent(yupptv.eventContextKeys.BITRATE_CHANGE);
        };


        //************* ends here ********************//

    };

    return new VideoAnalyticsPlugin();
});
// End of Plugin Code.
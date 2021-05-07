import { Component, Injector,Renderer2, OnInit, AfterViewInit , OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, timer } from 'rxjs';

import { WindowRef } from '../services/window-ref.service';
import { DataManager } from '../services/data-manager.service';
import { UserService } from '../services/user.service';
import { DeviceService } from '../services/device.service';
import { appConfig } from '../app.config';
import { OTTGlobalService } from '../services/ott-global.service';
import { Utility } from '../services/utility.service';
import { CommonService } from '../services/common.service';
import { SeoService } from '../services/seo.service';
import { ObservableCallbackService } from '../services/observable-callback.service';
import { LocalStorageService } from '../services/local-storage';

declare var jwplayer: any;
declare var VideoAnalyticsPlugin: any;
declare var $: any;

@Component({
    selector: 'video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss'],
})



export class VideoPlayerComponent implements OnInit, OnDestroy , AfterViewInit {

    public sectionInfo;    
    public appConfig = appConfig; 
    public playerSetup = false;
    public streamData: any;
    public userDetails: any;    
    public streamUrl = '';
    public nextVideosList: any = [];
    public nextVideoStartsIn;
    public enableNextEpisodeBtn : any = {};
                                  
    public subscribeTitle = '';
    public streamNotAvail = '';
    public selectedSection;
    public selectedSectionIndex;

    public showMoreBtnText = '';
    public showMoreBtn = false;
    public contentDescription = '';
    public contentDescriptionTemp = '';
    public paginationFlag = true;
    public pagePath;          
    public relatedShowsHeight;
    public playerBlockHeight;

    public breakPoint;
    public charCount;
    public isBuffering = false;
    public isPause = false;
    public isAdPlaying = false;
    public isAdloading = false;
    public adloader;
    public isThumbnailStatus = false;

    public playSource: any = {};
    public advertising: any = {};
    public strData : any = {};

    private sub: Subscription;
    private userSessionSub: Subscription;
    private playerPageSub: Subscription;
 
    public jwPlayerObj;
    public displayLoader : boolean = false;

    public lastChannelInfo : string = '';
    public currentChannelInfo : string = '';

    public playerInstance : any;
    private resultTimer;
    public childTemplateData : any = {};

    public concurPollInitId ;
    public concurStreamStatusObj : any = {};
    public showToastMessage = { type : '', status : false, massage :''};

    //@IA
    public plugin: any;   // starts @IA         
    private boxId: any;
    public isVideoPlaying = false;
    public systemConfigs;
    public isSocialSharingEnabled;
    public isLiveMarkerEnabled = {status : false,data : ''};
    public isWaterMarkLogoEnabled;
    public isStreamEncryptionEnabled;
    public adInfo;

    public browserAgent: any = {};    
    public showGolive = false;
    public showStartOver = true;
    public metaPollTime : number;
    public metaPollInit : any;
    public VideoTitle:any;
    public subtitle5 : any;

    public showErrorSlate : boolean = false;
    public maxFastForward : any;
    public seekBack : boolean = false;
    public seekBackTimer : Subscription;
    public programExpiryString :any;
    public availableUntil : any;
    isNextVideo:boolean = false;
    isStartOverClick:boolean = false;
    isLastChannelClick:boolean= false;
    isReplaying:boolean = false;
    btnHDText: string ="HD";
    SDData :any ={};
    trueIp :any;
    showScteAds = false;
    scteAdBlockData:any = {};
    // captionFlag: boolean = false;
    defaultCCLang : any;
    public ccId;
    public manualCCchange : boolean = true;    
    public localNowObj : any;
    public externalPollTimer;

    @ViewChild('player') player: ElementRef;
    @ViewChild('playerLeft') playerLeft: ElementRef; 
    @ViewChild('startOverModal') startOverModal :ElementRef;
    @ViewChild('startOverModalFade') startOverModalFade :ElementRef;
    @ViewChild('concurrent') concurrent :ElementRef;
    keyAdd = { "pre": 0, "mid": 1, "overlay": 2,"post" : 3 };


    constructor(private windowRef: WindowRef, private injector: Injector, private dataManager: DataManager, private localStorage: LocalStorageService,
        private userService: UserService, private router: Router, private deviceService: DeviceService,
        private ottGlobalService: OTTGlobalService,private renderer2 : Renderer2, private elementRef : ElementRef,
        private commonService : CommonService,private seoService : SeoService, private observableCallbackService: ObservableCallbackService) {

        Utility.register(this);
        this.sectionInfo = this.injector.get('content');
        this.userService.analyticsObjectSource.subscribe(data => {
            this.plugin = data;
        });             

        this.userService.loggedInSource.subscribe(data => {
            this.userDetails = data.userDetails;               
        });

        this.playerPageSub = this.observableCallbackService.playerPageSource.subscribe(data=>{
            if((window.location.pathname.replace('/','') != data.path) && (!this.concurStreamStatusObj.message)){
                this.isVideoPlaying = false;     
                this.showGolive = false;
                this.showStartOver = true;
                this.showErrorSlate = false;
                this.commonService.setResume(false);
                this.appConfig.siteSettings.internalVideoAnalaticsEnable && this.plugin && this.plugin.handlePlayEndedByUser();
                this.isThumbnailStatus = false; 

                //local now external poll call
                if(!!this.localNowObj){
                    this.startLocalNowPoll("false");
                    this.localNowObj = '';
                   !!this.externalPollTimer && clearInterval(this.externalPollTimer);
                }                  

                this.getPageData(data.path);
            }     
            else if(!!this.concurStreamStatusObj && !!this.concurStreamStatusObj.message){
                this.showToastMessage = { type : 'generic', status : true, massage : this.concurStreamStatusObj.message};
            }
            else{
                this.showToastMessage = { type : 'generic', status : true, massage :'You are watching ' + this.VideoTitle};
            }       
        });

        this.browserAgent = this.deviceService.getDeviceInfo(); 
        this.userDetails = this.userService.getUserDetails();

        this.systemConfigs = this.userService.getSystemConfig();
        //this.isSocialSharingEnabled = (this.systemConfigs.isSocialMediaSharingSupported == "true");
        this.isWaterMarkLogoEnabled = (this.systemConfigs.showWatermark == "true");
        this.isStreamEncryptionEnabled = (this.systemConfigs.encryptStreamApi == "true");       

        this.btnHDText = (!!this.userDetails.attributes && this.systemConfigs.enableBitrateFeature == 'true') ? this.userDetails.attributes.videoQuality : "";
        (!this.btnHDText) && (this.btnHDText = (!!this.userService.isHDPacakgeAvilable) ? 'HD' : 'SD');
        var videoQualitySettings = this.userService.getSystemConfig();
        videoQualitySettings = videoQualitySettings['videoQualitySettings'];
        (!!videoQualitySettings) && (videoQualitySettings = JSON.parse(videoQualitySettings));      
        this.SDData = videoQualitySettings.filter(ele => (ele.code == 'SD')); 
        this.SDData = (!!this.SDData) ? this.SDData[0] : {} ; 

        (!this.plugin) && (this.plugin = this.userService.getAnalyticsObject());  //getting analytics plugin bject.

        this.prePageCheck();                  

        this.boxId = this.dataManager.getBoxId();

        this.pagePath = this.router.url.replace('/', ''); 


        this.trueIp =this.dataManager.retrieveStaticString('LocationData');
        this.trueIp = (!!this.trueIp)  ? (JSON.parse(this.trueIp)).ipInfo.trueIP :'';      
        
    }

    prePageCheck(){
                
        if (this.sectionInfo.streamStatus.hasAccess && !!this.windowRef.isWindowAvailable()) {
            this.adInfo = this.sectionInfo.adUrlResponse;                   
            this.getStream();                            
        }
        else {
            if (this.sectionInfo.streamStatus.errorCode == -1000 || this.sectionInfo.streamStatus.errorCode == 402 || this.sectionInfo.streamStatus.errorCode == -30) {
                this.subscribeTitle = this.sectionInfo.streamStatus.message;
            }          
            else if (this.sectionInfo.streamStatus.errorCode == -3 || this.sectionInfo.streamStatus.errorCode == -4 || this.sectionInfo.streamStatus.errorCode == -16 || this.sectionInfo.streamStatus.errorCode == -777) {
                this.streamNotAvail = this.sectionInfo.streamStatus.message;
            }
            if (!!this.appConfig.siteSettings.internalVideoAnalaticsEnable && !!this.windowRef.isWindowAvailable()) {
                this.initVideoAnalytics();               
            }                        
            this.showStartOver = false; 
            this.enableNextEpisodeBtn = {};
        }
    }

    windowsResize(windowWidth: number, breakpoint: string): void {
        this.breakPoint = Utility.getBreakPointType();
        this.charCount = this.getCharCount();
        this.checkShowMoreBtn();
        //this.initProcess();
    }

    ngOnInit() {
        if (this.windowRef.isWindowAvailable()) {
            this.breakPoint = Utility.getBreakPointType();
            this.charCount = this.getCharCount();                         
            this.checkShowMoreBtn();                      
            setTimeout(() => {
                this.initProcess();
                this.lastChannelInfo = (this.sectionInfo.info.attributes.isLive == "true") ? (this.dataManager.retrieveStaticString('last_channel_info')) : ''; 
                (this.lastChannelInfo === this.pagePath) && (this.lastChannelInfo = "") //if last channel and current playing channel is same then hide last channel button
                this.currentChannelInfo = ((this.sectionInfo.info.attributes.isLive == "true") ? this.pagePath : '');
                (this.sectionInfo.info.attributes.isLive == "true") &&  (this.commonService.getStartOver() ? (this.showGolive = true)  : (this.showStartOver = true));                 
                this.metaPollTime = Number(this.sectionInfo.info.attributes.endTime) - new Date().getTime();
                (!!this.metaPollTime && (this.metaPollTime > 0) && (this.sectionInfo.info.attributes.isLive == "true")) && this.getNextProgramMetaData();   
                this.enableNextEpisodeBtn['isShow'] = (this.sectionInfo.info.attributes.isLive != "true" && this.sectionInfo.info.attributes.contentType != "movie");               
                this.enableNextEpisodeBtn['btnText'] = ((this.sectionInfo.info.attributes.contentType == "tvshowepisode") ? "Next Episode" : "Next Video");
                (this.enableNextEpisodeBtn['isShow'] && this.getNextVideoPreInfo())  // newly added by 671
            },10);            
        }
    }

    ngAfterViewInit() {       
       this.togglePlayerBtns(); 
       this.playerInstance = this.renderer2.listen(this.elementRef.nativeElement.querySelector('#player-wrap'), 'mousemove', (e) => {
           this.togglePlayerBtns();
        });      
    }

    private togglePlayerBtns(){
        if(!this.isAdloading){        
            this.renderer2.setStyle(this.elementRef.nativeElement.querySelector('.player-btn'), 'display' , 'inline-block');              
            (!!this.resultTimer) && (clearTimeout(this.resultTimer));
            this.resultTimer = setTimeout(()=>{   // do not hide buttons when             
                (!!this.jwPlayerObj && this.jwPlayerObj.getState() != 'paused') && this.renderer2.setStyle(this.elementRef.nativeElement.querySelector('.player-btn'), 'display' , 'none');
            },2200);
        }
    }

    private getPageData(pagePath){
        
        let self = this;                           
        let url = this.userService.staticInitData.api + appConfig.apiURL + 'page/content?path=' + pagePath;
        this.dataManager.getData(url).subscribe(data => {
        if (data['status'] && !!data['response'].streamStatus.hasAccess) {                                                            
            for(let i=0; i< data['response'].data.length; i++){
                if(data['response'].data[i].paneType == "content"){
                    this.sectionInfo = data['response'].data[i].content;
                    this.sectionInfo['streamStatus'] = data['response'].streamStatus;
                    this.sectionInfo['shareInfo'] = data['response'].shareInfo;
                    this.sectionInfo['info'] = data['response'].info;
                    this.sectionInfo['sectionData'] = data['response'].data;
                    this.sectionInfo['pageButtons'] = data['response'].pageButtons;
                    this.sectionInfo['adUrlResponse'] = data['response'].adUrlResponse;
                    this.sectionInfo['tabsInfo'] = data['response'].tabsInfo;                                                                                  
                }
            }
            this.prePageCheck();          
            this.initProcess();
            this.checkShowMoreBtn(); 
            
            if(this.sectionInfo.info.attributes.isLive == "true" && pagePath != this.currentChannelInfo) {
                this.dataManager.storeStaticString('last_channel_info',this.currentChannelInfo);
                this.lastChannelInfo = this.currentChannelInfo;
                this.currentChannelInfo = pagePath;                
            }
            
            //this.showStartOver = (this.sectionInfo.info.attributes.isLive == "true");       startover
            this.metaPollTime = Number(this.sectionInfo.info.attributes.endTime) - new Date().getTime();  
            (!!this.metaPollTime && (this.metaPollTime > 0) && (this.sectionInfo.info.attributes.isLive == "true")) && this.getNextProgramMetaData();    
            history.pushState(null, null, '/'+pagePath);                                                                                          
            this.seoService.updateMeta(data['response'].seoInfo);                               
            document.body.scrollTop = document.documentElement.scrollTop = 0;      
            self.enableNextEpisodeBtn['isShow'] = (self.sectionInfo.info.attributes.isLive != "true" && self.sectionInfo.info.attributes.contentType != "movie");
            self.enableNextEpisodeBtn['btnText'] = ((self.sectionInfo.info.attributes.contentType == "tvshowepisode") ? "Next Episode" : "Next Video");                     
            (self.enableNextEpisodeBtn['isShow'] && self.getNextVideoPreInfo())  // newly added by 671 

        }
        else{
            this.router.navigateByUrl('/'+pagePath);
        }       
        }, error => {
        //console.log('error occurred in get app data');
        });  
    }


     private getNextProgramMetaDataInterval(pagePath){
        
        let self = this; 
        let locationURL = (!!this.userService.staticInitData.guideURL ? this.userService.staticInitData.guideURL : this.userService.staticInitData.api);  
        console.log(locationURL, locationURL + appConfig.apiURL + 'static/player/metadata/refresh?path=' + pagePath);
        let url = locationURL + appConfig.apiURL + 'static/player/metadata/refresh?path=' + pagePath;
        this.dataManager.getData(url).subscribe(data => {
        if (data['status']) {                                                            
            for(let i=0; i< data['response'].data.length; i++){
                if(data['response'].data[i].paneType == "content"){
                    this.sectionInfo = data['response'].data[i].content;
                    this.sectionInfo['streamStatus'] = { 'hasAccess' : true };
                    this.sectionInfo['shareInfo'] = data['response'].shareInfo;
                    this.sectionInfo['info'] = data['response'].info;
                    this.sectionInfo['sectionData'] = data['response'].data;
                    this.sectionInfo['pageButtons'] = data['response'].pageButtons;
                    this.sectionInfo['adUrlResponse'] = data['response'].adUrlResponse;
                    this.sectionInfo['tabsInfo'] = data['response'].tabsInfo;                                                                                  
                }
            }            
            this.initProcess();
            this.checkShowMoreBtn();                                             
            this.metaPollTime = Number(this.sectionInfo.info.attributes.endTime) - new Date().getTime();  
            console.log(this.metaPollTime + ' --3');
            (!!this.metaPollTime && (this.metaPollTime > 0) && (this.sectionInfo.info.attributes.isLive == "true")) && this.getNextProgramMetaData();                                                                                                      
            this.seoService.updateMeta(data['response'].seoInfo);           
            //this.initVideoAnalytics();                                          
        }
        else{
            this.router.navigateByUrl('/'+pagePath);
        }       
        }, error => {
        //console.log('error occurred in get app data');
        });  
    }

    public getNextProgramMetaData(){
      
        let delay = (!!this.sectionInfo['info'].attributes.programRefreshDelayInMillis ? parseInt(this.sectionInfo['info'].attributes.programRefreshDelayInMillis) : 0);
        this.metaPollInit = setTimeout(() =>{
            //this.isVideoPlaying = false;        
            //this.appConfig.siteSettings.internalVideoAnalaticsEnable && this.plugin && this.plugin.handlePlayEndedByUser();
            //this.userService.setIsAutoPlay(true);
            clearTimeout(this.metaPollInit);
            this.getNextProgramMetaDataInterval(this.currentChannelInfo);            
        }, Math.abs(this.metaPollTime) + 40000 + delay);   //40000 added for late  



    } 

    initProcess() {        

        setTimeout(() =>{
            this.initSectionSlick();                  
        }, 20);      

        setTimeout(() => {
            this.selectedSection = this.sectionInfo.tabsInfo.selectedTab;    // getting select tab from respose
            this.selectedSectionIndex = '';

            for (let j = 0; j < this.sectionInfo.sectionData.length; j++) {  // day number comes for catup scenario. 
                if (this.sectionInfo.sectionData[j].paneType == 'section') {
                    if (this.selectedSection == this.sectionInfo.sectionData[j].section.sectionInfo.code) {
                        this.selectedSectionIndex = j;
                        // _self.userService.selectFilterTab(_self.sectionInfo.sectionData[j]);
                        break;
                    }
                }
            }

            if (!this.selectedSectionIndex) {   // day_wise_epg comes for live scenario. so get first index from section data.                            
                if (this.sectionInfo.sectionData.length > 1) {
                    let i = 0;
                    for (let j = 0; j < this.sectionInfo.sectionData.length; j++) {
                        if (this.sectionInfo.sectionData[j].paneType == 'section' && i == 0) {
                            i = i + 1;
                            this.selectedSection = this.sectionInfo.sectionData[j].section.sectionInfo.code;
                            this.selectedSectionIndex = j;
                        }
                    }
                }
            }

        }, 5);

        this.player.nativeElement.style.height = (this.player.nativeElement.clientWidth * 0.547) + 'px';    

        setTimeout(() =>{
            if (this.checkmCustomScrollBar()) {
                this.relatedShowsHeight = this.playerBlockHeight = (this.playerLeft.nativeElement.clientHeight + 200) + 'px';
            }           
        },0);
    }

    ngOnDestroy() {
        (!!this.streamData) && this.endActiveStream(this.streamData.sessionInfo.streamPollKey);
        (!!this.sub) && this.stopTimer();
        (!!this.seekBackTimer) && this.seekBackTimer.unsubscribe();
        (!!this.userSessionSub) && this.userSessionSub.unsubscribe();   // unsubscribe user session intervals
        (!!this.playerPageSub) && this.playerPageSub.unsubscribe();   // unsubscribe playerPageSub      
        (!!this.playerInstance) && this.playerInstance();
        
        if (!!this.playerSetup && this.windowRef.isWindowAvailable()) {
            this.appConfig.siteSettings.internalVideoAnalaticsEnable && this.plugin && this.plugin.handlePlayEndedByUser();
            this.isThumbnailStatus = false;        
            this.playerSetup = false;
            this.jwPlayerObj.stop();   
            this.jwPlayerObj.remove();  
            this.commonService.setJwPlayerObject(''); 
            this.userService.setNavigationFrom(this.pagePath)        
        }
       
        (this.sectionInfo.info.attributes.isLive == "true") && (this.dataManager.storeStaticString('last_channel_info',this.currentChannelInfo || this.pagePath));   

        (!!this.metaPollInit) && (clearTimeout(this.metaPollInit));

        (!!this.concurPollInitId) && clearInterval(this.concurPollInitId); 

         //local now external poll call
        if(!!this.localNowObj) {
            this.startLocalNowPoll("false");
            this.localNowObj = '';
            !!this.externalPollTimer && (clearInterval(this.externalPollTimer)); 
        } 

        (!!this.ccId) && clearInterval(this.ccId);
        this.commonService.setResume(false);
    }   

    checkmCustomScrollBar() {
        switch (this.breakPoint) {
            case 'tabletLandscape':
            case 'desktop':
                return true;
            default: return false;
        }
    } 

    initSectionSlick() {               
        try {                                
            if (this.checkmCustomScrollBar()) {              
                $("#content2").mCustomScrollbar({                   
                    theme: "dark-2",
                    scrollInertia: 500,
                    scrollEasing: "linear",
                    scrollbarPosition: "inside",
                    mouseWheel: { scrollAmount: 300 },
                    callbacks: {
                        whileScrolling: () => {
                            if (!!this.paginationFlag) {
                                this.paginationFlag = false
                                this.getSectionPaginationData();
                            }
                        }
                    }                    
                });
            }
        }
        catch (e) {
            //console.log(e);
        }
    }    

    getCharCount() {
        //this.breakPoint = Utility.getBreakPointType();   
        switch (this.breakPoint) {
            case 'mobile-common': return 80;
            case 'mobile-common-land': return 100;
            case 'mobile-big-land': return 140;
            case 'mobile': return 200;
            default: return 260;
        }
    }

    /* description show more functionality*/
    checkShowMoreBtn() {
        this.programExpiryString = undefined;
        this.availableUntil = undefined;
        for (let i = 0; i < this.sectionInfo.dataRows.length; i++) {
            let rowData = this.sectionInfo.dataRows[i];
            if (rowData.rowDataType == "content") {
                for (let j = 0; j < rowData.elements.length; j++) {
                    if (rowData.elements[j].elementType == "description") {
                        this.contentDescriptionTemp = rowData.elements[j].data;
                        if (rowData.elements[j].data.length > this.charCount) {
                            this.showMoreBtn = true;
                            this.showMoreBtnText = 'Show more';
                            this.contentDescription = (rowData.elements[j].data.substring(0, this.charCount)) + '....';
                        }
                        else {
                            this.showMoreBtn = false;
                            this.contentDescription = rowData.elements[j].data;
                        }
                    }
                    else if ((rowData.elements[j].elementType == 'marker') && (rowData.elements[j].elementSubtype == 'special')) {
                        ((rowData.elements[j].data == 'socialShare')) && (this.isSocialSharingEnabled == true);
                        ((rowData.elements[j].data == 'live')) && (this.isLiveMarkerEnabled['status'] = true,this.isLiveMarkerEnabled['data'] = rowData.elements[j].data);                        
                    }
                    else if(rowData.elements[j].elementType == 'text' && rowData.elements[j].elementSubtype == "title"){
                         this.VideoTitle = rowData.elements[j].data;
                    }
                    else if(rowData.elements[j].elementType == 'text' && rowData.elements[j].elementSubtype == "subtitle5"){
                        this.subtitle5 = rowData.elements[j].data;
                    }
                    else if(rowData.elements[j].elementType == 'marker' && rowData.elements[j].elementSubtype == "exipiryDays"){
                        this.programExpiryString = rowData.elements[j].data;
                    }
                    else if(rowData.elements[j].elementType == 'marker' && rowData.elements[j].elementSubtype == "availableUntil"){
                        this.availableUntil = rowData.elements[j].data;
                    }                    
                }
            }              
        }
    }
    toggleDescription() {        
        if (this.showMoreBtnText == "Show more") {
            this.showMoreBtnText = "Show less";
            this.contentDescription = this.contentDescriptionTemp;
            let init = setTimeout(function () {
                if (this.checkmCustomScrollBar()) {
                    this.relatedShowsHeight = this.playerLeft.nativeElement.clientHeight + 200 + 'px';
                }
                clearTimeout(init);
            }, 2);
        }
        else {
            this.showMoreBtnText = "Show more";
            this.contentDescription = (this.contentDescriptionTemp.substring(0, this.charCount)) + '....';
            let init = setTimeout(function () {
                if (this.checkmCustomScrollBar()) {
                    this.relatedShowsHeight = this.playerBlockHeight;
                }
                clearTimeout(init);
            }, 2);
        }
    }
    /* description show more functionality*/         

    getStream() {
        clearInterval(this.concurPollInitId);
 
        //local now channel related.
        !!this.localNowObj && (this.localNowObj = '');
        !!this.externalPollTimer && (clearInterval(this.externalPollTimer)); 

        (!!this.ccId) && clearInterval(this.ccId);
        this.manualCCchange = false;
        (!!this.streamData) && this.endActiveStream(this.streamData.sessionInfo.streamPollKey);
        if (!!this.isStreamEncryptionEnabled) {
            let encryptObj = {
                "data": this.ottGlobalService.encryptData(JSON.stringify({ "path": this.sectionInfo.info.path })),
                "metadata": this.ottGlobalService.encryptData(JSON.stringify({ "request": "page/stream" })),
            }
            this.dataManager.postEncryptData(this.userService.staticInitData.api + appConfig.apiURL + 'send', encryptObj).subscribe(res => {
                let data = JSON.parse(this.ottGlobalService.decryptData(res['data']));                    
                this.initStreamData(data);  
                                  
            }, error => {
                //console.log('error');
            });
        }
        else {
            this.dataManager.getData(this.userService.staticInitData.api + appConfig.apiURL + 'page/stream' + '?path=' + this.sectionInfo.info.path).subscribe(res => {
                let data = res;
                this.initStreamData(data);

            }, error => {
                //console.log('error');
            });
        }
    }
    

    initStreamData(data) {        
           
        if (data.status) {
            this.streamData = data.response;
            this.windowRef.isWindowAvailable() && this.initVideoAnalytics();            
            this.streamUrl = data.response.streams[0];     
            var drmStreamData = [];
            (data.response.streams.length > 1 ) && (data.response.streams.sort((a,b) => (a.streamType < b.streamType) ? 1 : ((b.streamType < a.streamType) ? -1 : 0)));
            for (let strData of data.response.streams) {  
               if (strData.streamType == 'fairplay') {
                    strData.keys.licenseKey = strData.keys.licenseKey.replace('http:', 'https:')                    
                    drmStreamData.push(
                        {
                            file: strData.url,
                            drm: {
                                "fairplay": {
                                    "certificateUrl": 'assets/fairplay.cer',
                                    "processSpcUrl": strData.keys.licenseKey,

                                    licenseRequestHeaders: [
                                        { name: 'Content-type', value: 'application/octet-stream' }
                                    ],
                                }
                            },
                        }
                    )
                }
                else if (strData.streamType == 'widevine') {
                    strData.keys.licenseKey = strData.keys.licenseKey.replace('http:', 'https:')                    
                    drmStreamData.push(
                        {
                            file: strData.url,
                            drm: {
                                "widevine": {
                                    "url": strData.keys.licenseKey
                                }
                            }
                        }
                    )
                }
                else if (strData.streamType == 'playready') {
                    strData.keys.licenseKey = strData.keys.licenseKey.replace('http:', 'https:')                    
                    drmStreamData.push(
                        {
                            file: strData.url,
                            drm: {
                                "playready": {
                                    "url": strData.keys.licenseKey
                                }
                            }
                        }
                    )
                } else {                
                    var isLive;
                    if (this.sectionInfo.info.attributes.contentType == 'epg') {
                        for (let datarow of this.sectionInfo.dataRows) {
                            if (datarow.rowDataType == 'content') {
                                for (let element of datarow.elements) {
                                    if (element.elementType == 'marker' && element.elementSubtype == 'special' && element.data == 'live') {
                                        isLive = true;
                                        break;
                                    }
                                }
                            }
                            if (!!isLive) {
                                break;
                            }
                        }
                    } 

                    //local now related code
                    this.localNowObj = (((strData.streamType == "LocalNow") && !!strData.params.localNowSessionId) ? strData.params : '');                                   
                    //

                    let source = {
                        file: strData.url,
                        default: false,
                        label: "0",
                        preload: "metadata",
                    };
                    source['type'] = 'hls';
                    //(!!isLive) && (source['withCredentials'] = true);
                    drmStreamData.push(
                        source
                    )
                }
            }
            this.defaultCCLang = undefined;
            this.playSource = [{
                sources: drmStreamData,
                "tracks": (!!data.response.streams[0].closeCaptions) ? this.processCaptions(data.response.streams[0].closeCaptions)  : []
            }];

           
           
            this.playerSetup = true;
            this.startPlay(this.playSource, this.sectionInfo, this.plugin);
            
        } else if (data.error.code == -14 || data.error.code == -16 || data.error.code == 402) {
            this.streamNotAvail = data.error.message;
        }
    }


    initVideoAnalytics() { 


        let customData = ((!!this.streamData && !!this.streamData.analyticsInfo.customData) ? this.streamData.analyticsInfo.customData : '');
        (!!customData) && (customData = JSON.parse(customData));
        let contentMetaData = {
            CDNetwork: (!!this.streamData) ? this.streamData.streams[0].streamType : '',
            navigationFrom: ((!!this.userService.getNavigationFrom()) ? this.userService.getNavigationFrom() : this.sectionInfo.info.path),
            metaId: (!!this.streamData) ? this.streamData.analyticsInfo.dataKey : '', //  set content identifier.
            metaMap: '',         // currently we are sending empty value.
            a1: ((!!this.streamData && !!this.streamData.analyticsInfo.customData) ? this.streamData.analyticsInfo.customData : ''),
            a2: '',
        };
        let userMetaData = {
            userId: (!!this.userDetails) ? this.userDetails.userId : '',
            boxId: (!!this.boxId) ? this.boxId : '',
            deviceType: 'web',
            deviceClient: (!!this.plugin) && this.plugin.getBrowserName(),
            deviceOS: (!!this.plugin) && this.plugin.getPlatForm(),            
            isSubscribed: ((!this.userDetails || !customData) ? '0' : (!!customData && (customData.packageType == "demo" || customData.packageType == "free")) ? '0' : '1'),
        };
        let videoMetaData = {
            autoplay: (!!(this.userService.getIsAutoPlay()) ? true : false),
            productName: !!this.userService.staticInitData ? this.userService.staticInitData.tenantCode.toLocaleLowerCase() : "", // new requirement send tenant code 
            streamURL: (!!this.streamData) ? this.streamData.streams[0].url.split('?')[0] : "",
            contentType: (!!this.streamData) ? this.streamData.analyticsInfo.contentType : "",
        };

        // setting meta data.
        if (!!this.plugin) {
            this.plugin.setContentMetaData(contentMetaData);
            this.plugin.setUserMetaData(userMetaData);
            this.plugin.setVideoMetaData(videoMetaData);
        }
    }


    startPlay(stream, provider, plugin) {        

        let _self = this;
        let videoAnalaticsEnable = _self.appConfig.siteSettings.internalVideoAnalaticsEnable;
        let isAddPlaying = false;       
        let timeStamp = new Date();  
        this.manualCCchange =false;
        //ad settings
        this.advertising = {};
        if(this.systemConfigs.supportVideoAds !== "false"){
            this.advertising.client = 'vast';
            this.advertising.locale  = "en"; 
            let karray = [];           
            for (let eachAd of this.adInfo.adUrlTypes) {
                this.advertising.client = ((!!eachAd.position) && (!!eachAd.position.adType)) ? eachAd.position.adType :  this.advertising.client;
                this.advertising.client = this.advertising.client.toLowerCase(); 
                if(eachAd.url != undefined){   
                    var adurl =eachAd.url.replace("[timestamp]",timeStamp.getTime())            
                    if (eachAd.urlType == 'preRollUrl' || eachAd.urlType == 'preUrl') { 
                        karray.push({
                        "tag": adurl,                  
                            "offset": "pre"
                        });                                      
                    }
                    else if ((eachAd.urlType == 'postRollUrl' || eachAd.urlType == 'postUrl')  && this.sectionInfo.info.attributes.isLive != "true") {             
                        karray.push({
                            "tag": adurl,
                            "offset": "post"
                        });               
                    }
                    else if ((eachAd.urlType == 'midRollUrl' || eachAd.urlType == 'midUrl') && this.sectionInfo.info.attributes.isLive != "true") {
                        if(!!eachAd.position && (!!eachAd.position.interval || !!eachAd.position.offset) ){  
                            if(!!eachAd.position.offset){              
                                karray.push({
                                    "tag": adurl,
                                    "offset": eachAd.position.offset
                                }); 
                            }else{
                                eachAd.position.offset = "0";
                            }
                            if(!!eachAd.position.interval){
                                let offset = parseInt(eachAd.position.offset);
                                if(!!this.sectionInfo.streamStatus && !!this.sectionInfo.streamStatus.totalDurationInMillis){
                                    let totalDuratation = Math.round(Math.abs(this.sectionInfo.streamStatus.totalDurationInMillis/1000));   
                                    offset += parseInt(eachAd.position.interval);
                                    while(totalDuratation >= offset){
                                        karray.push({
                                            "tag": adurl,
                                            "offset": offset.toString()
                                        }); 
                                        offset += parseInt(eachAd.position.interval);
                                    }
                                }
                            }                        
                        }else{                       
                            karray.push({
                                "tag": adurl,
                                "offset": '50%'
                            }); 
                        }    
                                    
                    }
                }
            }       
            this.advertising.schedule = karray; 
        }
        
        
            let jwSetUp = {
                playlist: stream,
                advertising: this.advertising,
                primary: 'html5',
                abouttext: appConfig.appName + this.browserAgent.browser,
                width: "100%",
                // height: "100%",
                autostart: true,
                preload: "auto",
                mute: false,
                aspectratio: '16:9',   
                floating: (Utility.windowWidth <= 720) ? false:true,  //to disable floating plyer in mobiles YOP-9438                    
                logo: {
                    file: ((this.isWaterMarkLogoEnabled) && (appConfig.waterMarkLogo)),
                    position: "top-left",
                },
                events: {
                    ready : (data)=>{                    
                        this.commonService.setJwPlayerObject(this.jwPlayerObj); 
                    },
                    play: (data) => {                                                                                                
                        if(!!this.concurStreamStatusObj && !!this.concurStreamStatusObj.message){                                                     
                            this.jwPlayerObj.stop();  
                        }
                        else{
                            playEvent(data);  
                        } 
                    },
                    pause: (data) => {                    
                        ((!!this.isBuffering) ? this.jwPlayerObj.play() : pauseEvent());                                                 
                    },
                    buffer: (data) => {
                        bufferEvent(data);
                        _self.adjustBitRateQuality();
                    },
                    seek: (data) => {
                        seekEvent(data);
                    },
                    seeked : () =>{
                        if (!!this.seekBack) {
                            this.jwPlayerObj.seek(this.maxFastForward);
                            this.seekBack = false;
                        }
                    },
                    complete: (data) => {
                        completeEvent(data);
                        (!!this.concurPollInitId) && clearInterval(this.concurPollInitId);                        
                        (!!this.ccId) && clearInterval(this.ccId);
                    },
                    error: (data) => {                                       
                        errorEvent(data);  
                        clearInterval(this.concurPollInitId);
                        
                        //local now external poll call
                        !!this.localNowObj && (this.startLocalNowPoll("false"),this.localNowObj = '');
                        !!this.externalPollTimer && (clearInterval(this.externalPollTimer));                          
                       
                        (!!this.ccId) && clearInterval(this.ccId);
                        (!!this.streamData) && this.endActiveStream(this.streamData.sessionInfo.streamPollKey);  
                        this.showStartOver = false;                                                                                
                        this.lastChannelInfo = '';
                        this.showGolive = false;                              
                        if(data.code == 232404) {                                            
                           this.showErrorSlate = true;
                        }                                                                                      
                    }, 
                    setupError : (data) => {                                     
                        clearInterval(this.concurPollInitId);   
                        //local now external poll call
                        !!this.localNowObj && (this.startLocalNowPoll("false"),this.localNowObj = '');                         
                        
                        (!!this.ccId) && clearInterval(this.ccId);
                        (!!this.streamData) &&  this.endActiveStream(this.streamData.sessionInfo.streamPollKey);   
                        this.showStartOver = false;                                                                                
                        this.lastChannelInfo = '';
                        this.showGolive = false;                                                                                      
                    },
                    fullscreen : (data) => {
                        this.userService.isfullscreen('true');
                        $('#player .fullScreenOverlay').remove();
                        if(_self.isPause){
                            fullScreenOverlay();
                        }
                    },
                    cast : (data) => {
                       // console.log(data);                       
                    },
                    levelsChanged : (data) => {  // if user selects heigher bitrate against to specified bitrate resetting to lower bitrate.                                                                                                           
                              
                        // if(!!this.streamData.maxBitrateAllowed) {
                        //     if ((!data.levels[data.currentQuality].bitrate || (!!data.levels[data.currentQuality].bitrate && (this.streamData.maxBitrateAllowed * 1024) < data.levels[data.currentQuality].bitrate))) {
                        //         (data.currentQuality != (data.levels.length - 1)) && adjustBitRateQuality();                                                                     
                        //     } 
                        // }                            
                    },   
                    visualQuality : (data) =>{
                      
                    } ,             
                    time : (data) =>{ 
                        if(this.showScteAds == true){                            
                            for(let element of this.scteAdBlockData.adTimeSlots) {
                                if(element.isinit == true &&  data.position > (element.offset + 5) ) element.isinit = false;
                                if( element.offset == Math.round(data.position) && data.position > element.offset && element.isinit == false ) {
                                    element.isinit =true;
                                    element.isAdplayed = true;
                                    this.loadDynamicAd(element,this.scteAdBlockData.streamAdUrl);
                                    break;
                                } 
                                // ad play after seek  or skip also
                                /*else if ( data.position > element.offset && element.isAdplayed == false ){
                                    element.isinit =true;
                                    element.isAdplayed = true;
                                    for(let ele of this.scteAdBlockData.adTimeSlots){
                                        if( ele.offset < data.position ){
                                            ele.isinit =true;
                                            ele.isAdplayed = true;
                                        }
                                    }
                                    this.loadDynamicAd(element,this.scteAdBlockData.streamAdUrl);
                                    break;
                                } */
                            }
                        }       
                        
                        // update Test to LIVE for dvr streams   671
                        //$('.jw-dvr-live').text("LIVE");//
                        $('.jw-text-live.jw-dvr-live').text("LIVE");
                    },
                    firstFrame : () =>{
                        if(this.sectionInfo.info.code == "new_live_player"){
                            $('.jw-slider-time').hide();
                        }else{
                            $('.jw-slider-time').show();
                        }
                        (this.systemConfigs.supportVideoAds != 'false') && this.getAdData();
                                               
                        // stop player when concur stream and max session error come                                                                        
                        (_self.sectionInfo.info.code == "new_live_player" && !!this.concurStreamStatusObj && !!this.concurStreamStatusObj.message) &&  this.jwPlayerObj.stop();                                                                                                                                                                                                                 
                        
                    },
                    beforePlay : ()=>{
                        this.manualCCchange =false;                        
                    } ,   
                    captionsChanged : () =>{
                        this.storeCaptions();
                    }                                    
                },
                cast: {  }                    
            }; 

            this.jwPlayerObj = this.commonService.getJwPlayerObject();
            (!this.jwPlayerObj) && (this.jwPlayerObj = jwplayer('player'));
            this.jwPlayerObj.setup(jwSetUp);
                           
        this.jwPlayerObj.on('adPlay', function(data) {
            console.log('Ad started');
          //  _self.renderer2.setStyle(_self.elementRef.nativeElement.querySelector('.player-btn'), 'display' , 'none');
            _self.isAdloading = true;
            if (_self.isBuffering) {
                _self.plugin.handleBufferEnd();
                _self.isBuffering = false;
            }

            if (!_self.isAdPlaying) {
                _self.isVideoPlaying = false;
               _self.isAdPlaying = true; 
               if(!_self.isThumbnailStatus){
                   videoAnalaticsEnable && _self.plugin.thumbnailVideoClick();
                   videoAnalaticsEnable && _self.plugin.handlePlayerLoad(); 
                   _self.isThumbnailStatus = true;
               }

                _self.plugin.handleAdStarted({ adType: _self.keyAdd[data.adposition] });
            }
        }); 

        this.jwPlayerObj.on('adSkipped', function(data) {
            console.log('Ad skipped');
            //_self.renderer2.setStyle(_self.elementRef.nativeElement.querySelector('.player-btn'), 'display' , 'inline-block');
            _self.isAdloading = false;
            _self.isAdPlaying = false;
            _self.plugin.handleAdSkipped({ adType: _self.keyAdd[data.adposition] });
            _self.plugin.handleAdEndedByUser({ adType: _self.keyAdd[data.adposition] });
       }); 

        this.jwPlayerObj.on('adComplete', function(data) {
            console.log('Ad completed');
            _self.adloader=setTimeout(() => {
                if(_self.isAdloading == true){
                    _self.isAdPlaying = false;
                    _self.isAdloading = false;
                }
            },2000);
            //_self.renderer2.setStyle(_self.elementRef.nativeElement.querySelector('.player-btn'), 'display' , 'inline-block');
            
           
            _self.plugin.handleAdCompleted({ adType: _self.keyAdd[data.adposition] });
        }); 

        this.jwPlayerObj.on('adError', function(data) {
            console.log('Ad Error');
           // _self.renderer2.setStyle(_self.elementRef.nativeElement.querySelector('.player-btn'), 'display' , 'inline-block');
            _self.isAdPlaying = false;
            _self.isAdloading = false;
        }); 
      
        this.jwPlayerObj.on('adMeta',function(data){
            console.log("AdMeta");
            _self.isAdloading = true; 
            (!!_self.adloader) && clearTimeout(_self.adloader);  
        });


        //  player events for @IA
        function playEvent(data) {
            _self.nextVideosList = [];
              $('#player .fullScreenOverlay').remove(); 
            let pauseIcon = document.getElementById("pause-icon-div");
            (!!pauseIcon) && (pauseIcon.remove());

            if (!_self.isVideoPlaying) {
                // initiate analytics events
                if(!_self.isThumbnailStatus){
                   videoAnalaticsEnable && _self.plugin.thumbnailVideoClick();
                   videoAnalaticsEnable && _self.plugin.handlePlayerLoad(); 
                   _self.isThumbnailStatus = true;
               }

                
                          
                 
                if(provider.streamStatus.seekPositionInMillis > 0 && _self.commonService.getResume()) {
                    _self.jwPlayerObj.seek((provider.streamStatus.seekPositionInMillis / 1000));
                    _self.showStartOver = true;
                    //_self.commonService.setResume(false);
                    let pData = {                                                                                      
                        "Player_Controls" : 'Play Start',
                        "Bit_Rate" : 'Not Available',
                        "Subtitle" : 'Not Available',        
                        "Player_State" : (!!_self.jwPlayerObj ?  _self.jwPlayerObj.getState() : 'Not Available'),          
                        "Player_Position" :  provider.streamStatus.seekPositionInMillis,   
                    }; 
                    
                    if(_self.isReplaying){
                        pData['eventAction']= 'Replay Click';
                    }

                    if(_self.isNextVideo){
                        pData['eventAction']= 'Next Video Click';
                    }

                    if(_self.isLastChannelClick){
                        pData['eventAction']= 'Last Channel Click'
                    }

                    if(_self.commonService.getStartOver()){
                        pData['eventAction']= 'Start Over Click';
                    }

                    _self.isLastChannelClick = false;
                    _self.sendCleverTapEvents(pData);
                }
                else{
                    let pData = {                                                                                      
                        "Player_Controls" : 'Play Start',
                        "Bit_Rate" : 'Not Available',
                        "Subtitle" : 'Not Available',        
                        "Player_State" : (!!_self.jwPlayerObj ?  _self.jwPlayerObj.getState() : 'Not Available'),          
                        "Player_Position" :  (!!_self.jwPlayerObj ? Math.floor(_self.jwPlayerObj.getPosition() * 1000) : 'Not Available'),   
                    }; 
                    if(_self.isReplaying){
                        pData['eventAction']= 'Replay Click';
                    }

                    if(_self.isNextVideo){
                        pData['eventAction']= 'Next Video Click';
                    }

                    if(_self.isLastChannelClick){
                        pData['eventAction']= 'Last Channel Click'
                    }

                    if(_self.commonService.getStartOver()){
                        pData['eventAction']= 'Start Over Click';
                    }

                    _self.isLastChannelClick = false;
                    
                    _self.sendCleverTapEvents(pData);
                } 
                
                    
                
                
                (_self.sectionInfo.info.attributes.isLive == "true") && _self.commonService.getStartOver() && (_self.openPlayerStartOver(),_self.commonService.setStartOver(false));                 
                                                                      
                _self.isVideoPlaying = true;
                _self.userService.setIsAutoPlay(false);
                videoAnalaticsEnable && plugin.handlePlayStarted();
                _self.adjustBitRateQuality();
              
                _self.concurPollInitId = setInterval(() => {
                        _self.concurrenceStreamRequest();                       
                }, Math.abs(_self.streamData.sessionInfo.pollIntervalInMillis));
                
                _self.setCaptions();
                               
                _self.ccId = setInterval(() => {
                    _self.setCaptions();                       
                },20000);

                // hide seek bar when live and non recorded programs
                if((_self.sectionInfo.info.code == "epg_player" && _self.sectionInfo.info.attributes.isRecorded == "false")){
                    _self.maxFastForward = (_self.commonService.getResume() ? (provider.streamStatus.seekPositionInMillis / 1000) : _self.jwPlayerObj.getPosition());   
                    _self.startFastForwardTimer();                                       
                }

                _self.commonService.getResume() && _self.commonService.setResume(false);
               
                //let cc = _self.dataManager.retrieveStaticString('closed_caption');
                // if(cc == "true"){
                //     console.log(_self.jwPlayerObj.getCaptionsList())
                //     _self.jwPlayerObj.setCurrentCaptions(_self.jwPlayerObj.getCaptionsList().length - 1);
                //     _self.captionFlag = true;
                // }
                // else{
                //     _self.jwPlayerObj.setCurrentCaptions(0)
                // }

                //(cc == "true") ? (_self.jwPlayerObj.setCurrentCaptions(_self.jwPlayerObj.getCaptionsList().length - 1)) : (_self.jwPlayerObj.setCurrentCaptions(0));                             

                _self.isNextVideo = false;
                _self.isReplaying = false; 

                //localnow national feed by 671
                if(!!_self.localNowObj && !!_self.localNowObj.nationalFeedMessage){
                    let localNowTimer = setTimeout(()=>{                        
                        _self.localNowObj.nationalFeedMessage = "";   
                        clearTimeout(localNowTimer);                 
                    },parseInt(_self.localNowObj.messageTimeout) * 1000);                                         
                }    
                if(!!_self.localNowObj && !!_self.localNowObj.localNowSessionId){
                    _self.externalPollTimer = setInterval(() => {
                        _self.startLocalNowPoll("true");                       
                    }, (_self.systemConfigs.localNowPollingInterval * 1000) || 60000);
                }            
            }
            if (!!_self.isVideoPlaying && _self.isBuffering) {
                _self.isBuffering = false;
                videoAnalaticsEnable && plugin.handleBufferEnd();
                let pData = {                                                                                                                        
                    "Player_Controls" : 'Buffer End',
                    "Bit_Rate" : _self.jwPlayerObj.getQualityLevels()[_self.jwPlayerObj.getCurrentQuality()].label,                                
                    "Player_Position" :  (!!_self.jwPlayerObj ? _self.jwPlayerObj.getPosition() * 1000 : 'Not Available'),      
                    "Player_State" : (!!_self.jwPlayerObj ?  _self.jwPlayerObj.getState() : 'Not Available'),                                                
                };                                                    
                _self.sendCleverTapEvents(pData);
            }
            if (_self.isPause) {
                _self.isPause = false;
                videoAnalaticsEnable && plugin.handleResume();
                let bit_Rates = _self.jwPlayerObj.getQualityLevels()[_self.jwPlayerObj.getCurrentQuality()];
                let pData = {                   
                    "Player_Controls" : 'Resume',                    
                    "Subtitle" : 'Not Available',      
                    "Player_State" : (!!_self.jwPlayerObj ?  _self.jwPlayerObj.getState() : 'Not Available'),  
                    "Player_Position" :  (!!_self.jwPlayerObj ? Math.floor(_self.jwPlayerObj.getPosition() * 1000) : 'Not Available'),  
                    "Bit_Rate" : !!bit_Rates ? bit_Rates.label : "Not Available",
                };
                _self.sendCleverTapEvents(pData);
            }
            
        }       
       
        
        function pauseEvent() {         
            if (!_self.isPause) {
                _self.isPause = true;
                videoAnalaticsEnable && plugin.handlePause(); 
                let bit_Rates = _self.jwPlayerObj.getQualityLevels()[_self.jwPlayerObj.getCurrentQuality()];
                let pData = {
                    "Player_Position" :  (!!_self.jwPlayerObj ? _self.jwPlayerObj.getPosition() * 1000 : 'Not Available'),    
                    'Player_Controls' : 'Pause',
                    "Player_State" : (!!_self.jwPlayerObj ?  Math.floor(_self.jwPlayerObj.getState()) : 'Not Available'),  
                    "Bit_Rate" : !!bit_Rates ? bit_Rates.label : "Not Available",     
                }
               _self.sendCleverTapEvents(pData); 
                      fullScreenOverlay();                                                                                                                                       
            }
        }

        function fullScreenOverlay(){
            $('#player .fullScreenOverlay').remove();
             if(!!_self.jwPlayerObj.getFullscreen()){
                  $('#player').append(function () {
                        var playerMetaData = '<div  class="fullScreenOverlay"><div class="fullScreenOverlayInner">'
                        console.log('overlay div');
                        _self.sectionInfo.dataRows.map(function(datarow, i){
                        playerMetaData += '<div class="repeater">';
                        if(datarow.rowDataType=='content'){
                           
                            playerMetaData += '<div class="prog_det_loop det_row_no_'+i+'">';
                            datarow.elements.map(function(element, ind){

                            if(element.data != '') {
                                playerMetaData += '<div class="pull-left page_type_'+_self.sectionInfo.info.attributes.contentType+'">';
                                if(element.elementType=='image'){
                                     playerMetaData += '<span class="channel_desc_thumb">';
                                     var imagePath = _self.getImagePath(element.data);
                                     playerMetaData += '<img class="channel_img" src="'+imagePath+'">';
                                     playerMetaData += '</span>';
                                }

                                if(element.elementType=='text' && element.elementSubtype == 'title'){
                                    var titleClass;
                                    if(i == 0){
                                        titleClass = 'ott-video-title';
                                    }

                                    if(i==1){
                                        titleClass = 'ott-video-subtitle';
                                    }
                                    playerMetaData += ' <div class="ott-year ott-text-font rowNumber_'+element.rowNumber+' '+_self.sectionInfo.info.attributes.contentType+' '+titleClass+'">';
                                    playerMetaData += '<h1 class="subtext1">'+element.data+'</h1>';
                                    playerMetaData +='</div>';
                                }

                                if(element.elementType=='text' && element.elementSubtype != 'title' && element.elementSubtype != 'subtitle5' && element.elementSubtype !='cast'){
                                    var titleClass;
                                    if(i == 0){
                                        titleClass = 'ott-video-title';
                                    }

                                    if(i == 1){
                                        titleClass = 'ott-video-subtitle';
                                    }
                                    playerMetaData +='<p class="ott-year ott-text-font rowNumber_'+element.rowNumber+' '+_self.sectionInfo.info.attributes.contentType+' '+titleClass+'">';
                                    playerMetaData +='<span class="subtext1">'+element.data+ ((i == 1 && !!_self.subtitle5) ? _self.subtitle5 : '')+'</span> ';   
                                    // adding subtitle5 to row 1 (subtitle)        
                                    playerMetaData +='</p>';
                                }
                                                                                              
                                playerMetaData +='</div>';
                            } 
                            });
                           
                            playerMetaData +='</div>'; 

                            // appending expiry markers. 
                            console.log(i);                            
                            if(i==2){  
                                (!!_self.availableUntil) && (playerMetaData +='<div class="exp available_until"><span class="desk program_expiry_marker">'+ _self.availableUntil+' </span> </div>');      
                                (!!_self.programExpiryString) && (playerMetaData +='<div class="exp"><span class="desk program_expiry_marker">'+ _self.programExpiryString+' </span> </div>');                                      
                            }
                        }
                        playerMetaData +='</div>';
                        
                       

                        });
                        
                        playerMetaData +='</div></div>';
                        return playerMetaData;
                    })
                } 
        }
        function pauseClick() {
            _self.jwPlayerObj.play();
        }
        function bufferEvent(data) {
            if (!!_self.isVideoPlaying && !_self.isBuffering) {
                _self.isBuffering = true;
                videoAnalaticsEnable && plugin.handleBufferStart();
                let pData = {                                                                                                                        
                    "Player_Controls" : 'Buffer Start',
                    "Bit_Rate" : _self.jwPlayerObj.getQualityLevels()[_self.jwPlayerObj.getCurrentQuality()].label,                                
                    "Player_Position" :  (!!_self.jwPlayerObj ? Math.floor(_self.jwPlayerObj.getPosition() * 1000) : 'Not Available'),    
                    "Player_State" : (!!_self.jwPlayerObj ?  _self.jwPlayerObj.getState() : 'Not Available'),                                                
                };                                                    
                _self.sendCleverTapEvents(pData);
            }

            let pauseIcon = document.getElementById("pause-icon-div");
            (!!pauseIcon) && (pauseIcon.remove());
        }
        function errorEvent(data) {
            if (_self.windowRef.isWindowAvailable() && videoAnalaticsEnable) {
                plugin.thumbnailVideoClick();
                plugin.handlePlayerLoad();
                plugin.handleError({ errorMsg: (!!data && !!data.message) ? data.message : "network error" });
            }            
        }
        function completeEvent(data) {            
            _self.isVideoPlaying = false;
            videoAnalaticsEnable && plugin.handlePlayCompleted();
            _self.isThumbnailStatus = false;
            let pData = {                                                                                                                        
                "Player_Controls" : 'Play Completed',
                "Bit_Rate" :  'Not Available',                                
                "Player_Position" :  (!!_self.jwPlayerObj ? Math.floor(_self.jwPlayerObj.getPosition() * 1000) : 'Not Available'), 
                "Player_State" : (!!_self.jwPlayerObj ?  _self.jwPlayerObj.getState() : 'Not Available'),                                                
            };  
            var elem = document.getElementById("replay-btn");
            !!elem && (elem.setAttribute("style", "display:block;"));                                                 
            _self.sendCleverTapEvents(pData);            
            if (!!_self.appConfig.siteSettings.isAutoPlayEnable) {
                _self.getNextVideos(true);                
            }
        }
        function seekEvent(data) {
            if (!!_self.isVideoPlaying) {
                (data.offset == 0) && (data.offset = 1) 
                videoAnalaticsEnable && plugin.handleSeek({ STPosition: Math.floor((data.position) * 1000), ETPosition: Math.floor((data.offset) * 1000) });
                let pData = {                                                                                                                        
                    "Player_Controls" : 'Seek',
                    "Bit_Rate" : _self.jwPlayerObj.getQualityLevels()[_self.jwPlayerObj.getCurrentQuality()].label,                                
                    "Player_StartPosition" :  Math.floor((data.position) * 1000),
                    "Player_EndPosition" :  Math.floor((data.offset) * 1000),   
                    "Player_State" : (!!_self.jwPlayerObj ?  _self.jwPlayerObj.getState() : 'Not Available'),                                                
                };                                                    
                

                if((_self.sectionInfo.info.code == "epg_player" && _self.sectionInfo.info.attributes.isRecorded == "false")){                                                                          
                    if (!!_self.maxFastForward && (_self.maxFastForward < data.offset)) {
                        _self.seekBack = true
                    } else {
                        _self.seekBack = false
                    }
                    
                    if(_self.isStartOverClick){
                        pData['eventAction']= 'Start Over Click';
                    }
                }
                else if(_self.sectionInfo.info.code == "new_live_player"){
                    /*if (!!_self.maxFastForward && (_self.maxFastForward < data.position) && (data.position < -25)) {
                        _self.seekBack = true
                    } else {
                        _self.seekBack = false
                    }*/  // time being we disabled seek restriction functionality so commented code.                    
                    if(Math.trunc(data.position) >= -25){                        
                        _self.showGolive = false;
                        _self.showStartOver = true; 
                        pData['eventAction']= 'Go Live Click';            
                    }

                    if(_self.isStartOverClick){
                        pData['eventAction']= 'Start Over Click';
                    }
                }
                _self.sendCleverTapEvents(pData);
                _self.isStartOverClick = false;
            }
            else {
                _self.playerSetup = true;
                _self.isStartOverClick = false;                
            }
        }
    }    


    startFastForwardTimer(){            
        let seekTimer = timer(0, 1000);
        this.seekBackTimer = seekTimer.subscribe(t => {                 
            if(!!this.isVideoPlaying && !this.isBuffering && !this.isPause){                        
                if((this.sectionInfo.info.code == "epg_player" && this.sectionInfo.info.attributes.isRecorded == "false")){                                                                          
                    (Math.round(this.jwPlayerObj.getPosition()) >= Math.round(this.maxFastForward)) && (this.maxFastForward += 1);
                }                                                 
            }        
        });
    }

    getImagePath(path) {
        return this.userService.getAbsolutePath(path);
    }

    handleError(event, imgName) {
        event.target.src = imgName;
    }      

    getNextVideoPreInfo() {
        
        let apiPath = ((!!this.streamData && !!this.streamData.analyticsInfo && (this.streamData.analyticsInfo.dataType == "epg" && this.streamData.analyticsInfo.contentType == "vod"))? 'next/epgs?path=' : 'next/videos?path=');
        this.dataManager.getData(this.userService.staticInitData.api + appConfig.apiURL + apiPath + this.sectionInfo.info.path + "&count=1").subscribe(res => {
            if (!!res['status'] && !res['response'].data.length || (!this.sectionInfo.streamStatus.hasAccess)) {                                                                                 
                this.nextVideosList = [];
                this.enableNextEpisodeBtn = {};
            }
        }, error => {
            //console.log('error occurred in get app data');
        });
    }

    getNextVideos(showTimer) {
        
        let apiPath = ((!!this.streamData.analyticsInfo && (this.streamData.analyticsInfo.dataType == "epg" && this.streamData.analyticsInfo.contentType == "vod"))? 'next/epgs?path=' : 'next/videos?path=');
        this.dataManager.getData(this.userService.staticInitData.api + appConfig.apiURL + apiPath + this.sectionInfo.info.path + "&count=1").subscribe(res => {
            if (!!res['status'] && !!res['response'].data.length) {                      
                
                if(showTimer){                
                    this.nextVideosList = res['response'].data;  
                    switch(this.nextVideosList[0].target.pageAttributes.contentType){
                        case "tvshowepisode" :  this.nextVideosList[0].display.coming_up_next = "Next Episode."; break;
                        case "movie" :  this.nextVideosList[0].display.coming_up_next = "Next Movie."; break;                    
                        default : this.nextVideosList[0].display.coming_up_next = "Coming Up Next.";
                    }                
                    this.startTimer();
                }
                else{                    
                    this.isVideoPlaying = false;     
                    this.showGolive = false;                    
                    this.showStartOver = true;
                    this.commonService.setResume(false);
                    (!!this.seekBackTimer) && this.seekBackTimer.unsubscribe();   
                    this.appConfig.siteSettings.internalVideoAnalaticsEnable && this.plugin && this.plugin.handlePlayEndedByUser();
                    this.isThumbnailStatus = false                    
                    this.getPageData(res['response'].data[0].target.path);
                    this.userService.setNavigationFrom(this.pagePath)
                }                
            } else {
                this.nextVideosList = [];
                this.enableNextEpisodeBtn = {};
            }
        }, error => {
            //console.log('error occurred in get app data');
        });
    }

    rePlayVideo() {
        if (!!this.appConfig.siteSettings.internalVideoAnalaticsEnable) {
            if(this.sub != undefined)
                this.stopTimer();

            this.isReplaying = true;
            var elem = document.getElementById("replay-btn");
            elem.setAttribute("style", "display:none;");
            this.startPlay(this.playSource, this.sectionInfo, this.plugin);
        }
    }

    upNextVideo(path){
        let pData = {                                                                                                                        
            "eventAction":"Up Next Clicked"                                                           
        };                                                    
        this.sendCleverTapEvents(pData);
        this.router.navigateByUrl("/"+path);
    }

    playLastChannel(){
        this.isVideoPlaying = false;        
        this.showGolive = false;
        //local now channel related code.
        !!this.localNowObj && (this.startLocalNowPoll("false"),this.localNowObj = ''); 
        !!this.externalPollTimer && (clearInterval(this.externalPollTimer));
        this.showStartOver = true;
        this.isLastChannelClick = true;     
        this.appConfig.siteSettings.internalVideoAnalaticsEnable && this.plugin && this.plugin.handlePlayEndedByUser();
        this.isThumbnailStatus = false
        let pData = {                                                                                                                        
            "Player_Controls" : 'Play Ended',
            "Bit_Rate" : 'Not Available' ,                                
            "Player_Position" : (!!this.jwPlayerObj ? Math.floor(this.jwPlayerObj.getPosition() * 1000) : 'Not Available'),
            "Player_State" : (!!this.jwPlayerObj ?  this.jwPlayerObj.getState() : 'Not Available'),                                                
        };                                                    
        this.sendCleverTapEvents(pData);
        this.currentChannelInfo = window.location.pathname.replace('/','');
        this.lastChannelInfo = this.dataManager.retrieveStaticString('last_channel_info');
        (this.lastChannelInfo === this.currentChannelInfo) && (this.lastChannelInfo = "") //if last channel and current playing channel is same then hide last channel button
        this.getPageData(this.lastChannelInfo);
    } 

    startTimer() {
        let time = timer(0, 1000);
        this.sub = time.subscribe(t => this.timer(t));
    }
    stopTimer() {
        this.sub.unsubscribe();     
        (!!this.seekBackTimer) && this.seekBackTimer.unsubscribe();   
    }
    timer(t) {
        this.nextVideoStartsIn = 5 - t;
        (t > 5) && (this.stopTimer(), this.isNextVideo= true, this.router.navigateByUrl('/' + this.nextVideosList[0].target.path), this.userService.setIsAutoPlay(true))
    }  
  
    private viewSelectedSection(code, index) {
        this.selectedSection = code;
        this.selectedSectionIndex = index;
        this.paginationFlag = true;     
        this.getSelectedMenuData();    
    }

    getSelectedMenuData(){

            if(this.sectionInfo.sectionData[this.selectedSectionIndex].section.sectionData.data.length == 0 && this.sectionInfo.sectionData[this.selectedSectionIndex].section.sectionData.hasMoreData == true){                 
                 let url = this.userService.staticInitData.api + appConfig.apiURL + 'section/data?path=' + this.pagePath + '&code=' + this.selectedSection.toString();                            
                    let init = setTimeout(() => {
                        this.dataManager.getData(url).subscribe(res => {
                            if (res["status"]) {
                                this.paginationFlag = true;                                
                                this.sectionInfo.sectionData[this.selectedSectionIndex].section.sectionData.hasMoreData = res["response"][0].hasMoreData;
                                this.sectionInfo.sectionData[this.selectedSectionIndex].section.sectionData.lastIndex = res["response"][0].lastIndex;
                                this.viewSelectedSection(this.sectionInfo.sectionData[this.selectedSectionIndex].section.sectionInfo.code, this.selectedSectionIndex);            
                            }
                            this.displayLoader = false;
                        }, error => {
                        });
                    }, Math.abs(this.sectionInfo.sectionData[this.selectedSectionIndex].section.sectionData.dataRequestDelay));
            }                                   
    }

    public getSectionPaginationData() {
        let selectedSectionTab = this.sectionInfo.sectionData[this.selectedSectionIndex].section;

        if (!!selectedSectionTab.sectionControls.infiniteScroll && !!selectedSectionTab.sectionData.hasMoreData) {            
            let init = setTimeout(() => {
                let url = this.userService.staticInitData.api + appConfig.apiURL + 'section/data?path=' + this.pagePath + '&code=' + selectedSectionTab.sectionInfo.code + '&offset=' + selectedSectionTab.sectionData.lastIndex;                
                this.dataManager.getData(url).subscribe(res => {
                    if (res["status"]) {
                        this.paginationFlag = true;
                        this.sectionInfo.sectionData[this.selectedSectionIndex].section.sectionData.data = this.sectionInfo.sectionData[this.selectedSectionIndex].section.sectionData.data.concat(res["response"][0].data);
                        this.sectionInfo.sectionData[this.selectedSectionIndex].section.sectionData.hasMoreData = res["response"][0].hasMoreData;
                        this.sectionInfo.sectionData[this.selectedSectionIndex].section.sectionData.lastIndex = res["response"][0].lastIndex;
                        this.viewSelectedSection(this.sectionInfo.sectionData[this.selectedSectionIndex].section.sectionInfo.code, this.selectedSectionIndex);
                    }
                }, error => {
                });
                clearTimeout(init);
            },Math.abs(selectedSectionTab.sectionData.dataRequestDelay));

        }

    }

    playStartOver(resume?){        
        this.isStartOverClick = true;
        let diff = Math.round((new Date().getTime() - this.sectionInfo.info.attributes.startTime) / 1000);                  
        let maxdvrtime = Math.round(Math.abs(this.jwPlayerObj.getDuration()));   
        let positionInsec = -((diff > maxdvrtime) ? maxdvrtime : diff);
        this.jwPlayerObj.seek(positionInsec);        
        (!!resume) && (this.jwPlayerObj.play());
        this.showGolive = true;
        //this.showStartOver = (this.sectionInfo.info.code == "new_live_player") ? true : false;    //showStartOver      
        (!!this.startOverModal) && (this.renderer2.setStyle(this.startOverModal.nativeElement,'display','none'));
        (!!this.startOverModalFade) && (this.renderer2.setStyle(this.startOverModalFade.nativeElement,'display','none'));  
        
        if((this.sectionInfo.info.code == "new_live_player" && this.sectionInfo.info.attributes.isRecorded == "false")){
            this.maxFastForward = this.jwPlayerObj.getPosition();                                                       
        }
                          
    }

    playLive(){                                      
        this.jwPlayerObj.seek(-25);
        this.showGolive = false;
        this.showStartOver = true;             
    } 

    openPlayerStartOver(){
         
        if(this.sectionInfo.streamStatus.seekPositionInMillis > 0) {
            this.isStartOverClick = true;
            //this.jwPlayerObj.seek(0);
            this.playerSetup = true;
            this.startPlay(this.playSource, this.sectionInfo, this.plugin);
            this.showStartOver = true;
            (!!this.sub) && (this.stopTimer() , this.router.navigateByUrl('/' + this.pagePath))
        }
        else if(this.sectionInfo.info.code == "new_live_player"){
            let maxdvrtime=+this.systemConfigs.maxdvrtime;
            let diff=(new Date().getTime() - this.sectionInfo.info.attributes.startTime);
            if(diff > maxdvrtime){           
                (!!this.startOverModal) && (this.renderer2.setStyle(this.startOverModal.nativeElement,'display','block'));
                (!!this.startOverModal) && (this.renderer2.setStyle(this.startOverModalFade.nativeElement,'display','block')); 
                this.jwPlayerObj.pause();
            }
            else{
                this.playStartOver(false);
            }
        }      
        else{
            this.isStartOverClick = true;
            //this.jwPlayerObj.seek(0);
            this.playerSetup = true;
            this.startPlay(this.playSource, this.sectionInfo, this.plugin);
        }  
    }
    closePlayerStartOver(){
        (!!this.startOverModal) && (this.renderer2.setStyle(this.startOverModal.nativeElement,'display','none'));
        (this.startOverModalFade) && (this.renderer2.setStyle(this.startOverModalFade.nativeElement,'display','none')); 
        this.jwPlayerObj.play();
        this.showGolive = false;
        this.showStartOver = true; 
    }  

    concurrenceStreamRequest(){
        var formData = new FormData();
        formData.append('poll_key', this.streamData.sessionInfo.streamPollKey); 
        if(this.streamData.sessionInfo.streamPollKey == undefined) return;      
        this.dataManager.postNewFormData(this.userService.staticInitData.api + '/service/api/v1/stream/poll',formData).subscribe(data => {
            if(data['status'] == false && ((data['error'].code == -4000) || (data['error'].code == -4001) || (data['error'].code == -4401) || (data['error'].code == -4402))){
                if (!!this.playerSetup && this.windowRef.isWindowAvailable()) {
                    this.jwPlayerObj.pauseAd(true);
                    this.jwPlayerObj.stop();                            
                    this.concurStreamStatusObj = data['error'];                                                     
                    this.showGolive = false;
                    this.showStartOver = true;                                  
                    clearInterval(this.concurPollInitId);
                    !!this.localNowObj && (this.localNowObj = '');
                    !!this.externalPollTimer && clearInterval(this.externalPollTimer);
                    (this.renderer2.setStyle(this.concurrent.nativeElement,'display','block'));    
                    (this.renderer2.setStyle(this.startOverModalFade.nativeElement,'display','block'));     
                    !!window && window.scrollTo(0, 0);
                }   
            }            
        }, err => {
            //clearInterval(this.concurPollInitId);    do not clear interval if serve restart also doesnt response.
        })
    }

    startLocalNowPoll(status){
        console.log(this.systemConfigs.localNowPollingUrl);   
        let postUrl = (!!this.systemConfigs.localNowPollingUrl ? this.systemConfigs.localNowPollingUrl : "https://qaottcms.weathergroup.com/api/v1/appExtSessionState/frndly/{sessionId}/{active}?apiKey=544553543c3bd221bb45c6ba0866e2df");
        postUrl =  postUrl.replace("{sessionId}", this.localNowObj.localNowSessionId);
        postUrl =  postUrl.replace("{active}", status);        
        this.dataManager.externalPost(postUrl).subscribe(data => { 
            console.log(data);                      
        }, err => {
            //!!this.localNowObj && (this.localNowObj = '');    do not clear interval if serve restart also doesnt response.
        });
    }

    endActiveStream(key){
        var formData = new FormData();
        formData.append('poll_key', key);
        if(key!=undefined){
            this.dataManager.postNewFormData(this.userService.staticInitData.api + '/service/api/v1/stream/session/end',formData).subscribe(data => {
         })
        }
    }

    closeConcurrentPopup(){
        (this.renderer2.setStyle(this.concurrent.nativeElement,'display','none')); 
        (this.renderer2.setStyle(this.startOverModalFade.nativeElement,'display','none'));  
    }

    managenDVR(){
        if(this.sectionInfo.info.attributes.isRecorded == "false"){
            this.childTemplateData = this.sectionInfo.info;
        }
    }

    closePartialRender(){        
        this.childTemplateData = {};      
    }

    closeRecordPopUp(){              
        this.showToastMessage = { type : '', status : false, massage :''};  
        document.body.style.overflow = 'visible'; 
    }

    ndvrToastInfo($event){        
       this.showToastMessage = $event;     
       if($event.request == 'ndvr' && !$event.isError){
           this.sectionInfo.info.attributes.isRecorded = 'true';
            if(this.sectionInfo.info.code == "epg_player"){                    
                //completly hiding the seek bar.
                let elements = this.elementRef.nativeElement.querySelector('.jw-slider-time');                                                                                        
                elements.style.display = "block";               
            }
       } 
    }    

    goToPackagesPage(){
        this.userService.setPackageRequestType('_upgrade')
        this.router.navigateByUrl("/packages/_upgrade");
    } 
    
    sendCleverTapEvents(data?){
        let eventData = {
           "Source" : this.userService.getNavigationFrom(),
           "Content_Type"  : !!this.sectionInfo.info.attributes.isLive ? 'Live' : !!this.sectionInfo.info.attributes.contentType ? this.sectionInfo.info.attributes.contentType : "Not Available",            
           "Section_name"  : this.sectionInfo.title,  // page path has section code.
           "Recommendations"  : this.getRecomSectionNames(),                                 
           "Language"  : appConfig.appDefaultLanguage,                       
           "Subtitle" : 'Not Available',                   
       };

       (!!data) && ( eventData = Object.assign(eventData,data));

       if(this.sectionInfo.info.attributes.isLive == "true"){ 
           eventData['Live_TV'] = this.sectionInfo.title;
       }
       else if(this.sectionInfo.info.code == 'movie_player'){
           eventData['Movies'] = this.sectionInfo.title;
       }
       else if(this.sectionInfo.info.code == "vod_video_player"){
           eventData['Videos'] = this.sectionInfo.title;
       }
   }

   getRecomSectionNames(){
    let arr = [];    
    (this.sectionInfo.sectionData.length) && this.sectionInfo.sectionData.forEach(element => {
            (element.paneType == 'section') && (arr.push(element.section.sectionInfo.name));
    });    
    return arr.toString();
    }

    adjustBitRateQuality(){   
        var _self =this        
        let bandwidths = _self.jwPlayerObj.getQualityLevels() || []; 
        console.log(bandwidths);
        var SDindex;    
        var SDbitrateValue =  (!!this.streamData.maxBitrateAllowed) ?  this.streamData.maxBitrateAllowed :  this.SDData.maxBitRate; //added if maxbitrate avible for basic plan users.
        for(let i=0; i < bandwidths.length; i++){             
            if(bandwidths[i].bitrate/1000 <= SDbitrateValue ){
                SDindex = i;
                break;
            }
        }             

        if(this.btnHDText == 'SD' && !!SDindex ){
            _self.jwPlayerObj.setCurrentQuality(SDindex);
        }else if(this.btnHDText == 'HD') {
            if(bandwidths.length >0)
            _self.jwPlayerObj.setCurrentQuality(0);
        } 

        let qualitySubMenus = [];
        let qualityNodes = document.querySelectorAll('.jw-settings-submenu-quality .jw-settings-submenu-items .jw-settings-content-item');
        (!!qualityNodes) && (qualitySubMenus = Array.from(qualityNodes));    

        if(this.streamData.maxBitrateAllowed != undefined || this.userService.isHDPacakgeAvilable == false){
            qualitySubMenus.forEach((element,i)=>{               
                    (i < SDindex ) && (element.style.display = 'none');                
            });  
        }
       
                                                                                    
    }


    getAdData(){
        var currentPlayingFile:any = this.jwPlayerObj.getPlaylist();
        currentPlayingFile = currentPlayingFile[0].file;
        var requiredBlock;
        console.log(this.streamData);
        for(let stream of this.streamData.streams){
            if(stream.url == currentPlayingFile){
                requiredBlock = stream;
                break;
            }
        }
        if(!!requiredBlock && !!requiredBlock.adInfo &&  !!requiredBlock.adInfo.streamAdUrl && !!requiredBlock.adInfo.adTimeSlots && requiredBlock.adInfo.adTimeSlots.length>0 ){
            this.showScteAds =true;
            this.scteAdBlockData = requiredBlock.adInfo;
            this.scteAdBlockData.adTimeSlots.forEach(element => {
                element.isinit = false;
                element.isAdplayed = false;
            });
            console.log(this.scteAdBlockData);
        }else{
            this.showScteAds = false;
            this.scteAdBlockData = {};
        }
    }

    loadDynamicAd(data,adUrl){      
        var tempAdurl = adUrl.replace('{{CACHEBUSTER}}',new Date().getTime()).replace('{{DEVICE_ID}}',this.boxId).replace('{{APP_NAME}}','FrndlyTV').replace('{{POD_MAX_DUR}}',data.durationInSecs).replace('{{USER_AGENT}}', this.browserAgent.userAgent).replace('{{APP_BUNDLE}}',window.location.origin).replace('{{APP_STORE_URL}}',window.location.origin).replace("{{IP}}",(!!this.trueIp)?this.trueIp:'{{IP}}');
        console.log(tempAdurl);
        this.isAdloading = true;
        this.jwPlayerObj.playAd(tempAdurl);    
    }



    processCaptions(captions) {
        var captionslist = [];
        if(!!captions && !!captions.ccList){
            for (var i = 0; i < captions.ccList.length; i++) {
                let obj = {
                    file: this.getImagePath(captions.ccList[i].filePath),
                    label: captions.ccList[i].language,
                    kind: "captions",                   
                }              
                captionslist.push(obj);
            } 
            this.defaultCCLang = captions.defaultLang ; 
            return captionslist ;  
        }  else{
            return [];
        }
    }


    setCaptions(){  
        let cc = this.dataManager.retrieveStaticString('closed_caption');
        console.log("cc request");
        this.manualCCchange = false;
        if(cc == "true"){
            var captionsList = this.jwPlayerObj.getCaptionsList();
            if(captionsList.length >1){
                if(this.defaultCCLang != undefined){
                    var captionsList = this.jwPlayerObj.getCaptionsList();
                    var isCCfound = false;
                    for(let item in captionsList){
                        if(captionsList[item].label.toLowerCase() == this.defaultCCLang.toLowerCase() || (captionsList[item].language != undefined && captionsList[item].language.toLowerCase() == this.defaultCCLang.toLowerCase()) ){                      
                            this.jwPlayerObj.setCurrentCaptions(item);
                            isCCfound = true;
                            break;
                        }
                    }  
                    if(isCCfound == false){
                        this.jwPlayerObj.setCurrentCaptions(1);
                    }  
                }else{
                    this.jwPlayerObj.setCurrentCaptions(1);
                }
            } 
        }
        else{
            if(this.defaultCCLang != 'off' && this.defaultCCLang != undefined ){
                var captionsList = this.jwPlayerObj.getCaptionsList();
                if(captionsList.length >1){                  
                    var captionsList = this.jwPlayerObj.getCaptionsList();
                    var isCCfound = false;
                    for(let item in captionsList){
                        if(captionsList[item].label.toLowerCase() == this.defaultCCLang.toLowerCase() || (captionsList[item].language != undefined && captionsList[item].language.toLowerCase() == this.defaultCCLang.toLowerCase()) ){                      
                            this.jwPlayerObj.setCurrentCaptions(item);
                            isCCfound = true;
                            break;
                        }
                    }  
                    if(isCCfound == false){
                        this.jwPlayerObj.setCurrentCaptions(1);
                    } 
                }
            }else{
                this.jwPlayerObj.setCurrentCaptions(0);
            }
          
        }      
    }

    public storeCaptions(){
        if(!!this.manualCCchange){
            var captionsIndex = this.jwPlayerObj.getCurrentCaptions();
            var captionsList = this.jwPlayerObj.getCaptionsList();
            this.defaultCCLang = captionsList[captionsIndex].label.toLowerCase();            
        }else{
            this.manualCCchange = true;            
        }     
    }



}

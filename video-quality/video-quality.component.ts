import { Component, OnInit,Input,Output,EventEmitter,ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';

declare var $: any;

@Component({
  selector: 'video-quality',
  templateUrl: './video-quality.component.html',
  styleUrls: ['./video-quality.component.scss']
})
export class VideoQualityComponent implements OnInit {

  @Input() inputData;
  @Output() childCallBack = new EventEmitter<any>(); 
  videoQualitySettings :any = [];
  HDData :any ={};
  SDData :any ={};

  constructor(private Ele : ElementRef, private userService: UserService) {}

  ngOnInit() { 
    var popd = this.inputData;
    if(popd.quality != 'HD' && popd.quality != 'SD') this.inputData.quality = 'HD';
    this.videoQualitySettings = this.userService.getSystemConfig();
    this.videoQualitySettings = this.videoQualitySettings['videoQualitySettings'];
    (!!this.videoQualitySettings) && (this.videoQualitySettings = JSON.parse(this.videoQualitySettings));
    this.HDData = this.videoQualitySettings.filter(ele => (ele.code == 'HD'));
    this.SDData = this.videoQualitySettings.filter(ele => (ele.code == 'SD'));
    this.HDData = (!!this.HDData) ? this.HDData[0] : {};
    this.SDData = (!!this.SDData) ? this.SDData[0] : {};
    document.getElementById("video-quality-data").style.display = "block"; 
    document.getElementById("video-quality-overlay").style.display = "block"; 
    document.body.style.overflow="auto";    
  }

  callbackFromChild(data){
    document.getElementById("video-quality-data").style.display = "none"; 
    document.getElementById("video-quality-overlay").style.display = "none";   
    this.childCallBack.emit({"isSelected" : data });
  }



}
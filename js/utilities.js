var utilities ={};


// is a valid string or valid text present in an element
utilities.validateString = function (value) {
    if (value == undefined || value == null) return false;
    else if (value.trim() == '') return false;
    else return true;
}

utilities.getRealDate = function (currDate) {
    if (currDate != undefined && currDate != '') {
    var newdate = new Date(currDate);
    var finalDate=newdate.getDate()+ '/' +(newdate.getMonth()+1)+ '/' +newdate.getFullYear();
    return finalDate;
    }else{
        return '';
    }
}

// To convert Secs to Mins 
utilities.toHHMMSS = function (secs) {
    var sec_num = secs / 1000;
    var m = Math.floor(sec_num / 60);
    var s = Math.floor(sec_num % 60);
    var time = m + 'Min:' + s + 'Sec';
    return time;
}

// To convert Secs to hours :mins: secs 
utilities.getTimeHMS=function(t) {
	var pt = t / 1000;
	var hh = Math.floor(pt / 3600);
	var mm = Math.floor((pt % 3600) / 60);
	var ss = Math.floor(pt % 60);
	return "" + (hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm)
		+ ":" + (ss < 10 ? "0" + ss : ss);
}

//get From Local storage item
utilities.getFromLocalStorage= function (key){   
    var cookieSupported = false;
    try {
        if (document.cookie) cookieSupported = true;
        if( cookieSupported == true){
            return read_cookie(key);
        }else{
            return localStorage.getItem(key);
        }  
    } catch (e) {
        return '';
     } 
     
}

//To Set the Local  item
utilities.setLocalStorage = function (key,value) {
    var cookieSupported = false;
    try {
        if (document.cookie) cookieSupported = true;
        if( cookieSupported == true){
            write_cookie(key,value);
        }else{
            localStorage.setItem(key, value );
        }  
    } catch (e) {} 
}

utilities.resetUserData =function (){
    Main.userProfile.cardStatus = 0;
    Main.userProfile.email = '';
    Main.userProfile.emailStatus = '';
    Main.userProfile.mobile = '';
    Main.userProfile.mobileStatus ='';
    Main.userProfile.name = '';
    Main.userProfile.userId = '';
    Main.userProfile.userStatus =false;
    Main.userProfile.languages ='';
}

utilities.settingUserData =function (result){
  Main.userProfile.cardStatus = result.response.cardStatus;
  Main.userProfile.email = result.response.email;
  Main.userProfile.emailStatus = result.response.isEmailVerified;
  Main.userProfile.mobile = result.response.phoneNumber;
  Main.userProfile.mobileStatus = result.response.isPhoneNumberVerified;
  Main.userProfile.name = result.response.name;
  Main.userProfile.userId = result.response.userId;
  Main.userProfile.userStatus =true;
  Main.userProfile.languages = result.response.languages;
  Main.preferences = result.response.preferences;	
  Main.packages=result.response.packages;	
  Main.userProfile.attributes=result.response.attributes;
}

utilities.navigateBackwithRefresh =function(){  	
    for(var i=0;i<backData.length;i++){
        backData[i].pageReload = true;
    }  
    Main.previousPage(); 
}

utilities.refreshAllbackData =function(){  	
    for(var i=0;i<backData.length;i++){
        backData[i].pageReload = true;
    }  
}

utilities.removeAuthHistory =function(){  
    var tempObj = [];	
    for(var i=0;i<backData.length;i++){
        if(backData[i].view != 'signin' && backData[i].view != 'signup' && backData[i].view != 'signupOtpVerification'){
            backData[i].pageReload = true;
            tempObj.push(backData[i]);
        }
    }  
    backData = tempObj;
}

utilities.refreshContinueWatching =function(){  	
    for(var i=0;i<backData.length;i++){
        if(backData[i].view == 'content') {
          backData[i].refreshContinueWatching=true;
          break;
        }  
    }
}

utilities.signOutPopupDetails=function(){
    Main.popupData ={
        popuptype : 'signOut',
        message : "Do you like to sign out from "+appConfig.appName,
        buttonCount : 2,  
        yesText:'No',
        yesTarget:'close',       
        noTarget:'signOut',
        noText:'Yes',
        onBack : 'close',
    }
    Yup("#popUpFDFS").html(Util.showPopup());	
    Yup("#popup-btn-1").addClass('popupFocus');
}

utilities.detailsPagePopupDetails=function(msg,headerTitle,type){
    Main.popupData ={
        popuptype : type,
        message : msg,
        headerTitle:headerTitle,
        buttonCount : 1,
        yesText : 'Okay',
        yesTarget : 'close',
        onBack : 'close'
    }
    Yup("#popUpFDFS").html(Util.showPopup());	
    Yup("#popup-btn-1").addClass('popupFocus');
}

utilities.genricPopup=function(msg,type){
    Main.popupData ={
        popuptype : type,
        message : msg,       
        buttonCount : 1,
        yesText : 'Okay',
        yesTarget : 'close',
        onBack : 'close'
    }
    Yup("#popUpFDFS").html(Util.showPopup());	
    Yup("#popup-btn-1").addClass('popupFocus');
}

utilities.responseErrorCheck=function(errObj){
   if(checknetworkType==false){
    Main.popupData ={
        popuptype : 'netWorkError',
        message : "Trouble connecting to Internet, Please Try again Later.",       
        buttonCount : 1,
        yesText : 'Okay',
        yesTarget : 'close',
        onBack : 'close'
    }
    Yup("#popUpFDFS").html(Util.showPopup());	
    Yup("#popup-btn-1").addClass('popupFocus');
   }
   else{
       if(!errObj.responseText) utilities.genricPopup('Something Went Wrong','unknown');
       else utilities.genricPopup(errObj.responseText,'unknown');
   }
}


utilities.encryptData = function (x) {
	var hash = CryptoJS.SHA256(appConfig.ssha).toString().substring(0, 32);
	var words = CryptoJS.enc.Utf8.parse(hash);
	var base64Key = CryptoJS.enc.Base64.stringify(words);
	base64Key = CryptoJS.enc.Base64.parse(base64Key);
	words = CryptoJS.enc.Utf8.parse(appConfig.ivKey);
	var base64IV = CryptoJS.enc.Base64.stringify(words);
	base64IV = CryptoJS.enc.Base64.parse(base64IV);
	var encrypted = CryptoJS.AES.encrypt(x, base64Key, { iv: base64IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
	return encrypted.toString();
}

utilities.decryptData = function (x) {
	var hash = CryptoJS.SHA256(appConfig.ssha).toString().substring(0, 32);
	var words = CryptoJS.enc.Utf8.parse(hash);
	var base64Key = CryptoJS.enc.Base64.stringify(words);
	base64Key = CryptoJS.enc.Base64.parse(base64Key);
	words = CryptoJS.enc.Utf8.parse(appConfig.ivKey);
	var base64IV = CryptoJS.enc.Base64.stringify(words);
	base64IV = CryptoJS.enc.Base64.parse(base64IV);
	var decrypted = CryptoJS.AES.decrypt(x, base64Key, { iv: base64IV });
	return decrypted.toString(CryptoJS.enc.Utf8);
}

utilities.countryCodesList = function(){
    return {
        "status": true,
        "response": [
          {
            "code": "AF",
            "name": "Afghanistan",
            "isdCode": 93,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/afghanistan.png"
          },
          {
            "code": "AX",
            "name": "Aland Islands",
            "isdCode": 358,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/aland_islands.png"
          },
          {
            "code": "AL",
            "name": "Albania",
            "isdCode": 355,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/albania.png"
          },
          {
            "code": "DZ",
            "name": "Algeria",
            "isdCode": 213,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/algeria.png"
          },
          {
            "code": "AS",
            "name": "American Samoa",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/american_samoa.png"
          },
          {
            "code": "AD",
            "name": "Andorra",
            "isdCode": 376,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/andorra.png"
          },
          {
            "code": "AO",
            "name": "Angola",
            "isdCode": 244,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/angola.png"
          },
          {
            "code": "AI",
            "name": "Anguilla",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/anguilla.png"
          },
          {
            "code": "AG",
            "name": "Antigua and Barbuda",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/antigua_and_barbuda.png"
          },
          {
            "code": "AR",
            "name": "Argentina",
            "isdCode": 54,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/argentina.png"
          },
          {
            "code": "AM",
            "name": "Armenia",
            "isdCode": 374,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/armenia.png"
          },
          {
            "code": "AW",
            "name": "Aruba",
            "isdCode": 297,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/aruba.png"
          },
          {
            "code": "AU",
            "name": "Australia",
            "isdCode": 61,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/australia.png"
          },
          {
            "code": "AT",
            "name": "Austria",
            "isdCode": 43,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/austria.png"
          },
          {
            "code": "AZ",
            "name": "Azerbaijan",
            "isdCode": 994,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/azerbaijan.png"
          },
          {
            "code": "BS",
            "name": "Bahamas",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/bahamas.png"
          },
          {
            "code": "BH",
            "name": "Bahrain",
            "isdCode": 973,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/bahrain.png"
          },
          {
            "code": "BD",
            "name": "Bangladesh",
            "isdCode": 880,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/bangladesh.png"
          },
          {
            "code": "BB",
            "name": "Barbados",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/barbados.png"
          },
          {
            "code": "BY",
            "name": "Belarus",
            "isdCode": 375,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/belarus.png"
          },
          {
            "code": "BE",
            "name": "Belgium",
            "isdCode": 32,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/belgium.png"
          },
          {
            "code": "BZ",
            "name": "Belize",
            "isdCode": 501,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/belize.png"
          },
          {
            "code": "BJ",
            "name": "Benin",
            "isdCode": 229,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/benin.png"
          },
          {
            "code": "BM",
            "name": "Bermuda",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/bermuda.png"
          },
          {
            "code": "BT",
            "name": "Bhutan",
            "isdCode": 975,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/bhutan.png"
          },
          {
            "code": "BO",
            "name": "Bolivia",
            "isdCode": 591,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/bolivia.png"
          },
          {
            "code": "BQ",
            "name": "Bonaire",
            "isdCode": 599,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/bonaire.png"
          },
          {
            "code": "BA",
            "name": "Bosnia and Herzegovina",
            "isdCode": 387,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/bosnia_and_herzegovina.png"
          },
          {
            "code": "BW",
            "name": "Botswana",
            "isdCode": 267,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/botswana.png"
          },
          {
            "code": "BR",
            "name": "Brazil",
            "isdCode": 55,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/brazil.png"
          },
          {
            "code": "IO",
            "name": "British Indian Ocean Territory",
            "isdCode": 246,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/british_indian_ocean_territory.png"
          },
          {
            "code": "BN",
            "name": "Brunei",
            "isdCode": 673,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/brunei.png"
          },
          {
            "code": "BG",
            "name": "Bulgaria",
            "isdCode": 359,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/bulgaria.png"
          },
          {
            "code": "BF",
            "name": "Burkina Faso",
            "isdCode": 226,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/burkina_faso.png"
          },
          {
            "code": "BI",
            "name": "Burundi",
            "isdCode": 257,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/burundi.png"
          },
          {
            "code": "KH",
            "name": "Cambodia",
            "isdCode": 855,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/cambodia.png"
          },
          {
            "code": "CM",
            "name": "Cameroon",
            "isdCode": 237,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/cameroon.png"
          },
          {
            "code": "CA",
            "name": "Canada",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/canada.png"
          },
          {
            "code": "CV",
            "name": "Cape Verde",
            "isdCode": 238,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/cape_verde.png"
          },
          {
            "code": "KY",
            "name": "Cayman Islands",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/cayman_islands.png"
          },
          {
            "code": "CF",
            "name": "Central African Republic",
            "isdCode": 236,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/central_african_republic.png"
          },
          {
            "code": "TD",
            "name": "Chad",
            "isdCode": 235,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/chad.png"
          },
          {
            "code": "CL",
            "name": "Chile",
            "isdCode": 56,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/chile.png"
          },
          {
            "code": "CN",
            "name": "China",
            "isdCode": 86,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/china.png"
          },
          {
            "code": "CX",
            "name": "Christmas Island",
            "isdCode": 61,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/christmas_island.png"
          },
          {
            "code": "CC",
            "name": "Cocos Islands",
            "isdCode": 61,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/cocos_islands.png"
          },
          {
            "code": "CO",
            "name": "Colombia",
            "isdCode": 57,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/colombia.png"
          },
          {
            "code": "KM",
            "name": "Comoros",
            "isdCode": 269,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/comoros.png"
          },
          {
            "code": "CK",
            "name": "Cook Islands",
            "isdCode": 682,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/cook_islands.png"
          },
          {
            "code": "CR",
            "name": "Costa Rica",
            "isdCode": 506,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/costa_rica.png"
          },
          {
            "code": "HR",
            "name": "Croatia",
            "isdCode": 385,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/croatia.png"
          },
          {
            "code": "CU",
            "name": "Cuba",
            "isdCode": 53,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/cuba.png"
          },
          {
            "code": "CW",
            "name": "Curacao",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/curacao.png"
          },
          {
            "code": "CY",
            "name": "Cyprus",
            "isdCode": 357,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/cyprus.png"
          },
          {
            "code": "CZ",
            "name": "Czech Republic",
            "isdCode": 420,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/czech_republic.png"
          },
          {
            "code": "DO",
            "name": "Democratic Republic of the Congo",
            "isdCode": 243,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/democratic_republic_of_the_congo.png"
          },
          {
            "code": "DK",
            "name": "Denmark",
            "isdCode": 45,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/denmark.png"
          },
          {
            "code": "DJ",
            "name": "Djibouti",
            "isdCode": 253,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/djibouti.png"
          },
          {
            "code": "DM",
            "name": "Dominica",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/dominica.png"
          },
          {
            "code": "TL",
            "name": "East Timor",
            "isdCode": 670,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/east_timor.png"
          },
          {
            "code": "EC",
            "name": "Ecuador",
            "isdCode": 593,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/ecuador.png"
          },
          {
            "code": "EG",
            "name": "Egypt",
            "isdCode": 20,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/egypt.png"
          },
          {
            "code": "SV",
            "name": "El Salvador",
            "isdCode": 503,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/el_salvador.png"
          },
          {
            "code": "UK",
            "name": "England",
            "isdCode": 44,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/england.png"
          },
          {
            "code": "GQ",
            "name": "Equatorial Guinea",
            "isdCode": 240,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/equatorial_guinea.png"
          },
          {
            "code": "ER",
            "name": "Eritrea",
            "isdCode": 291,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/eritrea.png"
          },
          {
            "code": "EE",
            "name": "Estonia",
            "isdCode": 372,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/estonia.png"
          },
          {
            "code": "ET",
            "name": "Ethiopia",
            "isdCode": 251,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/ethiopia.png"
          },
          {
            "code": "FK",
            "name": "Falkland Islands",
            "isdCode": 500,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/falkland_islands.png"
          },
          {
            "code": "FO",
            "name": "Faroe Islands",
            "isdCode": 298,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/faroe_islands.png"
          },
          {
            "code": "FJ",
            "name": "Fiji",
            "isdCode": 697,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/fiji.png"
          },
          {
            "code": "FI",
            "name": "Finland",
            "isdCode": 358,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/finland.png"
          },
          {
            "code": "FR",
            "name": "France",
            "isdCode": 33,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/france.png"
          },
          {
            "code": "GF",
            "name": "French Guiana",
            "isdCode": 594,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/french_guiana.png"
          },
          {
            "code": "PF",
            "name": "French Polynesia",
            "isdCode": 689,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/french_polynesia.png"
          },
          {
            "code": "GA",
            "name": "Gabon",
            "isdCode": 241,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/gabon.png"
          },
          {
            "code": "GM",
            "name": "Gambia",
            "isdCode": 220,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/gambia.png"
          },
          {
            "code": "GE",
            "name": "Georgia",
            "isdCode": 995,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/georgia.png"
          },
          {
            "code": "DE",
            "name": "Germany",
            "isdCode": 49,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/germany.png"
          },
          {
            "code": "GH",
            "name": "Ghana",
            "isdCode": 233,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/ghana.png"
          },
          {
            "code": "GI",
            "name": "Gibraltar",
            "isdCode": 350,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/gibraltar.png"
          },
          {
            "code": "GR",
            "name": "Greece",
            "isdCode": 30,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/greece.png"
          },
          {
            "code": "GL",
            "name": "Greenland",
            "isdCode": 299,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/greenland.png"
          },
          {
            "code": "GD",
            "name": "Grenada",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/grenada.png"
          },
          {
            "code": "GU",
            "name": "Guam",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/guam.png"
          },
          {
            "code": "GT",
            "name": "Guatemala",
            "isdCode": 502,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/guatemala.png"
          },
          {
            "code": "GG",
            "name": "Guernsey",
            "isdCode": 44,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/guernsey.png"
          },
          {
            "code": "GN",
            "name": "Guinea",
            "isdCode": 224,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/guinea.png"
          },
          {
            "code": "GW",
            "name": "Guinea-Bissau",
            "isdCode": 245,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/guinea_bissau.png"
          },
          {
            "code": "GY",
            "name": "Guyana",
            "isdCode": 592,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/guyana.png"
          },
          {
            "code": "HT",
            "name": "Haiti",
            "isdCode": 509,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/haiti.png"
          },
          {
            "code": "HN",
            "name": "Honduras",
            "isdCode": 504,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/honduras.png"
          },
          {
            "code": "HK",
            "name": "Hong Kong",
            "isdCode": 852,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/hong_kong.png"
          },
          {
            "code": "HU",
            "name": "Hungary",
            "isdCode": 36,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/hungary.png"
          },
          {
            "code": "IS",
            "name": "Iceland",
            "isdCode": 354,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/iceland.png"
          },
          {
            "code": "IN",
            "name": "India",
            "isdCode": 91,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/india.png"
          },
          {
            "code": "ID",
            "name": "Indonesia",
            "isdCode": 62,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/indonesia.png"
          },
          {
            "code": "IR",
            "name": "Iran",
            "isdCode": 98,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/iran.png"
          },
          {
            "code": "IQ",
            "name": "Iraq",
            "isdCode": 964,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/iraq.png"
          },
          {
            "code": "IE",
            "name": "Ireland",
            "isdCode": 353,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/ireland.png"
          },
          {
            "code": "IM",
            "name": "Isle of Man",
            "isdCode": 44,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/isle_of_man.png"
          },
          {
            "code": "IL",
            "name": "Israel",
            "isdCode": 972,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/israel.png"
          },
          {
            "code": "IT",
            "name": "Italy",
            "isdCode": 39,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/italy.png"
          },
          {
            "code": "JM",
            "name": "Jamaica",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/jamaica.png"
          },
          {
            "code": "JP",
            "name": "Japan",
            "isdCode": 81,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/japan.png"
          },
          {
            "code": "JE",
            "name": "Jersey",
            "isdCode": 44,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/jersey.png"
          },
          {
            "code": "JO",
            "name": "Jordan",
            "isdCode": 962,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/jordan.png"
          },
          {
            "code": "KZ",
            "name": "Kazakhstan",
            "isdCode": 7,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/kazakhstan.png"
          },
          {
            "code": "KE",
            "name": "Kenya",
            "isdCode": 254,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/kenya.png"
          },
          {
            "code": "KI",
            "name": "Kiribati",
            "isdCode": 686,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/kiribati.png"
          },
          {
            "code": "KW",
            "name": "Kuwait",
            "isdCode": 965,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/kuwait.png"
          },
          {
            "code": "KG",
            "name": "Kyrgyzstan",
            "isdCode": 996,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/kyrgyzstan.png"
          },
          {
            "code": "LA",
            "name": "Laos",
            "isdCode": 856,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/laos.png"
          },
          {
            "code": "LV",
            "name": "Latvia",
            "isdCode": 371,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/latvia.png"
          },
          {
            "code": "LB",
            "name": "Lebanon",
            "isdCode": 961,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/lebanon.png"
          },
          {
            "code": "LS",
            "name": "Lesotho",
            "isdCode": 266,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/lesotho.png"
          },
          {
            "code": "LR",
            "name": "Liberia",
            "isdCode": 231,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/liberia.png"
          },
          {
            "code": "LY",
            "name": "Libya",
            "isdCode": 218,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/libya.png"
          },
          {
            "code": "LI",
            "name": "Liechtenstein",
            "isdCode": 423,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/liechtenstein.png"
          },
          {
            "code": "LT",
            "name": "Lithuania",
            "isdCode": 370,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/lithuania.png"
          },
          {
            "code": "LU",
            "name": "Luxembourg",
            "isdCode": 352,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/luxembourg.png"
          },
          {
            "code": "MO",
            "name": "Macao",
            "isdCode": 853,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/macao.png"
          },
          {
            "code": "MK",
            "name": "Macedonia",
            "isdCode": 389,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/macedonia.png"
          },
          {
            "code": "MG",
            "name": "Madagascar",
            "isdCode": 261,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/madagascar.png"
          },
          {
            "code": "MW",
            "name": "Malawi",
            "isdCode": 265,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/malawi.png"
          },
          {
            "code": "MY",
            "name": "Malaysia",
            "isdCode": 60,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/malaysia.png"
          },
          {
            "code": "MV",
            "name": "Maldives",
            "isdCode": 960,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/maldives.png"
          },
          {
            "code": "ML",
            "name": "Mali",
            "isdCode": 223,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/mali.png"
          },
          {
            "code": "MT",
            "name": "Malta",
            "isdCode": 356,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/malta.png"
          },
          {
            "code": "MH",
            "name": "Marshall Islands",
            "isdCode": 692,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/marshall_islands.png"
          },
          {
            "code": "MR",
            "name": "Mauritania",
            "isdCode": 222,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/mauritania.png"
          },
          {
            "code": "MU",
            "name": "Mauritius",
            "isdCode": 230,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/mauritius.png"
          },
          {
            "code": "YT",
            "name": "Mayotte",
            "isdCode": 262,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/mayotte.png"
          },
          {
            "code": "MX",
            "name": "Mexico",
            "isdCode": 52,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/mexico.png"
          },
          {
            "code": "FM",
            "name": "Micronesia",
            "isdCode": 691,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/micronesia.png"
          },
          {
            "code": "MD",
            "name": "Moldova",
            "isdCode": 373,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/moldova.png"
          },
          {
            "code": "MC",
            "name": "Monaco",
            "isdCode": 377,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/monaco.png"
          },
          {
            "code": "MN",
            "name": "Mongolia",
            "isdCode": 976,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/mongolia.png"
          },
          {
            "code": "ME",
            "name": "Montenegro",
            "isdCode": 382,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/montenegro.png"
          },
          {
            "code": "MS",
            "name": "Montserrat",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/montserrat.png"
          },
          {
            "code": "MA",
            "name": "Morocco",
            "isdCode": 212,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/morocco.png"
          },
          {
            "code": "MZ",
            "name": "Mozambique",
            "isdCode": 258,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/mozambique.png"
          },
          {
            "code": "MM",
            "name": "Myanmar",
            "isdCode": 95,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/myanmar.png"
          },
          {
            "code": "NA",
            "name": "Namibia",
            "isdCode": 264,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/namibia.png"
          },
          {
            "code": "NR",
            "name": "Nauru",
            "isdCode": 674,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/nauru.png"
          },
          {
            "code": "NP",
            "name": "Nepal",
            "isdCode": 977,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/nepal.png"
          },
          {
            "code": "NL",
            "name": "Netherlands",
            "isdCode": 31,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/netherlands.png"
          },
          {
            "code": "NC",
            "name": "New Caledonia",
            "isdCode": 687,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/new_caledonia.png"
          },
          {
            "code": "NZ",
            "name": "New Zealand",
            "isdCode": 64,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/new_zealand.png"
          },
          {
            "code": "NI",
            "name": "Nicaragua",
            "isdCode": 505,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/nicaragua.png"
          },
          {
            "code": "NE",
            "name": "Niger",
            "isdCode": 227,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/niger.png"
          },
          {
            "code": "NG",
            "name": "Nigeria",
            "isdCode": 234,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/nigeria.png"
          },
          {
            "code": "NU",
            "name": "Niue",
            "isdCode": 683,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/niue.png"
          },
          {
            "code": "NF",
            "name": "Norfolk Island",
            "isdCode": 672,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/norfolk_island.png"
          },
          {
            "code": "KP",
            "name": "North Korea",
            "isdCode": 850,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/korea_north.png"
          },
          {
            "code": "MP",
            "name": "Northern Mariana Islands",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/northern_mariana_islands.png"
          },
          {
            "code": "NO",
            "name": "Norway",
            "isdCode": 47,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/norway.png"
          },
          {
            "code": "OM",
            "name": "Oman",
            "isdCode": 968,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/oman.png"
          },
          {
            "code": "PK",
            "name": "Pakistan",
            "isdCode": 92,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/pakistan.png"
          },
          {
            "code": "PW",
            "name": "Palau",
            "isdCode": 680,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/palau.png"
          },
          {
            "code": "PS",
            "name": "Palestinian territories",
            "isdCode": 970,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/palestinian_territory.png"
          },
          {
            "code": "PA",
            "name": "Panama",
            "isdCode": 507,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/panama.png"
          },
          {
            "code": "PG",
            "name": "Papua New Guinea",
            "isdCode": 675,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/papua_new_guinea.png"
          },
          {
            "code": "PY",
            "name": "Paraguay",
            "isdCode": 595,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/paraguay.png"
          },
          {
            "code": "PE",
            "name": "Peru",
            "isdCode": 51,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/peru.png"
          },
          {
            "code": "PH",
            "name": "Philippines",
            "isdCode": 63,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/philippines.png"
          },
          {
            "code": "PN",
            "name": "Pitcairn Islands",
            "isdCode": 64,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/pitcairn_islands.png"
          },
          {
            "code": "PL",
            "name": "Poland",
            "isdCode": 48,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/poland.png"
          },
          {
            "code": "PT",
            "name": "Portugal",
            "isdCode": 351,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/portugal.png"
          },
          {
            "code": "PR",
            "name": "Puerto Rico",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/puerto_rico.png"
          },
          {
            "code": "QA",
            "name": "Qatar",
            "isdCode": 974,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/qatar.png"
          },
          {
            "code": "CG",
            "name": "Republic of the Congo",
            "isdCode": 242,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/republic_of_the_congo.png"
          },
          {
            "code": "RO",
            "name": "Romania",
            "isdCode": 40,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/romania.png"
          },
          {
            "code": "RU",
            "name": "Russia",
            "isdCode": 7,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/russia.png"
          },
          {
            "code": "RW",
            "name": "Rwanda",
            "isdCode": 250,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/rwanda.png"
          },
          {
            "code": "BL",
            "name": "Saint Barthelemy",
            "isdCode": 590,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/saint_barthelemy.png"
          },
          {
            "code": "SH",
            "name": "Saint Helena",
            "isdCode": 290,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/saint_helena.png"
          },
          {
            "code": "KN",
            "name": "Saint Kitts and Nevis",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/saint_kitts_and_nevis.png"
          },
          {
            "code": "LC",
            "name": "Saint Lucia",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/saint_lucia.png"
          },
          {
            "code": "MF",
            "name": "Saint Martin",
            "isdCode": 590,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/saint_martin.png"
          },
          {
            "code": "PM",
            "name": "Saint Pierre and Miquelon",
            "isdCode": 508,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/saint_pierre_and_miquelon.png"
          },
          {
            "code": "VC",
            "name": "Saint Vincent and the Grenadines",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/saint_vincent_and_the_grenadines.png"
          },
          {
            "code": "WS",
            "name": "Samoa",
            "isdCode": 685,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/samoa.png"
          },
          {
            "code": "SM",
            "name": "San Marino",
            "isdCode": 378,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/san_marino.png"
          },
          {
            "code": "ST",
            "name": "Sao Tome and Principe",
            "isdCode": 239,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/sao_tome_and_principe.png"
          },
          {
            "code": "SA",
            "name": "Saudi Arabia",
            "isdCode": 966,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/saudi_arabia.png"
          },
          {
            "code": "SN",
            "name": "Senegal",
            "isdCode": 221,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/senegal.png"
          },
          {
            "code": "RS",
            "name": "Serbia",
            "isdCode": 381,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/serbia.png"
          },
          {
            "code": "SC",
            "name": "Seychelles",
            "isdCode": 248,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/seychelles.png"
          },
          {
            "code": "SL",
            "name": "Sierra Leone",
            "isdCode": 232,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/sierra_leone.png"
          },
          {
            "code": "SG",
            "name": "Singapore",
            "isdCode": 65,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/singapore.png"
          },
          {
            "code": "SX",
            "name": "Sint Maarten",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/sint_maarten.png"
          },
          {
            "code": "SK",
            "name": "Slovakia",
            "isdCode": 421,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/slovakia.png"
          },
          {
            "code": "SI",
            "name": "Slovenia",
            "isdCode": 386,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/slovenia.png"
          },
          {
            "code": "SB",
            "name": "Solomon Islands",
            "isdCode": 677,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/solomon_islands.png"
          },
          {
            "code": "SO",
            "name": "Somalia",
            "isdCode": 252,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/somalia.png"
          },
          {
            "code": "ZA",
            "name": "South Africa",
            "isdCode": 27,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/south_africa.png"
          },
          {
            "code": "KR",
            "name": "South Korea",
            "isdCode": 82,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/korea_south.png"
          },
          {
            "code": "SS",
            "name": "South Sudan",
            "isdCode": 211,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/south_sudan.png"
          },
          {
            "code": "ES",
            "name": "Spain",
            "isdCode": 34,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/spain.png"
          },
          {
            "code": "LK",
            "name": "Sri Lanka",
            "isdCode": 94,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/sri_lanka.png"
          },
          {
            "code": "SD",
            "name": "Sudan",
            "isdCode": 249,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/sudan.png"
          },
          {
            "code": "SR",
            "name": "Suriname",
            "isdCode": 597,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/suriname.png"
          },
          {
            "code": "SZ",
            "name": "Swaziland",
            "isdCode": 268,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/swaziland.png"
          },
          {
            "code": "SE",
            "name": "Sweden",
            "isdCode": 46,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/sweden.png"
          },
          {
            "code": "CH",
            "name": "Switzerland",
            "isdCode": 41,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/switzerland.png"
          },
          {
            "code": "SY",
            "name": "Syria",
            "isdCode": 963,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/syria.png"
          },
          {
            "code": "TW",
            "name": "Taiwan",
            "isdCode": 886,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/republic_of_china.png"
          },
          {
            "code": "TJ",
            "name": "Tajikistan",
            "isdCode": 992,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/tajikistan.png"
          },
          {
            "code": "TZ",
            "name": "Tanzania",
            "isdCode": 255,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/tanzania.png"
          },
          {
            "code": "TH",
            "name": "Thailand",
            "isdCode": 66,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/thailand.png"
          },
          {
            "code": "TG",
            "name": "Togo",
            "isdCode": 228,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/togo.png"
          },
          {
            "code": "TK",
            "name": "Tokelau",
            "isdCode": 690,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/tokelau.png"
          },
          {
            "code": "TO",
            "name": "Tonga",
            "isdCode": 676,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/tonga.png"
          },
          {
            "code": "TT",
            "name": "Trinidad and Tobago",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/trinidad_and_tobago.png"
          },
          {
            "code": "TN",
            "name": "Tunisia",
            "isdCode": 216,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/tunisia.png"
          },
          {
            "code": "TR",
            "name": "Turkey",
            "isdCode": 90,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/turkey.png"
          },
          {
            "code": "TM",
            "name": "Turkmenistan",
            "isdCode": 993,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/turkmenistan.png"
          },
          {
            "code": "TC",
            "name": "Turks and Caicos Islands",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/turks_and_caicos_islands.png"
          },
          {
            "code": "TV",
            "name": "Tuvalu",
            "isdCode": 688,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/tuvalu.png"
          },
          {
            "code": "UG",
            "name": "Uganda",
            "isdCode": 256,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/uganda.png"
          },
          {
            "code": "UA",
            "name": "Ukraine",
            "isdCode": 380,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/ukraine.png"
          },
          {
            "code": "AE",
            "name": "United Arab Emirates",
            "isdCode": 971,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/united_arab_emirates.png"
          },
          {
            "code": "GB",
            "name": "United Kingdom",
            "isdCode": 44,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/united_kingdom.png"
          },
          {
            "code": "US",
            "name": "United States of America",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/united_states_of_america.png"
          },
          {
            "code": "UY",
            "name": "Uruguay",
            "isdCode": 598,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/uruguay.png"
          },
          {
            "code": "UZ",
            "name": "Uzbekistan",
            "isdCode": 998,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/uzbekistan.png"
          },
          {
            "code": "VU",
            "name": "Vanuatu",
            "isdCode": 678,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/vanuatu.png"
          },
          {
            "code": "VA",
            "name": "Vatican City",
            "isdCode": 379,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/vatican_city.png"
          },
          {
            "code": "VE",
            "name": "Venezuela",
            "isdCode": 58,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/venezuela.png"
          },
          {
            "code": "VN",
            "name": "Vietnam",
            "isdCode": 84,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/vietnam.png"
          },
          {
            "code": "VG",
            "name": "Virgin Islands",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/virgin_islands_british.png"
          },
          {
            "code": "VI",
            "name": "Virgin Islands of the United States",
            "isdCode": 1,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/virgin_islands_us.png"
          },
          {
            "code": "WF",
            "name": "Wallis and Futuna",
            "isdCode": 681,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/wallis_and_futuna.png"
          },
          {
            "code": "EH",
            "name": "Western Sahara",
            "isdCode": 212,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/western_sahara.png"
          },
          {
            "code": "YE",
            "name": "Yemen",
            "isdCode": 967,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/yemen.png"
          },
          {
            "code": "ZM",
            "name": "Zambia",
            "isdCode": 260,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/zambia.png"
          },
          {
            "code": "ZW",
            "name": "Zimbabwe",
            "isdCode": 263,
            "iconUrl": "https://d3hprka3kr08q2.cloudfront.net/yupptv/yuppflix/countries/zimbabwe.png"
          }
        ]
      }
}

utilities.validMobileEmail =function(data){    
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var regex = new RegExp("^[0-9]{9}");      
  var isEmail= re.test(data);
  var isMobile = regex.test(data); 
  return {
      isMobile : isMobile,
      isEmail : isEmail
  }
}


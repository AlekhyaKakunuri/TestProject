var analytics = {
	plugin: {}
}

analytics.load = function () {
	try {
		connectionType=navigator.connection.type;
		var setLocationData = {};
		setLocationData = {
			'authKey': locationData.analyticsInfo.authKey,
			'trueIp': locationData.ipInfo.trueIP,
		}
		analytics.plugin = VideoAnalyticsPlugin.load(setLocationData);
	}
	catch (e) {
		console.log(e);
	}
}

analytics.setMetaData = function (url) {
	try {
		var setDemographicsDataParams = {};
		setDemographicsDataParams = {
			'vendorId':locationData["vendor_id"],
			'countryName': locationData.ipInfo.country,
			'state': (locationData.ipInfo.region == 'UnKnown') ? -1 : locationData.ipInfo.region,
			'city': (locationData.ipInfo.city == 'UnKnown') ? -1 :(locationData.ipInfo.city)
		}
        analytics.plugin.setDemographics(setDemographicsDataParams);
        
		var setPlayerMetaDataParams = {};
		setPlayerMetaDataParams = {
			'playerName': 'Toast Player',
			'playerVersion': '1.0'
		}
		analytics.plugin.setPlayerMetaData(setPlayerMetaDataParams);

		var setClientMetaDataParams = {};
		setClientMetaDataParams = {
			'appVersion': '1.0',
			'connectionType': connectionType,
			'clientIP': locationData.ipInfo.trueIP,
			'NWProvider': ''
		}
		analytics.plugin.setClientMetaData(setClientMetaDataParams);
        
		var setcontentDataParams = {};
		setcontentDataParams = {
			'programId': presentPagedetails.steamResponse.analyticsInfo.id,
			'programName': presentPagedetails.pageContent[0].title,
			'CDNetwork': (!!presentPagedetails.steamResponse) ? presentPagedetails.steamResponse.streams[0].streamType : '',
			'navigationFrom':presentPagedetails.navigationFrom,
			'lang': (!!Main.userProfile.languages)? Main.userProfile.languages:'All',//contentValues.lang,			
			'isSubscribed': ((!Main.userProfile.mobile) ? '0' : (Main.userProfile.mobile && (Main.packages.length > 0)) ? '1' : '0'),
			'meta_id': presentPagedetails.steamResponse.analyticsInfo.dataKey,
			'vodNumber': '-1',
			'EPGStartTime': '-1',
			'IsPromotional': '-1',
			'DeviceModel': device.model,
			'DeviceBrand': device.manufacturer,
			'Device_OS_Version': device.version,
			'EPG_EndTime': '-1',
		}
        analytics.plugin.setContentMetaData(setcontentDataParams);
        
		var setUserMetadataParams = {};
		setUserMetadataParams = {
			'userId': Main.userProfile.userId,
			'boxId': Main.BOXID,
			'deviceType': "smarttvapp",
			'deviceClient': "samsung",
			'deviceId': appConfig.APPID,
			'deviceOS': device.platform,
			'partnerId': '',
			'partnerName': ''
		}
		analytics.plugin.setUserMetaData(setUserMetadataParams);
		var setVideoMetaDataParams = {};
		var setVideoMetaDataParams = {
			'autoplay': false,
			'productName': Main.productCode, //productName,
			'streamURL': url.substring(0, url.indexOf('?')),
			'contentType': presentPagedetails.steamResponse.analyticsInfo.contentType//.analyticsInfo.contentType
		};
		analytics.plugin.setVideoMetaData(setVideoMetaDataParams);
	}
	catch (e) {
		console.log(e.message);
	}
}

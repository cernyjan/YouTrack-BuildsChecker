$( document ).ready(function() {
    console.log("YouTrack Builds Checker is Online");
	

	let lastUrl = location.href; 
	var timer = setInterval(ytTimer, 1000);
	var isTimerRunning = true;


	new MutationObserver(() => {
		const url = location.href;
		if (url !== lastUrl) {
			lastUrl = url;
			onUrlChange();
		}
	}).observe(document, {subtree: true, childList: true});
		

	function onUrlChange() {
		if (isTimerRunning) {
			clearInterval(timer);
			isTimerRunning = false;
			console.log("YouTrack Builds Checker is Offline");
		}
		console.log("YouTrack Builds Checker is Online");
		timer = setInterval(ytTimer, 1000);
		isTimerRunning = true;		
	}	


	function GetFixedInVersionLiteElement() {
		var divTags = document.getElementsByTagName("div");
		for (var i = 0; i < divTags.length; i++) {
			if (divTags[i].hasAttribute('title')) {
				var title = divTags[i].getAttribute('title');
				if (title.indexOf('Fixed in Version:') > -1) {
					return divTags[i];
				}
			}
		}
		return null;
	}


	function GetVerifiedInVersionLiteElement() {
		var divTags = document.getElementsByTagName("div");
		for (var i = 0; i < divTags.length; i++) {
			if (divTags[i].hasAttribute('title')) {
				var title = divTags[i].getAttribute('title');
				if (title.indexOf('Verified in Version:') > -1) {
					return divTags[i];
				}
			}
		}
		return null;
	}


	function GetVersions(element, mode) {
		var versions = [];
		if (mode.indexOf('fixed') > -1) {
			versions = element.getAttribute('title').split("Fixed in Version: ")[1].split(", ");

		}
		else if (mode.indexOf('verified') > -1) {
			versions = element.getAttribute('title').split("Verified in Version: ")[1].split(", ");
		}
		else {
			console.log("Unexpected mode: '" + mode + "'");
		}
		
		return versions;
	}

	function GetVersionsToWrite(versions) {
		var newValue = "";
		for (i = 0; i < versions.length; ++i) {
			newValue = newValue + versions[i] + "<br />";
		}

		return newValue;		
	}


	function TryToColor() {
		var pathname = window.location.pathname;
		if (pathname.indexOf('/issue') >= 0) {
			var fixedInVersionLiteElement = GetFixedInVersionLiteElement();
			var verifiedInVersionLiteElement = GetVerifiedInVersionLiteElement();
			if (fixedInVersionLiteElement != null && verifiedInVersionLiteElement != null) {
				var fixedInVersions = GetVersions(fixedInVersionLiteElement, 'fixed');
				var verifiedInVersions = GetVersions(verifiedInVersionLiteElement, 'verified');
				var newValues = [];
				for (i = 0; i < fixedInVersions.length; ++i) {
					fixedInVersion = fixedInVersions[i];
					var newValue = "<font style=\"background-color: red; color: white;\">" + fixedInVersion +"</font>";;
					if (fixedInVersion.indexOf('No fixed in version') > -1 && verifiedInVersions[0].indexOf('No verified in version') > -1) {
						return;
					}
					else if (fixedInVersion.indexOf('No fixed in version') > -1 && verifiedInVersions[0].indexOf('No verified in version') == -1) {
						newValue = "<font style=\"background-color: red; color: white;\">" + verifiedInVersionLiteElement.title.replace("Verified in Version: ",''); +"</font>";
						verifiedInVersionLiteElement.getElementsByTagName("span")[2].innerHTML = newValue;
						return;
					}
					else {
						fixedInVersionSpitted = fixedInVersion.split(" ");
						fixedInVersionDistribution = fixedInVersionSpitted[0];
						fixedInVersionNumbersArray = fixedInVersionSpitted[1].split(".");
						FIVMain = parseInt(fixedInVersionNumbersArray[0]);
						FIVMinor = parseInt(fixedInVersionNumbersArray[1]);
						FIVBuild = parseInt(fixedInVersionNumbersArray[2]);
						FIVRevision = parseInt(fixedInVersionNumbersArray[3]);
						
						if (verifiedInVersions.includes(fixedInVersion)) {
							//identical FIV in VIV
							newValue = fixedInVersion;
							newValues.push(newValue);
						}
						else {
							for (j = 0; j < verifiedInVersions.length; ++j) {
								verifiedInVersion = verifiedInVersions[j];
								verifiedInVersionSpitted = verifiedInVersion.split(" ");
								verifiedInVersionDistribution = verifiedInVersionSpitted[0];
								verifiedInVersionNumbersArray = verifiedInVersionSpitted[1].split(".");
								VIVMain = parseInt(verifiedInVersionNumbersArray[0]);
								VIVMinor = parseInt(verifiedInVersionNumbersArray[1]);
								VIVBuild = parseInt(verifiedInVersionNumbersArray[2]);
								VIVRevision = parseInt(verifiedInVersionNumbersArray[3]);

								if (fixedInVersionDistribution == verifiedInVersionDistribution) {
									if (VIVMain == FIVMain && VIVMinor == FIVMinor){
										if(VIVBuild > FIVBuild){
											newValue = fixedInVersion;
										}
										else if(VIVBuild == FIVBuild && VIVRevision >= FIVRevision) {
											newValue = fixedInVersion;
										}	
									}
								}
							}
							newValues.push(newValue);
						}
					}
				}

				fixedInVersionLiteElement.getElementsByTagName("span")[2].innerHTML = GetVersionsToWrite(newValues);
			}
			else {
				//old way - obsolete - temporary used
				FixedInVersionYt =  $('span:contains("Fixed in Version")').parent().next('td').children("span").find("span[data-user-id]");
			
				VerifiedInVersionYt =  $('span:contains("Verified in Version")').parent().next('td').children("span").find("span[data-user-id]");
				var VerifiedInVersionArray = [];
				VerifiedInVersionYt.each(function(){
					VerifiedInVersionArray.push($(this).text());
				});

				var distributions = ["OM5-Cloud", "OMS-500", "OM5-Plug-in"];
				var version = ["8", "5"]

				FixedInVersionYt.each(function(){
					var FixedInVersion = $(this).text()
					if (VerifiedInVersionArray[0] != "No verified in version") {
						//compare Fix and Verify
						var BreakException = {};
						FixedInVersionSpitted = FixedInVersion.split(" ");
						FixedInVersionDistribution = FixedInVersionSpitted[0];
						FixedInVersionNumbersArray = FixedInVersionSpitted[1].split(".");
						FIVMain = parseInt(FixedInVersionNumbersArray[0])
						FIVMinor = parseInt(FixedInVersionNumbersArray[1])
						FIVBuild = parseInt(FixedInVersionNumbersArray[2])
						FIVRevision = parseInt(FixedInVersionNumbersArray[3])
						found = false;
						if (VerifiedInVersionArray.indexOf(FixedInVersion) > -1){
							found = true;
						}
						else{
							try {
								VerifiedInVersionArray.forEach(function(VerifiedInVersion) {
									VerifiedInVersionSpitted = VerifiedInVersion.split(" ");
									VerifiedInVersionDistribution = VerifiedInVersionSpitted[0];
									if (FixedInVersionDistribution == VerifiedInVersionDistribution)
									{								
										VerifiedInVersionNumbersArray = VerifiedInVersionSpitted[1].split(".");
										VIVMain = parseInt(VerifiedInVersionNumbersArray[0])
										VIVMinor = parseInt(VerifiedInVersionNumbersArray[1])
										VIVBuild = parseInt(VerifiedInVersionNumbersArray[2])
										VIVRevision = parseInt(VerifiedInVersionNumbersArray[3])
										if (distributions.includes(FixedInVersionDistribution) == false)
										{
											if (VIVMain == FIVMain && VIVMinor == FIVMinor){
												if(VIVBuild > FIVBuild){
													found = true;
													throw BreakException;
												}
												else if(VIVBuild == FIVBuild && VIVRevision >= FIVRevision) {
													found = true;
													throw BreakException;
												}	
											}
										}
										else
										{
											if (VIVMain == FIVMain && VIVMinor == FIVMinor){
												if (VIVMain != parseInt(version[0]) && VIVMinor != parseInt(version[1]))
												{
													if(VIVBuild > FIVBuild){
														found = true;
														throw BreakException;
													}
													else if(VIVBuild == FIVBuild && VIVRevision >= FIVRevision) {
														found = true;
														throw BreakException;
													}
												}
												else
												{
													if((VIVBuild > FIVBuild) && (FIVBuild < 200 && VIVBuild < 200)){
														found = true;
														throw BreakException;
													}
													else if((VIVBuild > FIVBuild) && ((FIVBuild < 300 && VIVBuild < 300) && (FIVBuild >= 200 && VIVBuild >= 200))){
														found = true;
														throw BreakException;
													}
													else if((VIVBuild > FIVBuild) && (FIVBuild > 300 && VIVBuild > 300)){
														found = true;
														throw BreakException;
													}											
													else if((VIVBuild == FIVBuild && VIVRevision >= FIVRevision)) {
														found = true;
														throw BreakException;
													}
												}	
											}
										}
									}
								});
							} 
							catch (e) {
							if (e !== BreakException) throw e;
							}
						}
						if (!found) {
							if (FixedInVersion != "No fixed in version") 
							{
								$(this).css('background-color', "red");
								$(this).css('color', "white");
							}
						}
						else
						{
							$(this).css('background-color', "");
							$(this).css('color', "");
						}
					}
					else
					{
						if (FixedInVersion != "No fixed in version") 
						{
							$(this).css('background-color', "red");
							$(this).css('color', "white");
						}
					}    
				});
			}
		}	
		else {
			//go to next iteration
		}
	}


	function ytTimer() {
		TryToColor();
	}	
});
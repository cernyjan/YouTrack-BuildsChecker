$( document ).ready(function() {
	console.log("YouTrack Builds Checker is Online");

	function iteration() {
	    myVar = setInterval(checkBuilds, 1000);
	}

	function checkBuilds() {
		//after redesign
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

	iteration(false);

});
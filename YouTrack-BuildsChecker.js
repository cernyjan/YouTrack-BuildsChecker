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
								if (distributions.includes(FixedInVersionDistribution) == false)
								{
									if ((parseInt(VerifiedInVersionNumbersArray[0]) == parseInt(FixedInVersionNumbersArray[0])) && (parseInt(VerifiedInVersionNumbersArray[1]) == parseInt(FixedInVersionNumbersArray[1]))){
										if(parseInt(VerifiedInVersionNumbersArray[2]) > parseInt(FixedInVersionNumbersArray[2])){
											found = true;
											throw BreakException;
										}
										else if((parseInt(VerifiedInVersionNumbersArray[2]) == parseInt(FixedInVersionNumbersArray[2])) && (parseInt(VerifiedInVersionNumbersArray[3]) >= parseInt(FixedInVersionNumbersArray[3]))) {
											found = true;
											throw BreakException;
										}	
									}
								}
								else
								{
									if ((parseInt(VerifiedInVersionNumbersArray[0]) == parseInt(FixedInVersionNumbersArray[0])) && (parseInt(VerifiedInVersionNumbersArray[1]) == parseInt(FixedInVersionNumbersArray[1]))){
										if (parseInt(VerifiedInVersionNumbersArray[0]) != parseInt(version[0]) && parseInt(VerifiedInVersionNumbersArray[1]) != parseInt(version[1]))
										{
											if(parseInt(VerifiedInVersionNumbersArray[2]) > parseInt(FixedInVersionNumbersArray[2])){
												found = true;
												throw BreakException;
											}
											else if((parseInt(VerifiedInVersionNumbersArray[2]) == parseInt(FixedInVersionNumbersArray[2])) && (parseInt(VerifiedInVersionNumbersArray[3]) >= parseInt(FixedInVersionNumbersArray[3]))) {
												found = true;
												throw BreakException;
											}
										}
										else
										{
											if((parseInt(VerifiedInVersionNumbersArray[2]) > parseInt(FixedInVersionNumbersArray[2])) && (parseInt(FixedInVersionNumbersArray[2]) >= 1 && parseInt(FixedInVersionNumbersArray[2]) < 200) && (parseInt(VerifiedInVersionNumbersArray[2]) >= 1 && parseInt(VerifiedInVersionNumbersArray[2]) < 200) && (parseInt(FixedInVersionNumbersArray[2]) >= 200 && parseInt(FixedInVersionNumbersArray[2]) < 300) && (parseInt(VerifiedInVersionNumbersArray[2]) >= 200 && parseInt(VerifiedInVersionNumbersArray[2]) < 300) && (parseInt(FixedInVersionNumbersArray[2]) >= 301 && parseInt(VerifiedInVersionNumbersArray[2]) >= 301)){
												found = true;
												throw BreakException;
											}
											else if((parseInt(VerifiedInVersionNumbersArray[2]) == parseInt(FixedInVersionNumbersArray[2])) && (parseInt(VerifiedInVersionNumbersArray[3]) >= parseInt(FixedInVersionNumbersArray[3]))) {
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
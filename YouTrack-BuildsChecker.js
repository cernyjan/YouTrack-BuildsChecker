$( document ).ready(function() {
	console.log("YouTrack Builds Checker is Online");

	function iteration() {
	    myVar = setInterval(checkBuilds, 1000);
	}

	function checkBuilds() {
		if ($('a:contains("YouTrack 2018.3")').length == 1)
		{
			//after redesign
			FixedInVersionYt =  $('span:contains("Fixed in Version")').parent().next('td').children("span").find("span[data-user-id]");
			
			VerifiedInVersionYt =  $('span:contains("Verified in Version")').parent().next('td').children("span").find("span[data-user-id]");
			var VerifiedInVersionArray = [];
			VerifiedInVersionYt.each(function(){
			    VerifiedInVersionArray.push($(this).text());
			});

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
		else
		{
			//old version of YT
			FixedInVersionYt =  $('div:contains("Fixed in Version")').parent().next('td').children("div").children("a");
			FixedInVersionArray =  $( FixedInVersionYt ).attr( "title" ).replace("Fixed in Version: ", "").split(',').map(function(item) {
	  			return item.trim();
			})
			
			if (FixedInVersionArray[0] != "No fixed in version") {
				VerifiedInVersionArray =  $('div:contains("Verified in Version")').parent().next('td').children("div").children("a").attr( "title" ).replace("Verified in Version: ", "").split(',').map(function(item) {
			  		return item.trim();
				});
				checkResultText = "";
				if (VerifiedInVersionArray[0] != "No verified in version") {
					//compare Fix and Verify
					var BreakException = {};
					FixedInVersionArray.forEach(function(FixedInVersion) {
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
								});
							} 
							catch (e) {
							  if (e !== BreakException) throw e;
							}
						}
						if (!found) {
							checkResultText = checkResultText + "<span class='c20'>" + FixedInVersion + "&nbsp;" + "</span>, ";
						}
						else
						{
							checkResultText = checkResultText + FixedInVersion + "&nbsp;" + ", ";
						}
					});
				}
				else
				{
					FixedInVersionArray.forEach(function(FixedInVersion) {
						checkResultText = checkResultText + "<span class='c20'>" + FixedInVersion  + "&nbsp;" + "</span>, ";
					});
				}

				$( FixedInVersionYt ).text("");
				if (checkResultText.length > 0){
					checkResultText = checkResultText.substr(0, checkResultText.length - 2)
				}
				$( FixedInVersionYt ).append(checkResultText);
			}
		}
	}

	iteration(false);

});
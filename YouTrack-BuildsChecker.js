$( document ).ready(function() {
	console.log("YouTrack Builds Checker is Online");

	function iteration() {
	    myVar = setInterval(checkBuilds, 1000);
	}

	function checkBuilds() {
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
					FixedInVersionNumbersArray = FixedInVersion.split(" ")[1].split(".");
					found = false;
					if (VerifiedInVersionArray.indexOf(FixedInVersion) > -1){
						found = true;
					}
					else{
						try {
							VerifiedInVersionArray.forEach(function(VerifiedInVersion) {
								VerifiedInVersion = VerifiedInVersion.split(" ")[1].split(".");
								if((parseInt(VerifiedInVersion[0]) == parseInt(FixedInVersionNumbersArray[0])) && (parseInt(VerifiedInVersion[1]) == parseInt(FixedInVersionNumbersArray[1]))){
									if(parseInt(VerifiedInVersion[2]) > parseInt(FixedInVersionNumbersArray[2])){
										found = true;
										throw BreakException;
									}
									else if((parseInt(VerifiedInVersion[2]) == parseInt(FixedInVersionNumbersArray[2])) && (parseInt(VerifiedInVersion[3]) >= parseInt(FixedInVersionNumbersArray[3]))) {
										found = true;
										throw BreakException;
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

	iteration(false);

});
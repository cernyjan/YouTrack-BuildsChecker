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
					found = false;
					if (VerifiedInVersionArray.indexOf(FixedInVersion) > -1){
						found = true;
					}
					else{
						try {
							VerifiedInVersionArray.forEach(function(VerifiedInVersion) {	
								if(VerifiedInVersion.substr(0, VerifiedInVersion.length - 4) == FixedInVersion.substr(0, FixedInVersion.length - 4)){
									if(parseInt(VerifiedInVersion.substr(VerifiedInVersion.length - 3, 1)) > parseInt(FixedInVersion.substr(FixedInVersion.length - 3, 1))){
										found = true;
										throw BreakException;
									}
									else if((parseInt(VerifiedInVersion.substr(VerifiedInVersion.length - 3, 1)) == parseInt(FixedInVersion.substr(FixedInVersion.length - 3, 1))) && (parseInt(VerifiedInVersion.substr(VerifiedInVersion.length - 1, 1)) >= parseInt(FixedInVersion.substr(FixedInVersion.length - 1, 1)))) {
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
						checkResultText = checkResultText + "<font color='red'>" + FixedInVersion + "</font>, ";
					}
					else
					{
						checkResultText = checkResultText + FixedInVersion + ", ";
					}
				});
			}
			else
			{
				FixedInVersionArray.forEach(function(FixedInVersion) {
					checkResultText = checkResultText + "<font color='red'>" + FixedInVersion + "</font>, ";
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
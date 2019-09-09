(function executeRule(current, previous /*null when async*/) {

		// Add your code here   
try { 
	var r = new sn_ws.RESTMessageV2();
	
	var inc_shortdescr = current.short_description ;
	var inc_sysID =  current.sys_id.toString();
	var inc_description = current.description.toString();	
	 var appToSend = current.u_choice_1.toString();
	var currentTextProgressupdate = current.u_string_full_utf8_3_progressUpdate;
	
	 var response =  "";
	 var responseBody =  "";
	 var httpStatus =  "";
	 var parsedResponse =  "";
	
	if (appToSend == "Target1")
		{
	r.setBasicAuth('USERID', 'y7zv2hgqe45tz55zzubexebruxe363gqqdrgwv3w5vhasizus3wq');
	r.setHttpMethod("POST"); // GET or POST verbs, depends on your service
	r.setEndpoint('https://Target1demo.visualstudio.com/Target1DemoProject/_apis/wit/workitems/$User%20Story?api-version=4.1');
	r.setRequestHeader("Content-Type", "application/json-patch+json");
	r.setRequestBody(JSON.stringify([{"op" : "add"  ,	"path" : "/fields/System.Title","from" : "null","value" : current.number +": " + inc_shortdescr	},{"op" : "add"  ,	"path" : "/fields/Custom.sysid_snow","from" : "null","value" : inc_sysID },{"op" : "add"  ,	"path" : "/fields/System.Description","from" : "null","value" : inc_description }]));
			
	
			
	// Execute the REST API and Process the response
	  response = r.execute();
	  responseBody = response.getBody();
	  httpStatus = response.getStatusCode();
	  parsedResponse = JSON.parse(responseBody);
			
	current. u_url_1 =  parsedResponse.url;
			
	current. u_string_full_utf8_3_progressUpdate = "VSTS ID:  "+ parsedResponse.id +" is created for Servicing the  request";
			current. u_string_3 = "VSTS ID:  "+ parsedResponse.id +" is added in DevTeam's Backlog";
			
	gs.addInfoMessage("VSTS User Stroy created :VSTS ID:"+ parsedResponse.id +"URL:"+ parsedResponse.url);

		}
	else if (appToSend == "Target2")
		{
	//gs.addInfoMessage("User story creeated in  JIRA");
	r.setBasicAuth('USERID@outlook.com', 'pwd');
	r.setHttpMethod("POST"); // GET or POST verbs, depends on your service
	r.setEndpoint('https://cdsdevopslab.atlassian.net/rest/api/2/issue');
	r.setRequestHeader("Content-Type", "application/json");
		
      
	r.setRequestBody(JSON.stringify({"fields": {"project": {"id": "10000"}, "summary": current.number +": " + inc_shortdescr, "issuetype": {"id": "10001"}, "priority": {"id": "3" },"description": inc_description,}})); 
			
	
			
	// Execute the REST API and Process the response
	  response = r.execute();
	  responseBody = response.getBody();
	  httpStatus = response.getStatusCode();
	  parsedResponse = JSON.parse(responseBody);
		current. u_url_1  = "JIRA ID:  "+ parsedResponse.id +" is added in DevTeam's Backlog";	
				
	current. u_string_full_utf8_3_progressUpdate =  "JIRA ID:  "+ parsedResponse.id +"  URL:"+ parsedResponse.url;
			
		}
	else if (appToSend == "Others")
		{
			gs.addInfoMessage(" NO  external action is triggered ");
		}
	
	
}
catch(ex) {
 var message = ex.getMessage();
gs.addInfoMessage(" External trigger Status :Failed ");
}

})(current, previous);

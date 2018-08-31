

(function executeRule(current, previous /*null when async*/) {

	// Add your code here   
try { 
	var r = new sn_ws.RESTMessageV2();
	
	var inc_shortdescr = current.short_description ;
	var inc_sysID =  current.sys_id.toString();
	var inc_description = current.description.toString();	
	 var appToSend = current.u_choice_5.toString();
	if (appToSend == "cbsp")
		{
	r.setBasicAuth('cicduser_tcscibc', 'j2xh54ybatq7f3qkn3pohrfqrk5tbdrgkjnuujelqmycbpzxacdq');
	r.setHttpMethod("POST"); // GET or POST verbs, depends on your service
	r.setEndpoint('https://cbspdemo.visualstudio.com/CBSPDemoProject/_apis/wit/workitems/$User%20Story?api-version=4.1');
	r.setRequestHeader("Content-Type", "application/json-patch+json");
	r.setRequestBody(JSON.stringify([{"op" : "add"  ,	"path" : "/fields/System.Title","from" : "null","value" : current.number +": " + inc_shortdescr	},{"op" : "add"  ,	"path" : "/fields/Custom.sysid_snow","from" : "null","value" : inc_sysID },{"op" : "add"  ,	"path" : "/fields/System.Description","from" : "null","value" : inc_description }]));
			
	
			
	// Execute the REST API and Process the response
	 var response = r.execute();
	 var responseBody = response.getBody();
	 var httpStatus = response.getStatusCode();
	 var parsedResponse = JSON.parse(responseBody);
			
	current. u_string_1 = "VSTS ID:  "+ parsedResponse.id +"  URL:"+ parsedResponse.url;
	current. u_progress_updates = "VSTS ID:  "+ parsedResponse.id +" is created for Servicing the  request";
			
	gs.addInfoMessage("VSTS User Stroy created :VSTS ID:"+ parsedResponse.id +"URL:"+ parsedResponse.url);

		}
	else if (appToSend == "maap")
		{
			gs.addInfoMessage("User story creeated in  JIRA");
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

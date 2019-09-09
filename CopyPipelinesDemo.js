(function executeRule(current, previous /*null when async*/) {

	try
	{
     	/***************** Creation of CI Pipeline start **********************/
		
        var in_projectName = "AutoCICD" ; //TODO:
		var in_projectId = "311f7e4e-c628-49af-be81-86413447b0b4"; //TODO:
		var in_collectionId = "b2392ecf-19ef-4d88-9ae4-54597b76294a"; //TODO:
		var in_currPipelinePrefix = "Jul19"; //TODO:
		var in_newPipelinePrefix = "Aug19"; //TODO:
		var in_baseBranchName = "AutoCICD_POCApp"; //TODO:
		var in_buildRESTUrl= "https://dev.azure.com/Sourcelab"; //TODO:
		var in_releaseRESTUrl = "https://vsrm.dev.azure.com/Sourcelab"; //TODO:
		var in_env = "dev";//TODO:
		var in_buildDefId = 0;//199; //TODO:
		var in_releaseDefId = 0;//1; //TODO:
		
		var in_currCIPipeline = in_currPipelinePrefix + "-" + in_env + "-" + in_baseBranchName + "-CI"; //TODO:
		var in_currCDPipeline = in_currPipelinePrefix + "-" + in_env + "-" + in_baseBranchName + "-CD"; //TODO:
		var in_newBranchName = in_newPipelinePrefix + "_" + in_baseBranchName; //TODO:
		var in_newCIPipeline = in_newPipelinePrefix + "-" + in_env + "-" + in_baseBranchName + "-CI"; //TODO:
		var in_newCDPipeline = in_newPipelinePrefix + "-" + in_env + "-" + in_baseBranchName + "-CD"; //TODO:

		//GET CI PIPELINE DEFINITION ID

		var fnAutoCICD = new AutoCICD();
		var apiUrl = 'https://dev.azure.com/Sourcelab/AutoCICD/_apis/build/definitions?api-version=5.0';
		var retMessage = fnAutoCICD.getDefinitionId(apiUrl,in_currCIPipeline);
		var httpStatus = retMessage[0];
		if (httpStatus != SUCCESS_STATUS_CODE)
		{
			gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to fetch Build Definition Id");
			return;
		}
		in_buildDefId = retMessage[1];
		
		
		//GET CI PIPELINE DEFINITION DETAILS

		apiUrl= in_buildRESTUrl  + '/' + in_projectName + '/_apis/build/definitions/' + in_buildDefId + '?api-version=5.0';
		retMessage = fnAutoCICD.getDefinitionDetails(apiUrl);
		httpStatus = retMessage[0];
		if (httpStatus != SUCCESS_STATUS_CODE)
		{
			gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to fetch Build Definition Details");
			return;
		}
		var parsedResponse = retMessage[1];

		//CREATING NEW CI PIPELINE
		
		parsedResponse.repository.defaultBranch = "refs/heads/" + in_newBranchName;
		parsedResponse.name= in_newCIPipeline;

		apiUrl = in_buildRESTUrl  + '/' + in_projectName + '/_apis/build/definitions?api-version=5.0';
		retMessage = fnAutoCICD.createPipeLine(apiUrl,parsedResponse);
		httpStatus =retMessage[0];
		if (httpStatus != SUCCESS_STATUS_CODE)
		{
			gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to create the Build pipeline");
			return;
		}		
		parsedResponse =  retMessage[1];
	
	    var out_newBuildDefId = parsedResponse.id;
		var out_newCIpipeline = parsedResponse.name; //TODO: No need as it is same as in_newCIPipeline
		gs.addInfoMessage("Successfully created the BUILD Pipeline : " + in_newCIPipeline);
		
		/***************** Creation of CI Pipeline End   **********************/
		
		/***************** Creation of CD Pipeline start **********************/

		//GET CD PIPELINE DEFINITION ID

		apiUrl = 'https://vsrm.dev.azure.com/Sourcelab/AutoCICD/_apis/release/definitions?api-version=5.0';
		retMessage = fnAutoCICD.getDefinitionId(apiUrl,in_currCDPipeline);
		httpStatus = retMessage[0];
		if (httpStatus != SUCCESS_STATUS_CODE)
		{
			gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to fetch Release Definition Id");
			return;
		}
		in_releaseDefId = retMessage[1];
		
		
		//GET CD PIPELINE DEFINITION DETAILS
		
		apiUrl =  in_releaseRESTUrl + '/' + in_projectName + '/_apis/Release/definitions/' + in_releaseDefId + '?api-version=5.0';
		retMessage = fnAutoCICD.getDefinitionDetails(apiUrl);
		httpStatus = retMessage[0];
		if (httpStatus != SUCCESS_STATUS_CODE)
		{
			gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to fetch Release Definition Details");
			return;
		}
		parsedResponse = retMessage[1];
		
		//CREATING NEW CD PIPELINE

		parsedResponse.name= in_newCDPipeline;
		parsedResponse.artifacts[0].sourceId = in_projectId + ":" + out_newBuildDefId; //TODO:
		parsedResponse.artifacts[0].alias = "_" + in_newCIPipeline; //TODO:
		parsedResponse.artifacts[0].definitionReference.definition.id =  out_newBuildDefId; //TODO:
		parsedResponse.artifacts[0].definitionReference.definition.name = out_newCIpipeline; //TODO:
		parsedResponse.artifacts[0].definitionReference.artifactSourceDefinitionUrl.id = in_buildRESTUrl + "/_permalink/_build/index?collectionId=" + in_collectionId + "&projectId=" + in_projectId + "&definitionId=" + out_newBuildDefId; //TODO:
		
		apiUrl = in_releaseRESTUrl + '/' + in_projectName + '/_apis/Release/definitions?api-version=5.0';
		retMessage = fnAutoCICD.createPipeLine(apiUrl,parsedResponse);
		httpStatus =retMessage[0];
		if (httpStatus != SUCCESS_STATUS_CODE)
		{
			gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to create the Release pipeline");
			return;
		}		
		parsedResponse =  retMessage[1];	
		gs.addInfoMessage("Successfully created the RELEASE Pipeline : " + in_newCDPipeline);
		
		/***************** Creation of CD Pipeline End **********************/
	}		
	catch(ex) {
		var message = ex.getMessage;
		gs.addInfoMessage("External trigger failed : " + message);
	}
})(current, previous);

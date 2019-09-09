// Copy a template repo and branche(s) from a diffrent organization
(function executeRule(current, previous /*null when async*/) {

    try	{

        var SUCCESS_STATUS_CODE = 200;
		var SUCCESS_STATUS_CODE1 = 201;
		var SUCCESS_STATUS_CODE2 = 202;
		
		var src_userId = "yourUserID";
        var targ_userId = "yourUserID";
        var targ_PATToken = "hoyxlu3d5ahlwyc7iysjg7zux2j5lab42cafpzwdwxzhkbdnki5a";
		var src_PATToken = "v2soeacx2voeffvwecfmffjkdubmwrztvxui4nk5hprwetkjurwa";

		var srcOrgUrl = "https://dev.azure.com/Sourcelab";
		var srcOrgUrl_vsrm ="https://vsrm.dev.azure.com/Sourcelab";
        var sourcePrjName = "TemplateSQLDB";
		var sourceRepoName = "TemplateSQLDB";
		
		var targetOrgUrl = "https://dev.azure.com/Targetlab";
		var targetOrgUrl_vsrm = "https://vsrm.dev.azure.com/Targetlab";
        var targetProjName = "SQLDBSample" ; //TODO : Input
		
        var response;
        var in_request;
        var parsedResponse;
        var apiUrl;
        var retMessage;
        var httpStatus;
        var fnRESTDevOps; 
        

		
        //******************** Create Project 
        apiUrl = targetOrgUrl + '/_apis/projects?api-version=5.0';
		
        in_request = {
            "name": targetProjName ,
            "capabilities": {
                "versioncontrol": {
                "sourceControlType": "Git"
                },
                "processTemplate": {
                "templateTypeId": "6b724908-ef14-45cf-84f8-768b5384da45"
                }
            }
        };
        
		fnRESTDevOps = new RESTDevOps();
        retMessage = fnRESTDevOps.postData(targ_userId,targ_PATToken,apiUrl,in_request);
        httpStatus = retMessage[0];
        if (httpStatus != SUCCESS_STATUS_CODE2)
        {
            gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to create project");
            return;
        }
        parsedResponse = retMessage[1];
        var operationId= parsedResponse.id;
		
        //******************** Check whether the new Project is created or not
        var start = Date.now(); 
        var now = start;
        var projectStatus = "";
        apiUrl = targetOrgUrl + '/_apis/operations/' + operationId + '?api-version=5.0';
        
        while(projectStatus != "succeeded"){
			fnRESTDevOps = new RESTDevOps();
            retMessage = fnRESTDevOps.getData(targ_userId,targ_PATToken,apiUrl);
            httpStatus = retMessage[0];
            if (httpStatus != SUCCESS_STATUS_CODE)
            {
                gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to check status of project creation");
                return;
            }
            parsedResponse = retMessage[1];
            projectStatus = parsedResponse.status;
            while (now - start < 5000) {
                now = Date.now();
            }
        }

        //******************** Get project Id of the newly created project 
        apiUrl = targetOrgUrl + '/_apis/projects/' + targetProjName + '?api-version=5.0';
		fnRESTDevOps = new RESTDevOps();
        retMessage = fnRESTDevOps.getData(targ_userId,targ_PATToken,apiUrl);
        httpStatus = retMessage[0];
        if (httpStatus != SUCCESS_STATUS_CODE)
        {
            gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to fetch project id");
            return;
        }
        parsedResponse = retMessage[1];
        var targetPrjId = parsedResponse.id;
gs.addInfoMessage(targetPrjId);
        //******************** Get repository id of the newly automatically created repo while creating the project 
        apiUrl = targetOrgUrl + '/' + targetProjName + '/_apis/git/repositories/' + targetProjName + '?api-version=5.0';
		fnRESTDevOps = new RESTDevOps();
        retMessage = fnRESTDevOps.getData(targ_userId,targ_PATToken,apiUrl);
        httpStatus = retMessage[0];
        if (httpStatus != SUCCESS_STATUS_CODE)
        {
            gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to fetch repository id");
            return;
        }
        parsedResponse = retMessage[1];	
        var repoId= parsedResponse.id;
        //var templateRepoUrl = parsedResponse.url;
        //var sourceRepoName = "TemplateSQLDB" ;//parsedResponse.name;
        var remoteUrl= parsedResponse.remoteUrl;
        var repoUrl= parsedResponse._links.web.href;
        var sshUrl= parsedResponse.sshUrl;

        //******************** Create the service connection to the Template Repository
        apiUrl = targetOrgUrl + '/' + targetProjName + '/_apis/serviceendpoint/endpoints?api-version=5.0-preview.2';
        in_request = {
            "name" :sourceRepoName, 
			"type":"git",
            "authorization":  {
                "parameters": {
                "Username": "yourUserID", //TODO:
                "Password": 'v2soeacx2voeffvwecfmffjkdubmwrztvxui4nk5hprwetkjurwa' //TODO: j6dftiing4agvqcdecemxmxgl5a3dkepb3jfd74k3xn7avdss5ya
                },
                "scheme": "UsernamePassword"
            },
            "url": "https://testAcount.core.endpoint.net/"
        };
		fnRESTDevOps = new RESTDevOps();
        retMessage = fnRESTDevOps.postData(targ_userId,targ_PATToken,apiUrl,in_request);	
        httpStatus = retMessage[0];
        if (httpStatus != SUCCESS_STATUS_CODE)
        {
            gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to create the service connection");
            return;
        }
        parsedResponse = retMessage[1];	
        var endpointId	= parsedResponse.id;
        
        //******************** Copy the Template Branch to the newly created repo
        apiUrl = targetOrgUrl + '/' + targetProjName + '/_apis/git/repositories/' + repoId + '/importRequests?api-version=5.0-preview.1';
		var templateRepoUrl = srcOrgUrl + "/" + sourcePrjName + "/_git/" + sourceRepoName;
        in_request = {
            "parameters" : {
                "gitSource": {
                "url": templateRepoUrl
                },
                "serviceEndpointId":endpointId,
                "deleteServiceEndpointAfterImportIsDone" : true
            }
        };
		fnRESTDevOps = new RESTDevOps();
        retMessage = fnRESTDevOps.postData(targ_userId,targ_PATToken,apiUrl,in_request);	
        httpStatus = retMessage[0];
        if (httpStatus != SUCCESS_STATUS_CODE1)
        {
            gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to copy the template branch");
            return;
        }
        parsedResponse = retMessage[1];	
		
		/***************** Creation of CI Pipeline start **********************/
		var in_collectionId = "b2392ecf-19ef-4d88-9ae4-54597b76294a"; //TODO:
		var in_buildDefId = 0;//199; //TODO:
		var in_releaseDefId = 0;//1; //TODO:
		
		var in_currCIPipeline = "TemplateSQLDB-CI"; //TODO:
		var in_currCDPipeline = "TemplateSQLDB-CD"; //TODO:
		var in_newCIPipeline = targetProjName + "-CI"; //TODO:
		var in_newCDPipeline = targetProjName + "-CD"; //TODO:
		//var in_newBranchName = in_newPipelinePrefix + "_" + in_baseBranchName; //TODO:


		//GET CI PIPELINE DEFINITION ID
		fnRESTDevOps = new RESTDevOps();
		apiUrl = srcOrgUrl + '/' +  sourcePrjName  + '/_apis/build/definitions?api-version=5.0';
		retMessage = fnRESTDevOps.getDefinitionId(src_userId,src_PATToken,apiUrl,in_currCIPipeline);
		httpStatus = retMessage[0];
		if (httpStatus != SUCCESS_STATUS_CODE)
		{
			gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to fetch Build Definition Id");
			return;
		}
		in_buildDefId = retMessage[1];
		
		//GET CI PIPELINE DEFINITION DETAILS
		apiUrl= srcOrgUrl + '/' +  sourcePrjName + '/_apis/build/definitions/' + in_buildDefId + '?api-version=5.0';
		fnRESTDevOps = new RESTDevOps();
		retMessage = fnRESTDevOps.getDefinitionDetails(src_userId,src_PATToken,apiUrl);
		httpStatus = retMessage[0];
		if (httpStatus != SUCCESS_STATUS_CODE)
		{
			gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to fetch Build Definition Details");
			return;
		}
		parsedResponse = retMessage[1];
		
		//CREATING NEW CI PIPELINE
		//parsedResponse.repository.defaultBranch = "refs/heads/" + in_newBranchName;
		parsedResponse.queue.id = 0;
		parsedResponse.repository.name = targetProjName;
		parsedResponse.name= in_newCIPipeline;
		parsedResponse.project.id = targetPrjId;
		apiUrl = targetOrgUrl + '/' +  targetProjName  + '/_apis/build/definitions?api-version=5.0';
		//gs.addInfoMessage(apiUrl);
		fnRESTDevOps = new RESTDevOps();
		//gs.addInfoMessage(JSON.stringify(parsedResponse));
		retMessage = fnRESTDevOps.postData(targ_userId,targ_PATToken,apiUrl,parsedResponse);
		httpStatus =retMessage[0];
		if (httpStatus != SUCCESS_STATUS_CODE)
		{
			gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to create the Build pipeline");
			return;
		}		
		parsedResponse =  retMessage[1];
//gs.addInfoMessage("2:" + JSON.stringify(parsedResponse));	
	    var out_newBuildDefId = parsedResponse.id;
		var out_newCIpipeline = parsedResponse.name; //TODO: No need as it is same as in_newCIPipeline
		gs.addInfoMessage("Successfully created the BUILD Pipeline : " + in_newCIPipeline);
		
		/***************** Creation of CI Pipeline End   **********************/
		
		/***************** Creation of CD Pipeline start **********************/

		//GET CD PIPELINE DEFINITION ID
		apiUrl = srcOrgUrl_vsrm + '/' + sourcePrjName + '/_apis/release/definitions?api-version=5.0';
		fnRESTDevOps = new RESTDevOps();
		retMessage = fnRESTDevOps.getDefinitionId(src_userId,src_PATToken,apiUrl,in_currCDPipeline);
		httpStatus = retMessage[0];
		if (httpStatus != SUCCESS_STATUS_CODE)
		{
			gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to fetch Release Definition Id");
			return;
		}
		in_releaseDefId = retMessage[1];
		
		//GET CD PIPELINE DEFINITION DETAILS
		apiUrl =  srcOrgUrl_vsrm + '/' + sourcePrjName + '/_apis/Release/definitions/' + in_releaseDefId + '?api-version=5.0';
				//gs.addInfoMessage(apiUrl);
		fnRESTDevOps = new RESTDevOps();
		retMessage = fnRESTDevOps.getDefinitionDetails(src_userId,src_PATToken,apiUrl);
		httpStatus = retMessage[0];
		if (httpStatus != SUCCESS_STATUS_CODE)
		{
			gs.addInfoMessage("External trigger failed (Status Code# " + httpStatus + ") : Unable to fetch Release Definition Details");
			return;
		}
		parsedResponse = retMessage[1];
		//gs.addInfoMessage("2:" + JSON.stringify(parsedResponse));
		
		//CREATING NEW CD PIPELINE
		parsedResponse.name= in_newCDPipeline;
		parsedResponse.environments[0].deployPhases[0].deploymentInput.queueId = 0;//Issue;
		parsedResponse.artifacts[0].definitionReference.project.id = targetPrjId;
		parsedResponse.artifacts[0].sourceId = targetPrjId + ":" + out_newBuildDefId; //TODO:
		parsedResponse.artifacts[0].alias = "_" + in_newCIPipeline; //TODO:
		parsedResponse.artifacts[0].definitionReference.definition.id =  out_newBuildDefId; //TODO:
		parsedResponse.artifacts[0].definitionReference.definition.name = out_newCIpipeline; //TODO:
		parsedResponse.artifacts[0].definitionReference.artifactSourceDefinitionUrl.id = targetOrgUrl + "/_permalink/_build/index?collectionId=" + in_collectionId + "&projectId=" + targetPrjId + "&definitionId=" + out_newBuildDefId; //TODO:
		//gs.addInfoMessage("2:" + parsedResponse.artifacts[0].sourceId);
		apiUrl = targetOrgUrl_vsrm + '/' +  targetProjName + '/_apis/Release/definitions?api-version=5.0';
        gs.addInfoMessage(apiUrl);
		gs.addInfoMessage(JSON.stringify(parsedResponse));
		fnRESTDevOps = new RESTDevOps();
			
		retMessage = fnRESTDevOps.postData(targ_userId,targ_PATToken,apiUrl,parsedResponse);
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
    var message = ex.getMessage();
    }

})(current, previous);

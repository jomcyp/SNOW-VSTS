(function executeRule(current, previous /*null when async*/) {
	
	try
	{
		var r = new sn_ws.RESTMessageV2();
		var testService = "";
		var nameOfService = current.title.toString() ;
		var targetProjectId = "";
		//var typeOfAzureDevopsService = current.u_az_repo_type;
		//var choice_AzService = current.u_az_repo_type.getChoices();
		var organisationUrl= "https://dev.azure.com/XXXXdemo";
		
		
		testService = "Azure Dot Net pipeline";
		
		//Creating the Template repository and Pipeline
		
		//Create a project for target repository
		r.setBasicAuth('AzDoPsUserID','PATPATPATPAT');
		r.setHttpMethod("POST");
		r.setEndpoint('https://dev.azure.com/XXXXdemo/_apis/projects?api-version=4.1');
		r.setRequestHeader("Content-Type", "application/json");
		r.setRequestBody(JSON.stringify({
			"name": nameOfService ,
			"capabilities": {
				"versioncontrol": {
					"sourceControlType": "Git"
				},
				"processTemplate": {
					"templateTypeId": "27450541-8e31-4150-9947-dc59f998fc01"
				}
			}
		}));
		// Execute the REST API and Process the response
		response = r.execute();
		responseBody = response.getBody();
		httpStatus = response.getStatusCode();
		parsedResponse = JSON.parse(responseBody);
		var operationId= parsedResponse.id;
		
		var start = Date.now(), now = start;
		/*while (now - start < 30000) {
			now = Date.now();
		}*/
		
		//https://dev.azure.com/XXXXdemo/_apis/operations/46f316d2-a899-4838-8e73-97c445512451?api-version=4.1
		var projectStatus = " ";
		while(projectStatus != "succeeded"){
			r = new sn_ws.RESTMessageV2();
			//	https://dev.azure.com/XXXXdemo/_apis/projects/jefggt_Project?api-version=4.1
			var endpointForGetProjectStatus= organisationUrl +'/_apis/operations/' + operationId +'?api-version=4.1';
			r.setBasicAuth('AzDoPsUserID','PATPATPAT');
			r.setHttpMethod("GET");
			r.setEndpoint(endpointForGetProjectStatus);
			r.setRequestHeader("Content-Type", "application/json");
			//r.setRequestBody(JSON.stringify({"name" :nameOfService+"-Repo","Project":{"id":targetProjectId}}));
				// Execute the REST API and Process the response
				response = r.execute();
				responseBody = response.getBody();
				httpStatus = response.getStatusCode();
				parsedResponse = JSON.parse(responseBody);
				projectStatus = parsedResponse.status;
				while (now - start < 5000) {
					now = Date.now();
				}
			}
			
			//Get project id of target project
			r = new sn_ws.RESTMessageV2();
			//	https://dev.azure.com/XXXXdemo/_apis/projects/jefggt_Project?api-version=4.1
			var endpointForGetProjectId= organisationUrl +'/_apis/projects/' + nameOfService +'?api-version=4.1';
			r.setBasicAuth('AzDoPsUserID','PATPATPAT');
			r.setHttpMethod("GET");
			r.setEndpoint(endpointForGetProjectId);
			r.setRequestHeader("Content-Type", "application/json");
			//r.setRequestBody(JSON.stringify({"name" :nameOfService+"-Repo","Project":{"id":targetProjectId}}));
				// Execute the REST API and Process the response
				response = r.execute();
				responseBody = response.getBody();
				httpStatus = response.getStatusCode();
				parsedResponse = JSON.parse(responseBody);
				targetProjectId = parsedResponse.id;
				
				//Get repository id of automatically created repo
				r = new sn_ws.RESTMessageV2();
				var endpointForGetRepoId= organisationUrl + '/'+nameOfService +'/_apis/git/repositories/'+nameOfService+'?api-version=4.1';
				r.setBasicAuth('AzDoPsUserID','PATPATPAT');
				r.setHttpMethod("GET");
				r.setEndpoint(endpointForGetRepoId);
				r.setRequestHeader("Content-Type", "application/json");
				//r.setRequestBody(JSON.stringify({"name" :nameOfService+"-Repo","Project":{"id":targetProjectId}}));
					// Execute the REST API and Process the response
					response = r.execute();
					responseBody = response.getBody();
					httpStatus = response.getStatusCode();
					parsedResponse = JSON.parse(responseBody);
					var repoId= parsedResponse.id;
					
					//var sourceRepoUrl = parsedResponse.url;
					var sourceRepoUrl ="https://SourceRepolab.visualstudio.com/DevOps-InfraPlusAppAutomation/_git/pipelines-dotnet-core";
					var nameOfSourceRepo = parsedResponse.name;
					var remoteUrl= parsedResponse.remoteUrl;
					var repoUrl= parsedResponse._links.web.href;
					var sshUrl= parsedResponse.sshUrl;
					var endpointForImport = organisationUrl + '/' + nameOfService +'/_apis/serviceendpoint/endpoints?api-version=4.1-preview.1';
					// 2. Create an Endpoint to the Template Repository
					r = new sn_ws.RESTMessageV2();
					r.setBasicAuth('AzDoPsUserID',"y7zv2hgqe45tz55zzubexebruxe363gqqdrgwv3w5vhasizus3wq");
					r.setHttpMethod("POST");
					//r.setEndpoint('https://dev.azure.com/SourceRepolab/DevOps-InfraPlusAppAutomation/_apis/serviceendpoint/endpoints?api-version=4.1-preview.1');
					r.setEndpoint(endpointForImport);
					r.setRequestHeader("Content-Type", "application/json");
					r.setRequestBody(JSON.stringify({"name" :nameOfSourceRepo, "type":"git",
						"authorization": {
							"parameters": {
								"Username": "AzDoPsUserID",
								"Password": 'zq2orcqqb7p6ic6rtmplbufkkc4yvqpxyqjisdu4ijgrvgemcvua'
							},
							"scheme": "UsernamePassword"
						},
						"url": "https://testAcount.core.endpoint.net/"
					}));
					// Fill the JSON FIeld
					response = r.execute();
					responseBody = response.getBody();
					httpStatus = response.getStatusCode();
					parsedResponse = JSON.parse(responseBody);
					var endpointId	= parsedResponse.id;
					var endpointForImportRepo = organisationUrl + '/' + nameOfService +'/_apis/git/repositories/'+repoId+'/importRequests?api-version=4.1-preview.1';
					r = new sn_ws.RESTMessageV2();
					r.setBasicAuth('AzDoPsUserID','y7zv2hgqe45tz55zzubexebruxe363gqqdrgwv3w5vhasizus3wq');
					r.setHttpMethod("POST");
					r.setEndpoint(endpointForImportRepo);
					r.setRequestHeader("Content-Type", "application/json");
					//r.setRequestBody(JSON.stringify({"name" :nameOfService+"-Repo","Project":{"id":"e491f823-8a75-4a0e-b296-0b74850e6214"}}));
						
						r.setRequestBody(JSON.stringify({"parameters" :{
							"gitSource": {
								"url": sourceRepoUrl
							},
							"serviceEndpointId":endpointId,
							"deleteServiceEndpointAfterImportIsDone" : true}}));
							
							// Execute the REST API and Process the response
							response = r.execute();
							responseBody = response.getBody();
							httpStatus = response.getStatusCode();
							parsedResponse = JSON.parse(responseBody);
							
							var sourceEndpointUrl = parsedResponse.url;
							// Diplay the results in ticket
							current.u_translated_text_2_progressstatus=
							current.u_translated_text_2_progressstatus + "\n"+"RemoteUrl:"+remoteUrl + "\n"+"sshUrl:"+sshUrl;
							
							
							// Execute Rest API to get queue id of agent
							//https://dev.azure.com/XXXXdemo/ae595f36-c307-420c-b233-ca9961c2bc87/_apis/distributedtask/queues?api-version=4.1-preview
							r = new sn_ws.RESTMessageV2();
							var endpointForGetAgentQueueId= organisationUrl+'/'+targetProjectId +'/_apis/distributedtask/queues?api-version=4.1-preview';
							r.setBasicAuth('AzDoPsUserID','y7zv2hgqe45tz55zzubexebruxe363gqqdrgwv3w5vhasizus3wq');
							r.setHttpMethod("GET");
							r.setEndpoint(endpointForGetAgentQueueId);
							r.setRequestHeader("Content-Type", "application/json");
							// Execute the REST API and Process the response
							response = r.execute();
							responseBody = response.getBody();
							httpStatus = response.getStatusCode();
							parsedResponse = JSON.parse(responseBody);
							//var agentQueueId = (parsedResponse.values(object1)[1]).find(x=>x.name == "Hosted").id;
							//(Object.values(object1)[1]).find(x=>x.name=="Hosted").id
							
							
							var agentrray = parsedResponse.value;
							var arrayLength = agentrray.length;
							var agentQueueId = 0;
							for (index = 0; index < agentrray.length; ++index) {
								if(agentrray[index].name == "Hosted")
									agentQueueId = agentrray[index].id;
							}
							//Create build pipeline from .yml
							var endpointForBuildPipeline = organisationUrl + '/' + nameOfService +'/_apis/build/definitions?api-version=4.1';
							r = new sn_ws.RESTMessageV2();
							r.setBasicAuth('AzDoPsUserID','y7zv2hgqe45tz55zzubexebruxe363gqqdrgwv3w5vhasizus3wq');
							r.setHttpMethod("POST");
							//r.setEndpoint('https://SourceRepolab.visualstudio.com/DevOps-InfraPlusAppAutomation/_apis/build/definitions?api-version=4.1');
							r.setEndpoint(endpointForBuildPipeline);
							r.setRequestHeader("Content-Type", "application/json");
							//r.setRequestBody(JSON.stringify({"name" :nameOfService+"-Repo","Project":{"id":repoId}}));
								r.setRequestBody(JSON.stringify({
									"options": [
									{
										"enabled": false,
										"inputs": {
											"branchFilters": "[\"+refs/heads/*\"]",
											"additionalFields": "{}"
											}
										},
										{
											"enabled": false,
											"inputs": {
												"workItemType": "Bug",
												"assignToRequestor": "true",
												"additionalFields": "{}"
												}
											}
											],
											"process": {
												"yamlFilename": "azure-pipelines.yml",
												"type": 2
											},
											"repository": {
												"id": repoId,
												"type": "TfsGit",
												"name":nameOfService ,
												"url":  organisationUrl +'/'+nameOfService +  "/_git/"+ nameOfService ,
												//"https://SourceRepolab.visualstudio.com/DevOps-InfraPlusAppAutomation/_git/pipelines-dotnet-core",
												"defaultBranch": "refs/heads/master",
												"clean": "false",
												"checkoutSubmodules": false
											},
											"name": nameOfService + "-CI",
											"type": "build",
											"queueStatus": "enabled",
											"queue": {
												"id": agentQueueId,
												"name": "Hosted",
												"pool": {
													"id": 2,
													"name": "Hosted",
													"isHosted": true
												}
											},
											"triggers": [
											{
												"branchFilters": [],
												"pathFilters": [],
												"settingsSourceType": 2,
												"batchChanges": false,
												"maxConcurrentBuildsPerBranch": 1,
												"triggerType": "continuousIntegration"
											}
											]
										}));
										// Execute the REST API and Process the response
										response = r.execute();
										responseBody = response.getBody();
										httpStatus = response.getStatusCode();
										parsedResponse = JSON.parse(responseBody);
										
										
										var buildDefinitionUrl =parsedResponse._links.editor.href;
										current.description = "RepoURL:"+repoUrl +" BuildDefinitionUrl: " +buildDefinitionUrl;
		var buildDefinitionId =parsedResponse.id;
										var startTime = Date.now(), now1 = startTime;
										while (now1 - startTime < 30000) {
											now1 = Date.now();
											}
			// Queue build pipelien
								r = new sn_ws.RESTMessageV2();
								r.setBasicAuth('AzDoPsUserID','y7zv2hgqe45tz55zzubexebruxe363gqqdrgwv3w5vhasizus3wq');
								r.setHttpMethod("POST");
								var queueBuildEndpoint = organisationUrl+'/'+nameOfService+'/_apis/build/builds?api-version=4.1';
								r.setEndpoint(queueBuildEndpoint);
								r.setRequestHeader("Content-Type", "application/json");
								r.setRequestBody(JSON.stringify({ 
								"definition" : 
										{ 
											"id" : buildDefinitionId
										} 	
		}));
		// Execute the REST API and Process the response
		response = r.execute();
		responseBody = response.getBody();
		httpStatus = response.getStatusCode();
		parsedResponse = JSON.parse(responseBody);
									}
									catch(ex) {
										var message = ex.getMessage();
										gs.addInfoMessage(message);
										gs.addInfoMessage(" Failed:External trigger Status :Failed ");
										
									}
									// Add your code here
									
								})(current, previous);

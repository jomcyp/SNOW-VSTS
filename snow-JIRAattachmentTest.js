(function executeRule(current, previous /*null when async*/) {

try
{
	var r = new sn_ws.RESTMessageV2();
	//gs.addInfoMessage(current.sys_id);
	var target = new GlideRecord('sys_attachment');
	target.addQuery('table_name', 'incident');
	target.addQuery('table_sys_id', current.sys_id);
	target.query();
	
	while(target.next())
	{
		gs.addInfoMessage(JSON.stringify(target));
		var attach = new GlideSysAttachment();
		//Base 64 encoding of the attachment
		var binData =   attach.getBytes(target);   
		
		var encData =   GlideStringUtil.base64Encode(binData);
		var incbody = {};

		//incbody.agent = "AttachmentCreator"; 
		//incbody.topic = "AttachmentCreator";

		//incbody.name = target.file_name + ":" + target.content_type;
		//incbody.source = tablname + ":" + targetid;
		//incbody.payload 
		incbody.filePayload = encData;
		incbody.fileName = target.file_name.toString();
		incbody.contentType = target.content_type.toString();
		var json = new JSON();  
		
  	    incbody = json.encode(incbody);
		r.setRequestBody(JSON.stringify(incbody));
		gs.addInfoMessage('4');
		//r.setRequestBody(incbody);
		gs.addInfoMessage(JSON.stringify(incbody));	
		
	}
/*	var response = r.execute();
	var responseBody = response.getBody();
	var httpStatus = response.getStatusCode();
	var body1 = response.getErrorMessage();
	gs.addInfoMessage('error' + body1);
	gs.addInfoMessage('Status code :' + httpStatus + " ---" + JSON.stringify(response));*/
}
catch(ex) {
    var message = ex.getMessage();
	gs.addInfoMessage("Error : "+ message);
}
})(current, previous);

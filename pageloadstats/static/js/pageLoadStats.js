/**
 * set the timezone offset in a cookie
 */

function setTZOffsetCookie(){
	var d = new Date();
	tzOffset = d.getTimezoneOffset()/60;

	setCookie("tz_offset", tzOffset);
}
		
/**
 * Set a cookie
 * @param c_name
 * @param value
 * @param expiredays
 */
function setCookie(c_name,value,expiredays, path){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);

	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString()) + 
	";path=/";
}

/**
 * Get a cookie
 * @param c_name
 * @returns
 */
function getCookie(c_name){
	if (document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1)
		{
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}
	return "";
}

function fillDateRange(){
	var url = location.href;
	var url_parts = url.split("?");
	var url_parameters = url_parts[1];
	var main_url = url_parts[0];
	if(url_parameters){
		if( (url_parameters.indexOf("start_date")>-1) && (url_parameters.indexOf("end_date")>-1)){
			parameters=getUrlVars();
			start_ts = parameters['start_date'];
			end_ts = parameters['end_date'];
			if( ! isInt(start_ts) || ! isInt(end_ts)){
				return false;
			}
			start_time = tsToString(start_ts);
			end_time = tsToString(end_ts);
			$("#date_selection_start_date").val(start_time);
			$("#date_selection_end_date").val(end_time);
		}
		if(url_parameters.indexOf("trim_above")>-1){
			parameters=getUrlVars();
			trim_above_val = parameters['trim_above'];
			$("#trim_above_selection").val(trim_above_val);
		}
	}
	
}
function fillErrorList(page){
	errorListHtml = "";
	// show activity indication
	$("#error_list_target").html("<tr><td class='text-center'><img src='/static/img/throbber_b.gif'/></td></tr>");
	$.ajax({
		url: '/pls/api/httperrors/?page='+page,
		success: function(errorResponse) {
			errors = errorResponse.errors;
			errorListHtml += "<thead><tr><th>ID</th><th>Status</th><th>Date</th><th>URL</th></tr></thead>";
			for(error in errorResponse.errors){
				errorListHtml += "<tr>";
				errorListHtml += "ID: <td>"+errors[error].id+"</td>"
				errorListHtml += "Status: <td>"+errors[error].http_status+"</td>"
				errorListHtml += "Date: <td>"+errors[error].request_date+"</td>"
				errorListHtml += "Url: <td>"+errors[error].url+"</td>"
				errorListHtml += "</tr>";
				//console.log("[INFO] errorlisthtml line added " + errorListHtml);
			}
			$("#error_list_target").html(errorListHtml);
		}
	});
	// remove ajax activity indication
}

function tsToString(timestamp){
	date = new Date(timestamp*1000);
	year = date.getFullYear();
	month = date.getMonth() +1;
	day = date.getDate();
	hour = date.getHours();
	if(hour<10) hour = "0" + hour;
	minute = date.getMinutes();
	if(minute<10) minute = "0" + minute;
	return ( month+"/"+day+"/"+year+" "+hour+":"+minute );
}

function submitChartParams(target_id){
	start_date = $("#date_selection_start_date").val();
	end_date = $("#date_selection_end_date").val();
	trim_above = $("#trim_above_selection").val();

	if(!isInt(trim_above)){ // we must have a valid date range if there is no trim value
		if ( start_date=="" || end_date==""){
			alert("That date range wont work. Dont be silly.");
			return false;
		}
	}

	if(isInt(trim_above)){
		trim_above_param = "&trim_above="+trim_above;		
	}else{
		trim_above_param = ""; 
	}
	
	var startStamp = Date.parse(start_date)/1000;
	var endStamp = Date.parse(end_date)/1000;
	

	// setup the start and end stamp params
	start_date_param = "";
	end_date_param = "";
	if(isInt(startStamp) && isInt(endStamp)){
		start_date_param = "&start_date="+startStamp;
		end_date_param = "&end_date="+endStamp;
	}

	if(startStamp>=endStamp){
		alert("Sorry, but you really cannot end before you start. Try a more realistic date range and I'll try to be more helpful.");
		return false;
	}
	
	var url = location.href;
	var url_parts = url.split("?");
	var main_url = url_parts[0];	
	var url_vars = getUrlVars();
	target_id_list_param="";
	if(url_vars["target_id_list"]){
		target_id_list_param = "&target_id_list="+url_vars["target_id_list"];
	}
	
	targets_param="";	
	if(url_vars["target_id"]){
		targets_param = "&target_id="+target_id;
	}
	if(url_vars["target_tag"]){
		targets_param = "&target_tag="+url_vars["target_tag"];
	}

//	alert(main_url+"?" +
//			start_date_param + 
//			end_date_param +
//			target_id_list_param +
//			targets_param +
//			trim_above_param,"_top");
	
	window.open(main_url+"?" +
			start_date_param + 
			end_date_param +
			target_id_list_param +
			targets_param +
			trim_above_param,"_top");
}

/**
 * Read a page's GET URL variables and return them as an associative array.
 */ 
function getUrlVars(){
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
function isInt(value){ 
	  if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
	      return true;
	  } else { 
	      return false;
	  } 
}


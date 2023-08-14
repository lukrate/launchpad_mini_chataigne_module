var valuesPath = local.values;
var valuesPadPath = local.values.activePads;
var paramPadPath = local.parameters.activePads;

var activePads = [];

var colors = {
	white: 3,
	red: 5,
	orange: 9,
	yellow: 13,
	green: 25,
	sky_blue: 33,
	blue: 41,
	violet: 49,
	pink: 57
};

function colorPattern(show)
{
	
	var line = 8;
	var buttons = 8;
	var global_i = 1;
	for (var lindex = 1; lindex <= line; lindex += 1) {
		for (var bindex = 1; bindex <= buttons; bindex += 1) {
			if (show) {
				setLed(1, parseInt(lindex + "" + bindex), global_i);
			} else {
				setLed(1, parseInt(lindex + "" + bindex), 0);
			}
			global_i += 1;
		}
	}
}

function resetPads(){
	var line = 8;
	var buttons = 8;
	for (var lindex = 1; lindex <= line; lindex += 1) {
		var currentLine = paramPadPath.getChild("line" + lindex);
		for (var bindex = 1; bindex <= buttons; bindex += 1) {
			var currentPad = currentLine.getChild("pad" + bindex);
			currentPad.set(false);
			setLed(1, parseInt(lindex + "" + bindex), 0);
		}
	}
}


 //Functions

function setLed(channel, pitch, velocity)
{
	local.sendNoteOn(channel, pitch, velocity); 
}


function addPadValues(padId){
	var padValuesContainer = valuesPadPath.addContainer(padId);
	padValuesContainer.setCollapsed(false);
	var pitch = padValuesContainer.addStringParameter("Pitch", "", padId);
	pitch.setAttribute("readonly", true);
	padValuesContainer.addEnumParameter("Led Color", "color", 
		"white", 3,
		"red", 5,
		"orange", 9,
		"yellow", 13,
		"green", 25,
		"teal", 33,
		"blue", 41,
		"violet", 49,
		"pink", 57
	);
	padValuesContainer.addBoolParameter("Blink", "",false);
}

function removePadValues(padId){
	valuesPadPath.removeContainer(padId);
}



//Commands

function resetColors()
{
	/*for(var i=0;i<16;i++) setLed(0,0,0,0);*/
}



//Events

function moduleParameterChanged(param)
{
	script.log(param.getParent().getParent().name);
	script.log(param.getParent().name);
	script.log(param.name);
	if(param.getParent().getParent().name == "activePads")
	{	var line = param.getParent().name.split("e")[1];
		var id = param.name.split("d")[1];
		var pad = parseInt(line + id);
		if( param.get()){ 
			setLed(3, pad, 3); 
			addPadValues(pad);
		}
		else{ 
			setLed(1, pad, 0);
			removePadValues(pad);
		};
	}

	if (param.name == "showColorPalette") {
		colorPattern(true);
	}

	if (param.name == "resetColorPalette") {
		colorPattern(false);
	}
	
	if (param.name == "resetAllActivePads") {
		resetPads();
	}
}



function moduleValueChanged(value) {
	if(value.is(value) && value.name == "blink" || value.name == "ledColor") {

		var pitch = value.getParent().name;
		var color = value.getParent().ledColor.get();
		var blink = value.getParent().blink.get();
		var channel = 1;
		if(blink){
			channel = 3;
		}
		setLed(channel, parseInt(pitch), parseInt(color));
	}
}



function noteOnEvent(channel, pitch, velocity)
{
	script.log("Note on received "+channel+", "+pitch+", "+velocity);
}


function noteOffEvent(channel, pitch, velocity)
{
	script.log("Note off received "+channel+", "+pitch+", "+velocity);
}
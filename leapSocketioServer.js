var io = require('socket.io').listen(8001);
var keys;
var lastFrame = null;
var lastJ = null;
var lastZ = null;
var storedJ= new Array();
var frameIndex = 0;
var autoCorrectFramesKeyTap = 20;

io.sockets.on('connection', function (socket) {
  socket.on('fromLocal', function (data) {
    /*
console.log(data);
    socket.broadcast.emit('toRemote', data);
*/
if(keys != undefined){
        var frame = JSON.parse(data);
        if (frame.pointables.length > 0) {
                            for (var i = 0; i < frame.pointables.length; i++) {
                                      var pointable = frame.pointables[i];

                                      if (pointable.tool) {
                                        
                                      }
                                      else {
                                        if(i==0){
                                        
										  
										  var left, right, top, bottom, rowStartIndex, rowEndIndex;
										  var leapPosition = leapToScene(frame,pointable.tipPosition);
										  
										  socket.broadcast.emit('position', {left: leapPosition[0], top: leapPosition[1]});
										  
										 
/* 										  console.log(leapPosition); */
										  if(leapPosition[1] >=102 && leapPosition[1] <=190){
											  rowStartIndex = 0;
											  rowEndIndex = 13;
										  }else if(leapPosition[1] >=191 && leapPosition[1] <=279){
											  rowStartIndex = 14;
											  rowEndIndex = 27;
										  }else if(leapPosition[1] >=280 && leapPosition[1] <=368){
											  rowStartIndex = 28;
											  rowEndIndex = 40;
										  }else if(leapPosition[1] >=369 && leapPosition[1] <=457){
											  rowStartIndex = 41;
											  rowEndIndex = 52;
										  }else{
											  rowStartIndex = 53;
											  rowEndIndex = 53;
										  }
										  for(var j=rowStartIndex ;j<=rowEndIndex ;j++){
										  	  left = keys[j]['left'];
										  	  if(j!=rowEndIndex){
												  	right = keys[j+1]['left'] - 1;
										  	  }else{
											  	  //the last key of this row
											  	  right = 1286;
										  	  }
										  	  top = keys[j]['top'];
										  	  bottom = keys[j]['top'] +89 - 1;
										  	  
										  	 
										  	  
											  if(leapPosition[0] >= left && leapPosition[0] <= right && leapPosition[1] <= bottom && leapPosition[1] >= top){
											  /*
console.log(keys.eq(j).html());
											  console.log(keys.eq(j).position());
*/
/* 												  keys.eq(j-1).mouseleave(); */
												  var z;
												  for (var p = 0; p < frame.pointables.length; p++) {
												  	z = frame.pointables[p].touchDistance;
												  	if(lastZ != null && (z-lastZ)<(-0.2)){
													  	
												  	}else{
													  	if(j!=null && lastJ != j){
													  	socket.broadcast.emit('position', {left: leapPosition[0], top: leapPosition[1]});
													  	socket.broadcast.emit('hoverKey', {elementID: keys[j]['elementID']});
												  }
												  	}
													  
													  }
												  
												  lastJ = j;
												  lastZ = z;
											  }
/* 											  console.log('j '+j+' left '+left+' right '+right+' top '+top+' bottom '+bottom+' x '+leapPosition[0]+' y '+leapPosition[1]); */
										  }
										  on = false;
										  
/*                                           console.log(leapToScene(frame,pointable.tipPosition)+"\n"); */
                                          }
                                      }
                                     
                                      
                            }
                        }

                        for( var i =  0; i < frame.gestures.length; i++){

                          var gesture  = frame.gestures[0];
                          //Per gesture code goes here
                          var type = gesture.type;
                          console.log("gesture: "+type+"\n");
          
                          switch( type ){

                            case "circle":
                              //onCircle( gesture );

                              break;
                              
                            case "swipe":
                              //onSwipe( gesture );
                              
                              break;

                            case "screenTap":
                              //onScreenTap( gesture );
                              
                              break;

                            case "keyTap":
                              //onKeyTap( gesture );
                              /*
if(storedJ[(frameIndex+1)%(autoCorrectFramesKeyTap+1)]!=null && storedJ[(frameIndex+1)%(autoCorrectFramesKeyTap+1)] != j){
									keys.eq(storedJ[(frameIndex+1)%(autoCorrectFramesKeyTap+1)]).mouseenter();
									console.log('correct');
								}
								writeWord();
*/
                              break;

                          }
                        }
        
        
        //screenTap distance
        	if (lastFrame !== null) {
/*             console.log(frame.pointables[0].touchDistance); */
            	for (var p = 0; p < frame.pointables.length; p++) {
                	if (frame.pointables[p].touchDistance <= 0 && lastFrame.pointables[p].touchDistance > 0 && frame.pointables[p] != undefined && frame.pointables[p].touchDistance != undefined) {
                    	socket.broadcast.emit('tap', " ");
						}else if(frame.pointables[p].touchDistance > 0){
							socket.broadcast.emit('screenTapOut', " ");
						}
					}
				}
        lastFrame = frame;
        storedJ[frameIndex] = lastJ;
        if(frameIndex == autoCorrectFramesKeyTap){
	        frameIndex = 0;
        }else{
	        frameIndex++;
        }
         
}

  });
  
  socket.on('keyboardElement', function (jsonKeys) {
/*     console.log(jsonKeys); */
/*     var keys = JSON.parse(jsonKeys); */
	keys = jsonKeys;
    console.log(jsonKeys);
    
  });
  
});

function leapToScene( frame , leapPos ){

    var iBox = frame.interactionBox;

    var left = iBox.center[0] - iBox.size[0]/2;
    var top = iBox.center[1] + iBox.size[1]/2;

    var x = leapPos[0] - left;
    var y = leapPos[1] - top;

    //console.log(iBox.size[0]+" "+iBox.size[1]);
    x /= iBox.size[0];
    y /= iBox.size[1];

    if(x < 0)
      x = 0;
    else if(x > 1)
      x = 1;

    if(y < -1)
      y = -1;
    else if(y > 0)
      y = 0;

    // canvs area
    x *= 1286; //width
    y *= 445; //height
    y -= 102;

    return [ x , -y ];

}
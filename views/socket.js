
$(function(){
    //make connection
 var socket = io.connect('http://localhost:3000')
 
 //buttons and inputs
 var message = $("#message")
 var send_message = $("#send_message")
 var chatroom = $("#chatroom")
 console.log( "ready!" );
 //Emit message
 send_message.click(function(){
     alert("Hello! I am an alert box!");
     socket.emit('new_message', {message : message.val()})
 })

 //Listen on new_message
 socket.on("new_message", (data) => {
     message.val('');
     chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
 })

});



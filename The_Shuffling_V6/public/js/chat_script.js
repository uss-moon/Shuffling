$(function(){
   	//make connection
	var socket = io();

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	
	// adding unique user feature
	var userList = []
	
	//Emit message
	send_message.click(function(){	
		socket.emit('new_message', {message : message.val()})
	})
	

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message' autofocus> <span class='chat_username' style='color: rgb(61,185,116);'>" + data.username + "</span>"  + ": " +
											"<span class='chat_username' style='color: blue ;'>" + data.message + "</span>" + "</p>")
	})

	//Emit a username
	send_username.click(function(){
		socket.emit('change_username', {username : username.val()})
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});

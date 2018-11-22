/*eslint no-console: 0*/
"use strict";

const express = require('express')
const bodyParser = require('body-parser')
var requestify = require('requestify');
var cors = require('cors')

// Load configuration
require('./config')
const bot = require('./bot')
	//const util = require('./util')

// Load dummy data
const dummy = require('./dummyData')

const app = express()
app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json())
app.options('*', cors())

//Description of API
app.get('/', function (req, res) {
	res.send('This is the API of a recast.ai chatbot connector.');
})

// ask question and forward it to recast.ai
app.post('/api/askQuestion', cors({
	origin: true,
	methods: ['POST'],
	maxAge: 3600
}), (req, res) => {
	var sQuestion = req.body['question'];
	bot.reply(req, res)
		.then(success => {
			for (var x = 0; x < success.length; x++) {
				success[x].author = "bot";
			}
			res.status(200).send(success);
		}).catch(error => {
			console.log('Error in your bot:', error)
			if (!res.headersSent) {
				res.sendStatus(400)
			}
		})
})

const getList = (req, sSearch) => {
	return new Promise(function (resolve, reject) {
		requestify.request("https://bwsystem.trial.apimanagement.hana.ondemand.com/Z_BOT_TEST2_SRV/Z_BOT_TEST2Results?$format=json&$top=1", {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Basic QldSRkM6SW5pdGlhbDAx'
			},
			//body: { searchTerm: 'Schraubenzieher' },
			json: true
		}).then(function (response) {
			//TODO: map to recast rich response https://recast.ai/docs/concepts/structured-messages
			var sFiscal = "test";
			try {
				sFiscal = JSON.parse(response.body).d.results[0].A0EPBZE32FCW97I3O7LOHU7J0Z_F;
			} catch (e) {
				console.log(response)
			}
			//JSON.parse(response.body);
			var aMessage = [];
			//const memory = request.body.conversation.memory;
			aMessage.push({
				type: 'text',
				content: sFiscal,
			});
			console.log(response);
			resolve(aMessage);
		})
	});
}

//return dummy data
app.post('/api/dummy', (req, res) => {
	dummy.getList(req, res)
		.then(success => {
			res.status(200).send({
				replies: success
			})
		}).catch(error => {
			console.log('Error in getList:', error)
			if (!res.headersSent) {
				res.sendStatus(400)
			}
		})
})

//read BW System
app.post('/api/getkostenstelle', (req, res) => {
	getList(req, res)
		.then(success => {
			res.status(200).send({
				replies: success
			})
		}).catch(error => {
			console.log('Error in getList:', error)
			if (!res.headersSent) {
				res.sendStatus(400)
			}
		})
})

var port = process.env.PORT || 3000;

app.listen(app.get('port'), () => {
	console.log('Our bot is running on port %d', app.get('port'))
})
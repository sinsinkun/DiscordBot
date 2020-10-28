const AWS = require('aws-sdk')

AWS.config.update({
	region: process.env.AWS_DEFAULT_REGION,
});

class DatabaseClient {
    constructor({ tableName, region }) {
        this._tableName = tableName;
        const service = new AWS.DynamoDB({maxRetries: 6})
        this._documentClient = new AWS.DynamoDB.DocumentClient({service, region})
    }

    async getById(documentId) {
        try {
            const params = {
                TableName: this._tableName,
                Key: {
                    'id': documentId.toLowerCase(),
                },
            };
    
            const rawDocument = await this._documentClient.get(params).promise();
    
            return rawDocument.Item;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async create(document) {
		try {
			validateDocument(document);

			document.id = document.id.toLowerCase();
			const params = {
				TableName: this._tableName,
				Item: document,
				ConditionExpression: '#id <> :id',
				ExpressionAttributeNames: { '#id': 'id' },
				ExpressionAttributeValues: {
					':id': document.id,
				},
			};

			return await this._documentClient.put(params).promise();
		} catch (e) {
            console.error(e);
			throw e;
		}
    }
    
    async update(params) {
        await this._documentClient.update(params).promise();
    }

    //custom emote command: call command from DB
    async callEmote(input) {
        const params = {
            TableName: this._tableName,
            Key: {
                "input": input
            }
        }

        try {
            const data = await this._documentClient.get(params).promise();
            console.log(`Found command with output: ${data.Item.output}`);
            return data.Item.output;
        } catch(e) {
            console.log(e);
            return null;
        }
    }

    //custom emote command: add command to DB
    async addEmote(input, output) {
        const params = {
            TableName: this._tableName,
            Item: {
                "input": input,
                "output": output
            }
        }
        try {
            this._documentClient.put(params).promise();
            return true;
        } catch {
            console.log(e);
            return false;
        }
    }

    //custom emote command: remove command from DB
    async removeEmote(input) {
        const params = {
            TableName: this._tableName,
            Key: {
                "input": input
            }
        }

        try {
            await this._documentClient.get(params).promise();
            // remove command
        } catch(e) {
            console.log(e);
            throw e;
        }
    }

    //custom emote command: get list of commands from DB
    getEmoteList() {
        
    }
    
}

function validateDocument(document) {
	if (!document || !document.id) {
		const e = new Error('The document is not well formed');
		throw e;
	}
}

module.exports = DatabaseClient;
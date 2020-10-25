const AWS = require('aws-sdk');
const region = process.env.AWS_DEFAULT_REGION;
const tableName = 'custom_emotes';

AWS.config.update({
	region: region
});

const db = new AWS.DynamoDB.DocumentClient();

class CustomEmotes {

    add(input, output) {
        const params = {
            TableName: tableName,
            Item: {
                "input": input,
                "output": output
            }
        }
        db.put(params, (err, data) => {
            if (err) console.log(`Unable to add command \n${err}`);
            else console.log(`Added command \'${input}\' to call \'${output}\'`);
        })
    }

    remove(input) {
        
    }
    
    call(input) {
        const params = {
            TableName: tableName,
            Key: {
                "input": input
            }
        }
        let output;
        db.get(params, (err, data) => {
            if (err) {
                console.log(`Unable to find command \n${err}`);
                output = null;
            } else {
                console.log(`Found command with output: ${data.Item.output}`);
                output = data.Item.output;
            }
        });
        return data.Item.output;
    }

    getList() {
        
    }

}

module.exports = CustomEmotes;
require('dotenv').config();
const { MongoClient } = require('mongodb');
const log4js = require('log4js');
const _ = require('lodash');

const MONGO_AUTHOR_URL = process.env.MONGO_AUTHOR_URL || 'mongodb://localhost:27017';
const MONGO_AUTHOR_DBNAME = process.env.MONGO_AUTHOR_DBNAME || 'datastackConfig';

const logger = log4js.getLogger('Migration v2.7.7');
logger.level = 'info';

(async () => {
    let conn;
    try {
        conn = await MongoClient.connect(MONGO_AUTHOR_URL);
        const flowList = await conn.db(MONGO_AUTHOR_DBNAME).collection('b2b.flows').find().toArray();
        logger.info('Flows Found:', flowList.length);
        if (flowList.length == 0) {
            logger.info('No Data to migrate');
            return;
        }
        let conditionCounter = 100;
        await flowList.reduce(async (prev, curr) => {
            try {
                let newNodes = [];
                let migrationNeededFlag = false;
                await prev;
                logger.info('===================================================');

                let allNodes = JSON.parse(JSON.stringify(curr.nodes || []));
                allNodes.unshift(JSON.parse(JSON.stringify(curr.inputNode)));

                allNodes.forEach(node => {
                    if (node.onSuccess && node.onSuccess.length > 1) {
                        migrationNeededFlag = true;
                        let conditions = node.onSuccess.map((nextItem) => {
                            let t = {};
                            t._id = nextItem._id;
                            t.name = nextItem.name;
                            t.condition = nextItem.condition;
                            return t;
                        });
                        conditionCounter++;
                        let conditionNode = {};
                        conditionNode.type = 'CONDITION';
                        conditionNode.name = 'Condition ' + conditionCounter;
                        conditionNode._id = _.snakeCase(conditionNode.name);
                        conditionNode.conditions = conditions;
                        conditionNode.onSuccess = [];
                        conditionNode.onError = [];
                        conditionNode.options = {};
                        conditionNode.options.method = "POST";
                        conditionNode.options.contentType = "application/json";
                        conditionNode.options.conditionType = "ifElse";
                        conditionNode.coordinates = JSON.parse(JSON.stringify(node.coordinates));
                        conditionNode.coordinates.x += 200;
                        conditionNode.coordinates.y += 200;
                        node.onSuccess = [];
                        node.onSuccess.push({ _id: conditionNode._id });
                        newNodes.push(conditionNode);
                    }
                });
                if (migrationNeededFlag) {
                    logger.success('Migration Done for flow:', curr._id);
                    curr.inputNode = allNodes[0];
                    curr.nodes = allNodes.splice(1).concat(newNodes);
                    const status = await conn.db(MONGO_AUTHOR_DBNAME).collection('b2b.flows').findOneAndUpdate({ _id: curr._id }, { $set: curr });
                    logger.debug(status);
                } else {
                    logger.warn('Migration Skipped for flow:', curr._id);
                }
                logger.info('===================================================');
            } catch (err) {
                logger.error('Error Occured in reduce!');
                logger.error(err);
                logger.error('===================================================');
                logger.error('ERROR');
                logger.error('===================================================');
            }
        }, Promise.resolve());
    } catch (err) {
        logger.error('Global Error Occured!');
        logger.error(err);
        logger.error('===================================================');
        logger.error('ERROR');
        logger.error('===================================================');
    } finally {
        conn.close();
    }
})();

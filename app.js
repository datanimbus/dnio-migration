const { MongoClient } = require('mongodb');
const log4js = require('log4js');
const renderId = require('render-id');

const MONGO_AUTHOR_URL = process.env.MONGO_AUTHOR_URL || 'mongodb://localhost:27017';
const MONGO_AUTHOR_DBNAME = process.env.MONGO_AUTHOR_DBNAME || 'datastackConfig';

const logger = log4js.getLogger('Migration v2.7.5');
logger.level = 'info';

(async () => {
    let conn;
    try {
        conn = await MongoClient.connect(MONGO_AUTHOR_URL);
        const formulas = await conn.db(MONGO_AUTHOR_DBNAME).collection('metadata.mapper.formulas').find({ app: { $exists: false } }).toArray();
        logger.info('Formulas Found:', formulas.length);
        const plugins = await conn.db(MONGO_AUTHOR_DBNAME).collection('b2b.nodes').find({ app: 'admin' }).toArray();
        logger.info('Plugins Found:', plugins.length);
        const apps = await conn.db(MONGO_AUTHOR_DBNAME).collection('userMgmt.apps').find({}).toArray();
        logger.info('Apps Found:', apps.length);
        let formulaCounter = 0;
        let pluginCounter = 0;
        if (formulas.length == 0 && plugins.length == 0) {
            logger.info('No Data to migrate');
            return;
        }
        await apps.reduce(async (prev, curr) => {
            try {
                let status;
                await prev;
                logger.info('===================================================');
                if (formulas.length > 0) {
                    logger.info('Creating Formulas for App:', curr._id);
                    let tempFormulas = formulas.map(item => {
                        item._id = renderId.render('FX####', formulaCounter);
                        item.app = curr._id;
                        formulaCounter++;
                        return item;
                    });
                    status = await conn.db(MONGO_AUTHOR_DBNAME).collection('metadata.mapper.formulas').insertMany(tempFormulas);
                    logger.info('Formulas Created for App:', curr._id);
                    logger.info(JSON.stringify(status));
                }
                if (plugins.length > 0) {
                    logger.info('Creating Plugins for App:', curr._id);
                    let tempPlugins = plugins.map(item => {
                        item._id = renderId.render('NODE####', pluginCounter);
                        item.app = curr._id;
                        pluginCounter++;
                        return item;
                    });
                    status = await conn.db(MONGO_AUTHOR_DBNAME).collection('b2b.nodes').insertMany(tempPlugins);
                    logger.info('Plugins Created for App:', curr._id);
                    logger.info(JSON.stringify(status));
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

        try {
            await conn.db(MONGO_AUTHOR_DBNAME).collection('b2b.nodes').dropIndex('type_1_category_1');
            await conn.db(MONGO_AUTHOR_DBNAME).collection('metadata.mapper.formulas').dropIndex('UNIQUE_INDEX');
            await conn.db(MONGO_AUTHOR_DBNAME).collection('metadata.mapper.formulas').dropIndex('name_1');

            logger.info('===================================================');
            logger.info('SUCCESS');
            logger.info('===================================================');
        } catch (err) {
            logger.error('Error Occured while dropping indexes!');
            logger.error(err);
            logger.error('===================================================');
            logger.error('ERROR');
            logger.error('===================================================');
        }
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

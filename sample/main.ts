import 'reflect-metadata';
import { TestRootModule } from './modules/root/test-root.module';
import { ExpressFactory } from '../src/factory/express-factory';

const cors = require('cors');
const bodyParser = require('body-parser');

async function startUp() {
  await ExpressFactory.createServer({
      rootModule: TestRootModule,
      globalMiddlewares: {
        preRoutes: [
          bodyParser.urlencoded({ extended: true }),
          bodyParser.json({ limit: '2m' })
        ],
        postRoutes: [cors]
      },
      swagger: {
        folder: '/doc',
        info: {
          title: 'Test API',
          description: 'Test API description',
          contacts: {
            name: 'Simone Di Cicco',
            email: 'simone.dicicco@gmail.com'
          },
          version: '1.0.0'
        },
        servers: [{ url: 'https://api.test.com/' }],
        tags: [
          {
            name: 'Tag',
            description: 'Description'
          }
        ]
      },
      logger: {
        consoleOutput: true,
        level: 'info',
        active: true,
        engine: 'true'
      },
      isCpuClustered: false
    }
  );
}

startUp();

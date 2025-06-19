import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MessageModule } from './message/message.module';
import { HotspotModule } from './hotspot/hotspot.module';

// Add this line to print the resolved static path when app starts
console.log('Static rootPath:', join(__dirname, '..', 'public'));

@Module({
  imports: [
    // ✅ Serve static files from the "public" directory
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/', // This allows direct access like /asset/images/...
    }),
    MessageModule,
    HotspotModule,
  ],
})
export class AppModule {}

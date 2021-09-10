import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PodcastsModule } from './podcast/podcasts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from './podcast/entities/podcast.entity';
import { Episode } from './podcast/entities/episode.entity';
import { Review } from './podcast/entities/review.entity';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ec2-18-215-44-132.compute-1.amazonaws.com',
      port: 5432,
      username: 'zppypshvmidhqb',
      password:
        '0f0e432ace1613bf389ccdadb5a7080c0f61808b752dbfd139cd7f3b6047fc15',
      database: 'da2q8g0kfr1ad6',
      synchronize: true,
      logging: process.env.NODE_ENV !== 'test',
      entities: [Podcast, Episode, User, Review],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => {
        return { user: req['user'] };
      },
    }),
    JwtModule.forRoot({
      privateKey: '8mMJe5dMGORyoRPLvngA8U4aLTF3WasX',
    }),
    PodcastsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
    });
  }
}

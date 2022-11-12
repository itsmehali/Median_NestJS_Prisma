import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { useContainer } from 'class-validator';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const articleShape = expect.objectContaining({
    id: expect.any(Number),
    body: expect.any(String),
    title: expect.any(String),
    published: expect.any(Boolean),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });

  const articlesData = [
    {
      id: 1000015,
      title: 'title1',
      description: 'description1',
      body: 'body1',
      published: true,
    },
    {
      id: 1000025,
      title: 'title2',
      description: 'description2',
      body: 'body2',
      published: false,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    prisma = app.get<PrismaService>(PrismaService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    await prisma.article.create({
      data: articlesData[0],
    });
    await prisma.article.create({
      data: articlesData[1],
    });
  });

  describe('GET /articles', () => {
    it('returns a list of published articles', async () => {
      const { status, body } = await request(app.getHttpServer()).get('/articles');

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([articleShape]));
      expect(body).toHaveLength(1);
      expect(body[0].id).toEqual(articlesData[0].id);
      expect(body[0].published).toBeTruthy();
    });

    it('returns a list of draft articles', async () => {
      const { status, body } = await request(app.getHttpServer()).get('/articles/drafts');

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([articleShape]));
      expect(body).toHaveLength(1);
      expect(body[0].id).toEqual(articlesData[1].id);
      expect(body[0].published).toBeFalsy();
    });
  });
});

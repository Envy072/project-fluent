import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

// Integration Verification (per M34's Testing Pyramid): confirms the
// Identity & Access Module's HTTP surface, the AuthService, and a real
// PostgreSQL database coordinate correctly end-to-end. Requires the
// docker-compose `postgres` service to be running locally (see
// docs/engineering — this mirrors how CI provisions Postgres for the
// same purpose).

const TEST_EMAIL = 'integration-test-user@example.com';
const TEST_PASSWORD = 'correct-horse-battery-staple';

describe('Auth (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    process.env.AUTH_JWT_SECRET ??= 'integration-test-secret-do-not-use-in-production';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    prisma = moduleRef.get(PrismaService);
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
    await app.close();
  });

  it('registers a new account and returns a usable access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD })
      .expect(201);

    expect(response.body.user).toMatchObject({ email: TEST_EMAIL });
    expect(response.body.user).not.toHaveProperty('passwordHash');
    expect(typeof response.body.accessToken).toBe('string');
  });

  it('rejects a second registration with the same email', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD })
      .expect(409);
  });

  it('logs in with correct credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD })
      .expect(200);

    expect(response.body.user).toMatchObject({ email: TEST_EMAIL });
    expect(typeof response.body.accessToken).toBe('string');
  });

  it('rejects login with an incorrect password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: TEST_EMAIL, password: 'wrong-password' })
      .expect(401);
  });

  it('rejects login for an email that does not exist', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nobody-at-all@example.com', password: TEST_PASSWORD })
      .expect(401);
  });

  it('rejects registration payloads with unexpected fields', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'another-user@example.com', password: TEST_PASSWORD, isAdmin: true })
      .expect(400);
  });

  describe('protected route infrastructure (/auth/me)', () => {
    it('returns the current user when a valid access token is presented', async () => {
      const login = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: TEST_EMAIL, password: TEST_PASSWORD })
        .expect(200);

      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${login.body.accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({ email: TEST_EMAIL });
    });

    it('rejects requests with no access token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('rejects requests with an invalid access token', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer not-a-real-token')
        .expect(401);
    });
  });
});

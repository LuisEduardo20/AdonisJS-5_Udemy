import { UserFactory } from './../../database/factories/index';
import test from 'japa';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('User', (group) => {
  test('It should create an user', async (assert) => {
    const userPayload = {
      email: 'test@mail.com ',
      username: 'test',
      password: 'test',
      avatar: 'http://images.com/image/1',
    };

    const { body } = await supertest(BASE_URL).post('/users').send(userPayload).expect(201);

    assert.exists(body.user, 'User undefined');
    assert.exists(body.user.id, 'Id undefined');
    assert.equal(body.user.email, userPayload.email);
    assert.equal(body.user.username, userPayload.username);
    assert.equal(body.user.avatar, userPayload.avatar);
    assert.notExists(body.user.password, 'Password find');
  });

  test('It should return 409 when email already in use', async (assert) => {
    const { email } = await UserFactory.create();

    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email,
        username: 'test',
        password: 'test',
      })
      .expect(409);

    assert.exists(body.message);
    assert.exists(body.code);
    assert.exists(body.status);
    assert.include(body.message, 'Email');
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 409);
  });

  test('It should return 409 when username already in use', async (assert) => {
    const { username } = await UserFactory.create();

    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email: 'test@mail.com',
        username,
        password: 'test',
      })
      .expect(409);

    assert.include(body.message, 'Username');
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 409);
  });

  //? Permite que o teste rode com transações
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction();
  });

  //? Dá um rollback nas transações feitas depois de cada teste realizado
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction();
  });
});

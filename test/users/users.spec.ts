import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('User', () => {
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

  test('It should return 409 when email already in use', async (assert) => {});
});

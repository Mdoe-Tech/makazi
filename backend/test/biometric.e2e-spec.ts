import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Role } from '../src/auth/guards/roles.guard';

describe('BiometricController (e2e)', () => {
  let app: INestApplication;
  let registrarToken: string;
  let verifierToken: string;
  let citizenId: string;
  let biometricId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create first admin user
    await request(app.getHttpServer())
      .post('/admin/first-admin')
      .send({
        username: 'superadmin',
        password: 'Superadmin@123!',
        first_name: 'Super',
        last_name: 'Admin',
        email: 'superadmin@test.com',
        role: Role.SUPER_ADMIN
      })
      .expect(201);

    // Login as superadmin
    const superadminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        username: 'superadmin',
        password: 'Superadmin@123!'
      })
      .expect(201);

    const superadminToken = superadminLoginResponse.body.access_token;

    // Create verifier user
    const createVerifierResponse = await request(app.getHttpServer())
      .post('/admin')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        username: 'verifier',
        password: 'Verifier@123!',
        first_name: 'Test',
        last_name: 'Verifier',
        email: 'verifier@test.com',
        role: Role.VERIFIER
      })
      .expect(201);

    // Create registrar user
    const createRegistrarResponse = await request(app.getHttpServer())
      .post('/admin')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        username: 'registrar',
        password: 'Registrar@123!',
        first_name: 'Test',
        last_name: 'Registrar',
        email: 'registrar@test.com',
        role: Role.REGISTRAR
      })
      .expect(201);

    // Login as registrar
    const registrarLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        username: 'registrar',
        password: 'Registrar@123!'
      })
      .expect(201);

    registrarToken = registrarLoginResponse.body.access_token;

    // Login as verifier
    const verifierLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        username: 'verifier',
        password: 'Verifier@123!'
      })
      .expect(201);

    verifierToken = verifierLoginResponse.body.access_token;

    // Helper to generate a random 16-digit string
    function randomNidaNumber() {
      return String(Math.floor(Math.random() * 1e16)).padStart(16, '0');
    }
    // Helper to generate a random birth certificate number (2 letters + 6 digits)
    function randomBirthCert() {
      const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const digits = String(Math.floor(Math.random() * 1e6)).padStart(6, '0');
      return letters + digits;
    }

    // Create a test citizen
    const createCitizenResponse = await request(app.getHttpServer())
      .post('/citizen')
      .set('Authorization', `Bearer ${registrarToken}`)
      .send({
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: new Date('1990-01-01'),
        gender: 'male',
        nationality: 'Tanzanian',
        phone_number: '+255123456789',
        birth_certificate_number: randomBirthCert(),
        marital_status: 'single',
        address: '123 Main St',
        employment_status: 'employed',
        occupation: 'Software Developer',
        employer_name: 'Tech Corp',
        nida_number: randomNidaNumber()
      })
      .expect(201);

    citizenId = createCitizenResponse.body.id;

    // Create biometric data for the citizen
    const createBiometricResponse = await request(app.getHttpServer())
      .post(`/citizen/${citizenId}/biometric`)
      .set('Authorization', `Bearer ${registrarToken}`)
      .send({
        fingerprint_data: 'ZmFrZV9maW5nZXJwcmludA==', // base64 encoded "fake_fingerprint"
        facial_data: 'ZmFrZV9mYWNl', // base64 encoded "fake_face"
        iris_data: 'ZmFrZV9pcmlz', // base64 encoded "fake_iris"
        quality_score: 90
      })
      .expect(201);

    biometricId = createBiometricResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /citizen/:id/biometric', () => {
    it('should submit biometric data for a citizen', () => {
      return request(app.getHttpServer())
        .post(`/citizen/${citizenId}/biometric`)
        .set('Authorization', `Bearer ${registrarToken}`)
        .send({
          fingerprint_data: 'ZmFrZV9maW5nZXJwcmludA==', // base64 encoded "fake_fingerprint"
          facial_data: 'ZmFrZV9mYWNl', // base64 encoded "fake_face"
          iris_data: 'ZmFrZV9pcmlz', // base64 encoded "fake_iris"
          quality_score: 90
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('biometric_data');
        });
    });

    it('should fail with invalid data', () => {
      return request(app.getHttpServer())
        .post(`/citizen/${citizenId}/biometric`)
        .set('Authorization', `Bearer ${registrarToken}`)
        .send({
          invalidData: 'test',
        })
        .expect(400);
    });
  });

  describe('GET /biometric', () => {
    it('should return all biometric records', () => {
      return request(app.getHttpServer())
        .get('/biometric')
        .set('Authorization', `Bearer ${registrarToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
  });

  describe('GET /biometric/:id', () => {
    it('should return specific biometric record', () => {
      return request(app.getHttpServer())
        .get(`/biometric/${biometricId}`)
        .set('Authorization', `Bearer ${registrarToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('citizenId');
        });
    });

    it('should fail with invalid ID', () => {
      return request(app.getHttpServer())
        .get('/biometric/invalid-uuid')
        .set('Authorization', `Bearer ${registrarToken}`)
        .expect(404);
    });
  });

  describe('GET /biometric/citizen/:id', () => {
    it('should return citizen biometric data', () => {
      return request(app.getHttpServer())
        .get(`/biometric/citizen/${citizenId}`)
        .set('Authorization', `Bearer ${verifierToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
  });

  describe('POST /biometric/:id/validate', () => {
    it('should validate biometric data', () => {
      return request(app.getHttpServer())
        .post(`/biometric/${biometricId}/validate`)
        .set('Authorization', `Bearer ${verifierToken}`)
        .send({
          qualityThreshold: 0.8,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('isValid');
          expect(res.body).toHaveProperty('qualityScore');
        });
    });
  });

  describe('POST /biometric/match/fingerprint', () => {
    it('should match fingerprint data', () => {
      return request(app.getHttpServer())
        .post('/biometric/match/fingerprint')
        .set('Authorization', `Bearer ${verifierToken}`)
        .send({
          fingerprintData: 'ZmFrZV9maW5nZXJwcmludA==', // base64 encoded "fake_fingerprint"
          threshold: 0.8,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('matches');
          expect(res.body).toHaveProperty('confidence');
        });
    });

    it('should fail with invalid fingerprint data', () => {
      return request(app.getHttpServer())
        .post('/biometric/match/fingerprint')
        .set('Authorization', `Bearer ${verifierToken}`)
        .send({
          invalidData: 'test',
        })
        .expect(400);
    });
  });
}); 
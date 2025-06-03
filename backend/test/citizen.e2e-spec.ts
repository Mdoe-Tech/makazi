import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Role } from '../src/auth/guards/roles.guard';
import { setupTestDatabase, teardownTestDatabase } from './test-database.config';
import { DatabaseService } from '../src/database/database.service';

describe('CitizenController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let approverToken: string;
  let citizenId: string;
  let newCitizenId: string;
  let registrarToken: string;
  let databaseService: DatabaseService;

  // Helper function to generate unique NIDA numbers
  const generateUniqueNidaNumber = () => {
    let num = '';
    for (let i = 0; i < 16; i++) {
      num += Math.floor(Math.random() * 10);
    }
    return num;
  };

  // Helper function to generate unique birth certificate numbers (2 uppercase letters + 6 digits)
  const generateUniqueBirthCert = () => {
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                    String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = String(Math.floor(100000 + Math.random() * 900000));
    return letters + digits;
  };

  beforeAll(async () => {
    // Set up test database
    databaseService = await setupTestDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create first admin
    try {
      await request(app.getHttpServer())
        .post('/admin/first-admin')
        .send({
          username: 'superadmin',
          password: 'Superadmin123!',
          first_name: 'Super',
          last_name: 'Admin',
          email: 'superadmin@example.com',
          phone_number: '+255123456789',
          role: 'SUPER_ADMIN'
        });
    } catch (error) {
      // Ignore error if admin already exists
    }

    // Login as super admin
    const superAdminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        username: 'superadmin',
        password: 'Superadmin123!'
      })
      .expect(201);

    const superAdminToken = superAdminLoginResponse.body.access_token;

    // Create registrar admin
    try {
      const registrarResponse = await request(app.getHttpServer())
        .post('/admin')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          username: 'registrar',
          password: 'Registrar@123!',
          first_name: 'Registrar',
          last_name: 'User',
          email: 'registrar@example.com',
          phone_number: '+255123456789',
          role: 'REGISTRAR'
        });

      if (registrarResponse.status === 201) {
        console.log('Registrar admin created successfully');
      } else if (registrarResponse.status === 400) {
        console.log('Registrar admin already exists, updating password');
        // Update the registrar's password
        const registrar = await request(app.getHttpServer())
          .get('/admin')
          .set('Authorization', `Bearer ${superAdminToken}`)
          .expect(200)
          .then(res => res.body.find(admin => admin.username === 'registrar'));

        if (registrar) {
          await request(app.getHttpServer())
            .patch(`/admin/${registrar.id}`)
            .set('Authorization', `Bearer ${superAdminToken}`)
            .send({
              password: 'Registrar@123!'
            })
            .expect(200);
          console.log('Registrar password updated successfully');
        }
      }
    } catch (error) {
      console.error('Error creating registrar admin:', error);
    }

    // Create approver admin
    try {
      const approverResponse = await request(app.getHttpServer())
        .post('/admin')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          username: 'approver',
          password: 'Approver@123!',
          first_name: 'Approver',
          last_name: 'User',
          email: 'approver@example.com',
          phone_number: '+255123456789',
          role: 'APPROVER'
        });

      if (approverResponse.status === 201) {
        console.log('Approver admin created successfully');
      } else if (approverResponse.status === 400) {
        console.log('Approver admin already exists, updating password');
        // Update the approver's password
        const approver = await request(app.getHttpServer())
          .get('/admin')
          .set('Authorization', `Bearer ${superAdminToken}`)
          .expect(200)
          .then(res => res.body.find(admin => admin.username === 'approver'));

        if (approver) {
          await request(app.getHttpServer())
            .patch(`/admin/${approver.id}`)
            .set('Authorization', `Bearer ${superAdminToken}`)
            .send({
              password: 'Approver@123!'
            })
            .expect(200);
          console.log('Approver password updated successfully');
        }
      }
    } catch (error) {
      console.error('Error creating approver admin:', error);
    }

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

    // Login as approver
    const approverLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        username: 'approver',
        password: 'Approver@123!'
      })
      .expect(201);

    approverToken = approverLoginResponse.body.access_token;

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
    const createCitizenResponseRaw = await request(app.getHttpServer())
      .post('/citizen')
      .set('Authorization', `Bearer ${registrarToken}`)
      .send({
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: '1990-01-01',
        gender: 'male',
        nationality: 'Tanzanian',
        nida_number: generateUniqueNidaNumber(),
        phone_number: '+255123456789',
        email: 'john.doe@example.com',
        address: '123 Main St, Dar es Salaam',
        marital_status: 'single',
        birth_certificate_number: generateUniqueBirthCert(),
        employment_status: 'employed',
        occupation: 'Software Engineer',
        employer_name: 'Tech Company Ltd',
        dossier_number: 'CD654321'
      });
    console.log('Citizen creation status:', createCitizenResponseRaw.status);
    console.log('Citizen creation body:', createCitizenResponseRaw.body);
    if (createCitizenResponseRaw.status !== 201) {
      throw new Error('Citizen creation failed');
    }
    const createCitizenResponse = createCitizenResponseRaw.body;
    citizenId = createCitizenResponse.id;
  });

  afterAll(async () => {
    await app.close();
    await teardownTestDatabase(databaseService);
  });

  describe('GET /citizen', () => {
    it('should return all citizens', () => {
      return request(app.getHttpServer())
        .get('/citizen')
        .set('Authorization', `Bearer ${registrarToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
  });

  describe('GET /citizen/:id', () => {
    it('should return specific citizen', () => {
      return request(app.getHttpServer())
        .get(`/citizen/${citizenId}`)
        .set('Authorization', `Bearer ${registrarToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('first_name');
          expect(res.body).toHaveProperty('last_name');
        });
    });

    it('should fail with invalid ID', () => {
      return request(app.getHttpServer())
        .get('/citizen/invalid-uuid')
        .set('Authorization', `Bearer ${registrarToken}`)
        .expect(400);
    });
  });

  describe('POST /citizen/:id/biometric', () => {
    it('should submit biometric data for a citizen', () => {
      return request(app.getHttpServer())
        .post(`/citizen/${citizenId}/biometric`)
        .set('Authorization', `Bearer ${registrarToken}`)
        .send({
          fingerprint_data: 'ZmFrZV9maW5nZXJwcmludA==',
          facial_data: 'ZmFrZV9mYWNl',
          iris_data: 'ZmFrZV9pcmlz',
          quality_score: 95
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

  describe('POST /citizen/:id/approve', () => {
    it('should approve citizen registration', () => {
      return request(app.getHttpServer())
        .post(`/citizen/${citizenId}/approve`)
        .set('Authorization', `Bearer ${approverToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('registration_status');
          expect(res.body.registration_status).toBe('APPROVED');
        });
    });

    it('should fail with invalid ID', () => {
      return request(app.getHttpServer())
        .post('/citizen/invalid-uuid/approve')
        .set('Authorization', `Bearer ${approverToken}`)
        .expect(400);
    });
  });

  describe('POST /citizen', () => {
    it('should create a new citizen', () => {
      return request(app.getHttpServer())
        .post('/citizen')
        .set('Authorization', `Bearer ${registrarToken}`)
        .send({
          first_name: 'Jane',
          last_name: 'Doe',
          date_of_birth: '1992-01-01',
          gender: 'female',
          nationality: 'Tanzanian',
          phone_number: '+255987654321',
          address: '456 Main St, Dar es Salaam',
          marital_status: 'single',
          occupation: 'Doctor',
          employment_status: 'employed',
          email: 'jane.doe@example.com',
          nida_number: generateUniqueNidaNumber(),
          birth_certificate_number: generateUniqueBirthCert(),
          dossier_number: 'EF654321'
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('first_name', 'Jane');
          expect(res.body).toHaveProperty('last_name', 'Doe');
        });
    });

    it('should fail with invalid data', () => {
      return request(app.getHttpServer())
        .post('/citizen')
        .set('Authorization', `Bearer ${registrarToken}`)
        .send({
          invalidData: 'test',
        })
        .expect(400);
    });
  });

  describe('POST /citizen/:id/documents', () => {
    beforeEach(async () => {
      // Create a new citizen for document submission
      const createCitizenResponse = await request(app.getHttpServer())
        .post('/citizen')
        .set('Authorization', `Bearer ${registrarToken}`)
        .send({
          first_name: 'John',
          last_name: 'Doe',
          date_of_birth: '1990-01-01',
          gender: 'male',
          nationality: 'Tanzanian',
          nida_number: generateUniqueNidaNumber(),
          phone_number: '+255123456789',
          email: 'john.doe@example.com',
          address: '123 Main St, Dar es Salaam',
          marital_status: 'single',
          birth_certificate_number: generateUniqueBirthCert(),
          employment_status: 'employed',
          occupation: 'Software Engineer',
          employer_name: 'Tech Company Ltd',
          dossier_number: 'IJ654321'
        })
        .expect(201);

      newCitizenId = createCitizenResponse.body.id;
    });

    it('should submit documents for a citizen', () => {
      return request(app.getHttpServer())
        .post(`/citizen/${newCitizenId}/documents`)
        .set('Authorization', `Bearer ${registrarToken}`)
        .send({
          birth_certificate: 'birthcert123.pdf',
          passport_photo: 'passport123.jpg',
          education_certificate: 'education123.pdf',
          employment_certificate: 'employment123.pdf'
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('registration_status', 'DOCUMENT_VERIFICATION');
        });
    });

    it('should fail with invalid data', () => {
      return request(app.getHttpServer())
        .post(`/citizen/${newCitizenId}/documents`)
        .set('Authorization', `Bearer ${registrarToken}`)
        .send({
          invalidData: 'test',
        })
        .expect(400);
    });
  });

  describe('POST /citizen/:id/reject', () => {
    beforeEach(async () => {
      // Create a new citizen for rejection
      const createCitizenResponse = await request(app.getHttpServer())
        .post('/citizen')
        .set('Authorization', `Bearer ${registrarToken}`)
        .send({
          first_name: 'John',
          last_name: 'Doe',
          date_of_birth: '1990-01-01',
          gender: 'male',
          nationality: 'Tanzanian',
          nida_number: generateUniqueNidaNumber(),
          phone_number: '+255123456789',
          email: 'john.doe@example.com',
          address: '123 Main St, Dar es Salaam',
          marital_status: 'single',
          birth_certificate_number: generateUniqueBirthCert(),
          employment_status: 'employed',
          occupation: 'Software Engineer',
          employer_name: 'Tech Company Ltd',
          dossier_number: 'KL654321'
        })
        .expect(201);

      newCitizenId = createCitizenResponse.body.id;
    });

    it('should reject citizen registration', () => {
      return request(app.getHttpServer())
        .post(`/citizen/${newCitizenId}/reject`)
        .set('Authorization', `Bearer ${approverToken}`)
        .send({
          reason: 'Incomplete documentation',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('registration_status', 'REJECTED');
        });
    });

    it('should fail with invalid ID', () => {
      return request(app.getHttpServer())
        .post('/citizen/invalid-uuid/reject')
        .set('Authorization', `Bearer ${approverToken}`)
        .send({
          reason: 'Invalid ID',
        })
        .expect(400);
    });
  });
}); 
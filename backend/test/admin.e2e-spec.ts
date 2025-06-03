import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Role } from '../src/auth/guards/roles.guard';
import { DatabaseService } from '../src/database/database.service';

describe('AdminController (e2e)', () => {
  let app: INestApplication;
  let superAdminToken: string;
  let adminToken: string;
  let createdAdminId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create first admin if none exists
    try {
      const firstAdminResponse = await request(app.getHttpServer())
        .post('/admin/first-admin')
        .send({
          username: 'superadmin',
          password: 'Superadmin123!',
          email: 'superadmin@example.com',
          first_name: 'Super',
          last_name: 'Admin',
          role: Role.SUPER_ADMIN,
        });

      if (firstAdminResponse.status === 201) {
        console.log('First admin created successfully');
      } else if (firstAdminResponse.status === 409) {
        console.log('First admin already exists');
      } else {
        console.error('Failed to create first admin:', firstAdminResponse.body);
      }
    } catch (error) {
      console.error('Error creating first admin:', error);
    }

    // Login as super admin
    const superAdminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'superadmin',
        password: 'Superadmin123!',
      });

    if (superAdminLogin.status === 201) {
      superAdminToken = superAdminLogin.body.access_token;
      console.log('Super admin login successful');
    } else {
      console.error('Super admin login failed:', superAdminLogin.body);
    }

    // Create and login as regular admin
    const newAdminData = {
      username: 'admin',
      password: 'Admin123!',
      email: 'admin@example.com',
      first_name: 'Regular',
      last_name: 'Admin',
      role: Role.ADMIN,
    };

    const adminCreation = await request(app.getHttpServer())
      .post('/admin')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send(newAdminData);

    if (adminCreation.status === 201) {
      createdAdminId = adminCreation.body.id;
      console.log('Regular admin created successfully');

      const adminLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: newAdminData.username,
          password: newAdminData.password,
        });

      if (adminLogin.status === 201) {
        adminToken = adminLogin.body.access_token;
        console.log('Regular admin login successful');
      } else {
        console.error('Regular admin login failed:', adminLogin.body);
      }
    } else {
      console.error('Regular admin creation failed:', adminCreation.body);
    }
  });

  afterAll(async () => {
    // Clean up test data
    if (createdAdminId) {
      try {
        await request(app.getHttpServer())
          .delete(`/admin/${createdAdminId}`)
          .set('Authorization', `Bearer ${superAdminToken}`);
        console.log('Test admin deleted successfully');
      } catch (error) {
        console.error('Failed to delete test admin:', error);
      }
    }

    await app.close();
  });

  describe('POST /admin/first-admin', () => {
    it('should fail if admin already exists', () => {
      return request(app.getHttpServer())
        .post('/admin/first-admin')
        .send({
          username: 'superadmin',
          password: 'Superadmin123!',
          email: 'superadmin@example.com',
          first_name: 'Super',
          last_name: 'Admin',
          role: Role.SUPER_ADMIN,
        })
        .expect(409);
    });
  });

  describe('POST /admin', () => {
    it('should create new admin user (super admin only)', () => {
      const timestamp = Date.now();
      const newAdminData = {
        username: `newadmin${timestamp}`,
        password: 'Newadmin123!',
        email: `newadmin${timestamp}@example.com`,
        first_name: 'New',
        last_name: 'Admin',
        role: Role.ADMIN,
      };

      return request(app.getHttpServer())
        .post('/admin')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(newAdminData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.username).toBe(newAdminData.username);
          expect(res.body.email).toBe(newAdminData.email);
          expect(res.body.role).toBe(newAdminData.role);
        });
    });

    it('should fail when regular admin tries to create admin', () => {
      const newAdminData = {
        username: 'anotheradmin',
        password: 'Another123!',
        email: 'another@example.com',
        first_name: 'Another',
        last_name: 'Admin',
        role: Role.ADMIN,
      };

      return request(app.getHttpServer())
        .post('/admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newAdminData)
        .expect(403);
    });

    it('should fail with duplicate username', () => {
      const newAdminData = {
        username: 'admin', // Using existing username
        password: 'Admin123!',
        email: 'duplicate@example.com',
        first_name: 'Duplicate',
        last_name: 'Admin',
        role: Role.ADMIN,
      };

      return request(app.getHttpServer())
        .post('/admin')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(newAdminData)
        .expect(400);
    });
  });

  describe('GET /admin', () => {
    it('should return all admins (super admin only)', () => {
      return request(app.getHttpServer())
        .get('/admin')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should fail when regular admin tries to list all admins', () => {
      return request(app.getHttpServer())
        .get('/admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });
  });

  describe('GET /admin/:id', () => {
    it('should return specific admin (super admin only)', () => {
      return request(app.getHttpServer())
        .get(`/admin/${createdAdminId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdAdminId);
          expect(res.body.username).toBe('admin');
        });
    });

    it('should fail when regular admin tries to get another admin', () => {
      return request(app.getHttpServer())
        .get(`/admin/${createdAdminId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });

    it('should fail with non-existent admin ID', () => {
      return request(app.getHttpServer())
        .get('/admin/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(404);
    });
  });

  describe('PATCH /admin/:id', () => {
    it('should update admin (super admin only)', () => {
      const updateData = {
        first_name: 'Updated',
        last_name: 'Admin',
      };

      return request(app.getHttpServer())
        .patch(`/admin/${createdAdminId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.first_name).toBe(updateData.first_name);
          expect(res.body.last_name).toBe(updateData.last_name);
        });
    });

    it('should fail when regular admin tries to update admin', () => {
      return request(app.getHttpServer())
        .patch(`/admin/${createdAdminId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ first_name: 'Updated' })
        .expect(403);
    });
  });

  describe('PATCH /admin/:id/toggle-active', () => {
    it('should toggle admin active status (super admin only)', () => {
      return request(app.getHttpServer())
        .patch(`/admin/${createdAdminId}/toggle-active`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('is_active');
        });
    });

    it('should fail when regular admin tries to toggle status', () => {
      return request(app.getHttpServer())
        .patch(`/admin/${createdAdminId}/toggle-active`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });
  });

  describe('GET /admin/profile', () => {
    it('should return admin profile', () => {
      return request(app.getHttpServer())
        .get('/admin/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('username');
          expect(res.body.username).toBe('admin');
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get('/admin/profile')
        .expect(401);
    });
  });

  describe('PATCH /admin/profile', () => {
    it('should update own profile', () => {
      const updateData = {
        first_name: 'Updated',
        last_name: 'Profile',
      };

      return request(app.getHttpServer())
        .patch('/admin/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.first_name).toBe(updateData.first_name);
          expect(res.body.last_name).toBe(updateData.last_name);
        });
    });
  });

  describe('DELETE /admin/:id', () => {
    it('should delete admin (super admin only)', () => {
      return request(app.getHttpServer())
        .delete(`/admin/${createdAdminId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200);
    });

    it('should fail when regular admin tries to delete admin', () => {
      return request(app.getHttpServer())
        .delete(`/admin/${createdAdminId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });

    it('should fail with non-existent admin ID', () => {
      return request(app.getHttpServer())
        .delete('/admin/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(404);
    });
  });
}); 
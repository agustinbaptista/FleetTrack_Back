import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import dataSource from '../data-source';
import { User } from '../../auth/user.entity';
import { Role } from '../../common/enums/role.enum';

async function run(): Promise<void> {
  const db: DataSource = await dataSource.initialize();
  const userRepo = db.getRepository(User);

  const adminEmail = 'admin@tracking.local';
  const exists = await userRepo.findOne({ where: { email: adminEmail } });
  if (!exists) {
    const password = await bcrypt.hash('admin123', 10);
    await userRepo.save(
      userRepo.create({
        email: adminEmail,
        password,
        role: Role.ADMIN,
      }),
    );
  }

  await db.destroy();
}

void run();

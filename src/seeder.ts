import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './users/user.entity';
import { Thread } from './threads/thread.entity';
import { Reply } from './replies/reply.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Thread, Reply],
  synchronize: false,
  ssl: { rejectUnauthorized: false },
});

const USERS = [
  { username: 'johndoe',  email: 'johndoe@example.com', password: 'password123' },
  { username: 'janedoe',  email: 'jane@example.com',    password: 'password123' },
  { username: 'devbuddy', email: 'devbuddy@example.com', password: 'password123' },
];

const THREADS = [
  { userIdx: 0, title: 'Bagaimana cara menggunakan environment variables di Node.js?', content: 'Saya baru belajar backend development dan bingung cara menyembunyikan API keys. Bisakah seseorang menjelaskan cara menggunakan dotenv? Apakah aman untuk di-push ke GitHub?' },
  { userIdx: 1, title: 'Kapan harus menggunakan PostgreSQL vs MongoDB?', content: 'Untuk project e-commerce skala menengah, database mana yang lebih direkomendasikan dan mengapa? Saya sudah coba keduanya tapi masih bingung kapan harus pilih yang mana.' },
  { userIdx: 0, title: 'Mendapatkan CORS error saat hit API dari React', content: "Saya terus mendapat error 'Access-Control-Allow-Origin'. Bagaimana cara menangani ini di sisi Express.js? Saya sudah coba middleware cors tapi masih error." },
  { userIdx: 2, title: 'Apa perbedaan antara JWT dan Session untuk autentikasi?', content: 'Saya sedang membangun REST API dan bingung harus menggunakan JWT atau session-based authentication. Apa kelebihan dan kekurangan masing-masing?' },
  { userIdx: 1, title: 'Cara membuat relasi one-to-many di TypeORM dengan NestJS', content: 'Saya sedang membuat forum app dan perlu relasi antara User dan Thread. Sudah baca dokumentasi tapi masih bingung cara implementasinya.' },
  { userIdx: 2, title: 'Perbedaan async/await vs Promise.then() di JavaScript', content: 'Kapan sebaiknya pakai async/await dan kapan pakai .then()? Apakah keduanya sama dari sisi performa?' },
];

// Replies: { threadIdx, userIdx, content }
const REPLIES = [
  { threadIdx: 0, userIdx: 1, content: 'Gunakan package dotenv. Install dengan npm install dotenv, buat file .env, dan tambahkan .env ke .gitignore. Jangan pernah push file .env ke GitHub!' },
  { threadIdx: 0, userIdx: 2, content: 'Tambahkan .env ke .gitignore sebelum commit pertama. Kalau sudah terlanjur, gunakan git rm --cached .env.' },
  { threadIdx: 1, userIdx: 0, content: 'PostgreSQL lebih cocok untuk data yang terstruktur dan relasional. MongoDB bagus untuk data yang sering berubah skema. Untuk e-commerce, saya rekomendasikan PostgreSQL.' },
  { threadIdx: 1, userIdx: 2, content: 'Setuju dengan di atas. E-commerce biasanya butuh ACID transactions yang lebih reliable, jadi PostgreSQL pilihan yang tepat.' },
  { threadIdx: 2, userIdx: 1, content: 'Di Express.js tambahkan: app.use(cors({ origin: "http://localhost:3000" })). Install dulu dengan npm install cors.' },
  { threadIdx: 3, userIdx: 0, content: 'JWT stateless (tidak perlu database untuk validasi), cocok untuk REST API. Session stateful (perlu disimpan di server/Redis), cocok untuk web app tradisional.' },
  { threadIdx: 4, userIdx: 2, content: '@ManyToOne(() => User, (user) => user.threads) di entity Thread, dan @OneToMany(() => Thread, (thread) => thread.user) di entity User. Jangan lupa tambahkan eager: true jika mau auto-load.' },
];

async function seed() {
  console.log('🌱 Menghubungkan ke database...');
  await AppDataSource.initialize();

  const userRepo   = AppDataSource.getRepository(User);
  const threadRepo = AppDataSource.getRepository(Thread);
  const replyRepo  = AppDataSource.getRepository(Reply);

  // ── Upsert Users ──────────────────────────────────────────────
  console.log('\n👤 Upsert dummy users...');
  const savedUsers: User[] = [];
  for (const u of USERS) {
    const existing = await userRepo.findOne({ where: { email: u.email } });
    if (existing) {
      console.log(`   ⏭️  Skip (sudah ada): ${u.username}`);
      savedUsers.push(existing);
    } else {
      const password_hash = await bcrypt.hash(u.password, 10);
      const user = userRepo.create({ username: u.username, email: u.email, password_hash });
      const saved = await userRepo.save(user);
      savedUsers.push(saved);
      console.log(`   ✅ Dibuat: ${u.username} (${u.email})`);
    }
  }

  // ── Upsert Threads ────────────────────────────────────────────
  console.log('\n💬 Upsert dummy threads...');
  const savedThreads: Thread[] = [];
  for (const t of THREADS) {
    const owner = savedUsers[t.userIdx];
    const existing = await threadRepo.findOne({ where: { title: t.title } });
    if (existing) {
      console.log(`   ⏭️  Skip (sudah ada): "${t.title.substring(0, 45)}..."`);
      savedThreads.push(existing);
    } else {
      const thread = threadRepo.create({ title: t.title, content: t.content, user: { id: owner.id } });
      const saved = await threadRepo.save(thread);
      savedThreads.push(saved);
      console.log(`   ✅ Dibuat: "${t.title.substring(0, 45)}..."`);
    }
  }

  // ── Upsert Replies ────────────────────────────────────────────
  console.log('\n💭 Upsert dummy replies...');
  for (const r of REPLIES) {
    const thread = savedThreads[r.threadIdx];
    const user   = savedUsers[r.userIdx];
    const existing = await replyRepo.findOne({
      where: { content: r.content, thread: { id: thread.id } },
    });
    if (existing) {
      console.log(`   ⏭️  Skip (sudah ada): "${r.content.substring(0, 40)}..."`);
    } else {
      const reply = replyRepo.create({ content: r.content, thread: { id: thread.id }, user: { id: user.id } });
      await replyRepo.save(reply);
      console.log(`   ✅ Dibuat reply oleh ${user.username}`);
    }
  }

  console.log('\n✨ Seeding selesai!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Akun yang tersedia untuk login:');
  for (const u of USERS) console.log(`  📧 ${u.email}  🔑 ${u.password}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error('❌ Seeding gagal:', e);
  process.exit(1);
});

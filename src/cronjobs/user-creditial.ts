// import { Prisma } from '@prisma/client';
// import cron from 'node-cron';

// // Define job: run every hour
// cron.schedule('0 * * * *', async () => {
//   console.log('🔄 Running TTL cleanup job...');

//   try {
//     const result = await Prisma.session.deleteMany({
//       where: {
//         expiresAt: {
//           lt: new Date(), // delete if expiresAt < now
//         },
//       },
//     });

//     console.log(`✅ Deleted ${result.count} expired sessions`);
//   } catch (err) {
//     console.error('❌ Error cleaning expired sessions', err);
//   }
// });

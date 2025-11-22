// import { Prisma } from '@prisma/client';
// import cron from 'node-cron';

// // Define job: run every hour
// cron.schedule('0 * * * *', async () => {

//   try {
//     const result = await Prisma.session.deleteMany({
//       where: {
//         expiresAt: {
//           lt: new Date(), // delete if expiresAt < now
//         },
//       },
//     });

//   } catch (err) {
//     console.error('❌ Error cleaning expired sessions', err);
//   }
// });

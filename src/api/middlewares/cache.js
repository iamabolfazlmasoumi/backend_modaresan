// import {} from 'dotenv/config'
// import redis from "redis"
// //Cache midlleware
// export const cache = (req, res, next) => {
//     const redisClient = redis.createClient(process.env.REDIS_PORT);
//     const {
//         id
//     } = req.params;
//     redisClient.get(id, (error, cachedData) => {
//         if (error) throw error;
//         if (cachedData != null) {
//             let data = JSON.parse(cachedData);
//             res.status(200).json(data);
//         } else {
//             next();
//         }
//     });
// }

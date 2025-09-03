import authRoute from "./auth.route.js";
import profileRoute from "./profile.route.js";
import faqRoute from "./faq.route.js";


export const mountRoutes = (app) =>{
   app.use('/api/auth', authRoute);
   app.use('/api/profile', profileRoute);
   app.use('/api/faq', faqRoute);
}
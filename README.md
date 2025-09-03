### File and Folder structure

```
└─ .
   ├─ .idea
   │  ├─ modules.xml
   │  ├─ tommysgirl_mern_express.iml
   │  └─ vcs.xml
   ├─ app.js
   ├─ index.js
   ├─ package-lock.json
   ├─ package.json
   └─ src
      ├─ config
      │  └─ cloudinary.js
      ├─ controllers
      │  ├─ admin.controller.js
      │  ├─ auth.controller.js
      │  ├─ faq.controller.js
      │  ├─ profile.controller.js
      │  └─ settings.controller.js
      ├─ db
      │  └─ connectDB.js
      ├─ middlewares
      │  ├─ auth.middleware.js
      │  ├─ error.middleware.js
      │  ├─ limiter.middleware.js
      │  ├─ multer.middleware.js
      │  └─ validate.middleware.js
      ├─ routes
      │  ├─ admin.route.js
      │  ├─ auth.route.js
      │  ├─ faq.route.js
      │  ├─ index.js
      │  └─ profile.route.js
      ├─ schemas
      │  ├─ cms
      │  │  └─ faq.schema.js
      │  └─ operation
      │     ├─ agreement.schema.js
      │     ├─ bid.schema.js
      │     ├─ offer_transportation.schema.js
      │     ├─ report.schema.js
      │     ├─ review.schema.js
      │     ├─ tags.schema.js
      │     ├─ transport.schema.js
      │     ├─ transport_request.schema.js
      │     ├─ user.schema.js
      │     ├─ user_transport.schema.js
      │     └─ weight_category.schema.js
      ├─ services
      │  ├─ delete_cloudinary.service.js
      │  ├─ email_template.service.js
      │  ├─ item.service.js
      │  ├─ manage_status.service.js
      │  ├─ pagination.service.js
      │  └─ upload_cloudinary.service.js
      └─ utils
         ├─ api.error.js
         ├─ auth.helper.js
         ├─ catch.async.js
         ├─ email.helper.js
         ├─ log.console.js
         ├─ log.error.js
         ├─ log.warn.js
         ├─ pre_save.helper.js
         ├─ schema.helper.js
         ├─ schema.validator.js
         └─ success.response.js

```
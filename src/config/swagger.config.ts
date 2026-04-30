import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .addCookieAuth(
    'auth-cookie',
    {
      type: 'http',
      in: 'Header',
      scheme: 'Bearer',
    },
    'accessToken',
  )
  .setTitle('Backend E-Commerce API Documentation')
  .setDescription(
    '🍦 Welcome to the CreamyCream API — your ultimate scoop for all things e-commerce ice cream! From managing users 🍧, roles 🧑‍💼, and permissions 🛡️ to products 🛍️, orders 📦, and payments 💳 — everything you need is right here to build the coolest platform ever. Let’s make your backend as smooth as your favorite gelato! 🚀',
  )

  .setVersion('1.0')
  .setContact(
    'Adamandp',
    'https://portofolio-dam.vercel.app/',
    'adamanandaputra@gmail.com',
  )
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .addTag(
    'Authentication',
    '🔐 Secure your vibes! This is where we make sure only the real ones can access the goods. 🚀',
  )
  .addTag(
    `User`,
    '👤 It’s all about the user! From their profile to preferences, we’ve got their back. 💯',
  )
  .addTag(
    'User Permission',
    '🛡️ Permission granted or denied? We give users control over what they can do. No cap, you decide. 🙌',
  )
  .addTag(
    'User Roles',
    '⚖️ Every user gets their own power! Assign roles to control what they can and can’t do. It’s all about the right fit for the right vibe. 🌟',
  )
  .addTag(
    'Roles',
    '🛠️ Roles define access. Set roles for users and unlock the right level of control over resources. 🔑',
  )
  .addTag(
    'Permissions',
    '🔒 Define permissions to control what actions users can take. Empower your system with tight, secure access control. 🔐',
  )
  .addTag(
    'Address',
    '🏡 Where you at? Manage all the places that matter — home, office, or your secret lair. 📍',
  )
  .addTag(
    'Products',
    '🛍️ All the goodies in one place! Manage your product listings, from details to pricing, like a boss. 🧾',
  )
  .addTag(
    'Category',
    '🗂️ Keep it organized! Group your products into categories for easier browsing and smoother shopping. 🛒',
  )
  .addTag(
    'Cart',
    '🛒 Your shopping, your way! Keep track of what users want to buy before they hit that checkout. 🧺',
  )
  .addTag(
    'Review',
    '⭐ Real talk from real users! Let customers share their thoughts and help others decide. 🗣️',
  )
  .addTag(
    'Discount',
    '💸 Everyone loves a good deal! Manage promos and price cuts to boost sales and smiles. 🎉',
  )
  .addTag(
    'Payment',
    '💳 Secure your transactions! Set up payment methods and keep things rolling smoothly. 🚀',
  )
  .addTag(
    'Order',
    '📦 From checkout to delivery! Manage user orders and keep things flowing smoothly. 🚚',
  )
  .addTag(
    'Shipment',
    '📦 From checkout to delivery! Manage user orders and keep things flowing smoothly. 🚚',
  )
  .addTag(
    'Region',
    '🌎 Where you at? Manage all the places that matter — home, office, or your secret lair. 📍',
  )
  .addTag(
    'Health',
    '🏥 Check your health! Keep your system running smoothly. 🚀',
  )
  .build();

export const swaggerOptions: SwaggerCustomOptions = {
  jsonDocumentUrl: 'swagger/json',
  customCssUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
  ],
  customSiteTitle: 'API Documentation',
};

export const Messages = {
  create: (message: string) =>
    `🎉 ${message} created successfully! Welcome aboard! 🚀`,
  get: (message: string) =>
    `📦 ${message} retrieved successfully! Smooth sailing! 😎`,
  update: (message: string) =>
    `🔄 ${message} updated successfully! Looking fresh! ✨`,
  delete: (message: string) =>
    `🗑️ ${message} deleted successfully! Sayonara! 👋`,
  setCookie: (cookieName: string) =>
    `🍪 ${cookieName} set successfully! Enjoy your stay! 😋`,
};

// ERROR MESSAGES

export const ErrorMessage = {
  create: (resource: string) =>
    `❌ Oops! Failed to create ${resource}. Try again later! 🤦‍♂️`,
  get: (resource: string) =>
    `🚨 Whoops! Couldn't retrieve ${resource}. Maybe it's playing hide and seek? 🤔`,
  update: (resource: string) =>
    `⚠️ Failed to update ${resource}. Maybe it doesn't like change! 😅`,
  delete: (resource: string) =>
    `🛑 Failed to delete ${resource}. Looks like it's refusing to leave! 😭`,
  strictDelete: (resource: string) =>
    `❌ Cannot delete ${resource}! At least one ${resource} is required to keep the system functional. 🔒`,
  strictAdd: (resource: string) =>
    `❌ Cannot create ${resource}! ${resource} already exists and cannot be duplicated. 🔒`,
  alreadyExist: (model: string, field?: string) =>
    `⚡ ${model}${field ? ` ${field}` : ''} already exists! No duplicates allowed! 😆`,
  notFound: (model: string, field?: string) =>
    `🔍 ${model}${field ? ` ${field}` : ''} not found. Maybe it teleported to another dimension? 🛸`,
  validation: (resource: string) =>
    `🤷‍♂️ Validation failed for ${resource}. Check your input and try again! 🔍`,
  accessDenied: (resource: string) =>
    `🔒 Access Denied! Your ${resource} does not have permission to access this resource. 🚫`,
  sessionExpired: () =>
    `⏳ Your session has expired. Please log in again to continue. 🔄`,
  upload: (resource: string) =>
    `📤 Oops! Failed to upload ${resource}. Please try again later! 🚧`,
  notLoggedIn: `🚪 You are not logged in. Please sign in to continue! 🔐`,
  alreadyLoggedIn: `✅ You are already logged in. No need to log in again! 🎉`,
  invalidCredential: `🚫 Login failed. Please check your email and password, then try again! 🔍`,
};

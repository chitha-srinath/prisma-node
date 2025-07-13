// src/services/Authentication/providerRegistry.ts
type GoogleProfile = { id: string; email: string; name: string; picture?: string };
type CredentialsProfile = { email: string; hashedPassword: string };

export const providerRegistry = {
  google: (
    profile: GoogleProfile,
  ): {
    providerId: string;
    accountId: string;
    email: string;
    name: string;
    image?: string;
  } => ({
    providerId: 'google',
    accountId: profile.id,
    email: profile.email,
    name: profile.name,
    image: profile.picture,
  }),
  credentials: (
    profile: CredentialsProfile,
  ): {
    providerId: string;
    accountId: string;
    email: string;
    name: string;
    password: string;
  } => ({
    providerId: 'credentials',
    accountId: profile.email,
    email: profile.email,
    name: profile.email.split('@')[0],
    password: profile.hashedPassword,
  }),
  // Add more providers here
};

// // In your controller/service
// const providerData = providerRegistry[provider](profile);
// const user = await userService.findOrCreateUserWithProvider(providerData);

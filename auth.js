const microsoftAuth = new msal.PublicClientApplication({
  auth: {
    clientId: '022c508b-a40a-4604-91f8-8b5080154b2b',
    authority: 'https://login.microsoftonline.com/6e4db97c-f779-448d-88ca-f96ac5c6c3a0',
    // Come back to wherever the sign-in started. On portal.twlf.dev this is
    // the same value as before; locally it keeps you on localhost instead of
    // bouncing to production. Each origin must be registered in Entra.
    redirectUri: `${window.location.origin}/`,
    postLogoutRedirectUri: `${window.location.origin}/`,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    // localStorage, not sessionStorage: the session must outlive the tab so the
    // user stays signed in across restarts until they explicitly sign out.
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
});
const portalGraphScopes = ['User.Read', 'Calendars.Read', 'Mail.ReadBasic'];

let signedInAccount = null;

const authReady = microsoftAuth.handleRedirectPromise().then(response => {
  signedInAccount = response?.account || microsoftAuth.getAllAccounts()[0] || null;
  if (signedInAccount) microsoftAuth.setActiveAccount(signedInAccount);
  return signedInAccount;
});

window.twlfAuth = {
  ready: authReady,
  getAccount: () => signedInAccount,
  signIn: async () => {
    await microsoftAuth.loginRedirect({
      scopes: portalGraphScopes,
      prompt: 'select_account',
    });
  },
  signOut: async () => {
    const account = signedInAccount;
    signedInAccount = null;
    await microsoftAuth.logoutRedirect({ account, postLogoutRedirectUri: `${window.location.origin}/` });
  },
  acquireGraphToken: async scopes => {
    if (!signedInAccount) throw new Error('Sign in is required.');
    try {
      return await microsoftAuth.acquireTokenSilent({ account: signedInAccount, scopes });
    } catch (error) {
      if (error instanceof msal.InteractionRequiredAuthError) {
        await microsoftAuth.acquireTokenRedirect({ account: signedInAccount, scopes });
        return null;
      }
      throw error;
    }
  },
};

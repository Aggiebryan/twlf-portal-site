const microsoftAuth = new msal.PublicClientApplication({
  auth: {
    clientId: '022c508b-a40a-4604-91f8-8b5080154b2b',
    authority: 'https://login.microsoftonline.com/6e4db97c-f779-448d-88ca-f96ac5c6c3a0',
    redirectUri: 'https://portal.twlf.dev/',
    postLogoutRedirectUri: 'https://portal.twlf.dev/',
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
});

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
    const response = await microsoftAuth.loginPopup({
      scopes: ['User.Read'],
      prompt: 'select_account',
    });
    signedInAccount = response.account;
    microsoftAuth.setActiveAccount(signedInAccount);
    return signedInAccount;
  },
  signOut: async () => {
    const account = signedInAccount;
    signedInAccount = null;
    await microsoftAuth.logoutPopup({ account, postLogoutRedirectUri: 'https://portal.twlf.dev/' });
  },
  acquireGraphToken: async scopes => {
    if (!signedInAccount) throw new Error('Sign in is required.');
    try {
      return await microsoftAuth.acquireTokenSilent({ account: signedInAccount, scopes });
    } catch (error) {
      if (error instanceof msal.InteractionRequiredAuthError) {
        return microsoftAuth.acquireTokenPopup({ account: signedInAccount, scopes });
      }
      throw error;
    }
  },
};

import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { signInWithPopup } from 'firebase/auth';
import { auth,provider as googleprovider } from '../conf/config';
import { useContext } from 'react';
import { Mycontext } from '../conf/context';
import { useNavigate } from 'react-router-dom';

const providers = [
  { id: 'github', name: 'GitHub' },
  { id: 'google', name: 'Google' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'twitter', name: 'Twitter' },
  { id: 'linkedin', name: 'LinkedIn' },
];


export default function OAuthSignInPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const {setCurrentuser } = useContext(Mycontext);
  const signIn = async (provider) => {
    try {
      const result = await signInWithPopup(auth, googleprovider);
      const user = result.user;
      console.log(user);

      setCurrentuser({
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      });
      navigate('/Problems');
    } catch (error) {
      console.error("google error", error);
    }
  }

  return (

    <AppProvider theme={theme}>
      <SignInPage signIn={signIn} providers={providers} />
    </AppProvider>
    //appprovider sets the theme using the imported theme and signin page is the component from where we login 
//     Wraps everything in AppProvider to apply MUI theme.
// Renders a SignInPage component with:
//   signIn = { signIn } → tells it what function to call when a user chooses a provider.
//     providers = { providers } → shows the list of sign -in providers(GitHub, Google, etc.) in the UI.
  );
}

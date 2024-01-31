import React from 'react';
import { RedirectToSignIn, SignedOut, SignedIn } from '@clerk/clerk-react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

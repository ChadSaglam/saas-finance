interface LoginInfo {
  timestamp: string;
  ipAddress: string;
}

export const sendVerificationEmail = async (email: string, code: string): Promise<boolean> => {
  try {
    console.log('--------- EMAIL SENT ---------');
    console.log(`To: ${email}`);
    console.log('Subject: Your verification code');
    console.log('\nBody:');
    console.log(`Your one-time verification code:\n${code}\n`);
    console.log('This code expires after 5 minutes. If you did not request this, please change your password or contact MongoDB Support.');
    console.log('-----------------------------');
    
    // In production, you would call your email API here
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
};

export const sendLoginNotification = async (email: string, loginInfo: LoginInfo): Promise<boolean> => {
  try {
    // Format date for display
    const date = new Date(loginInfo.timestamp);
    const formattedDate = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')} GMT`;
    
    console.log('--------- EMAIL SENT ---------');
    console.log(`To: ${email}`);
    console.log('Subject: New sign-in to your account');
    console.log('\nBody:');
    console.log(`We're verifying a recent sign-in for ${email}:\n`);
    console.log(`Timestamp:\t${formattedDate}`);
    console.log(`IP Address:\t${loginInfo.ipAddress}`);
    console.log('\nYou\'re receiving this message because of a successful sign-in from a device that we didn\'t recognize. If you believe that this sign-in is suspicious, please reset your password immediately.');
    console.log('\nIf you\'re aware of this sign-in, please disregard this notice. This can happen when you use your browser\'s incognito or private browsing mode or clear your cookies.');
    console.log('\nThanks,\n\nMongoDB Team');
    console.log('-----------------------------');
    
    // In production, you would call your email API here
    return true;
  } catch (error) {
    console.error('Failed to send login notification:', error);
    return false;
  }
};
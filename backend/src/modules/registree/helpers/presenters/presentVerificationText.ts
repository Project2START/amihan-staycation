export function presentVerificationText(otp: string) {
  return `
        Thank you for signing up! Use the verification code below to confirm your email address.
    
        Your verification code: ${otp}
    
        If you didn’t create an account, you can safely ignore this email.
    
        Thanks,
        © ${new Date().getFullYear()} Amihan Staycation. All rights reserved.
        `;
}

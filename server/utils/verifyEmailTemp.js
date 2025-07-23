export const verifyEmailTemplate = ({name, verificationLink}) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #333;">Verify Your Email</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thanks for registering with us! Please confirm your email address by clicking the button below:</p>

      <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>

      <p>If the button above doesn't work, copy and paste this link into your browser:</p>

      <p style="word-break: break-all;">${verificationLink}</p>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">If you didn’t create an account, you can ignore this email.</p>
    </div>
  `;
};

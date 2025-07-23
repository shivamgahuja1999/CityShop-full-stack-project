export const forgotPasswordTemplate = ({ name, otp }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #333;">Forgot Password OTP</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>We received a request to reset your password. Use the OTP below to proceed:</p>

      <div style="font-size: 24px; font-weight: bold; margin: 20px 0; background-color: #f1f1f1; padding: 10px; border-radius: 5px; text-align: center;">
        ${otp}
      </div>

      <p>This OTP is valid for 1 hour. If you didn’t request a password reset, you can ignore this email.</p>

      <p style="margin-top: 30px; font-size: 12px; color: #999;">Thank you,<br>CityShop Support Team</p>
    </div>
  `;
};

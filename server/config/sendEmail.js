import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.RESEND_API) {
  console.log("Provide RESEND_API inside of .env file");
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    // console.log("📬 Email Parameters:");
    // console.log("To:", sendTo, typeof sendTo);
    // console.log("Subject:", subject);
    // console.log("HTML length:", html.length);

    const { data, error } = await resend.emails.send({
      from: "CityShop <onboarding@resend.dev>",
      to: sendTo,
      subject: subject,
      html: html,
    });
    if (error) {
      return console.error({ error });
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;

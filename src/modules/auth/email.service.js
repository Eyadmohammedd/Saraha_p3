import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"App" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });
};
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

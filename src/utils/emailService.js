import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendApprovalEmail = async (email, name) => {
  const mailOptions = {
    from: `"${process.env.APP_NAME || "WorkBond"}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "WorkBond Account Approved",
    html: `
      <h3>Congratulations ${name}!</h3>
      <p>Your WorkBond provider account has been approved.</p>
      <p>You can now log in and start offering your services.</p>
      <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/auth/login" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${email}`);
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};

export const sendRejectionEmail = async (email, name, reason) => {
  const mailOptions = {
    from: `"${process.env.APP_NAME || "WorkBond"}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "WorkBond Account Application Update",
    html: `
      <h3>Hello ${name},</h3>
      <p>We regret to inform you that your WorkBond provider account application has been rejected.</p>
      <p><strong>Reason:</strong> ${reason || "Does not meet our current requirements."}</p>
      <p>If you have any questions, please contact support.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Rejection email sent to ${email}`);
  } catch (error) {
    console.error("Error sending rejection email:", error);
  }
};

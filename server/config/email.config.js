// config/email.config.js
import nodemailer from "nodemailer";

let transporter;
let sender;

// Immediately invoked async function to setup Ethereal config
const setupEmail = async () => {
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  sender = {
    email: testAccount.user,
    name: "Gaya Nif",
  };

  console.log("✅ Ethereal email ready!");
  console.log("🔑 Email:", testAccount.user);
  console.log("🔑 Pass :", testAccount.pass);
};

// Run it immediately
await setupEmail();

// Export transporter and sender after it's ready
export { transporter, sender };

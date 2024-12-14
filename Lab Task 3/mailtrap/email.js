const { mailtrapClient, sender } = require("./mailtrap.config.js"); // Ensure client name matches
const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} = require("./emailTemplate.js");

const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "af447202-3111-4c8f-9a47-07dd51db772e",
      template_variables: {
        name: verificationToken,
      },
    });
    console.log("Email sent successfully");
    return response; // Return response for further use or testing
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw new Error("Failed to send email: " + error.message);
  }
};

const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "9c42c488-be40-41e0-af9f-a61b79ec45e9",
      template_variables: {
        name: name,
        company_info_name: "Danial Wajid",
        company_info_address: "CUI",
        company_info_city: "Lahore",
        company_info_zip_code: "54000",
        company_info_country: "Pakistan",
      },
    });
    console.log("Email set successfully");
  } catch (error) {
    throw new Error("Failed to send email: " + error.message);
  }
};

const sendResetPasswordEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error.message);
    throw new Error("Failed to send password reset email: " + error.message);
  }
};

const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
    console.log("Password reset success email sent successfully");
  } catch (error) {
    console.error(
      "Failed to send password reset success email:",
      error.message
    );
    throw new Error(
      "Failed to send password reset success email: " + error.message
    );
  }
};
module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
};

const { MailHandler } = require("./MailHandler");
const { successTransaction } = require("../../utils/errorHandlers");
const shareLogs = require('../../models/PeopleModel/shareLogs.model')

const SendContact = async (req, res) => {
    const sequelize = shareLogs.sequelize;
    const transaction = await sequelize.transaction();
    try {
        const { to, contact,shareDetails } = req.body;

        if (!to || !contact || !shareDetails) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const sendMail = await MailHandler(
            to,
            "REQUESTED CONTACT INFORMATION",
            `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Here is the contact of <strong>${contact.name.toUpperCase()}</strong> as requested.</p>
    
    <div style="
      background: #f8f9fa;
      border-left: 4px solid #4e73df;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 4px 4px 0;
    ">
      <h3 style="
        color: #4e73df;
        margin-top: 0;
        margin-bottom: 10px;
      ">${contact.name.toUpperCase()}</h3>
      
      <p style="margin: 5px 0;">
        ${contact.office.toUpperCase()}<br>
        ${contact.organization.toUpperCase()}
      </p>
      
      <p style="margin: 5px 0;">
        P.O. Box ${contact.postalCode.toUpperCase()}<br>
        ${contact.city}, ${contact.country.toUpperCase()}
      </p>
      
      <p style="margin: 5px 0;">
        <strong>Phone:</strong> ${contact.phoneNumber.toUpperCase()}<br>
        <strong>Email:</strong> <a href="mailto:${contact.email}" style="color: #4e73df; text-decoration: none;">${contact.email}</a>
      </p>
    </div>
    
    <p style="font-size: 0.9em; color: #6c757d;">
      This information was shared with you upon request.
    </p>
  </body>
</html>  `,
            true
        );

        await shareLogs.create(shareDetails,{transaction})

        if (!sendMail.success) {
            throw new Error("Unable to send mail!");
        }

        await transaction.commit()
        return successTransaction(res, "Mail sent successfully");
    } catch (err) {
        console.log(err)
        await transaction.rollback();
        return res.status(400).json({
            message: "Unable to send contact",
            error: err.message || "Unknown error",
        });
    }
};

module.exports = { SendContact };

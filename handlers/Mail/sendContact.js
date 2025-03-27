const { MailHandler } = require("./MailHandler");
const { successTransaction } = require("../../utils/errorHandlers");
const shareLogs = require('../../models/shareLogs.model')

const SendContact = async (req, res) => {
    const sequelize = shareLogs.sequelize;
    const transaction = await sequelize.transaction();
    try {
        const { to, contact,shareDetails } = req.body;

        if (!to || !contact || !shareDetails) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const mailBody = `
            Here is the contact of ${contact.name} as requested.

            --------------------------
            ${contact.name}
            ${contact.office}
            ${contact.organization}
            P.O. Box ${contact.postalCode}
            ${contact.city} - ${contact.country}
            ${contact.phoneNumber}
            ${contact.email}
            --------------------------
        `.trim();

        const subject = "REQUESTED CONTACT INFORMATION";

        await shareLogs.create(shareDetails,{transaction})

        const sendMail = await MailHandler(to, subject, mailBody);

        if (!sendMail.success) {
            throw new Error("Unable to send mail!");
        }

        await transaction.commit()
        return successTransaction(res, "Mail sent successfully");
    } catch (err) {
        await transaction.rollback();
        return res.status(400).json({
            message: "Unable to send contact",
            error: err.message || "Unknown error",
        });
    }
};

module.exports = { SendContact };

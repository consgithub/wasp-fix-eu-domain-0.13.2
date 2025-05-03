import { NodeMailgun } from "ts-mailgun";

export const customMailer = new NodeMailgun();
customMailer.apiKey = process.env.MAILGUN_API_KEY!;
customMailer.domain = process.env.MAILGUN_DOMAIN!;
customMailer.fromEmail = `noreply@${process.env.MAILGUN_DOMAIN}`;
customMailer.fromTitle = "Sender name";  // Add this
customMailer.options = {
    host: 'api.eu.mailgun.net'
};
customMailer.init();

export const sendCustomEmail = async (to: string, subject: string, html: string) => {
    try {
        return await customMailer.send(to, subject, html);
    } catch (error) {
        console.error('Custom mailer error:', error);
        throw error;
    }
};
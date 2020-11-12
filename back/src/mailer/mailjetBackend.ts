import { Mail, Contact } from "./types";
import * as Sentry from "@sentry/node";
import mailjet from "node-mailjet";

const {
  MJ_APIKEY_PUBLIC,
  MJ_APIKEY_PRIVATE,
  SENDER_EMAIL_ADDRESS,
  SENDER_NAME,
  MJ_MAIN_TEMPLATE_ID,
  SENTRY_DSN,
  NODE_ENV
} = process.env;

if (!!SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: NODE_ENV
  });
}

const mj = mailjet.connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

const mailjetBackend = {
  backendName: "Mailjet",

  sendMail: function (mail: Mail) {
    if (!mail.templateId) {
      mail.templateId = parseInt(MJ_MAIN_TEMPLATE_ID, 10);
    }

    const payload = {
      From: {
        Email: SENDER_EMAIL_ADDRESS,
        Name: SENDER_NAME
      },
      To: mail.to,
      Cc: mail.cc,
      TemplateId: mail.templateId,
      TemplateLanguage: true,
      Variables: {
        ...mail.vars,
        subject: mail.subject,
        title: mail.title,
        body: mail.body,
        baseurl: mail.baseUrl
      },
      Subject: mail.subject
    };
    if (!!mail.attachment?.file) {
      payload["Attachments"] = [
        {
          ContentType: "application/pdf",
          Filename: mail.attachment.name,
          Base64Content: mail.attachment.file
        }
      ];
    }

    const request = mj
      .post("send", { version: "v3.1" })
      .request({ Messages: [payload] });
    request
      .then(() => {
        const allRecipients = [...mail.to, ...(!!mail.cc ? mail.cc : [])];
        for (const recipient of allRecipients) {
          console.log(
            `Mail sent via MJ to ${recipient.email} - Subject: ${mail.subject}`
          );
        }
      })
      .catch(err => {
        if (!!SENTRY_DSN) {
          Sentry.captureException(err, {
            tags: {
              Mailer: "Mailjet",
              Recipients: mail.to.map(el => el.email).join(" ")
            }
          });
        } else {
          console.log(err);
        }
      });
  },
  addContact: function (contact: Contact) {
    const request = mj
      .post("contact", { version: "v3" })
      .request({ Name: contact.name, Email: contact.email });
    request
      .then(() => {
        console.log(`Contact created on MJ: ${contact.email}`);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

export default mailjetBackend;

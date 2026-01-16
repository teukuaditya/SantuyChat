import "dotenv/config";
import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_TOKEN;
const INBOX_ID = process.env.MAILTRAP_INBOX_ID;

if (!TOKEN) throw new Error("MAILTRAP_TOKEN missing");
if (!INBOX_ID) throw new Error("MAILTRAP_INBOX_ID missing");

const mailtrap = new MailtrapClient({
  token: TOKEN,
  testInboxId: Number(INBOX_ID),
  sandbox: true,
});

export default mailtrap;

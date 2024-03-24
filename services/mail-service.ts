import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

class MailService {
    transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.yandex.ru",
            port: Number(process.env.SMTP_PORT) || 0,
            secure: false,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        })
    }

    async sendActivationMail(to: string, link: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Активация аккаунта на " + process.env.API_URL,
            text: "",
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
            `

        })
    }
}

export = new MailService()
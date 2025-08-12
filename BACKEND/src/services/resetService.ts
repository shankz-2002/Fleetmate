import nodemailer from 'nodemailer';


export const sendResetEmail = async (email: any, resetLink: any) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'shankarshambhu13870@gmail.com',
                pass: 'oxqh sppv zkck juwj',
            },
        });
        await transporter.sendMail({
            from: '"FleetMate" <shankarshambhu13870@gmail.com>',
            to: email,
            subject: 'Password Reset Request',
            html: `
        <p>Hi,</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
        });
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw new Error('Email could not be sent');
    }

}

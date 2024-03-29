import nodemailer from "nodemailer";
import { Request } from "express";

const transporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const sendEmail = (req: Request, user: any): Promise<Boolean> => {
  let mailOptions = {
    from: `"Verify your email"<${process.env.USER}>`,
    to: user.email,
    subject: "roxyzc -Verify your email",
    html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #F7F9FA; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: #33aff2;">Welcome to the Blog me .</h2>
            <h3><span style="font-weight:bold; color: red; font-size:1.4rem"> ${user.username}</span> ! Thanks for registering in our site </h3>
                    <h4> Just click the button below to validate your email address. </h4>
                    <a style="background: #5a8cdb; border-radius:10px; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;" target="_blank" href="http://${req.headers.host}/api/v-user">Verify your email</a>
                    </div>
                    `,
  };

  try {
    transporter().sendMail(mailOptions);
    return Promise.resolve(true);
  } catch (error: any) {
    return Promise.resolve(false);
  }
};

export const sendInfoVerifyAccount = (
  email: string,
  username: string
): Promise<Boolean> => {
  let mailOptions = {
    from: `"Verify account success"<${process.env.USER}>`,
    to: email,
    subject: "Verify account success",
    html: `<h1 style="text-align: center; margin: auto;">Hello ${username}</h1>`,
  };

  try {
    transporter().sendMail(mailOptions);
    return Promise.resolve(true);
  } catch (error: any) {
    return Promise.resolve(false);
  }
};

export const sendOTPWithEmail = (
  email: string,
  otp: string
): Promise<Boolean> => {
  let mailOptions = {
    from: `"OTP"<${process.env.USER}>`,
    to: email,
    subject: "roxyzc -OTP<five minute expiration>",
    html: `<h1 style="text-align: center; margin: auto;">${otp}</h1>`,
  };

  try {
    transporter().sendMail(mailOptions);
    return Promise.resolve(true);
  } catch (error: any) {
    return Promise.resolve(false);
  }
};

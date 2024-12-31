export const verificationMail = (verificationCode: string) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #f0f0f0;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
        }
        .content {
            padding: 30px 20px;
            text-align: center;
        }
        .verification-code {
            font-size: 32px;
            letter-spacing: 8px;
            font-weight: bold;
            color: #4a90e2;
            padding: 20px;
            margin: 20px 0;
            background-color: #f8f9fa;
            border-radius: 4px;
        }
        .message {
            color: #666666;
            margin-bottom: 30px;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #f0f0f0;
            color: #999999;
            font-size: 12px;
        }
        .note {
            font-size: 14px;
            color: #888888;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Ecommerce</div>
        </div>
        <div class="content">
            <h2>Verify Your Email Address</h2>
            <p class="message">
                Thanks for signing up! Please use the verification code below to verify your email address.
            </p>
            <div class="verification-code">${verificationCode}</div>
            <p>
                If you didn't request this email, you can safely ignore it.
            </p>
            <p class="note">
                This verification code will expire in 2 minutes.
            </p>
        </div>
        <div class="footer">
            <p>© 2024 Ecommerce. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>`;
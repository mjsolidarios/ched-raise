<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Registration Confirmation</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f4f4f4; padding: 10px; text-align: center; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 12px; color: #888; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Registration Confirmation</h2>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>Thank you for registering with our service. We are excited to have you on board.</p>
            <p>Please keep this email for your records.</p>
            <p>Your ticket code is: {{ticketCode}}</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 CHED RAISE. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
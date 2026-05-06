<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email Verification</title>
</head>

<body style="font-family: Arial, sans-serif; background:#f4f6f9; padding:40px;">

    <div style="
        max-width:500px;
        margin:auto;
        background:white;
        padding:30px;
        border-radius:10px;
        text-align:center;
        box-shadow:0 4px 10px rgba(0,0,0,0.1);
    ">

        <img src="https://formbuilder.com/logo.png" alt="FormBuilder Logo" style="width:150px; margin-bottom:20px;">
        <h2 style="color:#2563EB;">Verify your email</h2>
        <p style="color:black; text-align:left;">
            Use the verification code below to continue.
        </p>

        <div style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:5px;
            margin:20px 0;
            color:#2563EB;
        ">
            {{ implode(' ', str_split($code)) }}
        </div>

        <p style="color:black; text-align:left;">
            This code will expire in a few minutes.<br>
            Thanks.<br>
            The FormBuilder Team.
        </p>
        <hr style="margin:30px 0">
        <p style="font-size:12px; color:#999; text-align:left;">
            You're receiving this email because a verification code was requested for your account. If this wasn't you, please ignore this email.
        </p>
    </div>
</body>
</html>

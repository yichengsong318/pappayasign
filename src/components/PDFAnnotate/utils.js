import $ from 'jquery';

export const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}
export const getColorFromHex = (grabbedcolor) => {
    const rgbval = hexToRgb(grabbedcolor).r + ", " + hexToRgb(grabbedcolor).g + ", " + hexToRgb(grabbedcolor).b;
    return "rgb(" + rgbval + ")";
}

export const randomString = function (len, bits) {
    bits = bits || 36;
    var outStr = "", newStr;
    while (outStr.length < len) {
        newStr = Math.random().toString(bits).slice(2);
        outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
    }
    return outStr.toUpperCase();
};

export const getGeoInfo = async () => {
    return $.getJSON('https://json.geoiplookup.io', function (data) {
        return data;
    });
}

export const signRequestEMail = (data) => {
    const logoImg = process.env.REACT_APP_BASE_URL + '/logo.png';
    const editImg = process.env.REACT_APP_BASE_URL + '/edit.png';

    const html = `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>GEMS Document Voided</title></head><body><p class="western" lang="en">&nbsp;</p>
    <center>
        <table width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td width="0%">
                        <p class="western" lang="en">&nbsp;</p>
                    </td>
                    <td width="100%">
                        <table width="640" cellspacing="0" cellpadding="10" bgcolor="#ffffff" style="border:solid 1px #cccc">
                            <tbody>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
                                    <img src="`+logoImg+`" alt="" width="280px" height="40px" />
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
                                        <center>
                                            <table width="100%" cellspacing="0" cellpadding="28" bgcolor="#c45911">
                                                <tbody>
                                                    <tr>
                                                        <td style="background: #c45911;" bgcolor="#c45911" width="100%">
                                                            <center>
                                                                <table width="100%" cellspacing="0" cellpadding="24">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="100%">
                                                                                <p class="western" align="center">
                                                                                    <img src="`+ editImg + `" alt="" width="64px" height="64px" />
                                                                                    <br />
                                                                                    <span
                                                                                        style="color: #ffffff;"><span
                                                                                            style="font-family: Helvetica, serif;"><span
                                                                                                style="font-size: medium;">GEMS sent you a document to review and sign
                                                                                            </span></span></span></p>
                                                                                            
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table width="100%" cellspacing="0" cellpadding="30">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="100%">
                                                                                <center>
                                                                                    <table width="292" cellspacing="0"
                                                                                        cellpadding="0">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td>
                                                                                                    <a href="`+ data.URL + `"
                                                                                                    style="text-decoration:none; color: #000; background: #ffc423;width:292px; height:44px; display: flex; justify-content: center; align-items: center;"
                                                                                                    bgcolor="#ffc423;"
                                                                                                    class="western"
                                                                                                        align="center">
                                                                                                        <span style="font-family: Helvetica, serif;display: flex;
                                                                                                        margin-top:10px;
                                                                                                        margin-left: 25%;">
                                                                                                            <span style="font-size: medium;">
                                                                                                                <strong>REVIEW DOCUMENT </strong>
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </a>
                                                                                                </td> 
                                                                                            </tr>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </center>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
                                        <p><span style="color: #333333;"><span style="font-family: Helvetica, serif;"><span
                                                        style="font-size: medium;">Dear `+ data.Name + `,</p>
    
                                        <p><span style="color: #333333;"><span style="font-family: Helvetica, serif;"><span
                                            style="font-size: medium;">Please Sign `+ data.DocumentName + `
                                            </p>
                                        <p class="western"><span style="color: #333333;"><span
                                                    style="font-family: Helvetica, serif;"><span
                                                        style="font-size: medium;"><br /> Thank You</span></span></span></p>
                                        <p class="western"><span style="color: #333333;"><span
                                                    style="font-family: Helvetica, serif;"><span
                                                        style="font-size: medium;"><strong>GEMS</strong></span></span></span>
                                        </p>
                                        
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
                                        
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #eaeaea;" bgcolor="#eaeaea" width="620">
                                        <p><span style="color: #666666;"><span style="font-family: Helvetica, serif;"><span
                                                        style="font-size: small;"><strong>Do Not Share This
                                                            Email</strong></span></span></span><span
                                                style="color: #666666;"><span style="font-family: Helvetica, serif;"><span
                                                        style="font-size: small;"><br /> This email contains a secure link.
                                                        Please do not share this email or link with
                                                        others.</span></span></span></p>
                                        <p><br /> </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </td>
                    <td width="0%">
                        
                    </td>
                </tr>
            </tbody>
        </table>
    </center>
    
    
    
    <p class="western"><span style="color: #999999;"><span style="font-family: Arial, serif;"><span
                    style="font-size: small;">Powered by </span></span></span><span style="color: #0000ff;"><u><a
                    href="http://www.pappaya.com/"><span style="color: #d35400;"><span
                            style="font-family: Arial, serif;"><span
                                style="font-size: small;">Pappaya</span></span></span></a></u></span><span
            style="color: #999999;"><span style="font-family: Arial, serif;"><span
                    style="font-size: small;">.</span></span></span></p>
    <p>&nbsp;</p></body></html>`;
    console.log('html', html);
    return html;
}


export const signCompletedEmail = (data) => {

    const logoImg = process.env.REACT_APP_BASE_URL + '/logo.png';
    const editImg = process.env.REACT_APP_BASE_URL + '/edit.png';

    const html = `<!doctype html><head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>GEMS Document Complted</title></head><body><p class="western" lang="en">&nbsp;</p>
    <center>
        <table width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td width="0%">
                        <p class="western" lang="en">&nbsp;</p>
                    </td>
                    <td width="100%">
                        <table width="640" cellspacing="0" cellpadding="10" bgcolor="#ffffff" style="border:solid 1px #cccc">
                            <tbody>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
                                    <img src="`+ logoImg + `" alt="" width="280px" height="40px" />
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
                                        <center>
                                            <table width="100%" cellspacing="0" cellpadding="28" bgcolor="#c45911">
                                                <tbody>
                                                    <tr>
                                                        <td style="background: #c45911;" bgcolor="#c45911" width="100%">
                                                            <center>
                                                                <table width="100%" cellspacing="0" cellpadding="24">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="100%">
                                                                                <p class="western" align="center">
                                                                                    <img src="`+ editImg + `" alt="" width="64px" height="64px" />
                                                                                    <br />
                                                                                    <span
                                                                                        style="color: #ffffff;"><span
                                                                                            style="font-family: Helvetica, serif;"><span
                                                                                                style="font-size: medium;">Your
                                                                                                document has been completed
                                                                                            </span></span></span></p>
                                                                                            
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table width="100%" cellspacing="0" cellpadding="30">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="100%">
                                                                                <center>
                                                                                    <table width="292" cellspacing="0"
                                                                                        cellpadding="0">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td>
                                                                                                    <a href="`+ data.URL + `"
                                                                                                    style="text-decoration:none; color: #000; background: #ffc423;width:292px; height:44px; display: flex; justify-content: center; align-items: center;"
                                                                                                    bgcolor="#ffc423;"
                                                                                                    class="western"
                                                                                                        align="center">
                                                                                                        <span style="font-family: Helvetica, serif;display: flex;
                                                                                                        margin-top:10px;
                                                                                                        margin-left: 2%;">
                                                                                                            <span style="font-size: medium;">
                                                                                                                <strong>COMPLETED DOCUMENT </strong>
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </a>
                                                                                                </td> 
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </center>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
                                        <p><span style="color: #333333;"><span style="font-family: Helvetica, serif;"><span
                                                        style="font-size: medium;">All signers completed
                                                    </span></span></span><span style="color: #333333;"><span
                                                    style="font-family: Helvetica, serif;">`+ data.DocumentName + `</span></p>
                                        <p class="western"><span style="color: #333333;"><span
                                                    style="font-family: Helvetica, serif;"><span
                                                        style="font-size: medium;"><br /> Thank You</span></span></span></p>
                                        <p class="western"><span style="color: #333333;"><span
                                                    style="font-family: Helvetica, serif;"><span
                                                        style="font-size: medium;"><strong>GEMS</strong></span></span></span>
                                        </p>
                                        
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
                                        
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #eaeaea;" bgcolor="#eaeaea" width="620">
                                        <p><span style="color: #666666;"><span style="font-family: Helvetica, serif;"><span
                                                        style="font-size: small;"><strong>Do Not Share This
                                                            Email</strong></span></span></span><span
                                                style="color: #666666;"><span style="font-family: Helvetica, serif;"><span
                                                        style="font-size: small;"><br /> This email contains a secure link.
                                                        Please do not share this email or link with
                                                        others.</span></span></span></p>
                                        <p><br /> </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </td>
                    <td width="0%">
                        
                    </td>
                </tr>
            </tbody>
        </table>
    </center>
    
    
    
    <p class="western"><span style="color: #999999;"><span style="font-family: Arial, serif;"><span
                    style="font-size: small;">Powered by </span></span></span><span style="color: #0000ff;"><u><a
                    href="http://www.pappaya.com/"><span style="color: #d35400;"><span
                            style="font-family: Arial, serif;"><span
                                style="font-size: small;">Pappaya</span></span></span></a></u></span><span
            style="color: #999999;"><span style="font-family: Arial, serif;"><span
                    style="font-size: small;">.</span></span></span></p>
    <p>&nbsp;</p></body></html>`;

    console.log('html', html);
    return html;
}

export const userActivationEmail = (data) => {

    const logoImg = process.env.REACT_APP_BASE_URL + '/logo.png';
    const userImg = process.env.REACT_APP_BASE_URL + '/user.png';

    const html = `<!doctype html>
    <html>
    
    <head>
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Account Activation</title>
    </head>
    <body>
    <p class="western" lang="en">&nbsp;</p>
    <center>
        <table width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td width="0%">
                        <p class="western" lang="en">&nbsp;</p>
                    </td>
                    <td width="100%">
                        <table width="640" cellspacing="0" cellpadding="10" bgcolor="#ffffff"
                            style="border:solid 1px #cccc">
                            <tbody>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620"><img src="`+ logoImg + `"
                                            alt="" width="280px" height="40px" /></td>
                                </tr>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
                                        <center>
                                            <table width="100%" cellspacing="0" cellpadding="28" bgcolor="#c45911">
                                                <tbody>
                                                    <tr>
                                                        <td style="background: #c45911;" bgcolor="#c45911" width="100%">
                                                            <center>
                                                                <table width="100%" cellspacing="0" cellpadding="24">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="100%">
                                                                                <p class="western" align="center">
                                                                                    <img src="`+ userImg + `" alt="" width="64px"
                                                                                        height="64px" />
                                                                                        <br /><br />
                                                                                    <span style="color: #ffffff;"><span
                                                                                            style="font-family: Helvetica, serif;"><span
                                                                                                style="font-size: medium;">
                                                                                                Account Activation
                                                                                            </span></span></span></p>
    
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table width="100%" cellspacing="0" cellpadding="10">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="100%">
                                                                                <center>
                                                                                    <table cellspacing="0"
                                                                                        cellpadding="0">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td>
                                                                                                <a href="#"
                                                                                                style="text-decoration:none; color: #000; background: #ffc423;width:200px; padding:20px;"
                                                                                                bgcolor="#ffc423;"
                                                                                                class="western"
                                                                                                    align="center">
                                                                                                    <span style="font-family: Helvetica, serif;">
                                                                                                        <span style="font-size: medium;">
                                                                                                            <strong>ACTIVATE</strong>
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </a>

                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </center>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
                                        <p><span style="color: #333333;"><span style="font-family: Helvetica, serif;"><span
                                                        style="font-size: medium;">Please click the 'Activate' button to finish your account activation.
                                                    </span></span></span><span style="color: #333333;"><span
                                                    style="font-family: Helvetica, serif;"></span></p>
                                        <p class="western"><span style="color: #333333;"><span
                                                    style="font-family: Helvetica, serif;"><span
                                                        style="font-size: medium;"><br /> Thank you for choosing GEMS.</span></span></span></p>
                                        <p class="western"><span style="color: #333333;"><span
                                                    style="font-family: Helvetica, serif;"></span></span>
                                        </p>
    
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
    
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #eaeaea;" bgcolor="#eaeaea" width="620">
                                        <p><span style="color: #666666;"><span style="font-family: Helvetica, serif;"><span
                                                        style="font-size: small;"><strong>Do Not Share This
                                                            Email</strong></span></span></span><span
                                                style="color: #666666;"><span style="font-family: Helvetica, serif;"><span
                                                        style="font-size: small;"><br /> This email contains a secure link.
                                                        Please do not share this email or link with
                                                        others.</span></span></span></p>
                                        <p><br /> </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
    
                    </td>
                    <td width="0%">
    
                    </td>
                </tr>
            </tbody>
        </table>
    </center>
    
    
    
    <p class="western"><span style="color: #999999;"><span style="font-family: Arial, serif;"><span
                    style="font-size: small;">Powered by </span></span></span><span style="color: #0000ff;"><u><a
                    href="http://www.pappaya.com/"><span style="color: #d35400;"><span
                            style="font-family: Arial, serif;"><span
                                style="font-size: small;">Pappaya</span></span></span></a></u></span><span
            style="color: #999999;"><span style="font-family: Arial, serif;"><span
                    style="font-size: small;">.</span></span></span></p>
    <p>&nbsp;</p>
    
    </body>
    </html>`;

    return html;
}

export const resetPasswordEmail = (data) => {

    const logoImg = process.env.REACT_APP_BASE_URL + '/logo.png';
    const lockImg = process.env.REACT_APP_BASE_URL + '/lock.png';

    const html = `<!doctype html>
    <html>
    
    <head>
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Account Activation</title>
    </head>
    <body>
    <p class="western" lang="en">&nbsp;</p>
    <center>
        <table width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td width="0%">
                        <p class="western" lang="en">&nbsp;</p>
                    </td>
                    <td width="100%">
                        <table width="640" cellspacing="0" cellpadding="10" bgcolor="#ffffff"
                            style="border:solid 1px #cccc">
                            <tbody>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620"><img src="`+ logoImg + `"
                                            alt="" width="280px" height="40px" /></td>
                                </tr>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
                                        <center>
                                            <table width="100%" cellspacing="0" cellpadding="28" bgcolor="#c45911">
                                                <tbody>
                                                    <tr>
                                                        <td style="background: #c45911;" bgcolor="#c45911" width="100%">
                                                            <center>
                                                                <table width="100%" cellspacing="0" cellpadding="24">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="100%">
                                                                                <p class="western" align="center">
                                                                                    <img src="`+ lockImg + `" alt="" width="64px"
                                                                                        height="64px" />
                                                                                        <br /><br />
                                                                                    <span style="color: #ffffff;"><span
                                                                                            style="font-family: Helvetica, serif;"><span
                                                                                                style="font-size: medium;">
                                                                                                Click the link below to reset your password.
                                                                                            </span></span></span></p>
    
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table width="100%" cellspacing="0" cellpadding="10">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="100%">
                                                                                <center>
                                                                                    <table cellspacing="0"
                                                                                        cellpadding="0">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td>
                                                                                                <a href="`+data.URL+`"
                                                                                                style="text-decoration:none; color: #000; background: #ffc423;width:300px; padding:20px;"
                                                                                                bgcolor="#ffc423;"
                                                                                                class="western"
                                                                                                    align="center">
                                                                                                    <span style="font-family: Helvetica, serif;">
                                                                                                        <span style="font-size: medium;">
                                                                                                            <strong>RESET PASSWORD</strong>
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </a>

                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </center>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </center>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
                                        <p><span style="color: #333333;"><span style="font-family: Helvetica, serif;"><span
                                                        style="font-size: medium;">Please click the 'Activate' button to finish your account activation.
                                                    </span></span></span><span style="color: #333333;"><span
                                                    style="font-family: Helvetica, serif;"></span></p>
                                        <p class="western"><span style="color: #333333;"><span
                                                    style="font-family: Helvetica, serif;"><span
                                                        style="font-size: medium;"><br /> Thank you for choosing GEMS.</span></span></span></p>
                                        <p class="western"><span style="color: #333333;"><span
                                                    style="font-family: Helvetica, serif;"></span></span>
                                        </p>
    
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #ffffff;" bgcolor="#ffffff" width="620">
    
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #eaeaea;" bgcolor="#eaeaea" width="620">
                                        <p><span style="color: #666666;"><span style="font-family: Helvetica, serif;"><span
                                                        style="font-size: small;"><strong>Do Not Share This
                                                            Email</strong></span></span></span><span
                                                style="color: #666666;"><span style="font-family: Helvetica, serif;"><span
                                                        style="font-size: small;"><br /> This email contains a secure link.
                                                        Please do not share this email or link with
                                                        others.</span></span></span></p>
                                        <p><br /> </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
    
                    </td>
                    <td width="0%">
    
                    </td>
                </tr>
            </tbody>
        </table>
    </center>
    
    
    
    <p class="western"><span style="color: #999999;"><span style="font-family: Arial, serif;"><span
                    style="font-size: small;">Powered by </span></span></span><span style="color: #0000ff;"><u><a
                    href="http://www.pappaya.com/"><span style="color: #d35400;"><span
                            style="font-family: Arial, serif;"><span
                                style="font-size: small;">Pappaya</span></span></span></a></u></span><span
            style="color: #999999;"><span style="font-family: Arial, serif;"><span
                    style="font-size: small;">.</span></span></span></p>
    <p>&nbsp;</p>
    
    </body>
    </html>`;

    return html;
}